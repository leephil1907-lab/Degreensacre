import Link from 'next/link';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  image: string;
  featured: boolean;
  tags: string[];
}

export const articles: Article[] = [
  {
    id: 'art-001',
    slug: 'complete-guide-buying-land-nigeria',
    title: 'The Complete Guide to Buying Land in Nigeria',
    excerpt: 'Everything you need to know about purchasing land in Nigeria, from documentation to verification and avoiding common pitfalls.',
    content: `Buying land in Nigeria can be a rewarding investment when done correctly. This comprehensive guide walks you through every step of the process.

## Understanding Land Documentation

The most critical aspect of buying land in Nigeria is understanding the documentation...`,
    category: 'Land Buying',
    author: 'De-Greenacres Team',
    publishDate: '2026-09-10',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
    featured: true,
    tags: ['land', 'investment', 'documentation', 'guide']
  },
  {
    id: 'art-002',
    slug: 'uyo-property-market-2026',
    title: 'Uyo Property Market 2026: Opportunities and Trends',
    excerpt: 'An in-depth analysis of the Uyo real estate market, emerging neighborhoods, and investment opportunities.',
    content: `Uyo, the capital of Akwa Ibom State, continues to show strong growth potential in 2026...`,
    category: 'Market Analysis',
    author: 'De-Greenacres Team',
    publishDate: '2026-09-08',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
    featured: true,
    tags: ['uyo', 'market-analysis', 'investment', 'akwa-ibom']
  },
  {
    id: 'art-003',
    slug: 'property-documentation-explained',
    title: 'Property Documentation in Nigeria: C of O, Governor\'s Consent, and More',
    excerpt: 'Understanding the different types of property documentation in Nigeria and what they mean for your investment.',
    content: `Property documentation is one of the most critical aspects of real estate investment in Nigeria...`,
    category: 'Documentation',
    author: 'De-Greenacres Team',
    publishDate: '2026-09-05',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
    featured: false,
    tags: ['documentation', 'c-of-o', 'legal', 'guide']
  },
  {
    id: 'art-004',
    slug: 'first-time-home-buyer-guide',
    title: 'First-Time Home Buyer\'s Guide: What You Need to Know',
    excerpt: 'A comprehensive guide for first-time home buyers in Nigeria, covering everything from budgeting to closing the deal.',
    content: `Buying your first home is an exciting milestone, but it can also feel overwhelming...`,
    category: 'Buying Guide',
    author: 'De-Greenacres Team',
    publishDate: '2026-09-01',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
    featured: false,
    tags: ['first-time-buyer', 'guide', 'home-buying']
  },
  {
    id: 'art-005',
    slug: 'rental-income-investment-nigeria',
    title: 'Building Wealth Through Rental Income in Nigeria',
    excerpt: 'How to evaluate rental properties, calculate yields, and build a profitable rental portfolio.',
    content: `Rental income remains one of the most reliable ways to build wealth through real estate...`,
    category: 'Investment',
    author: 'De-Greenacres Team',
    publishDate: '2026-08-28',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=1200',
    featured: false,
    tags: ['rental', 'investment', 'income', 'roi']
  }
];
