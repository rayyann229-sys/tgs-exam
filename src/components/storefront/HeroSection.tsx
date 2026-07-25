import React from 'react';
import { UtensilsCrossed, Flame, Clock, Sparkles, MapPin, PhoneCall, Star } from 'lucide-react';

interface HeroProps {
  onBrowseMenu: () => void;
  onBookTable: () => void;
}

export function HeroSection({ onBrowseMenu, onBookTable }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
      {/* Background Glow Overlay */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>PASRUR&apos;S #1 FAST FOOD & COFFEE CAFE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Savor the Taste of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Iffi Cafe Pasrur
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Indulge in juicy double smash beef burgers, crispy Zinger rolls, cheesy crown crust pizzas, fiery loaded fries, and late-night Karak Chai — crafted hot & fresh until 2:00 AM!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onBrowseMenu}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-600/25 transition-all active:scale-95 flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                <Flame className="w-4 h-4 fill-slate-950" /> Order Online Now
              </button>

              <button
                onClick={onBookTable}
                className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-700/80 transition-all active:scale-95 flex items-center gap-2 text-sm"
              >
                Reserve a Table
              </button>
            </div>

            {/* Micro Info Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Open 12:00 PM - 2:00 AM Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Main Pasrur-Sialkot Road</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-slate-200">4.8 Rating (380+ Reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/20 shadow-2xl shadow-amber-900/30 group">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000"
                alt="Iffi Special Smash Burger Pasrur"
                className="w-full h-[380px] sm:h-[440px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Floating Bestseller Tag */}
              <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-slate-950" /> Bestseller
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-extrabold text-white text-lg">Iffi Special Beef Smash Burger</h3>
                    <p className="text-xs text-slate-300">Double beef patty, melted cheddar & secret Iffi sauce</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-400">Rs. 850</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
