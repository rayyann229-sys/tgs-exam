'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Calendar, 
  Sparkles, 
  Phone, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  LayoutDashboard, 
  LogOut, 
  ChevronDown,
  Menu as MenuIcon,
  X,
  Search,
  MessageSquare
} from 'lucide-react';
import { User, Role, CafeInfo } from '@/lib/types';
import { getStoredUser, setStoredUser, removeStoredUser, DEMO_USERS } from '@/lib/auth';
import { useToast } from '@/lib/toast-context';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenReservations?: () => void;
  onOpenTracker?: () => void;
}

export function Navbar({ cartCount = 0, onOpenCart, onOpenReservations, onOpenTracker }: NavbarProps) {
  const pathname = usePathname();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [cafeInfo, setCafeInfo] = useState<CafeInfo | null>(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    fetchCafeInfo();
  }, []);

  const fetchCafeInfo = async () => {
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

  const handleSwitchRole = (role: Role) => {
    const found = DEMO_USERS.find(u => u.role === role);
    if (found) {
      setUser(found);
      setStoredUser(found);
      showToast(`Switched role to ${role.toUpperCase()} (${found.name})`, 'info');
      setIsRoleDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    removeStoredUser();
    setUser(null);
    showToast('Logged out successfully', 'info');
    setIsRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-amber-900/30">
      {/* Top Banner */}
      {cafeInfo && (
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-amber-50 text-xs py-1.5 px-4 flex items-center justify-between font-medium shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap mx-auto sm:mx-0">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cafeInfo.isOpen ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${cafeInfo.isOpen ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-[10px] bg-amber-900/60 px-1.5 py-0.5 rounded">
              {cafeInfo.isOpen ? 'OPEN NOW' : 'CLOSED'}
            </span>
            <span className="truncate">{cafeInfo.announcement}</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 shrink-0 text-amber-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-200" /> {cafeInfo.openingHours}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-200" /> {cafeInfo.contactPhone}
            </span>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                IFFI CAFE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                PASRUR
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">Fast Food & Coffee Hub</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <Link
            href="/"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname === '/' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" /> Menu & Order
          </Link>

          <button
            onClick={onOpenTracker}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" /> Track Order
          </button>

          <button
            onClick={onOpenReservations}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Book Table
          </button>

          {user && (user.role === 'admin' || user.role === 'staff') && (
            <Link
              href="/dashboard"
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/dashboard')
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Role Dropdown */}
        <div className="flex items-center gap-3">
          {/* Live Order Cart Button */}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-95 flex items-center gap-2 font-bold text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded-full text-[11px] font-extrabold border border-amber-400/40 min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                {user?.name ? user.name[0] : 'G'}
              </div>
              <div className="hidden md:block text-left pr-1">
                <p className="text-xs font-semibold text-slate-200 leading-none">{user?.name || 'Guest User'}</p>
                <p className="text-[10px] text-amber-400 font-bold uppercase mt-0.5">{user?.role || 'Customer'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-xs font-bold text-slate-200">Logged in as:</p>
                  <p className="text-xs text-amber-400 font-medium truncate">{user?.email}</p>
                </div>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-1">
                  Switch Active Role (Demo)
                </p>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleSwitchRole('admin')}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                      user?.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>👑 Admin (Owner)</span>
                    {user?.role === 'admin' && <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">Active</span>}
                  </button>

                  <button
                    onClick={() => handleSwitchRole('staff')}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                      user?.role === 'staff' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>💼 Staff / Cashier</span>
                    {user?.role === 'staff' && <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">Active</span>}
                  </button>

                  <button
                    onClick={() => handleSwitchRole('customer')}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                      user?.role === 'customer' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🍔 Customer View</span>
                    {user?.role === 'customer' && <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800 flex flex-col gap-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsRoleDropdownOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Reset Session
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 text-slate-200 text-sm font-semibold"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-400" /> Storefront Menu
          </Link>

          <button
            onClick={() => { setIsMobileMenuOpen(false); onOpenTracker?.(); }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 text-slate-200 text-sm font-semibold text-left"
          >
            <Search className="w-4 h-4 text-amber-400" /> Track My Order
          </button>

          <button
            onClick={() => { setIsMobileMenuOpen(false); onOpenReservations?.(); }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 text-slate-200 text-sm font-semibold text-left"
          >
            <Calendar className="w-4 h-4 text-emerald-400" /> Reserve Table
          </button>

          {user && (user.role === 'admin' || user.role === 'staff') && (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-600/30"
            >
              <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
