'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { properties } from '@/data/properties';
import ScrollReveal from '@/components/ScrollReveal';
import InvestmentCalculator from '@/components/InvestmentCalculator';
import AIPropertyMatchmaker from '@/components/AIPropertyMatchmaker';
import MortgageCalculatorHub from '@/components/MortgageCalculatorHub';
import PropertyCompare from '@/components/PropertyCompare';
import Testimonials from '@/components/Testimonials';
import LandTitleVerification from '@/components/LandTitleVerification';
import { Search, MapPin, ArrowRight, Shield, TrendingUp, Zap, Star, Calculator, Brain, GitCompare, FileCheck, Map as MapIcon, Loader2 } from 'lucide-react';

// Dynamic imports for components that use window/browser APIs
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto mb-2" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const sampleProperties = properties.filter(p => p.sample && p.featured).slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
            alt="Luxury Property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 container-custom w-full py-20">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">Nigeria's Premium Property Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight tracking-tight">
              Discover Properties<br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                Worth Knowing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in font-light">
              Curated homes, land, and investment opportunities across Nigeria's most promising markets
            </p>

            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 max-w-5xl mx-auto animate-fade-in border border-white/20">
              <div className="flex flex-wrap gap-2 mb-8">
                {['Buy', 'Rent', 'Land', 'Commercial', 'Shortlet'].map((tab, index) => (
                  <button
                    key={tab}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                      index === 0
                        ? 'bg-gradient-to-r from-forest to-forest-light text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <select className="input-field">
                    <option>All Locations</option>
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Enugu</option>
                    <option>Akwa Ibom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                  <select className="input-field">
                    <option>All Types</option>
                    <option>Detached Duplex</option>
                    <option>Semi-Detached</option>
                    <option>Land</option>
                    <option>Apartment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                  <select className="input-field">
                    <option>Any Price</option>
                    <option>Under ₦50M</option>
                    <option>₦50M - ₦100M</option>
                    <option>₦100M - ₦200M</option>
                    <option>Above ₦200M</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                  <select className="input-field">
                    <option>Any</option>
                    <option>2+</option>
                    <option>3+</option>
                    <option>4+</option>
                    <option>5+</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="btn-primary w-full py-4 text-lg">
                    <span className="flex items-center justify-center space-x-2">
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-gradient-to-b from-ivory to-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-magenta font-semibold text-sm uppercase tracking-wider mb-2">Premium Selection</p>
                <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">Featured Properties</h2>
                <p className="text-lg text-gray-600">Handpicked premium properties across Nigeria</p>
              </div>
              <Link href="/properties" className="hidden md:inline-flex items-center text-forest hover:text-forest-600 font-semibold group">
                View All
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sampleProperties.map((property, i) => (
              <ScrollReveal key={property.id} delay={i * 0.1}>
                <Link href={`/properties/${property.slug}`} className="group block">
                  <div className="card hover-lift overflow-hidden bg-white rounded-2xl shadow-lg">
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {property.featured && <span className="badge-featured">Featured</span>}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <p className="text-3xl font-bold text-white mb-1">
                          ₦{(property.price / 1000000).toFixed(0)}M
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-charcoal mb-3 line-clamp-2 group-hover:text-forest transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-forest flex-shrink-0" />
                        {property.area}, {property.state}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {property.bedrooms > 0 && (
                          <span className="text-sm text-gray-600 font-medium">{property.bedrooms} Beds</span>
                        )}
                        {property.bathrooms > 0 && (
                          <span className="text-sm text-gray-600 font-medium">{property.bathrooms} Baths</span>
                        )}
                        <span className="text-sm text-gray-600 font-medium">{property.sqm} sqm</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-forest/10 rounded-full px-4 py-2 mb-4">
                <MapIcon className="w-5 h-5 text-forest" />
                <span className="text-sm font-semibold text-forest">Explore on Map</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">Find Properties Near You</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Interactive map with property locations across Nigeria. Click markers to see details.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px] md:h-[600px]">
              <InteractiveMap
                locations={sampleProperties.map(p => ({
                  id: p.id,
                  name: p.title,
                  position: {
                    lat: p.state === 'Lagos' ? 6.5244 : p.state === 'Abuja' ? 9.0579 : p.state === 'Enugu' ? 6.4474 : 5.0078,
                    lng: p.state === 'Lagos' ? 3.3792 : p.state === 'Abuja' ? 7.4951 : p.state === 'Enugu' ? 7.5083 : 7.9270,
                  },
                  type: 'property' as const,
                  address: `${p.area}, ${p.state}`,
                  description: `₦${(p.price / 1000000).toFixed(0)}M`,
                }))}
                center={{ lat: 7.5, lng: 5.5 }}
                zoom={6}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Investment Tools Section */}
      <section className="section-padding bg-gradient-to-br from-ivory to-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-magenta/10 rounded-full px-4 py-2 mb-4">
                <Calculator className="w-5 h-5 text-magenta" />
                <span className="text-sm font-semibold text-magenta">Investment Tools</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">Smart Investment Calculators</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Calculate ROI, rental yields, and mortgage payments with Nigerian bank rates
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                <InvestmentCalculator />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                <MortgageCalculatorHub />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* AI Matchmaker Section */}
      <section className="section-padding bg-gradient-to-br from-forest/5 to-sage/5">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">AI-Powered</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">Find Your Perfect Match</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI analyzes your preferences to recommend properties that match your lifestyle
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <AIPropertyMatchmaker />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Property Comparison */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
                <GitCompare className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Compare Properties</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">Side-by-Side Comparison</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Compare up to 4 properties on price, location, features, and investment potential
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="bg-ivory rounded-3xl shadow-xl p-8">
              <PropertyCompare properties={sampleProperties} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Land Title Verification */}
      <section className="section-padding bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
                <FileCheck className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-600">Verify Titles</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">Nigerian Land Title Verification</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Verify C of O, Governor's Consent, and other land titles before you invest
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <LandTitleVerification
                propertyId="demo-001"
                propertyTitle="Sample Property Verification"
                propertyAddress="Lekki Phase 1, Lagos"
                documentationType="C of O"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-magenta font-semibold text-sm uppercase tracking-wider mb-2">Success Stories</p>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">What Our Clients Say</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Testimonials />
          </ScrollReveal>
        </div>
      </section>

      {/* Why De-Greenacres */}
      <section className="section-padding bg-gradient-to-b from-ivory to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-forest/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-magenta/5 to-transparent rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-magenta font-semibold text-sm uppercase tracking-wider mb-2">Why Choose Us</p>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">The De-Greenacres Difference</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Trusted property discovery across Nigeria's most promising markets
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-white to-ivory border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-forest to-forest-light rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-charcoal">CAC Registered</h3>
                <p className="text-gray-600 leading-relaxed">
                  RC: 1856064. Legally registered and accountable for every transaction.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-white to-ivory border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-sage to-sage-light rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-charcoal">Local Expertise</h3>
                <p className="text-gray-600 leading-relaxed">
                  Deep knowledge across Lagos, Abuja, Enugu, Akwa Ibom, and Southeast markets.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-white to-ivory border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-magenta to-magenta-light rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-charcoal">Dedicated Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  From inquiry to closing. We handle the details so you don't have to.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-charcoal via-forest to-forest-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="container-custom text-center relative z-10">
          <ScrollReveal>
            <p className="text-green-300 font-semibold text-sm uppercase tracking-wider mb-4">Ready to Start?</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Property Today
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
              Browse our curated selection of premium properties or list yours with Nigeria's most trusted real estate platform.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/properties" className="btn-primary bg-white text-forest hover:bg-ivory w-full sm:w-auto px-10 py-4 text-lg">
                Browse Properties
              </Link>
              <Link href="/list-property" className="btn-outline border-white text-white hover:bg-white hover:text-charcoal w-full sm:w-auto px-10 py-4 text-lg">
                List Your Property
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
