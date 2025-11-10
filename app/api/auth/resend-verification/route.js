import { NextResponse } from 'next/server';
import authService from '@/lib/services/AuthService';

/**
 * POST /api/auth/resend-verification
 * Renvoyer l'email de vérification à un utilisateur
 * 
 * Features:
 * - Cooldown de 1 minute entre les demandes
 * - Suppression des anciens tokens
 * - Génération d'un nouveau token et code
 * - Envoi d'un nouvel email
 * 
 * @param {Object} request - NextRequest object
 * @returns {NextResponse} Response avec status et données
 */
export async function POST(request) {
  const startTime = Date.now();
  
  try {
    // Récupérer et parser le body
    const body = await request.json();
    const { email } = body;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Demande de RENVOI d\'email de vérification');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Détails:', {
      timestamp: new Date().toISOString(),
      method: 'POST',
      email: email || 'NON FOURNI',
      hasEmail: !!email
    });

    // ⭐ VALIDATION 1 : Email requis
    if (!email) {
      console.log('❌ VALIDATION ÉCHOUÉE: Email manquant');
      
      return NextResponse.json(
        {
          success: false,
          message: 'Email requis',
          field: 'email',
          help: 'Vous devez fournir une adresse email valide',
          example: {
            email: 'user@example.com'
          }
        },
        { status: 400 }
      );
    }

    // ⭐ VALIDATION 2 : Format email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ VALIDATION ÉCHOUÉE: Format email invalide');
      console.log('📧 Email fourni:', email);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Format d\'email invalide',
          field: 'email',
          provided: email,
          expectedFormat: 'user@example.com'
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation réussie');
    console.log('🔍 Recherche de l\'utilisateur...');

    // ⭐ APPEL AU SERVICE
    const result = await authService.resendVerificationEmail(email);
    const processingTime = Date.now() - startTime;

    console.log('📊 Résultat du service:', {
      success: result.success,
      message: result.message
    });

    // ⭐ CAS 1 : SUCCÈS - Email renvoyé
    if (result.success) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ SUCCÈS - Email de vérification renvoyé !');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Destinataire:', email);
      console.log('⏱️  Temps de traitement:', processingTime + 'ms');
      console.log('📮 Un nouvel email a été envoyé avec:');
      console.log('   • Un lien de vérification cliquable');
      console.log('   • Un code à 6 chiffres');
      console.log('   • Expiration: 24 heures');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          email: email,
          sentAt: new Date().toISOString(),
          expiresIn: '24 heures',
          nextResendAvailable: new Date(Date.now() + 60000).toISOString(), // +1 minute
          processingTime: processingTime + 'ms',
          instructions: {
            step1: 'Vérifiez votre boîte mail',
            step2: 'Cliquez sur le lien OU copiez le code à 6 chiffres',
            step3: 'Complétez la vérification',
            note: 'Vérifiez aussi votre dossier spam'
          }
        },
        { status: 200 }
      );
    }
    
    // ⭐ CAS 2 : ÉCHEC - Diverses raisons
    else {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️  ÉCHEC - Impossible de renvoyer l\'email');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📝 Raison:', result.message);
      console.log('📧 Email demandé:', email);
      console.log('⏱️  Temps de traitement:', processingTime + 'ms');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Déterminer le status code approprié selon le message d'erreur
      let statusCode = 400;
      let errorType = 'VALIDATION_ERROR';
      let suggestion = null;
      
      // Cooldown actif (trop récent)
      if (result.message.includes('patienter') || result.message.includes('récemment')) {
        statusCode = 429; // Too Many Requests
        errorType = 'RATE_LIMIT';
        suggestion = 'Veuillez attendre 1 minute avant de renvoyer l\'email';
        console.log('⏱️  Type d\'erreur: RATE LIMITING (cooldown actif)');
      }
      // Utilisateur déjà vérifié
      else if (result.message.includes('déjà vérifié')) {
        statusCode = 409; // Conflict
        errorType = 'ALREADY_VERIFIED';
        suggestion = 'Vous pouvez maintenant vous connecter';
        console.log('✓ Type d\'erreur: EMAIL DÉJÀ VÉRIFIÉ');
      }
      // Utilisateur non trouvé
      else if (result.message.includes('introuvable')) {
        statusCode = 404; // Not Found
        errorType = 'USER_NOT_FOUND';
        suggestion = 'Vérifiez l\'adresse email ou créez un nouveau compte';
        console.log('🔍 Type d\'erreur: UTILISATEUR INTROUVABLE');
      }
      // Autre erreur
      else {
        errorType = 'UNKNOWN_ERROR';
        console.log('❓ Type d\'erreur: ERREUR INCONNUE');
      }
      
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errorType: errorType,
          suggestion: suggestion,
          email: email,
          processingTime: processingTime + 'ms',
          timestamp: new Date().toISOString()
        },
        { status: statusCode }
      );
    }
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('💥 ERREUR CRITIQUE dans resend-verification');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('⚠️  Type:', error.name);
    console.error('📝 Message:', error.message);
    console.error('📍 Stack:', error.stack);
    console.error('⏱️  Temps avant erreur:', processingTime + 'ms');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur serveur lors du renvoi de l\'email',
        error: process.env.NODE_ENV === 'development' ? {
          type: error.name,
          message: error.message,
          stack: error.stack
        } : 'Une erreur est survenue',
        timestamp: new Date().toISOString(),
        support: 'Si le problème persiste, contactez le support'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/resend-verification
 * Obtenir la documentation de l'API
 */
