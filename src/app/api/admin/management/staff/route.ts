import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { logAdminActivity } from '@/lib/db-helpers';
import { createAdminSupabaseClient } from '@/lib/supabase-server';

const ROLES = ['super_admin', 'admin', 'editor', 'support'] as const;
type Role = (typeof ROLES)[number];

const STAFF_FIELDS =
  'id, first_name, last_name, email, phone, avatar_url, is_admin, admin_role, is_suspended, suspended_at, suspended_reason, last_login_at, created_at';

// GET /api/admin/management/staff — everyone with administrative access
export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const { data, error } = await auth.context.supabase
      .from('profiles')
      .select(STAFF_FIELDS)
      .or('is_admin.eq.true,admin_role.not.is.null')
      .order('created_at', { ascending: true });
    if (error) throw error;

    return NextResponse.json({ staff: data ?? [], success: true, roles: ROLES });
  } catch (error) {
    return databaseError(error, 'The staff list could not be loaded.');
  }
}

// PATCH /api/admin/management/staff — promote, change role, suspend or restore
export async function PATCH(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = (await request.json()) as {
      user_id?: string;
      is_admin?: boolean;
      admin_role?: Role | null;
      is_suspended?: boolean;
      suspended_reason?: string | null;
    };

    const userId = body.user_id;
    if (!userId) return NextResponse.json({ error: 'A user id is required.', success: false }, { status: 400 });

    if (body.admin_role != null && !ROLES.includes(body.admin_role)) {
      return NextResponse.json({ error: 'Unknown role.', success: false }, { status: 400 });
    }

    const { data: target, error: targetError } = await auth.context.supabase
      .from('profiles')
      .select('id, email, is_admin, admin_role, is_suspended')
      .eq('id', userId)
      .maybeSingle();
    if (targetError) throw targetError;
    if (!target) return NextResponse.json({ error: 'That user could not be found.', success: false }, { status: 404 });

    const isSelf = target.id === auth.context.user.id;
    const demoting = body.is_admin === false || body.admin_role === null;

    if (isSelf && demoting) {
      return NextResponse.json(
        { error: 'You cannot remove your own administrator access. Ask another administrator to do it.', success: false },
        { status: 400 },
      );
    }

    if (demoting) {
      const { count } = await auth.context.supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_admin', true);
      if ((count ?? 0) <= 1) {
        return NextResponse.json(
          { error: 'At least one administrator must keep access to the control panel.', success: false },
          { status: 409 },
        );
      }
    }

    const patch: Record<string, unknown> = {};
    if (body.is_admin !== undefined) patch.is_admin = body.is_admin;
    if (body.admin_role !== undefined) patch.admin_role = body.admin_role;
    if (body.is_admin === true && body.admin_role === undefined && !target.admin_role) patch.admin_role = 'admin';
    if (body.is_admin === false) patch.admin_role = null;

    if (body.is_suspended !== undefined) {
      patch.is_suspended = body.is_suspended;
      patch.suspended_at = body.is_suspended ? new Date().toISOString() : null;
      patch.suspended_reason = body.is_suspended ? (body.suspended_reason ?? 'Suspended by an administrator') : null;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.', success: false }, { status: 400 });
    }

    const { error } = await auth.context.supabase.from('profiles').update(patch).eq('id', userId);
    if (error) throw error;

    // Suspension must actually stop sign-in, so ban the auth account too.
    if (body.is_suspended !== undefined) {
      try {
        const adminClient = await createAdminSupabaseClient();
        await adminClient.auth.admin.updateUserById(userId, {
          ban_duration: body.is_suspended ? '876000h' : 'none',
        });
      } catch (banError) {
        console.error('Auth ban could not be applied:', banError);
      }
    }

    await logAdminActivity({
      admin_id: auth.context.user.id,
      action: body.is_suspended !== undefined ? (body.is_suspended ? 'staff_suspended' : 'staff_restored') : 'staff_role_changed',
      entity_type: 'profile',
      entity_id: userId,
      details: { email: target.email, ...patch },
    });

    return NextResponse.json({ success: true, staff: { ...target, ...patch } });
  } catch (error) {
    return databaseError(error, 'The staff member could not be updated.');
  }
}
