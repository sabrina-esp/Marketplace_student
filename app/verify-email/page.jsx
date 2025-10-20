'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Vérification en cours...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Token manquant');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Email vérifié avec succès !');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Erreur de vérification');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Une erreur est survenue');
        console.error('Erreur:', error);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '48px',
        textAlign: 'center'
      }}>
        
        {/* Loading State */}
        {status === 'loading' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              border: '6px solid #f3f4f6',
              borderTop: '6px solid #7c3aed',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              Vérification en cours
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: '#6b7280'
            }}>
              {message}
            </p>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'scaleIn 0.5s ease-out'
            }}>
              <svg style={{ width: '60px', height: '60px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '12px'
            }}>
              Email vérifié ! 🎉
            </h2>
            
            <p style={{
              fontSize: '18px',
              color: '#059669',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {message}
            </p>
            
            <p style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Redirection vers la connexion dans quelques secondes...
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '24px',
              fontSize: '32px'
            }}>
              <span style={{ animation: 'bounce 1s infinite' }}>🎊</span>
              <span style={{ animation: 'bounce 1s infinite 0.1s' }}>✨</span>
              <span style={{ animation: 'bounce 1s infinite 0.2s' }}>🎉</span>
            </div>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'shake 0.5s'
            }}>
              <svg style={{ width: '60px', height: '60px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ef4444',
              marginBottom: '12px'
            }}>
              Erreur 😔
            </h2>
            
            <p style={{
              fontSize: '18px',
              color: '#dc2626',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {message}
            </p>
            
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '24px'
            }}>
              Le lien peut avoir expiré ou être invalide
            </p>
            
            <button
              onClick={() => router.push('/register')}
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
              }}
            >
              ← Retour à l'inscription
            </button>
          </>
        )}

      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          border: '6px solid rgba(255,255,255,0.3)',
          borderTop: '6px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}