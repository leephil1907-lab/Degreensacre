import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { DEFAULT_SITE_SETTINGS, normalizeWhatsappNumber } from '@/lib/site-settings';
import { isEmail, isPhone } from '@/lib/validation';

const SOCIAL_FIELDS = ['facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url'] as const;
const TEXT_FIELDS = ['company_name', 'tagline', 'contact_email', 'contact_phone', 'whatsapp_number', 'address'] as const;

function validOptionalUrl(value: string) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { data, error } = await auth.context.supabase
    .from('site_settings')
    .select('settings, updated_at')
    .eq('id', 1)
    .maybeSingle();

  if (error) return databaseError(error, 'Settings could not be loaded. Apply the production CMS migration and try again.');

  return NextResponse.json({
    settings: { ...DEFAULT_SITE_SETTINGS, ...(data?.settings || {}) },
    updated_at: data?.updated_at || null,
    persisted: Boolean(data),
    success: true,
  });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const incoming = body?.settings;
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
      return NextResponse.json({ error: 'A settings object is required.', success: false }, { status: 400 });
    }

    const settings = { ...DEFAULT_SITE_SETTINGS };
    for (const field of TEXT_FIELDS) {
      if (typeof incoming[field] !== 'string') {
        return NextResponse.json({ error: `${field.replaceAll('_', ' ')} is required.`, success: false }, { status: 400 });
      }
      const value = incoming[field].trim().replace(/\0/g, '');
      if (!value && ['company_name', 'contact_email', 'contact_phone', 'whatsapp_number', 'address'].includes(field)) {
        return NextResponse.json({ error: `${field.replaceAll('_', ' ')} is required.`, success: false }, { status: 400 });
      }
      if (value.length > (field === 'address' || field === 'tagline' ? 1000 : 320)) {
        return NextResponse.json({ error: `${field.replaceAll('_', ' ')} is too long.`, success: false }, { status: 400 });
      }
      settings[field] = value;
    }

    if (!isEmail(settings.contact_email)) {
      return NextResponse.json({ error: 'Enter a valid contact email address.', success: false }, { status: 400 });
    }
    if (!isPhone(settings.contact_phone)) {
      return NextResponse.json({ error: 'Enter a valid contact phone number.', success: false }, { status: 400 });
    }
    const whatsapp = normalizeWhatsappNumber(settings.whatsapp_number);
    if (!/^\d{7,15}$/.test(whatsapp)) {
      return NextResponse.json({ error: 'WhatsApp number must contain 7–15 digits in international format.', success: false }, { status: 400 });
    }
    settings.whatsapp_number = whatsapp;

    for (const field of SOCIAL_FIELDS) {
      const value = typeof incoming[field] === 'string' ? incoming[field].trim() : '';
      if (!validOptionalUrl(value)) {
        return NextResponse.json({ error: `${field.replaceAll('_', ' ')} must be a valid https:// URL.`, success: false }, { status: 400 });
      }
      settings[field] = value;
    }

    const inspectionFee = Number(incoming.inspection_fee);
    if (!Number.isInteger(inspectionFee) || inspectionFee < 0 || inspectionFee > 100_000_000) {
      return NextResponse.json({ error: 'Inspection fee must be a whole number between 0 and 100,000,000.', success: false }, { status: 400 });
    }
    settings.inspection_fee = inspectionFee;

    const { data, error } = await auth.context.supabase
      .from('site_settings')
      .upsert({ id: 1, settings, updated_by: auth.context.user.id, updated_at: new Date().toISOString() }, { onConflict: 'id' })
      .select('settings, updated_at')
      .single();

    if (error) return databaseError(error, 'Settings were not saved. Check the database migration and admin policy.');

    return NextResponse.json({ settings: data.settings, updated_at: data.updated_at, persisted: true, success: true });
  } catch (error) {
    console.error('PUT /api/admin/settings error:', error);
    return NextResponse.json({ error: 'Invalid settings request.', success: false }, { status: 400 });
  }
}
