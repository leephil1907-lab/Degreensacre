'use client';

import Link from 'next/link';
import { BookOpen, CalendarCheck, Mail, MapPin, MessageCircle, Phone, Search, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { formatPhoneNumber, whatsappLink } from '@/lib/site-settings';

const propertyLinks = [
  { label: 'Property for sale', href: '/properties?type=sale' },
  { label: 'Property for rent', href: '/properties?type=rent' },
  { label: 'Land for sale', href: '/properties?type=land' },
  { label: 'Commercial property', href: '/properties?type=commercial' },
  { label: 'Short lets', href: '/properties?type=short-let' },
  { label: 'List a property', href: '/list-property' },
];

const resourceLinks = [
  { label: 'New developments', href: '/developments' },
  { label: 'Agencies', href: '/agencies' },
  { label: 'Agents', href: '/agents' },
  { label: 'Property insights', href: '/insights' },
  { label: 'Diaspora buyers', href: '/diaspora' },
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/contact' },
];

const locationLinks = [
  { label: 'Lagos', href: '/location/lagos' },
  { label: 'Abuja', href: '/location/abuja' },
  { label: 'Enugu', href: '/location/enugu' },
  { label: 'Uyo', href: '/location/uyo' },
  { label: 'Port Harcourt', href: '/location/port-harcourt' },
  { label: 'All locations', href: '/locations' },
];

const footerHeading = 'font-sans text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/45';
const footerLink = 'inline-flex min-h-7 items-center text-sm text-gray-400 transition-colors hover:text-white';

export default function Footer() {
  const { settings } = useSiteSettings();
  const socialLinks = [
    { label: 'Facebook', href: settings.facebook_url },
    { label: 'Instagram', href: settings.instagram_url },
    { label: 'X / Twitter', href: settings.twitter_url },
    { label: 'LinkedIn', href: settings.linkedin_url },
  ].filter((link) => link.href);

  return (
    <footer className="bg-charcoal text-white">
      <div className="border-y border-amber-300/20 bg-amber-400 text-charcoal">
        <div className="container-custom grid grid-cols-1 gap-2 py-3 sm:grid-cols-3">
          <Link href="/properties" className="flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors hover:bg-black/5"><Search className="h-4 w-4" /> Search property</Link>
          <Link href="/book-inspection" className="flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors hover:bg-black/5 sm:border-x sm:border-charcoal/15"><CalendarCheck className="h-4 w-4" /> Book an inspection</Link>
          <Link href="/insights" className="flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors hover:bg-black/5"><BookOpen className="h-4 w-4" /> Read buyer guides</Link>
        </div>
      </div>

      <div className="container-custom pb-10 pt-12 md:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-10 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4 lg:pr-8">
            <Logo size="md" onDark />
            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">{settings.tagline}</p>
            <div className="mt-5 flex max-w-sm items-start gap-2.5 text-xs leading-6 text-gray-500">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-sage-300" />
              <address className="not-italic">{settings.address}</address>
            </div>
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
              <ShieldCheck className="h-5 w-5 text-sage-300" />
              <div><p className="text-xs font-bold text-white/75">CAC Registered</p><p className="text-[10px] text-white/40">RC: 1856064</p></div>
            </div>
            {socialLinks.length > 0 && <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">{socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-gray-400 transition hover:text-white">{link.label}</a>)}</div>}
          </div>

          <nav className="lg:col-span-2" aria-label="Footer property links">
            <h2 className={footerHeading}>Properties</h2>
            <ul className="mt-4 space-y-1.5">{propertyLinks.map((link) => <li key={link.href}><Link href={link.href} className={footerLink}>{link.label}</Link></li>)}</ul>
          </nav>

          <nav className="lg:col-span-3" aria-label="Footer resource links">
            <h2 className={footerHeading}>Resources & network</h2>
            <ul className="mt-4 space-y-1.5">{resourceLinks.map((link) => <li key={link.href}><Link href={link.href} className={footerLink}>{link.label}</Link></li>)}</ul>
          </nav>

          <div className="col-span-2 lg:col-span-3">
            <h2 className={footerHeading}>Talk to our team</h2>
            <p className="mt-4 text-sm leading-6 text-gray-500">Ask about a listing, arrange an inspection or get guidance on your next step.</p>
            <div className="mt-5 space-y-3">
              <a href={whatsappLink(settings, "Hello, I'm interested in your properties")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-600/10 px-4 py-3 text-white transition-colors hover:bg-green-600/20">
                <MessageCircle className="h-5 w-5 shrink-0 text-green-400" />
                <span><span className="block text-xs text-gray-400">WhatsApp</span><span className="block break-all text-sm font-bold">+{settings.whatsapp_number}</span></span>
              </a>
              <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white transition-colors hover:bg-white/[0.07]">
                <Phone className="h-5 w-5 shrink-0 text-sage-300" />
                <span><span className="block text-xs text-gray-400">Customer support</span><span className="block text-sm font-bold">{formatPhoneNumber(settings.contact_phone)}</span></span>
              </a>
              <a href={`mailto:${settings.contact_email}`} className="flex items-start gap-2.5 px-1 py-1 text-gray-400 transition-colors hover:text-white"><Mail className="mt-0.5 h-4 w-4 shrink-0" /><span className="break-all text-xs leading-5">{settings.contact_email}</span></a>
            </div>
          </div>
        </div>

        <nav className="mt-12 border-t border-white/10 pt-8" aria-label="Popular locations">
          <h2 className={footerHeading}>Popular locations</h2>
          <div className="mt-4 flex flex-wrap gap-2">{locationLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-gray-400 transition-colors hover:border-sage/50 hover:text-white">{link.label}</Link>)}</div>
        </nav>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {settings.company_name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/sitemap" className="hover:text-white">Sitemap</Link></div>
        </div>
      </div>
    </footer>
  );
}
