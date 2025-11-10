import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token, verifyEmail]);

  const verifyEmail = async () => {
    try {
      const res = await fetch(`/api/auth/verify?token=${token}`);
      const data = await res.json();
      
      if (res.ok) {
        setStatus('Email verified successfully! Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setStatus(data.message || 'Verification failed');
      }
    } catch (error) {
      setStatus('An error occurred during verification');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl mb-4">Email Verification</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}