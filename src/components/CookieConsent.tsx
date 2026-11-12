'use client';

import { useState, useEffect } from 'react';
import { X, Shield, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white dark:bg-charcoal-800 rounded-2xl shadow-2xl border border-cream dark:border-charcoal-700 p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="hidden sm:flex w-10 h-10 bg-forest/10 rounded-xl items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5 text-forest" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-charcoal dark:text-white mb-1">We value your privacy</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              We use cookies to improve your experience, personalize content, and analyze traffic. 
              By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
              <a href="/privacy" className="text-forest underline font-medium hover:text-forest-light">Privacy Policy</a>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:flex-shrink-0">
            <button
              onClick={decline}
              className="flex-1 rounded-lg px-4 py-2.5 text-xs font-semibold text-gray-600 transition-colors hover:text-charcoal dark:text-gray-400 dark:hover:text-white sm:flex-none"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="flex-1 rounded-lg bg-forest px-5 py-2.5 text-xs font-bold text-ivory shadow-sm transition-all hover:bg-forest-light hover:shadow-md sm:flex-none"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
