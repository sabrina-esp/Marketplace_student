import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Like from '@/lib/models/Like';
import jwt from 'jsonwebtoken';

/**
 * GET /api/match/potentials
 * Get potential profiles to match with (excluding already swiped)
 */
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all user IDs that current user already swiped (liked or disliked)
    const swipedLikes = await Like.find({ from: decoded.userId }).select('to');
    const swipedIds = swipedLikes.map(like => like.to.toString());
    
    // Exclude current user and already swiped users
    const potentials = await User.find({
      _id: { 
        $ne: decoded.userId,
        $nin: swipedIds
      }
    })
    .select('name email bio avatar createdAt')
    .limit(20)
    .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      potentials: potentials.map(user => ({
        id: user._id.toString(),
        name: user.name || 'Utilisateur',
        email: user.email,
        bio: user.bio || 'Pas de bio',
        avatar: user.avatar,
        createdAt: user.createdAt
      }))
    });

  } catch (error) {
    console.error('❌ Erreur potentials:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
