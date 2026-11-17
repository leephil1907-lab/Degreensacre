'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import HeroCarousel from '@/components/HeroCarousel';
import HeroSearch from '@/components/HeroSearch';
import CACIcon from '@/components/CACIcon';
import ReviewsSection from '@/components/ReviewsSection';
import AdSense, { adsenseConfigured } from '@/components/GoogleAdsense';
import { formatPropertyPrice, getPropertyImage } from '@/lib/property';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import {
  ArrowRight, ArrowUpRight, Building2, CalendarCheck, Camera, Compass,
  FileCheck, Globe, Home, KeyRound, MapPin, ShieldCheck, Sparkles, TreePine,
} from 'lucide-react';

interface HomeProperty {
  id: string;
  slug: string;
  title: string;
  price: number;
  price_period?: string | null;
  type: string;
  property_type?: string | null;
  area: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  featured?: boolean;
  verification_status?: string | null;
  documentation?: string | null;
  images?: string[];
  property_images?: Array<{ url: string; display_order?: number; is_primary?: boolean }>;
}

type ShowcaseTab = 'featured' | 'land' | 'latest';

const SHOWCASE_TABS: Array<{ id: ShowcaseTab; label: string }> = [
  { id: 'featured', label: 'Featured Listings' },
  { id: 'land', label: 'Land & Plots' },
  { id: 'latest', label: 'All Available' },
];

const ACTION_PATHS = [
  {
    title: 'Buy or rent with clarity',
    description: 'Search verified homes, apartments, and commercial spaces with interactive map filtering and saved search alerts.',
    cta: 'Browse marketplace',
    href: '/properties',
    icon: Home,
    accent: 'from-forest/10 to-sage/10 text-forest',
  },
  {
    title: 'Sell or list your property',
    description: 'Reach serious local and diaspora buyers, get fair valuation guidance, or submit an authorised listing.',
    cta: 'Explore selling options',
    href: '/sell',
    icon: KeyRound,
    accent: 'from-amber-500/10 to-forest/10 text-forest',
  },
  {
    title: 'Invest from abroad',
    description: 'Live NGN FX conversion, guided physical inspections, and transparent documentation walkthroughs.',
    cta: 'Visit diaspora hub',
    href: '/diaspora',
    icon: Globe,
    accent: 'from-sage/15 to-forest/10 text-forest',
  },
];

const CITY_HUBS = [
  { name: 'Lagos', subtitle: 'Lekki · Ikoyi · VI · Ikeja', href: '/location/lagos' },
  { name: 'Abuja (FCT)', subtitle: 'Maitama · Asokoro · Wuse · Gwarinpa', href: '/location/abuja' },
  { name: 'Akwa Ibom (Uyo)', subtitle: 'Shelter Afrique · Coastal Highway', href: '/location/akwa-ibom' },
  { name: 'Port Harcourt', subtitle: 'GRA · Trans-Amadi · Woji', href: '/location/port-harcourt' },
  { name: 'Enugu', subtitle: 'Independence Layout · GRA', href: '/location/enugu' },
  { name: 'All Markets', subtitle: 'Explore nationwide inventory', href: '/locations' },
];

