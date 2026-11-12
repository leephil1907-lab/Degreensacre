'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle, ArrowUpRight, CheckCircle2, Download, FilePlus2, Loader2, Pencil,
  Plus, Receipt, Save, Trash2, X,
} from 'lucide-react';
import {
  addDaysIso,
  computeTotals,
  effectiveStatus,
  formatNaira,
  invoiceBalance,
  STATUS_LABELS,
  todayIso,
  type Invoice,
  type InvoiceStatus,
} from '@/lib/invoices';

type PropertyOption = { id: string; title: string };

type FormState = {
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  property_id: string;
  property_title: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  discount: string;
  tax_rate: string;
  amount_paid: string;
  notes: string;
  terms: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  items: { description: string; quantity: string; unit_price: string }[];
};

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15';
const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500';

function emptyForm(): FormState {
  return {
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    property_id: '',
    property_title: '',
    issue_date: todayIso(),
    due_date: addDaysIso(14),
    status: 'draft',
    discount: '0',
    tax_rate: '0',
    amount_paid: '0',
    notes: '',
    terms: 'Payment is due within 14 days of the invoice date. Bank transfer only; quote the invoice number as the reference.',
    bank_name: '',
    bank_account_name: '',
    bank_account_number: '',
    items: [{ description: '', quantity: '1', unit_price: '' }],
  };
}

function toForm(invoice: Invoice): FormState {
  return {
    client_name: invoice.client_name ?? '',
    client_email: invoice.client_email ?? '',
    client_phone: invoice.client_phone ?? '',
    client_address: invoice.client_address ?? '',
    property_id: invoice.property_id ?? '',
    property_title: invoice.property_title ?? '',
    issue_date: invoice.issue_date ?? todayIso(),
    due_date: invoice.due_date ?? '',
    status: invoice.status,
    discount: String(invoice.discount ?? 0),
    tax_rate: String(invoice.tax_rate ?? 0),
    amount_paid: String(invoice.amount_paid ?? 0),
    notes: invoice.notes ?? '',
    terms: invoice.terms ?? '',
    bank_name: invoice.bank_name ?? '',
    bank_account_name: invoice.bank_account_name ?? '',
    bank_account_number: invoice.bank_account_number ?? '',
    items: (invoice.invoice_items ?? []).map((item) => ({
      description: item.description,
      quantity: String(item.quantity),
      unit_price: String(item.unit_price),
    })),
  };
}

