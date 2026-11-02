import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/auth/access-token';

/**
 * GET /api/auth/me
 * Récupérer les informations de l'utilisateur connecté
 */
export async function GET(request) {
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
    const decoded = verifyAccessToken(token);

    // Connecter à la base de données
    await connectDB();

    // Trouver l'utilisateur
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          phone: user.phone,
          bio: user.bio,
          avatar: user.avatar,
          subjects: user.subjects || [],
          interests: user.interests || [],
          level: user.level || 'Beginner',
          isVerified: user.isVerified,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { success: false, message: 'Token expiré' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}