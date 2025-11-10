import { NextResponse } from 'next/server';
import authService from '@/lib/services/AuthService';

/**
 * POST /api/auth/signin
 * Connecter un utilisateur
 */
export async function POST(request) {
  try {
    // Récupérer les données du body
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email et mot de passe sont requis' 
        },
        { status: 400 }
      );
    }

    // Appeler le service d'authentification
    const result = await authService.signIn(email, password, rememberMe);

    // Retourner la réponse appropriée
    if (result.success) {
      // Créer une réponse avec cookie de session
      const response = NextResponse.json(result, { status: 200 });
      
      // Si rememberMe est true, définir un cookie de longue durée
      if (rememberMe) {
        response.cookies.set('user_id', result.user.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60, // 30 jours
          sameSite: 'lax',
          path: '/',
        });
      } else {
        // Session cookie (expire à la fermeture du navigateur)
        response.cookies.set('user_id', result.user.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      }

      return response;
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error('Erreur dans l\'API signin:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur serveur lors de la connexion', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/signin
 * Vérifier que l'API fonctionne
 */
export async function GET() {
  return NextResponse.json(
    { 
      message: 'API de connexion fonctionnelle',
      endpoint: '/api/auth/signin',
      method: 'POST',
      requiredFields: ['email', 'password'],
      optionalFields: ['rememberMe']
    },
    { status: 200 }
  );
}