'use client';

import Link from 'next/link';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { formatPhoneNumber, whatsappLink } from '@/lib/site-settings';
import {
  ArrowUp, ArrowUpRight, CalendarCheck, Compass, Globe,
  KeyRound, Mail, MapPin, MessageCircle, Phone, ShieldCheck,
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Explore Map', sub: 'Search live listings', href: '/properties', icon: Compass },
  { label: 'Book Inspection', sub: 'Escorted site visits', href: '/book-inspection', icon: CalendarCheck },
  { label: 'List Property', sub: 'Sell or rent fast', href: '/sell', icon: KeyRound },
  { label: 'Diaspora Desk', sub: 'Invest from abroad', href: '/diaspora', icon: Globe },
];

const MARKETPLACE_LINKS = [
  { label: 'Homes for Sale', href: '/properties?type=sale' },
  { label: 'Rentals & Apartments', href: '/properties?type=rent' },
  { label: 'Verified Land & Plots', href: '/land' },
  { label: 'New Developments', href: '/developments' },
  { label: 'Commercial Spaces', href: '/properties?type=commercial' },
];

const COMPANY_LINKS = [
  { label: 'Our Services', href: '/services' },
  { label: 'Agencies & Agents', href: '/agencies' },
  { label: 'Property Insights', href: '/insights' },
  { label: 'About De-Greenacres', href: '/about' },
  { label: 'Contact & Office', href: '/contact' },
];

const CITY_LINKS = [
  { label: 'Lagos', href: '/location/lagos' },
  { label: 'Abuja (FCT)', href: '/location/abuja' },
  { label: 'Uyo (Akwa Ibom)', href: '/location/uyo' },
  { label: 'Port Harcourt', href: '/location/port-harcourt' },
  { label: 'Enugu', href: '/location/enugu' },
  { label: 'All Locations', href: '/locations' },
];

export default function Footer() {
  const { settings } = useSiteSettings();
  const whatsappHref = whatsappLink(settings, 'Hello De-Greenacres, I would like to make an enquiry');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage-400/50 to-transparent" />

      {/* Top Interactive Quick-Action Strip */}
      <div className="border-b border-white/10 bg-gradient-to-r from-forest-800/80 via-charcoal to-forest-800/60">
        <div className="container-custom py-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sage-300/40 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-sage-200 transition-colors group-hover:bg-sage group-hover:text-white">
                    <action.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{action.label}</p>
                    <p className="text-[11px] text-ivory/60">{action.sub}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-ivory/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sage-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Logo size="md" onDark />
            <p className="max-w-sm text-sm leading-relaxed text-ivory/70">
              {settings.tagline}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-400/25 bg-forest/30 px-3.5 py-1.5 text-xs font-bold text-sage-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>CAC Registered · RC: 1856064</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-ivory/80 transition-all hover:border-green-500 hover:bg-green-600 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${settings.contact_email}`}
                aria-label="Email De-Greenacres"
                title="Email De-Greenacres"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-ivory/80 transition-all hover:border-sage-300 hover:bg-forest hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`tel:${settings.contact_phone}`}
                aria-label="Call De-Greenacres"
                title="Call De-Greenacres"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-ivory/80 transition-all hover:border-sage-300 hover:bg-forest hover:text-white"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </a>
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-ivory/80 transition-all hover:border-sage-300 hover:bg-forest hover:text-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-ivory/80 transition-all hover:border-sage-300 hover:bg-forest hover:text-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg>
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-ivory/80 transition-all hover:border-sage-300 hover:bg-forest hover:text-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" /></svg>
                </a>
              )}
            </div>
          </div>

          {/* Marketplace */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-300">Marketplace</h3>
            <ul className="space-y-2.5 text-sm text-ivory/75">
              {MARKETPLACE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-flex items-center gap-1 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Advisory & Platform */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-300">Platform</h3>
            <ul className="space-y-2.5 text-sm text-ivory/75">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Markets */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-300">Key Markets</h3>
            <ul className="space-y-2.5 text-sm text-ivory/75">
              {CITY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Desk */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-sage-300">Direct Desk</h3>
            <a href={`tel:${settings.contact_phone}`} className="flex items-start gap-2.5 text-sm text-ivory/80 transition-colors hover:text-white">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage-300" aria-hidden="true" />
              <span>{formatPhoneNumber(settings.contact_phone)}</span>
            </a>
            <a href={`mailto:${settings.contact_email}`} className="flex items-start gap-2.5 break-all text-sm text-ivory/80 transition-colors hover:text-white">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage-300" aria-hidden="true" />
              <span>{settings.contact_email}</span>
            </a>
            <div className="flex items-start gap-2.5 text-xs leading-relaxed text-ivory/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-300" aria-hidden="true" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Utility Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-5 text-xs text-ivory/60 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
            <span>&copy; {new Date().getFullYear()} {settings.company_name}. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="forest" />
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-ivory/80 transition hover:border-sage-300 hover:bg-forest hover:text-white"
            >
              Top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
