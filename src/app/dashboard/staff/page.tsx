'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit3, Shield, Mail, Phone, Calendar } from 'lucide-react';
import { StaffMember, StaffRole, StaffStatus, ShiftType } from '@/lib/types';
import { Modal } from '@/components/UI/Modal';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import { TableRowSkeleton } from '@/components/UI/Skeleton';
import { useToast } from '@/lib/toast-context';

export default function StaffManagementPage() {
  const { showToast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('Cashier');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState(40000);
  const [status, setStatus] = useState<StaffStatus>('Active');
  const [shift, setShift] = useState<ShiftType>('Evening');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (e) {
      showToast('Error loading staff', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (st?: StaffMember) => {
    if (st) {
      setEditingStaff(st);
      setName(st.name);
      setRole(st.role);
      setPhone(st.phone);
      setEmail(st.email);
      setSalary(st.salary);
      setStatus(st.status);
      setShift(st.shift);
    } else {
      setEditingStaff(null);
      setName('');
      setRole('Cashier');
      setPhone('');
      setEmail('');
      setSalary(40000);
      setStatus('Active');
      setShift('Evening');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      role,
      phone,
      email,
      salary: Number(salary),
      status,
      shift
    };

    try {
      if (editingStaff) {
        setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...payload } : s));

        const res = await fetch(`/api/staff/${editingStaff.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          showToast(`Updated ${name}`, 'success');
        } else {
          fetchStaff();
        }
      } else {
        const res = await fetch('/api/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const newStaff = await res.json();
          setStaff(prev => [newStaff, ...prev]);
          showToast(`Added ${name} to team`, 'success');
        }
      }
      setIsModalOpen(false);
    } catch (e) {
      showToast('Error saving staff member', 'error');
    }
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from staff?`)) return;

    setStaff(prev => prev.filter(s => s.id !== id));

    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Removed ${name}`, 'info');
      } else {
        fetchStaff();
      }
    } catch (e) {
      fetchStaff();
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white">Staff Management & Roster</h1>
          <p className="text-xs text-slate-400 mt-1">Manage employees, shifts, roles, and monthly payrolls.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <EmptyState
          title="No staff members found"
          description="Click below to add a new employee."
          actionLabel="Add Staff"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staff.map((st) => (
            <div key={st.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4 shadow-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">{st.id}</span>
                    <h3 className="font-extrabold text-white text-base">{st.name}</h3>
                    <p className="text-xs text-slate-400">{st.role} • {st.shift} Shift</p>
                  </div>
                  <Badge variant={st.status === 'Active' ? 'success' : 'neutral'}>
                    {st.status}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">CONTACT</span>
                    <span className="text-white">{st.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">SALARY (PKR)</span>
                    <span className="text-amber-400 font-bold">Rs. {st.salary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenModal(st)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteStaff(st.id, st.name)}
                  className="p-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingStaff ? `Edit ${editingStaff.name}` : 'Add Staff Member'}
          subtitle="Record employee info, salary, and shift"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Manager">Manager</option>
                  <option value="Head Chef">Head Chef</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Delivery Rider">Delivery Rider</option>
                  <option value="Waiter">Waiter</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Shift</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as ShiftType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Salary (PKR)</label>
                <input
                  type="number"
                  min={10000}
                  required
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30"
            >
              Save Employee Record
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
