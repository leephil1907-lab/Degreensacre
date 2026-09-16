'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Search, Mail, MoreVertical, CheckCircle, XCircle, Clock,
  UserCheck, UserX, Download, Loader2, Shield, Users, UserPlus, Ban
} from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  state: string | null;
  country: string;
  account_type: string;
  is_admin: boolean;
  is_verified: boolean;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.set('search', search);
      if (filterType !== 'all') params.set('account_type', filterType.toLowerCase());

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterType]);

  useEffect(() => {
    if (!user) { router.push('/signin'); return; }
    if (profile && !profile.is_admin) { router.push('/'); return; }
    fetchUsers();
  }, [user, profile, router, fetchUsers]);

  const handleAction = async (userId: string, action: string, extra?: any) => {
    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action, ...extra }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'State', 'Type', 'Admin', 'Verified', 'Last Login', 'Joined'];
    const rows = users.map(u => [
      `${u.first_name} ${u.last_name}`,
      u.email,
      u.phone || '',
      u.state || '',
      u.account_type,
      u.is_admin ? 'Yes' : 'No',
      u.is_verified ? 'Yes' : 'No',
      u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : 'Never',
      new Date(u.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `degreenacres-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filteredUsers = users.filter(u => {
    if (filterStatus === 'active' && !u.last_login_at) return false;
    if (filterStatus === 'new' && u.last_login_at) return false;
    if (filterStatus === 'admin' && !u.is_admin) return false;
    return true;
  });

  const getInitials = (u: UserProfile) => {
    return `${(u.first_name || u.email[0] || '?')[0]}${(u.last_name || '')[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">{total} registered user{total !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-forest-light transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-forest" />
            </div>
            <div>
              <p className="text-xl font-bold text-charcoal">{users.length}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-charcoal">{users.filter(u => !u.last_login_at).length}</p>
              <p className="text-xs text-gray-500">New (No Login)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-charcoal">{users.filter(u => u.last_login_at).length}</p>
              <p className="text-xs text-gray-500">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-charcoal">{users.filter(u => u.is_admin).length}</p>
              <p className="text-xs text-gray-500">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest"
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Types</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
          <option value="agent">Agents</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Status</option>
          <option value="active">Active (Logged In)</option>
          <option value="new">New (No Login)</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Last Login</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        u.is_admin ? 'bg-forest text-white' : 'bg-forest/10 text-forest'
                      }`}>
                        {getInitials(u)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-charcoal text-sm truncate">
                            {u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.email.split('@')[0]}
                          </span>
                          {u.is_admin && <Shield className="w-3.5 h-3.5 text-forest flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-400">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-charcoal truncate max-w-[180px]">{u.email}</p>
                    <p className="text-xs text-gray-400">{u.phone || 'No phone'} {u.state ? `· ${u.state}` : ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      u.account_type === 'buyer' ? 'bg-blue-100 text-blue-700' :
                      u.account_type === 'seller' ? 'bg-purple-100 text-purple-700' :
                      u.account_type === 'agent' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {u.account_type || 'buyer'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {u.is_verified ? (
                        <><CheckCircle className="w-4 h-4 text-forest" /><span className="text-xs font-semibold text-forest">Verified</span></>
                      ) : (
                        <><Clock className="w-4 h-4 text-amber-500" /><span className="text-xs font-semibold text-amber-600">Pending</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {u.last_login_at ? (
                      <span>{new Date(u.last_login_at).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-gray-400 italic">Never</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {actionLoading === u.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleAction(u.id, 'toggle_verified')}
                            className="p-2 text-gray-400 hover:text-forest rounded-lg hover:bg-gray-100 transition-colors"
                            title={u.is_verified ? 'Unverify user' : 'Verify user'}
                          >
                            {u.is_verified ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <a
                            href={`mailto:${u.email}`}
                            className="p-2 text-gray-400 hover:text-forest rounded-lg hover:bg-gray-100 transition-colors"
                            title="Send email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {!u.is_admin && (
                            <button
                              onClick={() => handleAction(u.id, 'toggle_admin')}
                              className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Make admin"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <UserX className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      {users.length === 0 ? 'No users registered yet. Users who sign up will appear here.' : 'No users match your filters'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
