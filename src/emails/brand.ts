import { getSiteUrl } from '../lib/site';

export const EMAIL_BRAND = {
  name: 'De-Greenacres',
  legalName: 'De-Greenacres Properties Limited',
  registration: 'RC: 1856064',
  green: '#315c49',
  muted: '#526e50',
  siteUrl: getSiteUrl(),
  supportEmail: process.env.EMAIL_REPLY_TO || 'info@degreenacresproperties.com',
  phone: process.env.NEXT_PUBLIC_PHONE || '+2348065019971',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348065019971').replace(/\D/g, ''),
};

/** Email navigation is restricted to this website, never arbitrary user URLs. */
export function emailUrl(path = '/') {
  const base = EMAIL_BRAND.siteUrl;
  try {
    const url = new URL(path, base);
    return url.origin === new URL(base).origin && !url.username && !url.password ? url.href : base;
  } catch { return base; }
}
