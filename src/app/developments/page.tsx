'use client';

import Link from 'next/link';
import { developments } from '@/data/developments';
import ScrollReveal from '@/components/ScrollReveal';
import { MapPin, Building2 } from 'lucide-react';

export default function DevelopmentsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=90"
          alt="Property Developments"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <h1 className="text-display-lg md:text-display-xl font-bold mb-4">
              Property Developments
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Discover premium estates and development projects across Nigeria
            </p>
          </div>
        </div>
      </section>

      {/* Developments Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developments.map((development, i) => (
              <ScrollReveal key={development.id} delay={i * 0.1}>
                <Link
                  href={`/developments/${development.slug}`}
                  className="card hover-lift group block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={development.gallery[0]}
                      alt={development.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-forest text-white text-xs font-bold px-3 py-1 rounded-full">
                        {development.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-sm text-gray-600">Starting from</p>
                        <p className="text-xl font-bold text-forest">
                          ₦{(development.unitTypes[0].price / 1000000).toFixed(0)}M
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-forest transition-colors">
                      {development.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-forest" />
                      {development.location}, {development.state}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {development.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-charcoal">{development.totalUnits}</span> units
                      </div>
                      <div className="text-sm text-forest font-semibold">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {developments.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-charcoal mb-2">No Developments Yet</h3>
              <p className="text-gray-600">Check back soon for exciting new development projects.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-forest to-forest-600 text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Interested in Property Development?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Partner with De-Greenacres for your next development project or invest in our premium estates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="btn-primary bg-white text-forest hover:bg-ivory">
                Contact Our Team
              </Link>
              <a
                href="https://wa.me/2347041754800?text=Hello%20De-Greenacres,%20I'm%20interested%20in%20property%20developments.%20Please%20send%20me%20more%20information."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white text-white hover:bg-white hover:text-forest"
              >
                Chat on WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
