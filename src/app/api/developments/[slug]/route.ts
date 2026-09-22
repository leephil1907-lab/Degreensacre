import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('developments').select('*').eq('slug', slug).single();
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Not found', success: false }, { status: 404 });
      }
      throw error;
    }
    return NextResponse.json({ development: data, success: true });
  } catch (error) {
    console.error('GET /api/developments/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch development', success: false }, { status: 500 });
  }
}
