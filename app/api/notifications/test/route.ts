import { NextResponse } from 'next/server';
import * as webpush from 'web-push';
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

    await connectDB();
    const user = await User.findById(userId);

    if (!user || !user.pushSubscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // Send test notification
    const payload = JSON.stringify({
      title: '🎉 Test Notification',
      body: 'Your push notifications are working perfectly!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: {
        url: '/dashboard',
        timestamp: Date.now()
      }
    });

    await webpush.sendNotification(user.pushSubscription, payload);

    return NextResponse.json({ 
      success: true, 
      message: 'Test notification sent' 
    });

  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ 
      error: 'Failed to send notification', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
