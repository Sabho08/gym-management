import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Activity, X, Scale } from 'lucide-react';

interface AddMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  onSuccess?: () => void;
}

export const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({
  isOpen,
  onClose,
  memberId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    weight: 80,
    height: 180,
    body_fat_percentage: 16.0,
    chest: 42,
    waist: 33,
    arms: 15.5,
    thighs: 23.5,
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.weight) {
      toast.warning('Input Required', 'Please enter at least the current body weight.');
      return;
    }

    try {
      setLoading(true);
      await api.addMeasurement({
        member_id: memberId,
        weight: Number(form.weight),
        height: Number(form.height),
        body_fat_percentage: Number(form.body_fat_percentage),
        chest: Number(form.chest),
        waist: Number(form.waist),
        arms: Number(form.arms),
        thighs: Number(form.thighs),
        notes: form.notes,
      });

      toast.success('Metrics Recorded', 'New body composition assessment saved.');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Failed to log metrics', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-modal-backdrop overflow-y-auto">
      <div className="animate-modal-card relative w-full max-w-lg bg-[#0F172A] border border-amber-500/30 rounded-3xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white font-display">Log Body Measurements</h3>
              <p className="text-xs text-slate-400">Track weight, body fat & circumferential metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Body Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm font-bold text-amber-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Body Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.body_fat_percentage}
                onChange={(e) => setForm({ ...form, body_fat_percentage: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chest (in)</label>
              <input
                type="number"
                step="0.1"
                value={form.chest}
                onChange={(e) => setForm({ ...form, chest: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Waist (in)</label>
              <input
                type="number"
                step="0.1"
                value={form.waist}
                onChange={(e) => setForm({ ...form, waist: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Arms (in)</label>
              <input
                type="number"
                step="0.1"
                value={form.arms}
                onChange={(e) => setForm({ ...form, arms: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Thighs (in)</label>
              <input
                type="number"
                step="0.1"
                value={form.thighs}
                onChange={(e) => setForm({ ...form, thighs: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Assessment Notes
            </label>
            <input
              type="text"
              placeholder="e.g. InBody Composition scan performed post morning session."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold tracking-wide transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
