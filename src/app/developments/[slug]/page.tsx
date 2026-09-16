import { developments } from '@/data/developments';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

export default function DevelopmentDetailPage({ params }: Props) {
  const development = developments.find(d => d.slug === params.slug);

  if (!development) {
    notFound();
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(1)}B`;
    } else if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(0)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'under-construction':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold-out':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'under-construction':
        return 'Under Construction';
      case 'planning':
        return 'Planning Phase';
      case 'sold-out':
        return 'Sold Out';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img
          src={development.gallery[0]}
          alt={development.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container-custom">
            <div className="max-w-3xl">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 ${getStatusColor(development.status)}`}>
                {getStatusText(development.status)}
              </span>
              <h1 className="font-display text-5xl font-bold text-white mb-4">{development.name}</h1>
              <p className="text-xl text-white/90 flex items-center mb-6">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {development.location}, {development.state}
              </p>
              <div className="flex flex-wrap gap-4 text-white">
                <div>
                  <p className="text-sm text-white/70">Developer</p>
                  <p className="font-semibold">{development.developer}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Units</p>
                  <p className="font-semibold">{development.totalUnits}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Available</p>
                  <p className="font-semibold text-green-400">{development.availableUnits} units</p>
                </div>
                {development.completionDate && (
                  <div>
                    <p className="text-sm text-white/70">Completion</p>
                    <p className="font-semibold">{new Date(development.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-charcoal mb-4">About This Development</h2>
                <p className="text-gray-700 leading-relaxed">{development.description}</p>
              </div>

              {/* Unit Types */}
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-charcoal mb-6">Available Units</h2>
                <div className="space-y-4">
                  {development.unitTypes.map((unit, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:border-magenta transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-charcoal mb-2">{unit.type}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {unit.bedrooms && (
                              <span>{unit.bedrooms} Bedrooms</span>
                            )}
                            <span>{unit.size} sqm</span>
                            <span className="text-green-600 font-medium">{unit.available} available</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Starting from</p>
                          <p className="text-2xl font-bold text-magenta">{formatPrice(unit.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Plans */}
              {development.paymentPlans && development.paymentPlans.length > 0 && (
                <div className="bg-white rounded-xl shadow-soft p-8">
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Payment Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {development.paymentPlans.map((plan, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-bold text-charcoal mb-2">{plan.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                        <span className="inline-block px-3 py-1 bg-ivory text-charcoal text-xs font-semibold rounded-full">
                          {plan.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-charcoal mb-6">Amenities & Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {development.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-magenta flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-charcoal mb-6">Key Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {development.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-plum flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {development.gallery.length > 1 && (
                <div className="bg-white rounded-xl shadow-soft p-8">
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {development.gallery.map((image, idx) => (
                      <div key={idx} className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                        <img
                          src={image}
                          alt={`${development.name} - ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-charcoal mb-4">Interested in this development?</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Contact us for more information, site inspection, or to reserve your unit.
                  </p>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/2347041754800?text=${encodeURIComponent(`Hello De-Greenacres, I'm interested in ${development.name}, ${development.location}, ${development.state}. Please provide more information.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="tel:+2348065019971"
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Us</span>
                  </a>

                  {development.siteInspection && (
                    <Link
                      href="/contact?subject=Site%20Inspection"
                      className="w-full btn-outline flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Book Site Inspection</span>
                    </Link>
                  )}
                </div>

                {/* Development Info */}
                <div className="pt-6 border-t border-gray-200 space-y-3 text-sm">
                  {development.documentation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documentation:</span>
                      <span className="font-semibold text-charcoal">{development.documentation}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-charcoal">{getStatusText(development.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Units:</span>
                    <span className="font-semibold text-charcoal">{development.totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold text-green-600">{development.availableUnits} units</span>
                  </div>
                  {development.completionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-semibold text-charcoal">
                        {new Date(development.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Price Range</p>
                  <p className="text-2xl font-bold text-magenta">
                    {formatPrice(Math.min(...development.unitTypes.map(u => u.price)))} - {formatPrice(Math.max(...development.unitTypes.map(u => u.price)))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
