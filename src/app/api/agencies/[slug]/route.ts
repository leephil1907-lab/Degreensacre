import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: agency, error } = await supabase.from('agencies').select('*').eq('slug', slug).single();
    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Not found', success: false }, { status: 404 });
      throw error;
    }

    // Also fetch agents belonging to this agency
    const { data: agents } = await supabase.from('agents').select('*').eq('agency_id', agency.id);

    // Also fetch properties owned by agents of this agency (via owner_id in agents.user_id)
    let properties: any[] = [];
    if (agents && agents.length) {
      const userIds = agents.map((a: any) => a.user_id).filter(Boolean);
      if (userIds.length) {
        const { data: props } = await supabase.from('properties').select('id, slug, title, price, area, state, images, type').in('owner_id', userIds).eq('status', 'available').limit(12);
        properties = props || [];
      }
    }

    return NextResponse.json({ agency, agents: agents || [], properties, success: true });
  } catch (error) {
    console.error('GET /api/agencies/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch agency', success: false }, { status: 500 });
  }
}
