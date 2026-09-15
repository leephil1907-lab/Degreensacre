import Link from 'next/link';
import Image from 'next/image';
import { properties } from '@/data/properties';

export default function HomePage() {
  const featuredProperties = properties.filter(p => p.featured && !p.sample).slice(0, 4);
  const sampleProperties = properties.filter(p => p.sample && p.featured).slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
            alt="Luxury Property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom w-full">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center space-x-3">
                <Image
                  src="/logo-icon.png"
                  alt="De-Greenacres Properties Limited"
                  width={72}
                  height={72}
                  className="object-contain drop-shadow-xl"
                  priority
                />
                <div className="text-left">
                  <div className="text-2xl font-bold tracking-tight">De-Greenacres</div>
                  <div className="text-sm text-white/80 tracking-wide">PROPERTIES LIMITED</div>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-display-lg md:text-display-xl font-bold mb-6 animate-fade-in">
              Find Property With<br />Confidence.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in">
              Homes, land and investment opportunities worth knowing across Nigeria.
            </p>

            {/* Search Interface */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto animate-fade-in">
              {/* Search Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                {['Buy', 'Rent', 'Land', 'Commercial', 'Shortlet'].map((tab, index) => (
                  <button
                    key={tab}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      index === 0
                        ? 'bg-forest text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select className="input-field">
                    <option>All Locations</option>
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Enugu</option>
                    <option>Akwa Ibom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select className="input-field">
                    <option>All Types</option>
                    <option>Detached Duplex</option>
                    <option>Semi-Detached</option>
                    <option>Land</option>
                    <option>Apartment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select className="input-field">
                    <option>Any Price</option>
                    <option>Under ₦50M</option>
                    <option>₦50M - ₦100M</option>
                    <option>₦100M - ₦200M</option>
                    <option>Above ₦200M</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select className="input-field">
                    <option>Any</option>
                    <option>2+</option>
                    <option>3+</option>
                    <option>4+</option>
                    <option>5+</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button className="btn-primary w-full">
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Search</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Advanced Filters Link */}
              <div className="mt-4 text-center">
                <button className="text-magenta hover:text-magenta-dark font-medium text-sm">
                  + Advanced Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="heading-primary mb-3">Featured Properties</h2>
              <p className="text-lg text-gray-600">Handpicked premium properties across Nigeria</p>
            </div>
            <Link href="/properties" className="hidden md:inline-flex items-center text-forest hover:text-forest-600 font-semibold">
              View All
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.slug}`} className="card hover-lift group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {property.featured && <span className="badge-featured">Featured</span>}
                    {property.sample && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">Sample</span>}
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
                    {property.bedrooms > 0 && (
                      <span className="text-sm text-gray-600">{property.bedrooms} Beds</span>
                    )}
                    {property.bathrooms > 0 && (
                      <span className="text-sm text-gray-600">{property.bathrooms} Baths</span>
                    )}
                    <span className="text-sm text-gray-600">{property.sqm} sqm</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/properties" className="btn-primary">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Why De-Greenacres */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-primary mb-4">Why De-Greenacres</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted property discovery across Nigeria&apos;s most promising markets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-ivory hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">CAC Registered</h3>
              <p className="text-gray-600">
                RC: 1856064. Legally registered and accountable for every transaction.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-ivory hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Local Market Knowledge</h3>
              <p className="text-gray-600">
                Deep expertise across Lagos, Abuja, Enugu, Akwa Ibom, and Southeast markets.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-ivory hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-magenta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Customer Assistance</h3>
              <p className="text-gray-600">
                Dedicated support from inquiry to closing. We handle the details so you don&apos;t have to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-charcoal to-forest text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Property?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our curated selection of premium properties or list yours with Nigeria&apos;s trusted real estate partner.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/properties" className="btn-primary bg-white text-forest hover:bg-ivory w-full sm:w-auto">
              Browse Properties
            </Link>
            <Link href="/list-property" className="btn-outline border-white text-white hover:bg-white hover:text-charcoal w-full sm:w-auto">
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
