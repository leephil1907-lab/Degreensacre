import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const adminSupabase = auth.context.supabase;
    const { searchParams } = new URL(request.url);
    const period = Math.min(365, Math.max(1, parseInt(searchParams.get('period') || '30', 10) || 30));

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    const startDateStr = startDate.toISOString();

    const [
      { count: totalProperties },
      { count: publishedProperties },
      { count: totalUsers },
      { count: newUsers },
      { count: totalEnquiries },
      { count: newEnquiries },
      { count: totalViewings },
      { count: newViewings },
      { count: totalViews },
      { data: topProperties },
      { data: propertiesByState },
      { data: propertiesByType },
      { data: enquiriesByDay },
      { data: usersByType },
    ] = await Promise.all([
      adminSupabase.from('properties').select('id', { count: 'exact', head: true }),
      adminSupabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'available'),
      adminSupabase.from('profiles').select('id', { count: 'exact', head: true }),
      adminSupabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', startDateStr),
      adminSupabase.from('enquiries').select('id', { count: 'exact', head: true }),
      adminSupabase.from('enquiries').select('id', { count: 'exact', head: true }).gte('created_at', startDateStr),
      adminSupabase.from('viewing_requests').select('id', { count: 'exact', head: true }),
      adminSupabase.from('viewing_requests').select('id', { count: 'exact', head: true }).gte('created_at', startDateStr),
      adminSupabase.from('property_views').select('id', { count: 'exact', head: true }).gte('viewed_at', startDateStr),
      adminSupabase
        .from('properties')
        .select('id, title, views, price, type, state')
        .eq('status', 'available')
        .order('views', { ascending: false })
        .limit(10),
      adminSupabase
        .from('properties')
        .select('state')
        .eq('status', 'available'),
      adminSupabase
        .from('properties')
        .select('type')
        .eq('status', 'available'),
      adminSupabase
        .from('enquiries')
        .select('created_at, status')
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: true }),
      adminSupabase
        .from('profiles')
        .select('account_type'),
    ]);

    const stateDistribution = (propertiesByState || []).reduce((acc: Record<string, number>, p: { state?: string | null }) => {
      if (p.state) acc[p.state] = (acc[p.state] || 0) + 1;
      return acc;
    }, {});

    const typeDistribution = (propertiesByType || []).reduce((acc: Record<string, number>, p: { type?: string | null }) => {
      if (p.type) acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});

    const userTypeDistribution = (usersByType || []).reduce((acc: Record<string, number>, u: { account_type?: string | null }) => {
      if (u.account_type) acc[u.account_type] = (acc[u.account_type] || 0) + 1;
      return acc;
    }, {});

    const enquiryTimeline = (enquiriesByDay || []).reduce((acc: Record<string, number>, e: { created_at?: string | null }) => {
      if (e.created_at) {
        const date = e.created_at.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    return NextResponse.json({
      overview: {
        totalProperties: totalProperties || 0,
        publishedProperties: publishedProperties || 0,
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        totalEnquiries: totalEnquiries || 0,
        newEnquiries: newEnquiries || 0,
        totalViewings: totalViewings || 0,
        newViewings: newViewings || 0,
        totalViews: totalViews || 0,
      },
      topProperties: topProperties || [],
      distributions: {
        byState: stateDistribution,
        byType: typeDistribution,
        usersByType: userTypeDistribution,
      },
      timeline: {
        enquiries: enquiryTimeline,
      },
      success: true,
    });
  } catch (error) {
    return databaseError(error, 'Failed to fetch analytics');
  }
}
