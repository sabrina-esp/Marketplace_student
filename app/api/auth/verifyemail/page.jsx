'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Composant principal de vérification d'email
 * Cette page est appelée quand l'utilisateur clique sur le lien dans l'email
 */
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      verifyEmailWithToken(token);
    } else {
      setStatus('error');
      setMessage('Token de vérification manquant dans l\'URL');
    }
<<<<<<< HEAD
  }, [token]);
=======
  }, [token, verifyEmailWithToken]);
>>>>>>> origin/elyess

  /**
   * Vérifier l'email avec le token
   */
  const verifyEmailWithToken = async (token) => {
    try {
      console.log('🔗 Vérification en cours avec le token...');
      
      const response = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: 'GET',
        credentials: 'include' // Important pour les cookies
      });

      const data = await response.json();
      
      console.log('📊 Réponse:', data);

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setUserData(data.user);
        
        console.log('✅ Vérification réussie');
        
        // Rediriger vers le dashboard après 3 secondes
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message);
        console.log('❌ Échec:', data.message);
      }
    } catch (error) {
      console.error('💥 Erreur:', error);
      setStatus('error');
      setMessage('Erreur lors de la vérification. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              {/* Spinner animé */}
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-purple-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Vérification en cours...
              </h2>
              
              <p className="text-gray-600 mb-4">
                Veuillez patienter pendant que nous vérifions votre email.
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                </svg>
                <span>Cela ne prend que quelques secondes</span>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              {/* Icône de succès animée */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                🎉 Email vérifié !
              </h2>
              
              <p className="text-gray-600 mb-6 text-lg">
                {message}
              </p>

              {userData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-green-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-medium">{userData.name || userData.email}</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Compte activé avec succès
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span>Redirection vers votre tableau de bord...</span>
                </p>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium underline"
                >
                  Accéder maintenant
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              {/* Icône d'erreur */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Erreur de vérification
              </h2>
              
              <p className="text-gray-600 mb-6">
                {message}
              </p>

              {/* Suggestions selon le type d'erreur */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  Que faire ?
                </h3>
                <ul className="text-sm text-yellow-800 space-y-2">
                  {message.includes('expiré') && (
                    <>
                      <li>• Le lien a expiré (24h maximum)</li>
                      <li>• Demandez un nouveau lien de vérification</li>
                    </>
                  )}
                  {message.includes('invalide') && (
                    <>
                      <li>• Le lien est incorrect ou corrompu</li>
                      <li>• Vérifiez que vous avez copié le lien complet</li>
                    </>
                  )}
                  {message.includes('déjà vérifié') && (
                    <>
                      <li>• Votre email est déjà vérifié ✓</li>
                      <li>• Vous pouvez vous connecter normalement</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="space-y-3">
                {/* Boutons d'action */}
                {!message.includes('déjà vérifié') && (
                  <button
                    onClick={() => router.push(`/auth/verification-pending?email=${userData?.email || ''}`)}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
<<<<<<< HEAD
                    <span>Renvoyer l'email</span>
=======
                    <span>Renvoyer l&apos;email</span>
>>>>>>> origin/elyess
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  {message.includes('déjà vérifié') ? 'Se connecter' : 'Retour à la connexion'}
                </button>
                
                <button
                  onClick={() => router.push('/auth/verify-code')}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Ou saisir le code manuellement →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info supplémentaire */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
<<<<<<< HEAD
            Besoin d'aide ?{' '}
=======
            Besoin d&apos;aide ?{' '}
>>>>>>> origin/elyess
            <a href="mailto:support@example.com" className="text-purple-600 hover:text-purple-800 font-medium">
              Contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Page principale avec Suspense
 */
export default function VerifyEmailPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}