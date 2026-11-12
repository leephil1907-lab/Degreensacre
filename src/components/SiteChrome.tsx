'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CookieConsent from '@/components/CookieConsent';

/**
 * The storefront chrome (navigation, footer, floating widgets, cookie bar) must
 * not appear around the administration panel — the panel is a standalone
 * workspace with its own sidebar and header.
 */
function useIsAdminRoute() {
  const pathname = usePathname();
  return Boolean(pathname?.startsWith('/admin'));
}

export function PublicHeader() {
  return useIsAdminRoute() ? null : <Header />;
}

export function PublicFooter() {
  if (useIsAdminRoute()) return null;
  return (
    <>
      <Footer />
      <WhatsAppFloat />
      <CookieConsent />
    </>
  );
}
