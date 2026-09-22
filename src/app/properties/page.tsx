'use client';

import { Fragment, useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, MapPin, SlidersHorizontal, X, Grid3X3, List, Map as MapIcon,
  Loader2, SearchX, Bed, Bath, Square, Car, Heart, Eye,
  CheckCircle, ChevronDown, Bookmark, BookmarkPlus, Camera, ArrowUpDown,
  Home, Building2, Trees
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { properties as sampleProperties, Property as SampleProperty } from '@/data/properties';
import AdSense from '@/components/GoogleAdsense';

// Leaflet types (loaded dynamically)
let L: any = null;

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  // View state
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'list'>('split');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    state: searchParams.get('state') || '',
    area: searchParams.get('area') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [dbProperties, setDbProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Merge sample properties with DB properties — dedupe by slug (DB wins)
  const sampleMapped = sampleProperties.filter(p => p.status === 'available').map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    type: p.type,
    property_type: p.propertyType,
    price: p.price,
    price_period: p.pricePeriod,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqm: p.sqm,
    parking: p.parking,
    area: p.area,
    state: p.state,
    lga: p.lga,
    features: p.features,
    verification_status: p.verificationStatus || 'unverified',
    status: p.status,
    featured: p.featured,
    views: p.views,
    property_images: p.images.map((url, i) => ({ url, display_order: i, is_primary: i === 0 })),
    furnished: p.furnished,
    serviced: p.serviced,
    gated_estate: p.gatedEstate,
    documentation: p.documentation,
    date_added: p.dateAdded,
    sample: true,
  }));
  const dbBySlug = new Set(dbProperties.map((p: any) => p.slug));
  const allProperties = [
    ...sampleMapped.filter((p) => !dbBySlug.has(p.slug)),
    ...dbProperties,
  ];

  // Filter properties
  const filteredProperties = allProperties.filter(p => {
    if (filters.type && p.type !== filters.type) return false;
    if (filters.state && p.state !== filters.state) return false;
    if (filters.area && !p.area?.toLowerCase().includes(filters.area.toLowerCase())) return false;
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;
    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'newest': return new Date(b.date_added || 0).getTime() - new Date(a.date_added || 0).getTime();
      case 'popular': return (b.views || 0) - (a.views || 0);
      default: return 0;
    }
  });

  // Fetch DB properties
  useEffect(() => {
    const fetchDbProperties = async () => {
      try {
        const params = new URLSearchParams();
        params.set('status', 'published');
        params.set('limit', '50');
        const response = await fetch(`/api/properties?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setDbProperties(data.properties || []);
        }
      } catch (err) {
        console.error('Failed to fetch DB properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDbProperties();
  }, []);

  // Load Leaflet dynamically
  useEffect(() => {
    if (viewMode !== 'split' || mapInstanceRef.current) return;

    const loadMap = async () => {
      // Load CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!L) {
        await new Promise<void>((resolve) => {
          if (typeof window !== 'undefined' && (window as any).L) {
            L = (window as any).L;
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => {
            L = (window as any).L;
            resolve();
          };
          document.head.appendChild(script);
        });
      }

      if (!mapRef.current || !L) return;

      // Create map centered on Nigeria
      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([9.082, 7.491], 6);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [viewMode]);

  // Update markers when properties change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !L) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // State coordinate mapping
    const stateCoords: Record<string, [number, number]> = {
      'Lagos': [6.5244, 3.3792],
      'Abuja': [9.0579, 7.4951],
      'Enugu': [6.4474, 7.5083],
      'Akwa Ibom': [5.0078, 7.9270],
      'Rivers': [4.8156, 7.0164],
      'Oyo': [7.3775, 3.9470],
      'Delta': [5.6947, 5.8987],
      'Kano': [12.0022, 8.5920],
    };

    // Area offsets for properties in same state
    const areaCounters: Record<string, number> = {};

    sortedProperties.forEach((property) => {
      const baseCoords = stateCoords[property.state] || [9.082, 7.491];
      const key = property.state;
      areaCounters[key] = (areaCounters[key] || 0) + 1;
      const offset = areaCounters[key] * 0.02;
      
      const lat = baseCoords[0] + (Math.sin(areaCounters[key]) * offset);
      const lng = baseCoords[1] + (Math.cos(areaCounters[key]) * offset);

      const priceLabel = property.price >= 1000000000
        ? `₦${(property.price / 1000000000).toFixed(1)}B`
        : `₦${(property.price / 1000000).toFixed(0)}M`;

      const isSelected = selectedPropertyId === property.id;
      const isHovered = hoveredPropertyId === property.id;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-price ${isSelected ? 'marker-selected' : ''} ${isHovered ? 'marker-hovered' : ''}">${priceLabel}</div>`,
        iconSize: [80, 32],
        iconAnchor: [40, 16],
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(mapInstanceRef.current)
        .on('click', () => {
          setSelectedPropertyId(property.id);
          // Scroll to card
          const card = document.getElementById(`property-card-${property.id}`);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [mapLoaded, sortedProperties, selectedPropertyId, hoveredPropertyId]);

  // Pan map to selected property
  const panToProperty = (property: any) => {
    if (!mapInstanceRef.current || !L) return;
    const stateCoords: Record<string, [number, number]> = {
      'Lagos': [6.5244, 3.3792],
      'Abuja': [9.0579, 7.4951],
      'Enugu': [6.4474, 7.5083],
      'Akwa Ibom': [5.0078, 7.9270],
      'Rivers': [4.8156, 7.0164],
    };
    const coords = stateCoords[property.state] || [9.082, 7.491];
    mapInstanceRef.current.flyTo(coords, 12, { duration: 0.5 });
  };

  const formatPrice = (price: number, period?: string) => {
    if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(1)}B${period ? `/${period}` : ''}`;
    if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M${period ? `/${period}` : ''}`;
    return `₦${price.toLocaleString()}${period ? `/${period}` : ''}`;
  };

  const toggleSaved = async (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push('/signin'); return; }
    try {
      const response = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId }),
      });
      const data = await response.json();
      if (data.saved) {
        setSavedIds(prev => new Set(prev).add(propertyId));
      } else {
        setSavedIds(prev => { const n = new Set(prev); n.delete(propertyId); return n; });
      }
    } catch (error) { console.error(error); }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: '', state: '', area: '', minPrice: '', maxPrice: '', bedrooms: '' });
    setSortBy('newest');
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="min-h-screen bg-ivory flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      {/* Top Filter Bar - Zillow Style */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Buy/Rent/Land Tabs */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              {[
                { label: 'Buy', value: 'sale', icon: Home },
                { label: 'Rent', value: 'rent', icon: Building2 },
                { label: 'Land', value: 'land', icon: Trees },
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => handleFilterChange('type', filters.type === tab.value ? '' : tab.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    filters.type === tab.value
                      ? 'bg-white text-forest shadow-sm'
                      : 'text-gray-600 hover:text-charcoal'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Location Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search area, city..."
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            {/* State Dropdown */}
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest"
            >
              <option value="">All States</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja (FCT)</option>
              <option value="Enugu">Enugu</option>
              <option value="Akwa Ibom">Akwa Ibom</option>
              <option value="Rivers">Rivers</option>
            </select>

            {/* Price Range */}
            <select
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest hidden md:block"
            >
              <option value="">Any Price</option>
              <option value="30000000">Under ₦30M</option>
              <option value="50000000">Under ₦50M</option>
              <option value="100000000">Under ₦100M</option>
              <option value="200000000">Under ₦200M</option>
              <option value="500000000">Under ₦500M</option>
            </select>

            {/* Bedrooms */}
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest hidden md:block"
            >
              <option value="">Beds</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>

            {/* More Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-forest text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              More
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-white text-forest text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Clear */}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            {/* View Mode Toggles */}
            <div className="flex items-center ml-auto bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'split' ? 'bg-white text-forest shadow-sm' : 'text-gray-500'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Map</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-forest shadow-sm' : 'text-gray-500'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-white text-forest shadow-sm' : 'text-gray-500'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Extended Filters Panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="₦0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="popular">Most Viewed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Verification</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">Any</option>
                  <option value="verified">Verified Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Documentation</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">Any</option>
                  <option value="C of O">C of O</option>
                  <option value="Governor's Consent">Governor's Consent</option>
                  <option value="Deed of Assignment">Deed of Assignment</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results count bar */}
        <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            <span className="font-bold text-charcoal">{sortedProperties.length}</span> properties
            {filters.state && <span> in <span className="font-semibold">{filters.state}</span></span>}
            {filters.type && <span> • <span className="font-semibold capitalize">{filters.type === 'sale' ? 'For Sale' : filters.type === 'rent' ? 'For Rent' : filters.type}</span></span>}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs text-gray-600 border-none bg-transparent focus:ring-0 cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Property List */}
        <div className={`overflow-y-auto ${
          viewMode === 'split' ? 'hidden lg:block lg:w-[480px] xl:w-[520px]' : 'w-full'
        }`}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-forest" />
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="text-center py-20 px-4">
              <SearchX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-charcoal mb-2">No properties found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search area</p>
              <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
            </div>
          ) : (
            <div className={`p-4 ${
              viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' :
              viewMode === 'list' ? 'space-y-3' : 'space-y-3'
            }`}>
              {sortedProperties.map((property, idx) => {
                const isSelected = selectedPropertyId === property.id;
                const isHovered = hoveredPropertyId === property.id;
                const isList = viewMode === 'list';
                const imageUrl = property.property_images?.[0]?.url || property.images?.[0] || '';

                // In-feed ad every 6 listings — AdSense policy friendly, keeps UX clean
                const showInFeedAd = (idx + 1) % 6 === 0 && idx !== sortedProperties.length - 1;

                return (
                  <Fragment key={property.id}>
                  <Link
                    href={`/properties/${property.slug}`}
                    id={`property-card-${property.id}`}
                    className={`block bg-white rounded-xl overflow-hidden transition-all group ${
                      isList ? 'flex' : ''
                    } ${
                      isSelected ? 'ring-2 ring-forest shadow-lg' :
                      isHovered ? 'ring-1 ring-forest/50 shadow-md' :
                      'shadow-sm hover:shadow-md'
                    }`}
                    onMouseEnter={() => {
                      setHoveredPropertyId(property.id);
                      if (viewMode === 'split') panToProperty(property);
                    }}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                    onClick={() => setSelectedPropertyId(property.id)}
                  >
                    {/* Image */}
                    <div className={`relative ${isList ? 'w-72 flex-shrink-0' : ''}`}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={property.title}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                            isList ? 'h-full min-h-[180px]' : 'h-52'
                          }`}
                        />
                      ) : (
                        <div className={`w-full bg-gray-100 flex items-center justify-center ${isList ? 'h-full min-h-[180px]' : 'h-52'}`}>
                          <Camera className="w-8 h-8 text-gray-300" />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                          property.type === 'sale' ? 'bg-forest text-white' :
                          property.type === 'rent' ? 'bg-blue-600 text-white' :
                          property.type === 'land' ? 'bg-amber-600 text-white' :
                          'bg-gray-700 text-white'
                        }`}>
                          {property.type === 'sale' ? 'FOR SALE' :
                           property.type === 'rent' ? 'FOR RENT' :
                           property.type === 'land' ? 'LAND' :
                           property.type === 'short-let' ? 'SHORT LET' :
                           property.type?.toUpperCase()}
                        </span>
                        {property.verification_status === 'verified' && (
                          <span className="px-2 py-1 text-xs font-bold rounded-md bg-white/95 text-forest flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Photo count */}
                      {(property.property_images?.length || property.images?.length) > 1 && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          {property.property_images?.length || property.images?.length}
                        </div>
                      )}

                      {/* Save button */}
                      <button
                        onClick={(e) => toggleSaved(property.id, e)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110 shadow-sm"
                      >
                        {savedIds.has(property.id) ? (
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        ) : (
                          <Heart className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      {/* Price */}
                      <p className="text-2xl font-bold text-charcoal mb-1">
                        {formatPrice(property.price, property.price_period)}
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        {property.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="font-bold text-charcoal">{property.bedrooms}</span> bd
                          </span>
                        )}
                        {property.bathrooms > 0 && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-charcoal">{property.bathrooms}</span> ba
                            </span>
                          </>
                        )}
                        {property.sqm > 0 && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-charcoal">{property.sqm}</span> sqm
                            </span>
                          </>
                        )}
                      </div>

                      {/* Address */}
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {property.title}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {property.area}, {property.state}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {property.documentation && (
                          <span className="text-xs bg-ivory text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                            {property.documentation}
                          </span>
                        )}
                        {property.gated_estate && (
                          <span className="text-xs bg-ivory text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                            Gated Estate
                          </span>
                        )}
                        {property.serviced && (
                          <span className="text-xs bg-ivory text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                            Serviced
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  {showInFeedAd && (
                    <div className="col-span-full">
                      <AdSense label={`In-feed ad after ${idx + 1} listings`} format="horizontal" className="my-2" />
                    </div>
                  )}
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Map Panel - Split on desktop, full-screen on mobile */}
        {viewMode === 'split' && (
          <div className="flex-1 relative">
            {/* Mobile close button */}
            <button
              onClick={() => setViewMode('grid')}
              className="lg:hidden absolute top-3 left-3 z-[1000] bg-white shadow-lg rounded-full px-4 py-2 text-sm font-bold text-charcoal flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Back to List
            </button>
            <div ref={mapRef} className="absolute inset-0 z-10" />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating "Show Map" button on mobile when in grid/list mode */}
      {viewMode !== 'split' && (
        <button
          onClick={() => setViewMode('split')}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-forest text-white shadow-xl rounded-full px-6 py-3 text-sm font-bold flex items-center gap-2"
        >
          <MapIcon className="w-4 h-4" />
          Show Map
        </button>
      )}

      {/* Map marker styles */}
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .marker-price {
          background: white;
          color: #1A1A1A;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: 2px solid transparent;
          transition: all 0.2s;
          cursor: pointer;
          text-align: center;
        }
        .marker-price:hover,
        .marker-hovered {
          background: #2D5016;
          color: white;
          border-color: #2D5016;
          transform: scale(1.1);
          z-index: 1000 !important;
        }
        .marker-selected {
          background: #C41E7A;
          color: white;
          border-color: #C41E7A;
          transform: scale(1.15);
          z-index: 1001 !important;
        }
      `}</style>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
