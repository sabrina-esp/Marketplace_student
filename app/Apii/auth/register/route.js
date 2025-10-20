import { NextResponse } from 'next/server';
import connectDB from '@/lib/services/connectDB';
import authService from '@/lib/services/AuthService';
/**
 * POST /api/auth/register
 * Enregistrer un nouvel utilisateur
 */
export async function POST(request) {
  try {
    await connectDB();
    console.log("Connecting to DB...");
    // Récupérer les données du body
    const body = await request.json();
    console.log('Données reçues pour l\'enregistrement: \n', body);
    const { email, password, name } = body;

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
    const result = await authService.register({
      email,
      password,
      name,
    });

    // Retourner la réponse appropriée
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur dans l\'API register:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur serveur lors de l\'enregistrement', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/register
 * Vérifier que l'API fonctionne
 */
export async function GET() {
  return NextResponse.json(
    { 
      message: 'API d\'enregistrement fonctionnelle',
      endpoint: '/api/auth/register',
      method: 'POST',
      requiredFields: ['email', 'password'],
      optionalFields: ['name']
    },
    { status: 200 }
  );
}