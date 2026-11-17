import { NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { getAdminStats } from '@/lib/db-helpers';

// GET /api/admin/dashboard - Admin dashboard stats
export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const stats = await getAdminStats();
    const adminSupabase = auth.context.supabase;

    const { data: recentActivity } = await adminSupabase
      .from('admin_activity')
      .select('id, admin_id, action, entity_type, entity_id, details, created_at, profiles(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: pendingProperties } = await adminSupabase
      .from('properties')
      .select('id, title, slug, status, owner_id, date_added, profiles(first_name, last_name)')
      .eq('status', 'pending_review')
      .order('date_added', { ascending: false })
      .limit(5);

    const { data: recentEnquiries } = await adminSupabase
      .from('enquiries')
      .select('id, property_id, buyer_name, buyer_email, status, priority, created_at, properties(title)')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats,
      recentActivity,
      pendingProperties,
      recentEnquiries,
      success: true,
    });
  } catch (error) {
    return databaseError(error, 'Failed to fetch dashboard data');
  }
}
