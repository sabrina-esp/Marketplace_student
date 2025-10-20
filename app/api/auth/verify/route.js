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
export async function sendVerificationEmail(email, verificationToken, name = '') {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3011';
  // redirect to API GET so clicking the email performs the verification
  const verificationUrl = `${appUrl}/api/auth/verify?token=${encodeURIComponent(verificationToken)}`;

  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Vérification de votre compte</h2>
      <p>Bonjour ${name || ''},</p>
      <p>Cliquez sur le bouton pour vérifier votre email.</p>
      <p><a href="${verificationUrl}" style="display:inline-block;padding:10px 16px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px">Vérifier mon email</a></p>
      <p>Ou copiez ce lien dans votre navigateur:<br>${verificationUrl}</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Vérification de votre compte', html });
}