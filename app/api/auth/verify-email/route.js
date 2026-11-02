import authService from '@/lib/services/AuthService';
import { authPost } from '@/lib/auth/http';

export const POST = authPost((input) => authService.verifyEmail(input));

// Compatibility for previously issued links and clients. Always returns JSON.
export async function GET(request) {
  return POST(new Request(request.url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: new URL(request.url).searchParams.get('token') }),
  }));
}
