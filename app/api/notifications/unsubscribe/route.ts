import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = (decoded as any).userId;
    const { endpoint } = await req.json();

    await connectDB();

    // Remove subscription from user
    await User.findByIdAndUpdate(userId, {
      $unset: {
        'pushSubscription': ''
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Unsubscribed from push notifications' 
    });

  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json({ 
      error: 'Failed to unsubscribe', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
