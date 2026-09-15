import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';
import { logAdminActivity } from '@/lib/db-helpers';

// GET /api/admin/users - Get all users
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
      .from('profiles')
      .select('*', { count: 'exact' });

    if (searchParams.get('search')) {
      const search = searchParams.get('search')!;
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (searchParams.get('account_type')) {
      query = query.eq('account_type', searchParams.get('account_type')!);
    }
    if (searchParams.get('is_admin') !== null && searchParams.get('is_admin') !== undefined) {
      query = query.eq('is_admin', searchParams.get('is_admin') === 'true');
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      users,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      success: true,
    });
  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', success: false },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users - Update user (toggle admin, verify, etc)
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
    
    if (!body.user_id) {
      return NextResponse.json(
        { error: 'User ID is required', success: false },
        { status: 400 }
      );
    }

    // Don't allow admins to modify themselves or other admins
    if (body.user_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot modify own account', success: false },
        { status: 400 }
      );
    }

    const adminSupabase = await createAdminSupabaseClient();
    const updates: any = {};

    if (body.action === 'toggle_admin') {
      // Check if target user exists
      const { data: targetUser } = await adminSupabase
        .from('profiles')
        .select('is_admin')
        .eq('id', body.user_id)
        .single();

      if (!targetUser) {
        return NextResponse.json(
          { error: 'User not found', success: false },
          { status: 404 }
        );
      }

      updates.is_admin = !targetUser.is_admin;
    } else if (body.action === 'toggle_verified') {
      const { data: targetUser } = await adminSupabase
        .from('profiles')
        .select('is_verified')
        .eq('id', body.user_id)
        .single();

      if (!targetUser) {
        return NextResponse.json(
          { error: 'User not found', success: false },
          { status: 404 }
        );
      }

      updates.is_verified = !targetUser.is_verified;
    } else if (body.action === 'update_account_type') {
      if (['buyer', 'seller', 'agent', 'admin'].includes(body.account_type)) {
        updates.account_type = body.account_type;
      }
    }

    const { data: updatedUser, error } = await adminSupabase
      .from('profiles')
      .update(updates)
      .eq('id', body.user_id)
      .select()
      .single();

    if (error) throw error;

    await logAdminActivity({
      admin_id: user.id,
      action: body.action,
      entity_type: 'user',
      entity_id: body.user_id,
      details: updates,
    });

    return NextResponse.json({ user: updatedUser, success: true });
  } catch (error) {
    console.error('PATCH /api/admin/users error:', error);
    return NextResponse.json(
      { error: 'Failed to update user', success: false },
      { status: 500 }
    );
  }
}
