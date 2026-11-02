import { Suspense } from 'react';
import VerificationPage from '@/app/components/auth/VerificationPage';

export default function VerifyEmailPage() {
  return <Suspense fallback={<p role="status">Chargement…</p>}><VerificationPage /></Suspense>;
}
