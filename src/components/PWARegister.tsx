'use client';

import { useEffect, useState } from 'react';

const INSTALL_SNOOZE_KEY = 'degreenacres-install-snoozed-until';
const UPDATE_SNOOZE_KEY = 'degreenacres-update-snoozed-until';

function isSnoozed(key: string) {
  try { return Number(localStorage.getItem(key) || 0) > Date.now(); } catch { return true; }
}

function hasCookieChoice() {
  try { return Boolean(localStorage.getItem('cookie-consent')); } catch { return false; }
}

function snooze(key: string, days: number) {
  try { localStorage.setItem(key, String(Date.now() + days * 86400000)); } catch { /* Storage may be blocked. */ }
}

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

    let installTimer: ReturnType<typeof setTimeout> | undefined;
    let updateTimer: ReturnType<typeof setInterval> | undefined;
    const showAfterEngagement = () => {
      removeEngagementListeners();
      installTimer = setTimeout(() => {
        if (hasCookieChoice() && !isSnoozed(INSTALL_SNOOZE_KEY)) setShowInstallButton(true);
      }, 12000);
    };
    const removeEngagementListeners = () => {
      window.removeEventListener('pointerdown', showAfterEngagement);
      window.removeEventListener('scroll', showAfterEngagement);
      window.removeEventListener('keydown', showAfterEngagement);
    };

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait for consent and meaningful engagement before suggesting installation.
      if (!isStandalone && !isSnoozed(INSTALL_SNOOZE_KEY)) {
        window.addEventListener('pointerdown', showAfterEngagement, { once: true, passive: true });
        window.addEventListener('scroll', showAfterEngagement, { once: true, passive: true });
        window.addEventListener('keydown', showAfterEngagement, { once: true });
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // App installed event
    const onInstalled = () => {
      removeEngagementListeners();
      clearTimeout(installTimer);
      console.log('[PWA] App installed');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', onInstalled);

    // Register the offline worker only in production. Development requests must
    // always reach Next.js directly so hot reload and API tests are reliable.
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
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
          updateTimer = setInterval(() => {
            if (document.visibilityState === 'visible') registration.update();
          }, 60_000);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setUpdateAvailable(!isSnoozed(UPDATE_SNOOZE_KEY));
              }
            });
          });

          // If there's already a waiting worker (e.g. from previous load)
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setUpdateAvailable(!isSnoozed(UPDATE_SNOOZE_KEY));
          }
        })
        .catch((error) => console.warn('[PWA] SW registration failed:', error));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
      removeEngagementListeners();
      clearTimeout(installTimer);
      clearInterval(updateTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] User response: ${outcome}`);
      if (outcome === 'accepted') {
        setIsInstalled(true);
      } else {
        snooze(INSTALL_SNOOZE_KEY, 30);
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
                <button onClick={() => { snooze(UPDATE_SNOOZE_KEY, 1); setUpdateAvailable(false); }} className="border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">Later</button>
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
              Add to your home screen for instant access, quick access to property search. Live listings and account actions need internet.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-forest hover:bg-forest-light text-ivory text-xs font-bold px-4 py-2.5 rounded-xl flex-1 transition-colors"
              >
                Install App
              </button>
              <button
                onClick={() => { snooze(INSTALL_SNOOZE_KEY, 30); setShowInstallButton(false); }}
                className="border-2 border-forest text-forest text-xs font-semibold px-4 py-2 rounded-xl hover:bg-forest hover:text-ivory transition-colors"
              >
                Later
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 text-center">Optional · Browse without installing</p>
          </div>
          <button
            onClick={() => { snooze(INSTALL_SNOOZE_KEY, 30); setShowInstallButton(false); }}
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
