import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Users, BadgeCheck, Phone, Mail, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Agents — De-Greenacres Properties',
  description: 'Meet our verified agents across Lagos, Abuja, Uyo and beyond.',
};

const demoAgents = [
  {
    id: 'demo-1',
    name: 'De-Greenacres Team',
    slug: 'de-greenacres-team',
    email: 'info@degreenacresproperties.com',
    phone: '+2348065019971',
    whatsapp: '2347041754800',
    bio: 'Core De-Greenacres team handling verification, inspections and closings across all states.',
    photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    is_verified: true,
    agencies: { name: 'De-Greenacres Properties Limited', slug: 'de-greenacres-properties-limited' },
  },
  {
    id: 'demo-2',
    name: 'Uyo Land Desk — Coastal Highway',
    slug: 'uyo-land-desk',
    email: 'uyo@degreenacresproperties.com',
    phone: '+2347041754800',
    whatsapp: '2347041754800',
    bio: 'Dedicated desk for New Coastal Highway to Calabar — Uyo (Premium Plots, 464 sqm, Spread).',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    is_verified: true,
    agencies: { name: 'De-Greenacres Properties Limited', slug: 'de-greenacres-properties-limited' },
  },
  {
    id: 'demo-3',
    name: 'Lagos Homes Specialist',
    slug: 'lagos-homes-specialist',
    email: 'lagos@degreenacresproperties.com',
    phone: '+2348065019971',
    whatsapp: '2347041754800',
    bio: 'Lekki, Ikoyi, Victoria Island — residential and commercial.',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    is_verified: true,
    agencies: { name: 'De-Greenacres Properties Limited', slug: 'de-greenacres-properties-limited' },
  },
];

export default async function AgentsPage() {
  let agents: any[] = [];
  let isDemo = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('agents').select('*, agencies(name, slug, logo_url)').order('created_at', { ascending: false }).limit(24);
    if (data && data.length > 0) {
      agents = data;
      isDemo = false;
    } else {
      agents = demoAgents;
      isDemo = true;
    }
  } catch {
    agents = demoAgents;
    isDemo = true;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <section className="bg-forest text-white py-16">
        <div className="container-custom">
          <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">OUR TEAM</p>
          <h1 className="font-display text-5xl mb-4">Verified Agents</h1>
          <p className="text-white/80 max-w-2xl">Every enquiries goes to a verified agent. No anonymous listings. Each property is tied to a real person and agency.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent: any) => (
              <Link key={agent.id || agent.slug} href={`/agents/${agent.slug}`} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <img src={agent.photo_url || agent.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'} alt={agent.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                  <div className="flex-1">
                    <h3 className="font-bold text-charcoal group-hover:text-forest transition-colors">{agent.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">{agent.agencies?.name || 'De-Greenacres Properties'} {agent.is_verified && <BadgeCheck className="w-3 h-3 text-forest" />}</p>
                    <p className="text-xs text-sage font-semibold mt-1 flex items-center gap-1"><Users className="w-3 h-3" /> {agent.agencies?.slug || 'de-greenacres-properties-limited'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{agent.bio || 'Verified De-Greenacres agent.'}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {agent.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {agent.phone}</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest">View profile <ArrowRight className="w-4 h-4" /></div>
              </Link>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <p className="text-sm text-gray-600">Looking for an agency? <Link href="/agencies" className="text-forest font-bold underline">Browse agencies →</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
}
