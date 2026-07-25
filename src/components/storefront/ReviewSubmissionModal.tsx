'use client';

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Modal } from '@/components/UI/Modal';
import { useToast } from '@/lib/toast-context';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export function ReviewSubmissionModal({ isOpen, onClose, onReviewSubmitted }: ReviewModalProps) {
  const { showToast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [favoriteItem, setFavoriteItem] = useState('Iffi Special Beef Smash Burger');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName || 'Pasrur Foodie',
          rating,
          reviewText,
          favoriteItem
        })
      });

      if (res.ok) {
        showToast('Thank you! Your review has been submitted.', 'success');
        onReviewSubmitted();
        onClose();
      } else {
        showToast('Failed to submit review', 'error');
      }
    } catch (e) {
      showToast('Network error while submitting review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Iffi Cafe Experience"
      subtitle="Your honest review helps us serve Pasrur even better"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Your Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Dr. Kashif Saeed"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 hover:scale-110 transition-transform"
              >
                <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Favorite Item</label>
          <input
            type="text"
            placeholder="e.g. Zinger Burger, Crown Crust Pizza, Karak Chai"
            value={favoriteItem}
            onChange={(e) => setFavoriteItem(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Your Feedback</label>
          <textarea
            rows={3}
            required
            placeholder="Tell us about the taste, speed of service, or atmosphere..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/30 active:scale-95 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
        </button>
      </form>
    </Modal>
  );
}
