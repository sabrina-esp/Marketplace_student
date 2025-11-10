import { NextResponse } from 'next/server';
import authService from '@/lib/services/AuthService';

async function handleVerify(token) {
  if (!token) {
    return NextResponse.json({ success: false, message: 'Token manquant' }, { status: 400 });
  }
  const result = await authService.verifyEmail(null, token);
  return result.success
    ? NextResponse.json({ success: true, message: 'Email vérifié' }, { status: 200 })
    : NextResponse.json({ success: false, message: result.message }, { status: 400 });
}

// GET when clicking the email link
export async function GET(request) {
  const token = request.nextUrl.searchParams.get('token');
  const res = await handleVerify(token);

  // Redirect to a friendly page
  const ok = (await res.json()).success;
  const url = new URL(request.nextUrl.origin + '/verify');
  url.searchParams.set('status', ok ? 'success' : 'error');
  return NextResponse.redirect(url.toString(), { status: 302 });
}

// POST for client-side fetch (/verify page)
export async function POST(request) {
  const { token } = await request.json();
  return handleVerify(token);
}
// ...existing code...