export default function HomePage() {
  const [properties, setProperties] = useState<HomeProperty[]>([]);
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('featured');
  const [listingsError, setListingsError] = useState('');
  const [listingsLoading, setListingsLoading] = useState(true);
  const reduceMotion = useReducedMotion();
  const { settings } = useSiteSettings();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/properties?limit=12', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error('Live listings could not be loaded.');
        if (!cancelled) {
          setProperties(data.properties || []);
          setListingsError('');
        }
      } catch {
        if (!cancelled) setListingsError('Live listings are temporarily unavailable. Please use the property search or try again later.');
      } finally {
        if (!cancelled) setListingsLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const visibleProperties = useMemo(() => {
    if (activeTab === 'featured') {
      const featured = properties.filter((item) => item.featured);
      return (featured.length > 0 ? featured : properties).slice(0, 6);
    }
    if (activeTab === 'land') {
      return properties.filter((item) => item.property_type === 'Land' || item.type === 'land').slice(0, 6);
    }
    return properties.slice(0, 6);
  }, [activeTab, properties]);

  return (
    <>
      {/* ═══ COMPACT ACTION-FIRST ZILLOW HERO ═══ */}
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden py-14 md:py-20">
        <HeroCarousel />
        <div className="relative z-10 container-custom w-full">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-5xl text-center text-white"
          >
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-5 py-2 backdrop-blur-md">
              <CACIcon className="h-5 w-5" />
              <span className="text-xs font-bold tracking-wider uppercase sm:text-sm">CAC Registered · RC: 1856064</span>
            </div>
            <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-white md:text-6xl">
              Find Property. Verify the Opportunity.<br />
              <span className="italic text-sage-300">Own With Confidence.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-light text-white/85 md:text-lg">
              Nigeria&apos;s multi-city property marketplace for verified homes, land, rentals, and diaspora investment.
            </p>
            <div className="mt-8">
              <HeroSearch />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ INTERACTIVE LIVE LISTINGS SWITCHER ═══ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-sage">Live Marketplace</p>
                <h2 className="font-display text-3xl text-charcoal md:text-4xl">Explore active opportunities</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Property showcase categories">
                {SHOWCASE_TABS.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative rounded-xl px-4 py-2.5 text-xs font-extrabold transition-colors ${
                        active ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-charcoal'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="home-showcase-tab"
                          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-xl bg-forest shadow-sm"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
                <Link href="/properties" className="ml-1 inline-flex items-center gap-1.5 rounded-xl border border-forest/20 px-4 py-2.5 text-xs font-extrabold text-forest transition hover:bg-forest-50">
                  Interactive map <Compass className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {listingsError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{listingsError}</div>}
          {listingsLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((skeleton) => (
                <div key={skeleton} className="h-80 animate-pulse rounded-2xl border border-gray-100 bg-gray-100" />
              ))}
            </div>
          )}

          {!listingsLoading && !listingsError && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
              >
                {visibleProperties.length === 0 ? (
                  <div className="rounded-2xl border border-gray-100 bg-ivory py-12 text-center">
                    <Building2 className="mx-auto mb-3 h-9 w-9 text-gray-300" />
                    <p className="font-display text-xl text-charcoal">No listings in this category yet</p>
                    <Link href="/properties" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-forest hover:underline">
                      Browse all available properties <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visibleProperties.map((property) => {
                      const img = getPropertyImage(property);
                      const isLand = property.property_type === 'Land' || property.type === 'land';
                      return (
                        <Link
                          key={property.id}
                          href={`/properties/${property.slug}`}
                          className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/25 hover:shadow-xl"
                        >
                          <div className="relative h-60 overflow-hidden bg-forest-50">
                            <Image
                              src={img}
                              alt={property.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                              <span className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white ${isLand ? 'bg-amber-700' : 'bg-forest'}`}>
                                {isLand ? 'LAND' : property.type === 'sale' ? 'FOR SALE' : property.type.toUpperCase()}
                              </span>
                              {property.verification_status === 'verified' && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-forest">
                                  <ShieldCheck className="h-3 w-3" /> Verified
                                </span>
                              )}
                            </div>
                            {img === '/property-placeholder.svg' && (
                              <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                                <Camera className="h-3 w-3" /> Photos coming soon
                              </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-5">
                              <p className="text-2xl font-extrabold text-white">{formatPropertyPrice(property.price, property.price_period)}</p>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-display text-lg text-charcoal line-clamp-2 transition-colors group-hover:text-forest">{property.title}</h3>
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-forest" /> {property.area}, {property.state}
                            </p>
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-gray-600">
                              <div className="flex items-center gap-3">
                                {property.bedrooms > 0 && <span>{property.bedrooms} Beds</span>}
                                {property.bathrooms > 0 && <span>{property.bathrooms} Baths</span>}
                                {property.sqm > 0 && <span>{property.sqm.toLocaleString()} sqm</span>}
                              </div>
                              <span className="inline-flex items-center gap-1 text-forest font-bold">
                                View <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {adsenseConfigured && (
        <section className="bg-ivory py-6">
          <div className="container-custom">
            <AdSense label="Homepage — Banner" format="horizontal" />
          </div>
        </section>
      )}

      {/* ═══ ZILLOW-STYLE THREE-PATH MULTI-PAGE HUB ═══ */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <ScrollReveal>
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-sage">Choose Your Path</p>
                <h2 className="font-display text-3xl text-charcoal md:text-4xl">Built like a true property hub</h2>
              </div>
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline">
                View all services &amp; advisory <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ACTION_PATHS.map((path, index) => (
              <ScrollReveal key={path.title} delay={index * 0.08}>
                <Link
                  href={path.href}
                  className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/30 hover:shadow-xl"
                >
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${path.accent} transition-transform duration-300 group-hover:scale-105`}>
                    <path.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-2xl text-charcoal group-hover:text-forest transition-colors">{path.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{path.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-forest">
                    {path.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXPLORE MARKETS + INSPECTION / SERVICES SPLIT ═══ */}
      <section className="section-padding bg-white">
        <div className="container-custom space-y-12">
          <div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-sage">Regional Guides</p>
                <h2 className="font-display text-3xl text-charcoal">Explore Nigeria&apos;s key markets</h2>
              </div>
              <Link href="/locations" className="text-sm font-bold text-forest hover:underline">All locations →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CITY_HUBS.map((city, i) => (
                <ScrollReveal key={city.name} delay={i * 0.04}>
                  <Link
                    href={city.href}
                    className="group block h-full rounded-2xl border border-gray-100 bg-ivory/70 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-forest/30 hover:bg-white hover:shadow-md"
                  >
                    <MapPin className="mb-2 h-4 w-4 text-forest transition-transform group-hover:scale-110" />
                    <p className="font-display text-lg text-charcoal group-hover:text-forest">{city.name}</p>
                    <p className="mt-1 text-[11px] leading-4 text-gray-500">{city.subtitle}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal>
            <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-charcoal via-forest-800 to-forest p-8 text-white md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-sage-300">
                  <Sparkles className="h-3.5 w-3.5" /> Verification &amp; Inspections
                </div>
                <h2 className="font-display text-3xl md:text-4xl">Never commit to a property blind</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 md:text-base">
                  Review title documents, request an escorted inspection (₦{settings.inspection_fee.toLocaleString()} after confirmation), or explore new estates and buyer guides on dedicated pages.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Link href="/book-inspection" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-forest transition hover:bg-sage hover:text-white">
                  <CalendarCheck className="h-4 w-4" /> Book Property Inspection
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/services" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/20">
                    <FileCheck className="h-3.5 w-3.5" /> Our Services
                  </Link>
                  <Link href="/land" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/20">
                    <TreePine className="h-3.5 w-3.5" /> Land &amp; Estates
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ReviewsSection />
        </div>
      </section>
    </>
  );
}
