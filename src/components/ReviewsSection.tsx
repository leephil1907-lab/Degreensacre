'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle, MapPin, Quote, Loader2, Send, Shield } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string | null;
  message: string;
  location: string | null;
  created_at: string;
  is_verified_buyer: boolean;
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
}

function InteractiveStarRating({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`w-7 h-7 ${(hover || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', rating: 5, title: '', message: '', location: '',
  });

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews?limit=50');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.message.length < 20) {
      setError('Please write at least 20 characters');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        setForm({ name: '', email: '', rating: 5, title: '', message: '', location: '' });
        fetchReviews();
        // Open WhatsApp notification for admin
        if (data.whatsapp_notify) {
          window.open(data.whatsapp_notify, '_blank');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit review');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  if (loading) {
    return (
      <section className="py-20">
        <div className="container-custom text-center">
          <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">Client Reviews</p>
          <h2 className="font-display text-4xl text-charcoal mb-3">What our clients say</h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-lg font-bold text-charcoal">{avgRating}</span>
              <span className="text-sm text-gray-500">from {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 6).map((review) => (
            <div key={review.id} className="bg-ivory rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all relative">
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-sage/20" />

              {/* Stars */}
              <StarRating rating={review.rating} />

              {/* Title */}
              {review.title && (
                <h4 className="font-bold text-charcoal mt-3 mb-2">{review.title}</h4>
              )}

              {/* Message */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.message}</p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center">
                    <span className="text-forest font-bold text-sm">{review.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm flex items-center gap-1.5">
                      {review.name}
                      {review.is_verified_buyer && (
                        <CheckCircle className="w-3.5 h-3.5 text-forest" />
                      )}
                    </p>
                    {review.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {review.location}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review */}
        <div className="max-w-2xl mx-auto">
          {!showForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}
              >
                <Star className="w-5 h-5" />
                Write a Review
              </button>
              <p className="text-xs text-gray-400 mt-3">Share your experience with De-Greenacres</p>
            </div>
          ) : submitted ? (
            <div className="bg-forest/5 border border-forest/20 rounded-2xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-forest mx-auto mb-4" />
              <h3 className="font-display text-2xl text-charcoal mb-2">Thank you for your review!</h3>
              <p className="text-gray-600 text-sm">Your review is now live on the website. We appreciate your feedback!</p>
              <button onClick={() => { setShowForm(false); setSubmitted(false); }} className="mt-4 text-forest font-semibold text-sm underline">
                Close
              </button>
            </div>
          ) : (
            <div className="bg-ivory rounded-2xl p-6 md:p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl text-charcoal">Write a Review</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Your Rating *</label>
                  <InteractiveStarRating rating={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Your Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all" placeholder="you@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Your Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all" placeholder="e.g., Lagos, Uyo, London" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Review Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all" placeholder="e.g., Excellent service" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Your Review *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all resize-none" placeholder="Share your experience with De-Greenacres..." />
                  <p className="text-xs text-gray-400 mt-1">{form.message.length} characters (minimum 20)</p>
                </div>

                <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}>
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Review</>}
                </button>

                <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Your review will be published instantly
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
