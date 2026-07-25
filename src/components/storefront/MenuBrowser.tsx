'use client';

import React, { useState } from 'react';
import { 
  MenuItem, 
  MenuCategory 
} from '@/lib/types';
import { 
  Search, 
  Plus, 
  Flame, 
  Clock, 
  Sparkles, 
  Check, 
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { Badge } from '@/components/UI/Badge';
import { Modal } from '@/components/UI/Modal';
import { EmptyState } from '@/components/UI/EmptyState';
import { CardSkeleton } from '@/components/UI/Skeleton';
import { useToast } from '@/lib/toast-context';

interface MenuBrowserProps {
  items: MenuItem[];
  isLoading: boolean;
  onAddToCart: (item: MenuItem, selectedAddons: string[], notes: string) => void;
}

const CATEGORIES: (MenuCategory | 'All')[] = [
  'All',
  'Burgers',
  'Shawarma & Rolls',
  'Pizza',
  'Loaded Fries',
  'Fried Chicken & Broast',
  'Beverages & Chai',
  'Desserts & Waffles'
];

export function MenuBrowser({ items, isLoading, onAddToCart }: MenuBrowserProps) {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItemForCustomization, setActiveItemForCustomization] = useState<MenuItem | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [itemNotes, setItemNotes] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCustomization = (item: MenuItem) => {
    setActiveItemForCustomization(item);
    setSelectedAddons([]);
    setItemNotes('');
  };

  const handleConfirmAddToCart = () => {
    if (!activeItemForCustomization) return;
    onAddToCart(activeItemForCustomization, selectedAddons, itemNotes);
    showToast(`Added ${activeItemForCustomization.name} to cart!`, 'success');
    setActiveItemForCustomization(null);
  };

  const toggleAddon = (addonName: string) => {
    if (selectedAddons.includes(addonName)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== addonName));
    } else {
      setSelectedAddons([...selectedAddons, addonName]);
    }
  };

  return (
    <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Our Freshly Prepared Menu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore Iffi Cafe Specialties
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search burgers, pizzas, chai, shawarma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty Search Results */}
      {!isLoading && filteredItems.length === 0 && (
        <EmptyState
          title="No menu items found"
          description={
            searchQuery
              ? `No dishes matching "${searchQuery}" in category ${selectedCategory}.`
              : `No items available under category ${selectedCategory}.`
          }
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      )}

      {/* Menu Cards Grid */}
      {!isLoading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              {/* Image & Badge Overlay */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {item.isBestseller && (
                    <Badge variant="amber">
                      <Flame className="w-3 h-3 fill-amber-400" /> Bestseller
                    </Badge>
                  )}
                  {item.spicyLevel && item.spicyLevel > 0 ? (
                    <Badge variant="error">
                      {'🔥'.repeat(item.spicyLevel)} Spicy
                    </Badge>
                  ) : null}
                </div>

                {item.preparationTime && (
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-300 flex items-center gap-1 border border-slate-800">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{item.preparationTime} mins</span>
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Price</span>
                    <span className="text-lg font-black text-amber-400">Rs. {item.price}</span>
                  </div>

                  <button
                    onClick={() => handleOpenCustomization(item)}
                    disabled={!item.isAvailable}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      item.isAvailable
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{item.isAvailable ? 'Add to Order' : 'Sold Out'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Customization Modal */}
      {activeItemForCustomization && (
        <Modal
          isOpen={true}
          onClose={() => setActiveItemForCustomization(null)}
          title={`Customize ${activeItemForCustomization.name}`}
          subtitle={`Base Price: Rs. ${activeItemForCustomization.price}`}
        >
          <div className="space-y-5">
            {/* Image Banner */}
            <div className="h-40 rounded-xl overflow-hidden relative">
              <img
                src={activeItemForCustomization.image}
                alt={activeItemForCustomization.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeItemForCustomization.description}
            </p>

            {/* Addons Selection */}
            {activeItemForCustomization.addons && activeItemForCustomization.addons.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Optional Extra Add-Ons
                </h4>
                <div className="space-y-2">
                  {activeItemForCustomization.addons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.name);
                    return (
                      <button
                        key={addon.name}
                        onClick={() => toggleAddon(addon.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-500'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span>+ Rs. {addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Special Kitchen Request / Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Extra mayo, less spicy, no onions..."
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Confirm Add */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total</span>
                <span className="text-lg font-black text-amber-400">
                  Rs.{' '}
                  {activeItemForCustomization.price +
                    selectedAddons.reduce((sum, name) => {
                      const found = activeItemForCustomization.addons?.find((a) => a.name === name);
                      return sum + (found ? found.price : 0);
                    }, 0)}
                </span>
              </div>

              <button
                onClick={handleConfirmAddToCart}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/30 active:scale-95"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
