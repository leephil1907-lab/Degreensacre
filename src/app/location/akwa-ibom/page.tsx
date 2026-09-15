import Link from 'next/link';
import { properties } from '@/data/properties';

export default function AkwaIbomLocationPage() {
  const akwaibomProperties = properties.filter(p => p.state === 'Akwa Ibom' && p.status === 'available');
  const featuredProperties = akwaibomProperties.filter(p => p.featured).slice(0, 4);
  
  const areas = ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Shelter Afrique', 'Osongama', 'Ikot Akpan Abia'];
  
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=90"
          alt="Akwa Ibom Landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <h1 className="text-display-lg md:text-display-xl font-bold mb-4">
              Properties in Akwa Ibom
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover properties in the Land of Promise - Akwa Ibom State, with growing infrastructure and investment opportunities in the South-South region.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">{akwaibomProperties.length}+</div>
                <div className="text-white/80">Properties Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">7+</div>
                <div className="text-white/80">Prime Areas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">₦45M+</div>
                <div className="text-white/80">Starting Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Akwa Ibom */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-6">Why Invest in Akwa Ibom Real Estate?</h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Akwa Ibom State, known as the &quot;Land of Promise,&quot; is one of Nigeria&apos;s most progressive states with excellent infrastructure, a growing economy, and significant investment in urban development. The capital city Uyo has transformed into a modern city with world-class facilities.
              </p>
              <p>
                The state&apos;s strategic location in the oil-rich Niger Delta, combined with strong government leadership, has created excellent real estate opportunities at highly competitive prices compared to other major Nigerian cities.
              </p>
              <p>
                Whether you&apos;re looking for residential land, commercial properties, or investment opportunities, Akwa Ibom offers exceptional value with strong growth potential.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-ivory rounded-xl">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Best Value</h3>
                <p className="text-gray-600 text-sm">Premium properties at 70-80% less than Lagos/Abuja prices</p>
              </div>
              
              <div className="text-center p-6 bg-ivory rounded-xl">
                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Safe & Secure</h3>
                <p className="text-gray-600 text-sm">One of Nigeria&apos;s safest states with excellent governance</p>
              </div>
              
              <div className="text-center p-6 bg-ivory rounded-xl">
                <div className="w-16 h-16 bg-magenta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">High Growth</h3>
                <p className="text-gray-600 text-sm">Rapid urbanization with 25-35% annual appreciation in prime areas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Areas */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-charcoal mb-8">Popular Areas in Akwa Ibom</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/properties?state=Akwa Ibom&area=${area}`}
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
                <h2 className="text-3xl font-bold text-charcoal mb-2">Featured Akwa Ibom Properties</h2>
                <p className="text-gray-600">Handpicked premium properties across Akwa Ibom</p>
              </div>
              <Link href="/properties?state=Akwa Ibom" className="hidden md:inline-flex items-center text-forest hover:text-forest-600 font-semibold">
                View All Akwa Ibom Properties
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
              <Link href="/properties?state=Akwa Ibom" className="btn-primary">
                View All Akwa Ibom Properties
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Market Insights */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-8 text-center">Akwa Ibom Real Estate Insights</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-bold text-charcoal mb-3">Price Trends</h3>
                <p className="text-gray-700 mb-4">
                  Akwa Ibom offers exceptional value with rapidly appreciating properties. Uyo&apos;s Shelter Afrique and Osongama estates command premium prices, while other areas provide affordable entry points with strong growth potential.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-ivory rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Shelter Afrique</div>
                    <div className="text-lg font-bold text-forest">₦40M - ₦120M</div>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Osongama</div>
                    <div className="text-lg font-bold text-forest">₦35M - ₦100M</div>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Eket</div>
                    <div className="text-lg font-bold text-forest">₦25M - ₦80M</div>
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
                    <span>Focus on government-approved estates like Shelter Afrique for security</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-forest mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verify C of O and survey plans - insist on proper documentation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-forest mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Consider proximity to infrastructure like Ibom Tropicana and Godswill Akpabio Stadium</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-forest mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Land banking in developing areas offers excellent long-term returns</span>
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
            Ready to Invest in Akwa Ibom?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let De-Greenacres help you find the perfect property in the Land of Promise. Our verified listings and local expertise ensure a smooth transaction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/properties?state=Akwa Ibom" className="btn-primary bg-white text-forest hover:bg-ivory w-full sm:w-auto">
              Browse Akwa Ibom Properties
            </Link>
            <a
              href="https://wa.me/2348065019971?text=Hello%20De-Greenacres,%20I'm%20interested%20in%20properties%20in%20Akwa%20Ibom.%20Please%20send%20me%20more%20information."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white text-white hover:bg-white hover:text-charcoal w-full sm:w-auto"
            >
              Chat with Akwa Ibom Expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
