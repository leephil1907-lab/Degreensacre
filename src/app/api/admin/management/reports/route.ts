import { NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';

type Count = { count: number | null };

function num(result: Count): number {
  return result.count ?? 0;
}

function monthKey(value: string): string {
  return String(value).slice(0, 7);
}

// GET /api/admin/management/reports — operational + financial KPIs
export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const supabase = auth.context.supabase;
  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  const sinceIso = since.toISOString();

  try {
    const [
      users, admins, suspended, properties, available, pending, sold, rented,
      enquiries, newEnquiries, messages, unreadMessages, reviews, invoices,
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_admin', true),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_suspended', true),
      supabase.from('properties').select('id', { count: 'exact', head: true }),
      supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'available'),
      supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
      supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'sold'),
      supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'rented'),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('invoices').select('id, total, amount_paid, status, created_at, issue_date'),
    ]);

    const invoiceRows = invoices.data ?? [];
    const billed = invoiceRows.reduce((sum, row) => sum + Number(row.total || 0), 0);
    const collected = invoiceRows.reduce((sum, row) => sum + Number(row.amount_paid || 0), 0);
    const outstanding = invoiceRows
      .filter((row) => row.status !== 'paid' && row.status !== 'void')
      .reduce((sum, row) => sum + Math.max(0, Number(row.total || 0) - Number(row.amount_paid || 0)), 0);

    // Six-month trend of new signups and listings
    const [{ data: recentUsers }, { data: recentProperties }, { data: recentEnquiries }] = await Promise.all([
      supabase.from('profiles').select('created_at').gte('created_at', sinceIso).limit(5000),
      supabase.from('properties').select('created_at').gte('created_at', sinceIso).limit(5000),
      supabase.from('enquiries').select('created_at').gte('created_at', sinceIso).limit(5000),
    ]);

    const months: { month: string; users: number; properties: number; enquiries: number }[] = [];
    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - index);
      const key = date.toISOString().slice(0, 7);
      months.push({
        month: key,
        users: (recentUsers ?? []).filter((row) => monthKey(row.created_at) === key).length,
        properties: (recentProperties ?? []).filter((row) => monthKey(row.created_at) === key).length,
        enquiries: (recentEnquiries ?? []).filter((row) => monthKey(row.created_at) === key).length,
      });
    }

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      users: { total: num(users), admins: num(admins), suspended: num(suspended) },
      properties: {
        total: num(properties), available: num(available), pending: num(pending), sold: num(sold), rented: num(rented),
      },
      enquiries: { total: num(enquiries), new: num(newEnquiries) },
      messages: { total: num(messages), unread: num(unreadMessages) },
      reviews: { total: num(reviews) },
      invoices: { count: invoiceRows.length, billed, collected, outstanding },
      months,
    });
  } catch (error) {
    return databaseError(error, 'The reports could not be generated.');
  }
}
