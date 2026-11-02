import { connectDB } from '@/lib/db/mongodb';
import { NextResponse } from 'next/server';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  try {
    await connectDB();
    return NextResponse.json({ success: true, message: 'Database connected' });
  } catch {
    return NextResponse.json({ success: false, message: 'Database unavailable' }, { status: 503 });
  }
}
