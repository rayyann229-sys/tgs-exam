'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Flame, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { MenuItem, MenuCategory } from '@/lib/types';
import { Modal } from '@/components/UI/Modal';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import { CardSkeleton } from '@/components/UI/Skeleton';
import { useToast } from '@/lib/toast-context';

const CATEGORIES: MenuCategory[] = [
  'Burgers',
  'Shawarma & Rolls',
  'Pizza',
  'Loaded Fries',
  'Fried Chicken & Broast',
  'Beverages & Chai',
  'Desserts & Waffles'
];

export default function MenuManagementPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(550);
  const [category, setCategory] = useState<MenuCategory>('Burgers');
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [spicyLevel, setSpicyLevel] = useState<number>(0);
  const [preparationTime, setPreparationTime] = useState<number>(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      showToast('Error loading menu items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(500);
    setCategory('Burgers');
    setImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600');
    setIsAvailable(true);
    setIsBestseller(false);
    setSpicyLevel(0);
    setPreparationTime(15);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setImage(item.image);
    setIsAvailable(item.isAvailable);
    setIsBestseller(item.isBestseller ?? false);
    setSpicyLevel(item.spicyLevel ?? 0);
    setPreparationTime(item.preparationTime ?? 15);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const payload = {
      name,
      description,
      price: Number(price),
      category,
      image,
      isAvailable,
      isBestseller,
      spicyLevel: Number(spicyLevel),
      preparationTime: Number(preparationTime)
    };

    try {
      if (editingItem) {
        // Optimistic Update
        setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...payload } : i));

        const res = await fetch(`/api/menu/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          showToast(`Updated "${name}" successfully`, 'success');
        } else {
          fetchMenuItems();
          showToast('Failed to update menu item', 'error');
        }
      } else {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const newItem = await res.json();
          setItems(prev => [newItem, ...prev]);
          showToast(`Added "${name}" to menu!`, 'success');
        } else {
          showToast('Failed to create menu item', 'error');
        }
      }
      setIsModalOpen(false);
    } catch (e) {
      showToast('Network error while saving menu item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updatedStatus = !item.isAvailable;

    // Optimistic UI Update
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isAvailable: updatedStatus } : i));

    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: updatedStatus })
      });

      if (res.ok) {
        showToast(
          `Marked "${item.name}" as ${updatedStatus ? 'Available' : 'Sold Out'}`,
          updatedStatus ? 'success' : 'info'
        );
      } else {
        fetchMenuItems();
      }
    } catch (e) {
      fetchMenuItems();
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;

    // Optimistic delete
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Deleted "${name}"`, 'info');
      } else {
        fetchMenuItems();
        showToast('Failed to delete item', 'error');
      }
    } catch (e) {
      fetchMenuItems();
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white">Menu Items Management</h1>
          <p className="text-xs text-slate-400 mt-1">Create, update pricing, toggle stock availability, and edit dishes.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === 'All' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Item List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No menu items found"
          description="Try adjusting your search query or category filter."
          actionLabel="Add New Dish"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
            >
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <Badge variant={item.isAvailable ? 'success' : 'error'}>
                    {item.isAvailable ? 'Available' : 'Sold Out'}
                  </Badge>
                  {item.isBestseller && <Badge variant="amber">Bestseller</Badge>}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    <span className="text-amber-400 font-black text-base shrink-0">Rs. {item.price}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-2 uppercase tracking-wider">
                    Category: {item.category}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      item.isAvailable
                        ? 'bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60'
                        : 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    {item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                  </button>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="p-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form for Create / Edit */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? `Edit "${editingItem.name}"` : 'Add New Menu Item'}
          subtitle="Fill in dish details and pricing in PKR"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Dish Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Pasrur Zinger Crunch Burger"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Price (PKR)</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MenuCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Key ingredients, taste profile, and preparation style..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Image URL (Unsplash)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Spicy Level (0-3)</label>
                <input
                  type="number"
                  min={0}
                  max={3}
                  value={spicyLevel}
                  onChange={(e) => setSpicyLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Prep Time (Mins)</label>
                <input
                  type="number"
                  min={1}
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500"
                />
                In Stock & Available
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500"
                />
                Bestseller Badge
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Menu Item' : 'Create Menu Item'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
