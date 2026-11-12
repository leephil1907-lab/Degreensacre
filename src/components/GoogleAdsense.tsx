'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const ADSENSE_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || process.env.NEXT_PUBLIC_ADSENSE_ID;

/** True only when a real AdSense publisher ID is configured. */
export const adsenseConfigured = Boolean(ADSENSE_ID) && !ADSENSE_ID!.includes('XXXX') && !ADSENSE_ID!.includes('placeholder');

/**
 * Loads the Google AdSense script once per page.
 * Place this once in layout.tsx.
 * Requires NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX in Render Environment.
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

export default function AdSense({ slot, format = 'auto', className = '', style, testMode }: AdUnitProps) {
  const isPlaceholder = !ADSENSE_ID || ADSENSE_ID.includes('XXXX') || ADSENSE_ID.includes('placeholder');
  const adSlot = slot || undefined;

  useEffect(() => {
    if (isPlaceholder) return;
    try {
      const adsWindow = window as Window & { adsbygoogle?: Record<string, unknown>[] };
      (adsWindow.adsbygoogle ||= []).push({});
    } catch (e) {
      // AdSense may throw if already filled or if consent not given — safe to ignore in dev
      console.debug('[AdSense] push error (expected in dev without real slot):', e);
    }
  }, [isPlaceholder, slot]);

  // An unconfigured ad unit must not expose setup instructions or leave a
  // large placeholder in the public experience (including local previews).
  if (isPlaceholder) return null;

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
