import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/agencies — public readable (RLS allows SELECT)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createServerSupabaseClient();

    let query = supabase.from('agencies').select('*').order('created_at', { ascending: false });

    if (searchParams.get('verified') === 'true') query = query.eq('is_verified', true);
    if (searchParams.get('state')) query = query.eq('state', searchParams.get('state')!);
    if (searchParams.get('slug')) query = query.eq('slug', searchParams.get('slug')!);
    if (searchParams.get('limit')) query = query.limit(parseInt(searchParams.get('limit')!));

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ agencies: data || [], count: data?.length || 0, success: true });
  } catch (error) {
    console.error('GET /api/agencies error:', error);
    return NextResponse.json({ error: 'Failed to fetch agencies', success: false }, { status: 500 });
  }
}
