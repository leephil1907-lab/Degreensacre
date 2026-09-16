'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle, XCircle, Clock, Loader2, MessageSquare, Trash2, Eye, MapPin, Mail } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  title: string | null;
  message: string;
  location: string | null;
  status: 'pending' | 'approved' | 'rejected';
  is_verified_buyer: boolean;
  created_at: string;
}

export default function AdminReviewsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push('/signin'); return; }
    if (profile && !profile.is_admin) { router.push('/'); return; }
  }, [user, profile, router]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: id, action }),
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);
  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const avgRating = reviews.filter(r => r.status === 'approved').length > 0
    ? (reviews.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.rating, 0) / reviews.filter(r => r.status === 'approved').length).toFixed(1)
    : '0';

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl text-charcoal">Reviews & Ratings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage customer reviews and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center"><MessageSquare className="w-5 h-5 text-forest" /></div>
            <div><p className="text-xl font-bold text-charcoal">{reviews.length}</p><p className="text-xs text-gray-500">Total Reviews</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xl font-bold text-charcoal">{pendingCount}</p><p className="text-xs text-gray-500">Pending</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-xl font-bold text-charcoal">{approvedCount}</p><p className="text-xs text-gray-500">Approved</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /></div>
            <div><p className="text-xl font-bold text-charcoal">{avgRating}</p><p className="text-xs text-gray-500">Avg Rating</p></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f ? 'bg-forest text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-forest'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Review</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">From</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 max-w-[300px]">
                    {review.title && <p className="font-semibold text-charcoal text-sm mb-0.5">{review.title}</p>}
                    <p className="text-sm text-gray-600 line-clamp-2">{review.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-charcoal text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" />{review.email}</p>
                    {review.location && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{review.location}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' :
                      review.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{review.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {actionLoading === review.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <>
                          {review.status !== 'approved' && (
                            <button onClick={() => handleAction(review.id, 'approve')} className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-gray-100 transition-colors" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button onClick={() => handleAction(review.id, 'reject')} className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100 transition-colors" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleAction(review.id, 'delete')} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
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
                      {reviews.length === 0 ? 'No reviews yet. Reviews from visitors will appear here.' : `No ${filter} reviews`}
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
