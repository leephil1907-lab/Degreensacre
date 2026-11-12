import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';

type ActivityRow = {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  actor: string | null;
  created_at: string;
  source: 'admin_activity' | 'audit_logs';
};

// GET /api/admin/management/activity?limit=&q=&entity=
export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') || 150), 500);
  const search = (request.nextUrl.searchParams.get('q') || '').trim().toLowerCase();
  const entity = (request.nextUrl.searchParams.get('entity') || '').trim();

  try {
    let adminQuery = auth.context.supabase
      .from('admin_activity')
      .select('id, admin_id, action, entity_type, entity_id, details, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (entity) adminQuery = adminQuery.eq('entity_type', entity);

    let auditQuery = auth.context.supabase
      .from('audit_logs')
      .select('id, user_id, action, entity_type, entity_id, new_values, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (entity) auditQuery = auditQuery.eq('entity_type', entity);

    const [adminResult, auditResult] = await Promise.all([adminQuery, auditQuery]);
    if (adminResult.error) throw adminResult.error;
    if (auditResult.error) throw auditResult.error;

    const actorIds = Array.from(
      new Set(
        [...(adminResult.data ?? []).map((row) => row.admin_id), ...(auditResult.data ?? []).map((row) => row.user_id)].filter(
          Boolean,
        ),
      ),
    ) as string[];

    let actors = new Map<string, string>();
    if (actorIds.length > 0) {
      const { data: profiles } = await auth.context.supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', actorIds);
      actors = new Map(
        (profiles ?? []).map((profile) => [
          profile.id,
          [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email || 'Administrator',
        ]),
      );
    }

    const merged: ActivityRow[] = [
      ...(adminResult.data ?? []).map((row) => ({
        id: row.id,
        action: row.action,
        entity_type: row.entity_type,
        entity_id: row.entity_id,
        details: row.details,
        actor: row.admin_id ? actors.get(row.admin_id) ?? null : null,
        created_at: row.created_at,
        source: 'admin_activity' as const,
      })),
      ...(auditResult.data ?? []).map((row) => ({
        id: row.id,
        action: row.action,
        entity_type: row.entity_type,
        entity_id: row.entity_id,
        details: row.new_values,
        actor: row.user_id ? actors.get(row.user_id) ?? null : null,
        created_at: row.created_at,
        source: 'audit_logs' as const,
      })),
    ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .filter((row) => {
        if (!search) return true;
        return [row.action, row.entity_type, row.actor, JSON.stringify(row.details ?? '')]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
      })
      .slice(0, limit);

    return NextResponse.json({ activity: merged, success: true });
  } catch (error) {
    return databaseError(error, 'The activity log could not be loaded.');
  }
}
