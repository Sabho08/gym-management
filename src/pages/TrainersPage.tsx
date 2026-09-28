import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Trainer } from '../types';
import { useToast } from '../context/ToastContext';
import {
  Flame,
  Plus,
  Phone,
  Mail,
  Award,
  Users,
  Dumbbell,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { AddTrainerModal } from '../components/ui/AddTrainerModal';
import { InitialsAvatar } from '../components/ui/InitialsAvatar';

export const TrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddTrainerOpen, setAddTrainerOpen] = useState(false);
  const toast = useToast();

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res = await api.getTrainers();
      setTrainers(res);
    } catch (err: any) {
      toast.error('Failed to load coaches', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Master Coaches & Trainers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {trainers.length} Certified Staff
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Personal trainers, biomechanics specialists and client split assignments.
          </p>
        </div>

        <button
          onClick={() => setAddTrainerOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Performance Coach</span>
        </button>
      </div>

      {/* Trainers Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
          Loading coaching faculty...
        </div>
      ) : trainers.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <p className="font-semibold text-white">No trainers currently registered in database.</p>
          <p className="text-xs text-slate-500 mt-1">Click "+ Add Performance Coach" above to create coach profiles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((t, idx) => (
            <div
              key={t.id}
              className={`animate-card-in stagger-${(idx % 6) + 1} luxury-card p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl flex flex-col justify-between hover:border-amber-500/40 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <InitialsAvatar name={t.full_name} size="lg" />
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900 text-amber-400 border border-amber-500/30">
                    {t.experience_years} Yrs Exp
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-300 transition-colors">
                  {t.full_name}
                </h3>
                <p className="text-xs font-semibold text-amber-400/90 mt-0.5">{t.specialization}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{t.bio || 'Elite Strength & Conditioning Coach.'}</p>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.email || 'coach@apexfit.club'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Users className="w-4 h-4" />
                  <span>{t.assigned_members_count || 0} Clients</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Joined {formatDate(t.joining_date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Trainer Modal */}
      <AddTrainerModal
        isOpen={isAddTrainerOpen}
        onClose={() => setAddTrainerOpen(false)}
        onSuccess={() => loadTrainers()}
      />
    </div>
  );
};
