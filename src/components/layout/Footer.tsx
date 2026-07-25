import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, MapPin, Phone, Clock, Heart, Award, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-slate-950 font-black">
                <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-white">IFFI CAFE PASRUR</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Pasrur&apos;s premier fast food destination & coffee lounge. Craving juicy burgers, artisanal shawarmas, cheesy pizzas, or late night Karak Chai? We&apos;ve got you covered!
            </p>
            <div className="flex items-center gap-2 text-amber-400 font-semibold pt-1">
              <Award className="w-4 h-4" /> Rated #1 Cafe in Pasrur Tehsil
            </div>
          </div>

          {/* Quick Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Location & Contact</h4>
            <div className="space-y-2">
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Main Pasrur-Sialkot Road, Near Govt College, Pasrur 51480, Sialkot District, Punjab, Pakistan</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+92 327 7552400 (Phone / WhatsApp)</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Open 12:00 PM – 2:00 AM Daily</span>
              </p>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Popular Menu</h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>🍔 Iffi Special Beef Smash Burger</li>
              <li>⚡ Pasrur Crunch Zinger Burger</li>
              <li>🍕 Crown Crust Chicken Tikka Pizza</li>
              <li>🌯 Arabian Special Chicken Shawarma</li>
              <li>🍟 Fiery Jalapeno Cheese Loaded Fries</li>
              <li>☕ Karak Doodh Patti Chai (Late Night)</li>
            </ul>
          </div>

          {/* Payment Options & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Payment Options</h4>
            <p className="text-slate-400 leading-normal">
              We accept Cash on Delivery, Pick-up Counter Payment, JazzCash, and EasyPaisa mobile transfers.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-200 font-bold text-[11px]">
                💵 Cash on Delivery
              </span>
              <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-amber-400 font-bold text-[11px]">
                📱 JazzCash / EasyPaisa
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Iffi Cafe Pasrur. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Pasrur, Punjab</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
