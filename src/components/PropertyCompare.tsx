'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '@/data/properties';

interface PropertyCompareProps {
  properties: Property[];
}

export default function PropertyCompare({ properties }: PropertyCompareProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('compareProperties');
    if (saved) {
      setSelectedProperties(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('compareProperties', JSON.stringify(selectedProperties));
  }, [selectedProperties]);

  const toggleProperty = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    } else if (selectedProperties.length < 4) {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const clearAll = () => {
    setSelectedProperties([]);
    setShowCompare(false);
  };

  const propertiesToCompare = properties.filter(p => selectedProperties.includes(p.id));

  const formatPrice = (price: number, period?: string) => {
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(1)}B${period ? `/${period}` : ''}`;
    } else if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(0)}M${period ? `/${period}` : ''}`;
    }
    return `₦${price.toLocaleString()}${period ? `/${period}` : ''}`;
  };

  if (selectedProperties.length === 0) return null;

  return (
    <>
      {/* Floating Compare Bar */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-strong p-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-charcoal">
            Compare Properties ({selectedProperties.length}/4)
          </h3>
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-charcoal"
          >
            Clear All
          </button>
        </div>
        
        <div className="space-y-2 mb-3">
          {propertiesToCompare.map(property => (
            <div key={property.id} className="flex items-center justify-between p-2 bg-ivory rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{property.title}</p>
                <p className="text-xs text-gray-500">{formatPrice(property.price)}</p>
              </div>
              <button
                onClick={() => toggleProperty(property.id)}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowCompare(true)}
          disabled={selectedProperties.length < 2}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Compare {selectedProperties.length} Properties
        </button>
      </div>

      {/* Compare Modal */}
      {showCompare && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-charcoal">Property Comparison</h2>
              <button
                onClick={() => setShowCompare(false)}
                className="text-gray-500 hover:text-charcoal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {propertiesToCompare.map(property => (
                  <div key={property.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white font-bold">{formatPrice(property.price, property.pricePeriod)}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="font-bold text-charcoal mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.area}, {property.state}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-charcoal">{property.propertyType}</span>
                        </div>
                        {property.bedrooms > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bedrooms:</span>
                            <span className="font-medium text-charcoal">{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bathrooms:</span>
                            <span className="font-medium text-charcoal">{property.bathrooms}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium text-charcoal">{property.sqm} sqm</span>
                        </div>
                        {property.bedrooms > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price/sqm:</span>
                            <span className="font-medium text-magenta">
                              ₦{Math.round(property.price / property.sqm).toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-charcoal capitalize">{property.status}</span>
                        </div>
                        {property.documentation && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Docs:</span>
                            <span className="font-medium text-charcoal">{property.documentation}</span>
                          </div>
                        )}
                      </div>

                      {property.features.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-charcoal mb-2">Key Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {property.features.slice(0, 5).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-ivory text-gray-700 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/properties/${property.slug}`}
                        className="block w-full btn-outline text-center text-sm"
                        onClick={() => setShowCompare(false)}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Compare Button Component for Property Cards
export function CompareButton({ propertyId, isSelected, onToggle }: { 
  propertyId: string; 
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(propertyId);
      }}
      className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
        isSelected
          ? 'bg-magenta text-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md'
      }`}
      title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
  );
}
