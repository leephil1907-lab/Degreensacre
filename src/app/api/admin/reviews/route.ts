import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/admin/reviews — Get all reviews (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const adminSupabase = await createAdminSupabaseClient();
    const { data: reviews, error } = await adminSupabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reviews: reviews || [], success: true });
  } catch (error: any) {
    console.error('GET /api/admin/reviews error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews', success: false }, { status: 500 });
  }
}

// PATCH /api/admin/reviews — Approve or reject a review
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const body = await request.json();
    const { review_id, action } = body;

    if (!review_id) return NextResponse.json({ error: 'Review ID required', success: false }, { status: 400 });

    const adminSupabase = await createAdminSupabaseClient();
    const status = action === 'approve' ? 'approved' : 'rejected';

    const { data: review, error } = await adminSupabase
      .from('reviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', review_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ review, success: true });
  } catch (error: any) {
    console.error('PATCH /api/admin/reviews error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update review', success: false }, { status: 500 });
  }
}

// DELETE /api/admin/reviews — Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const body = await request.json();
    const { review_id } = body;

    if (!review_id) return NextResponse.json({ error: 'Review ID required', success: false }, { status: 400 });

    const adminSupabase = await createAdminSupabaseClient();
    const { error } = await adminSupabase.from('reviews').delete().eq('id', review_id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/admin/reviews error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete review', success: false }, { status: 500 });
  }
}
