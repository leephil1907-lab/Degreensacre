import { randomUUID } from 'node:crypto';
import { isStockImage } from './property';

function publicPropertyPhotos<T extends { images?: string[]; property_images?: { url: string }[]; admin_notes?: unknown }>(property: T) {
  const { admin_notes: _privateNotes, ...publicRecord } = property;
  return {
    ...publicRecord,
    images: (property.images || []).filter((url) => !isStockImage(url)),
    property_images: (property.property_images || []).filter((image) => !isStockImage(image.url)),
  };
}
import { createServerSupabaseClient, createAdminSupabaseClient } from './supabase-server';

// Property helpers
export async function getProperties(filters: {
  type?: string;
  state?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  featured?: boolean;
  propertyType?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}) {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('properties')
    .select('*, property_images(*)', { count: 'exact' })
    .eq('status', 'available');

  if (filters.type) query = query.eq('type', filters.type);
  if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
  if (filters.state) query = query.eq('state', filters.state);
  if (filters.area) query = query.ilike('area', `%${filters.area}%`);
  if (filters.minPrice) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
  if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
  if (filters.featured) query = query.eq('featured', true);

  const allowedOrderFields = ['date_added', 'published_at', 'price', 'views', 'title'];
  const orderBy = allowedOrderFields.includes(filters.orderBy || '') ? filters.orderBy! : 'date_added';
  const orderDirection = filters.orderDirection === 'asc' ? 'asc' : 'desc';
  query = query.order(orderBy, { ascending: orderDirection === 'asc' });

  const limit = Number.isInteger(filters.limit) ? Math.min(Math.max(filters.limit!, 1), 100) : 50;
  const offset = Number.isInteger(filters.offset) ? Math.max(filters.offset!, 0) : 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return { properties: (data || []).map(publicPropertyPhotos), count };
}

export async function getPropertyBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: property, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('slug', slug)
    .eq('status', 'available')
    .maybeSingle();

  if (error) throw error;

  return property ? publicPropertyPhotos(property) : null;
}

export async function incrementPropertyView(propertyId: string) {
  // This helper runs server-side only. Use the service client so the privileged
  // counter RPC is not exposed to anonymous or ordinary authenticated callers.
  const supabase = await createAdminSupabaseClient();

  const { error: counterError } = await supabase.rpc('increment_property_views', {
    property_uuid: propertyId,
  });
  if (counterError) throw counterError;

  const { error: viewError } = await supabase.from('property_views').insert({
    property_id: propertyId,
  });
  if (viewError) throw viewError;
}

// Enquiry helpers
export async function createEnquiry(enquiry: {
  property_id?: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  message: string;
  source?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const user = await supabase.auth.getUser();

  // Anonymous submissions may INSERT but must never SELECT private enquiries.
  // Supply our own ID and return only this request's already-known fields.
  const record = {
    ...enquiry,
    id: randomUUID(),
    buyer_id: user.data.user?.id || null,
    status: 'new',
  };
  const { error } = await supabase.from('enquiries').insert(record);
  if (error) throw error;
  return record;
}

export async function getUserEnquiries(userId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('enquiries')
    .select('*, properties(title, slug, images)')
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

// Saved properties helpers
export async function getUserSavedProperties(userId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('saved_properties')
    .select('*, properties(*, property_images(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(item => item.properties);
}

export async function toggleSavedProperty(userId: string, propertyId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: existing } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single();

  if (existing) {
    await supabase.from('saved_properties').delete().eq('id', existing.id);
    return { saved: false };
  } else {
    await supabase.from('saved_properties').insert({
      user_id: userId,
      property_id: propertyId,
    });
    return { saved: true };
  }
}

// Viewing request helpers
export async function createViewingRequest(viewing: {
  property_id: string;
  preferred_date: string;
  preferred_time: string;
  alternative_date?: string;
  alternative_time?: string;
  notes?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('viewing_requests')
    .insert({
      ...viewing,
      user_id: user.data.user.id,
      status: 'requested',
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getUserViewingRequests(userId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('viewing_requests')
    .select('*, properties(title, slug, images)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

// Notification helpers
export async function createNotification(notification: {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}) {
  const supabase = await createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getUserNotifications(userId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return data;
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) throw error;
}

// Admin helpers
export async function getAdminStats() {
  const supabase = await createAdminSupabaseClient();
  
  const [
    { count: totalUsers },
    { count: totalProperties },
    { count: publishedProperties },
    { count: pendingProperties },
    { count: totalEnquiries },
    { count: newEnquiries },
    { count: totalViewings },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('viewing_requests').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalUsers: totalUsers || 0,
    totalProperties: totalProperties || 0,
    publishedProperties: publishedProperties || 0,
    pendingProperties: pendingProperties || 0,
    totalEnquiries: totalEnquiries || 0,
    newEnquiries: newEnquiries || 0,
    totalViewings: totalViewings || 0,
  };
}

export async function logAdminActivity(activity: {
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
}) {
  const supabase = await createAdminSupabaseClient();
  
  await supabase.from('admin_activity').insert(activity);
}

export async function logAudit(log: {
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
}) {
  const supabase = await createAdminSupabaseClient();
  
  await supabase.from('audit_logs').insert(log);
}
