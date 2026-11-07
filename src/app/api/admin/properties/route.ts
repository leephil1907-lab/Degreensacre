import { notifyListingChange, notifyEvents } from '@/lib/email-events';
import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { isUuid, NIGERIAN_STATES, PROPERTY_TYPES } from '@/lib/validation';

export const runtime = 'nodejs';

const STATUSES = ['draft', 'pending_review', 'available', 'sold', 'rented', 'withdrawn'];
const VERIFICATION_STATUSES = ['verified', 'pending', 'unverified'];
const NUMERIC_FIELDS = ['price', 'bedrooms', 'bathrooms', 'toilets', 'parking', 'sqm'] as const;
const OPTIONAL_NUMERIC_FIELDS = ['land_size'] as const;
const BOOLEAN_FIELDS = ['furnished', 'serviced', 'gated_estate', 'featured', 'negotiable'] as const;
const STRING_FIELDS = ['slug', 'title', 'description', 'property_type', 'type', 'price_period', 'address', 'area', 'lga', 'city', 'state', 'documentation', 'status', 'verification_status'] as const;
const ARRAY_FIELDS = ['features', 'amenities', 'images'] as const;

function slugify(value: unknown) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 180);
}

function validImage(value: string) {
  if (value.startsWith('/')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function propertyPayload(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};

  for (const field of STRING_FIELDS) {
    if (body[field] === undefined) continue;
    payload[field] = typeof body[field] === 'string' ? String(body[field]).trim().replace(/\0/g, '') : '';
  }
  payload.slug = slugify(payload.slug || payload.title);

  for (const field of NUMERIC_FIELDS) {
    if (body[field] === undefined) continue;
    const value = Number(body[field]);
    if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${field.replaceAll('_', ' ')} must be a non-negative whole number.`);
    payload[field] = value;
  }
  for (const field of OPTIONAL_NUMERIC_FIELDS) {
    if (body[field] === undefined) continue;
    if (body[field] === '' || body[field] === null) {
      payload[field] = null;
      continue;
    }
    const value = Number(body[field]);
    if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${field.replaceAll('_', ' ')} must be a non-negative whole number.`);
    payload[field] = value;
  }
  for (const field of BOOLEAN_FIELDS) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== 'boolean') throw new Error(`${field.replaceAll('_', ' ')} must be true or false.`);
    payload[field] = body[field];
  }
  for (const field of ARRAY_FIELDS) {
    if (body[field] === undefined) continue;
    const source = Array.isArray(body[field]) ? body[field] : String(body[field] || '').split(/\r?\n/);
    const values = source.map((value) => String(value).trim().replace(/\0/g, '')).filter(Boolean).slice(0, field === 'images' ? 20 : 50);
    if (values.some((value) => value.length > 2048)) throw new Error(`${field} contains an entry that is too long.`);
    if (field === 'images' && values.some((value) => !validImage(value))) throw new Error('Every property image must be an absolute http(s) URL or a local /path.');
    payload[field] = values;
  }

  if (body.coordinates !== undefined) {
    if (body.coordinates === null || body.coordinates === '') {
      payload.coordinates = null;
    } else {
      if (typeof body.coordinates !== 'object' || Array.isArray(body.coordinates)) throw new Error('Coordinates must contain a valid latitude and longitude.');
      const source = body.coordinates as Record<string, unknown>;
      const lat = Number(source.lat);
      const lng = Number(source.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) throw new Error('Enter a valid latitude (-90 to 90) and longitude (-180 to 180).');
      payload.coordinates = { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
    }
  }

  const required = ['slug', 'title', 'description', 'property_type', 'type', 'area', 'state', 'status', 'verification_status'];
  for (const field of required) {
    if (!payload[field]) throw new Error(`${field.replaceAll('_', ' ')} is required.`);
  }
  if (String(payload.title).length < 5 || String(payload.title).length > 200) throw new Error('Title must be between 5 and 200 characters.');
  if (String(payload.description).length < 50) throw new Error('Description must contain at least 50 characters.');
  if (!PROPERTY_TYPES.includes(payload.type as typeof PROPERTY_TYPES[number])) throw new Error('Select a valid listing type.');
  if (!NIGERIAN_STATES.includes(payload.state as string)) throw new Error('Select a valid Nigerian state.');
  if (!STATUSES.includes(payload.status as string)) throw new Error('Select a valid publication status.');
  if (!VERIFICATION_STATUSES.includes(payload.verification_status as string)) throw new Error('Select a valid verification status.');
  if (!Number(payload.price) || Number(payload.price) <= 0) throw new Error('Price must be greater than zero.');

  return payload;
}

