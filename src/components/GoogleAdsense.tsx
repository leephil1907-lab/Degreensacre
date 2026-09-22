'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const ADSENSE_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || process.env.NEXT_PUBLIC_ADSENSE_ID;

/**
 * Loads the Google AdSense script once per page.
 * Place this once in layout.tsx.
 * Requires NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX set in Vercel env.
 */
export function GoogleAdsenseScript() {
  if (!ADSENSE_ID || ADSENSE_ID.includes('XXXX') || ADSENSE_ID.includes('placeholder')) {
    // Don't load script if ID is placeholder — avoid console errors in dev
    return null;
  }
  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      crossOrigin="anonymous"
    />
  );
}

interface AdUnitProps {
  /** AdSense ad slot ID (data-ad-slot) — get from AdSense dashboard after creating ad unit. If omitted, uses responsive auto ad. */
  slot?: string;
  /** Ad format: auto | horizontal | vertical | rectangle. Default auto */
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle' | 'fluid';
  /** Extra className for wrapper */
  className?: string;
  /** Inline style override */
  style?: React.CSSProperties;
  /** Test mode — adds data-adtest="on" for AdSense preview (shows empty correctly) */
  testMode?: boolean;
  /** Label shown in placeholder (dev) */
  label?: string;
}

export default function AdSense({ slot, format = 'auto', className = '', style, testMode, label }: AdUnitProps) {
  const isPlaceholder = !ADSENSE_ID || ADSENSE_ID.includes('XXXX') || ADSENSE_ID.includes('placeholder');
  const adSlot = slot || undefined;

  useEffect(() => {
    if (isPlaceholder) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense may throw if already filled or if consent not given — safe to ignore in dev
      console.debug('[AdSense] push error (expected in dev without real slot):', e);
    }
  }, [isPlaceholder, slot]);

  // Respect cookie consent — don't show personalized ads if declined
  // (AdSense will fallback to non-personalized if consent signal missing)
  // We keep placeholder visible so layout doesn't shift.

  if (isPlaceholder) {
    // Dev placeholder — shows exactly where ad will appear after ID is set
    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 py-8 px-4 text-center ${className}`}
        style={style}
      >
        <p className="text-[11px] font-bold tracking-[0.16em] text-amber-600 uppercase">Advertisement</p>
        <p className="text-sm font-semibold text-charcoal mt-1">{label || 'Google AdSense will appear here'}</p>
        <p className="text-xs text-gray-500 mt-1 max-w-md">
          Set <code className="bg-white px-1 py-0.5 rounded border text-[11px]">NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX</code> in Vercel env, then redeploy. Use your real publisher ID from adsense.google.com → Sites → Get code.
        </p>
        {adSlot && <p className="text-[11px] text-gray-400 mt-2">Slot: {adSlot} • Format: {format}</p>}
      </div>
    );
  }

  // Real AdSense unit
  // Note: For auto ads to work, you also enable Auto ads in AdSense dashboard; manual units below are additional.
  return (
    <div className={`adsense-wrapper overflow-hidden rounded-xl bg-white border border-gray-100 ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...(style || {}) }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(testMode ? { 'data-adtest': 'on' } : {})}
      />
    </div>
  );
}

// Pre-configured ad slots for common placements — easier to drop in pages
export function AdBannerHorizontal({ className = '' }: { className?: string }) {
  return (
    <AdSense
      label="Horizontal Banner — 728×90 / Responsive"
      format="horizontal"
      className={`my-8 ${className}`}
      style={{ minHeight: 90 }}
    />
  );
}

export function AdInFeed({ className = '' }: { className?: string }) {
  return (
    <AdSense
      label="In-Feed Ad — Native Responsive"
      format="fluid"
      className={`my-6 ${className}`}
      style={{ minHeight: 280 }}
    />
  );
}

export function AdRectangle({ className = '' }: { className?: string }) {
  return (
    <AdSense
      label="Rectangle — 300×250"
      format="rectangle"
      className={className}
      style={{ minHeight: 250, minWidth: 300 }}
    />
  );
}
