import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Properties in Uyo, Akwa Ibom',
  description: 'Browse properties in Uyo, Akwa Ibom State. Houses, land, and commercial property in Shelter Afrique, Osongama, Ewet Housing and more.',
};

const areas = [
  { name: 'Shelter Afrique', type: 'Residential', highlight: 'Premium estate with modern duplexes' },
  { name: 'Osongama Estate', type: 'Residential', highlight: 'Well-planned government estate' },
  { name: 'Ewet Housing Estate', type: 'Residential', highlight: 'Established family neighbourhood' },
  { name: 'Ikot Ekpene Road', type: 'Mixed Use', highlight: 'Commercial and residential corridor' },
  { name: 'Oron Road Axis', type: 'Residential', highlight: 'Growing new developments' },
  { name: 'IBB Way', type: 'Commercial', highlight: 'Office and retail space' },
];

export default function UyoPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-charcoal to-forest text-white py-20">
        <div className="container-custom">
          <p className="text-sage font-semibold mb-2">Akwa Ibom State, Nigeria</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Properties in Uyo</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Akwa Ibom&apos;s capital city — a modern, well-planned urban centre with growing real estate demand driven by government investment, diaspora buyers, and strong local commerce.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg">
            <h2>Uyo Real Estate Market</h2>
            <p>
              Uyo has emerged as one of Nigeria&apos;s most attractive secondary real estate markets. Thanks to significant government infrastructure investment over the past decade — including the Godswill Akpabio International Stadium, improved road networks, and the Ibom Tropicana entertainment complex — the city has become a magnet for property investors.
            </p>
            <p>
              Property prices in Uyo are considerably more accessible than Lagos or Abuja, yet the city offers comparable quality of life in its premium estates. Diaspora investors from Akwa Ibom, one of Nigeria&apos;s largest diaspora communities, are a major driver of residential property demand.
            </p>

            <h2>Key Areas in Uyo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {areas.map((area) => (
              <div key={area.name} className="bg-ivory rounded-xl p-6">
                <h3 className="text-lg font-bold text-charcoal">{area.name}</h3>
                <p className="text-magenta text-sm font-semibold mt-1">{area.type}</p>
                <p className="text-gray-600 text-sm mt-2">{area.highlight}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-lg mt-12">
            <h2>Why Invest in Uyo</h2>
            <ul>
              <li><strong>Affordable Entry:</strong> Premium land and homes at a fraction of Lagos/Abuja prices.</li>
              <li><strong>Diaspora Market:</strong> Strong and consistent demand from Akwa Ibom diaspora investors building homes.</li>
              <li><strong>Infrastructure:</strong> Victor Attah International Airport, modern road network, and ongoing urban development.</li>
              <li><strong>Growing Tourism:</strong> Ibom Tropicana, Le Meridien Ibom Hotel, and cultural festivals drive hospitality demand.</li>
              <li><strong>Land Banking:</strong> Significant undeveloped land with strong appreciation potential.</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Link href="/properties?location=akwa-ibom" className="btn-primary inline-block mr-4">
              Browse Uyo Properties
            </Link>
            <Link href="/locations" className="btn-outline inline-block">
              View All Locations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
