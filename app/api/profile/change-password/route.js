import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

/**
 * PUT /api/profile/change-password
 * Changer le mot de passe de l'utilisateur
 */
export async function PUT(request) {
  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Connecter à la base de données
    await connectDB();

    // Récupérer les données
    const { currentPassword, newPassword } = await request.json();

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: 'Le nouveau mot de passe doit être différent de l\'ancien' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur (avec le mot de passe)
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe actuel incorrect' },
        { status: 401 }
      );
    }

    // Hasher et sauvegarder le nouveau mot de passe
    user.password = newPassword;
    await user.save();

    console.log('✅ Mot de passe changé pour:', user.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Mot de passe changé avec succès'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur lors du changement de mot de passe:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors du changement de mot de passe',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
