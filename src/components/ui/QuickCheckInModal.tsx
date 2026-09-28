import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Zap, X, Search, CheckCircle2, User, Phone, Award, Clock } from 'lucide-react';
import { InitialsAvatar } from './InitialsAvatar';
import confetti from 'canvas-confetti';

interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentCheckedMember, setRecentCheckedMember] = useState<any | null>(null);
  const toast = useToast();

  if (!isOpen) return null;

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warning('Input Required', 'Please enter a member code, name, or phone number.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.markCheckIn({ member_id_or_code: query.trim() });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#FFFFFF']
      });

      setRecentCheckedMember(res.data);
      toast.success('Access Granted', res.message);
      setQuery('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Check-in Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-modal-backdrop">
      <div className="animate-modal-card relative w-full max-w-lg bg-[#0F172A] border border-amber-500/30 rounded-3xl shadow-2xl p-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white font-display">Instant Access Desk</h3>
              <p className="text-xs text-slate-400">Scan badge or enter member code</p>
            </div>
          </div>
          <button
            onClick={() => {
              setRecentCheckedMember(null);
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCheckIn} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Member ID / Code / Phone / Name
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. APX-1001 or Aarav..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl text-white placeholder-slate-500 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-current" />
            {loading ? 'Validating Entry...' : 'Grant Access & Check-in'}
          </button>
        </form>

        {recentCheckedMember && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5">
              <InitialsAvatar name={recentCheckedMember.member_name} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{recentCheckedMember.member_name}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                    {recentCheckedMember.member_code}
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Checked in at {recentCheckedMember.check_in}
                </p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
