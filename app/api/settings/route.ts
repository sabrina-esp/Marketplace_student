import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/access-token';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded: any = verifyAccessToken(token);
    
    await connectDB();
    const user = await User.findById(decoded.userId).select('settings');
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      settings: user.settings || {
        pushNotifications: true,
        emailNotifications: false,
        language: 'Français'
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
