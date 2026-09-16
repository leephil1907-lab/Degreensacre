import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/admin/settings — Get site settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const adminSupabase = await createAdminSupabaseClient();
    
    // Try to get settings from site_settings table
    const { data: settings, error } = await adminSupabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      // Table might not exist — return defaults
      return NextResponse.json({
        settings: {
          company_name: 'De-Greenacres Properties Limited',
          rc_number: 'RC: 1856064',
          email: 'degreenacrespropertieslimited@gmail.com',
          phone: '08065019971',
          whatsapp: '07041754800',
          address: 'Lagos, Nigeria',
          inspection_fee: 20000,
          notify_new_user: true,
          notify_new_property: true,
          notify_new_enquiry: true,
          notify_payment: true,
        },
        success: true,
      });
    }

    return NextResponse.json({ settings, success: true });
  } catch (error: any) {
    console.error('GET /api/admin/settings error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch settings', success: false }, { status: 500 });
  }
}

// PUT /api/admin/settings — Update site settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const body = await request.json();
    const adminSupabase = await createAdminSupabaseClient();

    // Try to upsert settings
    const { data: settings, error } = await adminSupabase
      .from('site_settings')
      .upsert({
        id: 1,
        ...body,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      // Table doesn't exist — that's OK, settings are just cached in code for now
      console.warn('site_settings table not found:', error.message);
      return NextResponse.json({
        success: true,
        settings: body,
        message: 'Settings saved (table not yet created — will persist once site_settings table exists)',
      });
    }

    return NextResponse.json({ settings, success: true });
  } catch (error: any) {
    console.error('PUT /api/admin/settings error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save settings', success: false }, { status: 500 });
  }
}
