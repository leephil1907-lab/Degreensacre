import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { formatPropertyPrice, getPropertyImage } from '@/lib/property';
import { Phone, Mail, BadgeCheck, Building2, MapPin, ArrowRight } from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

export default async function AgentDetailPage({ params }: Props) {
  const { slug } = await params;

  let agent: any = null;
  let properties: any[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('agents').select('*, agencies(name, slug, logo_url, is_verified)').eq('slug', slug).single();
    if (data) {
      agent = data;
      if (agent.user_id) {
        const { data: props } = await supabase.from('properties').select('id, slug, title, price, price_period, area, state, images, type, verification_status').eq('owner_id', agent.user_id).eq('status', 'available').limit(12);
        properties = props || [];
      }
    }
  } catch (error) {
    console.error('Agent profile could not be loaded:', error);
  }

  if (!agent) notFound();

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-custom py-8">
        <Link href="/agents" className="text-sm text-gray-500 hover:text-forest mb-6 inline-flex items-center gap-1">← Back to agents</Link>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mt-4">
          <div className="h-32 bg-gradient-to-r from-forest to-sage" />
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              <img src={agent.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'} alt={agent.name} className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg" />
              <div className="flex-1 pt-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl text-charcoal flex items-center gap-2">{agent.name} {agent.is_verified && <BadgeCheck className="w-6 h-6 text-forest" />}</h1>
                    <p className="text-sage font-semibold mt-1 flex items-center gap-1"><Building2 className="w-4 h-4" /> {agent.agencies?.name || 'De-Greenacres Properties'}</p>
                    <p className="text-sm text-gray-600 mt-3 max-w-2xl leading-relaxed">{agent.bio}</p>
                  </div>
                  <div className="hidden md:flex flex-col gap-2">
                    <a href={`tel:${agent.phone}`} className="bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2"><Phone className="w-4 h-4" /> Call</a>
                    <a href={`https://wa.me/${(agent.whatsapp || agent.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${agent.name}, I saw your profile on De-Greenacres and would like to chat.`)}`} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2">WhatsApp</a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 text-sm">
                  <span className="bg-ivory border border-gray-100 rounded-full px-3 py-1.5 flex items-center gap-1"><Mail className="w-4 h-4" /> {agent.email}</span>
                  <span className="bg-ivory border border-gray-100 rounded-full px-3 py-1.5 flex items-center gap-1"><Phone className="w-4 h-4" /> {agent.phone}</span>
                  {agent.agencies?.slug && <Link href={`/agencies/${agent.agencies.slug}`} className="bg-forest/10 text-forest border border-forest/20 rounded-full px-3 py-1.5 font-semibold">View agency →</Link>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-2xl text-charcoal mb-4">Listings by {agent.name.split(' —')[0]}</h2>
          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No live listings yet for this agent. New listings will appear here once properties are linked.</p>
              <Link href="/properties" className="inline-flex items-center gap-1 mt-4 text-forest font-bold">Browse all properties <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p: any) => (
                <Link key={p.id} href={`/properties/${p.slug}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="h-48 overflow-hidden">
                    <img src={getPropertyImage(p)} alt={p.title} className="w-full h-full object-cover bg-forest-50 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-charcoal line-clamp-2">{p.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {p.area}, {p.state}</p>
                    <p className="font-display text-xl text-forest mt-2">{formatPropertyPrice(p.price, p.price_period)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
