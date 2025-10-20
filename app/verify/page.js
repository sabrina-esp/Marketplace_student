'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('⏳ Vérification en cours...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('❌ Token de vérification manquant');
      setIsLoading(false);
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/auth/verify?token=${token}`);
      const data = await res.json();
      
      if (data.success) {
        setStatus('✅ ' + data.message);
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('❌ ' + data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
      setStatus('❌ Une erreur est survenue lors de la vérification');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-fade-in">
        <div className="mb-6">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
          ) : isSuccess ? (
            <div className="text-7xl mb-4 animate-bounce">✅</div>
          ) : (
            <div className="text-7xl mb-4">❌</div>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Vérification Email
        </h1>
        
        <div className={`text-lg mb-6 p-4 rounded-lg ${
          isSuccess 
            ? 'bg-green-100 text-green-800' 
            : isLoading 
            ? 'bg-blue-100 text-blue-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </div>
        
        {isSuccess && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Redirection vers la page de connexion dans 3 secondes...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-progress" style={{width: '100%'}}></div>
            </div>
          </div>
        )}
        
        {!isSuccess && !isLoading && !token && (
          <button
            onClick={() => router.push('/register')}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            Retour à l'inscription
          </button>
        )}

        {!isSuccess && !isLoading && token && (
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Aller à la connexion
            </button>
            <button
              onClick={() => router.push('/register')}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer un nouveau compte
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-progress {
          animation: progress 3s linear;
        }
      `}</style>
    </div>
  );
}