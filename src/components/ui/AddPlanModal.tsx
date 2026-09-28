import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Award, X, Plus, Trash2 } from 'lucide-react';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddPlanModal: React.FC<AddPlanModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    description: '',
    duration_days: 30,
    price: 3500,
    features: ['Full Gym Access', 'Locker & Shower Access'],
    is_popular: false,
  });

  const [newFeature, setNewFeature] = useState('');

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setForm({ ...form, features: [...form.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.warning('Input Error', 'Please enter a plan name and price.');
      return;
    }

    try {
      setLoading(true);
      await api.createPlan(form);
      toast.success('Membership Plan Created', `${form.name} is now available for member enrollment.`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Plan Creation Failed', err.message);
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
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white font-display">Create Membership Plan</h3>
              <p className="text-xs text-slate-400">Configure pricing tier & included amenities</p>
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
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Plan Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. VIP Platinum Annual"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.duration_days}
                onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Fee Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm font-bold text-amber-300 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Full club access, dedicated towel service and personal coaching."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Included Amenities & Features
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Free Cryo Spa Session"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-amber-400 text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {form.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs border border-white/5"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
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
              <Award className="w-4 h-4" />
              {loading ? 'Creating...' : 'Save Membership Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
