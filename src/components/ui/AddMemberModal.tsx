import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { MembershipPlan, Trainer } from '../../types';
import { UserPlus, X, User, Phone, Mail, Award, Calendar, ShieldCheck, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: 'male' as 'male' | 'female' | 'other',
    date_of_birth: '1995-01-01',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    plan_id: '',
    assigned_trainer_id: '',
    payment_method: 'upi' as 'upi' | 'card' | 'cash' | 'bank_transfer',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      Promise.all([api.getPlans(), api.getTrainers()])
        .then(([p, t]) => {
          setPlans(p);
          setTrainers(t);
          if (p.length > 0 && !form.plan_id) {
            setForm((prev) => ({ ...prev, plan_id: p[0].id }));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.phone) {
      toast.warning('Required Fields', 'Please provide full name and phone number.');
      return;
    }

    try {
      setLoading(true);
      const newMember = await api.createMember({
        ...form,
        initial_payment: Boolean(form.plan_id),
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6']
      });

      toast.success('Member Registered', `Welcome ${newMember.full_name} (${newMember.member_code}) to ApexFit!`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id === form.plan_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-modal-backdrop overflow-y-auto">
      <div className="animate-modal-card relative w-full max-w-2xl bg-[#0F172A] border border-amber-500/30 rounded-3xl shadow-2xl p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white font-display">Register New Member</h3>
              <p className="text-xs text-slate-400">Personal details, membership plan & onboarding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> 1. Personal & Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yashvardhan Singhania"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98111 22334"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="member@apexfit.club"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e: any) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Non-binary</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Residence Address</label>
                <input
                  type="text"
                  placeholder="Apartment, Street, Landmark, City"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> 2. Emergency Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Person Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pooja Singhania (Spouse)"
                  value={form.emergency_contact_name}
                  onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98111 99887"
                  value={form.emergency_contact_phone}
                  onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <Award className="w-3.5 h-3.5" /> 3. Membership Plan & Coaching
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Membership Plan</label>
                <select
                  value={form.plan_id}
                  onChange={(e) => setForm({ ...form, plan_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                >
                  <option value="">No Plan (Profile Only)</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price.toLocaleString()} ({p.duration_days} days)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assign Personal Trainer</label>
                <select
                  value={form.assigned_trainer_id}
                  onChange={(e) => setForm({ ...form, assigned_trainer_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                >
                  <option value="">No Trainer Assigned</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {form.plan_id && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Initial Payment Method</label>
                  <select
                    value={form.payment_method}
                    onChange={(e: any) => setForm({ ...form, payment_method: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                  >
                    <option value="upi">UPI (Instant QR / App)</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="cash">Cash at Counter</option>
                    <option value="bank_transfer">Bank Wire / IMPS / NEFT</option>
                  </select>
                </div>
              )}

              <div className={form.plan_id ? '' : 'sm:col-span-2'}>
                <label className="block text-xs font-medium text-slate-300 mb-1">Member Goals / Health Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Muscle building, past knee rehab"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {selectedPlan && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-300 font-semibold">{selectedPlan.name}</p>
                <p className="text-[11px] text-slate-400">{selectedPlan.duration_days} Days Full VIP Club Access</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-400 font-display">₹{selectedPlan.price.toLocaleString()}</span>
              </div>
            </div>
          )}

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
              <UserPlus className="w-4 h-4" />
              {loading ? 'Registering...' : 'Enroll & Activate Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
