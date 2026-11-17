import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { isUuid } from '@/lib/validation';

// GET /api/admin/enquiries - Get all enquiries
export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);

    let query = auth.context.supabase
      .from('enquiries')
      .select('id, property_id, buyer_id, buyer_name, buyer_email, buyer_phone, message, status, priority, assigned_to, admin_notes, source, responded_at, closed_at, created_at, updated_at, properties(title, slug), profiles(first_name, last_name, email)', { count: 'exact' });

    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status')!);
    }
    if (searchParams.get('search')) {
      const search = searchParams.get('search')!.replace(/[%_,()]/g, '').trim();
      if (search) {
        query = query.or(`buyer_name.ilike.%${search}%,buyer_email.ilike.%${search}%`);
      }
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: enquiries, error, count } = await query;

    if (error) return databaseError(error, 'Failed to fetch enquiries');

    return NextResponse.json({
      enquiries,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      success: true,
    });
  } catch (error) {
    return databaseError(error, 'Failed to fetch enquiries');
  }
}

// PATCH /api/admin/enquiries - Update enquiry status
export async function PATCH(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();

    if (!isUuid(String(body.enquiry_id || ''))) {
      return NextResponse.json(
        { error: 'Valid enquiry ID is required', success: false },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.status) {
      updates.status = body.status;
      if (body.status === 'contacted') {
        updates.responded_at = new Date().toISOString();
      }
      if (body.status === 'closed' || body.status === 'lost') {
        updates.closed_at = new Date().toISOString();
      }
    }
    if (body.admin_notes !== undefined) {
      updates.admin_notes = body.admin_notes;
    }
    if (body.priority) {
      updates.priority = body.priority;
    }
    if (body.assigned_to && isUuid(String(body.assigned_to))) {
      updates.assigned_to = body.assigned_to;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No enquiry updates supplied', success: false }, { status: 400 });
    }

    const { data: enquiry, error } = await auth.context.supabase
      .from('enquiries')
      .update(updates)
      .eq('id', body.enquiry_id)
      .select()
      .single();

    if (error) return databaseError(error, 'Failed to update enquiry');

    return NextResponse.json({ enquiry, success: true });
  } catch (error) {
    return databaseError(error, 'Failed to update enquiry');
  }
}
