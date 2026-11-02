import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/services/emailService';
import { createAuthService } from '@/lib/auth/service.mjs';

export default createAuthService({
  User, connectDB, sendVerificationEmail, sendPasswordResetEmail, jwt,
  getSecret: () => process.env.JWT_SECRET,
});
