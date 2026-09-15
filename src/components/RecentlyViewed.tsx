'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Property } from '@/data/properties';

interface RecentlyViewedProps {
  currentProperty?: Property;
}

export default function RecentlyViewed({ currentProperty }: RecentlyViewedProps) {
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Get recently viewed properties from localStorage
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter out current property if provided
        const filtered = currentProperty 
          ? parsed.filter((p: Property) => p.id !== currentProperty.id)
          : parsed;
        setRecentProperties(filtered.slice(0, 4));
      } catch (e) {
        console.error('Error parsing recently viewed:', e);
      }
    }
  }, [currentProperty]);

  // Add current property to recently viewed
  useEffect(() => {
    if (currentProperty) {
      const stored = localStorage.getItem('recentlyViewed');
      let recent: Property[] = stored ? JSON.parse(stored) : [];
      
      // Remove current property if it exists
      recent = recent.filter(p => p.id !== currentProperty.id);
      
      // Add current property to the beginning
      recent.unshift(currentProperty);
      
      // Keep only last 10 properties
      recent = recent.slice(0, 10);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(recent));
    }
  }, [currentProperty]);

  if (recentProperties.length === 0) return null;

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-charcoal mb-2">Recently Viewed</h2>
            <p className="text-gray-600">Properties you&apos;ve recently browsed</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('recentlyViewed');
              setRecentProperties([]);
            }}
            className="text-sm text-gray-600 hover:text-forest transition-colors"
          >
            Clear History
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProperties.map((property) => (
            <Link key={property.id} href={`/properties/${property.slug}`} className="card hover-lift group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {property.featured && <span className="badge-featured text-xs">Featured</span>}
                  {property.verificationStatus === 'verified' && (
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                
                {/* Price */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                  <p className="text-lg font-bold text-forest">
                    ₦{(property.price / 1000000).toFixed(0)}M
                  </p>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-base font-bold text-charcoal mb-1 line-clamp-2 group-hover:text-forest transition-colors">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.area}, {property.state}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-600">
                  {property.bedrooms > 0 && <span>{property.bedrooms} Beds</span>}
                  {property.bathrooms > 0 && <span>{property.bathrooms} Baths</span>}
                  <span>{property.sqm} sqm</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
