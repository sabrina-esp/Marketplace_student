// // import { connectDB } from '@/lib/db/mongodb';
// // import User from '@/lib/models/User';
// // import bcrypt from 'bcryptjs';
// // import jwt from 'jsonwebtoken';

// // class AuthService {
// //   /**
// //    * Inscription d'un nouvel utilisateur
// //    */
// //   async register(userData) {
// //     try {
// //       await connectDB();

// //       const { email, password, name } = userData;

// //       // Vérifier si l'utilisateur existe déjà
// //       const existingUser = await User.findOne({ email });
// //       if (existingUser) {
// //         return {
// //           success: false,
// //           message: 'Un compte avec cet email existe déjà'
// //         };
// //       }

// //       // Créer le nouvel utilisateur
// //       const user = new User({
// //         email,
// //         password, // Le mot de passe sera hashé par le pre-save hook
// //         name,
// //         isVerified: false
// //       });

// //       await user.save();

// //       console.log('✅ Utilisateur créé:', user.email);

// //       return {
// //         success: true,
// //         message: 'Utilisateur créé avec succès',
// //         user: user // Retourner le document Mongoose complet
// //       };
// //     } catch (error) {
// //       console.error('❌ Erreur lors de l\'inscription:', error);
// //       return {
// //         success: false,
// //         message: 'Erreur lors de la création du compte',
// //         error: error.message
// //       };
// //     }
// //   }

// //   /**
// //    * Connexion d'un utilisateur
// //    */
// //   async login(email, password) {
// //     try {
// //       await connectDB();

// //       const user = await User.findOne({ email });
// //       if (!user) {
// //         return {
// //           success: false,
// //           message: 'Email ou mot de passe incorrect'
// //         };
// //       }

// //       // Vérifier si l'email est vérifié
// //       if (!user.isVerified) {
// //         return {
// //           success: false,
// //           message: 'Veuillez vérifier votre email avant de vous connecter',
// //           requiresVerification: true
// //         };
// //       }

// //       const isPasswordValid = await user.comparePassword(password);
// //       if (!isPasswordValid) {
// //         return {
// //           success: false,
// //           message: 'Email ou mot de passe incorrect'
// //         };
// //       }

// //       // Mettre à jour la dernière connexion
// //       user.lastLoginAt = new Date();
// //       await user.save();

// //       // Générer le token JWT
// //       const token = jwt.sign(
// //         { userId: user._id, email: user.email },
// //         process.env.JWT_SECRET,
// //         { expiresIn: '7d' }
// //       );

// //       return {
// //         success: true,
// //         message: 'Connexion réussie',
// //         token,
// //         user: {
// //           _id: user._id,
// //           email: user.email,
// //           name: user.name,
// //           isVerified: user.isVerified
// //         }
// //       };
// //     } catch (error) {
// //       console.error('❌ Erreur lors de la connexion:', error);
// //       return {
// //         success: false,
// //         message: 'Erreur lors de la connexion',
// //         error: error.message
// //       };
// //     }
// //   }

// //   /**
// //    * Vérifier l'email d'un utilisateur
// //    */
// //   async verifyEmail(userId, token) {
// //     try {
// //       await connectDB();

// //       const user = await User.findById(userId);
// //       if (!user) {
// //         return {
// //           success: false,
// //           message: 'Utilisateur non trouvé'
// //         };
// //       }

// //       if (user.isVerified) {
// //         return {
// //           success: true,
// //           message: 'Email déjà vérifié'
// //         };
// //       }

// //       // Vérifier le token et son expiration
// //       if (user.verificationToken !== token) {
// //         return {
// //           success: false,
// //           message: 'Token de vérification invalide'
// //         };
// //       }

// //       if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
// //         return {
// //           success: false,
// //           message: 'Token de vérification expiré'
// //         };
// //       }

// //       // Marquer l'email comme vérifié
// //       user.isVerified = true;
// //       user.isEmailVerified = true;
// //       user.emailVerifiedAt = new Date();
// //       user.verificationToken = null;
// //       user.verificationTokenExpiry = null;
// //       await user.save();

// //       return {
// //         success: true,
// //         message: 'Email vérifié avec succès'
// //       };
// //     } catch (error) {
// //       console.error('❌ Erreur lors de la vérification:', error);
// //       return {
// //         success: false,
// //         message: 'Erreur lors de la vérification',
// //         error: error.message
// //       };
// //     }
// //   }

// //   /**
// //    * Mettre à jour un utilisateur
// //    */
// //   async updateUser(userId, updates) {
// //     try {
// //       await connectDB();

// //       const user = await User.findByIdAndUpdate(
// //         userId,
// //         updates,
// //         { new: true }
// //       );

// //       if (!user) {
// //         return {
// //           success: false,
// //           message: 'Utilisateur non trouvé'
// //         };
// //       }

// //       return {
// //         success: true,
// //         user
// //       };
// //     } catch (error) {
// //       console.error('❌ Erreur lors de la mise à jour:', error);
// //       return {
// //         success: false,
// //         message: 'Erreur lors de la mise à jour',
// //         error: error.message
// //       };
// //     }
// //   }
// // }

// // export default new AuthService();
// import { connectDB } from '@/lib/db/mongodb';
// import User from '@/lib/models/User';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// class AuthService {
//   /**
//    * Inscription d'un nouvel utilisateur
//    */
//   async register(userData) {
//     try {
//       await connectDB();

