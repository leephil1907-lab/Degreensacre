import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { isEmail } from '@/lib/validation';

const RECIPIENT_TYPES = ['all', 'buyers', 'sellers', 'agents', 'verified', 'unverified', 'admins', 'custom'];
const MAX_RECIPIENTS = 100;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character);
}

function campaignHtml(subject: string, message: string) {
  const paragraphs = message.split(/\n{2,}/).map((paragraph) => `<p style="margin:0 0 16px;line-height:1.7;color:#3d4638;white-space:pre-line">${escapeHtml(paragraph)}</p>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#f5f5f0;font-family:Arial,sans-serif"><div style="max-width:600px;margin:auto;padding:24px"><div style="background:#283818;color:white;padding:28px;border-radius:16px 16px 0 0"><h1 style="margin:0;font-size:24px">De-Greenacres Properties</h1></div><div style="background:white;padding:32px;border-radius:0 0 16px 16px"><h2 style="margin-top:0;color:#283818">${escapeHtml(subject)}</h2>${paragraphs}<hr style="border:0;border-top:1px solid #e8e8d8;margin:28px 0"><p style="font-size:12px;color:#78806f">De-Greenacres Properties Limited · RC: 1856064<br>You received this email because you have an account or enquiry with us.</p></div></div></body></html>`;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email delivery is not configured. Add RESEND_API_KEY before sending a campaign.', success: false }, { status: 503 });
  }
  if (process.env.NODE_ENV === 'production' && !process.env.EMAIL_FROM) {
    return NextResponse.json({ error: 'EMAIL_FROM must be a verified sender before production campaigns can be sent.', success: false }, { status: 503 });
  }

  try {
    const body = await request.json();
    const recipientType = String(body.recipient_type || '');
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();
    if (!RECIPIENT_TYPES.includes(recipientType) || !subject || subject.length > 200 || !message || message.length > 20000) {
      return NextResponse.json({ error: 'A valid audience, subject (max 200 characters) and message (max 20,000 characters) are required.', success: false }, { status: 400 });
    }

    let recipientEmails: string[] = [];
    if (recipientType === 'custom') {
      recipientEmails = String(body.custom_emails || '').split(/[,;\n]/).map((email) => email.trim().toLowerCase()).filter(Boolean);
      if (recipientEmails.some((email) => !isEmail(email))) return NextResponse.json({ error: 'One or more custom email addresses are invalid.', success: false }, { status: 400 });
    } else {
      let query = auth.context.supabase.from('profiles').select('email');
      if (['buyers', 'sellers', 'agents'].includes(recipientType)) query = query.eq('account_type', recipientType.slice(0, -1));
      if (recipientType === 'verified') query = query.eq('is_verified', true);
      if (recipientType === 'unverified') query = query.eq('is_verified', false);
      if (recipientType === 'admins') query = query.eq('is_admin', true);
      const { data: users, error } = await query;
      if (error) return databaseError(error, 'Campaign recipients could not be loaded.');
      recipientEmails = (users || []).map((user) => user.email).filter((email): email is string => Boolean(email && isEmail(email)));
    }

    recipientEmails = [...new Set(recipientEmails)];
    if (recipientEmails.length === 0) return NextResponse.json({ error: 'No valid recipients were found.', success: false }, { status: 400 });
    if (recipientEmails.length > MAX_RECIPIENTS) return NextResponse.json({ error: `This audience has ${recipientEmails.length} recipients. Send to a segment of ${MAX_RECIPIENTS} or fewer at a time.`, success: false }, { status: 400 });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM || 'De-Greenacres <onboarding@resend.dev>';
    const html = campaignHtml(subject, message);
    const delivered: string[] = [];
    const failures: string[] = [];

    // Send individual messages so recipients cannot see one another's addresses.
    for (const email of recipientEmails) {
      const { error } = await resend.emails.send({ from, to: [email], subject, html, replyTo: process.env.EMAIL_REPLY_TO || undefined });
      if (error) failures.push(email); else delivered.push(email);
    }

    const status = failures.length === 0 ? 'sent' : delivered.length === 0 ? 'failed' : 'partial';
    const { error: recordError } = await auth.context.supabase.from('sent_emails').insert({
      sender_id: auth.context.user.id,
      recipient_type: recipientType,
      recipient_count: delivered.length,
      recipients: delivered,
      subject,
      message,
      template: String(body.template || 'custom').slice(0, 50),
      status,
      sent_at: new Date().toISOString(),
    });
    if (recordError) console.error('Campaign delivery completed but history could not be saved:', recordError.message);

    if (failures.length > 0) {
      return NextResponse.json({ error: `${delivered.length} email(s) delivered; ${failures.length} failed. Check the verified sender, recipient addresses and Resend logs.`, sent_to: delivered.length, failed: failures.length, success: false }, { status: 502 });
    }
    return NextResponse.json({ success: true, sent_to: delivered.length, message: `Email delivered to ${delivered.length} recipient(s).` });
  } catch (error) {
    console.error('POST /api/admin/send-email error:', error);
    return NextResponse.json({ error: 'The email campaign could not be sent.', success: false }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const { data, error } = await auth.context.supabase.from('sent_emails').select('*').order('sent_at', { ascending: false }).limit(50);
  if (error) return databaseError(error, 'Email history could not be loaded.');
  return NextResponse.json({ emails: data || [], success: true });
}
