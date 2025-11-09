import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const settingsUpdate = await request.json();
    
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
