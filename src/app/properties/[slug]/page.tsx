import { properties } from '@/data/properties';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SimilarProperties from '@/components/SimilarProperties';

interface Props {
  params: { slug: string };
}

export default function PropertyDetailPage({ params }: Props) {
  const property = properties.find(p => p.slug === params.slug);

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number, period?: string) => {
    return `₦${price.toLocaleString()}${period ? `/${period}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-forest transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/properties" className="text-gray-600 hover:text-forest transition-colors">
              Properties
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/properties?type=${property.type}`} className="text-gray-600 hover:text-forest transition-colors capitalize">
              {property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : property.type}
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-charcoal font-medium line-clamp-1">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <section className="relative h-[500px] md:h-[600px] bg-charcoal overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/20" />

        {/* Badges */}
        <div className="absolute top-8 right-8 flex flex-col space-y-2">
          {property.featured && <span className="badge-featured">Featured</span>}
          {property.verificationStatus === 'verified' && (
            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
          {property.verificationStatus === 'pending' && (
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded">
              Under Review
            </span>
          )}
          {property.sample && <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded">Sample Data</span>}
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">{property.title}</h1>
            <p className="text-gray-600 flex items-center mb-3">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.address}, {property.area}, {property.state}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-3xl md:text-4xl font-bold text-forest">
                {formatPrice(property.price, property.pricePeriod)}
              </div>
              {property.pricePerSqm && (
                <div className="text-sm text-gray-600">
                  ₦{property.pricePerSqm.toLocaleString()}/sqm
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Stats */}
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-charcoal mb-6">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {property.bedrooms > 0 && (
                    <div className="text-center p-4 bg-ivory rounded-lg">
                      <svg className="w-8 h-8 text-forest mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <div className="text-2xl font-bold text-charcoal">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="text-center p-4 bg-ivory rounded-lg">
                      <svg className="w-8 h-8 text-forest mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <div className="text-2xl font-bold text-charcoal">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  <div className="text-center p-4 bg-ivory rounded-lg">
                    <svg className="w-8 h-8 text-forest mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <div className="text-2xl font-bold text-charcoal">{property.sqm}</div>
                    <div className="text-sm text-gray-600">SQM</div>
                  </div>
                  {property.parking > 0 && (
                    <div className="text-center p-4 bg-ivory rounded-lg">
                      <svg className="w-8 h-8 text-forest mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      <div className="text-2xl font-bold text-charcoal">{property.parking}</div>
                      <div className="text-sm text-gray-600">Parking</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-charcoal mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div className="bg-white rounded-xl shadow-soft p-8">
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-forest flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentation */}
              {property.documentation && (
                <div className="bg-white rounded-xl shadow-soft p-8">
                  <h2 className="text-2xl font-bold text-charcoal mb-4">Documentation</h2>
                  <div className="flex items-center space-x-3 p-4 bg-ivory rounded-lg">
                    <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-charcoal">{property.documentation}</p>
                      <p className="text-sm text-gray-600">Title documentation available</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
                <h3 className="text-xl font-bold text-charcoal mb-6">Interested in this property?</h3>
                
                {/* Agent Info */}
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                  <img
                    src="/logo-icon.png"
                    alt="De-Greenacres"
                    className="w-16 h-16 object-contain rounded-full"
                  />
                  <div>
                    <p className="font-bold text-charcoal">{property.agent}</p>
                    {property.verified && (
                      <p className="text-sm text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified Agent
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3 mb-6">
                  {property.agentPhone && (
                    <a
                      href={`tel:${property.agentPhone}`}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call Agent</span>
                    </a>
                  )}
                  
                  <a
                    href={`https://wa.me/${property.agentPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello De-Greenacres, I'm interested in ${property.title} in ${property.area}, ${property.state}, listed at ${formatPrice(property.price)}. Please send me more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>

                  {property.agentEmail && (
                    <a
                      href={`mailto:${property.agentEmail}`}
                      className="w-full btn-outline flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email</span>
                    </a>
                  )}
                </div>

                {/* Property Info */}
                <div className="pt-6 border-t border-gray-200 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-semibold text-charcoal">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-charcoal capitalize">{property.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Added:</span>
                    <span className="font-semibold text-charcoal">{new Date(property.dateAdded).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views:</span>
                    <span className="font-semibold text-charcoal">{property.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span className="font-semibold text-charcoal">{property.id.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <div className="mt-16">
            <SimilarProperties currentProperty={property} />
          </div>
        </div>
      </section>
    </div>
  );
}
