import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/access-token';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    // Verify authentication
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = (decoded as any).userId;
    const subscription = await req.json();

    // Connect to database
    await connectDB();

    // Save subscription to user profile
    await User.findByIdAndUpdate(userId, {
      $set: {
        'pushSubscription': subscription
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscribed to push notifications' 
    });

  } catch (error) {
    console.error('Error subscribing to push:', error);
    return NextResponse.json({ 
      error: 'Failed to subscribe', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
