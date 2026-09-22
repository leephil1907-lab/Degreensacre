import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: agent, error } = await supabase
      .from('agents')
      .select('*, agencies(name, slug, logo_url, is_verified)')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Not found', success: false }, { status: 404 });
      throw error;
    }

    // Fetch properties listed by this agent (via owner_id = agent.user_id)
    let properties: any[] = [];
    if (agent?.user_id) {
      const { data: props } = await supabase
        .from('properties')
        .select('id, slug, title, price, area, state, images, type, bedrooms, bathrooms, sqm')
        .eq('owner_id', agent.user_id)
        .eq('status', 'available')
        .order('date_added', { ascending: false })
        .limit(12);
      properties = props || [];
    }

    return NextResponse.json({ agent, properties, success: true });
  } catch (error) {
    console.error('GET /api/agents/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch agent', success: false }, { status: 500 });
  }
}
