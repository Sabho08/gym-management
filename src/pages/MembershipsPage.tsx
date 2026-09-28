import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MembershipPlan, Membership } from '../types';
import { useToast } from '../context/ToastContext';
import {
  Award,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Tag,
  Calendar
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { AddPlanModal } from '../components/ui/AddPlanModal';
import { RenewMembershipModal } from '../components/ui/RenewMembershipModal';

export const MembershipsPage: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions'>('plans');

  const [isAddPlanOpen, setAddPlanOpen] = useState(false);
  const [selectedMembershipForRenew, setSelectedMembershipForRenew] = useState<Membership | null>(null);
  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, ms] = await Promise.all([api.getPlans(), api.getMemberships()]);
      setPlans(p);
      setMemberships(ms);
    } catch (err: any) {
      toast.error('Failed to load membership data', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Membership Architecture & Plans
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {plans.length} Tiers Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure club pricing tiers, track active subscriptions and process renewals.
          </p>
        </div>

        <button
          onClick={() => setAddPlanOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Membership Plan</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'plans'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Membership Plans & Pricing</span>
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Active Subscriptions ({memberships.filter((m) => m.status === 'active').length})</span>
        </button>
      </div>

      {/* 1. Plans Grid */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className={`animate-card-in stagger-${(idx % 6) + 1} luxury-card p-6 rounded-3xl bg-[#0B0F17]/90 border shadow-2xl flex flex-col justify-between relative group hover:border-amber-500/40 ${
                plan.is_popular
                  ? 'border-amber-500/40 ring-1 ring-amber-500/30 bg-gradient-to-b from-amber-950/20 to-[#0B0F17]'
                  : 'border-white/[0.08]'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white font-display group-hover:text-amber-300 transition-colors">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{plan.duration_days} Days Full Access</p>
                  </div>
                  <Award className="w-6 h-6 text-amber-400" />
                </div>

                <div className="my-5 pb-5 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-amber-400 font-display">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ cycle</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{plan.description}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Included Privileges:
                  </span>
                  {plan.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {(plan as any).active_members_count || 0} Members Enrolled
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 rounded">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Subscriptions Table */}
      {activeTab === 'subscriptions' && (
        <div className="bg-[#0B0F17]/90 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-5 font-semibold">Member</th>
                  <th className="py-3.5 px-4 font-semibold">Plan</th>
                  <th className="py-3.5 px-4 font-semibold">Start Date</th>
                  <th className="py-3.5 px-4 font-semibold">End Date</th>
                  <th className="py-3.5 px-4 font-semibold">Amount Paid</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {memberships.map((ms) => (
                  <tr key={ms.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-white block">{ms.member_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ms.member_code}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{ms.plan_name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(ms.start_date)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white">{formatDate(ms.end_date)}</span>
                      {ms.days_left !== undefined && ms.days_left <= 7 && ms.days_left >= 0 && (
                        <span className="block text-[10px] font-bold text-rose-400">
                          Expires in {ms.days_left}d
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(ms.final_amount)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          ms.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {ms.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedMembershipForRenew(ms)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
                      >
                        Renew
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Plan Modal */}
      <AddPlanModal
        isOpen={isAddPlanOpen}
        onClose={() => setAddPlanOpen(false)}
        onSuccess={() => loadData()}
      />

      {/* Renewal Modal */}
      <RenewMembershipModal
        isOpen={Boolean(selectedMembershipForRenew)}
        onClose={() => setSelectedMembershipForRenew(null)}
        membership={selectedMembershipForRenew}
        onSuccess={() => loadData()}
      />
    </div>
  );
};
