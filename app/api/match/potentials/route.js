import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Like from '@/lib/models/Like';
import MatchingService from '@/lib/services/MatchingService';
import jwt from 'jsonwebtoken';

/**
 * GET /api/match/potentials
 * Get potential profiles to match with (excluding already swiped)
 * Uses AI/NLP matching to sort by compatibility
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

    // Get current user's profile
    const currentUser = await User.findById(decoded.userId)
      .select('name bio subjects interests level');

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

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
    .select('name email bio avatar subjects interests level createdAt')
    .limit(50); // Get more to sort by AI

    // Use AI matching to calculate compatibility and sort
    const sortedPotentials = MatchingService.sortByCompatibility(
      {
        bio: currentUser.bio,
        subjects: currentUser.subjects,
        interests: currentUser.interests,
        level: currentUser.level
      },
      potentials.map(user => ({
        id: user._id.toString(),
        name: user.name || 'Utilisateur',
        email: user.email,
        bio: user.bio || 'Pas de bio',
        avatar: user.avatar,
        subjects: user.subjects || [],
        interests: user.interests || [],
        level: user.level || 'Beginner',
        createdAt: user.createdAt
      }))
    );

    // Return top 20 best matches
    const topMatches = sortedPotentials.slice(0, 20);

    return NextResponse.json({
      success: true,
      potentials: topMatches,
      message: '🤖 Profils triés par IA selon votre compatibilité'
    });

  } catch (error) {
    console.error('❌ Erreur potentials:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
