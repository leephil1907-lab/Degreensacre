'use client';

import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';

export default function LocationPermission() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('location-prompt');
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const allow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sessionStorage.setItem('user-lat', String(pos.coords.latitude));
          sessionStorage.setItem('user-lng', String(pos.coords.longitude));
          sessionStorage.setItem('location-prompt', 'granted');
          setShow(false);
        },
        () => {
          sessionStorage.setItem('location-prompt', 'denied');
          setShow(false);
        }
      );
    }
  };

  const dismiss = () => {
    sessionStorage.setItem('location-prompt', 'dismissed');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-24 right-4 z-[90] max-w-sm animate-fade-in">
      <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-2xl border border-cream dark:border-charcoal-700 p-5">
        <button onClick={dismiss} className="absolute top-3 right-3 text-gray-400 hover:text-charcoal">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-sage/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-sage" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal dark:text-white mb-1">Find properties near you?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Allow location access to see properties in your area.
            </p>
            <div className="flex gap-2">
              <button
                onClick={dismiss}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-charcoal transition-colors"
              >
                Not now
              </button>
              <button
                onClick={allow}
                className="px-4 py-1.5 bg-forest text-ivory text-xs font-bold rounded-lg hover:bg-forest-light transition-all"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
