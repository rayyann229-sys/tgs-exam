'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { User } from '@/lib/types';
import { getStoredUser } from '@/lib/auth';
import { Clock, Home, Sparkles, User as UserIcon } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setUser(getStoredUser());

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' PKT'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentTime || 'Pasrur, Pakistan Time'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" /> Storefront
            </Link>

            <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <span className="text-xs font-bold text-slate-200">{user?.name || 'Iftikhar Ahmad'}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase">
                {user?.role || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
