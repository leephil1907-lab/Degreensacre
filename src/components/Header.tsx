'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen, Building2, CalendarCheck, ChevronDown, Compass, Globe,
  Menu, MessageCircle, Phone, Search, ShieldCheck, Users, X,
} from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { formatPhoneNumber, whatsappLink } from '@/lib/site-settings';

const primaryNav = [
  { label: 'Buy', href: '/properties?type=sale' },
  { label: 'Rent', href: '/properties?type=rent' },
  { label: 'Land', href: '/land' },
  { label: 'Developments', href: '/developments' },
  { label: 'Services', href: '/services' },
];

const mobilePropertyNav = [
  { label: 'BUY', href: '/properties?type=sale' },
  { label: 'RENT', href: '/properties?type=rent' },
  { label: 'LAND', href: '/land' },
  { label: 'COMMERCIAL', href: '/properties?type=commercial' },
];

const exploreNav = [
  { label: 'Interactive property map', href: '/properties', description: 'Filter & explore verified listings across Nigeria', icon: Compass },
  { label: 'Browse locations', href: '/locations', description: 'Lagos, Abuja, Uyo, Port Harcourt & Enugu', icon: Building2 },
  { label: 'Invest from abroad', href: '/diaspora', description: 'Guidance & live FX tools for diaspora buyers', icon: Globe },
  { label: 'Agencies & agents', href: '/agencies', description: 'Connect with verified property professionals', icon: Users },
  { label: 'Book an inspection', href: '/book-inspection', description: 'Schedule a guided physical property visit', icon: CalendarCheck },
  { label: 'Property insights', href: '/insights', description: 'Buying, renting & title documentation guides', icon: BookOpen },
  { label: 'All services', href: '/services', description: 'Valuations, management & advisory', icon: ShieldCheck },
];

