import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { DemoBanner } from '@/components/DemoBadge';
import { Building2, BadgeCheck, MapPin, ArrowRight, Users } from 'lucide-react';

export const metadata = {
  title: 'Agencies — De-Greenacres Properties',
  description: 'Browse verified agencies on De-Greenacres.',
};

const demoAgencies = [
  {
    id: 'demo-ag-1',
    name: 'De-Greenacres Properties Limited',
    slug: 'de-greenacres-properties-limited',
    email: 'info@degreenacresproperties.com',
    phone: '+2348065019971',
    logo_url: '/logo-256.png',
    description: 'CAC RC: 1856064 — Full-service property company: sales, land, verification, inspection, management.',
    address: '5 Borogade Crescent, Off Okengbero Street, New Oko-Oba, Lagos',
    state: 'Lagos',
    website: 'https://degreenacresproperties.com',
    is_verified: true,
  },
  {
    id: 'demo-ag-2',
    name: 'De-Greenacres — Uyo Hub',
    slug: 'de-greenacres-uyo-hub',
    email: 'uyo@degreenacresproperties.com',
    phone: '+2347041754800',
    logo_url: '/logo-256.png',
    description: 'Southeast hub: Uyo, Enugu, Asaba, Port Harcourt — land banking & residential.',
    address: 'Uyo, Akwa Ibom State — New Coastal Highway corridor',
    state: 'Akwa Ibom',
    website: 'https://degreenacresproperties.com',
    is_verified: true,
  },
];

export default async function AgenciesPage() {
  let agencies: any[] = [];
  let isDemo = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('agencies').select('*').order('created_at', { ascending: false }).limit(24);
    if (data && data.length > 0) {
      agencies = data;
      isDemo = false;
    } else {
      agencies = demoAgencies;
      isDemo = true;
    }
  } catch {
    agencies = demoAgencies;
    isDemo = true;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <section className="bg-charcoal text-white py-16">
        <div className="container-custom">
          <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">NETWORK</p>
          <h1 className="font-display text-5xl mb-4">Agencies</h1>
          <p className="text-white/80 max-w-2xl">Verified agencies. Every property is attached to a real agency and agent — no anonymous listings.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {isDemo && (
            <DemoBanner description="Preview · Demo agencies — live agencies from Supabase (table: agencies) will appear here once seeded. Showing curated demo agencies for QA." />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agencies.map((ag: any) => (
              <Link key={ag.id || ag.slug} href={`/agencies/${ag.slug}`} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all group flex gap-4">
                <img src={ag.logo_url || '/logo-256.png'} alt={ag.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-charcoal group-hover:text-forest flex items-center gap-1">{ag.name} {ag.is_verified && <BadgeCheck className="w-4 h-4 text-forest" />}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {ag.state} • {ag.address?.slice(0, 40)}...</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">{ag.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-forest">View agency <ArrowRight className="w-4 h-4" /></div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <p className="text-sm text-gray-600">Looking for a person? <Link href="/agents" className="text-forest font-bold underline">Browse agents →</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
}
