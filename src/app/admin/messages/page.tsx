'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarCheck, CheckCircle, Inbox, Loader2, Mail, MailOpen, Phone, Search } from 'lucide-react';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/messages', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Messages could not be loaded.');
      setMessages(data.messages || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Messages could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadMessages(); }, [loadMessages]);

  const filtered = useMemo(() => messages.filter((message) => {
    const inspection = message.subject.startsWith('Inspection Booking:');
    if (type === 'inspection' && !inspection) return false;
    if (type === 'general' && inspection) return false;
    if (status !== 'all' && message.status !== status) return false;
    const query = search.trim().toLowerCase();
    return !query || [message.name, message.email, message.subject, message.message].some((value) => value.toLowerCase().includes(query));
  }), [messages, search, status, type]);

  const updateStatus = async (message: ContactMessage, nextStatus: ContactMessage['status']) => {
    setUpdating(message.id);
    setError('');
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: message.id, status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Status could not be updated.');
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: nextStatus } : item));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Status could not be updated.');
    } finally {
      setUpdating(null);
    }
  };

  const newCount = messages.filter((message) => message.status === 'new').length;
  const inspectionCount = messages.filter((message) => message.subject.startsWith('Inspection Booking:')).length;

  return (
    <div className="space-y-6">
      <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">Visitor requests</p><h1 className="font-display text-3xl text-charcoal">Contact Inbox</h1><p className="mt-2 text-sm text-gray-500">Review contact messages and inspection requests saved by the public website.</p></div>
      <div className="grid grid-cols-3 gap-4"><div className="rounded-2xl border border-gray-100 bg-white p-4"><p className="text-2xl font-bold text-charcoal">{messages.length}</p><p className="text-xs text-gray-500">Total messages</p></div><div className="rounded-2xl border border-gray-100 bg-white p-4"><p className="text-2xl font-bold text-amber-600">{newCount}</p><p className="text-xs text-gray-500">New / unread</p></div><div className="rounded-2xl border border-gray-100 bg-white p-4"><p className="text-2xl font-bold text-forest">{inspectionCount}</p><p className="text-xs text-gray-500">Inspection requests</p></div></div>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}<button onClick={() => void loadMessages()} className="ml-3 font-bold underline">Retry</button></div>}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex gap-2 overflow-x-auto">{[['all', 'All'], ['inspection', 'Inspections'], ['general', 'General messages']].map(([value, label]) => <button key={value} onClick={() => setType(value)} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold ${type === value ? 'bg-forest text-white' : 'bg-gray-50 text-gray-600'}`}>{label}</button>)}</div>
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or message…" className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm" /></div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter message status" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"><option value="all">All statuses</option><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option></select>
        </div>
      </div>

      {loading ? <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white"><Loader2 className="h-8 w-8 animate-spin text-forest" /></div> : filtered.length === 0 ? <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center"><Inbox className="mx-auto mb-4 h-10 w-10 text-gray-300" /><h3 className="font-display text-xl text-charcoal">No messages found</h3><p className="mt-2 text-sm text-gray-500">New contact and inspection requests will appear here.</p></div> : (
        <div className="space-y-4">{filtered.map((message) => {
          const inspection = message.subject.startsWith('Inspection Booking:');
          const isExpanded = expanded === message.id;
          return <article key={message.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${inspection ? 'bg-forest/10 text-forest' : 'bg-plum/10 text-plum'}`}>{inspection ? <CalendarCheck className="h-5 w-5" /> : <Mail className="h-5 w-5" />}</div>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-charcoal">{message.subject}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${message.status === 'new' ? 'bg-amber-100 text-amber-700' : message.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{message.status}</span></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500"><span className="font-semibold text-gray-700">{message.name}</span><a href={`mailto:${message.email}`} className="hover:text-forest">{message.email}</a>{message.phone && <a href={`tel:${message.phone}`} className="inline-flex items-center gap-1 hover:text-forest"><Phone className="h-3 w-3" />{message.phone}</a>}<time>{new Date(message.created_at).toLocaleString('en-NG')}</time></div><p className={`mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>{message.message}</p>{message.message.length > 280 && <button onClick={() => setExpanded(isExpanded ? null : message.id)} className="mt-2 text-xs font-bold text-forest">{isExpanded ? 'Show less' : 'Read full message'}</button>}</div>
              <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-32 lg:justify-end">{message.status !== 'read' && <button onClick={() => void updateStatus(message, 'read')} disabled={updating === message.id} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:border-forest"><MailOpen className="h-3.5 w-3.5" />Mark read</button>}{message.status !== 'replied' && <button onClick={() => void updateStatus(message, 'replied')} disabled={updating === message.id} className="inline-flex items-center gap-1 rounded-lg bg-forest px-3 py-2 text-xs font-bold text-white">{updating === message.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}Mark replied</button>}</div>
            </div>
          </article>;
        })}</div>
      )}
      <p className="text-xs text-gray-400">“Mark replied” records your manual follow-up; it does not send an email. Use the sender’s email link or Email Center to respond.</p>
    </div>
  );
}
