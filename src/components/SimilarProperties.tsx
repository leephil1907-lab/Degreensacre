'use client';

import Link from 'next/link';
import { Property, properties } from '@/data/properties';

interface SimilarPropertiesProps {
  currentProperty: Property;
}

export default function SimilarProperties({ currentProperty }: SimilarPropertiesProps) {
  // Find similar properties based on:
  // 1. Same location (area or state)
  // 2. Same property type
  // 3. Similar price range (within 30%)
  // 4. Similar bedroom count
  
  const getSimilarityScore = (property: Property): number => {
    if (property.id === currentProperty.id) return -1;
    
    let score = 0;
    
    // Same area (highest priority)
    if (property.area === currentProperty.area) score += 30;
    // Same state
    else if (property.state === currentProperty.state) score += 15;
    
    // Same property type
    if (property.propertyType === currentProperty.propertyType) score += 20;
    
    // Same listing type
    if (property.type === currentProperty.type) score += 10;
    
    // Similar price (within 30%)
    const priceDiff = Math.abs(property.price - currentProperty.price) / currentProperty.price;
    if (priceDiff <= 0.3) score += 20;
    else if (priceDiff <= 0.5) score += 10;
    
    // Similar bedroom count
    const bedroomDiff = Math.abs(property.bedrooms - currentProperty.bedrooms);
    if (bedroomDiff === 0) score += 15;
    else if (bedroomDiff === 1) score += 10;
    else if (bedroomDiff === 2) score += 5;
    
    // Boost verified properties
    if (property.verificationStatus === 'verified') score += 5;
    
    return score;
  };
  
  const similarProperties = properties
    .map(property => ({
      property,
      score: getSimilarityScore(property)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.property);
  
  if (similarProperties.length === 0) return null;
  
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-charcoal mb-2">Similar Properties</h2>
            <p className="text-gray-600">Properties you might also like</p>
          </div>
          <Link 
            href={`/properties?type=${currentProperty.type}&state=${currentProperty.state}`} 
            className="hidden md:inline-flex items-center text-forest hover:text-forest-600 font-semibold"
          >
            View More
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProperties.map((property) => (
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
        
        <div className="text-center mt-6 md:hidden">
          <Link 
            href={`/properties?type=${currentProperty.type}&state=${currentProperty.state}`} 
            className="btn-primary"
          >
            View More Similar Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
