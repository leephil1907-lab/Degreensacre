'use client';

import { useState } from 'react';
import GoogleMapComponent from './GoogleMap';

interface NeighborhoodData {
  name: string;
  state: string;
  coordinates: { lat: number; lng: number };
  stats: {
    avgPrice: number;
    pricePerSqm: number;
    properties: number;
    appreciation: number;
  };
  amenities: {
    hospitals: number;
    schools: number;
    markets: number;
    banks: number;
    restaurants: number;
  };
  ratings: {
    safety: number;
    infrastructure: number;
    accessibility: number;
    development: number;
  };
}

const neighborhoods: NeighborhoodData[] = [
  {
    name: 'Lekki Phase 1',
    state: 'Lagos',
    coordinates: { lat: 6.4434, lng: 3.4532 },
    stats: {
      avgPrice: 150000000,
      pricePerSqm: 400000,
      properties: 45,
      appreciation: 25
    },
    amenities: {
      hospitals: 8,
      schools: 15,
      markets: 12,
      banks: 20,
      restaurants: 35
    },
    ratings: {
      safety: 8,
      infrastructure: 9,
      accessibility: 8,
      development: 9
    }
  },
  {
    name: 'Ikoyi',
    state: 'Lagos',
    coordinates: { lat: 6.4519, lng: 3.4297 },
    stats: {
      avgPrice: 350000000,
      pricePerSqm: 600000,
      properties: 28,
      appreciation: 20
    },
    amenities: {
      hospitals: 12,
      schools: 20,
      markets: 8,
      banks: 25,
      restaurants: 45
    },
    ratings: {
      safety: 9,
      infrastructure: 10,
      accessibility: 9,
      development: 10
    }
  },
  {
    name: 'Maitama',
    state: 'Abuja',
    coordinates: { lat: 9.0833, lng: 7.4913 },
    stats: {
      avgPrice: 400000000,
      pricePerSqm: 500000,
      properties: 32,
      appreciation: 22
    },
    amenities: {
      hospitals: 10,
      schools: 18,
      markets: 6,
      banks: 22,
      restaurants: 30
    },
    ratings: {
      safety: 10,
      infrastructure: 10,
      accessibility: 9,
      development: 10
    }
  },
  {
    name: 'Independence Layout',
    state: 'Enugu',
    coordinates: { lat: 6.4461, lng: 7.5015 },
    stats: {
      avgPrice: 180000000,
      pricePerSqm: 300000,
      properties: 18,
      appreciation: 18
    },
    amenities: {
      hospitals: 6,
      schools: 12,
      markets: 8,
      banks: 15,
      restaurants: 20
    },
    ratings: {
      safety: 8,
      infrastructure: 8,
      accessibility: 8,
      development: 8
    }
  },
  {
    name: 'Shelter Afrique',
    state: 'Akwa Ibom',
    coordinates: { lat: 5.0283, lng: 7.9287 },
    stats: {
      avgPrice: 80000000,
      pricePerSqm: 150000,
      properties: 22,
      appreciation: 28
    },
    amenities: {
      hospitals: 5,
      schools: 10,
      markets: 6,
      banks: 12,
      restaurants: 15
    },
    ratings: {
      safety: 9,
      infrastructure: 8,
      accessibility: 7,
      development: 8
    }
  }
];

