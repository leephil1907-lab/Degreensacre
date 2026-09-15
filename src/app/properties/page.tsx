'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { properties } from '@/data/properties';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'sale',
    propertyType: searchParams.get('propertyType') || '',
    state: searchParams.get('state') || '',
    area: searchParams.get('area') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    furnished: searchParams.get('furnished') === 'true',
    serviced: searchParams.get('serviced') === 'true',
    gatedEstate: searchParams.get('gatedEstate') === 'true',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        params.set(key, String(value));
      }
    });
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(p => p.type === filters.type && p.status === 'available');

    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }

    if (filters.state) {
      filtered = filtered.filter(p => p.state === filters.state);
    }

    if (filters.area) {
      filtered = filtered.filter(p => p.area.toLowerCase().includes(filters.area.toLowerCase()));
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    if (filters.furnished) {
      filtered = filtered.filter(p => p.furnished === true);
    }

    if (filters.serviced) {
      filtered = filtered.filter(p => p.serviced === true);
    }

    if (filters.gatedEstate) {
      filtered = filtered.filter(p => p.gatedEstate === true);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }

    return filtered;
  }, [filters]);

  const formatPrice = (price: number, period?: string) => {
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(1)}B`;
    } else if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(0)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-charcoal to-plum text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Find Your Property</h1>
          <p className="text-xl text-white/80">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} available
          </p>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8">
        <div className="container-custom">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-charcoal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Listing Type */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-3">Listing Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'sale', label: 'Buy' },
                        { value: 'rent', label: 'Rent' },
                        { value: 'land', label: 'Land' },
                        { value: 'commercial', label: 'Commercial' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateFilters({ type: type.value })}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                            filters.type === type.value
                              ? 'bg-magenta text-white shadow-md'
                              : 'bg-ivory text-charcoal hover:bg-gray-100'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">State</label>
                    <select
                      value={filters.state}
                      onChange={(e) => updateFilters({ state: e.target.value })}
                      className="input-field"
                    >
                      <option value="">All States</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Enugu">Enugu</option>
                      <option value="Akwa Ibom">Akwa Ibom</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => updateFilters({ bedrooms: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Any</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-3">Amenities</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.furnished}
                          onChange={(e) => updateFilters({ furnished: e.target.checked })}
                          className="w-4 h-4 text-magenta border-gray-300 rounded focus:ring-magenta"
                        />
                        <span className="text-sm text-gray-700">Furnished</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.serviced}
                          onChange={(e) => updateFilters({ serviced: e.target.checked })}
                          className="w-4 h-4 text-magenta border-gray-300 rounded focus:ring-magenta"
                        />
                        <span className="text-sm text-gray-700">Serviced</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.gatedEstate}
                          onChange={(e) => updateFilters({ gatedEstate: e.target.checked })}
                          className="w-4 h-4 text-magenta border-gray-300 rounded focus:ring-magenta"
                        />
                        <span className="text-sm text-gray-700">Gated Estate</span>
                      </label>
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={() => updateFilters({
                      type: 'sale',
                      propertyType: '',
                      state: '',
                      area: '',
                      bedrooms: '',
                      bathrooms: '',
                      minPrice: '',
                      maxPrice: '',
                      furnished: false,
                      serviced: false,
                      gatedEstate: false,
                      sortBy: 'newest'
                    })}
                    className="w-full btn-outline"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Sort and View Controls */}
              <div className="bg-white rounded-xl shadow-soft p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value })}
                    className="input-field py-2 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-magenta text-white' : 'bg-ivory text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-magenta text-white' : 'bg-ivory text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Properties Grid/List */}
              {filteredProperties.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
                  {filteredProperties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/properties/${property.slug}`}
                      className={`card hover-lift group ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                    >
                      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-80 md:flex-shrink-0' : 'h-64'}`}>
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                          {property.featured && <span className="badge-featured">Featured</span>}
                          {property.verified && <span className="badge-verified">Verified</span>}
                          {property.sample && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">Sample</span>}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                          <p className="text-xl font-bold text-magenta">
                            {formatPrice(property.price)}
                            {property.pricePeriod && <span className="text-sm text-gray-600 font-normal">/{property.pricePeriod}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <h3 className="text-lg font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-magenta transition-colors">
                          {property.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 flex items-center">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {property.area}, {property.state}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          {property.bedrooms > 0 && (
                            <span className="text-sm text-gray-600">{property.bedrooms} Beds</span>
                          )}
                          {property.bathrooms > 0 && (
                            <span className="text-sm text-gray-600">{property.bathrooms} Baths</span>
                          )}
                          <span className="text-sm text-gray-600">{property.sqm} sqm</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-soft p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-charcoal mb-2">No Properties Found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={() => updateFilters({
                      type: 'sale',
                      propertyType: '',
                      state: '',
                      area: '',
                      bedrooms: '',
                      bathrooms: '',
                      minPrice: '',
                      maxPrice: '',
                      furnished: false,
                      serviced: false,
                      gatedEstate: false,
                      sortBy: 'newest'
                    })}
                    className="btn-primary"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
