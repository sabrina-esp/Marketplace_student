import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email requis'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      default: function () {
        return this.email || undefined;
      }
    },
    password: {
      type: String,
      required: [true, 'Mot de passe requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: null
    },
    bio: {
      type: String,
      trim: true,
      default: null,
      maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
    },
    avatar: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    },
    verificationTokenExpiry: {
      type: Date,
      default: null
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpiry: {
      type: Date,
      default: null
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifiedAt: {
      type: Date,
      default: null
    },
    lastLoginAt: {
      type: Date
    },
    verificationAttempts: {
      type: Number,
      default: 0
    },
    settings: {
      type: Object,
      default: {
        pushNotifications: true,
        emailNotifications: false,
        language: 'Français'
      }
    },
    privacySettings: {
      type: Object,
      default: {
        profileVisibility: true,
        privacyNotifications: false
      }
    }
  },
  {
    timestamps: true
  }
);

// Hash password avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour vérifier l'email
UserSchema.methods.verifyEmail = function() {
  this.isVerified = true;
  this.isEmailVerified = true;
  this.emailVerifiedAt = new Date();
  this.verificationAttempts = 0;
  this.verificationToken = null;
  this.verificationTokenExpiry = null;
  return this.save();
};

// Méthode pour créer un token de reset
UserSchema.methods.createResetPasswordToken = function(token, expiry) {
  this.resetPasswordToken = token;
  this.resetPasswordExpiry = expiry;
  return this.save();
};

// Méthode pour réinitialiser le mot de passe
UserSchema.methods.resetPassword = function(newPassword) {
  this.password = newPassword;
  this.resetPasswordToken = null;
  this.resetPasswordExpiry = null;
  return this.save();
};

// Ne pas retourner le mot de passe dans les requêtes
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  return obj;
};

// Export du modèle
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;