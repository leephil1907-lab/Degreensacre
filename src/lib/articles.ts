import { createServerSupabaseClient } from '@/lib/supabase-server';

export type Article = {
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
};

function normalizeArticle(row: Record<string, unknown>): Article {
  return {
    id: String(row.id ?? ''),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    excerpt: String(row.excerpt ?? ''),
    content: String(row.content ?? ''),
    category: String(row.category ?? ''),
    author: String(row.author ?? ''),
    publishDate: String(row.published_at ?? ''),
    readTime: Number(row.read_time || 1),
    image: String(row.image ?? ''),
    featured: Boolean(row.featured),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
  };
}

export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('articles')
      .select('id, slug, title, excerpt, content, category, author, published_at, read_time, image, featured, tags')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(normalizeArticle);
  } catch (error) {
    console.error('Published articles could not be loaded.', error);
    return [];
  }
}
