import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/admin/analytics - Get analytics data
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

    const adminSupabase = await createAdminSupabaseClient();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    const startDateStr = startDate.toISOString();

    // Run analytics queries in parallel
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
      adminSupabase.from('properties').select('*', { count: 'exact', head: true }),
      adminSupabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      adminSupabase.from('profiles').select('*', { count: 'exact', head: true }),
      adminSupabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startDateStr),
      adminSupabase.from('enquiries').select('*', { count: 'exact', head: true }),
      adminSupabase.from('enquiries').select('*', { count: 'exact', head: true }).gte('created_at', startDateStr),
      adminSupabase.from('viewing_requests').select('*', { count: 'exact', head: true }),
      adminSupabase.from('viewing_requests').select('*', { count: 'exact', head: true }).gte('created_at', startDateStr),
      adminSupabase.from('property_views').select('*', { count: 'exact', head: true }).gte('viewed_at', startDateStr),
      // Top properties by views
      adminSupabase
        .from('properties')
        .select('id, title, views, price, type, state')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(10),
      // Properties by state
      adminSupabase
        .from('properties')
        .select('state')
        .eq('status', 'published'),
      // Properties by type
      adminSupabase
        .from('properties')
        .select('type')
        .eq('status', 'published'),
      // Enquiries by day
      adminSupabase
        .from('enquiries')
        .select('created_at, status')
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: true }),
      // Users by type
      adminSupabase
        .from('profiles')
        .select('account_type'),
    ]);

    // Process state distribution
    const stateDistribution = (propertiesByState || []).reduce((acc: Record<string, number>, p: any) => {
      acc[p.state] = (acc[p.state] || 0) + 1;
      return acc;
    }, {});

    // Process type distribution
    const typeDistribution = (propertiesByType || []).reduce((acc: Record<string, number>, p: any) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});

    // Process user type distribution
    const userTypeDistribution = (usersByType || []).reduce((acc: Record<string, number>, u: any) => {
      acc[u.account_type] = (acc[u.account_type] || 0) + 1;
      return acc;
    }, {});

    // Process enquiry timeline
    const enquiryTimeline = (enquiriesByDay || []).reduce((acc: Record<string, number>, e: any) => {
      const date = e.created_at.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
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
    console.error('GET /api/admin/analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', success: false },
      { status: 500 }
    );
  }
}
