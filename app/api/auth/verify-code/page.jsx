'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Page de vérification par code à 6 chiffres
 */
export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState(emailParam || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Refs pour les inputs de code
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Focus automatique sur le premier champ au chargement
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [inputRefs]);

  // Gestion du cooldown pour le renvoi
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /**
   * Gérer le changement d'un chiffre
   */
  const handleCodeChange = (index, value) => {
    // Accepter uniquement les chiffres
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(''); // Clear error on input

    // Auto-focus sur le champ suivant
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  /**
   * Gérer la touche Backspace
   */
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Si le champ est vide, revenir au champ précédent
        inputRefs[index - 1].current?.focus();
      } else {
        // Effacer le chiffre actuel
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  /**
   * Gérer le paste (coller)
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length > 0) {
      const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
      setCode(newCode);
      
      // Focus sur le dernier champ rempli
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs[lastFilledIndex].current?.focus();
    }
  };

  /**
   * Soumettre le formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const codeString = code.join('');
    
    // Validation
    if (codeString.length !== 6) {
      setError('Veuillez entrer le code complet à 6 chiffres');
      inputRefs[0].current?.focus();
      return;
    }

    if (!email) {
      setError('Email requis');
      return;
    }

    setLoading(true);

    try {
      console.log('🔢 Vérification du code:', codeString.substring(0, 2) + '****');
      
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: codeString, email })
      });

      const data = await response.json();
      
      console.log('📊 Réponse:', data);

      if (data.success) {
        setSuccess(true);
        console.log('✅ Vérification réussie');
        
        // Redirection après 2 secondes
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.message);
        setCode(['', '', '', '', '', '']);
        inputRefs[0].current?.focus();
        console.log('❌ Échec:', data.message);
      }
    } catch (error) {
      console.error('💥 Erreur:', error);
      setError('Erreur lors de la vérification. Veuillez réessayer.');
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renvoyer le code
   */
  const handleResendCode = async () => {
    if (!email) {
      setError('Email requis pour renvoyer le code');
      return;
    }

    if (resendCooldown > 0) {
      return;
    }

    setResendLoading(true);
    setResendMessage('');
    setError('');

    try {
      console.log('📧 Renvoi du code à:', email);
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      console.log('📊 Réponse renvoi:', data);

      if (data.success) {
        setResendMessage('✅ Un nouveau code a été envoyé à votre email');
        setResendCooldown(60); // 60 secondes de cooldown
        console.log('✅ Code renvoyé');
      } else {
        setError(data.message);
        console.log('❌ Échec renvoi:', data.message);
      }
    } catch (error) {
      console.error('💥 Erreur renvoi:', error);
      setError('Erreur lors du renvoi du code');
    } finally {
      setResendLoading(false);
    }
  };

  // État de succès
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            ✓ Email vérifié !
          </h2>
          
          <p className="text-gray-600 mb-4">
            Votre compte a été activé avec succès
          </p>
          
          <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Redirection vers votre tableau de bord...</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Vérifiez votre email
            </h2>
            
            <p className="text-gray-600">
              Entrez le code à 6 chiffres envoyé à votre adresse email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Champ email (si non fourni via URL) */}
            {!emailParam && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            )}

            {/* Affichage de l'email si fourni */}
            {emailParam && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Code envoyé à
                </p>
                <p className="font-medium text-gray-800">{emailParam}</p>
              </div>
            )}

            {/* Champs de code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Code de vérification
              </label>
              
              <div className="flex justify-center gap-2 mb-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : null}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
                    disabled={loading}
                    required
                  />
                ))}
              </div>

              <p className="text-xs text-center text-gray-500 mt-2">
                💡 Vous pouvez coller le code complet dans le premier champ
              </p>
            </div>

            {/* Message de renvoi */}
            {resendMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
                {resendMessage}
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Vérifier le code</span>
                </>
              )}
            </button>

            {/* Lien pour renvoyer le code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading || resendLoading || resendCooldown > 0}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-1"
              >
                {resendLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Envoi en cours...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <span>Renvoyer le code ({resendCooldown}s)</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>Renvoyer le code</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Autres options</span>
              </div>
            </div>

            {/* Liens alternatifs */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => router.push('/auth/signin')}
                className="w-full text-gray-600 hover:text-gray-800 text-sm py-2 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Retour à la connexion</span>
              </button>
            </div>
          </form>
        </div>

        {/* Aide */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            Où trouver le code ?
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Vérifiez votre boîte de réception email</li>
            <li>• Le code est dans l&apos;email de vérification</li>
            <li>• Vérifiez aussi votre dossier spam</li>
            <li>• Le code expire après 24 heures</li>
          </ul>
        </div>

        {/* Contact support */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Besoin d&apos;aide ?{' '}
            <a href="mailto:support@example.com" className="text-purple-600 hover:text-purple-800 font-medium">
              Contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}