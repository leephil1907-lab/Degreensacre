import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createServerSupabaseClient();

    let query = supabase.from('agents').select('*, agencies(name, slug, logo_url)').order('created_at', { ascending: false });

    if (searchParams.get('verified') === 'true') query = query.eq('is_verified', true);
    if (searchParams.get('agency_id')) query = query.eq('agency_id', searchParams.get('agency_id')!);
    if (searchParams.get('agency_slug')) {
      // filter by agency slug via join — fetch agency id first
      const { data: agency } = await supabase.from('agencies').select('id').eq('slug', searchParams.get('agency_slug')!).single();
      if (agency) query = query.eq('agency_id', agency.id);
      else return NextResponse.json({ agents: [], count: 0, success: true });
    }
    if (searchParams.get('slug')) query = query.eq('slug', searchParams.get('slug')!);
    if (searchParams.get('user_id')) query = query.eq('user_id', searchParams.get('user_id')!);
    if (searchParams.get('limit')) query = query.limit(parseInt(searchParams.get('limit')!));

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ agents: data || [], count: data?.length || 0, success: true });
  } catch (error) {
    console.error('GET /api/agents error:', error);
    return NextResponse.json({ error: 'Failed to fetch agents', success: false }, { status: 500 });
  }
}
