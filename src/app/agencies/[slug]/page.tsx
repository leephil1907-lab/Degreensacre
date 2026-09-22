import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Building2, BadgeCheck, Phone, Mail, Globe, MapPin, Users, ArrowRight } from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

const demoAgencies: any = {
  'de-greenacres-properties-limited': {
    id: 'demo-ag-1',
    name: 'De-Greenacres Properties Limited',
    slug: 'de-greenacres-properties-limited',
    email: 'info@degreenacresproperties.com',
    phone: '+2348065019971',
    logo_url: '/logo-256.png',
    description: 'CAC RC: 1856064 — Full-service property company: sales, land, verification, inspection, management. Every listing verified.',
    address: '5 Borogade Crescent, Off Okengbero Street, New Oko-Oba, Lagos',
    state: 'Lagos',
    website: 'https://degreenacresproperties.com',
    is_verified: true,
  },
  'de-greenacres-uyo-hub': {
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
};

export default async function AgencyDetailPage({ params }: Props) {
  const { slug } = await params;

  let agency: any = null;
  let agents: any[] = [];
  let properties: any[] = [];
  let isDemo = false;

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('agencies').select('*').eq('slug', slug).single();
    if (data) {
      agency = data;
      isDemo = false;
      const { data: ags } = await supabase.from('agents').select('*').eq('agency_id', agency.id);
      agents = ags || [];
      if (agents.length) {
        const uids = agents.map((a: any) => a.user_id).filter(Boolean);
        if (uids.length) {
          const { data: props } = await supabase.from('properties').select('id, slug, title, price, area, state, images, type').in('owner_id', uids).eq('status', 'available').limit(12);
          properties = props || [];
        }
      }
    }
  } catch {}

  if (!agency) {
    if (demoAgencies[slug]) {
      agency = demoAgencies[slug];
      isDemo = true;
      agents = [
        { id: 'demo-1', name: 'De-Greenacres Team', slug: 'de-greenacres-team', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', is_verified: true },
        { id: 'demo-2', name: 'Uyo Land Desk', slug: 'uyo-land-desk', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', is_verified: true },
      ];
      properties = [];
    } else {
      notFound();
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-custom py-8">
        <Link href="/agencies" className="text-sm text-gray-500 hover:text-forest inline-flex items-center gap-1">← Back to agencies</Link>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mt-4">
          <div className="h-32 bg-gradient-to-r from-charcoal to-forest" />
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              <img src={agency.logo_url || '/logo-256.png'} alt={agency.name} className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white" />
              <div className="flex-1 pt-2">
                <h1 className="font-display text-3xl text-charcoal flex items-center gap-2">{agency.name} {agency.is_verified && <BadgeCheck className="w-6 h-6 text-forest" />}</h1>
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> {agency.state} • {agency.address}</p>
                <p className="text-gray-700 mt-3 max-w-2xl leading-relaxed">{agency.description}</p>
                <div className="flex flex-wrap gap-3 mt-6 text-sm">
                  <a href={`tel:${agency.phone}`} className="bg-forest text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"><Phone className="w-4 h-4" /> {agency.phone}</a>
                  <a href={`mailto:${agency.email}`} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {agency.email}</a>
                  {agency.website && <a href={agency.website} target="_blank" rel="noopener noreferrer" className="bg-sage/20 text-forest px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"><Globe className="w-4 h-4" /> Website</a>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="font-display text-xl text-charcoal mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Agents ({agents.length})</h2>
            {agents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No agents yet for this agency.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {agents.map((ag: any) => (
                  <Link key={ag.id || ag.slug} href={`/agents/${ag.slug}`} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-all">
                    <img src={ag.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'} alt={ag.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-charcoal">{ag.name}</p>
                      <p className="text-xs text-gray-500">{ag.is_verified ? 'Verified' : 'Member'}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-xl text-charcoal mb-4">Listings by this agency</h2>
            {properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">No live listings yet for this agency. Live listings will appear here once properties are linked via owner_id → agents.user_id → agencies.id.</p>
                <Link href="/properties" className="inline-flex items-center gap-1 mt-4 text-forest font-bold">Browse all properties <ArrowRight className="w-4 h-4" /></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((p: any) => (
                  <Link key={p.id} href={`/properties/${p.slug}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                    <div className="h-48 overflow-hidden">
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-charcoal line-clamp-2">{p.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {p.area}, {p.state}</p>
                      <p className="font-display text-lg text-forest mt-2">₦{(p.price / 1000000).toFixed(0)}M</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
