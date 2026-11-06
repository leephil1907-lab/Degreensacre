import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requestRateLimit } from '@/lib/rate-limit';
import { isEmail, isPhone, sanitizeForDb } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const rate = requestRateLimit(request, 'inspection', 5);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many inspection requests. Please try again later or contact us by phone.', success: false },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } },
    );
  }

  try {
    const body = await request.json();
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const preferredDate = String(body.preferred_date || '');
    const state = String(body.state || '').trim();
    const location = String(body.location || '').trim();

    if (fullName.length < 2 || fullName.length > 120) return NextResponse.json({ error: 'Enter your full name.', success: false }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ error: 'Enter a valid email address.', success: false }, { status: 400 });
    if (!isPhone(phone)) return NextResponse.json({ error: 'Enter a valid phone number.', success: false }, { status: 400 });
    if (!state || !preferredDate || Number.isNaN(Date.parse(preferredDate))) return NextResponse.json({ error: 'Select a state and valid preferred date.', success: false }, { status: 400 });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${preferredDate}T00:00:00`) < today) return NextResponse.json({ error: 'Preferred inspection date cannot be in the past.', success: false }, { status: 400 });

    const propertyInterest = String(body.property_interest || 'General property viewing').trim();
    const message = [
      'INSPECTION BOOKING REQUEST',
      `Name: ${fullName}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Property: ${propertyInterest}`,
      `Location: ${location}, ${state}`,
      `Preferred Date: ${preferredDate}`,
      `Preferred Time: ${String(body.preferred_time || 'Any')}`,
      `Attendees: ${String(body.attendees || '1')}`,
      `Source: ${String(body.hear_about || 'Not specified')}`,
      `Notes: ${String(body.notes || 'None')}`,
    ].join('\n');
    if (message.length > 7000) return NextResponse.json({ error: 'Inspection notes are too long.', success: false }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: sanitizeForDb(fullName),
      email,
      phone: sanitizeForDb(phone),
      subject: sanitizeForDb(`Inspection Booking: ${propertyInterest || location || state}`),
      message: sanitizeForDb(message),
      status: 'new',
    });

    if (error) {
      console.error('Inspection persistence error:', error);
      return NextResponse.json({ error: 'Your inspection request could not be saved. Please try again or use WhatsApp.', success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Inspection request received. Our team will contact you to confirm availability.' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/book-inspection error:', error);
    return NextResponse.json({ error: 'Invalid inspection request.', success: false }, { status: 400 });
  }
}
