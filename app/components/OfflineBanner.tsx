"use client";

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 z-[9999] px-4">
      <div className="mx-auto max-w-md rounded-2xl border border-yellow-200 bg-yellow-50/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3 text-sm text-yellow-900">
          <WifiOff className="h-4 w-4 flex-none" />
          <span className="font-medium">You are offline — showing cached content.</span>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;


