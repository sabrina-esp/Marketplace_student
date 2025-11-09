import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

/**
 * PUT /api/profile/update
 * Mettre à jour les informations du profil utilisateur
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

    // Récupérer les données à mettre à jour
    const { name, phone, bio, avatar } = await request.json();

    // Validation des données
    if (name && name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Le nom doit contenir au moins 2 caractères' },
        { status: 400 }
      );
    }

    if (phone && phone.trim().length > 0) {
      // Validation basique du téléphone (chiffres, espaces, +, -, ())
      const phoneRegex = /^[0-9\s\+\-\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { success: false, message: 'Format de téléphone invalide' },
          { status: 400 }
        );
      }
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { success: false, message: 'La bio ne peut pas dépasser 500 caractères' },
        { status: 400 }
      );
    }

    // Préparer les mises à jour
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim() || null;
    if (bio !== undefined) updates.bio = bio.trim() || null;
    if (avatar !== undefined) updates.avatar = avatar;

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    console.log('✅ Profil mis à jour pour:', user.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Profil mis à jour avec succès',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          phone: user.phone,
          bio: user.bio,
          avatar: user.avatar,
          isVerified: user.isVerified,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du profil:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de la mise à jour du profil',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
