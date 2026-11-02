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
    const settingsUpdate = await request.json();
    
    const allowed = ['pushNotifications', 'emailNotifications', 'language'];
    if (!settingsUpdate || typeof settingsUpdate !== 'object' || Array.isArray(settingsUpdate) ||
        Object.entries(settingsUpdate).some(([key, value]) => !allowed.includes(key) ||
          (key === 'language' ? typeof value !== 'string' || value.length > 50 : typeof value !== 'boolean'))) {
      return NextResponse.json({ success: false, message: 'Invalid settings' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (!user.settings) {
      user.settings = {};
    }
    
    // Update settings
    Object.keys(settingsUpdate).forEach(key => {
      user.settings[key] = settingsUpdate[key];
    });
    
    user.markModified('settings');
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Settings updated',
      settings: user.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
