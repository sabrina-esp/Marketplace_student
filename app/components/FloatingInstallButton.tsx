'use client';

import { useEffect, useState } from 'react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function FloatingInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show button after a delay if user hasn't seen it
      setTimeout(() => {
        const hasSeenButton = localStorage.getItem('pwa-install-button-seen');
        if (!hasSeenButton) {
          setShowButton(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowButton(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show instructions for iOS or manual install
      setShowPopup(true);
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted install');
        setShowButton(false);
        localStorage.setItem('pwa-install-button-seen', 'true');
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install error:', error);
    }
  };

  const handleDismiss = () => {
    setShowButton(false);
    localStorage.setItem('pwa-install-button-seen', 'true');
  };

  if (isInstalled || !showButton) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 animate-bounce-slow">
        {/* Info Badge */}
        <div className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-green-600 hidden sm:block">
          Télécharger l'app! �
        </div>

        {/* Main Button */}
        <div className="relative">
          <button
            onClick={handleInstallClick}
            className="group relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center ring-4 ring-green-300/50"
            aria-label="Install App"
          >
            <ArrowDownTrayIcon className="w-8 h-8 text-white animate-bounce" />
            
            {/* Pulse Animation */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
          </button>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
            aria-label="Dismiss"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Install Instructions Popup */}
      {showPopup && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowPopup(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ArrowDownTrayIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Télécharger l'App</h3>
                  <p className="text-sm text-gray-500">Meilleure expérience</p>
                </div>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
                // iOS Instructions
                <>
                  <p className="text-gray-700">
                    To install this app on your iOS device:
                  </p>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Tap Share button</p>
                        <p className="text-sm text-gray-600">In Safari toolbar</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Select "Add to Home Screen"</p>
                        <p className="text-sm text-gray-600">Scroll down if needed</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Tap "Add"</p>
                        <p className="text-sm text-gray-600">App will be on your home screen</p>
                      </div>
                    </li>
                  </ol>
                </>
              ) : (
                // Desktop/Android Instructions
                <>
                  <p className="text-gray-700">
                    To install this app:
                  </p>
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-900">
                      <strong>💡 Installation Rapide:</strong><br />
                      Cherchez l&apos;<strong>icône d&apos;installation (⊕)</strong> dans la barre d&apos;adresse
                      (généralement à droite) et cliquez dessus!
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Disponible sur Chrome, Edge, et autres navigateurs modernes
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Compris! 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}
