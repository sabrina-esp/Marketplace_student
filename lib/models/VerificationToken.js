// lib/models/VerificationToken.js
import mongoose from 'mongoose';

const VerificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6
    },
    type: {
      type: String,
      enum: ['email_verification', 'password_reset'],
      default: 'email_verification'
    },
    expiresAt: {
      type: Date,
      required: true
    },
    usedAt: {
      type: Date,
      default: null
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Auto-suppression des tokens expirés (TTL Index)
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Méthode pour vérifier si le token est valide
VerificationTokenSchema.methods.isValid = function() {
  return !this.usedAt && this.expiresAt > new Date() && this.attempts < 5;
};

// Méthode pour marquer le token comme utilisé
VerificationTokenSchema.methods.markAsUsed = function() {
  this.usedAt = new Date();
  return this.save();
};

// Méthode pour incrémenter les tentatives
VerificationTokenSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

export default mongoose.models.VerificationToken || 
  mongoose.model('VerificationToken', VerificationTokenSchema);