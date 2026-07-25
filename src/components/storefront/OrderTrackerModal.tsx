'use client';

import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, Truck, Package, Utensils, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { Modal } from '@/components/UI/Modal';
import { Badge } from '@/components/UI/Badge';

interface TrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Completed'];

export function OrderTrackerModal({ isOpen, onClose }: TrackerProps) {
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${searchId.trim().toUpperCase()}`);
      if (res.ok) {
        const data: Order = await res.json();
        setOrder(data);
      } else {
        setError(`No order found with ID "${searchId.trim().toUpperCase()}". Check your receipt or phone sms.`);
      }
    } catch (err) {
      setError('Connection error while fetching order details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Track Your Order Live"
      subtitle="Enter your Order Reference ID (e.g., ORD-8401) to check preparation status"
    >
      <div className="space-y-6">
        <form onSubmit={handleTrack} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g. ORD-8401"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-600/20 active:scale-95"
          >
            {isLoading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-6 animate-in fade-in duration-200">
            {/* Order Basic Info Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">Order Reference</span>
                <h4 className="text-xl font-black text-white">{order.id}</h4>
                <p className="text-xs text-slate-400">{order.customerName} • {order.customerPhone}</p>
              </div>
              <Badge variant={order.status === 'Completed' ? 'success' : 'amber'}>
                {order.status}
              </Badge>
            </div>

            {/* Status Timeline Progress Bar */}
            {order.status !== 'Cancelled' && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Live Preparation Progress
                </p>
                <div className="relative flex items-center justify-between">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, getStepIndex(order.status)) / (STATUS_STEPS.length - 1)) * 100}%`
                    }}
                  />

                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(order.status);
                    const isPassed = idx <= currentIdx;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                            isPassed
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                              : 'bg-slate-900 border border-slate-700 text-slate-500'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className="text-[9px] font-semibold text-slate-400 mt-1 hidden sm:inline">
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ordered Items</p>
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-900">
                  <span className="text-slate-200">
                    {it.quantity}x {it.name}
                  </span>
                  <span className="text-amber-400 font-bold">Rs. {it.unitPrice * it.quantity}</span>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-slate-800">
              <span className="text-slate-400">Total Payable ({order.paymentMethod})</span>
              <span className="text-lg text-amber-400 font-black">Rs. {order.totalAmount}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
