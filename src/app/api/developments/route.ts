import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/developments — DB-primary, returns [] when empty (caller falls back to static)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createServerSupabaseClient();

    let query = supabase.from('developments').select('*').order('created_at', { ascending: false });

    if (searchParams.get('featured') === 'true') query = query.eq('featured', true);
    if (searchParams.get('state')) query = query.eq('state', searchParams.get('state')!);
    if (searchParams.get('status')) query = query.eq('status', searchParams.get('status')!);
    if (searchParams.get('limit')) query = query.limit(parseInt(searchParams.get('limit')!));
    if (searchParams.get('slug')) query = query.eq('slug', searchParams.get('slug')!);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ developments: data || [], count: data?.length || 0, success: true });
  } catch (error) {
    console.error('GET /api/developments error:', error);
    return NextResponse.json({ error: 'Failed to fetch developments', success: false }, { status: 500 });
  }
}
