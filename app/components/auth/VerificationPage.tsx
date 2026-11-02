'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type VerificationResult = { success: boolean; message: string };

export default function VerificationPage() {
  const token = useSearchParams().get('token');
  const requests = useRef(new Map<string, Promise<VerificationResult>>());
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification en cours…');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    let active = true;
    if (!token) {
      setStatus('error');
      setMessage('Lien de vérification manquant. Demandez un nouveau lien ci-dessous.');
      return;
    }
    setStatus('loading');
    // Reuse the request during React Strict Mode effect replay: tokens are single-use.
    if (!requests.current.has(token)) {
      requests.current.set(token, fetch('/api/auth/verify-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).then((response) => response.json()));
    }
    requests.current.get(token)!.then((result) => {
      if (active) {
        setStatus(result.success ? 'success' : 'error');
        setMessage(result.message);
      }
    }).catch(() => {
      requests.current.delete(token);
      if (active) {
        setStatus('error');
        setMessage('Connexion impossible. Veuillez réessayer.');
      }
    });
    return () => { active = false; };
  }, [token]);

  async function resend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResending(true);
    setResendMessage('');
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      setResendMessage(result.message);
    } catch {
      setResendMessage('Connexion impossible. Veuillez réessayer.');
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-purple-50 px-4 py-16">
      <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Vérification de votre email</h1>
        <p role="status" aria-live="polite" className="text-gray-700">{message}</p>
        {status === 'error' && (
          <form onSubmit={resend} className="mt-6 space-y-3">
            <label htmlFor="verification-email" className="block text-sm font-medium">Votre adresse email</label>
            <input id="verification-email" type="email" autoComplete="email" required value={email}
              onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-gray-300 p-3" />
            <button disabled={resending} className="w-full rounded-lg bg-purple-600 p-3 font-medium text-white disabled:opacity-50">
              {resending ? 'Envoi en cours…' : 'Recevoir un nouveau lien'}
            </button>
            <p role="status" className="text-sm text-gray-700">{resendMessage}</p>
          </form>
        )}
        <Link href="/" className="mt-6 inline-block font-medium text-purple-700 underline">
          {status === 'success' ? 'Retour à l’accueil pour vous connecter' : 'Retour à l’accueil'}
        </Link>
      </section>
    </main>
  );
}
