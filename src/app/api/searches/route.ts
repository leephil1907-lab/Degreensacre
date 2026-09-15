import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sanitizeForDb } from '@/lib/validation';

// GET /api/searches - Get user's saved searches
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { data: searches, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ searches, success: true });
  } catch (error) {
    console.error('GET /api/searches error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved searches', success: false },
      { status: 500 }
    );
  }
}

// POST /api/searches - Save a search
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to save searches', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.criteria || typeof body.criteria !== 'object') {
      return NextResponse.json(
        { error: 'Search criteria is required', success: false },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        name: body.name ? sanitizeForDb(body.name) : null,
        criteria: body.criteria,
        alert_enabled: body.alert_enabled !== false,
        alert_frequency: body.alert_frequency || 'daily',
      })
      .select()
      .single();

    if (error) {
      console.error('Save search error:', error);
      return NextResponse.json(
        { error: 'Failed to save search', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ search: data, success: true });
  } catch (error) {
    console.error('POST /api/searches error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/searches - Delete a saved search
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get('id');

    if (!searchId) {
      return NextResponse.json(
        { error: 'Search ID is required', success: false },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/searches error:', error);
    return NextResponse.json(
      { error: 'Failed to delete search', success: false },
      { status: 500 }
    );
  }
}
