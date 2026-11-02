import authService from '@/lib/services/AuthService';
import { authPost } from '@/lib/auth/http';

export const POST = authPost((input) => authService.resendVerificationEmail(input), 200);
