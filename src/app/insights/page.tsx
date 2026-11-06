import Link from 'next/link';
import AdSense from '@/components/GoogleAdsense';
import InsightsExplorer from '@/components/InsightsExplorer';
import { getPublishedArticles } from '@/lib/articles';

export const metadata = {
  title: 'Property Insights & Buyer Guides',
  description: 'Practical Nigerian property guides covering land titles, verification, buying, investment and diaspora purchases.',
};
export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="min-h-screen bg-ivory">
      <section className="relative h-[400px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=90" alt="Property research and guides" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/85" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-sage">De-Greenacres knowledge centre</p>
            <h1 className="font-display text-5xl font-bold md:text-display-xl">Property Insights & Guides</h1>
            <p className="mx-auto mt-5 max-w-3xl text-xl text-white/85">Clear, practical information to help you ask better questions and make informed real estate decisions in Nigeria.</p>
          </div>
        </div>
      </section>

      <InsightsExplorer articles={articles} />

      <section className="bg-white py-8"><div className="container-custom"><AdSense label="Insights — Below articles" format="horizontal" /></div></section>

      <section className="section-padding bg-forest text-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">Need guidance for a specific property?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">Our guides are general information, not legal or financial advice. Speak with the team about an inspection or property-specific next steps.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/contact" className="rounded-xl bg-white px-7 py-3.5 font-bold text-forest hover:bg-ivory">Contact our team</Link><Link href="/properties" className="rounded-xl border border-white/40 px-7 py-3.5 font-bold text-white hover:bg-white/10">Browse properties</Link></div>
        </div>
      </section>
    </div>
  );
}
