'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  User as UserIcon,
  DollarSign
} from 'lucide-react';
import { Order, OrderStatus, OrderType } from '@/lib/types';
import { Modal } from '@/components/UI/Modal';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import { TableRowSkeleton } from '@/components/UI/Skeleton';
import { QuickPOSModal } from '@/components/dashboard/QuickPOSModal';
import { useToast } from '@/lib/toast-context';

const STATUS_FILTERS: (OrderStatus | 'All')[] = [
  'All',
  'Pending',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Completed',
  'Cancelled'
];

export default function OrdersManagementPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isPOSOpen, setIsPOSOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      showToast('Error loading orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistic Update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        showToast(`Order #${orderId} status set to ${status}`, 'success');
      } else {
        fetchOrders();
        showToast('Failed to update order status', 'error');
      }
    } catch (e) {
      fetchOrders();
    }
  };

  const handleTogglePaymentStatus = async (order: Order) => {
    const newPaymentStatus = order.paymentStatus === 'Paid' ? 'Pending' : 'Paid';

    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, paymentStatus: newPaymentStatus } : o));

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      });

      if (res.ok) {
        showToast(`Payment marked as ${newPaymentStatus}`, 'info');
      } else {
        fetchOrders();
      }
    } catch (e) {
      fetchOrders();
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order #${orderId}?`)) return;

    setOrders(prev => prev.filter(o => o.id !== orderId));

    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Order #${orderId} deleted`, 'info');
      } else {
        fetchOrders();
      }
    } catch (e) {
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    const matchesType = selectedType === 'All' || o.orderType === selectedType;
    const matchesQuery = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesType && matchesQuery;
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white">Orders & POS Terminal</h1>
          <p className="text-xs text-slate-400 mt-1">Manage kitchen status pipeline, dispatch riders, and record counter tickets.</p>
        </div>
        <button
          onClick={() => setIsPOSOpen(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Counter Order</span>
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, customer name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === st ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Stream List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="There are no orders matching your selected filters."
          actionLabel="Open Quick POS"
          onAction={() => setIsPOSOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-extrabold text-white text-base">{order.id}</span>
                  <Badge variant={order.orderType === 'Delivery' ? 'info' : 'neutral'}>
                    {order.orderType}
                  </Badge>
                  <button
                    onClick={() => handleTogglePaymentStatus(order)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-950 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    Payment: {order.paymentStatus} ({order.paymentMethod})
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-0.5">
                  <p className="font-semibold text-white">
                    {order.customerName} • <span className="text-slate-400">{order.customerPhone}</span>
                  </p>
                  {order.deliveryAddress && (
                    <p className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" /> {order.deliveryAddress}
                    </p>
                  )}
                  {order.tableNumber && (
                    <p className="text-amber-400 font-semibold">Table: {order.tableNumber}</p>
                  )}
                </div>

                {/* Items detail list */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span>{it.quantity}x {it.name} {it.addons ? `(+ ${it.addons.join(', ')})` : ''}</span>
                      <span className="font-bold text-amber-400">Rs. {it.unitPrice * it.quantity}</span>
                    </div>
                  ))}
                  {order.notes && (
                    <p className="text-[10px] text-amber-300 italic pt-1 border-t border-slate-900">
                      Kitchen Note: &quot;{order.notes}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Status Action Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-slate-400 text-xs block font-bold">Total Amount</span>
                  <span className="text-xl font-black text-amber-400">Rs. {order.totalAmount}</span>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                  className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-xl px-3 py-2 focus:border-amber-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="p-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-xl transition-colors"
                  title="Delete Order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POS Modal */}
      {isPOSOpen && (
        <QuickPOSModal
          isOpen={isPOSOpen}
          onClose={() => setIsPOSOpen(false)}
          onOrderCreated={() => fetchOrders()}
        />
      )}
    </div>
  );
}