//       const { email, password, name } = userData;

//       // Vérifier si l'utilisateur existe déjà
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return {
//           success: false,
//           message: 'Cet email est déjà utilisé'
//         };
//       }

//       // Hasher le mot de passe
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Créer l'utilisateur
//       const user = new User({
//         email,
//         password: hashedPassword,
//         name,
//         isEmailVerified: false,
//         verificationAttempts: 0
//       });

//       await user.save();

//       return {
//         success: true,
//         user,
//         message: 'Utilisateur créé avec succès'
//       };
//     } catch (error) {
//       console.error('❌ Erreur lors de l\'inscription:', error);
//       return {
//         success: false,
//         message: 'Erreur lors de l\'inscription'
//       };
//     }
//   }

//   /**
//    * Connexion d'un utilisateur
//    */
//   async login(email, password) {
//     try {
//       await connectDB();

//       const user = await User.findOne({ email });
//       if (!user) {
//         return {
//           success: false,
//           message: 'Email ou mot de passe incorrect'
//         };
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return {
//           success: false,
//           message: 'Email ou mot de passe incorrect'
//         };
//       }

//       if (!user.isEmailVerified) {
//         return {
//           success: false,
//           message: 'Veuillez vérifier votre email avant de vous connecter'
//         };
//       }

//       const token = jwt.sign(
//         { userId: user._id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: '7d' }
//       );

//       return {
//         success: true,
//         token,
//         user: {
//           id: user._id,
//           email: user.email,
//           name: user.name
//         }
//       };
//     } catch (error) {
//       console.error('❌ Erreur lors de la connexion:', error);
//       return {
//         success: false,
//         message: 'Erreur lors de la connexion'
//       };
//     }
//   }

//   /**
//    * Vérifier l'email d'un utilisateur
//    */
//   async verifyEmail(userId, token) {
//     try {
//       await connectDB();

//       console.log('🔍 Vérification du token:', token);

//       // Vérifier et décoder le token JWT
//       let decoded;
//       try {
//         decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('✅ Token décodé:', decoded);
//       } catch (error) {
//         console.error('❌ Token invalide ou expiré:', error.message);
//         return {
//           success: false,
//           message: 'Le lien de vérification est invalide ou a expiré'
//         };
//       }

//       // Trouver l'utilisateur par userId ou email du token
//       const user = await User.findOne({
//         $or: [
//           { _id: decoded.userId },
//           { email: decoded.email }
//         ],
//         verificationToken: token
//       });

//       if (!user) {
//         console.error('❌ Utilisateur non trouvé avec ce token');
//         return {
//           success: false,
//           message: 'Lien de vérification invalide'
//         };
//       }

//       // Vérifier si le token n'a pas expiré
//       if (user.verificationTokenExpiry && new Date() > user.verificationTokenExpiry) {
//         console.error('❌ Token expiré');
//         return {
//           success: false,
//           message: 'Le lien de vérification a expiré. Veuillez demander un nouveau lien.'
//         };
//       }

//       // Marquer l'email comme vérifié
//       user.isEmailVerified = true;
//       user.emailVerifiedAt = new Date();
//       user.verificationToken = null;
//       user.verificationTokenExpiry = null;

//       await user.save();

//       console.log('✅ Email vérifié avec succès pour:', user.email);

//       return {
//         success: true,
//         message: 'Votre email a été vérifié avec succès !'
//       };
//     } catch (error) {
//       console.error('❌ Erreur lors de la vérification:', error);
//       return {
//         success: false,
//         message: 'Une erreur est survenue lors de la vérification'
//       };
//     }
//   }

//   /**
//    * Mettre à jour un utilisateur
//    */
//   async updateUser(userId, updates) {
//     try {
//       await connectDB();

//       const user = await User.findByIdAndUpdate(
//         userId,
//         { $set: updates },
//         { new: true }
//       );

//       if (!user) {
//         return {
//           success: false,
//           message: 'Utilisateur non trouvé'
//         };
//       }

//       return {
//         success: true,
//         user
//       };
//     } catch (error) {
//       console.error('❌ Erreur lors de la mise à jour:', error);
//       return {
//         success: false,
//         message: 'Erreur lors de la mise à jour'
//       };
//     }
//   }
// }

// export default new AuthService();
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
  async register({ email, password, name }) {
    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) return { success: false, message: 'Cet email est déjà utilisé' };

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      name,
      isEmailVerified: false,
      verificationAttempts: 0
    });
    return { success: true, user };
  }

  async verifyEmail(_userId, token) {
    await connectDB();

    // decode/validate token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return { success: false, message: 'Lien invalide ou expiré' };
    }

    const user = await User.findOne({
      $or: [{ _id: decoded.userId }, { email: decoded.email }],
      verificationToken: token
    });

    if (!user) return { success: false, message: 'Lien de vérification invalide' };

    if (user.verificationTokenExpiry && new Date() > user.verificationTokenExpiry) {
      return { success: false, message: 'Lien expiré, demandez un nouveau lien' };
    }

    if (user.isEmailVerified) {
      return { success: true, message: 'Email déjà vérifié' };
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return { success: true, message: 'Email vérifié avec succès' };
  }
}

export default new AuthService();