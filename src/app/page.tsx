'use client';

import Link from 'next/link';
import { properties } from '@/data/properties';
import ScrollReveal from '@/components/ScrollReveal';
import HeroCarousel from '@/components/HeroCarousel';
import HeroSearch from '@/components/HeroSearch';
import CACIcon from '@/components/CACIcon';
import Testimonials from '@/components/Testimonials';
import { MapPin, ArrowRight, FileCheck, Shield, Eye, CreditCard, Key, Globe, Building2, TreePine, Briefcase, Home, ClipboardCheck, BarChart3, Handshake, HardHat, Users, Calendar, Phone, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const sampleProperties = properties.filter(p => p.sample && p.featured).slice(0, 6);
  const landProperties = properties.filter(p => p.type === 'land');

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <HeroCarousel />
        <div className="relative z-10 container-custom w-full py-20">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in">
              <CACIcon className="w-5 h-5" />
              <span className="text-sm font-medium">CAC Registered · RC: 1856064</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 animate-fade-in leading-tight tracking-tight text-white">
              Find Property. Verify the Opportunity.<br />
              <span className="italic text-sage">Own With Confidence.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto animate-fade-in font-light leading-relaxed">
              Residential · Land · Commercial · Investment
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link href="/properties" className="bg-white text-charcoal px-8 py-4 rounded-xl font-bold text-lg hover:bg-sage hover:text-white transition-all w-full sm:w-auto">
                Explore Properties
              </Link>
              <Link href="/book-inspection" className="bg-sage text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-forest transition-all w-full sm:w-auto border border-white/20">
                Book Inspection — ₦20,000
              </Link>
            </div>
            <div className="mt-8">
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROPERTIES ═══ */}
      <section className="section-padding bg-gradient-to-b from-ivory to-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">FEATURED LISTINGS</p>
                <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-2">Properties worth knowing about</h2>
              </div>
              <Link href="/properties" className="hidden md:inline-flex items-center text-forest hover:text-forest-light font-semibold group">
                View All <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProperties.map((property, i) => (
              <ScrollReveal key={property.id} delay={i * 0.1}>
                <Link href={`/properties/${property.slug}`} className="group block">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
                    <div className="relative h-64 overflow-hidden">
                      <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-md text-white ${property.type === 'sale' ? 'bg-forest' : property.type === 'land' ? 'bg-amber-600' : 'bg-blue-600'}`}>
                          {property.type === 'sale' ? 'FOR SALE' : property.type === 'land' ? 'LAND' : property.type?.toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                        <p className="text-2xl font-bold text-white">₦{(property.price / 1000000).toFixed(0)}M</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg text-charcoal mb-2 line-clamp-2 group-hover:text-forest transition-colors">{property.title}</h3>
                      <p className="text-gray-500 text-sm flex items-center mb-3">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-forest" />{property.area}, {property.state}
                      </p>
                      <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
                        {property.bedrooms > 0 && <span>{property.bedrooms} Beds</span>}
                        {property.bathrooms > 0 && <span>{property.bathrooms} Baths</span>}
                        <span>{property.sqm} sqm</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LAND INVESTMENT OPPORTUNITIES ═══ */}
      <section className="section-padding bg-forest text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">🌍 LAND INVESTMENT</p>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Land Investment Opportunities</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">Verified plots in Nigeria&apos;s fastest-growing locations. Clear documentation. Flexible payment plans available.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {['Uyo', 'Lagos', 'Abuja', 'Port Harcourt', 'Asaba', 'Enugu'].map((city) => (
              <Link key={city} href={`/properties?type=land&state=${city === 'Uyo' ? 'Akwa Ibom' : city === 'Asaba' ? 'Delta' : city === 'Port Harcourt' ? 'Rivers' : city}`} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center transition-all hover:-translate-y-1">
                <MapPin className="w-5 h-5 text-sage mx-auto mb-2" />
                <p className="font-bold text-sm">{city}</p>
              </Link>
            ))}
          </div>
          {landProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {landProperties.slice(0, 2).map((p) => (
                <Link key={p.id} href={`/properties/${p.slug}`} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all group">
                  <div className="flex items-start gap-4">
                    <img src={p.images[0]} alt={p.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-sage transition-colors">{p.title}</h3>
                      <p className="text-sm text-white/70 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{p.area}, {p.state}</p>
                      <p className="font-display text-2xl text-sage">₦{(p.price / 1000000).toFixed(0)}M</p>
                      <p className="text-xs text-white/60 mt-1">{p.sqm} sqm · {p.documentation || 'Documentation available'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center">
            <Link href="/properties?type=land" className="inline-flex items-center gap-2 bg-white text-forest px-8 py-3.5 rounded-xl font-bold hover:bg-sage hover:text-white transition-all">
              View All Land <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WHY DE-GREENACRES ═══ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">WHY DE-GREENACRES?</p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">Helping you find, verify &amp; own property in Nigeria</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileCheck, title: 'Documentation Reviewed', desc: 'We help clients understand and verify property documentation before committing.' },
              { icon: Eye, title: 'Professional Inspection', desc: 'Physical and guided property inspections so you see exactly what you\'re buying.' },
              { icon: CreditCard, title: 'Flexible Payment Options', desc: 'Selected properties available with structured payment plans.' },
              { icon: Key, title: 'Property Management', desc: 'We don\'t just sell property — we help owners manage it.' },
              { icon: MapPin, title: 'Nationwide Network', desc: 'Lagos · Abuja · Uyo · Port Harcourt · Asaba · Enugu · Southeast' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
                  <div className="w-14 h-14 bg-forest/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-forest group-hover:text-white transition-all">
                    <item.icon className="w-7 h-7 text-forest group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-xl text-charcoal mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OUR SERVICES ═══ */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">OUR SERVICES</p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">More than property listings</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">De-Greenacres is a full-service property company. Whatever your real estate need, we can help.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Home, label: 'Property Sales', href: '/properties?type=sale' },
              { icon: TreePine, label: 'Land Sales', href: '/properties?type=land' },
              { icon: Building2, label: 'Commercial Properties', href: '/properties?type=commercial' },
              { icon: Briefcase, label: 'Short-Let Management', href: '/properties?type=short-let' },
              { icon: Key, label: 'Property Management', href: '/contact' },
              { icon: BarChart3, label: 'Property Valuation', href: '/contact' },
              { icon: ClipboardCheck, label: 'Title & Documentation Assistance', href: '/contact' },
              { icon: Handshake, label: 'Co-Ownership Opportunities', href: '/contact' },
              { icon: HardHat, label: 'Property Development & Investment', href: '/contact' },
            ].map((service, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <Link href={service.href} className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg hover:border-forest/30 transition-all group">
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-forest transition-all">
                    <service.icon className="w-6 h-6 text-forest group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-charcoal group-hover:text-forest transition-colors">{service.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-forest transition-colors" />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INVEST WITH DE-GREENACRES ═══ */}
      <section className="section-padding bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">INVEST WITH DE-GREENACRES</p>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Carefully selected real estate opportunities</h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">Designed for individuals, families and diaspora investors who want secure, transparent property investment in Nigeria.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: TreePine, label: 'Land Banking' },
              { icon: Users, label: 'Co-Ownership' },
              { icon: HardHat, label: 'Development Projects' },
              { icon: Home, label: 'Rental Income Properties' },
              { icon: Globe, label: 'Diaspora Investment' },
              { icon: Key, label: 'Property Management' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/15 transition-all">
                  <item.icon className="w-8 h-8 text-sage mx-auto mb-3" />
                  <p className="font-bold text-sm">{item.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center">
            <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%27m%20interested%20in%20investment%20opportunities.%20Please%20connect%20me%20with%20an%20investment%20consultant." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-sage text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-forest transition-all">
              Talk to an Investment Consultant <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ DIASPORA SECTION ═══ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-forest/5 to-sage/5 rounded-3xl p-8 md:p-16 text-center">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">🇳🇬 🌍 FOR NIGERIANS ABROAD</p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">Buy property from anywhere in the world</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Based in the USA, UK, Canada, Australia or elsewhere? De-Greenacres helps you select, verify, inspect and own property in Nigeria — without being here physically.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
                {['Select a property', 'Verify documentation', 'Schedule inspection', 'Complete payment'].map((step, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-8 h-8 bg-forest text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">{i + 1}</div>
                    <p className="text-sm font-semibold text-charcoal">{step}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/diaspora" className="bg-forest text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-forest-light transition-all w-full sm:w-auto">
                  I&apos;m a Diaspora Buyer
                </Link>
                <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%27m%20a%20Nigerian%20living%20abroad%20and%20interested%20in%20buying%20property.%20Please%20assist." target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">HOW IT WORKS</p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">From discovery to ownership</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: '01', title: 'Find', desc: 'Browse our catalogue of verified properties across Nigeria' },
              { num: '02', title: 'Verify', desc: 'Review documentation and verification status before committing' },
              { num: '03', title: 'Inspect', desc: 'Book a physical inspection with our team (₦20,000)' },
              { num: '04', title: 'Pay', desc: 'Secure payment with flexible plans where available' },
              { num: '05', title: 'Own', desc: 'Complete documentation transfer and take ownership' },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-forest text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold font-display">{step.num}</div>
                  <h3 className="font-display text-xl text-charcoal mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">CLIENT EXPERIENCES</p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">What our clients say</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Testimonials />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ BOOK INSPECTION ═══ */}
      <section className="section-padding bg-gradient-to-br from-forest to-forest-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10 text-center">
          <ScrollReveal>
            <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">SEE IT BEFORE YOU BUY IT</p>
            <h2 className="font-display text-4xl md:text-5xl mb-4">Book a Property Inspection</h2>
            <p className="text-xl text-white/80 mb-3 max-w-2xl mx-auto">
              Don&apos;t buy property blind. Our team will take you to the site, show you the land or building, explain the documentation, and answer every question.
            </p>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <span className="text-sm text-white/70">Inspection Fee:</span>
              <span className="font-display text-3xl text-sage">₦20,000</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book-inspection" className="bg-white text-forest px-10 py-4 rounded-xl font-bold text-lg hover:bg-sage hover:text-white transition-all w-full sm:w-auto">
                Pay ₦20,000 &amp; Book Inspection
              </Link>
              <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%20would%20like%20to%20book%20a%20property%20inspection.%20Please%20assist." target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-forest transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Or Talk to Us First
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ WHATSAPP CTA ═══ */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">Talk to De-Greenacres right now</h2>
          <p className="text-white/80 mb-6">Our team is ready to help you find, verify and own your next property.</p>
          <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%20visited%20your%20website%20and%20I%27m%20interested%20in%20your%20properties.%20Please%20assist%20me." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-ivory transition-all">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
