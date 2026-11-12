'use client';

import { Fragment, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Bath, Bed, Camera, Car, CheckCircle, Grid3X3, Heart, Home,
  List, Loader2, Map as MapIcon, MapPin, Search, SearchX, SlidersHorizontal,
  Square, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdSense, { adsenseConfigured } from '@/components/GoogleAdsense';
import type { MapProperty } from '@/components/PropertyMapView';
import { formatPropertyPrice, getPropertyAddress, getPropertyCoordinates, getPropertyImage, isStockImage } from '@/lib/property';
import { NIGERIAN_STATES } from '@/lib/validation';

const PropertyMapView = dynamic(() => import('@/components/PropertyMapView'), {
  ssr: false,
  loading: () => <div className="grid h-full min-h-96 place-items-center bg-forest-50"><Loader2 className="h-8 w-8 animate-spin text-forest" /></div>,
});

type Property = MapProperty & {
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parking?: number;
  sqm?: number;
  land_size?: number;
  description?: string;
  features?: string[];
  amenities?: string[];
  images?: string[];
  property_images?: { url: string; is_primary?: boolean; display_order?: number }[];
  verification_status?: string;
  verified?: boolean;
  documentation?: string;
  gated_estate?: boolean;
  serviced?: boolean;
  furnished?: boolean;
  featured?: boolean;
  date_added?: string;
  published_at?: string;
  created_at?: string;
  views?: number;
};

type ViewMode = 'map' | 'grid' | 'list';
type Filters = {
  type: string;
  state: string;
  area: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  verification: string;
  documentation: string;
};

const EMPTY_FILTERS: Filters = { type: '', state: '', area: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', verification: '', documentation: '' };
const PAGE_SIZE = 50;
const CARD_INCREMENT = 24;
const controlClass = 'min-h-11 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10';
const categoryTabs = [
  { label: 'All', value: '' },
  { label: 'Buy', value: 'sale' },
  { label: 'Rent', value: 'rent' },
  { label: 'Land', value: 'land' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Short let', value: 'short-let' },
];
const propertyTypes = ['Detached Duplex', 'Semi-Detached Duplex', 'Terrace Duplex', 'Bungalow', 'Apartment', 'Flat', 'Penthouse', 'Mansion', 'Commercial Building', 'Office Space', 'Shop', 'Warehouse', 'Land', 'Mixed Use'];
const commercialPropertyTypes = new Set(['Commercial Building', 'Office Space', 'Shop', 'Warehouse', 'Mixed Use']);

function typeLabel(type: string) {
  return ({ sale: 'For sale', rent: 'For rent', land: 'Land', commercial: 'Commercial', 'short-let': 'Short let' } as Record<string, string>)[type] || type.replaceAll('-', ' ');
}

function PropertyResultCard({ property, view, selected, saved, saving, onSave, onShowMap }: {
  property: Property;
  view: ViewMode;
  selected: boolean;
  saved: boolean;
  saving: boolean;
  onSave: () => void;
  onShowMap: () => void;
}) {
  const isList = view === 'list';
  const compact = view === 'map';
  const image = getPropertyImage(property);
  const hasPhoto = image !== '/property-placeholder.svg';
  const coordinates = getPropertyCoordinates(property);
  const photoCount = new Set([...(property.images || []), ...(property.property_images || []).map((image) => image.url)].filter((url) => !isStockImage(url))).size;
  const size = Number(property.sqm || property.land_size || 0);
  const displayType = property.property_type === 'Land' ? 'land' : commercialPropertyTypes.has(property.property_type || '') ? 'commercial' : property.type;
  const tags = [property.documentation, property.gated_estate ? 'Gated estate' : '', property.serviced ? 'Serviced' : '', property.furnished ? 'Furnished' : ''].filter(Boolean).slice(0, compact ? 2 : 3);

  return (
    <article id={`property-card-${property.id}`} className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all ${selected ? 'border-forest ring-2 ring-forest/20' : 'border-gray-100 hover:border-forest/25 hover:shadow-lg'} ${isList ? 'sm:flex-row' : ''} ${view === 'grid' ? 'w-full sm:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)] 2xl:w-[calc(25%-1.125rem)]' : ''}`}>
      <div className={`relative shrink-0 overflow-hidden ${isList ? 'sm:w-64 lg:w-80' : ''}`}>
        <Link href={`/properties/${property.slug}`} className="block" aria-label={`View ${property.title}`}>
          <img src={image} alt={hasPhoto ? property.title : ''} className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${isList ? 'h-56 sm:h-full sm:min-h-[19rem]' : compact ? 'h-48' : 'h-60'}`} loading="lazy" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex max-w-[75%] flex-wrap gap-1.5">
          <span className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white ${displayType === 'sale' ? 'bg-forest' : displayType === 'rent' ? 'bg-blue-700' : displayType === 'land' ? 'bg-amber-700' : 'bg-charcoal'}`}>{typeLabel(displayType)}</span>
          {property.featured && <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-forest">Featured</span>}
          {(property.verification_status === 'verified' || property.verified) && <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-forest"><CheckCircle className="h-3 w-3" /> Verified</span>}
        </div>
        <button type="button" onClick={onSave} disabled={saving} aria-label={saved ? `Remove ${property.title} from saved properties` : `Save ${property.title}`} aria-pressed={saved} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-gray-600 shadow-md transition hover:bg-white hover:text-red-600 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />}
        </button>
        {photoCount > 1 && <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold text-white"><Camera className="h-3 w-3" /> {photoCount} photos</span>}
        {!hasPhoto && <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm"><Camera className="h-3 w-3" /> Photos coming soon</span>}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-sans text-2xl font-extrabold tracking-tight text-charcoal">{formatPropertyPrice(property.price, property.price_period)}</p>
        <Link href={`/properties/${property.slug}`} className="mt-2">
          <h2 className={`font-sans font-extrabold leading-snug text-charcoal transition-colors group-hover:text-forest ${compact ? 'text-base' : 'text-lg'}`}>{property.title}</h2>
        </Link>
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-gray-500"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />{getPropertyAddress(property)}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
          {Number(property.bedrooms) > 0 && <span className="inline-flex items-center gap-1.5"><Bed className="h-4 w-4 text-forest" /><strong className="text-charcoal">{property.bedrooms}</strong> beds</span>}
          {Number(property.bathrooms) > 0 && <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4 text-forest" /><strong className="text-charcoal">{property.bathrooms}</strong> baths</span>}
          {size > 0 && <span className="inline-flex items-center gap-1.5"><Square className="h-4 w-4 text-forest" /><strong className="text-charcoal">{size.toLocaleString()}</strong> sqm</span>}
          {Number(property.parking) > 0 && !compact && <span className="inline-flex items-center gap-1.5"><Car className="h-4 w-4 text-forest" /><strong className="text-charcoal">{property.parking}</strong> parking</span>}
        </div>

        {property.description && <p className={`mt-4 text-sm leading-6 text-gray-600 ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>{property.description}</p>}
        {tags.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{tags.map((tag) => <span key={tag} className="rounded-full border border-forest/10 bg-forest-50 px-2.5 py-1 text-[10px] font-bold text-forest-800">{tag}</span>)}</div>}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <Link href={`/properties/${property.slug}`} className="text-xs font-extrabold text-forest hover:underline">View details</Link>
          <button type="button" onClick={onShowMap} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-gray-600 transition-colors hover:bg-forest-50 hover:text-forest"><MapPin className="h-3.5 w-3.5" />{coordinates ? 'View on map' : 'Find address'}</button>
        </div>
      </div>
    </article>
  );
}

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    type: searchParams.get('type') || '',
    state: searchParams.get('state') || '',
    area: searchParams.get('area') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [visibleCount, setVisibleCount] = useState(CARD_INCREMENT);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [mapAddress, setMapAddress] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState('');

  const loadProperties = useCallback(async (offset = 0, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setLoadError('');
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
      const response = await fetch(`/api/properties?${params}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Properties could not be loaded.');
      const incoming = (data.properties || []) as Property[];
      setProperties((current) => {
        if (!append) return incoming;
        const existing = new Set(current.map((property) => property.id));
        return [...current, ...incoming.filter((property) => !existing.has(property.id))];
      });
      setTotalProperties(Number(data.count) || (append ? offset + incoming.length : incoming.length));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Properties could not be loaded. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { void loadProperties(); }, [loadProperties]);

  useEffect(() => {
    setFilters({
      ...EMPTY_FILTERS,
      type: searchParams.get('type') || '',
      state: searchParams.get('state') || '',
      area: searchParams.get('area') || '',
      propertyType: searchParams.get('propertyType') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      verification: searchParams.get('verification') || '',
      documentation: searchParams.get('documentation') || '',
    });
    setSortBy(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }
    let cancelled = false;
    void fetch('/api/saved', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).then((data) => {
      if (!cancelled && data?.properties) setSavedIds(new Set(data.properties.map((property: { id: string }) => property.id)));
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => { setVisibleCount(CARD_INCREMENT); }, [filters, sortBy]);

  const filteredProperties = useMemo(() => properties.filter((property) => {
    // Land and commercial are property categories, not values of the listing
    // `type` column (sale/rent/short-let). Keep those searches compatible with
    // the public URL scheme without requiring impossible database values.
    if (filters.type === 'land' && property.property_type !== 'Land') return false;
    if (filters.type === 'commercial' && !commercialPropertyTypes.has(property.property_type || '')) return false;
    if (filters.type && !['land', 'commercial'].includes(filters.type) && property.type !== filters.type) return false;
    if (filters.state) {
      const state = String(property.state || '').toLowerCase();
      const matches = filters.state === 'FCT' ? ['fct', 'abuja', 'abuja (fct)'].includes(state) : state === filters.state.toLowerCase();
      if (!matches) return false;
    }
    if (filters.area) {
      const query = filters.area.trim().toLowerCase();
      const haystack = [property.title, property.address, property.area, property.city, property.lga, property.state, property.property_type].map((value) => String(value || '').toLowerCase()).join(' ');
      if (query && !haystack.includes(query)) return false;
    }
    if (filters.propertyType && String(property.property_type || '').toLowerCase() !== filters.propertyType.toLowerCase()) return false;
    if (filters.minPrice && Number(property.price) < Number(filters.minPrice)) return false;
    if (filters.maxPrice && Number(property.price) > Number(filters.maxPrice)) return false;
    if (filters.bedrooms && Number(property.bedrooms || 0) < Number(filters.bedrooms)) return false;
    if (filters.verification === 'verified' && property.verification_status !== 'verified' && !property.verified) return false;
    if (filters.documentation && String(property.documentation || '').toLowerCase() !== filters.documentation.toLowerCase()) return false;
    return true;
  }), [properties, filters]);

  const sortedProperties = useMemo(() => [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'popular') return Number(b.views || 0) - Number(a.views || 0);
    return new Date(b.date_added || b.published_at || b.created_at || 0).getTime() - new Date(a.date_added || a.published_at || a.created_at || 0).getTime();
  }), [filteredProperties, sortBy]);

  const documentationOptions = useMemo(() => Array.from(new Set(['C of O', "Governor's Consent", 'Deed of Assignment', 'Registered Survey', ...properties.map((property) => property.documentation || '').filter(Boolean)])).sort(), [properties]);
  const displayedProperties = sortedProperties.slice(0, visibleCount);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;
  const hasMore = visibleCount < sortedProperties.length || properties.length < totalProperties;

  const updateFilter = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => { setFilters(EMPTY_FILTERS); setSortBy('newest'); setSelectedPropertyId(null); };

  const selectProperty = (id: string | null) => {
    setSelectedPropertyId(id);
    if (id && viewMode === 'map' && window.innerWidth >= 1024) {
      window.setTimeout(() => document.getElementById(`property-card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    }
  };

  const showOnMap = (property: Property) => {
    setSelectedPropertyId(getPropertyCoordinates(property) ? property.id : null);
    setMapAddress(getPropertyAddress(property, true));
    setViewMode('map');
  };

  const toggleSaved = async (property: Property) => {
    if (!user) {
      const returnPath = `${window.location.pathname}${window.location.search}`;
      router.push(`/signin?redirect=${encodeURIComponent(returnPath)}`);
      return;
    }
    setSavingId(property.id);
    setActionNotice('');
    try {
      const response = await fetch('/api/saved', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ property_id: property.id }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Saved properties could not be updated.');
      setSavedIds((current) => {
        const next = new Set(current);
        if (data.saved) next.add(property.id);
        else next.delete(property.id);
        return next;
      });
      setActionNotice(data.saved ? 'Property saved to your account.' : 'Property removed from your saved list.');
    } catch (error) {
      setActionNotice(error instanceof Error ? error.message : 'Saved properties could not be updated.');
    } finally {
      setSavingId(null);
    }
  };

  const showMore = async () => {
    if (visibleCount < sortedProperties.length) {
      setVisibleCount((count) => count + CARD_INCREMENT);
      return;
    }
    if (properties.length < totalProperties) {
      await loadProperties(properties.length, true);
      setVisibleCount((count) => count + CARD_INCREMENT);
    }
  };

  const renderCard = (property: Property, view: ViewMode) => (
    <PropertyResultCard key={property.id} property={property} view={view} selected={selectedPropertyId === property.id} saved={savedIds.has(property.id)} saving={savingId === property.id} onSave={() => void toggleSaved(property)} onShowMap={() => showOnMap(property)} />
  );

  const loadMoreButton = <button type="button" onClick={() => void showMore()} disabled={loadingMore} className="btn-outline inline-flex min-w-44 items-center justify-center gap-2 disabled:opacity-60">{loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{loadingMore ? 'Loading…' : 'Show more properties'}</button>;
  const heading = filters.type ? `${typeLabel(filters.type)} in Nigeria` : 'Find property in Nigeria';

  return (
    <div className="min-h-screen bg-ivory">
      <section className="bg-forest text-white">
        <div className="container-custom flex flex-col gap-5 py-8 md:flex-row md:items-end md:justify-between md:py-10">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sage-300">Property search</p>
            <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl md:text-5xl">{heading}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Compare real listings, review the details that matter and explore saved locations on the map.</p>
          </div>
          <Link href="/book-inspection" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-white/25 px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-white hover:text-forest">Arrange an inspection</Link>
        </div>
      </section>

      <section className="z-40 border-b border-gray-200 bg-white shadow-sm lg:sticky lg:top-30" aria-label="Property filters">
        <div className="container-custom py-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="scroll-row -mx-1 flex gap-1 px-1 pb-1 xl:pb-0" role="group" aria-label="Listing category">
              {categoryTabs.map((tab) => <button key={tab.value || 'all'} type="button" onClick={() => updateFilter('type', tab.value)} aria-pressed={filters.type === tab.value} className={`min-h-10 shrink-0 rounded-lg px-3.5 py-2 text-xs font-extrabold transition-colors ${filters.type === tab.value ? 'bg-forest text-white' : 'bg-gray-100 text-gray-600 hover:bg-forest-50 hover:text-forest'}`}>{tab.label}</button>)}
            </div>
            <div className="flex w-full shrink-0 items-center rounded-xl bg-gray-100 p-1 sm:w-auto xl:ml-auto" role="group" aria-label="Results layout">
              {([{ value: 'map', label: 'Map', icon: MapIcon }, { value: 'grid', label: 'Grid', icon: Grid3X3 }, { value: 'list', label: 'List', icon: List }] as const).map((view) => <button key={view.value} type="button" onClick={() => { setViewMode(view.value); if (view.value !== 'map') setSelectedPropertyId(null); }} aria-pressed={viewMode === view.value} className={`inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors sm:flex-none ${viewMode === view.value ? 'bg-white text-forest shadow-sm' : 'text-gray-500 hover:text-charcoal'}`}><view.icon className="h-3.5 w-3.5" />{view.label}</button>)}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="relative min-w-52 flex-1">
              <label htmlFor="property-query" className="sr-only">Search by area, city, address or listing title</label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input id="property-query" type="search" placeholder="Search area, city, address or title" value={filters.area} onChange={(event) => updateFilter('area', event.target.value)} className={`${controlClass} w-full pl-9`} />
            </div>
            <label className="hidden md:block"><span className="sr-only">State</span><select value={filters.state} onChange={(event) => updateFilter('state', event.target.value)} className={controlClass}><option value="">All states</option>{NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state === 'FCT' ? 'Abuja (FCT)' : state}</option>)}</select></label>
            <label className="hidden lg:block"><span className="sr-only">Maximum price</span><select value={filters.maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)} className={controlClass}><option value="">Any price</option><option value="30000000">Under ₦30M</option><option value="50000000">Under ₦50M</option><option value="100000000">Under ₦100M</option><option value="200000000">Under ₦200M</option><option value="500000000">Under ₦500M</option></select></label>
            <label className="hidden lg:block"><span className="sr-only">Minimum bedrooms</span><select value={filters.bedrooms} onChange={(event) => updateFilter('bedrooms', event.target.value)} className={controlClass}><option value="">Any beds</option>{[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}+ beds</option>)}</select></label>
            <button type="button" onClick={() => setShowFilters((open) => !open)} aria-expanded={showFilters} aria-controls="advanced-property-filters" className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors ${showFilters ? 'bg-forest text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}><SlidersHorizontal className="h-4 w-4" /> Filters{activeFilterCount > 0 && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] ${showFilters ? 'bg-white text-forest' : 'bg-forest text-white'}`}>{activeFilterCount}</span>}</button>
            {hasActiveFilters && <button type="button" onClick={clearFilters} className="inline-flex min-h-10 items-center gap-1 px-2 text-xs font-extrabold text-red-700 hover:underline"><X className="h-3.5 w-3.5" /> Clear</button>}
          </div>

          {showFilters && (
            <div id="advanced-property-filters" className="mt-3 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-5">
              <label className="md:hidden"><span className="mb-1.5 block text-xs font-bold text-gray-500">State</span><select value={filters.state} onChange={(event) => updateFilter('state', event.target.value)} className={`${controlClass} w-full`}><option value="">All states</option>{NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state === 'FCT' ? 'Abuja (FCT)' : state}</option>)}</select></label>
              <label><span className="mb-1.5 block text-xs font-bold text-gray-500">Minimum price (₦)</span><input type="number" min="0" value={filters.minPrice} onChange={(event) => updateFilter('minPrice', event.target.value)} placeholder="No minimum" className={`${controlClass} w-full`} /></label>
              <label><span className="mb-1.5 block text-xs font-bold text-gray-500">Maximum price (₦)</span><input type="number" min="0" value={filters.maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)} placeholder="No maximum" className={`${controlClass} w-full`} /></label>
              <label><span className="mb-1.5 block text-xs font-bold text-gray-500">Property type</span><select value={filters.propertyType} onChange={(event) => updateFilter('propertyType', event.target.value)} className={`${controlClass} w-full`}><option value="">All property types</option>{propertyTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label><span className="mb-1.5 block text-xs font-bold text-gray-500">Minimum bedrooms</span><select value={filters.bedrooms} onChange={(event) => updateFilter('bedrooms', event.target.value)} className={`${controlClass} w-full`}><option value="">Any bedrooms</option>{[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}+ bedrooms</option>)}</select></label>
              <label><span className="mb-1.5 block text-xs font-bold text-gray-500">Verification</span><select value={filters.verification} onChange={(event) => updateFilter('verification', event.target.value)} className={`${controlClass} w-full`}><option value="">Any status</option><option value="verified">Verified only</option></select></label>
              <label><span className="mb-1.5 block text-xs font-bold text-gray-500">Documentation</span><select value={filters.documentation} onChange={(event) => updateFilter('documentation', event.target.value)} className={`${controlClass} w-full`}><option value="">Any documentation</option>{documentationOptions.map((document) => <option key={document}>{document}</option>)}</select></label>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 bg-gray-50">
          <div className="container-custom flex min-h-11 items-center justify-between gap-3 py-2">
            <p className="text-xs text-gray-600" aria-live="polite"><strong className="text-charcoal">{sortedProperties.length}</strong> {sortedProperties.length === 1 ? 'property' : 'properties'}{filters.state ? <> in <strong>{filters.state === 'FCT' ? 'Abuja (FCT)' : filters.state}</strong></> : null}{!hasActiveFilters && totalProperties > properties.length ? <span className="text-gray-400"> · {properties.length} of {totalProperties} loaded</span> : null}</p>
            <label className="flex items-center gap-1 text-xs text-gray-500"><span className="hidden sm:inline">Sort:</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-transparent bg-transparent px-1 py-1 font-bold text-charcoal outline-none focus:border-forest"><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="popular">Most viewed</option></select></label>
          </div>
        </div>
        {actionNotice && <div className="border-t border-forest/10 bg-forest-50"><div className="container-custom flex items-center justify-between gap-3 py-2 text-xs font-semibold text-forest-800" role="status"><span>{actionNotice}</span><button type="button" onClick={() => setActionNotice('')} aria-label="Dismiss notification"><X className="h-4 w-4" /></button></div></div>}
      </section>

      {loading ? (
        <div className="container-custom flex min-h-96 flex-col items-center justify-center py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-forest" /><p className="mt-3 text-sm text-gray-500">Loading available properties…</p></div>
      ) : loadError && properties.length === 0 && viewMode !== 'map' ? (
        <div className="container-custom py-16"><div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"><SearchX className="mx-auto h-10 w-10 text-red-400" /><h2 className="mt-4 font-display text-3xl text-charcoal">We couldn’t load the listings</h2><p className="mt-3 text-sm leading-6 text-gray-500">{loadError}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => void loadProperties()} className="btn-primary">Try again</button><Link href="/contact" className="btn-outline">Contact support</Link></div></div></div>
      ) : sortedProperties.length === 0 && viewMode !== 'map' ? (
        <div className="container-custom py-16"><div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">{hasActiveFilters ? <SearchX className="mx-auto h-10 w-10 text-gray-300" /> : <Home className="mx-auto h-10 w-10 text-forest/30" />}<h2 className="mt-4 font-display text-3xl text-charcoal">{hasActiveFilters ? 'No properties match these filters' : 'No properties are published yet'}</h2><p className="mt-3 text-sm leading-6 text-gray-500">{hasActiveFilters ? 'Try a wider price range, another location or fewer filters.' : 'You can check again later, contact our team or submit a property for review.'}</p><div className="mt-6 flex flex-wrap justify-center gap-3">{hasActiveFilters ? <button type="button" onClick={clearFilters} className="btn-primary">Clear all filters</button> : <><Link href="/contact" className="btn-primary">Tell us what you need</Link><Link href="/list-property" className="btn-outline">List a property</Link></>}</div></div></div>
      ) : viewMode === 'map' ? (
        <section aria-label="Property list and map">
          {loadError && <p role="status" className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Listings are temporarily unavailable. You can still search addresses on the map; search results are not property listings.</p>}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 lg:hidden"><button type="button" onClick={() => setViewMode('grid')} className="inline-flex min-h-10 items-center gap-2 text-sm font-extrabold text-forest"><ArrowLeft className="h-4 w-4" /> Back to listings</button><span className="text-xs text-gray-500">{mappedLabel(sortedProperties)}</span></div>
          <div className="lg:grid lg:grid-cols-[minmax(23rem,30rem)_1fr]">
            <div className="hidden max-h-[720px] space-y-4 overflow-y-auto border-r border-gray-200 bg-ivory p-4 lg:block">
              {displayedProperties.map((property) => renderCard(property, 'map'))}
              {hasMore && <div className="py-3 text-center">{loadMoreButton}</div>}
            </div>
            <PropertyMapView properties={sortedProperties} selectedPropertyId={selectedPropertyId} onSelectProperty={selectProperty} initialAddress={mapAddress} className="h-[68dvh] min-h-[32rem] lg:h-[720px]" emptyMessage={selectedPropertyId ? 'This listing does not have a saved map location yet.' : 'No saved property locations match these results.'} />
          </div>
          {hasMore && <div className="border-t border-gray-200 bg-white py-5 text-center lg:hidden">{loadMoreButton}</div>}
        </section>
      ) : (
        <section className="container-custom py-6 md:py-8" aria-label="Property results">
          {loadError && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>}
          <div className={viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'mx-auto max-w-6xl space-y-5'}>
            {displayedProperties.map((property, index) => <Fragment key={property.id}>{renderCard(property, viewMode)}{viewMode === 'grid' && adsenseConfigured && (index + 1) % 12 === 0 && index !== displayedProperties.length - 1 && <div className="w-full"><AdSense label={`In-feed ad after ${index + 1} listings`} format="horizontal" /></div>}</Fragment>)}
          </div>
          {hasMore && <div className="mt-8 text-center">{loadMoreButton}<p className="mt-3 text-xs text-gray-400">Showing {Math.min(visibleCount, sortedProperties.length)} of {sortedProperties.length} matching properties</p></div>}
        </section>
      )}
    </div>
  );
}

function mappedLabel(properties: Property[]) {
  const count = properties.filter((property) => getPropertyCoordinates(property)).length;
  return `${count} of ${properties.length} mapped`;
}

export default function PropertiesPage() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-forest" /></div>}><PropertiesContent /></Suspense>;
}
