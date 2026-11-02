'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register even when this dynamically loaded component mounts after window.load.
    const registerServiceWorker = () => {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((registration) => registration.update())
        .catch((error) => console.error('Service Worker registration failed:', error));
    };
    if ('serviceWorker' in navigator) {
      if (document.readyState === 'complete') {
        registerServiceWorker();
      } else {
        window.addEventListener('load', registerServiceWorker, { once: true });
      }
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Don't show banner immediately - wait for user interaction
      setTimeout(() => {
        const hasSeenBanner = localStorage.getItem('pwa-install-banner-seen');
        if (!hasSeenBanner) {
          setShowInstallBanner(true);
        }
      }, 5000); // Show after 5 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('load', registerServiceWorker);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('❌ User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-banner-seen', 'true');
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-banner-seen', 'true');
  };

  if (isInstalled || !showInstallBanner) {
    return null;
  }

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp">
        <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 text-white p-4 shadow-2xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <ArrowDownTrayIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                  📥 Télécharger l&apos;Application Marketplace
                </h3>
                <p className="text-sm text-green-100">
                  Accès rapide et mode hors ligne. Installez maintenant pour une meilleure expérience!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleInstallClick}
                className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
              >
                💚 Installer
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Install Instructions (if on iOS) */}
      {/iPad|iPhone|iPod/.test(navigator.userAgent) && showInstallBanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Install on iOS
              </h3>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                To install this app on your iPhone or iPad:
              </p>

              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span className="text-gray-700">
                    Tap the <strong>Share</strong> button at the bottom of your browser
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span className="text-gray-700">
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span className="text-gray-700">
                    Tap <strong>&quot;Add&quot;</strong> to install the app
                  </span>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="text-sm text-green-900">
                  <strong>💡 Astuce:</strong> Une fois installée, vous pouvez lancer l&apos;app depuis votre écran d&apos;accueil comme n&apos;importe quelle autre app!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
