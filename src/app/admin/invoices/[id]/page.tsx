'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, Download, FileCode2, FileSpreadsheet, FileText,
  Loader2, Mail, Pencil, Printer,
} from 'lucide-react';
import {
  amountInWords, effectiveStatus, formatNaira, invoiceBalance, STATUS_LABELS,
  type Invoice,
} from '@/lib/invoices';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/invoices/${id}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The invoice could not be loaded.');
      setInvoice(data.invoice);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'The invoice could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  const markPaid = async () => {
    if (!invoice) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: invoice.client_name,
          client_email: invoice.client_email,
          client_phone: invoice.client_phone,
          client_address: invoice.client_address,
          property_id: invoice.property_id,
          property_title: invoice.property_title,
          issue_date: invoice.issue_date,
          due_date: invoice.due_date,
          discount: invoice.discount,
          tax_rate: invoice.tax_rate,
          amount_paid: invoice.total,
          status: 'paid',
          notes: invoice.notes,
          terms: invoice.terms,
          bank_name: invoice.bank_name,
          bank_account_name: invoice.bank_account_name,
          bank_account_number: invoice.bank_account_number,
          items: invoice.invoice_items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The invoice could not be updated.');
      setNotice('Marked as paid.');
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'The invoice could not be updated.');
    } finally {
      setBusy(false);
    }
  };

  const emailInvoice = () => {
    if (!invoice?.client_email) return;
    const subject = encodeURIComponent(`Invoice ${invoice.invoice_number} — De-Greenacres Properties Limited`);
    const body = encodeURIComponent(
      `Dear ${invoice.client_name},\n\nPlease find invoice ${invoice.invoice_number} attached for ${formatNaira(invoice.total)}.\nAmount due: ${formatNaira(invoiceBalance(invoice))}${invoice.due_date ? ` by ${invoice.due_date}` : ''}.\n\n${invoice.bank_name ? `Payment: ${invoice.bank_name} — ${invoice.bank_account_name ?? ''} ${invoice.bank_account_number ?? ''}\n` : ''}Kindly quote ${invoice.invoice_number} as the transfer reference.\n\nKind regards,\nDe-Greenacres Properties Limited\nRC 1856064`,
    );
    window.location.href = `mailto:${invoice.client_email}?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-7 w-7 animate-spin text-forest" /></div>;
  }

  if (!invoice) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="font-display text-2xl text-charcoal">Invoice not found</p>
        <p className="mt-2 text-sm text-gray-500">{error || 'This invoice may have been deleted.'}</p>
        <Link href="/admin/invoices" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </Link>
      </div>
    );
  }

  const status = effectiveStatus(invoice);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/invoices" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-forest">
            <ArrowLeft className="h-3.5 w-3.5" /> All invoices
          </Link>
          <h1 className="mt-2 font-display text-3xl text-charcoal">{invoice.invoice_number}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {invoice.client_name} · issued {invoice.issue_date}
            {invoice.due_date ? ` · due ${invoice.due_date}` : ''}
          </p>
        </div>
        <span className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${
          status === 'paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : status === 'overdue' ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-gray-200 bg-gray-50 text-gray-600'
        }`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Total</p>
          <p className="mt-1 font-display text-2xl text-charcoal">{formatNaira(invoice.total)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Balance due</p>
          <p className="mt-1 font-display text-2xl text-charcoal">{formatNaira(invoiceBalance(invoice))}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Line items</p>
          <p className="mt-1 font-display text-2xl text-charcoal">{invoice.invoice_items.length}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3">
        <a href={`/api/admin/invoices/${invoice.id}/pdf`} className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white hover:bg-forest-light">
          <FileText className="h-4 w-4" /> Download PDF
        </a>
        <a href={`/api/admin/invoices/${invoice.id}/export?format=html&download=1`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-forest hover:text-forest">
          <FileCode2 className="h-4 w-4" /> HTML
        </a>
        <a href={`/api/admin/invoices/${invoice.id}/export?format=csv&download=1`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-forest hover:text-forest">
          <FileSpreadsheet className="h-4 w-4" /> CSV
        </a>
        <a href={`/api/admin/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-forest hover:text-forest">
          <Printer className="h-4 w-4" /> Print
        </a>
        {invoice.client_email && (
          <button type="button" onClick={emailInvoice} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-forest hover:text-forest">
            <Mail className="h-4 w-4" /> Email draft
          </button>
        )}
        <Link href={`/admin/invoices?edit=${invoice.id}`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-forest hover:text-forest">
          <Pencil className="h-4 w-4" /> Edit
        </Link>
        {status !== 'paid' && (
          <button type="button" onClick={() => void markPaid()} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Mark paid
          </button>
        )}
        <a href={`/api/admin/invoices/${invoice.id}/export?format=html`} download={`${invoice.invoice_number}.html`} className="ml-auto inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-forest">
          <Download className="h-3.5 w-3.5" /> Save preview
        </a>
      </div>

      {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-[#eef0ea]">
        <iframe
          title={`Preview of invoice ${invoice.invoice_number}`}
          src={`/api/admin/invoices/${invoice.id}/export?format=html`}
          sandbox="allow-same-origin"
          className="h-[1100px] w-full border-0"
        />
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">{amountInWords(invoice.total)}</p>
    </div>
  );
}
