// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';

// export default function VerifyPage() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');
//   const [status, setStatus] = useState('loading');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (!token) {
//       setStatus('error');
//       setMessage('Token de vérification manquant');
//       return;
//     }

//     // Appeler l'API de vérification
//     fetch('/api/auth/verify', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ token })
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setStatus('success');
//           setMessage(data.message);
//         } else {
//           setStatus('error');
//           setMessage(data.message);
//         }
//       })
//       .catch(error => {
//         setStatus('error');
//         setMessage('Erreur lors de la vérification');
//         console.error(error);
//       });
//   }, [token]);

//   return (
//     <div style={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       alignItems: 'center', 
//       justifyContent: 'center', 
//       minHeight: '100vh',
//       padding: '20px',
//       fontFamily: 'Arial, sans-serif'
//     }}>
//       {status === 'loading' && (
//         <>
//           <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
//           <h1>Vérification en cours...</h1>
//         </>
//       )}

//       {status === 'success' && (
//         <>
//           <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
//           <h1 style={{ color: 'green' }}>Email vérifié avec succès !</h1>
//           <p>{message}</p>
//           <a href="/login" style={{
//             marginTop: '20px',
//             padding: '10px 20px',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             textDecoration: 'none',
//             borderRadius: '5px'
//           }}>
//             Se connecter
//           </a>
//         </>
//       )}

//       {status === 'error' && (
//         <>
//           <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
//           <h1 style={{ color: 'red' }}>Erreur de vérification</h1>
//           <p>{message}</p>
//           <a href="/" style={{
//             marginTop: '20px',
//             padding: '10px 20px',
//             backgroundColor: '#2196F3',
//             color: 'white',
//             textDecoration: 'none',
//             borderRadius: '5px'
//           }}>
//             Retour à l'accueil
//           </a>
//         </>
//       )}
//     </div>
//   );
// }
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const sp = useSearchParams();
  const [state, setState] = useState(sp.get('status') || 'loading');
  const token = sp.get('token');

  useEffect(() => {
    if (state !== 'loading' || !token) return;
    fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      .then(r => r.json()).then(d => setState(d.success ? 'success' : 'error')).catch(() => setState('error'));
  }, [token, state]);

  return (
    <div style={{minHeight:'60vh',display:'grid',placeItems:'center'}}>
      {state === 'loading' && <p>Vérification en cours…</p>}
      {state === 'success' && <p>✅ Email vérifié. Vous pouvez vous connecter.</p>}
      {state === 'error' && <p>❌ Une erreur est survenue lors de la vérification.</p>}
    </div>
  );
}