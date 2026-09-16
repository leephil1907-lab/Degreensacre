'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, MessageSquare, Clock, CheckCircle, Mail, Eye,
  Archive, Home, Loader2, Phone, MapPin, Calendar
} from 'lucide-react';

interface Enquiry {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  message: string;
  status: string;
  created_at: string;
  properties?: { title: string; slug: string };
  profiles?: { first_name: string; last_name: string; email: string };
}

export default function EnquiriesPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [total, setTotal] = useState(0);

  const fetchEnquiries = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.set('search', search);
      if (filterStatus !== 'all') params.set('status', filterStatus);

      const res = await fetch(`/api/admin/enquiries?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
        setTotal(data.count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    if (!user) { router.push('/signin'); return; }
    if (profile && !profile.is_admin) { router.push('/'); return; }
    fetchEnquiries();
  }, [user, profile, router, fetchEnquiries]);

  const markStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiry_id: id, status }),
      });
      if (res.ok) fetchEnquiries();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filtered = enquiries.filter(e => {
    const matchesSearch = !search || 
      e.buyer_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.buyer_email?.toLowerCase().includes(search.toLowerCase()) ||
      e.properties?.title?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl text-charcoal">Enquiries & Messages</h2>
        <p className="text-sm text-gray-500 mt-1">{total} total enquiries · {enquiries.filter(e => e.status === 'new').length} new</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-xl font-bold text-charcoal">{total}</p><p className="text-xs text-gray-500">Total</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xl font-bold text-charcoal">{enquiries.filter(e => e.status === 'new').length}</p><p className="text-xs text-gray-500">New</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-xl font-bold text-charcoal">{enquiries.filter(e => e.status === 'replied').length}</p><p className="text-xs text-gray-500">Replied</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Archive className="w-5 h-5 text-gray-600" /></div>
            <div><p className="text-xl font-bold text-charcoal">{enquiries.filter(e => e.status === 'closed').length}</p><p className="text-xs text-gray-500">Closed</p></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name, email, or property..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">From</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Message</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Property</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-charcoal text-sm">{enquiry.buyer_name}</p>
                      <p className="text-xs text-gray-400">{enquiry.buyer_email}</p>
                      {enquiry.buyer_phone && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{enquiry.buyer_phone}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[250px]">
                    <p className="text-sm text-gray-600 line-clamp-2">{enquiry.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    {enquiry.properties ? (
                      <Link href={`/properties/${enquiry.properties.slug}`} target="_blank" className="text-sm text-forest hover:underline flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[120px]">{enquiry.properties.title}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400 italic">General enquiry</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      enquiry.status === 'replied' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {enquiry.status === 'new' && <Clock className="w-3 h-3" />}
                      {enquiry.status === 'replied' && <CheckCircle className="w-3 h-3" />}
                      {enquiry.status || 'new'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(enquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedEnquiry(enquiry)} className="p-2 text-gray-400 hover:text-forest rounded-lg hover:bg-gray-100" title="View full message">
                        <Eye className="w-4 h-4" />
                      </button>
                      <a href={`mailto:${enquiry.buyer_email}`} className="p-2 text-gray-400 hover:text-forest rounded-lg hover:bg-gray-100" title="Reply by email">
                        <Mail className="w-4 h-4" />
                      </a>
                      {enquiry.status === 'new' && (
                        <button onClick={() => markStatus(enquiry.id, 'replied')} className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-gray-100" title="Mark as replied">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      {enquiries.length === 0 ? 'No enquiries yet. When users enquire about properties or book inspections, their messages will appear here.' : 'No enquiries match your filters'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEnquiry(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-display text-xl text-charcoal">Enquiry Details</h3>
              <p className="text-xs text-gray-400 mt-1">{new Date(selectedEnquiry.created_at).toLocaleString()}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Name</p>
                  <p className="text-sm text-charcoal font-semibold">{selectedEnquiry.buyer_name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-sm text-charcoal">{selectedEnquiry.buyer_email}</p>
                </div>
                {selectedEnquiry.buyer_phone && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-sm text-charcoal">{selectedEnquiry.buyer_phone}</p>
                  </div>
                )}
                {selectedEnquiry.properties && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Property</p>
                    <p className="text-sm text-forest font-semibold">{selectedEnquiry.properties.title}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Message</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-charcoal whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <a href={`mailto:${selectedEnquiry.buyer_email}`} className="flex items-center gap-2 px-4 py-2.5 bg-forest text-white rounded-xl text-sm font-bold hover:bg-forest-light">
                <Mail className="w-4 h-4" /> Reply by Email
              </a>
              <button onClick={() => setSelectedEnquiry(null)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
