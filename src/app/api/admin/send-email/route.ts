import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';

// POST /api/admin/send-email — Send email to users
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const body = await request.json();
    const { recipient_type, custom_emails, subject, message, template } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required', success: false }, { status: 400 });
    }

    const adminSupabase = await createAdminSupabaseClient();
    let recipientEmails: string[] = [];

    // Get recipient emails based on type
    if (recipient_type === 'custom') {
      recipientEmails = (custom_emails || '').split(',').map((e: string) => e.trim()).filter(Boolean);
    } else {
      let query = adminSupabase.from('profiles').select('email');
      
      switch (recipient_type) {
        case 'all': break;
        case 'buyers': query = query.eq('account_type', 'buyer'); break;
        case 'sellers': query = query.eq('account_type', 'seller'); break;
        case 'agents': query = query.eq('account_type', 'agent'); break;
        case 'verified': query = query.eq('is_verified', true); break;
        case 'unverified': query = query.eq('is_verified', false); break;
        case 'admins': query = query.eq('is_admin', true); break;
        default: break;
      }

      const { data: users, error } = await query;
      if (error) throw error;
      recipientEmails = (users || []).map((u: any) => u.email).filter(Boolean);
    }

    if (recipientEmails.length === 0) {
      return NextResponse.json({ error: 'No recipients found', success: false }, { status: 400 });
    }

    // Store sent email record
    const { data: emailRecord, error: insertError } = await adminSupabase
      .from('sent_emails')
      .insert({
        sender_id: user.id,
        recipient_type,
        recipient_count: recipientEmails.length,
        recipients: recipientEmails,
        subject,
        message,
        template: template || 'custom',
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      // Table might not exist yet — log but don't fail
      console.error('sent_emails insert error:', insertError);
    }

    // For now, return success with recipient count
    // When Resend API key is added, emails will actually be sent
    // TODO: Wire up Resend when API key is available
    return NextResponse.json({
      success: true,
      sent_to: recipientEmails.length,
      recipients: recipientEmails,
      message: `Email queued for delivery to ${recipientEmails.length} recipient(s). Emails will be sent once Resend is configured.`,
    });
  } catch (error: any) {
    console.error('POST /api/admin/send-email error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email', success: false }, { status: 500 });
  }
}

// GET /api/admin/send-email — Get sent email history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const adminSupabase = await createAdminSupabaseClient();
    const { data: emails, error } = await adminSupabase
      .from('sent_emails')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ emails: emails || [], success: true });
  } catch (error: any) {
    console.error('GET /api/admin/send-email error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch emails', success: false }, { status: 500 });
  }
}
