// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db/mongodb';
// import User from '@/models/User';

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const token = searchParams.get('token');

//     console.log('🔍 Token reçu:', token);

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: 'Token manquant' },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     // Chercher l'utilisateur avec ce token
//     const user = await User.findOne({
//       verificationToken: token,
//       verificationTokenExpires: { $gt: Date.now() }
//     });

//     console.log('👤 Utilisateur trouvé:', user ? 'Oui' : 'Non');

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'Token invalide ou expiré' },
//         { status: 400 }
//       );
//     }

//     // Vérifier l'email
//     user.isEmailVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpires = undefined;
//     await user.save();

//     console.log('✅ Email vérifié pour:', user.email);

//     return NextResponse.json(
//       { success: true, message: 'Email vérifié avec succès !' },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('❌ Erreur vérification:', error);
//     return NextResponse.json(
//       { success: false, message: 'Erreur lors de la vérification', error: error.message },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log('🔍 Token reçu:', token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token manquant' },
        { status: 400 }
      );
    }

    await connectDB();

    // Chercher l'utilisateur avec ce token (pas expiré)
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    console.log('👤 Utilisateur trouvé:', user ? user.email : 'Non');

    if (!user) {
      console.log('❌ Token invalide ou expiré');
      return NextResponse.json(
        { success: false, message: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    // Utiliser la méthode verifyEmail du modèle
    await user.verifyEmail();

    console.log('✅ Email vérifié pour:', user.email);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email vérifié avec succès !',
        user: {
          email: user.email,
          name: user.name,
          isVerified: user.isVerified
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur vérification:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur est survenue lors de la vérification',
        error: error.message 
      },
      { status: 500 }
    );
  }
}