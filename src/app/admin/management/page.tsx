'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Activity, AlertCircle, BarChart3, CheckCircle2, Loader2, ShieldCheck,
  ShieldOff, Users2, UserCheck, Ban, RefreshCw,
} from 'lucide-react';
import { formatNaira } from '@/lib/invoices';

type Tab = 'overview' | 'staff' | 'activity';

type Staff = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  is_admin: boolean;
  admin_role: string | null;
  is_suspended: boolean;
  suspended_reason: string | null;
  last_login_at: string | null;
  created_at: string;
};

type ActivityRow = {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  actor: string | null;
  created_at: string;
  source: string;
};

type Reports = {
  generatedAt: string;
  users: { total: number; admins: number; suspended: number };
  properties: { total: number; available: number; pending: number; sold: number; rented: number };
  enquiries: { total: number; new: number };
  messages: { total: number; unread: number };
  reviews: { total: number };
  invoices: { count: number; billed: number; collected: number; outstanding: number };
  months: { month: string; users: number; properties: number; enquiries: number }[];
};

const ROLES = [
  { value: 'super_admin', label: 'Super admin' },
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'support', label: 'Support' },
];

function relativeTime(value: string): string {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return '—';
  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function humanAction(action: string): string {
  return action.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AdminManagementPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [reports, setReports] = useState<Reports | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const loadReports = useCallback(async () => {
    const response = await fetch('/api/admin/management/reports', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Reports could not be generated.');
    setReports(data);
  }, []);

  const loadStaff = useCallback(async () => {
    const response = await fetch('/api/admin/management/staff', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The staff list could not be loaded.');
    setStaff(data.staff ?? []);
  }, []);

  const loadActivity = useCallback(async () => {
    const params = new URLSearchParams({ limit: '150' });
    if (search.trim()) params.set('q', search.trim());
    if (entityFilter) params.set('entity', entityFilter);
    const response = await fetch(`/api/admin/management/activity?${params}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The activity log could not be loaded.');
    setActivity(data.activity ?? []);
  }, [search, entityFilter]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadReports(), loadStaff(), loadActivity()]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Management data could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [loadReports, loadStaff, loadActivity]);

  useEffect(() => { void loadAll(); }, [loadAll]);

  const updateStaff = async (member: Staff, patch: Record<string, unknown>, message: string) => {
    setBusyId(member.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/management/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: member.id, ...patch }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The staff record could not be updated.');
      setNotice(message);
      await Promise.all([loadStaff(), loadActivity(), loadReports()]);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'The staff record could not be updated.');
    } finally {
      setBusyId(null);
    }
  };

  const suspend = (member: Staff) => {
    const reason = window.prompt(`Reason for suspending ${member.email ?? 'this account'}?`, 'Policy violation');
    if (reason === null) return;
    void updateStaff(member, { is_suspended: true, suspended_reason: reason || 'Suspended by an administrator' }, 'Account suspended.');
  };

  const maxMonth = Math.max(1, ...(reports?.months ?? []).map((month) => month.users + month.properties + month.enquiries));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Administration</p>
          <h1 className="mt-1 font-display text-3xl text-charcoal">Management</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Control administrative access, review every action taken in the panel and monitor the health of the business.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadAll()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-forest hover:text-forest disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
        </button>
      </div>

      <div className="mt-6 flex gap-1 rounded-xl border border-gray-100 bg-white p-1 sm:inline-flex">
        {([
          ['overview', 'Overview', BarChart3],
          ['staff', 'Staff & roles', Users2],
          ['activity', 'Activity log', Activity],
        ] as const).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
              tab === value ? 'bg-forest text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
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

      {loading && !reports ? (
        <div className="grid place-items-center py-24"><Loader2 className="h-7 w-7 animate-spin text-forest" /></div>
      ) : tab === 'overview' && reports ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Registered users', reports.users.total.toLocaleString(), `${reports.users.admins} admin${reports.users.admins === 1 ? '' : 's'}`],
              ['Listings', reports.properties.total.toLocaleString(), `${reports.properties.available} available · ${reports.properties.pending} pending`],
              ['Enquiries', reports.enquiries.total.toLocaleString(), `${reports.enquiries.new} new`],
              ['Invoiced', formatNaira(reports.invoices.billed), `${formatNaira(reports.invoices.collected)} collected`],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
                <p className="mt-1 font-display text-2xl text-charcoal">{value}</p>
                <p className="mt-1 text-xs text-gray-500">{hint}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
              <h2 className="text-sm font-bold text-charcoal">Last six months</h2>
              <p className="mt-1 text-xs text-gray-500">New users, listings and enquiries created each month.</p>
              <div className="mt-5 space-y-3">
                {reports.months.map((month) => {
                  const total = month.users + month.properties + month.enquiries;
                  return (
                    <div key={month.month} className="grid grid-cols-[70px_1fr_auto] items-center gap-3 text-xs">
                      <span className="font-semibold text-gray-500">
                        {new Date(`${month.month}-01T00:00:00`).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                      </span>
                      <span className="flex h-6 overflow-hidden rounded-md bg-gray-100">
                        <span className="bg-forest" style={{ width: `${(month.users / maxMonth) * 100}%` }} title={`${month.users} users`} />
                        <span className="bg-forest/60" style={{ width: `${(month.properties / maxMonth) * 100}%` }} title={`${month.properties} listings`} />
                        <span className="bg-amber-400" style={{ width: `${(month.enquiries / maxMonth) * 100}%` }} title={`${month.enquiries} enquiries`} />
                      </span>
                      <span className="text-gray-500">{total}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-forest" /> Users</span>
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-forest/60" /> Listings</span>
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Enquiries</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h2 className="text-sm font-bold text-charcoal">Billing</h2>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-gray-500">Invoices</dt><dd className="font-semibold">{reports.invoices.count}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Collected</dt><dd className="font-semibold text-emerald-700">{formatNaira(reports.invoices.collected)}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Outstanding</dt><dd className="font-semibold text-amber-700">{formatNaira(reports.invoices.outstanding)}</dd></div>
                </dl>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h2 className="text-sm font-bold text-charcoal">Inbox health</h2>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-gray-500">Contact messages</dt><dd className="font-semibold">{reports.messages.total}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Unread</dt><dd className="font-semibold">{reports.messages.unread}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Reviews</dt><dd className="font-semibold">{reports.reviews.total}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Suspended accounts</dt><dd className="font-semibold">{reports.users.suspended}</dd></div>
                </dl>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400">Generated {new Date(reports.generatedAt).toLocaleString('en-GB')}</p>
        </div>
      ) : tab === 'staff' ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold text-charcoal">Administrative staff</h2>
            <p className="mt-1 text-xs text-gray-500">
              Roles decide who can reach the control panel. Suspending an account blocks sign-in without deleting their data.
            </p>
          </div>
          {staff.length === 0 ? (
            <div className="py-16 text-center">
              <Users2 className="mx-auto h-9 w-9 text-gray-300" />
              <p className="mt-3 font-display text-xl text-charcoal">No administrative staff</p>
              <p className="mt-1 text-sm text-gray-500">Promote a registered user from the Users screen.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Last sign-in</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {staff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal">
                          {[member.first_name, member.last_name].filter(Boolean).join(' ') || 'Unnamed staff'}
                        </p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          aria-label={`Role for ${member.email ?? member.id}`}
                          value={member.admin_role ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            void updateStaff(
                              member,
                              value ? { admin_role: value, is_admin: true } : { is_admin: false, admin_role: null },
                              'Role updated.',
                            );
                          }}
                          disabled={busyId === member.id}
                          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-charcoal"
                        >
                          <option value="">No access</option>
                          {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{member.last_login_at ? relativeTime(member.last_login_at) : 'Never'}</td>
                      <td className="px-4 py-3">
                        {member.is_suspended ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase text-red-700">
                            <Ban className="h-3 w-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-700">
                            <ShieldCheck className="h-3 w-3" /> Active
                          </span>
                        )}
                        {member.is_suspended && member.suspended_reason && (
                          <p className="mt-1 text-[11px] text-gray-400">{member.suspended_reason}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          disabled={busyId === member.id}
                          onClick={() =>
                            member.is_suspended
                              ? void updateStaff(member, { is_suspended: false }, 'Account restored.')
                              : suspend(member)
                          }
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold ${
                            member.is_suspended
                              ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              : 'border-red-200 text-red-600 hover:bg-red-50'
                          } disabled:opacity-50`}
                        >
                          {busyId === member.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : member.is_suspended ? <UserCheck className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
                          {member.is_suspended ? 'Restore' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-4">
            <h2 className="mr-auto text-sm font-bold text-charcoal">Activity log</h2>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search actions…"
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-forest"
            />
            <select
              value={entityFilter}
              onChange={(event) => setEntityFilter(event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-forest"
            >
              <option value="">All entities</option>
              {['property', 'profile', 'invoice', 'review', 'article', 'development', 'settings'].map((entity) => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
            <button type="button" onClick={() => void loadActivity()} className="rounded-lg bg-forest px-3 py-2 text-xs font-bold text-white">
              Apply
            </button>
          </div>
          {activity.length === 0 ? (
            <div className="py-16 text-center">
              <Activity className="mx-auto h-9 w-9 text-gray-300" />
              <p className="mt-3 font-display text-xl text-charcoal">Nothing logged yet</p>
              <p className="mt-1 text-sm text-gray-500">Administrative actions appear here as they happen.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {activity.map((row) => (
                <li key={`${row.source}-${row.id}`} className="flex flex-wrap items-start gap-3 px-5 py-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-forest/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-charcoal">{humanAction(row.action)}</p>
                    <p className="text-xs text-gray-500">
                      {row.actor ?? 'System'}
                      {row.entity_type ? ` · ${row.entity_type}` : ''}
                      {row.entity_id ? ` · ${row.entity_id.slice(0, 8)}` : ''}
                    </p>
                  </div>
                  <time className="text-xs text-gray-400" dateTime={row.created_at}>{relativeTime(row.created_at)}</time>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
