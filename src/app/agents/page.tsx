import Link from 'next/link';
import { ArrowRight, BadgeCheck, Mail, Phone, Users } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const metadata = { title: 'Agents', description: 'Meet published property agents and team profiles on De-Greenacres.' };
export const dynamic = 'force-dynamic';

export default async function AgentsPage() {
  let agents: any[] = [];
  let loadError = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('agents').select('*, agencies(name, slug, logo_url)').order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    agents = data || [];
  } catch (error) {
    console.error('Agents could not be loaded:', error);
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <section className="bg-forest py-16 text-white"><div className="container-custom"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sage">Our network</p><h1 className="font-display text-5xl">Agents & Team Profiles</h1><p className="mt-4 max-w-2xl text-white/80">Find the right contact for property enquiries, inspections and local guidance.</p></div></section>
      <section className="section-padding"><div className="container-custom">
        {loadError && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Agent profiles are temporarily unavailable. Please refresh or contact our team.</div>}
        {!loadError && agents.length === 0 ? <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center"><Users className="mx-auto mb-4 h-12 w-12 text-gray-300" /><h2 className="font-display text-2xl text-charcoal">No agent profiles published yet</h2><p className="mt-2 text-sm text-gray-500">Published team profiles will appear here.</p></div> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{agents.map((agent) => <Link key={agent.id} href={`/agents/${agent.slug}`} className="group rounded-2xl border border-gray-100 bg-white p-6 transition hover:shadow-lg"><div className="mb-4 flex items-start gap-4"><img src={agent.photo_url || '/logo-256.png'} alt={agent.name} className="h-16 w-16 rounded-xl border border-gray-100 object-cover" /><div className="min-w-0 flex-1"><h2 className="flex items-center gap-1 font-bold text-charcoal group-hover:text-forest">{agent.name}{agent.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-forest" />}</h2>{agent.title && <p className="mt-1 text-xs font-semibold text-sage">{agent.title}</p>}<p className="mt-1 truncate text-xs text-gray-500">{agent.agencies?.name || 'Independent agent'}</p></div></div><p className="mb-4 line-clamp-2 text-sm text-gray-600">{agent.bio}</p><div className="space-y-2 text-xs text-gray-500"><span className="flex items-center gap-2 truncate"><Mail className="h-3 w-3 shrink-0" />{agent.email}</span><span className="flex items-center gap-2"><Phone className="h-3 w-3" />{agent.phone}</span></div><span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest">View profile <ArrowRight className="h-4 w-4" /></span></Link>)}</div>
        )}
        <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 text-center"><p className="text-sm text-gray-600">Looking for an agency? <Link href="/agencies" className="font-bold text-forest underline">Browse agencies →</Link></p></div>
      </div></section>
    </div>
  );
}
