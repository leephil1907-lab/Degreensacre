'use client';

import ScrollReveal from '@/components/ScrollReveal';
import DemoBadge from '@/components/DemoBadge';
import Link from 'next/link';
import { properties } from '@/data/properties';

export default function DiasporaInvestmentPage() {
  const investmentProperties = properties
    .filter(p => p.verificationStatus === 'verified' && p.status === 'available')
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=90"
          alt="Global Investment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal/90" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.706 2.142-.766 3.556h3.936c-.06-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.06 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.706-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.029 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">For Nigerians Abroad</span>
            </div>
            
            <h1 className="text-display-lg md:text-display-xl font-bold mb-6">
              Invest in Nigeria<br />From Anywhere in the World
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Trusted property investment platform for the Nigerian diaspora. 
              Verified properties, transparent processes, and expert support from start to finish.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-white/80">Diaspora Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">₦2B+</div>
                <div className="text-white/80">Invested</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-white/80">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Invest from Abroad */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Why Invest in Nigerian Real Estate?</h2>
            <p className="text-lg text-gray-600">
              Nigeria offers exceptional investment opportunities with high returns and long-term growth potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-ivory rounded-2xl hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">High ROI</h3>
              <p className="text-gray-600">
                Nigerian properties appreciate 15-30% annually in prime areas, outperforming many global markets.
              </p>
            </div>

            <div className="text-center p-8 bg-ivory rounded-2xl hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Currency Advantage</h3>
              <p className="text-gray-600">
                Leverage stronger currencies (USD, GBP, EUR) to acquire premium Nigerian properties at attractive prices.
              </p>
            </div>

            <div className="text-center p-8 bg-ivory rounded-2xl hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-magenta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Home Connection</h3>
              <p className="text-gray-600">
                Build your future in Nigeria with a home base for visits, retirement, or family legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Simple, transparent, and secure process designed for diaspora investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Browse Properties',
                description: 'Explore verified properties with detailed information, photos, and documentation status',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              },
              {
                step: '02',
                title: 'Virtual Consultation',
                description: 'Schedule a video call with our diaspora specialists to discuss your investment goals',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                step: '03',
                title: 'Secure Transaction',
                description: 'Complete purchase with our secure payment process and legal documentation support',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                step: '04',
                title: 'Property Management',
                description: 'Optional property management services for rental income or maintenance while you\'re abroad',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-soft h-full">
                  <div className="text-4xl font-bold text-forest/20 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Currency Converter */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-forest to-forest-600 rounded-2xl p-8 md:p-12 text-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Currency Converter</h2>
                <p className="text-white/90">See how much your investment is worth in Naira</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-sm text-white/80 mb-2">Foreign Currency</div>
                  <div className="flex items-center gap-3">
                    <select className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 font-semibold">
                      <option>USD</option>
                      <option>GBP</option>
                      <option>EUR</option>
                      <option>CAD</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="flex-1 bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 placeholder-white/60"
                    />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-sm text-white/80 mb-2">Nigerian Naira (NGN)</div>
                  <div className="text-3xl font-bold">₦0.00</div>
                  <div className="text-xs text-white/60 mt-2">Exchange rate: ₦1,580/USD</div>
                </div>
              </div>

              <div className="text-center text-sm text-white/80">
                * Exchange rates are indicative and subject to market fluctuations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Verified Investment Properties</h2>
            <p className="text-lg text-gray-600">
              Handpicked properties with complete documentation and verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="mb-6 flex justify-center"><DemoBadge label="Demo pool — live diaspora opportunities from Supabase will appear here once available" /></div>
            {investmentProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.slug}`} className="card hover-lift group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {property.featured && <span className="badge-featured">Featured</span>}
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-xl font-bold text-forest">
                      ₦{(property.price / 1000000).toFixed(0)}M
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-forest transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.area}, {property.state}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {property.bedrooms > 0 && <span className="text-sm text-gray-600">{property.bedrooms} Beds</span>}
                    {property.bathrooms > 0 && <span className="text-sm text-gray-600">{property.bathrooms} Baths</span>}
                    <span className="text-sm text-gray-600">{property.sqm} sqm</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/properties" className="btn-primary">
              View All Verified Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Diaspora Services */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Diaspora-Specific Services</h2>
            <p className="text-lg text-gray-600">
              Comprehensive support tailored for Nigerians living abroad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Legal Representation',
                description: 'Trusted lawyers to handle documentation, verification, and registration on your behalf',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                )
              },
              {
                title: 'Property Management',
                description: 'Professional management services for rental income, maintenance, and tenant relations',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                title: 'Virtual Tours',
                description: 'Live video tours and 360° property walkthroughs so you can inspect from anywhere',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: 'Repatriation Support',
                description: 'Guidance on transferring funds and repatriating rental income or sale proceeds',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                )
              },
              {
                title: 'Tax Advisory',
                description: 'Expert advice on Nigerian property taxes, capital gains, and international tax implications',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                )
              },
              {
                title: 'Family Coordination',
                description: 'Work with family members in Nigeria while maintaining control and transparency',
                icon: (
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              }
            ].map((service, index) => (
              <div key={index} className="flex gap-4 p-6 bg-ivory rounded-xl">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Diaspora Success Stories</h2>
            <p className="text-lg text-gray-600">
              Hear from Nigerians abroad who invested successfully with De-Greenacres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dr. Chidi O.',
                location: 'Houston, USA',
                quote: 'De-Greenacres made it possible for me to invest in Lagos while living in Texas. The verification process gave me confidence.',
                investment: '₦180M Property in Lekki'
              },
              {
                name: 'Ngozi A.',
                location: 'London, UK',
                quote: 'As a busy professional in London, I needed a trustworthy partner. De-Greenacres delivered excellent service and transparency.',
                investment: '₦120M Land in Abuja'
              },
              {
                name: 'Tunde B.',
                location: 'Toronto, Canada',
                quote: 'The virtual tours and legal support were invaluable. I purchased my dream home without having to travel to Nigeria.',
                investment: '₦220M Duplex in Enugu'
              }
            ].map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{story.quote}&quot;</p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="font-bold text-charcoal">{story.name}</div>
                  <div className="text-sm text-gray-600">{story.location}</div>
                  <div className="text-xs text-forest font-semibold mt-1">{story.investment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-charcoal to-forest text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Invest in Nigeria?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our diaspora investment specialists. 
            We&apos;ll guide you through the process from start to finish.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="https://wa.me/2347041754800?text=Hello%20De-Greenacres,%20I'm%20a%20Nigerian%20living%20abroad%20and%20interested%20in%20investing%20in%20property.%20Please%20send%20me%20more%20information."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-white text-forest hover:bg-ivory w-full sm:w-auto"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="btn-outline border-white text-white hover:bg-white hover:text-charcoal w-full sm:w-auto"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
