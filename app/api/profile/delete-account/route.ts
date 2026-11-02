import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/access-token';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Match from '@/lib/models/Match';
import Like from '@/lib/models/Like';


export async function DELETE(request: NextRequest) {
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

    // Hide first, then clean related data before removing the account.
    // This works with local standalone MongoDB (no transaction support).
    const deletedUser = await User.findByIdAndUpdate(decoded.userId,
      { $set: { 'privacySettings.profileVisibility': false } });

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    await Match.deleteMany({ users: decoded.userId });
    await Like.deleteMany({ $or: [{ from: decoded.userId }, { to: decoded.userId }] });
    await User.findByIdAndDelete(decoded.userId);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
