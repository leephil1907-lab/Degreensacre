import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  
  const type = searchParams.get('type');
  const state = searchParams.get('state');
  const featured = searchParams.get('featured');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .order('date_added', { ascending: false })
    .limit(limit);

  if (type) query = query.eq('type', type);
  if (state) query = query.eq('state', state);
  if (featured === 'true') query = query.eq('featured', true);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ properties: data });
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from('properties')
    .insert({ ...body, owner_id: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ property: data }, { status: 201 });
}
