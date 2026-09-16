import Link from 'next/link';
import { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
  showCompareButton?: boolean;
}

export default function PropertyCard({ property, showCompareButton = true }: PropertyCardProps) {
  // Verification status helpers
  const getVerificationBadge = () => {
    if (property.verificationStatus === 'verified') {
      return (
        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      );
    }
    if (property.verificationStatus === 'pending') {
      return (
        <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
          Under Review
        </span>
      );
    }
    return null;
  };

  const getDocumentationBadge = () => {
    if (!property.documentation) return null;
    
    const docColors: Record<string, string> = {
      'C of O': 'bg-blue-600',
      'Governor Consent': 'bg-purple-600',
      'Excision': 'bg-teal-600',
      'Gazette': 'bg-indigo-600',
    };
    
    const color = docColors[property.documentation] || 'bg-gray-600';
    
    return (
      <span className={`${color} text-white text-xs font-bold px-2 py-1 rounded`}>
        {property.documentation}
      </span>
    );
  };

  return (
    <div className="card hover-lift group relative">
      <Link href={`/properties/${property.slug}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {property.featured && <span className="badge-featured">Featured</span>}
            {property.sample && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">Sample</span>}
            {getVerificationBadge()}
          </div>

          {/* Documentation Badge */}
          {property.documentation && (
            <div className="absolute top-4 right-4">
              {getDocumentationBadge()}
            </div>
          )}

          {/* Price */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <p className="text-xl font-bold text-forest">
              ₦{(property.price / 1000000).toFixed(0)}M
              {property.pricePerSqm && (
                <span className="text-xs text-gray-600 block">
                  ₦{property.pricePerSqm.toLocaleString()}/sqm
                </span>
              )}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                const message = encodeURIComponent(
                  `Hello De-Greenacres, I'm interested in ${property.title} in ${property.area}, ${property.state}, listed at ₦${property.price.toLocaleString()}. Please send me more details.`
                );
                window.open(`https://wa.me/2347041754800?text=${message}`, '_blank');
              }}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-lg transition-colors"
              aria-label="Share on WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>
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

          {/* Property Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-3">
            {property.bedrooms > 0 && (
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {property.bathrooms} Baths
              </span>
            )}
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.sqm} sqm
            </span>
          </div>

          {/* Trust Indicators */}
          {property.verificationStatus === 'verified' && (
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Documents verified by De-Greenacres</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
