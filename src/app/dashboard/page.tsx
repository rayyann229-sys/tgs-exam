'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  Power, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Coffee,
  PackageCheck,
  Zap,
  Users
} from 'lucide-react';
import { Order, InventoryItem, Reservation, CafeInfo } from '@/lib/types';
import { Badge } from '@/components/UI/Badge';
import { Skeleton, TableRowSkeleton } from '@/components/UI/Skeleton';
import { QuickPOSModal } from '@/components/dashboard/QuickPOSModal';
import { useToast } from '@/lib/toast-context';

export default function DashboardOverviewPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cafeInfo, setCafeInfo] = useState<CafeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPOSOpen, setIsPOSOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, invRes, resRes, cafeRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/inventory'),
        fetch('/api/reservations'),
        fetch('/api/cafe-status')
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (invRes.ok) setInventory(await invRes.json());
      if (resRes.ok) setReservations(await resRes.json());
      if (cafeRes.ok) setCafeInfo(await cafeRes.json());
    } catch (e) {
      showToast('Error loading dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
      } else {
        loadDashboardData(); // Rollback
        showToast('Failed to update order status', 'error');
      }
    } catch (e) {
      loadDashboardData();
      showToast('Server error', 'error');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const todayOrdersCount = orders.length;
  const activeReservations = reservations.filter((r) => r.status === 'Confirmed' || r.status === 'Checked-In').length;
  const lowStockItems = inventory.filter((i) => i.quantity <= i.minThreshold);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Pasrur Branch Live Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Iffi Cafe Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time management for orders, table bookings, inventory, and menu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPOSOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Open Quick POS</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <h3 className="text-2xl font-black text-white mt-1">Rs. {isLoading ? '...' : totalRevenue.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Paid Orders Summary
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Coffee className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Today Orders */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Orders Today</span>
            <h3 className="text-2xl font-black text-white mt-1">{isLoading ? '...' : todayOrdersCount}</h3>
            <p className="text-[10px] text-amber-400 font-bold mt-1">
              {orders.filter(o => o.status === 'Pending').length} Pending Kitchen
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Active Reservations */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Table Bookings</span>
            <h3 className="text-2xl font-black text-white mt-1">{isLoading ? '...' : activeReservations}</h3>
            <p className="text-[10px] text-emerald-400 font-bold mt-1">
              Upcoming Dine-In
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Stock Alerts</span>
            <h3 className="text-2xl font-black text-white mt-1">{isLoading ? '...' : lowStockItems.length}</h3>
            <p className={`text-[10px] font-bold mt-1 ${lowStockItems.length > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {lowStockItems.length > 0 ? 'Action Needed' : 'All Stock Healthy'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
            lowStockItems.length > 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Orders Feed & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders Activity Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Live Orders Stream</h3>
              <p className="text-xs text-slate-400">Click status to progress kitchen pipeline</p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All POS Orders</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{order.id}</span>
                      <Badge variant={order.orderType === 'Delivery' ? 'info' : 'neutral'}>
                        {order.orderType}
                      </Badge>
                      <span className="text-xs font-bold text-amber-400">Rs. {order.totalAmount}</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>{order.customerName}</strong> ({order.customerPhone})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>

                  {/* Status Progression Select */}
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                      className={`text-xs font-bold rounded-xl px-3 py-1.5 border transition-all ${
                        order.status === 'Completed'
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : order.status === 'Preparing'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Inventory Low Stock & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Items Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Low Inventory Stock</span>
              </h3>
              <Link href="/dashboard/inventory" className="text-xs text-amber-400 font-semibold hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2.5">
              {lowStockItems.length === 0 ? (
                <div className="p-4 bg-slate-950 rounded-xl text-center text-xs text-slate-400">
                  <PackageCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <span>All ingredients in healthy supply</span>
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950 border border-rose-500/20 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{item.itemName}</p>
                      <p className="text-[10px] text-slate-400">Supplier: {item.supplier}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-400 font-black">{item.quantity} {item.unit}</span>
                      <span className="block text-[10px] text-slate-500">Min: {item.minThreshold}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Management Modules
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/menu"
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 transition-colors block text-center"
              >
                🍔 Menu Items
              </Link>
              <Link
                href="/dashboard/reservations"
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 transition-colors block text-center"
              >
                🪑 Table Bookings
              </Link>
              <Link
                href="/dashboard/staff"
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 transition-colors block text-center"
              >
                👥 Staff Roster
              </Link>
              <Link
                href="/dashboard/reviews"
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 transition-colors block text-center"
              >
                ⭐ Reviews Mod
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* POS Terminal Modal */}
      {isPOSOpen && (
        <QuickPOSModal
          isOpen={isPOSOpen}
          onClose={() => setIsPOSOpen(false)}
          onOrderCreated={() => loadDashboardData()}
        />
      )}
    </div>
  );
}
