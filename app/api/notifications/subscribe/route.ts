import { NextResponse } from 'next/server';
import * as webpush from 'web-push';
import * as jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

// Configure web-push with VAPID keys
// Generate keys with: npx web-push generate-vapid-keys
webpush.setVapidDetails(
  'mailto:karouielyess@gmail.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function POST(req: Request) {
  try {
    // Verify authentication
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
