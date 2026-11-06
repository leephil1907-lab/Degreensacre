import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requestRateLimit } from '@/lib/rate-limit';
import { isEmail, isPhone, sanitizeForDb } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const rate = requestRateLimit(request, 'contact', 5);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many messages from this connection. Please try again later.', success: false },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } },
    );
  }

  try {
    const body = await request.json();
    const errors: string[] = [];
    if (!body.name || String(body.name).trim().length < 2 || String(body.name).length > 120) errors.push('Enter a valid name');
    if (!body.email || !isEmail(String(body.email))) errors.push('Enter a valid email address');
    if (!body.subject || String(body.subject).trim().length < 3 || String(body.subject).length > 200) errors.push('Enter a valid subject');
    if (!body.message || String(body.message).trim().length < 10 || String(body.message).length > 5000) errors.push('Message must contain 10–5,000 characters');
    if (body.phone && !isPhone(String(body.phone))) errors.push('Enter a valid phone number');
    if (errors.length) return NextResponse.json({ error: errors.join('. '), success: false }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: sanitizeForDb(String(body.name)),
      email: String(body.email).toLowerCase().trim(),
      phone: body.phone ? sanitizeForDb(String(body.phone)) : null,
      subject: sanitizeForDb(String(body.subject)),
      message: sanitizeForDb(String(body.message)),
      status: 'new',
    });

    if (error) {
      console.error('Contact form persistence error:', error);
      return NextResponse.json({ error: 'Your message could not be saved. Please try again or contact us by phone.', success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Your message has been received. Our team will respond using the contact details you provided.' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'Invalid contact request.', success: false }, { status: 400 });
  }
}
