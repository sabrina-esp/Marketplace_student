import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Match from '@/lib/models/Match';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/auth/access-token';

/**
 * GET /api/match/list
 * Get all matches for the current user
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
      decoded = verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find all matches where current user is in the users array
    const matches = await Match.find({
      users: decoded.userId
    })
    .populate('users', 'name email bio avatar createdAt privacySettings')
    .sort({ createdAt: -1 });

    // Format matches to show the other user
    const formattedMatches = matches.flatMap(match => {
      const otherUser = match.users.find(
        user => user && user._id.toString() !== decoded.userId
      );

      if (!otherUser || otherUser.privacySettings?.profileVisibility === false) return [];

      return {
        matchId: match._id.toString(),
        matchedAt: match.createdAt,
        user: {
          id: otherUser._id.toString(),
          name: otherUser.name || 'Utilisateur',
          email: otherUser.email,
          bio: otherUser.bio || 'Pas de bio',
          avatar: otherUser.avatar,
          createdAt: otherUser.createdAt
        }
      };
    });

    return NextResponse.json({
      success: true,
      matches: formattedMatches,
      count: formattedMatches.length
    });

  } catch (error) {
    console.error('❌ Erreur matches list:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
