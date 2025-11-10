import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

/**
 * POST /api/profile/upload-avatar
 * Upload l'avatar de l'utilisateur (stockage en base64)
 */
export async function POST(request) {
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

    // Récupérer l'avatar en base64
    const { avatar } = await request.json();

    if (!avatar) {
      return NextResponse.json(
        { success: false, message: 'Avatar requis' },
        { status: 400 }
      );
    }

    // Vérifier que c'est bien une image en base64
    if (!avatar.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, message: 'Format d\'image invalide' },
        { status: 400 }
      );
    }

    // Limiter la taille (environ 1MB pour base64)
    if (avatar.length > 1.5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'L\'image est trop volumineuse (max 1MB)' },
        { status: 400 }
      );
    }

    // Mettre à jour l'avatar de l'utilisateur
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: { avatar } },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    console.log('✅ Avatar mis à jour pour:', user.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Avatar mis à jour avec succès',
        avatar: user.avatar
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur lors de l\'upload de l\'avatar:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de l\'upload de l\'avatar',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/upload-avatar
 * Supprimer l'avatar de l'utilisateur
 */
export async function DELETE(request) {
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

    // Supprimer l'avatar
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: { avatar: null } },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    console.log('✅ Avatar supprimé pour:', user.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Avatar supprimé avec succès'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'avatar:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de la suppression de l\'avatar',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
