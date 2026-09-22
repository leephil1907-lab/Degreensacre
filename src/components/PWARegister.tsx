'use client';

import { useEffect, useState } from 'react';

export default function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install prompt after a short delay, only if not already installed
      if (!isStandalone) {
        setTimeout(() => setShowInstallButton(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // App installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    // Register service worker with update handling
    if ('serviceWorker' in navigator) {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[PWA] SW registered with scope:', registration.scope);

          // Check for updates every 60s when visible
          setInterval(() => {
            if (document.visibilityState === 'visible') registration.update();
          }, 60_000);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setUpdateAvailable(true);
              }
            });
          });

          // If there's already a waiting worker (e.g. from previous load)
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setUpdateAvailable(true);
          }
        })
        .catch((error) => console.warn('[PWA] SW registration failed:', error));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] User response: ${outcome}`);
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (e) {
      console.warn('[PWA] prompt failed', e);
    }
    setShowInstallButton(false);
    setDeferredPrompt(null);
  };

  const handleUpdate = () => {
    if (!waitingWorker) return;
    waitingWorker.postMessage('SKIP_WAITING');
  };

  // Update banner takes priority
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[60] animate-fade-in">
        <div className="bg-forest text-ivory rounded-2xl shadow-2xl p-5 border border-sage/30">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage flex items-center justify-center flex-shrink-0 text-lg">↻</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm mb-1">Update available</h3>
              <p className="text-xs text-ivory/80 mb-3 leading-relaxed">A new version of De-Greenacres is ready. Reload to get the latest properties and fixes.</p>
              <div className="flex gap-2">
                <button onClick={handleUpdate} className="bg-sage hover:bg-sage-light text-white text-xs font-bold px-4 py-2.5 rounded-xl flex-1 transition-colors">Reload now</button>
                <button onClick={() => setUpdateAvailable(false)} className="border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">Later</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showInstallButton || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-forest/20">
        <div className="flex items-start gap-4">
          <img
            src="/logo-icon.png"
            alt="De-Greenacres"
            className="w-12 h-12 object-contain flex-shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-charcoal mb-1 text-sm">Install De-Greenacres App</h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Add to your home screen for instant access, offline viewing & faster property search.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-forest hover:bg-forest-light text-ivory text-xs font-bold px-4 py-2.5 rounded-xl flex-1 transition-colors"
              >
                Install App
              </button>
              <button
                onClick={() => setShowInstallButton(false)}
                className="border-2 border-forest text-forest text-xs font-semibold px-4 py-2 rounded-xl hover:bg-forest hover:text-ivory transition-colors"
              >
                Later
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 text-center">Free · No download · Works offline</p>
          </div>
          <button
            onClick={() => setShowInstallButton(false)}
            aria-label="Dismiss"
            className="text-gray-400 hover:text-charcoal p-1 -mr-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
