import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Membership } from '../../types';
import { Award, X, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RenewMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  membership: Membership | null;
  onSuccess?: () => void;
}

export const RenewMembershipModal: React.FC<RenewMembershipModalProps> = ({
  isOpen,
  onClose,
  membership,
  onSuccess,
}) => {
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash' | 'bank_transfer'>('upi');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen || !membership) return null;

  const basePrice = membership.price || 3500;
  const finalAmount = Math.max(0, basePrice - Number(discount || 0));

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.renewMembership(membership.id, {
        discount: Number(discount),
        payment_method: paymentMethod,
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#EAB308'],
      });

      toast.success('Membership Renewed', `Extended plan for ${membership.member_name} until ${res.membership.end_date}!`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Renewal Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-modal-backdrop">
      <div className="animate-modal-card relative w-full max-w-lg bg-[#0F172A] border border-amber-500/30 rounded-3xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white font-display">Renew Membership</h3>
              <p className="text-xs text-slate-400">{membership.member_name} • {membership.plan_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleRenew} className="mt-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-400">Current End Date:</span>
              <span className="text-amber-300 font-bold">{membership.end_date}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Plan Base Price:</span>
              <span className="text-white font-bold">₹{basePrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Loyalty Discount (₹)</label>
              <input
                type="number"
                min="0"
                max={basePrice}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Payment Channel</label>
              <select
                value={paymentMethod}
                onChange={(e: any) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
              >
                <option value="upi">UPI / QR</option>
                <option value="card">Credit/Debit Card</option>
                <option value="cash">Cash Counter</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Total Payable Amount</span>
              <p className="text-[11px] text-slate-400">Extends subscription automatically</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-400 font-display">₹{finalAmount.toLocaleString()}</span>
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Processing...' : 'Confirm Renewal & Log Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
