'use client';

import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  CheckCircle2, 
  CreditCard, 
  Send,
  Sparkles
} from 'lucide-react';
import { OrderType, PaymentMethod, Order } from '@/lib/types';
import { EmptyState } from '@/components/UI/EmptyState';
import { useToast } from '@/lib/toast-context';

export interface CartItem {
  id: string; // unique cart item id
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  addons: string[];
  notes: string;
  image?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

const PASRUR_NEIGHBORHOODS = [
  'College Road, Pasrur',
  'Circular Road, Pasrur',
  'Main Bazaar, Pasrur',
  'Satellite Town, Pasrur',
  'Housing Colony, Pasrur',
  'Sialkot Road, Near Govt College, Pasrur',
  'Chawinda Road, Pasrur'
];

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced
}: CartDrawerProps) {
  const { showToast } = useToast();
  const [orderType, setOrderType] = useState<OrderType>('Delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(PASRUR_NEIGHBORHOODS[0]);
  const [tableNumber, setTableNumber] = useState('Table 1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const deliveryFee = orderType === 'Delivery' ? 100 : 0;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('Please provide your Name and Phone number', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        customerPhone,
        orderType,
        deliveryAddress: orderType === 'Delivery' ? deliveryAddress : undefined,
        tableNumber: orderType === 'Dine-In' ? tableNumber : undefined,
        paymentMethod,
        items: cartItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          addons: item.addons,
          notes: item.notes
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const orderData: Order = await res.json();
        setConfirmedOrder(orderData);
        onOrderPlaced(orderData);
        onClearCart();
        showToast(`Order #${orderData.id} placed successfully!`, 'success');
      } else {
        showToast('Failed to place order. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Network error while placing order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Your Food Cart</h3>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                {cartItems.length} items
              </span>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Confirmed Order State */}
            {confirmedOrder ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">Order Confirmed!</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Thank you, <strong className="text-white">{confirmedOrder.customerName}</strong>! Your order has been dispatched to Iffi Cafe kitchen.
                </p>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between font-bold border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Order Reference</span>
                    <span className="text-amber-400">{confirmedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className="text-white font-semibold">{confirmedOrder.orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Amount</span>
                    <span className="text-amber-400 font-bold">Rs. {confirmedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment</span>
                    <span className="text-slate-200">{confirmedOrder.paymentMethod}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    onClose();
                  }}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg"
                >
                  Done & Back to Menu
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                {cartItems.length === 0 ? (
                  <EmptyState
                    icon={ShoppingBag}
                    title="Your cart is empty"
                    description="Browse Iffi Cafe's delicious burgers, loaded fries, and pizzas to add your favorite items!"
                    actionLabel="Browse Menu"
                    onAction={onClose}
                  />
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                          {item.addons.length > 0 && (
                            <p className="text-[10px] text-amber-400 truncate">
                              + {item.addons.join(', ')}
                            </p>
                          )}
                          <p className="text-xs font-black text-amber-400 mt-1">
                            Rs. {item.unitPrice * item.quantity}
                          </p>
                        </div>

                        {/* Quantity Buttons */}
                        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checkout Form */}
                {cartItems.length > 0 && (
                  <form onSubmit={handleSubmitOrder} className="space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Checkout Details
                    </h4>

                    {/* Order Type Pill Selector */}
                    <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                      {(['Delivery', 'Takeaway', 'Dine-In'] as OrderType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setOrderType(type)}
                          className={`py-2 text-xs font-bold rounded-lg transition-all ${
                            orderType === type
                              ? 'bg-amber-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Customer Info Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Muhammad Usman"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Phone Number (WhatsApp)
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0300 1234567"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {orderType === 'Delivery' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Delivery Address in Pasrur
                          </label>
                          <select
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          >
                            {PASRUR_NEIGHBORHOODS.map((addr) => (
                              <option key={addr} value={addr}>
                                {addr}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {orderType === 'Dine-In' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Table Number
                          </label>
                          <select
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="Table 1">Table 1 (Main Hall)</option>
                            <option value="Table 2">Table 2 (Main Hall)</option>
                            <option value="Table 3">Table 3 (Family Section)</option>
                            <option value="Table 4">Table 4 (VIP Lounge)</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Payment Option
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['Cash', 'JazzCash', 'EasyPaisa', 'Card'] as PaymentMethod[]).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`p-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                                paymentMethod === method
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {method === 'Cash' ? '💵 Cash / CoD' : `📱 ${method}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Items Subtotal</span>
                        <span>Rs. {subtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Delivery Charge</span>
                        <span>Rs. {deliveryFee}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-white text-sm pt-2 border-t border-slate-800">
                        <span>Total Payable</span>
                        <span className="text-amber-400">Rs. {totalAmount}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-600/30 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Place Order Now (Rs. {totalAmount})</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