async function bodyJson(request: NextRequest) {
  const body = await request.json();
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('A JSON object is required.');
  return body as Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const status = new URL(request.url).searchParams.get('status');
  let query = auth.context.supabase.from('properties').select('*').order('date_added', { ascending: false }).limit(500);
  if (status && STATUSES.includes(status)) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return databaseError(error, 'Properties could not be loaded.');
  return NextResponse.json({ properties: data || [], success: true });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const payload = propertyPayload(await bodyJson(request));
    payload.owner_id = auth.context.user.id;
    const { data, error } = await auth.context.supabase.from('properties').insert(payload).select('*').single();
    if (error) return databaseError(error, 'The property could not be created.');
    return NextResponse.json({ property: data, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid property.', success: false }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await bodyJson(request);
    const id = new URL(request.url).searchParams.get('id') || String(body.id || '');
    if (!isUuid(id)) return NextResponse.json({ error: 'A valid property ID is required.', success: false }, { status: 400 });
    const { data: previous, error: previousError } = await auth.context.supabase.from('properties').select('status').eq('id', id).single();
    if (previousError) return databaseError(previousError, 'The property could not be loaded.');
    const payload = propertyPayload(body);
    payload.updated_at = new Date().toISOString();
    const { data, error } = await auth.context.supabase.from('properties').update(payload).eq('id', id).select('*').single();
    if (error) return databaseError(error, 'The property could not be updated.');
    await notifyListingChange(auth.context.supabase, previous, data);
    return NextResponse.json({ property: data, success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid property.', success: false }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await bodyJson(request);
    const id = String(body.property_id || body.id || '');
    if (!isUuid(id)) return NextResponse.json({ error: 'A valid property ID is required.', success: false }, { status: 400 });
    const { data: previous, error: previousError } = await auth.context.supabase.from('properties').select('status').eq('id', id).single();
    if (previousError) return databaseError(previousError, 'The property could not be loaded.');
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.status !== undefined) {
      if (!STATUSES.includes(String(body.status))) throw new Error('Invalid publication status.');
      updates.status = body.status;
    }
    if (body.verification_status !== undefined) {
      if (!VERIFICATION_STATUSES.includes(String(body.verification_status))) throw new Error('Invalid verification status.');
      updates.verification_status = body.verification_status;
    }
    if (body.featured !== undefined) {
      if (typeof body.featured !== 'boolean') throw new Error('Featured must be true or false.');
      updates.featured = body.featured;
    }
    if (Object.keys(updates).length === 1) throw new Error('No supported moderation changes were supplied.');

    const { data, error } = await auth.context.supabase.from('properties').update(updates).eq('id', id).select('*').single();
    if (error) return databaseError(error, 'The property could not be moderated.');
    await notifyListingChange(auth.context.supabase, previous, data);
    return NextResponse.json({ property: data, success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid moderation request.', success: false }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const id = new URL(request.url).searchParams.get('id') || String(body.id || '');
    if (!isUuid(id)) return NextResponse.json({ error: 'A valid property ID is required.', success: false }, { status: 400 });
    const { data: removed } = await auth.context.supabase.from('properties').select('owner_id, title').eq('id', id).maybeSingle();
    const { data: owner } = removed?.owner_id ? await auth.context.supabase.from('profiles').select('email, first_name').eq('id', removed.owner_id).maybeSingle() : { data: null };
    const { data, error } = await auth.context.supabase.from('properties').delete().eq('id', id).select('id');
    if (error) return databaseError(error, 'The property could not be deleted.');
    if (!data?.length) return NextResponse.json({ error: 'Property not found.', success: false }, { status: 404 });
    if (owner?.email) notifyEvents([{ event: 'listing_deleted', to: owner.email, recordId: id, data: { name: owner.first_name, details: { Property: removed?.title } } }]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid delete request.', success: false }, { status: 400 });
  }
}
