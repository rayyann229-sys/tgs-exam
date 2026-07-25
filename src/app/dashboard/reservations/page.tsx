'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit3, CheckCircle2, Clock, Users, MapPin } from 'lucide-react';
import { Reservation, ReservationStatus, SeatingArea } from '@/lib/types';
import { Modal } from '@/components/UI/Modal';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import { TableRowSkeleton } from '@/components/UI/Skeleton';
import { useToast } from '@/lib/toast-context';

export default function ReservationsManagementPage() {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [guestCount, setGuestCount] = useState(4);
  const [reservationDate, setReservationDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservationTime, setReservationTime] = useState('20:00');
  const [seatingArea, setSeatingArea] = useState<SeatingArea>('Family Section');
  const [tableNumber, setTableNumber] = useState('F-1');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (e) {
      showToast('Error loading reservations', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (resId: string, status: ReservationStatus) => {
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status } : r));

    try {
      const res = await fetch(`/api/reservations/${resId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        showToast(`Reservation ${resId} marked as ${status}`, 'success');
      } else {
        fetchReservations();
      }
    } catch (e) {
      fetchReservations();
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    try {
      const payload = {
        customerName,
        customerPhone,
        guestCount,
        reservationDate,
        reservationTime,
        seatingArea,
        tableNumber
      };

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newRes = await res.json();
        setReservations(prev => [newRes, ...prev]);
        showToast('Reservation created successfully!', 'success');
        setIsModalOpen(false);
      }
    } catch (e) {
      showToast('Failed to create reservation', 'error');
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!confirm('Are you sure you want to cancel and delete this reservation?')) return;

    setReservations(prev => prev.filter(r => r.id !== id));

    try {
      const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Reservation deleted', 'info');
      } else {
        fetchReservations();
      }
    } catch (e) {
      fetchReservations();
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white">Table Reservations Management</h1>
          <p className="text-xs text-slate-400 mt-1">Book tables, manage dine-in guests, and assign lounge sections.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Reservation Cards List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <EmptyState
          title="No reservations scheduled"
          description="Click below to add a table reservation for guests."
          actionLabel="Book Table"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">{res.id}</span>
                    <h3 className="font-extrabold text-white text-base">{res.customerName}</h3>
                    <p className="text-xs text-slate-400">{res.customerPhone}</p>
                  </div>
                  <Badge variant={res.status === 'Checked-In' ? 'success' : 'amber'}>
                    {res.status}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">DATE & TIME</span>
                    <span className="text-white font-semibold">{res.reservationDate} at {res.reservationTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">SECTION & GUESTS</span>
                    <span className="text-amber-400 font-semibold">{res.seatingArea} ({res.guestCount} Guests)</span>
                  </div>
                </div>

                {res.specialRequests && (
                  <p className="text-xs text-slate-400 italic">
                    Note: &quot;{res.specialRequests}&quot;
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <select
                  value={res.status}
                  onChange={(e) => handleUpdateStatus(res.id, e.target.value as ReservationStatus)}
                  className="bg-slate-950 border border-slate-800 text-xs text-white font-bold rounded-lg px-2.5 py-1.5"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => handleDeleteReservation(res.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Reservation Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Table Reservation"
          subtitle="Reserve table for walk-in or phone bookings"
        >
          <form onSubmit={handleCreateReservation} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Guests</label>
                <input
                  type="number"
                  min={1}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Time</label>
                <input
                  type="time"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Seating Section</label>
                <select
                  value={seatingArea}
                  onChange={(e) => setSeatingArea(e.target.value as SeatingArea)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Main Hall">Main Hall</option>
                  <option value="Family Section">Family Section</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Outdoor Terrace">Outdoor Terrace</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Assigned Table</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30"
            >
              Save Reservation
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
