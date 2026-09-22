'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Property, properties as staticProperties } from '@/data/properties';
import DemoBadge from '@/components/DemoBadge';

interface SimilarPropertiesProps {
  currentProperty: any; // allow DB shape or static shape
}

export default function SimilarProperties({ currentProperty }: SimilarPropertiesProps) {
  const [dbList, setDbList] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSimilar = async () => {
      try {
        const params = new URLSearchParams();
        // Prefer same state and type to get relevant DB pool
        if (currentProperty.state) params.set('state', currentProperty.state);
        if (currentProperty.type) params.set('type', currentProperty.type);
        params.set('status', 'available');
        params.set('limit', '12');
        const res = await fetch(`/api/properties?${params.toString()}`);
        if (res.ok) {
          const j = await res.json();
          const list = j.properties || [];
          if (!cancelled) {
            if (list.length > 0) {
              // normalize DB shapes to static-like for scoring
              const normalized = list.map((p: any) => ({
                id: p.id,
                slug: p.slug,
                title: p.title,
                price: p.price,
                state: p.state,
                area: p.area,
                propertyType: p.property_type || p.propertyType,
                type: p.type,
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                sqm: p.sqm,
                images: p.images || (p.property_images?.map((x: any) => x.url) || ['/placeholder.jpg']),
                verificationStatus: p.verification_status || p.verificationStatus,
                featured: p.featured,
              }));
              setDbList(normalized);
              setIsDemo(false);
            } else {
              setIsDemo(true);
            }
          }
        } else {
          if (!cancelled) setIsDemo(true);
        }
      } catch {
        if (!cancelled) setIsDemo(true);
      }
    };
    fetchSimilar();
    return () => { cancelled = true; };
  }, [currentProperty.id, currentProperty.state, currentProperty.type]);

  // Choose pool: DB if available, otherwise static fallback (editorial/demo)
  const pool: any[] = dbList.length > 0 ? dbList : staticProperties as any[];

  const getSimilarityScore = (property: any): number => {
    if (property.id === currentProperty.id) return -1;
    if (property.slug === currentProperty.slug) return -1;

    let score = 0;

    const curArea = currentProperty.area;
    const curState = currentProperty.state;
    const curType = currentProperty.propertyType || currentProperty.property_type;
    const curListingType = currentProperty.type;
    const curPrice = currentProperty.price;
    const curBeds = currentProperty.bedrooms;

    if (property.area === curArea) score += 30;
    else if (property.state === curState) score += 15;

    if ((property.propertyType || property.property_type) === curType) score += 20;
    if (property.type === curListingType) score += 10;

    if (curPrice) {
      const priceDiff = Math.abs(property.price - curPrice) / curPrice;
      if (priceDiff <= 0.3) score += 20;
      else if (priceDiff <= 0.5) score += 10;
    }

    const bedroomDiff = Math.abs((property.bedrooms || 0) - (curBeds || 0));
    if (bedroomDiff === 0) score += 15;
    else if (bedroomDiff === 1) score += 10;
    else if (bedroomDiff === 2) score += 5;

    if ((property.verificationStatus || property.verification_status) === 'verified') score += 5;

    return score;
  };

  const similarProperties = pool
    .map((property) => ({
      property,
      score: getSimilarityScore(property),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.property);

  if (similarProperties.length === 0) return null;

  const poolLabel = dbList.length > 0 ? 'Similar Properties' : 'Similar Properties · Demo pool';

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-charcoal mb-2">{poolLabel}</h2>
            <p className="text-gray-600">Properties you might also like</p>
            {isDemo && (
              <div className="mt-3">
                <DemoBadge label="Demo pool — live similar listings from Supabase will appear here once available" />
              </div>
            )}
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
            <Link key={property.id || property.slug} href={`/properties/${property.slug}`} className="card hover-lift group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={property.images?.[0] || '/placeholder.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {property.featured && <span className="badge-featured text-xs">Featured</span>}
                  {(property.verificationStatus === 'verified' || property.verification_status === 'verified') && (
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                  <p className="text-lg font-bold text-forest">₦{(property.price / 1000000).toFixed(0)}M</p>
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
          <Link href={`/properties?type=${currentProperty.type}&state=${currentProperty.state}`} className="btn-primary">
            View More Similar Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
