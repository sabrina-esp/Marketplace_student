// import { NextResponse } from 'next/server';
// import authService from '@/lib/services/AuthService';
// import { sendVerificationEmail } from '@/lib/services/emailService';
// import jwt from 'jsonwebtoken';

// /**
//  * POST /api/auth/register
//  * Enregistrer un nouvel utilisateur et envoyer l'email de vérification
//  */
// export async function POST(request) {
//   try {
//     console.log('🚀 Début de l\'inscription');

//     // Vérifier les variables d'environnement nécessaires
//     if (!process.env.JWT_SECRET) {
//       console.error('❌ JWT_SECRET manquant');
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Erreur de configuration serveur (JWT_SECRET manquant)' 
//         },
//         { status: 500 }
//       );
//     }

//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
//       console.error('❌ EMAIL credentials manquants');
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Erreur de configuration serveur (EMAIL credentials manquants)' 
//         },
//         { status: 500 }
//       );
//     }

//     const body = await request.json();
//     const { email, password, name } = body;

//     console.log('📝 Données reçues:', { email, name });

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

//     // Validation du format email
//     const emailRegex = /^\S+@\S+\.\S+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Format d\'email invalide' 
//         },
//         { status: 400 }
//       );
//     }

//     // Validation de la longueur du mot de passe
//     if (password.length < 6) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Le mot de passe doit contenir au moins 6 caractères' 
//         },
//         { status: 400 }
//       );
//     }

//     // Créer l'utilisateur via AuthService
//     const result = await authService.register({
//       email,
//       password,
//       name,
//     });

//     console.log('📝 Résultat de l\'enregistrement:', {
//       success: result.success,
//       email: result.user?.email
//     });

//     if (!result.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: result.message
//         },
//         { status: 400 }
//       );
//     }

//     // Générer le token de vérification
//     const verificationToken = jwt.sign(
//       { userId: result.user._id, email: result.user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     console.log('🔑 Token de vérification généré');

//     // Mettre à jour l'utilisateur avec le token
//     result.user.verificationToken = verificationToken;
//     result.user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
//     await result.user.save();

//     console.log('💾 Token sauvegardé dans la base de données');

//     // Envoyer l'email de vérification
//     try {
//       await sendVerificationEmail(email, verificationToken, name);
//       console.log('✅ Email de vérification envoyé à:', email);

//       return NextResponse.json(
//         {
//           success: true,
//           message: 'Inscription réussie ! Un email de vérification a été envoyé à votre adresse.',
//           user: {
//             email: result.user.email,
//             name: result.user.name,
//             _id: result.user._id
//           },
//           requiresVerification: true  // ✅ IMPORTANT : Toujours true
//         },
//         { status: 201 }
//       );
//     } catch (emailError) {
//       console.error('❌ Erreur envoi email:', emailError);
      
//       return NextResponse.json(
//         {
//           success: true,
//           message: 'Compte créé mais erreur d\'envoi d\'email. Veuillez contacter le support.',
//           user: {
//             email: result.user.email,
//             name: result.user.name,
//             _id: result.user._id
//           },
//           requiresVerification: true,  // ✅ IMPORTANT : Toujours true
//           emailError: emailError.message
//         },
//         { status: 201 }
//       );
//     }
//   } catch (error) {
//     console.error('❌ Erreur dans l\'API register:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Erreur serveur lors de l\'enregistrement',
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * GET /api/auth/register
//  * Vérifier que l'API fonctionne
//  */
// export async function GET() {
//   return NextResponse.json(
//     {
//       message: 'API d\'enregistrement fonctionnelle',
//       endpoint: '/api/auth/register',
//       method: 'POST',
//       requiredFields: ['email', 'password'],
//       optionalFields: ['name'],
//       envStatus: {
//         JWT_SECRET: !!process.env.JWT_SECRET,
//         EMAIL_USER: !!process.env.EMAIL_USER,
//         EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
//         NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL
//       }
//     },
//     { status: 200 }
//   );
// }
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password, name } = await request.json();

    console.log('📝 Tentative inscription:', email);

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Générer un token de vérification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      name,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false,
      isEmailVerified: false
    });

    console.log('✅ Utilisateur créé:', user.email);

    // Construire le lien de vérification
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    console.log('📧 Lien de vérification:', verificationUrl);

    // Configurer le transporteur email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
// ...existing code...

// Envoyer l'email de vérification
await transporter.sendMail({
  from: `"Marketplace" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: '✨ Vérifiez votre compte Marketplace',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }
        .icon {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .greeting {
          font-size: 24px;
          color: #333;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .name {
          color: #667eea;
          font-weight: 700;
        }
        .message {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin: 20px 0 30px;
        }
        .button {
          display: inline-block;
          padding: 16px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          transition: transform 0.3s;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
        }
        .divider {
          margin: 30px 0;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
        .link-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .link-text {
          color: #667eea;
          word-break: break-all;
          font-size: 14px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .footer-icon {
          font-size: 20px;
          margin: 0 5px;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .warning-text {
          color: #856404;
          font-size: 14px;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">🎉</div>
          <h1>Bienvenue sur Marketplace !</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Bonjour <span class="name">${name || 'cher utilisateur'}</span>,</p>
          
          <p class="message">
            Merci de vous être inscrit sur notre marketplace ! 🛍️<br>
            Nous sommes ravis de vous compter parmi nous.<br><br>
            Pour commencer votre expérience, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
          </p>
          
          <a href="${verificationUrl}" class="button">
            ✅ Vérifier mon email
          </a>
          
          <div class="divider">
            ────── ou ──────
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Copiez ce lien dans votre navigateur :
          </p>
          
          <div class="link-box">
            <a href="${verificationUrl}" class="link-text">${verificationUrl}</a>
          </div>
          
          <div class="warning">
            <p class="warning-text">
              ⏰ Ce lien expire dans <strong>24 heures</strong><br>
              🔒 Si vous n'avez pas créé de compte, ignorez cet email
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <span class="footer-icon">🛍️</span>
            <span class="footer-icon">💎</span>
            <span class="footer-icon">⭐</span>
          </p>
          <p style="margin: 0 0 5px 0; font-weight: 600;">Marketplace Team</p>
          <p style="margin: 0; color: #999; font-size: 12px;">
            © 2025 Marketplace. Tous droits réservés.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
});

// ...existing code...

    console.log('📧 Email de vérification envoyé à:', email);

    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé ! Vérifiez votre email pour activer votre compte.',
        user: {
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Erreur inscription:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de l\'inscription',
        error: error.message 
      },
      { status: 500 }
    );
  }
}