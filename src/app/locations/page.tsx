import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Property Locations Across Nigeria',
  description: 'Browse properties across Nigeria — Lagos, Abuja, Enugu, Akwa Ibom, Port Harcourt and more.',
};

const locations = [
  {
    name: 'Lagos',
    slug: 'lagos',
    tagline: 'Commercial capital with premium real estate',
    areas: ['Lekki', 'Ikoyi', 'Victoria Island', 'Ikeja', 'Surulere', 'Ajah'],
    description: 'Nigeria\'s largest city and commercial hub with the most diverse property market.',
  },
  {
    name: 'Abuja',
    slug: 'abuja',
    tagline: 'Nigeria\'s capital city with modern infrastructure',
    areas: ['Maitama', 'Asokoro', 'Wuse', 'Gwarinpa', 'Life Camp', 'Jabi'],
    description: 'The Federal Capital Territory with planned layouts and premium government district properties.',
  },
  {
    name: 'Enugu',
    slug: 'enugu',
    tagline: 'Coal City with growing property market',
    areas: ['Independence Layout', 'GRA', 'New Haven', 'Trans-Ekulu', 'Abakpa'],
    description: 'Southeast Nigeria\'s leading city with affordable luxury and strong diaspora investment.',
  },
  {
    name: 'Akwa Ibom',
    slug: 'akwa-ibom',
    tagline: 'Uyo and the Southeast\'s emerging market',
    areas: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron'],
    description: 'One of Nigeria\'s fastest-growing states with modern infrastructure and investment opportunities.',
  },
  {
    name: 'Port Harcourt',
    slug: 'port-harcourt',
    tagline: 'Oil city with strong commercial property demand',
    areas: ['GRA', 'Old GRA', 'Trans-Amadi', 'Eleme', 'Rumuola'],
    description: 'Rivers State capital and Nigeria\'s oil industry hub with steady property appreciation.',
  },
  {
    name: 'Uyo',
    slug: 'uyo',
    tagline: 'Akwa Ibom\'s capital with modern developments',
    areas: ['Shelter Afrique', 'Osongama', 'Ewet Housing', 'Ikot Ekpene Road'],
    description: 'A well-planned city with modern estates and strong growth driven by government investment.',
  },
];

export default function LocationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-forest text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Locations</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover properties across Nigeria&apos;s most promising real estate markets.
          </p>
        </div>
      </section>

      {/* Location Cards */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/location/${loc.slug}`}
                className="card hover-lift group block p-8"
              >
                <h2 className="text-2xl font-bold text-charcoal mb-2 group-hover:text-forest transition-colors">
                  {loc.name}
                </h2>
                <p className="text-magenta font-medium text-sm mb-3">{loc.tagline}</p>
                <p className="text-gray-600 text-sm mb-4">{loc.description}</p>
                <div className="flex flex-wrap gap-2">
                  {loc.areas.slice(0, 4).map((area) => (
                    <span key={area} className="bg-ivory text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200">
                      {area}
                    </span>
                  ))}
                  {loc.areas.length > 4 && (
                    <span className="text-xs text-gray-500 py-1">+{loc.areas.length - 4} more</span>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-forest font-semibold text-sm group-hover:underline">
                    Explore {loc.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
