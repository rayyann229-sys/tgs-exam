'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/UI/Modal';
import { SeatingArea, Reservation } from '@/lib/types';
import { useToast } from '@/lib/toast-context';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEATING_AREAS: SeatingArea[] = [
  'Main Hall',
  'Family Section',
  'VIP Lounge',
  'Outdoor Terrace'
];

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const { showToast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [reservationDate, setReservationDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservationTime, setReservationTime] = useState('20:00');
  const [seatingArea, setSeatingArea] = useState<SeatingArea>('Family Section');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      showToast('Name and phone are required', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        guestCount,
        reservationDate,
        reservationTime,
        seatingArea,
        specialRequests
      };

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data: Reservation = await res.json();
        setConfirmedReservation(data);
        showToast('Table reserved successfully!', 'success');
      } else {
        showToast('Failed to reserve table', 'error');
      }
    } catch (e) {
      showToast('Network error while reserving table', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reserve a Table at Iffi Cafe"
      subtitle="Enjoy dine-in with family & friends at our Pasrur lounge"
    >
      {confirmedReservation ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">Table Reserved!</h3>
          <p className="text-xs text-slate-300">
            We are looking forward to serving you, <strong className="text-white">{confirmedReservation.customerName}</strong>.
          </p>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Reservation ID:</span>
              <span className="text-amber-400 font-bold">{confirmedReservation.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time:</span>
              <span className="text-white">{confirmedReservation.reservationDate} at {confirmedReservation.reservationTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Section:</span>
              <span className="text-white">{confirmedReservation.seatingArea} ({confirmedReservation.guestCount} Guests)</span>
            </div>
          </div>

          <button
            onClick={() => {
              setConfirmedReservation(null);
              onClose();
            }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Your Full Name
              </label>
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
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0327 7552400"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Guests
              </label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Seating Section
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SEATING_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSeatingArea(area)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    seatingArea === area
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Special Setup Requests (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. High chair for toddler, birthday balloon setup..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/30 active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Reserving...' : 'Confirm Table Booking'}
          </button>
        </form>
      )}
    </Modal>
  );
}
