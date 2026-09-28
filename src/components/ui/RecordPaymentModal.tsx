import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Member } from '../../types';
import { CreditCard, X, Search, CheckCircle2, DollarSign, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMemberId?: string | null;
  onSuccess?: (paymentId?: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultMemberId,
  onSuccess,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    member_id: '',
    amount: 3500,
    payment_method: 'upi' as 'upi' | 'card' | 'cash' | 'bank_transfer',
    transaction_reference: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      api.getMembers().then((res) => {
        setMembers(res);
        const targetId = defaultMemberId || (res.length > 0 ? res[0].id : '');
        setForm((prev) => ({
          ...prev,
          member_id: targetId,
          transaction_reference: `TXN-${Date.now().toString().slice(-8)}`,
        }));
      });
    }
  }, [isOpen, defaultMemberId]);

  if (!isOpen) return null;

  const selectedMember = members.find((m) => m.id === form.member_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.member_id || !form.amount) {
      toast.warning('Input Error', 'Please select a member and enter a valid amount.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.recordPayment({
        ...form,
        membership_id: selectedMember?.current_membership?.id,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#38BDF8'],
      });

      toast.success('Payment Recorded', `Successfully logged ₹${form.amount.toLocaleString()} for ${selectedMember?.full_name}`);
      onClose();
      if (onSuccess) onSuccess(res.id);
    } catch (err: any) {
      toast.error('Payment Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-modal-backdrop">
      <div className="animate-modal-card relative w-full max-w-lg bg-[#0F172A] border border-amber-500/30 rounded-3xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white font-display">Record Club Payment</h3>
              <p className="text-xs text-slate-400">Membership dues, PT sessions & merchandise</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Select Club Member *
            </label>
            <select
              required
              value={form.member_id}
              onChange={(e) => setForm({ ...form, member_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code}) — {m.current_membership?.plan_name || 'No Active Plan'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm font-bold outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Payment Channel
              </label>
              <select
                value={form.payment_method}
                onChange={(e: any) => setForm({ ...form, payment_method: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
              >
                <option value="upi">UPI / QR Code</option>
                <option value="card">Credit / Debit Card</option>
                <option value="cash">Cash at Counter</option>
                <option value="bank_transfer">Bank Wire Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Transaction / Reference Ref
            </label>
            <input
              type="text"
              value={form.transaction_reference}
              onChange={(e) => setForm({ ...form, transaction_reference: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Remarks / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. VIP Plan quarterly payment, received via counter QR"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              {loading ? 'Processing...' : 'Confirm & Generate Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
