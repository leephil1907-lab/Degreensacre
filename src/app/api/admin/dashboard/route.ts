import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';
import { getAdminStats, logAdminActivity } from '@/lib/db-helpers';

// GET /api/admin/dashboard - Admin dashboard stats
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

    // Check admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required', success: false },
        { status: 403 }
      );
    }

    const stats = await getAdminStats();

    // Get recent activity
    const adminSupabase = await createAdminSupabaseClient();
    const { data: recentActivity } = await adminSupabase
      .from('admin_activity')
      .select('*, profiles(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get pending properties for review
    const { data: pendingProperties } = await adminSupabase
      .from('properties')
      .select('id, title, slug, status, owner_id, date_added, profiles(first_name, last_name)')
      .in('status', ['submitted', 'under_review'])
      .order('date_added', { ascending: false })
      .limit(5);

    // Get recent enquiries
    const { data: recentEnquiries } = await adminSupabase
      .from('enquiries')
      .select('*, properties(title)')
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
    console.error('GET /api/admin/dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', success: false },
      { status: 500 }
    );
  }
}
