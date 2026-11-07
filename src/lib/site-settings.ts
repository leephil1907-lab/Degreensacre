export type SiteSettings = {
  company_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  inspection_fee: number;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  company_name: 'De-Greenacres Properties Limited',
  tagline: 'Properties, land and real-estate services across Nigeria.',
  contact_email: 'degreenacrespropertieslimited@gmail.com',
  contact_phone: '+2348065019971',
  whatsapp_number: '2347041754800',
  address: '5 Borogade Crescent, Off Okengbero Street, New Oko-Oba, Lagos, Nigeria',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  linkedin_url: '',
  inspection_fee: 20000,
};

export function normalizeWhatsappNumber(value: string) {
  return value.replace(/[^\d]/g, '');
}

export function whatsappLink(settings: SiteSettings, message: string) {
  return `https://wa.me/${normalizeWhatsappNumber(settings.whatsapp_number)}?text=${encodeURIComponent(message)}`;
}

export function formatPhoneNumber(value: string) {
  if (value.startsWith('+234') && value.length === 14) {
    return `0${value.slice(4, 7)} ${value.slice(7, 10)} ${value.slice(10)}`;
  }
  return value;
}
