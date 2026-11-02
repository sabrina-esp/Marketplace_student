import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/access-token';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';


export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded: any = verifyAccessToken(token);
    await connectDB();

    const { privacyNotifications } = await request.json();

    if (typeof privacyNotifications !== 'boolean') {
      return NextResponse.json({ success: false, message: 'privacyNotifications must be a boolean' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        $set: { 
          'privacySettings.privacyNotifications': privacyNotifications 
        } 
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Privacy notifications updated successfully'
    });

  } catch (error: any) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
