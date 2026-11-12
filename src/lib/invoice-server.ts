import type { SupabaseClient } from '@supabase/supabase-js';
import {
  computeTotals,
  INVOICE_STATUSES,
  toMoney,
  type Invoice,
  type InvoiceInput,
  type InvoiceStatus,
  type InvoiceItemInput,
} from './invoices';

const MAX_ITEMS = 60;

function text(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function optionalText(value: unknown, max = 500): string | null {
  const cleaned = text(value, max);
  return cleaned ? cleaned : null;
}

function isoDate(value: unknown, fallback: string | null = null): string | null {
  const candidate = text(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return fallback;
  const parsed = new Date(`${candidate}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? fallback : candidate;
}

export type SanitizedInvoice = {
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  property_id: string | null;
  property_title: string | null;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  discount: number;
  tax_rate: number;
  amount_paid: number;
  notes: string | null;
  terms: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  items: InvoiceItemInput[];
  totals: ReturnType<typeof computeTotals>;
};

export function sanitizeInvoiceInput(body: unknown): { ok: true; value: SanitizedInvoice } | { ok: false; error: string } {
  const input = (body ?? {}) as Partial<InvoiceInput>;

  const clientName = text(input.client_name, 160);
  if (clientName.length < 2) return { ok: false, error: 'Enter the client or company name being invoiced.' };

  const rawItems = Array.isArray(input.items) ? input.items : [];
  const items: InvoiceItemInput[] = rawItems
    .slice(0, MAX_ITEMS)
    .map((item, index) => ({
      description: text(item?.description, 300),
      quantity: toMoney(item?.quantity) || 0,
      unit_price: toMoney(item?.unit_price),
      position: index,
    }))
    .filter((item) => item.description.length > 0);

  if (items.length === 0) return { ok: false, error: 'Add at least one line item with a description.' };

  const quantityProblem = items.find((item) => item.quantity <= 0);
  if (quantityProblem) return { ok: false, error: 'Every line item needs a quantity greater than zero.' };

  const status = (INVOICE_STATUSES as readonly string[]).includes(String(input.status))
    ? (input.status as InvoiceStatus)
    : 'draft';

  const totals = computeTotals(items, toMoney(input.discount), toMoney(input.tax_rate));

  return {
    ok: true,
    value: {
      client_name: clientName,
      client_email: optionalText(input.client_email, 254),
      client_phone: optionalText(input.client_phone, 40),
      client_address: optionalText(input.client_address, 400),
      property_id: optionalText(input.property_id, 64),
      property_title: optionalText(input.property_title, 200),
      status,
      issue_date: isoDate(input.issue_date, new Date().toISOString().slice(0, 10))!,
      due_date: isoDate(input.due_date),
      discount: totals.discount,
      tax_rate: totals.taxRate,
      amount_paid: Math.min(toMoney(input.amount_paid), totals.total),
      notes: optionalText(input.notes, 2000),
      terms: optionalText(input.terms, 2000),
      bank_name: optionalText(input.bank_name, 120),
      bank_account_name: optionalText(input.bank_account_name, 160),
      bank_account_number: optionalText(input.bank_account_number, 40),
      items,
      totals,
    },
  };
}

export async function listInvoices(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*), invoice_payments(*)')
    .order('created_at', { ascending: false })
    .limit(300);
  if (error) throw error;
  return (data ?? []) as Invoice[];
}

export async function getInvoice(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*), invoice_payments(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const invoice = data as Invoice;
  invoice.invoice_items = [...(invoice.invoice_items ?? [])].sort((a, b) => a.position - b.position);
  invoice.invoice_payments = [...(invoice.invoice_payments ?? [])].sort(
    (a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime(),
  );
  return invoice;
}

/** Insert the invoice with its line items, recalculating totals server-side. */
export async function createInvoice(supabase: SupabaseClient, sanitized: SanitizedInvoice, createdBy: string | null) {
  const { data: numberData, error: numberError } = await supabase.rpc('next_invoice_number');
  if (numberError) throw numberError;
  const invoiceNumber = String(numberData ?? '').trim();
  if (!invoiceNumber) throw new Error('Could not allocate an invoice number.');

  const { items, totals, ...rest } = sanitized;
  const { data: created, error } = await supabase
    .from('invoices')
    .insert({
      ...rest,
      invoice_number: invoiceNumber,
      currency: 'NGN',
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total: totals.total,
      created_by: createdBy,
    })
    .select('id, invoice_number')
    .single();
  if (error) throw error;

  const { error: itemsError } = await supabase.from('invoice_items').insert(
    items.map((item, index) => ({
      invoice_id: created.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      amount: Math.round(item.quantity * item.unit_price * 100) / 100,
      position: index,
    })),
  );
  if (itemsError) {
    await supabase.from('invoices').delete().eq('id', created.id);
    throw itemsError;
  }

  return created as { id: string; invoice_number: string };
}

export async function updateInvoice(
  supabase: SupabaseClient,
  id: string,
  sanitized: SanitizedInvoice,
  { replaceItems = true }: { replaceItems?: boolean } = {},
) {
  const { items, totals, ...rest } = sanitized;
  const { error } = await supabase
    .from('invoices')
    .update({
      ...rest,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total: totals.total,
    })
    .eq('id', id);
  if (error) throw error;

  if (replaceItems) {
    const { error: clearError } = await supabase.from('invoice_items').delete().eq('invoice_id', id);
    if (clearError) throw clearError;
    const { error: itemsError } = await supabase.from('invoice_items').insert(
      items.map((item, index) => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: Math.round(item.quantity * item.unit_price * 100) / 100,
        position: index,
      })),
    );
    if (itemsError) throw itemsError;
  }
}

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/** Payments only ever add up — the database trigger owns the invoice totals. */
export async function recordPayment(
  supabase: SupabaseClient,
  invoiceId: string,
  payment: { amount: number; method: string; reference?: string | null; paid_at?: string; notes?: string | null },
  recordedBy: string | null,
) {
  const amount = Math.round(Math.max(0, Number(payment.amount) || 0) * 100) / 100;
  if (amount <= 0) throw new Error('Enter a payment amount greater than zero.');

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('id, total, amount_paid, status')
    .eq('id', invoiceId)
    .maybeSingle();
  if (invoiceError) throw invoiceError;
  if (!invoice) throw new Error('That invoice could not be found.');
  if (invoice.status === 'void') throw new Error('Void invoices cannot accept payments.');

  const outstanding = Math.max(0, Number(invoice.total) - Number(invoice.amount_paid));
  if (outstanding <= 0.01) throw new Error('This invoice is already fully paid.');
  if (amount > outstanding + 0.01) {
    throw new Error(`That is more than the outstanding balance of ${outstanding.toFixed(2)}.`);
  }

  const { data, error } = await supabase
    .from('invoice_payments')
    .insert({
      invoice_id: invoiceId,
      amount,
      method: payment.method || 'bank_transfer',
      reference: payment.reference?.trim() || null,
      paid_at: payment.paid_at || new Date().toISOString().slice(0, 10),
      notes: payment.notes?.trim() || null,
      recorded_by: recordedBy,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function removePayment(supabase: SupabaseClient, invoiceId: string, paymentId: string) {
  const { error } = await supabase
    .from('invoice_payments')
    .delete()
    .eq('id', paymentId)
    .eq('invoice_id', invoiceId);
  if (error) throw error;
}
