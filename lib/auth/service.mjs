import crypto from 'node:crypto';

export class AuthError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function normalizeEmail(value) {
  if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    throw new AuthError('Adresse email invalide');
  }
  return value.trim().toLowerCase();
}

function passwordInput(value) {
  if (typeof value !== 'string' || value.length < 6 || Buffer.byteLength(value, 'utf8') > 72) {
    throw new AuthError('Le mot de passe doit contenir au moins 6 caractères et au plus 72 octets');
  }
  return value;
}

function tokenInput(value) {
  if (typeof value !== 'string' || !value || value.length > 2048) {
    throw new AuthError('Lien invalide ou expiré');
  }
  return value;
}

export function publicUser(user) {
  return {
    id: user._id.toString(), email: user.email, name: user.name,
    phone: user.phone, bio: user.bio, avatar: user.avatar,
    subjects: user.subjects || [], interests: user.interests || [],
    level: user.level || 'Beginner', isVerified: user.isEmailVerified,
    isEmailVerified: user.isEmailVerified, createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

// Dependencies are injected so auth behavior can be tested without a live DB or email.
export function createAuthService({ User, connectDB, sendVerificationEmail, sendPasswordResetEmail, jwt, getSecret, now = Date.now }) {
  const secret = () => {
    const value = getSecret();
    if (!value) throw new AuthError('Configuration serveur incorrecte', 500);
    return value;
  };
  return {
    async register(input) {
      const email = normalizeEmail(input.email);
      const password = passwordInput(input.password);
      if (input.name !== undefined && (typeof input.name !== 'string' || input.name.length > 100)) {
        throw new AuthError('Nom invalide');
      }
      await connectDB();
      if (await User.findOne({ email })) throw new AuthError('Cet email est déjà utilisé', 409);
      const token = crypto.randomBytes(32).toString('hex');
      let user;
      try {
        // User's pre-save hook is the ONLY password hasher.
        user = await User.create({ email, password, name: input.name?.trim(),
          verificationToken: token, verificationTokenExpiry: new Date(now() + 86400000),
          verificationEmailSentAt: new Date(now()), isEmailVerified: false, isVerified: false });
      } catch (error) {
        if (error.code === 11000) throw new AuthError('Cet email est déjà utilisé', 409);
        throw error;
      }
      let emailSent = true;
      try { await sendVerificationEmail(email, token, user.name); }
      catch { emailSent = false; }
      return { success: true, requiresVerification: true, emailSent, user: publicUser(user),
        message: emailSent ? 'Compte créé. Consultez votre email pour vérifier votre compte.'
          : 'Compte créé, mais email non envoyé. Demandez un nouveau lien de vérification dans une minute.' };
    },

    async signIn(input) {
      const email = normalizeEmail(input.email);
      if (typeof input.password !== 'string' || !input.password) throw new AuthError('Mot de passe requis');
      const signingSecret = secret();
      await connectDB();
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(input.password))) throw new AuthError('Email ou mot de passe incorrect', 401);
      if (!user.isEmailVerified) throw new AuthError('Veuillez vérifier votre email avant de vous connecter', 403);
      user.lastLoginAt = new Date(now());
      await user.save();
      const token = jwt.sign({ userId: user._id.toString(), email: user.email }, signingSecret, { expiresIn: '7d' });
      return { success: true, token, user: publicUser(user), message: 'Connexion réussie' };
    },

    async verifyEmail(input) {
      const token = tokenInput(input.token);
      await connectDB();
      // Match the stored token and expiry, supporting already-issued opaque and JWT links.
      // Atomic consumption ensures a verification token can only be used once.
      const user = await User.findOneAndUpdate({ verificationToken: token,
        verificationTokenExpiry: { $gt: new Date(now()) } }, { $set: {
        isEmailVerified: true, isVerified: true, emailVerifiedAt: new Date(now()),
        verificationAttempts: 0, verificationToken: null, verificationTokenExpiry: null,
      } }, { new: true });
      if (!user) throw new AuthError('Lien invalide ou expiré');
      return { success: true, message: 'Email vérifié avec succès' };
    },

    async resendVerificationEmail(input) {
      const email = normalizeEmail(input.email);
      await connectDB();
      const token = crypto.randomBytes(32).toString('hex');
      const user = await User.findOneAndUpdate({ email, isEmailVerified: { $ne: true }, $or: [
        { verificationEmailSentAt: null }, { verificationEmailSentAt: { $lte: new Date(now() - 60000) } },
      ] }, { $set: { verificationToken: token, verificationTokenExpiry: new Date(now() + 86400000),
        verificationEmailSentAt: new Date(now()) } }, { new: true });
      if (user) {
        try { await sendVerificationEmail(user.email, token, user.name); }
        catch { throw new AuthError('Email non envoyé. Réessayez dans une minute.', 503); }
      }
      return { success: true, message: 'Si un compte non vérifié existe, un lien sera envoyé. Patientez une minute entre les demandes.' };
    },

    async forgotPassword(input) {
      const email = normalizeEmail(input.email);
      await connectDB();
      const user = await User.findOne({ email });
      if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        await user.createResetPasswordToken(token, new Date(now() + 3600000));
        try { await sendPasswordResetEmail(email, token); }
        catch { throw new AuthError('Email non envoyé. Veuillez réessayer.', 503); }
      }
      return { success: true, message: 'Si ce compte existe, un lien de réinitialisation sera envoyé.' };
    },

    async resetPassword(input) {
      const token = tokenInput(input.token);
      const password = passwordInput(input.password);
      await connectDB();
      // Atomic claim prevents two requests from consuming the same reset token.
      const user = await User.findOneAndUpdate({ resetPasswordToken: token,
        resetPasswordExpiry: { $gt: new Date(now()) } }, { $set: {
        resetPasswordToken: null, resetPasswordExpiry: null,
      } }, { new: true });
      if (!user) throw new AuthError('Lien invalide ou expiré');
      await user.resetPassword(password);
      return { success: true, message: 'Mot de passe réinitialisé avec succès' };
    },
  };
}
