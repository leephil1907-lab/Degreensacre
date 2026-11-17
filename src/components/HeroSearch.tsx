'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, Building2, ChevronDown, Clock, Home, MapPin, Search, Trees } from 'lucide-react';
import { NIGERIAN_STATES } from '@/lib/validation';

const TABS = [
  { label: 'Buy', value: 'sale', icon: Home },
  { label: 'Rent', value: 'rent', icon: Building2 },
  { label: 'Land', value: 'land', icon: Trees },
  { label: 'Commercial', value: 'commercial', icon: Briefcase },
  { label: 'Short let', value: 'short-let', icon: Clock },
];

const QUICK_MARKETS = [
  { label: 'Lagos Homes', href: '/properties?state=Lagos' },
  { label: 'Abuja (FCT)', href: '/properties?state=FCT' },
  { label: 'Uyo Land', href: '/properties?type=land&state=Akwa%20Ibom' },
  { label: 'Port Harcourt', href: '/properties?state=Rivers' },
  { label: 'Enugu', href: '/properties?state=Enugu' },
  { label: 'Verified Only', href: '/properties?verification=verified' },
];

const PROPERTY_TYPES = [
  'Detached Duplex', 'Semi-Detached Duplex', 'Terrace Duplex', 'Bungalow',
  'Apartment', 'Flat', 'Penthouse', 'Mansion', 'Commercial Building',
  'Office Space', 'Shop', 'Warehouse', 'Land', 'Mixed Use',
];

const selectClass = 'w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-9 text-base font-medium text-charcoal transition-colors hover:border-gray-300 focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/15';

export default function HeroSearch() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('sale');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set('type', activeTab);
    if (location) params.set('state', location);
    if (propertyType) params.set('propertyType', propertyType);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min && min !== '0') params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    if (bedrooms) params.set('bedrooms', bedrooms);
    router.push(`/properties?${params.toString()}`);
  };

  const chooseTab = (value: string) => {
    setActiveTab(value);
    if (value === 'land') setPropertyType('Land');
    else if (propertyType === 'Land') setPropertyType('');
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto max-w-5xl rounded-2xl border border-white/35 bg-white/95 p-4 text-left shadow-2xl backdrop-blur-md sm:p-6 md:rounded-3xl md:p-7" aria-label="Property search">
      <div className="scroll-row -mx-1 flex gap-2 px-1 pb-3" role="group" aria-label="Listing category">
        {TABS.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => chooseTab(tab.value)}
              aria-pressed={active}
              className={`relative flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                active ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-charcoal'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="hero-search-pill"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-forest shadow-md"
                />
              )}
              <tab.icon className="relative z-10 h-4 w-4" aria-hidden="true" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="hero-location" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-gray-500">State / region</label>
          <div className="relative">
            <select id="hero-location" value={location} onChange={(event) => setLocation(event.target.value)} className={selectClass}>
              <option value="">All locations</option>
              {NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state === 'FCT' ? 'Abuja (FCT)' : state}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="hero-property-type" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-gray-500">Property type</label>
          <div className="relative">
            <select id="hero-property-type" value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className={selectClass}>
              <option value="">All types</option>
              {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="hero-price" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-gray-500">Price range</label>
          <div className="relative">
            <select id="hero-price" value={priceRange} onChange={(event) => setPriceRange(event.target.value)} className={selectClass}>
              <option value="">Any price</option>
              <option value="0-30000000">Under ₦30M</option>
              <option value="30000000-50000000">₦30M – ₦50M</option>
              <option value="50000000-100000000">₦50M – ₦100M</option>
              <option value="100000000-200000000">₦100M – ₦200M</option>
              <option value="200000000-500000000">₦200M – ₦500M</option>
              <option value="500000000-">₦500M+</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="hero-bedrooms" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-gray-500">Bedrooms</label>
          <div className="relative">
            <select id="hero-bedrooms" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} className={selectClass}>
              <option value="">Any number</option>
              {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count} {count === 1 ? 'bedroom' : 'bedrooms'}</option>)}
              <option value="5">5+ bedrooms</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3.5 font-extrabold text-white transition-all hover:bg-forest-light hover:shadow-lg active:scale-[0.99]">
            <Search className="h-5 w-5 shrink-0" aria-hidden="true" /><span className="whitespace-nowrap">Search</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mr-1">Popular:</span>
        {QUICK_MARKETS.map((market) => (
          <Link
            key={market.label}
            href={market.href}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 transition-all hover:border-forest/40 hover:bg-forest-50 hover:text-forest"
          >
            <MapPin className="h-3 w-3 text-forest" aria-hidden="true" />
            {market.label}
          </Link>
        ))}
      </div>
    </form>
  );
}
