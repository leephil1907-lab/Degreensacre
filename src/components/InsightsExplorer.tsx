'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, BookOpenText, Calendar, Clock, Search } from 'lucide-react';
import type { Article } from '@/lib/articles';

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-forest px-3 py-1 text-xs font-bold text-white">{article.category}</span>
      </div>
      <div className={featured ? 'p-6' : 'p-5'}>
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(article.publishDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime} min read</span>
        </div>
        <h3 className={`${featured ? 'text-2xl' : 'text-lg'} font-bold leading-snug text-charcoal transition group-hover:text-forest`}>{article.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{article.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <span className="truncate text-gray-500">By {article.author}</span>
          <span className="inline-flex shrink-0 items-center gap-1 font-bold text-forest">Read <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
        </div>
      </div>
    </Link>
  );
}

export default function InsightsExplorer({ articles }: { articles: Article[] }) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const categories = useMemo(() => ['All', ...Array.from(new Set(articles.map((article) => article.category))).sort()], [articles]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => {
      if (category !== 'All' && article.category !== category) return false;
      return !query || [article.title, article.excerpt, article.author, ...article.tags].some((value) => value.toLowerCase().includes(query));
    });
  }, [articles, category, search]);
  const featured = filtered.filter((article) => article.featured);
  const regular = filtered.filter((article) => !article.featured);

  return (
    <>
      <section className="border-b border-gray-100 bg-white py-6">
        <div className="container-custom flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${category === item ? 'bg-forest text-white' : 'bg-ivory text-gray-600 hover:bg-forest/10 hover:text-forest'}`}>{item}</button>)}
          </div>
          <div className="relative w-full lg:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guides…" aria-label="Search articles" className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-forest" /></div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom"><h2 className="mb-8 font-display text-3xl text-charcoal">Featured guides</h2><div className="grid gap-8 md:grid-cols-2">{featured.map((article) => <ArticleCard key={article.id} article={article} featured />)}</div></div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-8 flex items-end justify-between gap-4"><div><h2 className="font-display text-3xl text-charcoal">{category === 'All' ? 'All articles' : category}</h2><p className="mt-2 text-sm text-gray-500">Practical information for better property decisions.</p></div><span className="text-sm font-semibold text-gray-400">{filtered.length} article{filtered.length === 1 ? '' : 's'}</span></div>
          {regular.length > 0 ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{regular.map((article) => <ArticleCard key={article.id} article={article} />)}</div> : filtered.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center"><BookOpenText className="mx-auto mb-4 h-10 w-10 text-gray-300" /><h3 className="font-display text-2xl text-charcoal">No articles found</h3><p className="mt-2 text-sm text-gray-500">Try another category or clear your search.</p><button onClick={() => { setCategory('All'); setSearch(''); }} className="mt-5 text-sm font-bold text-forest underline">Clear filters</button></div>
          ) : null}
        </div>
      </section>
    </>
  );
}
