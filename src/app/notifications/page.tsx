'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: Record<string, unknown>;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'property' | 'system'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/notifications', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 401 ? 'Please sign in to view your notifications.' : data.error || 'Notifications could not be loaded.');
      setNotifications(data.notifications || []);
    } catch (loadError) {
      setNotifications([]);
      setError(loadError instanceof Error ? loadError.message : 'Notifications could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadNotifications(); }, [loadNotifications]);

  const filtered = useMemo(() => notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.is_read;
    const propertyNotification = /property|viewing|price|listing|inspection/i.test(notification.type);
    return filter === 'property' ? propertyNotification : !propertyNotification;
  }), [filter, notifications]);

  const updateReadState = async (notificationId?: string) => {
    setUpdating(true);
    setError('');
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationId ? { notification_id: notificationId } : { mark_all: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Read status could not be updated.');
      setNotifications((current) => current.map((notification) => notificationId && notification.id !== notificationId ? notification : { ...notification, is_read: true }));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Read status could not be updated.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent" /></div>;

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;
  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-custom mx-auto max-w-3xl py-10">
        <div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="font-serif text-2xl text-charcoal">Notifications</h1><p className="mt-1 text-sm text-gray-500">Updates saved to your account</p></div><button onClick={() => void updateReadState()} disabled={updating || unreadCount === 0} className="text-sm font-semibold text-forest hover:underline disabled:cursor-not-allowed disabled:opacity-40">Mark all read</button></div>
        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}<div className="mt-3 flex gap-4"><button onClick={() => void loadNotifications()} className="font-bold underline">Retry</button><Link href="/signin?redirect=/notifications" className="font-bold underline">Sign in</Link></div></div>}

        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          {(['all', 'unread', 'property', 'system'] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === value ? 'bg-forest text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{value} {value === 'all' ? `(${notifications.length})` : value === 'unread' ? `(${unreadCount})` : ''}</button>)}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center"><p className="text-gray-500">No {filter === 'all' ? '' : filter} notifications.</p><Link href="/properties" className="mt-3 inline-block text-sm font-semibold text-forest hover:underline">Browse properties →</Link></div> : filtered.map((notification) => {
            const target = typeof notification.data?.url === 'string' && notification.data.url.startsWith('/') && !notification.data.url.startsWith('//') ? notification.data.url : null;
            const propertyNotification = /property|viewing|price|listing|inspection/i.test(notification.type);
            return <article key={notification.id} className={`flex gap-4 rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md ${notification.is_read ? 'border-gray-100 opacity-80' : 'border-forest/20'}`}>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${propertyNotification ? 'bg-forest text-white' : 'bg-sage/20 text-forest'}`}>{propertyNotification ? '⌂' : '◎'}</div>
              <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h2 className="text-sm font-semibold text-charcoal">{notification.title}</h2><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${notification.is_read ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-800'}`}>{notification.is_read ? 'read' : 'new'}</span></div><p className="mt-1 text-sm text-gray-600">{notification.message}</p><p className="mt-2 text-xs text-gray-400">{new Date(notification.created_at).toLocaleString('en-NG')}</p><div className="mt-2 flex gap-4">{target && <Link href={target} className="text-xs font-semibold text-forest hover:underline">View →</Link>}{!notification.is_read && <button onClick={() => void updateReadState(notification.id)} disabled={updating} className="text-xs font-semibold text-forest hover:underline disabled:opacity-50">Mark read</button>}</div></div>
            </article>;
          })}
        </div>
        <p className="mt-8 rounded-xl border border-sage/20 bg-sage/10 p-4 text-xs text-gray-600">These are account notifications stored by De-Greenacres. Browser push delivery requires browser permission and a configured push service.</p>
      </div>
    </div>
  );
}
