import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    
    const { token, password } = await request.json();

    console.log('[RESET] incoming token:', token);

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    // Valider la longueur du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur avec le token valide (comparaison directe)
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    console.log('[RESET] user found:', !!user);

    if (!user) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    console.log('[RESET] Resetting password for user:', user.email);

    // Réinitialiser le mot de passe
    await user.resetPassword(password);

    console.log('[RESET] Password reset successful');

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error) {
    console.error('[RESET] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
}