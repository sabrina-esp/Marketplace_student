import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Like from '@/lib/models/Like';
import Match from '@/lib/models/Match';
import jwt from 'jsonwebtoken';

/**
 * POST /api/match/swipe
 * Swipe right (like) or left (dislike) on a profile
 */
export async function POST(request) {
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

    const { targetUserId, action } = await request.json();

    if (!targetUserId || !['like', 'dislike'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Données invalides' },
        { status: 400 }
      );
    }

    if (targetUserId === decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Impossible de swiper sur soi-même' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already swiped
    const existing = await Like.findOne({
      from: decoded.userId,
      to: targetUserId
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Déjà swipé sur ce profil' },
        { status: 400 }
      );
    }

    // Create the like/dislike
    const like = await Like.create({
      from: decoded.userId,
      to: targetUserId,
      action: action
    });

    let isMatch = false;

    // If action is "like", check for mutual match
    if (action === 'like') {
      const reverseLike = await Like.findOne({
        from: targetUserId,
        to: decoded.userId,
        action: 'like'
      });

      if (reverseLike) {
        // It's a match!
        isMatch = true;

        // Update both likes to mutual
        await Like.updateMany(
          {
            $or: [
              { from: decoded.userId, to: targetUserId },
              { from: targetUserId, to: decoded.userId }
            ]
          },
          { $set: { mutual: true } }
        );

        // Create match record
        const users = [decoded.userId, targetUserId].sort();
        await Match.create({
          users: users
        });

        console.log('🎉 New match created!');
      }
    }

    return NextResponse.json({
      success: true,
      action: action,
      isMatch: isMatch,
      message: isMatch ? 'C\'est un match ! 🎉' : 'Swipe enregistré'
    });

  } catch (error) {
    console.error('❌ Erreur swipe:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
