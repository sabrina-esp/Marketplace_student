import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/access-token';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded: any = verifyAccessToken(token);
    const { profileVisibility } = await request.json();
    
    if (typeof profileVisibility !== 'boolean') {
      return NextResponse.json({ success: false, message: 'profileVisibility must be a boolean' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (!user.privacySettings) {
      user.privacySettings = {};
    }
    
    user.privacySettings.profileVisibility = profileVisibility;
    user.markModified('privacySettings');
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Privacy setting updated',
      settings: user.privacySettings
    });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
