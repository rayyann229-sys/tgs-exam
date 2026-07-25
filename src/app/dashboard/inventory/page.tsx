'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit3, AlertTriangle, RefreshCw } from 'lucide-react';
import { InventoryItem, InventoryCategory } from '@/lib/types';
import { Modal } from '@/components/UI/Modal';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import { TableRowSkeleton } from '@/components/UI/Skeleton';
import { useToast } from '@/lib/toast-context';

export default function InventoryManagementPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('Meat & Poultry');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState<'kg' | 'packs' | 'liters' | 'units' | 'boxes'>('kg');
  const [minThreshold, setMinThreshold] = useState(5);
  const [costPerUnit, setCostPerUnit] = useState(500);
  const [supplier, setSupplier] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      showToast('Error loading inventory', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (it?: InventoryItem) => {
    if (it) {
      setEditingItem(it);
      setItemName(it.itemName);
      setCategory(it.category);
      setQuantity(it.quantity);
      setUnit(it.unit);
      setMinThreshold(it.minThreshold);
      setCostPerUnit(it.costPerUnit);
      setSupplier(it.supplier);
    } else {
      setEditingItem(null);
      setItemName('');
      setCategory('Meat & Poultry');
      setQuantity(10);
      setUnit('kg');
      setMinThreshold(5);
      setCostPerUnit(500);
      setSupplier('Pasrur Wholesale Market');
    }
    setIsModalOpen(true);
  };

  const handleQuickRestock = async (item: InventoryItem, addQty: number) => {
    const newQty = item.quantity + addQty;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));

    try {
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });

      if (res.ok) {
        showToast(`Restocked +${addQty} ${item.unit} of ${item.itemName}`, 'success');
      } else {
        fetchInventory();
      }
    } catch (e) {
      fetchInventory();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const payload = {
      itemName,
      category,
      quantity: Number(quantity),
      unit,
      minThreshold: Number(minThreshold),
      costPerUnit: Number(costPerUnit),
      supplier
    };

    try {
      if (editingItem) {
        setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...payload } : i));

        const res = await fetch(`/api/inventory/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) showToast('Updated inventory item', 'success');
      } else {
        const res = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const newItem = await res.json();
          setItems(prev => [newItem, ...prev]);
          showToast(`Added ${itemName} to stock`, 'success');
        }
      }
      setIsModalOpen(false);
    } catch (e) {
      showToast('Error saving inventory', 'error');
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    setItems(prev => prev.filter(i => i.id !== id));

    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) showToast(`Deleted ${name}`, 'info');
    } catch (e) {
      fetchInventory();
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white">Inventory & Raw Ingredient Stock</h1>
          <p className="text-xs text-slate-400 mt-1">Track ingredient levels, low-stock warnings, and supplier reorders.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Ingredient Stock</span>
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No inventory recorded"
          description="Click below to add your first ingredient stock item."
          actionLabel="Add Stock"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => {
            const isLow = it.quantity <= it.minThreshold;
            return (
              <div
                key={it.id}
                className={`p-5 bg-slate-900 border rounded-2xl flex flex-col justify-between gap-4 shadow-lg ${
                  isLow ? 'border-rose-500/40' : 'border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase">{it.id}</span>
                      <h3 className="font-extrabold text-white text-base">{it.itemName}</h3>
                      <p className="text-xs text-slate-400">{it.category} • Supplier: {it.supplier}</p>
                    </div>
                    <Badge variant={isLow ? 'error' : 'success'}>
                      {isLow ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block font-bold">QTY</span>
                      <span className={`font-black text-sm ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {it.quantity} {it.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-bold">MIN LEVEL</span>
                      <span className="text-slate-300 font-semibold">{it.minThreshold} {it.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-bold">COST / {it.unit.toUpperCase()}</span>
                      <span className="text-amber-400 font-bold">Rs. {it.costPerUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleQuickRestock(it, 10)}
                      className="px-2.5 py-1 bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/40 rounded-lg text-xs font-bold transition-colors"
                    >
                      +10 {it.unit}
                    </button>
                    <button
                      onClick={() => handleQuickRestock(it, 25)}
                      className="px-2.5 py-1 bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/40 rounded-lg text-xs font-bold transition-colors"
                    >
                      +25 {it.unit}
                    </button>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(it)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(it.id, it.itemName)}
                      className="p-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? `Edit ${editingItem.itemName}` : 'Add Ingredient Stock'}
          subtitle="Record ingredient supply and reorder alerts"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ingredient Name</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Meat & Poultry">Meat & Poultry</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Produce">Produce</option>
                  <option value="Packaging">Packaging</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Unit Type</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="packs">Packs</option>
                  <option value="liters">Liters</option>
                  <option value="units">Units</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Quantity</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Threshold</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Cost / Unit</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Supplier Name</label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30"
            >
              Save Stock Record
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
