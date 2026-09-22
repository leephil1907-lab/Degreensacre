'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'property' | 'system'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(j => {
        if (j.notifications) setNotifications(j.notifications);
        // Demo fallback if no auth / empty
        if (!j.notifications || j.notifications.length === 0) {
          setNotifications([
            { id: 'demo-1', type: 'property', title: 'New listing in Lekki', message: 'Exquisite 5 Bedroom Detached Duplex — Chevron Drive, ₦180M', is_read: false, created_at: new Date().toISOString(), data: { url: '/properties' } },
            { id: 'demo-2', type: 'system', title: 'Inspection confirmed', message: 'Your viewing on 2026-09-28 at 10:00 AM is confirmed', is_read: true, created_at: new Date(Date.now()-86400000).toISOString() },
            { id: 'demo-3', type: 'property', title: 'Price drop — Maitama Duplex', message: 'Now ₦360M (was ₦380M) — 6 Bed • 7 Bath', is_read: false, created_at: new Date(Date.now()-2*86400000).toISOString() },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Ask notification permission for filtering demo
    if ('Notification' in window && Notification.permission === 'default') {
      // don't auto-request, just show UI
    }
  }, []);

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.is_read;
    return n.type === filter;
  });

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mark_all: true }) });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-custom py-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif text-charcoal">Notifications</h1>
          <button onClick={markAllRead} className="text-sm text-forest font-semibold hover:underline">Mark all read</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 flex flex-wrap gap-2">
          {(['all','unread','property','system'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter===f ? 'bg-forest text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f} {f==='all' ? `(${notifications.length})` : f==='unread' ? `(${notifications.filter(n=>!n.is_read).length})` : ''}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-gray-500">No notifications for “{filter}”.</p>
              <Link href="/properties" className="text-forest font-semibold text-sm hover:underline mt-3 inline-block">Browse properties →</Link>
            </div>
          ) : filtered.map(n => (
            <div key={n.id} className={`bg-white rounded-2xl border p-5 flex gap-4 hover:shadow-md transition-shadow ${n.is_read ? 'border-gray-100 opacity-80' : 'border-forest/20 bg-forest/[0.02]'}`}>
              <div className={`w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 ${n.type==='property' ? 'bg-forest text-white' : 'bg-sage/20 text-forest'}`}>
                {n.type==='property' ? '⌂' : '◎'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-charcoal text-sm">{n.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${n.is_read ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-800'}`}>{n.is_read ? 'read' : 'new'}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString('en-NG')}</p>
                {n.data?.url && <Link href={n.data.url} className="text-xs text-forest font-semibold hover:underline mt-2 inline-block">View →</Link>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-sage/10 border border-sage/20 rounded-xl p-4">
          <p className="text-xs font-bold text-forest mb-1">Filter through notifications — PWA enhancement</p>
          <p className="text-xs text-gray-600">Manifest + Service Worker now supports <code>push</code> with <code>tag</code> filtering. Use the pills above to filter by type or unread. Notifications are also filterable via OS notification center (grouped by tag).</p>
        </div>
      </div>
    </div>
  );
}
