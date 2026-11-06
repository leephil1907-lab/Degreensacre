import Link from 'next/link';
import { ArrowRight, BadgeCheck, Building2, MapPin } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const metadata = { title: 'Agencies', description: 'Browse published agency profiles on De-Greenacres.' };
export const dynamic = 'force-dynamic';

export default async function AgenciesPage() {
  let agencies: any[] = [];
  let loadError = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('agencies').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    agencies = data || [];
  } catch (error) {
    console.error('Agencies could not be loaded:', error);
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <section className="bg-charcoal py-16 text-white"><div className="container-custom"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sage">Network</p><h1 className="font-display text-5xl">Agencies</h1><p className="mt-4 max-w-2xl text-white/75">Browse agency profiles, team members and their currently linked property listings.</p></div></section>
      <section className="section-padding"><div className="container-custom">
        {loadError && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Agency profiles are temporarily unavailable. Please refresh or contact our team.</div>}
        {!loadError && agencies.length === 0 ? <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center"><Building2 className="mx-auto mb-4 h-12 w-12 text-gray-300" /><h2 className="font-display text-2xl text-charcoal">No agency profiles published yet</h2><p className="mt-2 text-sm text-gray-500">Published agency profiles will appear here.</p></div> : (
          <div className="grid gap-6 md:grid-cols-2">{agencies.map((agency) => <Link key={agency.id} href={`/agencies/${agency.slug}`} className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 transition hover:shadow-lg"><img src={agency.logo_url || '/logo-256.png'} alt={agency.name} className="h-16 w-16 shrink-0 rounded-xl border border-gray-100 object-cover" /><div className="min-w-0 flex-1"><h2 className="flex items-center gap-1 font-bold text-charcoal group-hover:text-forest">{agency.name}{agency.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-forest" />}</h2><p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3 w-3" />{[agency.city, agency.state].filter(Boolean).join(', ') || agency.state}</p><p className="mt-2 line-clamp-2 text-sm text-gray-600">{agency.description}</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-forest">View agency <ArrowRight className="h-4 w-4" /></span></div></Link>)}</div>
        )}
        <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 text-center"><p className="text-sm text-gray-600">Looking for a person? <Link href="/agents" className="font-bold text-forest underline">Browse agents →</Link></p></div>
      </div></section>
    </div>
  );
}
