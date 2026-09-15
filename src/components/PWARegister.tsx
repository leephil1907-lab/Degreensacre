'use client';

import { useEffect, useState } from 'react';

export default function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  if (!showInstallButton || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-forest/20">
        <div className="flex items-start gap-4">
          <img
            src="/logo-icon.png"
            alt="De-Greenacres"
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="font-bold text-charcoal mb-1">Install De-Greenacres</h3>
            <p className="text-sm text-gray-600 mb-4">
              Install our app for quick access to properties and investment tools
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="btn-primary text-sm flex-1"
              >
                Install App
              </button>
              <button
                onClick={() => setShowInstallButton(false)}
                className="btn-outline text-sm px-4"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
