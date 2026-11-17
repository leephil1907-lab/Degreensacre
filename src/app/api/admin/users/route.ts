import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { logAdminActivity } from '@/lib/db-helpers';
import { isUuid } from '@/lib/validation';

const USER_FIELDS =
  'id, email, first_name, last_name, phone, state, country, avatar_url, account_type, is_admin, admin_role, is_verified, is_suspended, last_login_at, created_at, updated_at';

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    let query = auth.context.supabase
      .from('profiles')
      .select(USER_FIELDS, { count: 'exact' });

    if (searchParams.get('search')) {
      const search = searchParams.get('search')!.replace(/[%_,()]/g, '').trim();
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }
    }
    if (searchParams.get('account_type')) {
      query = query.eq('account_type', searchParams.get('account_type')!);
    }
    if (searchParams.get('is_admin') !== null && searchParams.get('is_admin') !== undefined) {
      query = query.eq('is_admin', searchParams.get('is_admin') === 'true');
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) return databaseError(error, 'Failed to fetch users');

    return NextResponse.json({
      users,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      success: true,
    });
  } catch (error) {
    return databaseError(error, 'Failed to fetch users');
  }
}

// PATCH /api/admin/users - Update user (toggle admin, verify, etc)
export async function PATCH(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();

    if (!isUuid(String(body.user_id || ''))) {
      return NextResponse.json(
        { error: 'Valid user ID is required', success: false },
        { status: 400 }
      );
    }

    // Don't allow admins to modify themselves
    if (body.user_id === auth.context.user.id) {
      return NextResponse.json(
        { error: 'Cannot modify own account', success: false },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.action === 'toggle_admin') {
      const { data: targetUser } = await auth.context.supabase
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
      const { data: targetUser } = await auth.context.supabase
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
      if (['buyer', 'seller', 'agent'].includes(body.account_type)) {
        updates.account_type = body.account_type;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Invalid user action or account type', success: false }, { status: 400 });
    }

    const { data: updatedUser, error } = await auth.context.supabase
      .from('profiles')
      .update(updates)
      .eq('id', body.user_id)
      .select(USER_FIELDS)
      .single();

    if (error) return databaseError(error, 'Failed to update user');

    await logAdminActivity({
      admin_id: auth.context.user.id,
      action: String(body.action),
      entity_type: 'user',
      entity_id: body.user_id,
      details: updates,
    });

    return NextResponse.json({ user: updatedUser, success: true });
  } catch (error) {
    return databaseError(error, 'Failed to update user');
  }
}
