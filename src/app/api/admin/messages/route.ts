import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { isUuid } from '@/lib/validation';

const STATUSES = ['new', 'read', 'replied'];

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const params = new URL(request.url).searchParams;
  const status = params.get('status');
  let query = auth.context.supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(300);
  if (status && STATUSES.includes(status)) query = query.eq('status', status);
  if (params.get('type') === 'inspection') query = query.ilike('subject', 'Inspection Booking:%');
  if (params.get('type') === 'general') query = query.not('subject', 'ilike', 'Inspection Booking:%');

  const { data, error } = await query;
  if (error) return databaseError(error, 'Contact messages could not be loaded.');
  return NextResponse.json({ messages: data || [], success: true });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    if (!isUuid(String(body.id || '')) || !STATUSES.includes(String(body.status))) {
      return NextResponse.json({ error: 'A valid message ID and status are required.', success: false }, { status: 400 });
    }
    const { data, error } = await auth.context.supabase
      .from('contact_messages')
      .update({ status: body.status })
      .eq('id', body.id)
      .select('*')
      .single();
    if (error) return databaseError(error, 'The message status could not be updated.');
    return NextResponse.json({ message: data, success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid message update.', success: false }, { status: 400 });
  }
}
