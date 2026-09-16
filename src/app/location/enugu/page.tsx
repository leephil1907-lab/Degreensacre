import Link from 'next/link';
import { properties } from '@/data/properties';

export default function EnuguLocationPage() {
  const enuguProperties = properties.filter(p => p.state === 'Enugu' && p.status === 'available');
  const featuredProperties = enuguProperties.filter(p => p.featured).slice(0, 4);
  
  const areas = ['Independence Layout', 'GRA', 'Trans-Ekulu', 'New Haven', 'Ogui', 'Achara Layout', 'Uwani'];
  
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90"
          alt="Enugu City"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <h1 className="text-display-lg md:text-display-xl font-bold mb-4">
              Properties in Enugu
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover properties in the Coal City - Enugu, the capital of Southeast Nigeria with rich history and growing real estate opportunities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">{enuguProperties.length}+</div>
                <div className="text-white/80">Properties Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">7+</div>
                <div className="text-white/80">Prime Areas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">₦165M+</div>
                <div className="text-white/80">Starting Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Enugu */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-6">Why Invest in Enugu Real Estate?</h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Enugu, known as the Coal City, is the capital of Enugu State and a major commercial hub in Southeast Nigeria. The city combines historical significance with modern development, offering excellent real estate opportunities at competitive prices.
              </p>
              <p>
                Premium areas like Independence Layout and GRA offer well-planned neighborhoods with excellent infrastructure, while emerging areas provide affordable entry points with strong growth potential.
              </p>
              <p>
                Enugu&apos;s strategic location, growing economy, and relatively lower property prices compared to Lagos and Abuja make it an attractive market for both residential and investment purposes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-ivory rounded-xl">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Affordable Entry</h3>
                <p className="text-gray-600 text-sm">Premium properties at 40-60% less than Lagos/Abuja prices</p>
              </div>
              
              <div className="text-center p-6 bg-ivory rounded-xl">
                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Growing Economy</h3>
                <p className="text-gray-600 text-sm">Commercial hub with expanding business and retail sectors</p>
              </div>
              
              <div className="text-center p-6 bg-ivory rounded-xl">
                <div className="w-16 h-16 bg-magenta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Strategic Location</h3>
                <p className="text-gray-600 text-sm">Gateway to Southeast with excellent road and air connectivity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Areas */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-charcoal mb-8">Popular Areas in Enugu</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/properties?state=Enugu&area=${area}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-medium transition-shadow group"
              >
                <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-forest/20 transition-colors">
                  <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-charcoal group-hover:text-forest transition-colors">{area}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-charcoal mb-2">Featured Enugu Properties</h2>
                <p className="text-gray-600">Handpicked premium properties across Enugu</p>
              </div>
              <Link href="/properties?state=Enugu" className="hidden md:inline-flex items-center text-forest hover:text-forest-600 font-semibold">
                View All Enugu Properties
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/properties/${property.slug}`} className="card hover-lift group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {property.featured && <span className="badge-featured">Featured</span>}
                      {property.verificationStatus === 'verified' && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
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

            <div className="text-center mt-8 md:hidden">
              <Link href="/properties?state=Enugu" className="btn-primary">
                View All Enugu Properties
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Market Insights */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-8 text-center">Enugu Real Estate Insights</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-bold text-charcoal mb-3">Price Trends</h3>
                <p className="text-gray-700 mb-4">
                  Enugu offers excellent value for money with premium properties at significantly lower prices than Lagos and Abuja. Independence Layout and GRA command premium prices, while other areas offer affordable options.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-ivory rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Independence Layout</div>
                    <div className="text-lg font-bold text-forest">₦150M - ₦400M</div>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">GRA</div>
                    <div className="text-lg font-bold text-forest">₦120M - ₦350M</div>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Trans-Ekulu</div>
                    <div className="text-lg font-bold text-forest">₦80M - ₦200M</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-bold text-charcoal mb-3">Investment Tips</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-forest mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Focus on established areas like Independence Layout and GRA for stability</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-forest mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verify land ownership and community agreements carefully in Enugu</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-forest mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Consider rental demand from civil servants and business professionals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-forest mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Emerging areas offer better value with appreciation potential</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-charcoal to-forest text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Invest in Enugu?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let De-Greenacres help you find the perfect property in the Coal City. Our verified listings and expert guidance ensure a smooth transaction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/properties?state=Enugu" className="btn-primary bg-white text-forest hover:bg-ivory w-full sm:w-auto">
              Browse Enugu Properties
            </Link>
            <a
              href="https://wa.me/2347041754800?text=Hello%20De-Greenacres,%20I'm%20interested%20in%20properties%20in%20Enugu.%20Please%20send%20me%20more%20information."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white text-white hover:bg-white hover:text-charcoal w-full sm:w-auto"
            >
              Chat with Enugu Expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
