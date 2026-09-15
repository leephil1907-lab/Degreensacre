'use client';

import ScrollReveal from '@/components/ScrollReveal';
import { Calendar, User, ArrowRight } from 'lucide-react';

import Link from 'next/link';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
}

const articles: Article[] = [
  {
    id: '1',
    slug: 'understanding-land-titles-in-nigeria',
    title: 'Understanding Land Titles in Nigeria: A Complete Guide',
    excerpt: 'Learn about C of O, Governor\'s Consent, Excision, and other land title documents in Nigeria. Essential knowledge for every property buyer.',
    category: 'Legal',
    author: 'De-Greenacres Team',
    date: '2026-09-10',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
    featured: true
  },
  {
    id: '2',
    slug: 'property-investment-strategies-2026',
    title: 'Top Property Investment Strategies for 2026',
    excerpt: 'Discover the most profitable real estate investment strategies in Nigeria\'s current market. From rental income to land banking.',
    category: 'Investment',
    author: 'De-Greenacres Team',
    date: '2026-09-08',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
    featured: true
  },
  {
    id: '3',
    slug: 'lagos-real-estate-market-analysis',
    title: 'Lagos Real Estate Market Analysis: Trends & Opportunities',
    excerpt: 'Comprehensive analysis of Lagos property market including price trends, hot locations, and investment opportunities.',
    category: 'Market Analysis',
    author: 'De-Greenacres Team',
    date: '2026-09-05',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200',
    featured: false
  },
  {
    id: '4',
    slug: 'first-time-home-buyer-guide',
    title: 'First-Time Home Buyer\'s Guide to Nigerian Real Estate',
    excerpt: 'Everything you need to know before buying your first property in Nigeria. From budgeting to closing the deal.',
    category: 'Buying Guide',
    author: 'De-Greenacres Team',
    date: '2026-09-01',
    readTime: '15 min read',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200',
    featured: false
  },
  {
    id: '5',
    slug: 'diaspora-investment-guide',
    title: 'Diaspora Investment Guide: Buying Property from Abroad',
    excerpt: 'How Nigerians living abroad can safely invest in Nigerian real estate. Tips, tricks, and pitfalls to avoid.',
    category: 'Investment',
    author: 'De-Greenacres Team',
    date: '2026-08-28',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200',
    featured: false
  },
  {
    id: '6',
    slug: 'property-verification-checklist',
    title: 'Property Verification Checklist: Avoid Scams & Fraud',
    excerpt: 'Essential steps to verify any property before purchase. Protect yourself from common real estate scams in Nigeria.',
    category: 'Legal',
    author: 'De-Greenacres Team',
    date: '2026-08-25',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
    featured: false
  }
];

const categories = ['All', 'Legal', 'Investment', 'Market Analysis', 'Buying Guide'];

export default function InsightsPage() {
  const featuredArticles = articles.filter(a => a.featured);
  const regularArticles = articles.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=90"
          alt="Property Insights"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <h1 className="text-display-lg md:text-display-xl font-bold mb-4">
              Property Insights & Guides
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Expert knowledge to help you make informed real estate decisions in Nigeria
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-charcoal mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/insights/${article.slug}`}
                  className="card hover-lift group overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-forest text-white text-xs font-bold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{new Date(article.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-3 group-hover:text-forest transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">By {article.author}</span>
                      <span className="text-forest font-semibold">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-charcoal mb-8">All Articles</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(category => (
              <button
                key={category}
                className="px-6 py-2 rounded-lg font-semibold bg-white text-charcoal hover:bg-forest/10 transition-all"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <Link
                key={article.id}
                href={`/insights/${article.slug}`}
                className="card hover-lift group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-forest text-white text-xs font-bold px-2 py-1 rounded">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                    <span>{new Date(article.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-forest transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                  <span className="text-sm text-forest font-semibold">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-gradient-to-br from-forest to-forest-600 text-white">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get the latest property insights, market analysis, and investment tips delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-charcoal"
            />
            <button type="submit" className="btn-primary bg-white text-forest hover:bg-ivory whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
