'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { properties } from '@/data/properties';
import { Search, MapPin, SlidersHorizontal, Heart, ArrowRight, BedDouble, Bath, Ruler, ShieldCheck, TrendingUp, Building2, Landmark, RefreshCw } from 'lucide-react';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), { ssr: false });

type Mode = 'buy' | 'rent' | 'land' | 'commercial';

export default function NigeriaZillowHome() {
  const [mode, setMode] = useState<Mode>('buy');
  const [query, setQuery] = useState('');
  const [state, setState] = useState('All Nigeria');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [bedrooms, setBedrooms] = useState('Any');
  const [fx, setFx] = useState<number | null>(null);
  const [fxLoading, setFxLoading] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    setFxLoading(true);
    fetch('/api/market-metrics', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('metrics unavailable')))
      .then(data => { if (active) setFx(Number(data.usdNgn) || null); })
      .catch(() => { if (active) setFx(null); })
      .finally(() => { if (active) setFxLoading(false); });
    return () => { active = false; };
  }, []);

  const states = useMemo(() => ['All Nigeria', ...Array.from(new Set(properties.map(p => p.state))).sort()], []);
  const filtered = useMemo(() => properties.filter(p => {
    if (state !== 'All Nigeria' && p.state !== state) return false;
    const text = `${p.title} ${p.area} ${p.state} ${p.type ?? ''}`.toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    if (min && p.price < Number(min)) return false;
    if (max && p.price > Number(max)) return false;
    if (bedrooms !== 'Any' && Number(p.bedrooms || 0) < Number(bedrooms)) return false;
    if (mode === 'land' && !String(p.type ?? '').toLowerCase().includes('land')) return false;
    if (mode === 'commercial' && !String(p.type ?? '').toLowerCase().includes('commercial')) return false;
    return true;
  }).slice(0, 12), [state, query, min, max, bedrooms, mode]);

  const locations = filtered.map(p => ({
    id: p.id,
    name: p.title,
    position: { lat: p.state === 'Lagos' ? 6.5244 : p.state === 'Abuja' ? 9.0579 : p.state === 'Enugu' ? 6.4474 : 6.2, lng: p.state === 'Lagos' ? 3.3792 : p.state === 'Abuja' ? 7.4951 : p.state === 'Enugu' ? 7.5083 : 7.1 },
    type: 'property' as const,
    address: `${p.area}, ${p.state}`,
    description: `₦${(p.price / 1_000_000).toFixed(1)}M`,
  }));

  const toggleSaved = (id: string) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const money = (n: number) => n >= 1_000_000_000 ? `₦${(n / 1_000_000_000).toFixed(1)}B` : `₦${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;

  return (
    <main className="bg-[#f7f8f5] text-[#18251d]">
      <section className="relative overflow-hidden bg-[#123524] text-white">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_15%_20%,#7fb069,transparent_30%),radial-gradient(circle_at_85%_10%,#d7b45b,transparent_25%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <nav className="mb-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 font-black tracking-tight"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#123524]">DG</span><span className="text-xl">De-Greenacres</span></Link>
            <div className="hidden items-center gap-6 text-sm font-semibold md:flex"><Link href="/properties">Buy</Link><Link href="/properties">Rent</Link><Link href="/list-property">Sell</Link><Link href="/dashboard">My Home</Link></div>
            <Link href="/auth/signin" className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold">Sign in</Link>
          </nav>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]"><ShieldCheck className="h-4 w-4" /> Nigeria-first property marketplace</div>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Find a place to call home in Nigeria.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/75 sm:text-lg">Search verified homes, land, developments and commercial property with Nigerian pricing, locations and transaction workflows.</p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl rounded-3xl bg-white p-3 text-[#18251d] shadow-2xl">
            <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-2 pb-2">
              {(['buy','rent','land','commercial'] as Mode[]).map(m => <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full px-5 py-3 text-sm font-bold capitalize ${mode === m ? 'bg-[#123524] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{m}</button>)}
            </div>
            <div className="grid gap-2 p-2 md:grid-cols-[1.6fr_1fr_1fr_auto]">
              <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4"><Search className="h-5 w-5 text-slate-400" /><input aria-label="Search location" value={query} onChange={e => setQuery(e.target.value)} placeholder="City, estate, area or property" className="w-full bg-transparent py-4 outline-none" /></label>
              <select aria-label="State" value={state} onChange={e => setState(e.target.value)} className="rounded-2xl bg-slate-50 px-4 py-4 outline-none">{states.map(s => <option key={s}>{s}</option>)}</select>
              <select aria-label="Bedrooms" value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="rounded-2xl bg-slate-50 px-4 py-4 outline-none"><option>Any</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>
              <button type="button" className="rounded-2xl bg-[#c99b3b] px-7 py-4 font-black text-white hover:bg-[#b8892f]"><Search className="mx-auto h-5 w-5 md:mr-2 md:inline" />Search</button>
            </div>
            <div className="grid gap-2 px-2 pb-2 md:grid-cols-2"><input aria-label="Minimum price" inputMode="numeric" value={min} onChange={e => setMin(e.target.value.replace(/\D/g,''))} placeholder="Minimum price (₦)" className="rounded-xl border border-slate-200 px-4 py-3 outline-none" /><input aria-label="Maximum price" inputMode="numeric" value={max} onChange={e => setMax(e.target.value.replace(/\D/g,''))} placeholder="Maximum price (₦)" className="rounded-xl border border-slate-200 px-4 py-3 outline-none" /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Listings', `${filtered.length}+`, Building2], ['States covered', `${states.length - 1}`, Landmark], ['Verified focus', 'CAC + title', ShieldCheck], ['USD / NGN', fxLoading ? 'Updating…' : fx ? `₦${fx.toLocaleString()}` : 'Unavailable', TrendingUp]].map(([label, value, Icon]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-3 flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span><Icon className="h-5 w-5 text-[#3e6b4b]" /></div><div className="text-2xl font-black">{value}</div></div>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div>
          <div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c99b3b]">Fresh inventory</p><h2 className="mt-1 text-3xl font-black">Homes and property across Nigeria</h2></div><button type="button" className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold sm:flex"><SlidersHorizontal className="h-4 w-4" /> Filters</button></div>
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map(p => <article key={p.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-56 overflow-hidden bg-slate-200"><img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><button type="button" aria-label="Save property" onClick={() => toggleSaved(p.id)} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90"><Heart className={`h-5 w-5 ${saved.includes(p.id) ? 'fill-red-500 text-red-500' : ''}`} /></button><span className="absolute bottom-3 left-3 rounded-full bg-[#123524] px-3 py-1 text-xs font-bold text-white">{p.featured ? 'Featured' : 'Verified'}</span></div>
              <div className="p-5"><div className="mb-2 text-2xl font-black">{money(p.price)}</div><h3 className="line-clamp-1 font-bold">{p.title}</h3><p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" />{p.area}, {p.state}</p><div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">{p.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{p.bedrooms}</span>}{p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{p.bathrooms}</span>}<span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{p.sqm} sqm</span></div><Link href={`/properties/${p.slug}`} className="mt-5 flex items-center justify-between text-sm font-black text-[#28583a]">View property <ArrowRight className="h-4 w-4" /></Link></div>
            </article>)}
          </div>
        </div>
        <div className="lg:sticky lg:top-6 lg:h-[720px]"><div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Live map</p><h3 className="font-black">Explore by location</h3></div><button type="button" onClick={() => window.location.reload()} aria-label="Refresh map data" className="rounded-full border p-2"><RefreshCw className="h-4 w-4" /></button></div><div className="h-[calc(100%-73px)] min-h-[520px]"><InteractiveMap locations={locations} center={{ lat: 7.5, lng: 5.5 }} zoom={6} height="100%" /></div></div></div>
      </section>
    </main>
  );
}
