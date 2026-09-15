import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';
import { logAdminActivity } from '@/lib/db-helpers';
import { sanitizeForDb } from '@/lib/validation';

// GET /api/admin/properties - Get all properties for moderation
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
      .from('properties')
      .select('*, property_images(url, display_order), profiles(first_name, last_name, email)', { count: 'exact' });

    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status')!);
    }
    if (searchParams.get('verification_status')) {
      query = query.eq('verification_status', searchParams.get('verification_status')!);
    }
    if (searchParams.get('search')) {
      query = query.ilike('title', `%${searchParams.get('search')}%`);
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    query = query
      .order('date_added', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: properties, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      properties,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      success: true,
    });
  } catch (error) {
    console.error('GET /api/admin/properties error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', success: false },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/properties - Moderate property (approve, reject, publish, verify)
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
    
    if (!body.property_id) {
      return NextResponse.json(
        { error: 'Property ID is required', success: false },
        { status: 400 }
      );
    }

    const adminSupabase = await createAdminSupabaseClient();
    const updates: any = {};

    switch (body.action) {
      case 'approve':
        updates.status = 'published';
        updates.published_at = new Date().toISOString();
        break;
      case 'reject':
        updates.status = 'rejected';
        break;
      case 'withdraw':
        updates.status = 'withdrawn';
        break;
      case 'verify':
        updates.verification_status = 'verified';
        break;
      case 'unverify':
        updates.verification_status = 'unverified';
        break;
      case 'feature':
        updates.featured = !body.current_featured;
        break;
      case 'update_status':
        if (body.new_status) {
          updates.status = body.new_status;
          if (body.new_status === 'published') {
            updates.published_at = new Date().toISOString();
          }
        }
        break;
      case 'add_note':
        // Add admin note (would need a notes field or separate table)
        updates.admin_notes = body.note;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action', success: false },
          { status: 400 }
        );
    }

    if (body.verification_status) {
      updates.verification_status = body.verification_status;
    }

    const { data: property, error } = await adminSupabase
      .from('properties')
      .update(updates)
      .eq('id', body.property_id)
      .select()
      .single();

    if (error) throw error;

    // Log admin activity
    await logAdminActivity({
      admin_id: user.id,
      action: body.action,
      entity_type: 'property',
      entity_id: body.property_id,
      details: { new_status: property?.status, note: body.note },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ property, success: true });
  } catch (error) {
    console.error('PATCH /api/admin/properties error:', error);
    return NextResponse.json(
      { error: 'Failed to moderate property', success: false },
      { status: 500 }
    );
  }
}