export default function Header() {
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const [exploreMenuPath, setExploreMenuPath] = useState<string | null>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { user, profile, loading, signOut } = useAuth();
  const { settings } = useSiteSettings();
  const whatsappHref = whatsappLink(settings, "Hello, I'm interested in your properties");

  const mobileMenuOpen = mobileMenuPath === pathname;
  const exploreOpen = exploreMenuPath === pathname;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuPath(null);
        setExploreMenuPath(null);
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) setExploreMenuPath(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  const closeMobile = () => setMobileMenuPath(null);
  const isCurrent = (href: string) => !href.includes('?') && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-[70] border-b border-forest/10 bg-white/95 shadow-soft backdrop-blur-xl transition-colors dark:bg-charcoal/95">
      <div className="bg-forest text-xs text-ivory">
        <div className="container-custom flex min-h-10 items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-bold tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              RC: 1856064
            </span>
            <span className="hidden text-ivory/30 sm:inline" aria-hidden="true">|</span>
            <span className="hidden text-ivory/75 sm:inline">CAC Registered Real Estate Platform</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="hidden xl:block"><ThemeToggle variant="forest" /></div>
            <a href={`tel:${settings.contact_phone}`} className="hidden items-center gap-1.5 text-ivory/80 transition-colors hover:text-white sm:flex">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{formatPhoneNumber(settings.contact_phone)}</span>
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 font-bold text-white transition-colors hover:bg-green-500">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="container-custom relative" aria-label="Main navigation">
        <div className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
          <div className="shrink-0"><Logo size="md" /></div>

          <div className="hidden items-center justify-center gap-1 lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                className={`rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all hover:bg-sage/10 hover:text-forest dark:text-gray-100 dark:hover:bg-white/10 ${
                  isCurrent(item.href) ? 'bg-sage/15 text-forest' : 'text-charcoal'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative" ref={exploreRef}>
              <button
                type="button"
                onClick={() => setExploreMenuPath((open) => (open === pathname ? null : pathname))}
                aria-expanded={exploreOpen}
                aria-controls="explore-menu"
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all hover:bg-sage/10 hover:text-forest dark:text-gray-100 dark:hover:bg-white/10 ${
                  exploreOpen ? 'bg-sage/15 text-forest' : 'text-charcoal'
                }`}
              >
                Explore <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    id="explore-menu"
                    initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
                    className="absolute left-1/2 top-[calc(100%+0.75rem)] w-[22rem] -translate-x-1/2 rounded-2xl border border-forest/10 bg-white p-2 shadow-2xl dark:bg-charcoal"
                  >
                    {exploreNav.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setExploreMenuPath(null)}
                        className="group flex items-start gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-forest-50 dark:hover:bg-white/5"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                          <item.icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-charcoal dark:text-white">{item.label}</span>
                          <span className="mt-0.5 block text-xs leading-4 text-gray-500 dark:text-gray-400">{item.description}</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/about"
              aria-current={pathname.startsWith('/about') ? 'page' : undefined}
              className={`rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all hover:bg-sage/10 hover:text-forest dark:text-gray-100 dark:hover:bg-white/10 ${
                pathname.startsWith('/about') ? 'bg-sage/15 text-forest' : 'text-charcoal'
              }`}
            >
              About
            </Link>
          </div>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {!loading && user ? (
              <>
                {profile?.is_admin && (
                  <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-forest/10 px-3 py-2 text-xs font-extrabold text-forest transition-colors hover:bg-forest hover:text-white">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-charcoal transition-colors hover:text-forest dark:text-white">
                  {profile?.first_name ? `Hi, ${profile.first_name}` : 'Dashboard'}
                </Link>
                <button type="button" onClick={() => signOut()} className="rounded-lg px-2 py-2 text-xs font-semibold text-gray-500 transition-colors hover:text-charcoal dark:hover:text-white">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/signin" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-charcoal transition-colors hover:bg-gray-100 hover:text-forest dark:text-white dark:hover:bg-white/10">Sign in</Link>
                <Link href="/signup" className="whitespace-nowrap rounded-lg border border-forest/20 px-3 py-2 text-sm font-bold text-forest transition-colors hover:bg-forest-50 dark:border-white/20 dark:text-white">Join</Link>
              </>
            )}
            <Link href="/sell" className="btn-primary whitespace-nowrap !rounded-xl !px-4 !py-2.5 text-sm">List property</Link>
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <ThemeToggle />
            <button type="button" onClick={() => setMobileMenuPath((open) => (open === pathname ? null : pathname))} className="grid h-11 w-11 place-items-center rounded-xl text-charcoal transition-colors hover:bg-ivory dark:text-white dark:hover:bg-gray-800" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-navigation" className="absolute inset-x-0 top-full z-[80] max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-b-2xl border-t border-forest/10 bg-white px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl lg:hidden dark:bg-charcoal">
            <form action="/properties" method="get" role="search" className="mb-4">
              <label htmlFor="mobile-property-search" className="mb-2 block text-sm font-semibold text-charcoal dark:text-white">Search properties</label>
              <div className="flex gap-2">
                <input id="mobile-property-search" name="area" type="search" placeholder="City, area or neighbourhood" maxLength={120} className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-base text-charcoal dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                <button type="submit" aria-label="Search properties" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest text-white"><Search className="h-5 w-5" /></button>
              </div>
            </form>
            <p className="px-3 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-400">Find property</p>
            <div className="grid grid-cols-2 gap-2">
              {mobilePropertyNav.map((item) => (
                <Link key={item.label} href={item.href} onClick={closeMobile} className="flex min-h-14 items-center justify-center rounded-xl border border-forest/10 bg-white px-4 py-3 text-center text-sm font-extrabold tracking-wide text-forest shadow-sm transition-colors hover:border-forest/30 hover:bg-forest-50 dark:border-white/10 dark:bg-white dark:text-forest dark:hover:bg-gray-100">{item.label}</Link>
              ))}
            </div>
            <p className="px-3 pb-2 pt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-400">Explore &amp; services</p>
            <div className="space-y-1">
              {exploreNav.map((item) => (
                <Link key={item.label} href={item.href} onClick={closeMobile} className="flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-sage/10 dark:text-gray-200 dark:hover:bg-gray-800">
                  <item.icon className="h-4 w-4 text-forest" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link href="/about" onClick={closeMobile} className="flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal dark:text-gray-200">About De-Greenacres</Link>
            </div>
            <div className="mt-5 border-t border-forest/10 pt-5">
              {!loading && user ? (
                <div className="space-y-2">
                  {profile?.is_admin && (
                    <Link href="/admin/dashboard" onClick={closeMobile} className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest/10 px-4 py-3 text-sm font-extrabold text-forest">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Open Admin Console
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/dashboard" onClick={closeMobile} className="btn-outline text-center text-sm">Dashboard</Link>
                    <button type="button" onClick={() => { void signOut(); closeMobile(); }} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300">Sign out</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/signin" onClick={closeMobile} className="btn-outline text-center text-sm">Sign in</Link>
                  <Link href="/signup" onClick={closeMobile} className="btn-secondary text-center text-sm">Create account</Link>
                </div>
              )}
              <Link href="/sell" onClick={closeMobile} className="btn-primary mt-3 block w-full text-center">List a property</Link>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={`tel:${settings.contact_phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-forest/15 px-3 text-xs font-bold text-forest dark:text-white"><Phone className="h-4 w-4" /> Call us</a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={closeMobile} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-3 text-xs font-bold text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