export async function GET() {
  return NextResponse.json(
    {
      name: 'Resend Email Verification API',
      version: '1.0.0',
      description: 'API pour renvoyer l\'email de vérification à un utilisateur',
      endpoint: '/api/auth/resend-verification',
      
      method: 'POST',
      contentType: 'application/json',
      authentication: 'Aucune (public)',
      
      requestBody: {
        schema: {
          email: {
            type: 'string',
            format: 'email',
            required: true,
            description: 'Adresse email de l\'utilisateur'
          }
        },
        example: {
          email: 'user@example.com'
        }
      },
      
      responses: {
        200: {
          description: 'Email de vérification renvoyé avec succès',
          schema: {
            success: true,
            message: 'Email de vérification renvoyé avec succès',
            email: 'string',
            sentAt: 'ISO 8601 date',
            expiresIn: '24 heures',
            nextResendAvailable: 'ISO 8601 date',
            processingTime: 'string (ms)',
            instructions: {
              step1: 'Vérifiez votre boîte mail',
              step2: 'Cliquez sur le lien OU copiez le code à 6 chiffres',
              step3: 'Complétez la vérification',
              note: 'Vérifiez aussi votre dossier spam'
            }
          },
          example: {
            success: true,
            message: 'Email de vérification renvoyé avec succès',
            email: 'user@example.com',
            sentAt: '2025-01-15T10:30:00.000Z',
            expiresIn: '24 heures',
            nextResendAvailable: '2025-01-15T10:31:00.000Z',
            processingTime: '145ms'
          }
        },
        
        400: {
          description: 'Requête invalide',
          reasons: [
            'Email manquant',
            'Format d\'email invalide'
          ],
          example: {
            success: false,
            message: 'Format d\'email invalide',
            errorType: 'VALIDATION_ERROR',
            email: 'invalid-email'
          }
        },
        
        404: {
          description: 'Utilisateur non trouvé',
          errorType: 'USER_NOT_FOUND',
          suggestion: 'Vérifiez l\'adresse email ou créez un nouveau compte',
          example: {
            success: false,
            message: 'Utilisateur introuvable',
            errorType: 'USER_NOT_FOUND',
            suggestion: 'Vérifiez l\'adresse email ou créez un nouveau compte'
          }
        },
        
        409: {
          description: 'Email déjà vérifié',
          errorType: 'ALREADY_VERIFIED',
          suggestion: 'Vous pouvez maintenant vous connecter',
          example: {
            success: false,
            message: 'Email déjà vérifié',
            errorType: 'ALREADY_VERIFIED',
            suggestion: 'Vous pouvez maintenant vous connecter'
          }
        },
        
        429: {
          description: 'Trop de demandes (rate limiting)',
          errorType: 'RATE_LIMIT',
          cooldown: '60 secondes',
          suggestion: 'Veuillez attendre 1 minute avant de renvoyer l\'email',
          example: {
            success: false,
            message: 'Un email a déjà été envoyé récemment. Veuillez patienter 1 minute.',
            errorType: 'RATE_LIMIT',
            suggestion: 'Veuillez attendre 1 minute avant de renvoyer l\'email'
          }
        },
        
        500: {
          description: 'Erreur serveur',
          example: {
            success: false,
            message: 'Erreur serveur lors du renvoi de l\'email',
            timestamp: '2025-01-15T10:30:00.000Z'
          }
        }
      },
      
      features: [
        'Cooldown de 1 minute entre chaque demande',
        'Suppression automatique des anciens tokens non utilisés',
        'Génération d\'un nouveau token et code à 6 chiffres',
        'Envoi d\'un nouvel email avec lien ET code',
        'Protection contre le spam',
        'Logs détaillés pour debugging',
        'Gestion d\'erreurs complète avec suggestions'
      ],
      
      rateLimiting: {
        cooldown: '60 secondes',
        reason: 'Protection contre les abus et le spam',
        enforcement: 'Basé sur l\'heure de création du dernier token',
        status: 429,
        message: 'Un email a déjà été envoyé récemment. Veuillez patienter 1 minute.'
      },
      
      security: {
        maxActiveTokens: 5,
        tokenExpiration: '24 heures',
        autoCleanup: true,
        rateLimiting: true,
        emailValidation: true
      },
      
      workflow: {
        step1: 'Réception de la requête avec email',
        step2: 'Validation du format email',
        step3: 'Vérification de l\'existence de l\'utilisateur',
        step4: 'Vérification que l\'email n\'est pas déjà vérifié',
        step5: 'Vérification du cooldown (1 minute)',
        step6: 'Suppression des anciens tokens non utilisés',
        step7: 'Génération d\'un nouveau token et code',
        step8: 'Sauvegarde en base de données',
        step9: 'Envoi de l\'email de vérification',
        step10: 'Retour de la réponse au client'
      },
      
      emailContent: {
        subject: '🔐 Vérifiez votre adresse email',
        includes: [
          'Lien de vérification cliquable',
          'Code à 6 chiffres',
          'Instructions claires',
          'Durée de validité (24h)',
          'Design responsive et moderne'
        ]
      },
      
      relatedEndpoints: [
        'POST /api/auth/register - Créer un compte (envoie automatiquement l\'email)',
        'POST /api/auth/verify-email - Vérifier l\'email avec token ou code',
        'POST /api/auth/signin - Se connecter (requiert email vérifié)'
      ],
      
      usageExamples: {
        curl: `curl -X POST http://localhost:3000/api/auth/resend-verification \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com"}'`,
        
        javascript: `
fetch('/api/auth/resend-verification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`,
        
        axios: `
import axios from 'axios';

const response = await axios.post('/api/auth/resend-verification', {
  email: 'user@example.com'
});

console.log(response.data);`
      },
      
      bestPractices: [
        'Informer l\'utilisateur du cooldown avant d\'envoyer la requête',
        'Afficher un message de succès même si l\'email n\'existe pas (sécurité)',
        'Gérer les erreurs 429 avec un compteur visuel',
        'Rediriger vers la page de vérification après succès',
        'Logger les tentatives pour détecter les abus'
      ],
      
      troubleshooting: {
        emailNotReceived: [
          'Vérifier le dossier spam',
          'Attendre 1-2 minutes (délai de livraison)',
          'Vérifier que l\'email est correct',
          'Consulter les logs serveur'
        ],
        rateLimitError: [
          'Attendre 60 secondes complètes',
          'Vérifier l\'heure du dernier envoi',
          'Ne pas spam le bouton de renvoi'
        ],
        alreadyVerified: [
          'L\'utilisateur peut maintenant se connecter',
          'Rediriger vers la page de connexion',
          'Aucune action supplémentaire nécessaire'
        ]
      },
      
      notes: [
        'Un seul token actif à la fois par utilisateur',
        'Les anciens tokens sont automatiquement supprimés',
        'Le cooldown est calculé depuis la création du dernier token',
        'L\'email contient toujours un lien ET un code',
        'Les tokens expirent après 24 heures',
        'Maximum 5 tentatives de vérification par token'
      ]
    },
    { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'X-API-Version': '1.0.0'
      }
    }
  );
}

/**
 * OPTIONS /api/auth/resend-verification
 * CORS et preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 heures
      'X-API-Version': '1.0.0'
    },
  });
}