import articleData from './articles.json';

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

// Editorial fallback used only when the articles table is unavailable (for
// example, before the CMS migration). A successful empty database result stays
// empty so an administrator's decision to remove content is respected.
export const articles = articleData as Article[];
