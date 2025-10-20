// import { NextResponse } from 'next/server';
// import authService from '@/lib/services/AuthService';

// /**
//  * POST /api/auth/signin
//  * Connecter un utilisateur (nécessite email vérifié)
//  */
// export async function POST(request) {
//   try {
//     // Récupérer les données du body
//     const body = await request.json();
//     const { email, password, rememberMe } = body;

//     // Validation basique
//     if (!email || !password) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Email et mot de passe sont requis' 
//         },
//         { status: 400 }
//       );
//     }

//     // Appeler le service d'authentification
//     const result = await authService.signIn(email, password, rememberMe);

//     console.log('🔐 Tentative de connexion:', {
//       email,
//       success: result.success,
//       requiresVerification: result.requiresVerification || false
//     });

//     // ⭐ CAS 1 : Email non vérifié - Bloquer la connexion
//     if (!result.success && result.requiresVerification) {
//       console.log('⚠️  Connexion bloquée - Email non vérifié');
      
//       return NextResponse.json(
//         {
//           success: false,
//           message: result.message,
//           requiresVerification: true,
//           email: result.email
//         },
//         { status: 403 } // 403 Forbidden
//       );
//     }

//     // ⭐ CAS 2 : Connexion réussie
//     if (result.success) {
//       console.log('✅ Connexion réussie pour:', email);
      
//       // Créer une réponse avec cookie de session
//       const response = NextResponse.json(
//         {
//           success: true,
//           message: result.message,
//           user: result.user
//         },
//         { status: 200 }
//       );

//       // Définir le cookie avec la durée appropriée
//       if (rememberMe) {
//         // Cookie longue durée (30 jours)
//         response.cookies.set('user_id', result.user.id, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           maxAge: 30 * 24 * 60 * 60, // 30 jours en secondes
//           sameSite: 'lax',
//           path: '/',
//         });
        
//         console.log('🍪 Cookie de session créé (30 jours)');
//       } else {
//         // Session cookie (expire à la fermeture du navigateur)
//         response.cookies.set('user_id', result.user.id, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           sameSite: 'lax',
//           path: '/',
//         });
        
//         console.log('🍪 Cookie de session créé (session)');
//       }

//       return response;
//     } 
    
//     // ⭐ CAS 3 : Échec de connexion (mauvais identifiants)
//     else {
//       console.log('❌ Échec de connexion:', result.message);
      
//       return NextResponse.json(
//         {
//           success: false,
//           message: result.message
//         },
//         { status: 401 } // 401 Unauthorized
//       );
//     }
//   } catch (error) {
//     console.error('❌ Erreur dans l\'API signin:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Erreur serveur lors de la connexion',
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * GET /api/auth/signin
//  * Vérifier que l'API fonctionne
//  */
// export async function GET() {
//   return NextResponse.json(
//     {
//       message: 'API de connexion fonctionnelle',
//       endpoint: '/api/auth/signin',
//       method: 'POST',
//       requiredFields: ['email', 'password'],
//       optionalFields: ['rememberMe'],
//       requirements: [
//         'L\'email doit être vérifié avant la connexion',
//         'Le mot de passe doit correspondre',
//         'Le compte doit exister'
//       ],
//       responses: {
//         200: 'Connexion réussie avec cookie de session',
//         401: 'Email ou mot de passe incorrect',
//         403: 'Email non vérifié - vérification requise',
//         400: 'Données manquantes ou invalides',
//         500: 'Erreur serveur'
//       },
//       examples: {
//         success: {
//           request: {
//             email: 'user@example.com',
//             password: 'password123',
//             rememberMe: true
//           },
//           response: {
//             success: true,
//             message: 'Connexion réussie',
//             user: {
//               id: '507f1f77bcf86cd799439011',
//               email: 'user@example.com',
//               name: 'John Doe',
//               role: 'user',
//               isEmailVerified: true
//             }
//           }
//         },
//         unverified: {
//           request: {
//             email: 'unverified@example.com',
//             password: 'password123'
//           },
//           response: {
//             success: false,
//             message: 'Veuillez vérifier votre email avant de vous connecter',
//             requiresVerification: true,
//             email: 'unverified@example.com'
//           }
//         },
//         invalid: {
//           request: {
//             email: 'user@example.com',
//             password: 'wrongpassword'
//           },
//           response: {
//             success: false,
//             message: 'Email ou mot de passe incorrect'
//           }
//         }
//       }
//     },
//     { status: 200 }
//   );
// }

// /**
//  * DELETE /api/auth/signin
//  * Déconnexion (supprimer le cookie de session)
//  */
// export async function DELETE(request) {
//   try {
//     console.log('🚪 Déconnexion demandée');
    
//     const response = NextResponse.json(
//       {
//         success: true,
//         message: 'Déconnexion réussie'
//       },
//       { status: 200 }
//     );

//     // Supprimer le cookie de session
//     response.cookies.delete('user_id');
    
//     console.log('✅ Déconnexion réussie - cookie supprimé');

//     return response;
//   } catch (error) {
//     console.error('❌ Erreur lors de la déconnexion:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Erreur lors de la déconnexion',
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

/**
 * POST /api/auth/login
 * Connecter un utilisateur et retourner ses informations + token
 */
export async function POST(request) {
  try {
    console.log('🔐 Début de la connexion');

    // Vérifier les variables d'environnement
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET manquant');
      return NextResponse.json(
        { success: false, message: 'Configuration serveur incorrecte' },
        { status: 500 }
      );
    }

    // Se connecter à MongoDB
    await connectDB();

    // Récupérer les données du body
    const { email, password } = await request.json();

    console.log('📧 Tentative de connexion pour:', email);

    // Validation des champs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Valider le format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Format email invalide' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    console.log('👤 Utilisateur trouvé:', user.email);

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect');
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    console.log('✅ Mot de passe valide');

    // Vérifier si l'email est vérifié
    if (!user.isEmailVerified) {
      console.log('⚠️ Email non vérifié');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Veuillez vérifier votre email avant de vous connecter. Consultez votre boîte mail.' 
        },
        { status: 403 }
      );
    }

    console.log('✅ Email vérifié');

    // Créer le token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token valable 7 jours
    );

    console.log('🎫 Token JWT généré');

    // Mettre à jour la dernière connexion
    user.lastLoginAt = new Date();
    await user.save();

    console.log('✅ Dernière connexion mise à jour');

    // Préparer les données utilisateur à retourner
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };

    console.log('✅ Connexion réussie pour:', user.email);

    // Retourner la réponse avec l'utilisateur et le token
    return NextResponse.json(
      {
        success: true,
        message: 'Connexion réussie',
        user: userData,
        token: token
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/`
        }
      }
    );

  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de la connexion',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}