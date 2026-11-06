import { NextRequest, NextResponse } from 'next/server';
import { CMS_RESOURCES, type CmsField, type CmsResource } from '@/lib/cms-config';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { isEmail, isUuid } from '@/lib/validation';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 1_000_000;

type RouteContext = { params: Promise<{ resource: string }> };

function slugify(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

function validHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function normalizeField(field: CmsField, input: unknown): unknown {
  if (input === undefined) return undefined;
  if (input === null) return null;

  if (field.type === 'boolean') {
    if (typeof input !== 'boolean') throw new Error(`${field.label} must be true or false.`);
    return input;
  }

  if (field.type === 'number') {
    if (input === '') return null;
    const value = Number(input);
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      throw new Error(`${field.label} must be a whole number.`);
    }
    if (field.min !== undefined && value < field.min) throw new Error(`${field.label} must be at least ${field.min}.`);
    if (field.max !== undefined && value > field.max) throw new Error(`${field.label} must be at most ${field.max}.`);
    return value;
  }

  if (field.type === 'json') {
    let value = input;
    if (typeof input === 'string') {
      if (!input.trim()) return [];
      try {
        value = JSON.parse(input);
      } catch {
        throw new Error(`${field.label} contains invalid JSON.`);
      }
    }
    if (!Array.isArray(value) || value.length > 100) {
      throw new Error(`${field.label} must be a JSON array with no more than 100 items.`);
    }
    return value;
  }

  if (field.type === 'list') {
    const source = Array.isArray(input) ? input : String(input).split(/\r?\n/);
    const values = source
      .map((item) => String(item).trim().replace(/\0/g, ''))
      .filter(Boolean)
      .slice(0, 100);
    if (values.some((item) => item.length > 2048)) throw new Error(`${field.label} contains an entry that is too long.`);
    if (field.name === 'gallery' && values.some((item) => !item.startsWith('/') && !validHttpUrl(item))) {
      throw new Error('Every gallery image must be an absolute http(s) URL or a local /path.');
    }
    return values;
  }

  const value = String(input).trim().replace(/\0/g, '');
  if (!value && !field.required) return field.type === 'select' && field.name === 'agency_id' ? null : null;
  const maxLength = field.name === 'content' ? 100_000 : field.name === 'description' || field.name === 'message' || field.name === 'excerpt' || field.name === 'bio' ? 20_000 : 2_048;
  if (value.length > maxLength) throw new Error(`${field.label} is too long.`);

  if (field.type === 'email' && value && !isEmail(value)) throw new Error(`${field.label} must be a valid email address.`);
  if (field.type === 'url' && value && !validHttpUrl(value) && !value.startsWith('/')) {
    throw new Error(`${field.label} must be an absolute http(s) URL or a local /path.`);
  }
  if (field.name === 'slug' && value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error('URL slug may contain only lowercase letters, numbers and single hyphens.');
  }
  if (field.dynamicOptions === 'agencies' && value && !isUuid(value)) {
    throw new Error('Please select a valid agency.');
  }
  if (field.options?.length && value && !field.options.some((option) => option.value === value)) {
    throw new Error(`${field.label} has an invalid value.`);
  }
  if (field.type === 'date' && value && Number.isNaN(Date.parse(value))) {
    throw new Error(`${field.label} must be a valid date.`);
  }

  return value;
}

function normalizePayload(resource: CmsResource, body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};

  for (const field of resource.fields) {
    const value = normalizeField(field, body[field.name]);
    if (value !== undefined) payload[field.name] = value;
  }

  if ('slug' in payload && !payload.slug) {
    payload.slug = slugify(body[resource.titleField]);
  }

  for (const field of resource.fields) {
    if (!field.required) continue;
    const value = payload[field.name];
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      throw new Error(`${field.label} is required.`);
    }
  }

  return payload;
}

async function readBody(request: NextRequest) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) throw new Error('The submitted content is too large.');
  const body = await request.json();
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('A JSON object is required.');
  return body as Record<string, unknown>;
}

async function resolveResource(context: RouteContext) {
  const { resource: name } = await context.params;
  return { name, resource: CMS_RESOURCES[name] };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { name, resource } = await resolveResource(context);
  if (!resource) return NextResponse.json({ error: 'Unknown content type.', success: false }, { status: 404 });

  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { data, error } = await auth.context.supabase
    .from(resource.table)
    .select('*')
    .order(resource.orderBy, { ascending: false })
    .limit(500);

  if (error) return databaseError(error, `Failed to load ${resource.plural.toLowerCase()}.`);
  return NextResponse.json({ items: data || [], resource: name, success: true });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { resource } = await resolveResource(context);
  if (!resource) return NextResponse.json({ error: 'Unknown content type.', success: false }, { status: 404 });

  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await readBody(request);
    const payload = normalizePayload(resource, body);
    const { data, error } = await auth.context.supabase
      .from(resource.table)
      .insert(payload)
      .select('*')
      .single();

    if (error) return databaseError(error, `Failed to create ${resource.singular}.`);
    return NextResponse.json({ item: data, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid content.', success: false },
      { status: 400 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { resource } = await resolveResource(context);
  if (!resource) return NextResponse.json({ error: 'Unknown content type.', success: false }, { status: 404 });

  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await readBody(request);
    if (!isUuid(String(body.id || ''))) {
      return NextResponse.json({ error: 'A valid record ID is required.', success: false }, { status: 400 });
    }
    const payload = normalizePayload(resource, body);
    payload.updated_at = new Date().toISOString();

    const { data, error } = await auth.context.supabase
      .from(resource.table)
      .update(payload)
      .eq('id', body.id)
      .select('*')
      .single();

    if (error) return databaseError(error, `Failed to update ${resource.singular}.`);
    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid content.', success: false },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { resource } = await resolveResource(context);
  if (!resource) return NextResponse.json({ error: 'Unknown content type.', success: false }, { status: 404 });

  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await readBody(request);
    if (!isUuid(String(body.id || ''))) {
      return NextResponse.json({ error: 'A valid record ID is required.', success: false }, { status: 400 });
    }
    const { data, error } = await auth.context.supabase
      .from(resource.table)
      .delete()
      .eq('id', body.id)
      .select('id');

    if (error) return databaseError(error, `Failed to delete ${resource.singular}.`);
    if (!data?.length) return NextResponse.json({ error: `${resource.singular} was not found.`, success: false }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid request.', success: false },
      { status: 400 },
    );
  }
}
