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
    password: {
      type: String,
      required: [true, 'Mot de passe requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    name: {
      type: String,
      trim: true
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
  return await bcrypt.compare(candidatePassword, this.password);
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

// Ne pas retourner le mot de passe dans les requêtes
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  return obj;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);