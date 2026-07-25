'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Send, Trash2 } from 'lucide-react';
import { MenuItem, OrderType, PaymentMethod, Order } from '@/lib/types';
import { Modal } from '@/components/UI/Modal';
import { useToast } from '@/lib/toast-context';

interface QuickPOSProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export function QuickPOSModal({ isOpen, onClose, onOrderCreated }: QuickPOSProps) {
  const { showToast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<{ menuItem: MenuItem; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Guest');
  const [customerPhone, setCustomerPhone] = useState('+92 300 0000000');
  const [orderType, setOrderType] = useState<OrderType>('Dine-In');
  const [tableNumber, setTableNumber] = useState('Table 1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/menu')
        .then(res => res.json())
        .then(data => setMenuItems(data))
        .catch(console.error);
    }
  }, [isOpen]);

  const addToCart = (item: MenuItem) => {
    const existing = cartItems.find(i => i.menuItem.id === item.id);
    if (existing) {
      setCartItems(cartItems.map(i => i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCartItems([...cartItems, { menuItem: item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems(cartItems.filter(i => i.menuItem.id !== itemId));
    } else {
      setCartItems(cartItems.map(i => i.menuItem.id === itemId ? { ...i, quantity: qty } : i));
    }
  };

  const subtotal = cartItems.reduce((sum, i) => sum + (i.menuItem.price * i.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Add items to order before checkout', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        customerPhone,
        orderType,
        tableNumber: orderType === 'Dine-In' ? tableNumber : undefined,
        paymentMethod,
        paymentStatus: 'Paid',
        items: cartItems.map(i => ({
          menuItemId: i.menuItem.id,
          name: i.menuItem.name,
          quantity: i.quantity,
          unitPrice: i.menuItem.price
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const orderData: Order = await res.json();
        onOrderCreated(orderData);
        showToast(`POS Order #${orderData.id} placed & marked Paid!`, 'success');
        setCartItems([]);
        onClose();
      } else {
        showToast('Failed to create POS order', 'error');
      }
    } catch (e) {
      showToast('Network error in POS system', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick POS Terminal"
      subtitle="Fast counter order entry for walk-in dine-in and takeaway"
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Menu Items Selector */}
        <div className="md:col-span-7 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Menu Items</h4>
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all flex flex-col justify-between"
              >
                <p className="font-bold text-xs text-white line-clamp-1">{item.name}</p>
                <p className="text-xs font-black text-amber-400 mt-1">Rs. {item.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Current Order Summary */}
        <div className="md:col-span-5 bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Current Ticket</h4>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">Click items on the left to add</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-900">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold truncate">{item.menuItem.name}</p>
                      <p className="text-amber-400 font-bold">Rs. {item.menuItem.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg">
                      <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="p-0.5 text-slate-400">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="p-0.5 text-slate-400">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as OrderType)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="Dine-In">Dine-In</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Delivery">Delivery</option>
                </select>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400 font-bold">Total</span>
              <span className="text-xl font-black text-amber-400">Rs. {subtotal}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Print & Complete Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
