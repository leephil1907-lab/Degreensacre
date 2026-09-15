import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/admin/enquiries - Get all enquiries
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden', success: false },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminSupabase = await createAdminSupabaseClient();

    let query = adminSupabase
      .from('enquiries')
      .select('*, properties(title, slug), profiles(first_name, last_name, email)', { count: 'exact' });

    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status')!);
    }
    if (searchParams.get('search')) {
      const search = searchParams.get('search')!;
      query = query.or(`buyer_name.ilike.%${search}%,buyer_email.ilike.%${search}%`);
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: enquiries, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      enquiries,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      success: true,
    });
  } catch (error) {
    console.error('GET /api/admin/enquiries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries', success: false },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/enquiries - Update enquiry status
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden', success: false },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body.enquiry_id) {
      return NextResponse.json(
        { error: 'Enquiry ID is required', success: false },
        { status: 400 }
      );
    }

    const adminSupabase = await createAdminSupabaseClient();
    const updates: any = {};

    if (body.status) {
      updates.status = body.status;
      if (body.status === 'contacted') {
        updates.responded_at = new Date().toISOString();
      }
      if (body.status === 'closed' || body.status === 'lost') {
        updates.closed_at = new Date().toISOString();
      }
    }
    if (body.admin_notes) {
      updates.admin_notes = body.admin_notes;
    }
    if (body.priority) {
      updates.priority = body.priority;
    }
    if (body.assigned_to) {
      updates.assigned_to = body.assigned_to;
    }

    const { data: enquiry, error } = await adminSupabase
      .from('enquiries')
      .update(updates)
      .eq('id', body.enquiry_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ enquiry, success: true });
  } catch (error) {
    console.error('PATCH /api/admin/enquiries error:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry', success: false },
      { status: 500 }
    );
  }
}
