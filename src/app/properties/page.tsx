'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, MapPin, SlidersHorizontal, X, Grid3X3, List,
  Loader2, SearchX, Bed, Bath, Square, Car, Heart, Eye,
  CheckCircle, ChevronDown, Bookmark, BookmarkPlus
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { useAuth } from '@/contexts/AuthContext';

interface PropertyImage {
  url: string;
  display_order: number;
  is_primary: boolean;
}

interface Property {
  id: string;
  slug: string;
  title: string;
  type: string;
  property_type: string;
  price: number;
  price_period?: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  parking: number;
  area: string;
  state: string;
  address?: string;
  description?: string;
  features: string[];
  verification_status: string;
  status: string;
  featured: boolean;
  views: number;
  property_images?: PropertyImage[];
  furnished?: boolean;
  serviced?: boolean;
  gated_estate?: boolean;
  documentation?: string;
}

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  // Read initial state from URL
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    state: searchParams.get('state') || '',
    area: searchParams.get('area') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  });
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date_added');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Fetch properties when filters change
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      params.set('status', 'published');
      if (filters.type) params.set('type', filters.type);
      if (filters.state) params.set('state', filters.state);
      if (filters.area) params.set('area', filters.area);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
      if (sortBy) params.set('orderBy', sortBy === 'newest' ? 'date_added' : sortBy);
      if (sortBy === 'price_asc') {
        params.set('orderBy', 'price');
        params.set('order', 'asc');
      } else if (sortBy === 'price_desc') {
        params.set('orderBy', 'price');
        params.set('order', 'desc');
      }
      params.set('limit', '50');

      const response = await fetch(`/api/properties?${params.toString()}`);
      
      if (!response.ok) throw new Error('Failed to fetch properties');
      
      const data = await response.json();
      setProperties(data.properties || []);
      setTotalCount(data.count || 0);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Update URL when filters change
  const updateUrl = (newFilters: typeof filters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (sortBy) params.set('sort', sortBy);
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const clearFilters = () => {
    const empty = { type: '', state: '', area: '', minPrice: '', maxPrice: '', bedrooms: '' };
    setFilters(empty);
    setSortBy('date_added');
    router.push('/properties', { scroll: false });
  };

  const toggleSaved = async (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

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
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to toggle saved:', error);
    }
  };

  const formatPrice = (price: number, period?: string) => {
    if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(1)}B${period ? `/${period}` : ''}`;
    if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M${period ? `/${period}` : ''}`;
    return `₦${price.toLocaleString()}${period ? `/${period}` : ''}`;
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Header */}
      <div className="bg-white border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScrollReveal direction="up">
            <h1 className="text-4xl font-serif text-charcoal-900 mb-2">Properties</h1>
            <p className="text-charcoal-600">
              {loading ? 'Loading...' : `${totalCount} properties available`}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="Search by area, address..."
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Type filter */}
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
                <option value="short-let">Short Let</option>
              </select>

              {/* State filter */}
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All States</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja (FCT)</option>
                <option value="Rivers">Rivers</option>
                <option value="Akwa Ibom">Akwa Ibom</option>
                <option value="Oyo">Oyo</option>
                <option value="Enugu">Enugu</option>
                <option value="Delta">Delta</option>
                <option value="Kano">Kano</option>
              </select>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-charcoal-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">Min Price</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="₦0"
                      className="w-full px-3 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">Max Price</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="No limit"
                      className="w-full px-3 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="date_added">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-charcoal-400 hover:bg-charcoal-50'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-charcoal-400 hover:bg-charcoal-50'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <SearchX className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal-900 mb-2">Something went wrong</h3>
            <p className="text-charcoal-500">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <SearchX className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal-900 mb-2">No properties found</h3>
            <p className="text-charcoal-500 mb-6">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {properties.map((property, index) => (
              <ScrollReveal key={property.id} direction="up" delay={index * 0.05}>
                <Link
                  href={`/properties/${property.slug}`}
                  className={`block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                    {property.property_images && property.property_images.length > 0 ? (
                      <img
                        src={property.property_images[0]?.url}
                        alt={property.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-56 bg-charcoal-100 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-charcoal-300" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.type === 'sale' ? 'bg-green-500 text-white' :
                        property.type === 'rent' ? 'bg-blue-500 text-white' :
                        property.type === 'land' ? 'bg-amber-500 text-white' :
                        'bg-charcoal-500 text-white'
                      }`}>
                        {property.type === 'sale' ? 'For Sale' :
                         property.type === 'rent' ? 'For Rent' :
                         property.type === 'land' ? 'Land' :
                         property.type === 'short-let' ? 'Short Let' :
                         property.type}
                      </span>
                      {property.verification_status === 'verified' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {property.featured && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-magenta-500 text-white">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Save button */}
                    <button
                      onClick={(e) => toggleSaved(property.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      {savedIds.has(property.id) ? (
                        <Bookmark className="w-4 h-4 text-green-600 fill-green-600" />
                      ) : (
                        <BookmarkPlus className="w-4 h-4 text-charcoal-600" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1">
                    <h3 className="font-serif text-lg text-charcoal-900 mb-1 group-hover:text-green-700 transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-charcoal-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{property.area}, {property.state}</span>
                    </div>

                    <p className="text-green-600 text-xl font-bold mb-3">
                      {formatPrice(property.price, property.price_period)}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-charcoal-600">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          {property.bathrooms}
                        </span>
                      )}
                      {property.sqm > 0 && (
                        <span className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          {property.sqm}sqm
                        </span>
                      )}
                      {property.parking > 0 && (
                        <span className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          {property.parking}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-charcoal-100">
                      <span className="text-xs text-charcoal-400">{property.property_type}</span>
                      <span className="flex items-center gap-1 text-xs text-charcoal-400">
                        <Eye className="w-3 h-3" />
                        {property.views}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