function statusTone(status: InvoiceStatus) {
  if (status === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'overdue') return 'bg-red-50 text-red-700 border-red-200';
  if (status === 'partially_paid') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'void') return 'bg-gray-100 text-gray-500 border-gray-200';
  if (status === 'sent') return 'bg-sky-50 text-sky-700 border-sky-200';
  return 'bg-gray-50 text-gray-600 border-gray-200';
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [invoiceResponse, propertyResponse] = await Promise.all([
        fetch('/api/admin/invoices', { cache: 'no-store' }),
        fetch('/api/admin/properties', { cache: 'no-store' }),
      ]);
      const invoiceData = await invoiceResponse.json();
      if (!invoiceResponse.ok) throw new Error(invoiceData.error || 'Invoices could not be loaded.');
      setInvoices(invoiceData.invoices ?? []);

      if (propertyResponse.ok) {
        const propertyData = await propertyResponse.json();
        setProperties((propertyData.properties ?? []).map((p: { id: string; title: string }) => ({ id: p.id, title: p.title })));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Invoices could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Deep link from the invoice detail screen: /admin/invoices?edit=<id>
  useEffect(() => {
    if (formOpen || editing) return;
    const target = new URLSearchParams(window.location.search).get('edit');
    if (!target) return;
    const match = invoices.find((invoice) => invoice.id === target);
    if (match) {
      setEditing(match);
      setForm(toForm(match));
      setFormOpen(true);
    }
  }, [invoices, formOpen, editing]);

  const totals = useMemo(
    () =>
      computeTotals(
        form.items.map((item) => ({ quantity: Number(item.quantity) || 0, unit_price: Number(item.unit_price) || 0 })),
        Number(form.discount) || 0,
        Number(form.tax_rate) || 0,
      ),
    [form.items, form.discount, form.tax_rate],
  );

  const stats = useMemo(() => {
    const outstanding = invoices
      .filter((invoice) => ['sent', 'partially_paid', 'overdue'].includes(effectiveStatus(invoice)))
      .reduce((sum, invoice) => sum + invoiceBalance(invoice), 0);
    const collected = invoices.reduce((sum, invoice) => sum + Number(invoice.amount_paid || 0), 0);
    return { outstanding, collected, count: invoices.length };
  }, [invoices]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormOpen(true);
    setError('');
    setNotice('');
  };

  const openEdit = (invoice: Invoice) => {
    setEditing(invoice);
    setForm(toForm(invoice));
    setFormOpen(true);
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const addItem = () => update('items', [...form.items, { description: '', quantity: '1', unit_price: '' }]);
  const removeItem = (index: number) => update('items', form.items.filter((_, i) => i !== index));
  const updateItem = (index: number, key: 'description' | 'quantity' | 'unit_price', value: string) =>
    update('items', form.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const payload = {
        ...form,
        discount: Number(form.discount) || 0,
        tax_rate: Number(form.tax_rate) || 0,
        amount_paid: Number(form.amount_paid) || 0,
        due_date: form.due_date || null,
        property_id: form.property_id || null,
        items: form.items
          .filter((item) => item.description.trim())
          .map((item) => ({
            description: item.description.trim(),
            quantity: Number(item.quantity) || 0,
            unit_price: Number(item.unit_price) || 0,
          })),
      };

      const response = await fetch(editing ? `/api/admin/invoices/${editing.id}` : '/api/admin/invoices', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The invoice could not be saved.');

      setNotice(editing ? 'Invoice updated.' : `Invoice ${data.invoice?.invoice_number ?? ''} created.`);
      closeForm();
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'The invoice could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (invoice: Invoice) => {
    if (!window.confirm(`Delete invoice ${invoice.invoice_number}? This cannot be undone.`)) return;
    setDeleting(invoice.id);
    setError('');
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The invoice could not be deleted.');
      setNotice('Invoice deleted.');
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'The invoice could not be deleted.');
    } finally {
      setDeleting(null);
    }
  };

  const markPaid = async (invoice: Invoice) => {
    setError('');
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...toForm(invoice),
          status: 'paid',
          amount_paid: invoice.total,
          discount: invoice.discount,
          tax_rate: invoice.tax_rate,
          due_date: invoice.due_date,
          items: invoice.invoice_items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'The invoice could not be updated.');
      }
      setNotice(`${invoice.invoice_number} marked as paid.`);
      await load();
    } catch (markError) {
      setError(markError instanceof Error ? markError.message : 'The invoice could not be updated.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Administration</p>
          <h1 className="mt-1 font-display text-3xl text-charcoal">Invoices</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Create branded invoices for sales, rentals, inspection fees and professional services. Every invoice is
            numbered automatically and can be downloaded as PDF, HTML or CSV.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white transition hover:bg-forest-light"
        >
          <FilePlus2 className="h-4 w-4" /> New invoice
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ['Invoices issued', String(stats.count)],
          ['Outstanding', formatNaira(stats.outstanding)],
          ['Collected', formatNaira(stats.collected)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-1 font-display text-2xl text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      {notice && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {notice}
        </div>
      )}

      {formOpen && (
        <form onSubmit={save} className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-charcoal">{editing ? `Edit ${editing.invoice_number}` : 'New invoice'}</h2>
              <p className="mt-1 text-sm text-gray-500">Totals are recalculated on the server. Only draft invoices can be re-priced.</p>
            </div>
            <button type="button" onClick={closeForm} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-charcoal" aria-label="Close invoice editor">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="client_name">Client name *</label>
              <input id="client_name" required value={form.client_name} onChange={(e) => update('client_name', e.target.value)} className={inputClass} placeholder="Buyer, tenant or company" />
            </div>
            <div>
              <label className={labelClass} htmlFor="client_email">Client email</label>
              <input id="client_email" type="email" value={form.client_email} onChange={(e) => update('client_email', e.target.value)} className={inputClass} placeholder="client@example.com" />
            </div>
            <div>
              <label className={labelClass} htmlFor="client_phone">Client phone</label>
              <input id="client_phone" value={form.client_phone} onChange={(e) => update('client_phone', e.target.value)} className={inputClass} placeholder="+234…" />
            </div>
            <div>
              <label className={labelClass} htmlFor="property_id">Related property (optional)</label>
              <select
                id="property_id"
                value={form.property_id}
                onChange={(e) => {
                  const option = properties.find((property) => property.id === e.target.value);
                  setForm((current) => ({ ...current, property_id: e.target.value, property_title: option?.title ?? '' }));
                }}
                className={inputClass}
              >
                <option value="">No property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>{property.title}</option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass} htmlFor="client_address">Client address</label>
              <textarea id="client_address" rows={2} value={form.client_address} onChange={(e) => update('client_address', e.target.value)} className={`${inputClass} resize-y`} />
            </div>
            <div>
              <label className={labelClass} htmlFor="issue_date">Issue date</label>
              <input id="issue_date" type="date" value={form.issue_date} onChange={(e) => update('issue_date', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="due_date">Due date</label>
              <input id="due_date" type="date" value={form.due_date} onChange={(e) => update('due_date', e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Line items */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal">Line items</h3>
              <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:border-forest hover:text-forest">
                <Plus className="h-3.5 w-3.5" /> Add item
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {form.items.map((item, index) => (
                <div key={index} className="grid gap-2 rounded-xl border border-gray-100 bg-gray-50/60 p-2 sm:grid-cols-[1fr_90px_140px_120px_40px] sm:items-center">
                  <input
                    aria-label={`Item ${index + 1} description`}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Description (e.g. 2-bedroom apartment — annual rent)"
                    className={inputClass}
                  />
                  <input
                    aria-label={`Item ${index + 1} quantity`}
                    type="number" min="0" step="0.01" value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className={inputClass}
                  />
                  <input
                    aria-label={`Item ${index + 1} unit price`}
                    type="number" min="0" step="0.01" value={item.unit_price}
                    onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                    placeholder="Unit price (₦)"
                    className={inputClass}
                  />
                  <p className="px-1 text-right text-sm font-bold text-charcoal">
                    {formatNaira((Number(item.quantity) || 0) * (Number(item.unit_price) || 0))}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={form.items.length === 1}
                    className="justify-self-end rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="discount">Discount (₦)</label>
                  <input id="discount" type="number" min="0" step="1" value={form.discount} onChange={(e) => update('discount', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="tax_rate">VAT (%)</label>
                  <input id="tax_rate" type="number" min="0" max="100" step="0.5" value={form.tax_rate} onChange={(e) => update('tax_rate', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="amount_paid">Amount paid (₦)</label>
                  <input id="amount_paid" type="number" min="0" step="1" value={form.amount_paid} onChange={(e) => update('amount_paid', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="status">Status</label>
                <select id="status" value={form.status} onChange={(e) => update('status', e.target.value as InvoiceStatus)} className={inputClass}>
                  {(Object.keys(STATUS_LABELS) as InvoiceStatus[]).map((value) => (
                    <option key={value} value={value}>{STATUS_LABELS[value]}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="bank_name">Bank</label>
                  <input id="bank_name" value={form.bank_name} onChange={(e) => update('bank_name', e.target.value)} className={inputClass} placeholder="e.g. GTBank" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="bank_account_name">Account name</label>
                  <input id="bank_account_name" value={form.bank_account_name} onChange={(e) => update('bank_account_name', e.target.value)} className={inputClass} placeholder="De-Greenacres Properties Ltd" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="bank_account_number">Account number</label>
                  <input id="bank_account_number" value={form.bank_account_number} onChange={(e) => update('bank_account_number', e.target.value)} className={inputClass} placeholder="0123456789" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-forest p-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Totals</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-white/70">Subtotal</dt><dd className="font-semibold">{formatNaira(totals.subtotal)}</dd></div>
                {totals.discount > 0 && <div className="flex justify-between"><dt className="text-white/70">Discount</dt><dd>− {formatNaira(totals.discount)}</dd></div>}
                {totals.taxAmount > 0 && <div className="flex justify-between"><dt className="text-white/70">VAT ({totals.taxRate}%)</dt><dd>{formatNaira(totals.taxAmount)}</dd></div>}
                <div className="flex justify-between border-t border-white/20 pt-2 text-lg font-bold"><dt>Total</dt><dd>{formatNaira(totals.total)}</dd></div>
                {Number(form.amount_paid) > 0 && (
                  <div className="flex justify-between text-white/80"><dt>Balance due</dt><dd>{formatNaira(Math.max(0, totals.total - Number(form.amount_paid)))}</dd></div>
                )}
              </dl>
              <div className="mt-5 grid gap-3">
                <div>
                  <label className={`${labelClass} text-white/60`} htmlFor="terms">Terms</label>
                  <textarea id="terms" rows={2} value={form.terms} onChange={(e) => update('terms', e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none" />
                </div>
                <div>
                  <label className={`${labelClass} text-white/60`} htmlFor="notes">Notes</label>
                  <textarea id="notes" rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-bold text-white transition hover:bg-forest-light disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create invoice'}
            </button>
            <button type="button" onClick={closeForm} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 hover:border-gray-300">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-charcoal">All invoices</h2>
          <span className="text-xs text-gray-400">{invoices.length} total</span>
        </div>

        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-forest" /></div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center">
            <Receipt className="mx-auto h-9 w-9 text-gray-300" />
            <p className="mt-3 font-display text-xl text-charcoal">No invoices yet</p>
            <p className="mt-1 text-sm text-gray-500">Create your first invoice to bill a buyer, tenant or client.</p>
            <button type="button" onClick={openCreate} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white">
              <FilePlus2 className="h-4 w-4" /> New invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="hidden px-4 py-3 md:table-cell">Issued</th>
                  <th className="hidden px-4 py-3 md:table-cell">Due</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((invoice) => {
                  const status = effectiveStatus(invoice);
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50/60">
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-charcoal">
                        <Link href={`/admin/invoices/${invoice.id}`} className="hover:text-forest hover:underline">{invoice.invoice_number}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal">{invoice.client_name}</p>
                        {invoice.client_email && <p className="text-xs text-gray-400">{invoice.client_email}</p>}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-gray-600 md:table-cell">{invoice.issue_date}</td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-gray-600 md:table-cell">{invoice.due_date ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusTone(status)}`}>
                          {STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-charcoal">{formatNaira(invoice.total)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatNaira(invoiceBalance(invoice))}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/invoices/${invoice.id}`} className="rounded-lg p-2 text-gray-400 hover:text-forest" title="Open invoice"><ArrowUpRight className="h-4 w-4" /></Link>
                          <a href={`/api/admin/invoices/${invoice.id}/pdf`} className="rounded-lg p-2 text-gray-400 hover:text-forest" title="Download PDF"><Download className="h-4 w-4" /></a>
                          <button type="button" onClick={() => openEdit(invoice)} className="rounded-lg p-2 text-gray-400 hover:text-forest" title="Edit invoice"><Pencil className="h-4 w-4" /></button>
                          {status !== 'paid' && (
                            <button type="button" onClick={() => void markPaid(invoice)} className="rounded-lg p-2 text-gray-400 hover:text-emerald-600" title="Mark as paid"><CheckCircle2 className="h-4 w-4" /></button>
                          )}
                          <button type="button" onClick={() => void remove(invoice)} disabled={deleting === invoice.id} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete invoice">
                            {deleting === invoice.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
