import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from 'lucide-react';
import ShareArticle from '@/components/ShareArticle';
import { getPublishedArticles } from '@/lib/articles';

type Props = { params: Promise<{ slug: string }> };

function ArticleBody({ content }: { content: string }) {
  const blocks = content.split(/\r?\n\r?\n/).filter(Boolean);
  return (
    <div className="space-y-6 text-gray-700">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('## ')) return <h2 key={index} className="pt-4 font-display text-3xl leading-tight text-charcoal">{trimmed.slice(3)}</h2>;
        if (trimmed.startsWith('### ')) return <h3 key={index} className="pt-3 font-display text-2xl text-charcoal">{trimmed.slice(4)}</h3>;
        const lines = trimmed.split(/\r?\n/);
        if (lines.every((line) => line.startsWith('- '))) {
          return <ul key={index} className="space-y-3 rounded-xl bg-ivory p-6">{lines.map((line) => <li key={line} className="flex gap-3 leading-relaxed"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />{line.slice(2)}</li>)}</ul>;
        }
        return <p key={index} className="text-[1.05rem] leading-8">{trimmed}</p>;
      })}
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = (await getPublishedArticles()).find((item) => item.slug === slug);
  if (!article) return { title: 'Article not found' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [article.image], type: 'article' },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const articles = await getPublishedArticles();
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  const related = articles
    .filter((item) => item.id !== article.id)
    .sort((a, b) => {
      const score = (candidate: typeof article) => (candidate.category === article.category ? 2 : 0) + candidate.tags.filter((tag) => article.tags.includes(tag)).length;
      return score(b) - score(a);
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-ivory">
      <section className="relative h-[440px] overflow-hidden md:h-[540px]">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
          <div className="container-custom max-w-4xl">
            <span className="mb-4 inline-block rounded-full bg-sage px-3 py-1 text-xs font-bold uppercase text-charcoal">{article.category}</span>
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">{article.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><User className="h-4 w-4" />{article.author}</span>
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(article.publishDate).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <Link href="/insights" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-forest hover:underline"><ArrowLeft className="h-4 w-4" /> All insights</Link>
          <article className="rounded-2xl bg-white p-6 shadow-sm md:p-12">
            <p className="mb-10 border-b border-gray-200 pb-8 text-xl leading-relaxed text-gray-600">{article.excerpt}</p>
            <ArticleBody content={article.content} />
            <div className="mt-12 border-t border-gray-200 pt-8"><h3 className="mb-3 text-sm font-semibold text-gray-500">Topics</h3><div className="flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="rounded-full bg-ivory px-3 py-1 text-sm text-gray-600">#{tag}</span>)}</div></div>
            <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">This article provides general information only and is not legal, tax or financial advice. Property requirements vary by transaction and state; obtain advice from qualified independent professionals before committing funds.</div>
            <ShareArticle title={article.title} />
          </article>

          {related.length > 0 && (
            <div className="mt-12"><h2 className="mb-6 font-display text-3xl text-charcoal">Related guides</h2><div className="grid gap-6 md:grid-cols-3">{related.map((item) => <Link key={item.id} href={`/insights/${item.slug}`} className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg"><img src={item.image} alt={item.title} className="h-40 w-full object-cover transition group-hover:scale-[1.02]" /><div className="p-4"><span className="text-xs font-bold text-forest">{item.category}</span><h3 className="mt-2 line-clamp-2 font-bold leading-snug text-charcoal group-hover:text-forest">{item.title}</h3><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-forest">Read guide <ArrowRight className="h-3.5 w-3.5" /></span></div></Link>)}</div></div>
          )}
        </div>
      </section>
    </div>
  );
}