export default function InteractiveNeighborhoodMap() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodData | null>(null);
  const [filterState, setFilterState] = useState<string>('all');

  const filteredNeighborhoods = filterState === 'all' 
    ? neighborhoods 
    : neighborhoods.filter(n => n.state === filterState);

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <div
        key={i}
        className={`h-2 flex-1 rounded ${i < rating ? 'bg-forest' : 'bg-gray-200'}`}
      />
    ));
  };

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-charcoal mb-4">Interactive Neighborhood Explorer</h2>
          <p className="text-lg text-gray-600">
            Explore neighborhoods with detailed insights on pricing, amenities, and ratings
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {['all', 'Lagos', 'Abuja', 'Enugu', 'Akwa Ibom'].map(state => (
            <button
              key={state}
              onClick={() => setFilterState(state)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filterState === state
                  ? 'bg-forest text-white'
                  : 'bg-white text-charcoal hover:bg-forest/10'
              }`}
            >
              {state === 'all' ? 'All States' : state}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Google Map */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <GoogleMapComponent
              locations={filteredNeighborhoods.map(n => ({
                id: n.name,
                name: n.name,
                position: n.coordinates,
                type: 'property' as const,
                address: `${n.name}, ${n.state} State`,
                description: `Average price: ₦${(n.stats.avgPrice / 1000000).toFixed(0)}M | ${n.stats.properties} properties available`
              }))}
              center={filteredNeighborhoods.length > 0 ? filteredNeighborhoods[0].coordinates : undefined}
              zoom={filteredNeighborhoods.length === 1 ? 14 : 6}
              height="500px"
              onLocationClick={(location) => {
                const neighborhood = neighborhoods.find(n => n.name === location.name);
                if (neighborhood) {
                  setSelectedNeighborhood(neighborhood);
                }
              }}
            />
          </div>

          {/* Neighborhood List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {filteredNeighborhoods.map((neighborhood, index) => (
              <div
                key={index}
                onClick={() => setSelectedNeighborhood(neighborhood)}
                className={`bg-white rounded-xl p-6 shadow-soft cursor-pointer transition-all hover:shadow-medium ${
                  selectedNeighborhood?.name === neighborhood.name ? 'ring-2 ring-forest' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-charcoal mb-1">{neighborhood.name}</h3>
                    <p className="text-sm text-gray-600">{neighborhood.state} State</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-forest">
                      ₦{(neighborhood.stats.avgPrice / 1000000).toFixed(0)}M
                    </div>
                    <div className="text-xs text-gray-500">Avg. Price</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-ivory rounded-lg">
                    <div className="text-lg font-bold text-charcoal">{neighborhood.stats.properties}</div>
                    <div className="text-xs text-gray-600">Properties</div>
                  </div>
                  <div className="text-center p-3 bg-ivory rounded-lg">
                    <div className="text-lg font-bold text-charcoal">₦{(neighborhood.stats.pricePerSqm / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-600">Per sqm</div>
                  </div>
                  <div className="text-center p-3 bg-ivory rounded-lg">
                    <div className="text-lg font-bold text-green-600">+{neighborhood.stats.appreciation}%</div>
                    <div className="text-xs text-gray-600">Growth</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      🏥 {neighborhood.amenities.hospitals}
                    </span>
                    <span className="text-gray-600">
                      🏫 {neighborhood.amenities.schools}
                    </span>
                    <span className="text-gray-600">
                      🏪 {neighborhood.amenities.markets}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">Safety:</span>
                    <span className="font-bold text-forest">{neighborhood.ratings.safety}/10</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Neighborhood Details */}
        {selectedNeighborhood && (
          <div className="mt-8 bg-white rounded-2xl shadow-soft p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-charcoal mb-2">{selectedNeighborhood.name}</h3>
                <p className="text-gray-600">{selectedNeighborhood.state} State, Nigeria</p>
              </div>
              <button
                onClick={() => setSelectedNeighborhood(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Market Stats */}
              <div>
                <h4 className="text-lg font-bold text-charcoal mb-4">Market Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-ivory rounded-lg">
                    <span className="text-gray-600">Average Property Price</span>
                    <span className="font-bold text-forest">₦{(selectedNeighborhood.stats.avgPrice / 1000000).toFixed(0)}M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-ivory rounded-lg">
                    <span className="text-gray-600">Price per Square Meter</span>
                    <span className="font-bold text-forest">₦{selectedNeighborhood.stats.pricePerSqm.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-ivory rounded-lg">
                    <span className="text-gray-600">Available Properties</span>
                    <span className="font-bold text-charcoal">{selectedNeighborhood.stats.properties}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-ivory rounded-lg">
                    <span className="text-gray-600">Annual Appreciation</span>
                    <span className="font-bold text-green-600">+{selectedNeighborhood.stats.appreciation}%</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-lg font-bold text-charcoal mb-4">Nearby Amenities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg">
                    <span className="text-2xl">🏥</span>
                    <div>
                      <div className="font-bold text-charcoal">{selectedNeighborhood.amenities.hospitals}</div>
                      <div className="text-xs text-gray-600">Hospitals</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg">
                    <span className="text-2xl">🏫</span>
                    <div>
                      <div className="font-bold text-charcoal">{selectedNeighborhood.amenities.schools}</div>
                      <div className="text-xs text-gray-600">Schools</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg">
                    <span className="text-2xl">🏪</span>
                    <div>
                      <div className="font-bold text-charcoal">{selectedNeighborhood.amenities.markets}</div>
                      <div className="text-xs text-gray-600">Markets</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg">
                    <span className="text-2xl">🏦</span>
                    <div>
                      <div className="font-bold text-charcoal">{selectedNeighborhood.amenities.banks}</div>
                      <div className="text-xs text-gray-600">Banks</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg col-span-2">
                    <span className="text-2xl">🍽️</span>
                    <div>
                      <div className="font-bold text-charcoal">{selectedNeighborhood.amenities.restaurants}</div>
                      <div className="text-xs text-gray-600">Restaurants & Cafes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="mt-8">
              <h4 className="text-lg font-bold text-charcoal mb-4">Neighborhood Ratings</h4>
              <div className="space-y-4">
                {Object.entries(selectedNeighborhood.ratings).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-charcoal capitalize">{key}</span>
                      <span className="font-bold text-forest">{value}/10</span>
                    </div>
                    <div className="flex gap-1">
                      {renderRatingStars(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href={`/properties?state=${selectedNeighborhood.state}&area=${selectedNeighborhood.name}`}
                className="btn-primary w-full"
              >
                View Properties in {selectedNeighborhood.name}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
