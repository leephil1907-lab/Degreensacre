'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, Building2, Trees, Briefcase, Clock, ChevronDown } from 'lucide-react';

const TABS = [
  { label: 'Buy', value: 'sale', icon: Home },
  { label: 'Rent', value: 'rent', icon: Building2 },
  { label: 'Land', value: 'land', icon: Trees },
  { label: 'Commercial', value: 'commercial', icon: Briefcase },
  { label: 'Short Let', value: 'short-let', icon: Clock },
];

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sale');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('type', activeTab);
    if (location) params.set('state', location);
    if (propertyType) params.set('propertyType', propertyType);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    if (bedrooms) params.set('bedrooms', bedrooms);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto animate-fade-in border border-white/20">
      {/* Tabs - Interactive */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === tab.value
                ? 'bg-forest text-white shadow-lg shadow-forest/30 scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-charcoal'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Fields - Visible styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Location</label>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal font-medium focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all cursor-pointer hover:border-gray-300"
            >
              <option value="">All Locations</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja (FCT)</option>
              <option value="Enugu">Enugu</option>
              <option value="Akwa Ibom">Akwa Ibom</option>
              <option value="Rivers">Rivers</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Property Type</label>
          <div className="relative">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal font-medium focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all cursor-pointer hover:border-gray-300"
            >
              <option value="">All Types</option>
              <option value="Detached Duplex">Detached Duplex</option>
              <option value="Semi-Detached">Semi-Detached</option>
              <option value="Apartment">Apartment / Flat</option>
              <option value="Terrace">Terrace House</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Land">Land</option>
              <option value="Commercial">Commercial</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Price Range</label>
          <div className="relative">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal font-medium focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all cursor-pointer hover:border-gray-300"
            >
              <option value="">Any Price</option>
              <option value="0-30000000">Under ₦30M</option>
              <option value="30000000-50000000">₦30M – ₦50M</option>
              <option value="50000000-100000000">₦50M – ₦100M</option>
              <option value="100000000-200000000">₦100M – ₦200M</option>
              <option value="200000000-500000000">₦200M – ₦500M</option>
              <option value="500000000-">₦500M+</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Bedrooms</label>
          <div className="relative">
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal font-medium focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all cursor-pointer hover:border-gray-300"
            >
              <option value="">Any</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-forest hover:bg-forest-light text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-forest/30 active:scale-95 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
