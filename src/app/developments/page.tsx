import Link from 'next/link';
import { Building2, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const metadata = {
  title: 'Property Developments',
  description: 'Explore published estate and development projects from De-Greenacres.',
};
export const dynamic = 'force-dynamic';

function formatStartingPrice(units: any[]) {
  const prices = units.map((unit) => Number(unit?.price || 0)).filter((price) => price > 0);
  if (!prices.length) return 'Contact for pricing';
  const price = Math.min(...prices);
  if (price >= 1_000_000_000) return `₦${(price / 1_000_000_000).toFixed(1)}B`;
  if (price >= 1_000_000) return `₦${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M`;
  return `₦${price.toLocaleString()}`;
}

export default async function DevelopmentsPage() {
  let developments: any[] = [];
  let loadError = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('developments').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    developments = (data || []).map((development) => ({
      ...development,
      gallery: Array.isArray(development.gallery) ? development.gallery : [],
      unitTypes: Array.isArray(development.unit_types) ? development.unit_types : [],
      totalUnits: Number(development.total_units || 0),
      availableUnits: Number(development.available_units || 0),
    }));
  } catch (error) {
    console.error('Developments could not be loaded:', error);
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <section className="relative h-[400px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=90" alt="Property developments" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/85" />
        <div className="absolute inset-0 flex items-center justify-center"><div className="container-custom text-center text-white"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-sage">Projects & estates</p><h1 className="font-display text-5xl font-bold md:text-display-xl">Property Developments</h1><p className="mx-auto mt-4 max-w-3xl text-xl text-white/85">Explore published estates and development projects, unit options and inspection opportunities.</p></div></div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loadError && <div role="alert" className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Developments are temporarily unavailable. Please refresh the page or contact our team.</div>}
          {!loadError && developments.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white py-20 text-center"><Building2 className="mx-auto mb-4 h-14 w-14 text-gray-300" /><h2 className="font-display text-3xl text-charcoal">No developments published yet</h2><p className="mx-auto mt-3 max-w-lg text-gray-600">New projects will appear here after they are published by our team. You can also browse current properties or contact us about upcoming opportunities.</p><Link href="/properties" className="mt-6 inline-flex rounded-xl bg-forest px-6 py-3 text-sm font-bold text-white">Browse properties</Link></div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {developments.map((development, index) => (
                <ScrollReveal key={development.id} delay={index * 0.08}>
                  <Link href={`/developments/${development.slug}`} className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-64 overflow-hidden">
                      <img src={development.gallery[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'} alt={development.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute left-4 top-4 rounded-full bg-forest px-3 py-1 text-xs font-bold capitalize text-white">{String(development.status || 'planning').replaceAll('-', ' ')}</span>
                      <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/95 p-3 backdrop-blur"><p className="text-xs text-gray-500">Starting from</p><p className="text-xl font-bold text-forest">{formatStartingPrice(development.unitTypes)}</p></div>
                    </div>
                    <div className="p-6"><h2 className="text-xl font-bold text-charcoal group-hover:text-forest">{development.name}</h2><p className="mt-3 flex items-center text-sm text-gray-600"><MapPin className="mr-1 h-4 w-4 text-forest" />{development.location}, {development.state}</p><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{development.description}</p><div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm"><span className="text-gray-500"><strong className="text-charcoal">{development.availableUnits}</strong> of {development.totalUnits} units available</span><span className="font-bold text-forest">View details →</span></div></div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-forest text-white"><div className="container-custom text-center"><h2 className="font-display text-3xl md:text-4xl">Interested in a development project?</h2><p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">Contact our team for current availability, documentation and site inspection arrangements.</p><Link href="/contact" className="mt-7 inline-flex rounded-xl bg-white px-7 py-3.5 font-bold text-forest">Contact our team</Link></div></section>
    </div>
  );
}
