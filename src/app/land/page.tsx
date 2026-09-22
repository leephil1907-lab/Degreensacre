'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { properties as staticProperties } from '@/data/properties';
import ScrollReveal from '@/components/ScrollReveal';
import { MapPin, FileCheck, CreditCard, Eye, TreePine, ArrowRight, CheckCircle, Phone, Map, Building, Layers, Navigation } from 'lucide-react';
import AdSense from '@/components/GoogleAdsense';

export default function LandPage() {
  const [dbLand, setDbLand] = useState<any[] | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/properties?type=land&status=available&limit=50');
        if (res.ok) {
          const j = await res.json();
          const list = (j.properties || []).map((p: any) => ({
            ...p,
            // normalize DB shape to static Property shape for this page
            images: p.images || p.property_images?.map((x: any) => x.url) || [],
            sqm: p.sqm || p.land_size || 0,
            landSize: p.land_size || p.sqm || 0,
            verified: p.verification_status === 'verified',
            verificationStatus: p.verification_status,
            availablePlots: p.available_plots ?? p.availablePlots ?? null,
            totalPlots: p.total_plots ?? p.totalPlots ?? null,
            paymentPlan: p.payment_plan || p.paymentPlan || null,
            developmentStatus: p.development_status || p.developmentStatus || null,
            pricePerSqm: p.price ? Math.round(p.price / (p.sqm || p.land_size || 1)) : undefined,
            region: p.region || null,
          }));
          if (!cancelled) {
            if (list.length > 0) {
              setDbLand(list);
              setIsDemo(false);
            } else {
              setDbLand(null);
              setIsDemo(true);
            }
          }
        } else if (!cancelled) setIsDemo(true);
      } catch { if (!cancelled) setIsDemo(true); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const landProperties = dbLand && dbLand.length > 0 ? dbLand : staticProperties.filter(p => p.type === 'land');
  const showDemoBanner = isDemo;
  const regions = [...new Set(landProperties.map((p: any) => p.region).filter(Boolean))];
  const [activeRegion, setActiveRegion] = useState('all');
  const [expandedMap, setExpandedMap] = useState<string | null>(null);

  const filtered = activeRegion === 'all' ? landProperties : landProperties.filter((p: any) => p.region === activeRegion);
  const totalAvailable = landProperties.reduce((sum: number, p: any) => sum + (p.availablePlots || 0), 0);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest to-forest-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-4">🌍 LAND INVESTMENT OPPORTUNITIES</p>
            <h1 className="font-display text-5xl md:text-6xl mb-6">Verified Land.<br /><em className="text-sage">Secure Your Future.</em></h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Every plot reviewed by De-Greenacres. Clear documentation. Flexible payment plans available. Physical inspections before you commit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="#listings" className="bg-white text-forest px-8 py-4 rounded-xl font-bold text-lg hover:bg-sage hover:text-white transition-all inline-flex items-center justify-center gap-2">
                View Available Plots <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/book-inspection" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-forest transition-all inline-flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" /> Request Property Inspection
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-sage" /> {landProperties.length} Locations</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage" /> {totalAvailable} Plots Available</span>
              <span className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-sage" /> All Documentation Reviewed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Coastal Highway Goldmine — Flyer Spotlight (MOST RECENT OFFER) */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-amber-50 via-ivory to-white border-y border-amber-200/50">
        <div className="container-custom">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 bg-charcoal p-2">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200" alt="Premium dry land along New Coastal Highway — Uyo" className="w-full h-80 object-cover rounded-2xl" />
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-[11px] font-extrabold text-forest">PRIME LAND</p>
                    <p className="text-[11px] text-gray-600">New corridor</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-[11px] font-extrabold text-forest">DIRECT ACCESS</p>
                    <p className="text-[11px] text-gray-600">Coastal Highway</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-[11px] font-extrabold text-forest">ENDLESS</p>
                    <p className="text-[11px] text-gray-600">Possibilities</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 p-6 md:p-8">
                <div className="inline-flex items-center gap-2 bg-forest text-white px-3 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase">FEATURED · LIMITED SUPPLY</div>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal mt-3 mb-2 leading-tight">The Next Real Estate Goldmine is Here!</h2>
                <p className="text-sm font-bold text-sage uppercase tracking-[0.18em] mb-3">Premium Plots Along the New Coastal Highway — To Calabar · Uyo, Akwa Ibom State</p>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">The Coastal Highway is opening up a <b>new economic corridor</b> — smart investors are securing land <b>before prices surge</b>. Ideal for <b>residential estates, commercial developments, hotels and mixed-use projects</b>. <span className="text-forest font-semibold">High returns · Strategic location · Limited supply.</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                  {[
                    'Strategic location — direct Coastal Highway access',
                    'High potential for rapid value appreciation',
                    'Residential, commercial, hotels, mixed-use',
                    'Secure & verified documentation',
                    'Flexible payment options',
                    '100% genuine land · Maximum value assurance',
                  ].map(t => (
                    <div key={t} className="flex gap-2 text-sm bg-ivory rounded-xl px-3.5 py-2.5 border border-cream">
                      <CheckCircle className="w-4 h-4 text-forest mt-0.5 flex-shrink-0" />
                      <span className="text-charcoal">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-forest text-white rounded-2xl p-5 mb-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-amber-300 mb-1">TODAY’S PRICE WILL NOT BE TOMORROW’S PRICE</p>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="font-display text-3xl text-white">SPREAD: ₦2,500,000</p>
                    <span className="text-sm text-white/70">(Documentation plus all inclusive — 464 sqm)</span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white text-charcoal rounded-xl p-3">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Pay Into</p>
                      <p className="font-extrabold text-forest">WEMA BANK</p>
                      <p>Name: De-Greenacres Properties Limited</p>
                      <p>Account: <b className="font-mono">0126877218</b></p>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%20saw%20the%20Coastal%20Highway%20Uyo%20flyer%20(%E2%82%A62.5M%20spread)%20and%20want%20to%20secure%20my%20plot." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-amber-500 text-charcoal px-5 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all">
                        <Phone className="w-4 h-4" /> Chat on WhatsApp
                      </a>
                      <Link href="/properties/premium-plots-new-coastal-highway-uyo" className="inline-flex items-center justify-center gap-2 bg-white text-forest px-5 py-2.5 rounded-xl font-bold border border-white hover:bg-ivory transition-all">
                        View Plot <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">Secure your plot today. <b>Build Wealth for Generations.</b> · Diaspora-friendly · Home investors · Legacy</p>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-gray-500 mt-4">Featured flyer offer — <b>Uyo, Akwa Ibom State · New Coastal Highway to Calabar</b> — Call/WhatsApp <b>+234 704 175 4800</b> · RC: 1856064</p>
        </div>
      </section>

      {/* Ad — Land page (after Coastal spotlight) */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <AdSense label="Land — Below Coastal Highway Spotlight" format="horizontal" />
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom">
          <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-6 text-center">Where We Have Land</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { city: 'Uyo', state: 'Akwa Ibom', focus: 'Residential & Commercial', region: 'Southeast' },
              { city: 'Lagos', state: 'Lagos', focus: 'Premium Estates', region: 'Southwest' },
              { city: 'Abuja', state: 'Abuja FCT', focus: 'Government Areas', region: 'North Central' },
              { city: 'Port Harcourt', state: 'Rivers', focus: 'Oil City Plots', region: 'South-South' },
              { city: 'Asaba', state: 'Delta', focus: 'Growing Market', region: 'South-South' },
              { city: 'Enugu', state: 'Enugu', focus: 'Southeast Hub', region: 'Southeast' },
            ].map((loc) => (
              <div key={loc.city} className="bg-ivory border border-gray-100 rounded-xl p-4 text-center hover:shadow-lg hover:border-forest/30 transition-all cursor-pointer group">
                <MapPin className="w-5 h-5 text-forest mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-charcoal text-sm">{loc.city}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">{loc.state}</p>
                <p className="text-[10px] text-sage font-semibold mt-1">{loc.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Region Filter */}
      <section id="listings" className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="mb-8">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">AVAILABLE PLOTS</p>
              <h2 className="font-display text-4xl text-charcoal mb-2">Land for Sale</h2>
              <p className="text-gray-600">Each listing shows full details: documentation, plot size, landmarks, map location and available plots.</p>
            </div>
          </ScrollReveal>
          {/* Region filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveRegion('all')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeRegion === 'all' ? 'bg-forest text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-forest'}`}
            >
              All Regions ({landProperties.length})
            </button>
            {regions.map(region => {
              const count = landProperties.filter(p => p.region === region).length;
              return (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region || 'all')}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeRegion === region ? 'bg-forest text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-forest'}`}
                >
                  {region} ({count})
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
              <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-charcoal mb-2">No land listings in this region</h3>
              <p className="text-gray-500 mb-6">New plots are added regularly. Contact us for upcoming availability.</p>
              <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%27m%20interested%20in%20land%20investment.%20Please%20notify%20me%20of%20new%20listings." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-500 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Get Notified on WhatsApp
              </a>
            </div>
          ) : (
            <div className="space-y-8">
              {filtered.map((property, i) => (
                <ScrollReveal key={property.id} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      {/* Image */}
                      <div className="relative h-64 lg:h-auto overflow-hidden">
                        <img src={(property.images?.[0] || (property as any).property_images?.[0]?.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200')} alt={property.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="bg-amber-600 text-white px-3 py-1 text-xs font-bold rounded-md">LAND</span>
                          {property.verified && (
                            <span className="bg-white/95 text-forest px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Docs Reviewed
                            </span>
                          )}
                          {property.region && (
                            <span className="bg-sage/90 text-white px-3 py-1 text-xs font-bold rounded-md">{property.region}</span>
                          )}
                        </div>
                        {/* Available plots badge */}
                        {property.availablePlots && (
                          <div className="absolute bottom-4 left-4 bg-forest text-white px-4 py-2 rounded-xl">
                            <p className="text-lg font-bold leading-none">{property.availablePlots}{property.totalPlots ? `/${property.totalPlots}` : ''}</p>
                            <p className="text-[10px] text-white/70">plots available</p>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-6 lg:p-8 lg:col-span-2">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-display text-2xl text-charcoal mb-1">{property.title}</h3>
                            <p className="text-gray-500 flex items-center gap-1 text-sm">
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

                        <p className="text-gray-600 mb-5 leading-relaxed text-sm">{property.description}</p>

                        {/* Key Details Grid — 6 items */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5 font-bold">Plot Size</p>
                            <p className="font-bold text-charcoal text-sm">{property.sqm || property.landSize} sqm</p>
                          </div>
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5 font-bold">Documentation</p>
                            <p className="font-bold text-charcoal text-sm flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5 text-forest" />
                              {property.documentation || 'On request'}
                            </p>
                          </div>
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5 font-bold">Payment Plan</p>
                            <p className="font-bold text-charcoal text-sm">{property.paymentPlan || 'Full payment'}</p>
                          </div>
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5 font-bold">Development</p>
                            <p className="font-bold text-charcoal text-sm">{property.developmentStatus || 'Ready to build'}</p>
                          </div>
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5 font-bold">Available Plots</p>
                            <p className="font-bold text-charcoal text-sm">
                              {property.availablePlots ? `${property.availablePlots} of ${property.totalPlots || '—'}` : 'Contact us'}
                            </p>
                          </div>
                          <div className="bg-ivory rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5 font-bold">Region</p>
                            <p className="font-bold text-charcoal text-sm">{property.region || '—'}</p>
                          </div>
                        </div>

                        {/* Nearby Landmarks */}
                        {property.landmarks && property.landmarks.length > 0 && (
                          <div className="mb-5">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-bold mb-2 flex items-center gap-1">
                              <Navigation className="w-3 h-3" /> Nearby Landmarks
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {property.landmarks.map((l: string) => (
                                <span key={l} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium">{l}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Features */}
                        {property.features && property.features.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-5">
                            {property.features.map((f: string) => (
                              <span key={f} className="text-xs bg-sage/10 text-forest px-3 py-1 rounded-full font-medium">{f}</span>
                            ))}
                          </div>
                        )}

                        {/* Map Toggle */}
                        {property.coordinates && (
                          <div className="mb-5">
                            <button
                              onClick={() => setExpandedMap(expandedMap === property.id ? null : property.id)}
                              className="flex items-center gap-2 text-sm font-bold text-forest hover:text-forest-light transition-colors"
                            >
                              <Map className="w-4 h-4" />
                              {expandedMap === property.id ? 'Hide Map' : 'View on Map'}
                            </button>
                            {expandedMap === property.id && (
                              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 h-48">
                                <iframe
                                  title={`Map of ${property.title}`}
                                  width="100%"
                                  height="100%"
                                  style={{ border: 0 }}
                                  loading="lazy"
                                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.coordinates.lng - 0.01}%2C${property.coordinates.lat - 0.005}%2C${property.coordinates.lng + 0.01}%2C${property.coordinates.lat + 0.005}&layer=mapnik&marker=${property.coordinates.lat}%2C${property.coordinates.lng}`}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a
                            href={`https://wa.me/2347041754800?text=${encodeURIComponent(`Hello De-Greenacres, I'm interested in the land: ${property.title} at ${property.area}, ${property.state} (${property.sqm || property.landSize}sqm, ₦${(property.price / 1000000).toFixed(0)}M). ${property.availablePlots ? property.availablePlots + ' plots available.' : ''} Please send me more details.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-green-500 transition-all"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp
                          </a>
                          <Link
                            href={`/book-inspection?property=${encodeURIComponent(property.title)}&location=${encodeURIComponent(property.area)}&state=${encodeURIComponent(property.state)}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-forest text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-forest-light transition-all"
                          >
                            <Eye className="w-5 h-5" /> Request Inspection
                          </Link>
                          <a
                            href="tel:+2348065019971"
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                          >
                            <Phone className="w-4 h-4" /> Call Agent
                          </a>
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

      {/* Ad — Land page (after listings, before Southeast focus) */}
      <section className="py-8 bg-ivory">
        <div className="container-custom">
          <AdSense label="Land — After Listings" format="horizontal" />
        </div>
      </section>

      {/* Southeast Focus Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-forest/5 to-sage/5 rounded-3xl p-8 md:p-12 border border-sage/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">SOUTHEAST NIGERIA</p>
                  <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Land opportunities in the Southeast</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Uyo, Enugu and surrounding areas offer some of the best value for land investment in Nigeria. Growing infrastructure, government development projects, and rising demand make these locations ideal for both residential and commercial plots.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-charcoal">
                      <CheckCircle className="w-4 h-4 text-forest" /> Affordable entry prices
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoal">
                      <CheckCircle className="w-4 h-4 text-forest" /> Strong title documentation
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoal">
                      <CheckCircle className="w-4 h-4 text-forest" /> Rapid infrastructure growth
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoal">
                      <CheckCircle className="w-4 h-4 text-forest" /> High appreciation potential
                    </div>
                  </div>
                  <button onClick={() => setActiveRegion('Southeast')} className="bg-forest text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-forest-light transition-all inline-flex items-center gap-2">
                    View Southeast Plots <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { city: 'Uyo', plots: landProperties.filter(p => p.state === 'Akwa Ibom').reduce((s, p) => s + (p.availablePlots || 0), 0), state: 'Akwa Ibom' },
                    { city: 'Enugu', plots: landProperties.filter(p => p.state === 'Enugu').reduce((s, p) => s + (p.availablePlots || 0), 0), state: 'Enugu' },
                    { city: 'Asaba', plots: 0, state: 'Delta' },
                    { city: 'Aba', plots: 0, state: 'Abia' },
                  ].map((loc) => (
                    <div key={loc.city} className="bg-white rounded-xl p-5 text-center border border-gray-100">
                      <Building className="w-8 h-8 text-forest mx-auto mb-2" />
                      <h4 className="font-bold text-charcoal">{loc.city}</h4>
                      <p className="text-xs text-gray-500">{loc.state}</p>
                      <p className="text-lg font-bold text-forest mt-1">{loc.plots || '—'}</p>
                      <p className="text-[10px] text-gray-400">plots available</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Buy Land With Us */}
      <section className="section-padding">
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
              { icon: Eye, title: 'Physical Inspection', desc: 'See the land in person with our team before you commit.' },
              { icon: CreditCard, title: 'Flexible Payment', desc: 'Selected plots available with structured instalment plans.' },
              { icon: MapPin, title: 'Strategic Locations', desc: 'Plots in high-growth areas with road access and development potential.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all text-center group">
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
                Request Property Inspection
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
