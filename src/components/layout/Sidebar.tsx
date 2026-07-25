'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Package, 
  Star, 
  Home, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Power,
  Shield,
  Coffee
} from 'lucide-react';
import { CafeInfo } from '@/lib/types';
import { useToast } from '@/lib/toast-context';

export function Sidebar() {
  const pathname = usePathname();
  const { showToast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cafeInfo, setCafeInfo] = useState<CafeInfo | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/cafe-status');
      if (res.ok) {
        const data = await res.json();
        setCafeInfo(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleCafeStatus = async () => {
    if (!cafeInfo) return;
    setIsTogglingStatus(true);
    const newStatus = !cafeInfo.isOpen;

    // Optimistic Update
    setCafeInfo({ ...cafeInfo, isOpen: newStatus });

    try {
      const res = await fetch('/api/cafe-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: newStatus })
      });
      if (res.ok) {
        showToast(
          `Cafe status set to ${newStatus ? 'OPEN' : 'CLOSED'}`,
          newStatus ? 'success' : 'info'
        );
      } else {
        setCafeInfo(cafeInfo); // Rollback
        showToast('Failed to update status', 'error');
      }
    } catch (e) {
      setCafeInfo(cafeInfo);
      showToast('Server connection error', 'error');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Menu Items', href: '/dashboard/menu', icon: Utensils },
    { name: 'Orders & POS', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Reservations', href: '/dashboard/reservations', icon: Calendar },
    { name: 'Staff Management', href: '/dashboard/staff', icon: Users },
    { name: 'Inventory Stock', href: '/dashboard/inventory', icon: Package },
    { name: 'Customer Reviews', href: '/dashboard/reviews', icon: Star },
  ];

  return (
    <aside
      className={`relative z-30 h-screen sticky top-0 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-600/30">
                <Coffee className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="leading-tight">
                <p className="font-extrabold text-sm text-white tracking-wide">IFFI CAFE</p>
                <p className="text-[10px] font-semibold text-amber-400">ADMIN DASHBOARD</p>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <div className="mx-auto w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-slate-950 font-bold">
              <Coffee className="w-5 h-5 stroke-[3]" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Cafe Status Switcher */}
        {cafeInfo && (
          <div className="p-3">
            <button
              onClick={handleToggleCafeStatus}
              disabled={isTogglingStatus}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                cafeInfo.isOpen
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300 hover:bg-rose-900/40'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Power className={`w-4 h-4 shrink-0 ${cafeInfo.isOpen ? 'text-emerald-400' : 'text-rose-400'}`} />
                {!isCollapsed && (
                  <div className="text-left leading-tight truncate">
                    <p className="text-xs font-bold">{cafeInfo.isOpen ? 'CAFE IS OPEN' : 'CAFE IS CLOSED'}</p>
                    <p className="text-[10px] opacity-75">Click to toggle</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <span className={`w-2.5 h-2.5 rounded-full ${cafeInfo.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              )}
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Exit Button */}
      <div className="p-3 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <Home className="w-4 h-4 text-amber-400 shrink-0" />
          {!isCollapsed && <span>Return Storefront</span>}
        </Link>
      </div>
    </aside>
  );
}
