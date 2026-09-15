import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Properties in Port Harcourt',
  description: 'Browse premium properties in Port Harcourt, Rivers State. Houses, land and commercial property in GRA, Old GRA, Trans-Amadi and more.',
};

const areas = [
  { name: 'GRA Phase 1 & 2', type: 'Residential', highlight: 'Premium duplexes and family homes' },
  { name: 'Old GRA', type: 'Residential/Commercial', highlight: 'Historic area with character properties' },
  { name: 'Trans-Amadi', type: 'Commercial', highlight: 'Industrial and office space hub' },
  { name: 'Eleme Junction', type: 'Mixed Use', highlight: 'Growing residential and commercial area' },
  { name: 'Rumuola', type: 'Residential', highlight: 'Family-friendly estates and apartments' },
  { name: 'Woji', type: 'Residential', highlight: 'Modern apartments and new developments' },
];

export default function PortHarcourtPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-charcoal to-forest text-white py-20">
        <div className="container-custom">
          <p className="text-sage font-semibold mb-2">Rivers State, Nigeria</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Properties in Port Harcourt</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Nigeria&apos;s oil industry capital with strong commercial demand and steady property appreciation across GRA, Trans-Amadi, and emerging residential estates.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg">
            <h2>Port Harcourt Real Estate Market</h2>
            <p>
              Port Harcourt, the Rivers State capital, remains one of Nigeria&apos;s most important real estate markets. As the hub of the country&apos;s oil and gas industry, the city attracts strong demand for both residential and commercial properties from expatriates, corporate tenants, and local families.
            </p>
            <p>
              The city&apos;s property market is characterized by premium GRA estates, growing mid-range developments in areas like Rumuola and Woji, and significant commercial space demand in Trans-Amadi. Property values in prime areas have shown steady appreciation over the past decade.
            </p>

            <h2>Key Areas in Port Harcourt</h2>
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
            <h2>Why Invest in Port Harcourt</h2>
            <ul>
              <li><strong>Oil &amp; Gas Economy:</strong> Strong corporate rental demand from energy sector employees and contractors.</li>
              <li><strong>Infrastructure:</strong> International airport, seaport, and ongoing road development projects.</li>
              <li><strong>Education Hub:</strong> University of Port Harcourt and other institutions drive student housing demand.</li>
              <li><strong>Diversifying Economy:</strong> Growing tech, hospitality, and retail sectors beyond oil.</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Link href="/properties?location=port-harcourt" className="btn-primary inline-block mr-4">
              Browse Port Harcourt Properties
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
