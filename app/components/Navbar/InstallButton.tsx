'use client';

import { useEffect, useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
      console.log('💡 Install button ready!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Si pas de prompt disponible, montrer les instructions
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  // Ne pas afficher le bouton si déjà installé
  if (isInstalled) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleInstallClick}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md
          transition-all duration-300 transform
          ${deferredPrompt 
            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 hover:-translate-y-1' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
          }
          focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
        `}
        title={deferredPrompt ? "Install app" : "Install available in supported browsers"}
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
  <span className="hidden sm:inline text-white">Install</span>
      </button>

      {/* Tooltip pour iOS ou si pas disponible */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl z-50 animate-fadeIn">
          <p className="font-semibold mb-1">📱 Install this app:</p>
          {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
            <p className="text-xs">
              Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
            </p>
          ) : (
            <p className="text-xs">
              Click the <strong>⊕</strong> icon in your browser address bar
            </p>
          )}
          <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}
