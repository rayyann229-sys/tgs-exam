'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Trash2, Send, CheckCircle2, EyeOff } from 'lucide-react';
import { Review, ReviewStatus } from '@/lib/types';
import { Modal } from '@/components/UI/Modal';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import { TableRowSkeleton } from '@/components/UI/Skeleton';
import { useToast } from '@/lib/toast-context';

export default function ReviewsManagementPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reply Modal
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      showToast('Error loading reviews', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (reviewId: string, status: ReviewStatus) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        showToast(`Review status updated to ${status}`, 'success');
      } else {
        fetchReviews();
      }
    } catch (e) {
      fetchReviews();
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview || !replyText.trim()) return;

    setReviews(prev => prev.map(r => r.id === replyingReview.id ? { ...r, replyText } : r));

    try {
      const res = await fetch(`/api/reviews/${replyingReview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText })
      });

      if (res.ok) {
        showToast('Reply published successfully!', 'success');
        setReplyingReview(null);
      } else {
        fetchReviews();
      }
    } catch (e) {
      fetchReviews();
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;

    setReviews(prev => prev.filter(r => r.id !== id));

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) showToast('Review deleted', 'info');
    } catch (e) {
      fetchReviews();
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <h1 className="text-2xl font-black text-white">Customer Feedback & Reviews</h1>
        <p className="text-xs text-slate-400 mt-1">Moderate customer reviews, publish responses, and analyze feedback.</p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No customer feedback submitted yet"
          description="Customer reviews submitted from the storefront will appear here."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4 shadow-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{rev.customerName}</h3>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    {rev.favoriteItem && (
                      <p className="text-xs text-amber-400 font-semibold mt-0.5">
                        Favorite Dish: {rev.favoriteItem}
                      </p>
                    )}
                  </div>

                  <Badge variant={rev.status === 'Published' ? 'success' : 'neutral'}>
                    {rev.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  &quot;{rev.reviewText}&quot;
                </p>

                {rev.replyText && (
                  <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                    <strong className="text-amber-400 font-bold block mb-1">Iffi Cafe Management Response:</strong>
                    &quot;{rev.replyText}&quot;
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setReplyingReview(rev);
                      setReplyText(rev.replyText || '');
                    }}
                    className="px-3 py-1.5 bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{rev.replyText ? 'Edit Reply' : 'Reply to Review'}</span>
                  </button>

                  <select
                    value={rev.status}
                    onChange={(e) => handleUpdateStatus(rev.id, e.target.value as ReviewStatus)}
                    className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-xl px-2.5 py-1.5"
                  >
                    <option value="Published">Published</option>
                    <option value="Pending">Pending</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyingReview && (
        <Modal
          isOpen={true}
          onClose={() => setReplyingReview(null)}
          title={`Reply to ${replyingReview.customerName}`}
          subtitle="This response will be visible on the public storefront review section"
        >
          <form onSubmit={handleSendReply} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Management Response</label>
              <textarea
                rows={3}
                required
                placeholder="Thank you for visiting Iffi Cafe! We hope to serve you again soon."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30"
            >
              Publish Response
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
