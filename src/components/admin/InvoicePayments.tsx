'use client';

import { useState } from 'react';
import { AlertCircle, Banknote, CheckCircle2, Loader2, Plus, Trash2, Wallet } from 'lucide-react';
import {
  formatNaira,
  invoiceBalance,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  sortedPayments,
  type Invoice,
  type PaymentMethod,
} from '@/lib/invoices';

type Props = {
  invoice: Invoice;
  onChanged: (invoice: Invoice) => void;
};

export default function InvoicePayments({ invoice, onChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('bank_transfer');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const balance = invoiceBalance(invoice);
  const payments = sortedPayments(invoice);
  const settled = balance <= 0;

  const submit = async (payload: Record<string, unknown>, message: string) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The payment could not be recorded.');
      onChanged(data.invoice as Invoice);
      setNotice(message);
      setOpen(false);
      setAmount('');
      setReference('');
      setNotes('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'The payment could not be recorded.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (paymentId: string) => {
    if (!window.confirm('Remove this payment? The balance will be recalculated.')) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}/payments?payment_id=${paymentId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The payment could not be removed.');
      onChanged(data.invoice as Invoice);
      setNotice('Payment removed and balance recalculated.');
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'The payment could not be removed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-charcoal">
            <Wallet className="h-4 w-4 text-forest" /> Payments received
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {settled
              ? 'This invoice is fully paid — the balance is zero.'
              : `Outstanding balance ${formatNaira(balance)}. Record each instalment as it lands, or settle it in one click.`}
          </p>
        </div>
        {!settled && invoice.status !== 'void' && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => submit({ settle: true, method, paid_at: paidAt }, `Marked as paid — ${formatNaira(balance)} received.`)}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white hover:bg-forest-light disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              Settle balance
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-forest hover:text-forest"
            >
              <Plus className="h-3.5 w-3.5" /> Record payment
            </button>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {notice}
        </p>
      )}

      {open && !settled && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit(
              { amount: Number(amount), method, paid_at: paidAt, reference, notes },
              `Payment of ${formatNaira(Number(amount) || 0)} recorded.`,
            );
          }}
          className="mt-4 grid gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label htmlFor="payment-amount" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">Amount (₦)</label>
            <input
              id="payment-amount" type="number" min="1" step="0.01" required value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder={String(balance)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
            />
          </div>
          <div>
            <label htmlFor="payment-method" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">Method</label>
            <select
              id="payment-method" value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
            >
              {PAYMENT_METHODS.map((value) => (
                <option key={value} value={value}>{PAYMENT_METHOD_LABELS[value]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="payment-date" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">Date received</label>
            <input
              id="payment-date" type="date" value={paidAt} onChange={(event) => setPaidAt(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
            />
          </div>
          <div>
            <label htmlFor="payment-reference" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">Reference</label>
            <input
              id="payment-reference" value={reference} onChange={(event) => setReference(event.target.value)}
              placeholder="Teller / transfer ref"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="payment-notes" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">Note (optional)</label>
            <input
              id="payment-notes" value={notes} onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g. First instalment"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />} Save payment
            </button>
          </div>
        </form>
      )}

      {payments.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-xs text-gray-400">
          No payments recorded yet. The invoice stays <strong>outstanding</strong> until money is banked.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-gray-400">
              <tr>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Method</th>
                <th className="py-2 pr-3">Reference</th>
                <th className="py-2 pr-3 text-right">Amount</th>
                <th className="py-2"><span className="sr-only">Remove</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="whitespace-nowrap py-2.5 pr-3 text-gray-600">{payment.paid_at}</td>
                  <td className="py-2.5 pr-3 text-gray-600">{PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}</td>
                  <td className="py-2.5 pr-3 text-gray-500">
                    {payment.reference || '—'}
                    {payment.notes && <span className="block text-[11px] text-gray-400">{payment.notes}</span>}
                  </td>
                  <td className="py-2.5 pr-3 text-right font-semibold text-charcoal">{formatNaira(Number(payment.amount), true)}</td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => void remove(payment.id)}
                      disabled={busy}
                      className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      title="Remove payment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
