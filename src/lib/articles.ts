import { articles as editorialFallback, type Article } from '@/data/articles';
import { createServerSupabaseClient } from '@/lib/supabase-server';

function normalizeArticle(row: Record<string, any>): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: row.author,
    publishDate: row.published_at,
    readTime: Number(row.read_time || 1),
    image: row.image,
    featured: Boolean(row.featured),
    tags: Array.isArray(row.tags) ? row.tags : [],
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
    console.error('Published articles could not be loaded; using editorial fallback.', error);
    return editorialFallback;
  }
}
