'use client';

import Link from 'next/link';
import { properties } from '@/data/properties';
import ScrollReveal from '@/components/ScrollReveal';
import { MapPin, FileCheck, CreditCard, Eye, TreePine, ArrowRight, CheckCircle, Phone } from 'lucide-react';

export default function LandPage() {
  const landProperties = properties.filter(p => p.type === 'land');

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest to-forest-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-4">🌍 LAND INVESTMENT</p>
            <h1 className="font-display text-5xl md:text-6xl mb-6">Verified Land.<br /><em className="text-sage">Secure Your Future.</em></h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Every plot reviewed by De-Greenacres. Clear documentation. Flexible payment plans available. Physical inspections before you commit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#listings" className="bg-white text-forest px-8 py-4 rounded-xl font-bold text-lg hover:bg-sage hover:text-white transition-all inline-flex items-center justify-center gap-2">
                View Available Plots <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/book-inspection" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-forest transition-all inline-flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" /> Book Inspection — ₦20,000
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom">
          <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-6 text-center">Where We Have Land</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { city: 'Uyo', state: 'Akwa Ibom', focus: 'Residential & Commercial' },
              { city: 'Lagos', state: 'Lagos', focus: 'Premium Estates' },
              { city: 'Abuja', state: 'Abuja', focus: 'Government Areas' },
              { city: 'Port Harcourt', state: 'Rivers', focus: 'Oil City Plots' },
              { city: 'Asaba', state: 'Delta', focus: 'Growing Market' },
              { city: 'Enugu', state: 'Enugu', focus: 'Southeast Hub' },
            ].map((loc) => (
              <div key={loc.city} className="bg-ivory border border-gray-100 rounded-xl p-4 text-center hover:shadow-lg hover:border-forest/30 transition-all cursor-pointer">
                <MapPin className="w-5 h-5 text-forest mx-auto mb-2" />
                <h3 className="font-bold text-charcoal text-sm">{loc.city}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">{loc.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Land Listings */}
      <section id="listings" className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="mb-12">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">AVAILABLE PLOTS</p>
              <h2 className="font-display text-4xl text-charcoal mb-2">Land for Sale</h2>
              <p className="text-gray-600">Each listing shows documentation status, plot size and inspection details.</p>
            </div>
          </ScrollReveal>

          {landProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
              <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-charcoal mb-2">No land listings right now</h3>
              <p className="text-gray-500 mb-6">New plots are added regularly. Contact us for upcoming availability.</p>
              <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%27m%20interested%20in%20land%20investment.%20Please%20notify%20me%20of%20new%20listings." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-500 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Get Notified on WhatsApp
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {landProperties.map((property, i) => (
                <ScrollReveal key={property.id} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      {/* Image */}
                      <div className="relative h-64 lg:h-auto overflow-hidden">
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-amber-600 text-white px-3 py-1 text-xs font-bold rounded-md">LAND</span>
                          {property.verified && (
                            <span className="bg-white/95 text-forest px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Documentation Reviewed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-6 lg:p-8 lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-display text-2xl text-charcoal mb-2">{property.title}</h3>
                            <p className="text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-forest" />
                              {property.area}, {property.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-3xl text-forest">₦{(property.price / 1000000).toFixed(0)}M</p>
                            {property.pricePerSqm && (
                              <p className="text-xs text-gray-500">₦{property.pricePerSqm.toLocaleString()}/sqm</p>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed">{property.description}</p>

                        {/* Land Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plot Size</p>
                            <p className="font-bold text-charcoal">{property.sqm || property.landSize || '—'} sqm</p>
                          </div>
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Documentation</p>
                            <p className="font-bold text-charcoal flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5 text-forest" />
                              {property.documentation || 'Available on request'}
                            </p>
                          </div>
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Plan</p>
                            <p className="font-bold text-charcoal">
                              {property.paymentPlan || 'Contact us'}
                            </p>
                          </div>
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Development</p>
                            <p className="font-bold text-charcoal">
                              {property.developmentStatus || 'Ready to build'}
                            </p>
                          </div>
                        </div>

                        {/* Features */}
                        {property.features && property.features.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {property.features.map((f: string) => (
                              <span key={f} className="text-xs bg-sage/10 text-forest px-3 py-1 rounded-full font-medium">{f}</span>
                            ))}
                          </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a
                            href={`https://wa.me/2347041754800?text=${encodeURIComponent(`Hello De-Greenacres, I'm interested in the land: ${property.title} at ${property.area}, ${property.state} (${property.sqm || property.landSize}sqm, ₦${(property.price / 1000000).toFixed(0)}M). Please send me more details.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-500 transition-all"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Enquire on WhatsApp
                          </a>
                          <Link
                            href={`/book-inspection?property=${encodeURIComponent(property.title)}&location=${encodeURIComponent(property.area)}&state=${encodeURIComponent(property.state)}`}
                            className="flex items-center justify-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-bold hover:bg-forest-light transition-all"
                          >
                            <Eye className="w-5 h-5" /> Book Inspection — ₦20,000
                          </Link>
                          <Link
                            href={`tel:+2348065019971`}
                            className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                          >
                            <Phone className="w-5 h-5" /> Speak With Agent
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Buy Land With De-Greenacres */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">WHY BUY LAND WITH US</p>
              <h2 className="font-display text-4xl text-charcoal">Land investment, done properly</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileCheck, title: 'Documentation Reviewed', desc: 'We review C of O, Governor\'s Consent, Gazette or Excision before listing.' },
              { icon: Eye, title: 'Physical Inspection', desc: 'See the land in person with our team before you commit. ₦20,000.' },
              { icon: CreditCard, title: 'Flexible Payment', desc: 'Selected plots available with structured instalment plans.' },
              { icon: MapPin, title: 'Strategic Locations', desc: 'Plots in high-growth areas with road access and development potential.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all text-center group">
                  <div className="w-14 h-14 bg-forest/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-forest transition-all">
                    <item.icon className="w-7 h-7 text-forest group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-forest to-forest-dark text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl mb-4">Don&apos;t buy land blind</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Book a physical inspection with our team. See the plot, check the surroundings, review documentation on-site.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book-inspection" className="bg-white text-forest px-10 py-4 rounded-xl font-bold text-lg hover:bg-sage hover:text-white transition-all">
                Book Inspection — ₦20,000
              </Link>
              <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%27m%20interested%20in%20land%20investment.%20What%20plots%20do%20you%20have%20available%3F" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-forest transition-all flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Ask on WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
