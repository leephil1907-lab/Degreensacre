'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { whatsappLink } from '@/lib/site-settings';
import {
  ArrowRight, BarChart3, Building2, CheckCircle2, ClipboardCheck,
  CreditCard, Eye, FileCheck, Globe, Handshake, HardHat, Home, Key,
  MessageCircle, ShieldCheck, TreePine, Users,
} from 'lucide-react';

type ServiceCategory = 'all' | 'buyers' | 'owners' | 'investment';

const SERVICES = [
  {
    category: 'buyers' as const,
    icon: Home,
    title: 'Residential & Commercial Sales',
    description: 'Verified homes, duplexes, apartments, and business spaces across Lagos, Abuja, Uyo, Port Harcourt, and Enugu.',
    ctaLabel: 'Browse properties',
    href: '/properties?type=sale',
  },
  {
    category: 'buyers' as const,
    icon: TreePine,
    title: 'Land Acquisition & Verification',
    description: 'Residential and commercial plots with clear survey, title status, and physical boundary verification.',
    ctaLabel: 'Explore land',
    href: '/land',
  },
  {
    category: 'buyers' as const,
    icon: Eye,
    title: 'Guided Physical Inspections',
    description: 'Book an escorted site visit with our team so you inspect the building, access roads, and documents firsthand.',
    ctaLabel: 'Book inspection',
    href: '/book-inspection',
  },
  {
    category: 'buyers' as const,
    icon: FileCheck,
    title: 'Title & Documentation Guidance',
    description: 'Clear walkthroughs of Certificate of Occupancy (C of O), Governor’s Consent, Registered Survey, and Deed of Assignment.',
    ctaLabel: 'Ask our team',
    href: '/contact?subject=Documentation%20Guidance',
  },
  {
    category: 'owners' as const,
    icon: Key,
    title: 'Property & Short-Let Management',
    description: 'Tenant screening, rent collection, facility oversight, and structured reporting for busy or overseas landlords.',
    ctaLabel: 'Discuss management',
    href: '/contact?subject=Property%20Management',
  },
  {
    category: 'owners' as const,
    icon: BarChart3,
    title: 'Property Valuation & Pricing',
    description: 'Market-grounded pricing guidance based on location comparables, title grade, and current buyer demand.',
    ctaLabel: 'Request valuation',
    href: '/sell',
  },
  {
    category: 'owners' as const,
    icon: Building2,
    title: 'Verified Owner & Agent Listing',
    description: 'Publish property you own or represent with structured verification and direct qualified buyer enquiries.',
    ctaLabel: 'Submit a property',
    href: '/submit-property',
  },
  {
    category: 'investment' as const,
    icon: Globe,
    title: 'Diaspora Advisory & Remote Closing',
    description: 'End-to-end support for Nigerians in the UK, US, Canada, Europe, and beyond — live FX tracking, inspections, and closing.',
    ctaLabel: 'Diaspora hub',
    href: '/diaspora',
  },
  {
    category: 'investment' as const,
    icon: Handshake,
    title: 'Co-Ownership & Land Banking',
    description: 'Structured group acquisition and medium-to-long-term growth corridors selected for infrastructure expansion.',
    ctaLabel: 'Speak to an advisor',
    href: '/contact?subject=Investment%20Advisory',
  },
  {
    category: 'investment' as const,
    icon: HardHat,
    title: 'New Developments & Off-Plan',
    description: 'Curated estate developments with milestone schedules and transparent payment terms.',
    ctaLabel: 'View developments',
    href: '/developments',
  },
];

const JOURNEY_STEPS = [
  { num: '01', title: 'Discover', desc: 'Filter verified listings by state, neighbourhood, price, bedrooms, or title document.', icon: Home },
  { num: '02', title: 'Verify', desc: 'Review listed documentation status and confirm key terms with our team.', icon: ClipboardCheck },
  { num: '03', title: 'Inspect', desc: 'Visit the property in person or send a representative for a guided site inspection.', icon: Eye },
  { num: '04', title: 'Structure Payment', desc: 'Proceed with outright purchase or flexible instalment plans where available.', icon: CreditCard },
  { num: '05', title: 'Own & Manage', desc: 'Complete handover documentation and optionally enrol in ongoing management.', icon: ShieldCheck },
];

const TABS: Array<{ id: ServiceCategory; label: string }> = [
  { id: 'all', label: 'All Services' },
  { id: 'buyers', label: 'Buyers & Renters' },
  { id: 'owners', label: 'Owners & Landlords' },
  { id: 'investment', label: 'Investors & Diaspora' },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const { settings } = useSiteSettings();
  const reduceMotion = useReducedMotion();

  const visibleServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter((service) => service.category === activeCategory);

  return (
    <div className="min-h-screen bg-ivory">
      <section className="relative overflow-hidden bg-gradient-to-br from-charcoal via-forest-800 to-forest py-20 text-white">
        <div className="container-custom relative z-10">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-sage-300">Full-Service Real Estate</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl max-w-3xl leading-tight">
            Services built for confident property decisions in Nigeria
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80 leading-relaxed">
            Whether you are buying your first plot, letting an apartment, managing an estate from abroad, or selling at fair market value — every service leads to concrete action.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/properties" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-forest transition hover:bg-sage hover:text-white">
              Browse marketplace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/book-inspection" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white backdrop-blur-sm transition hover:bg-white/20">
              Book an inspection
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sage mb-2">Explore by need</p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal">How De-Greenacres supports you</h2>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter services by audience">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
                    activeCategory === tab.id
                      ? 'bg-forest text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-charcoal'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {visibleServices.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-ivory/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:bg-white hover:shadow-xl"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl text-charcoal group-hover:text-forest transition-colors">{service.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-6 text-gray-600">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-forest">
                    {service.ctaLabel} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sage mb-2">Process</p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal">From search to ownership in five clear steps</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {JOURNEY_STEPS.map((step, index) => (
              <ScrollReveal key={step.num} delay={index * 0.06}>
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-white">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-sage">Step {step.num}</p>
                  <h3 className="mt-1 font-display text-xl text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-gray-600">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-forest text-white">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sage-300 mb-3">Ready to proceed?</p>
              <h2 className="font-display text-3xl md:text-4xl">Speak directly with our advisory desk</h2>
              <p className="mt-4 max-w-xl text-white/75 leading-relaxed">
                Inspection fee of ₦{settings.inspection_fee.toLocaleString()} applies once your guided site visit is scheduled. Legal due diligence support and transparent documentation walkthroughs are part of our commitment.
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2 text-sm text-white/85">
                {['CAC Registered (RC: 1856064)', 'Nationwide property network', 'Verified listing standards', 'Dedicated diaspora support'].map((item) => (
                  <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sage-300 shrink-0" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <Link href="/book-inspection" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-forest transition hover:bg-ivory">
                <Eye className="h-4 w-4" /> Book a property inspection
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/15">
                <Users className="h-4 w-4" /> Send a service enquiry
              </Link>
              <a href={whatsappLink(settings, 'Hello De-Greenacres, I would like to discuss your property services.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-500">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
