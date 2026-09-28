import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Users,
  CreditCard,
  CalendarCheck,
  Award,
  Zap,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Receipt,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Activity,
  Flame
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, formatDate, formatTime } from '../lib/utils';
import { RenewMembershipModal } from '../components/ui/RenewMembershipModal';
import { ReceiptModal } from '../components/ui/ReceiptModal';
import { InitialsAvatar } from '../components/ui/InitialsAvatar';
import { Membership } from '../types';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMembershipForRenew, setSelectedMembershipForRenew] = useState<Membership | null>(null);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<string | null>(null);
  const { setQuickCheckInOpen, setAddMemberOpen, setRecordPaymentOpen, settings } = useAuth();
  const toast = useToast();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (err: any) {
      toast.error('Dashboard Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCheckout = async (recordId: string) => {
    try {
      await api.markCheckOut({ attendance_id: recordId });
      toast.success('Member Checked Out', 'Session duration saved.');
      loadDashboardData();
    } catch (err: any) {
      toast.error('Checkout failed', err.message);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm font-semibold tracking-wide">Syncing Club Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Hero Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Executive Club Overview
            </h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime performance metrics, capacity utilization & revenue intelligence.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadDashboardData()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setQuickCheckInOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Fast Check-in</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <div className="animate-card-in stagger-1 luxury-card p-5 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/[0.08] relative overflow-hidden group hover:border-amber-500/40 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Members</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white font-display tracking-tight">
              {data?.stats.total_members || 0}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {data?.stats.active_members || 0} Active
              </span>
              <span className="text-xs text-slate-400 font-medium">Club Enrolled</span>
            </div>
          </div>
        </div>

        <div className="animate-card-in stagger-2 luxury-card p-5 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/[0.08] relative overflow-hidden group hover:border-emerald-500/40 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white font-display tracking-tight">
              {formatCurrency(data?.stats.today_revenue || 0)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-emerald-400 font-bold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> Total ₹{((data?.stats.total_revenue || 0) / 1000).toFixed(0)}k
              </span>
              <span className="text-xs text-slate-400 font-medium">collections</span>
            </div>
          </div>
        </div>

        <div className="animate-card-in stagger-3 luxury-card p-5 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/[0.08] relative overflow-hidden group hover:border-cyan-500/40 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Attendance</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white font-display tracking-tight">
              {data?.stats.today_attendance || 0}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Floor Load
              </span>
              <span className="text-xs text-slate-400 font-medium">Live check-ins</span>
            </div>
          </div>
        </div>

        <div className="animate-card-in stagger-4 luxury-card p-5 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/[0.08] relative overflow-hidden group hover:border-rose-500/40 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiring (&lt;7d)</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white font-display tracking-tight">
              {data?.stats.expiring_members_count || 0}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-rose-400 font-bold">Renewal Desk</span>
              <span className="text-xs text-slate-400 font-medium">1-click renewals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="animate-card-in stagger-5 lg:col-span-2 p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl hover:border-amber-500/20 transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-white font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Revenue Trajectory (Past 7 Days)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">UPI, Card & Counter collections breakdown</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Total
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> UPI
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts.revenue_7_days || []}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUpi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="total" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="upi" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorUpi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="animate-card-in stagger-6 p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl hover:border-cyan-500/20 transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-white font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Hourly Gym Rush
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Peak traffic distribution</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts.attendance_hourly || []}>
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`${val} check-ins`, 'Capacity']}
                />
                <Bar dataKey="checkIns" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two-Column Deep Feed: Expiring Soon Alert + Live Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Memberships Desk */}
        <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white font-display">Expiring Memberships</h3>
                  <p className="text-[11px] text-slate-400">Members due for renewal in next 7 days</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {data?.expiring_soon?.length || 0} Alerts
              </span>
            </div>

            <div className="divide-y divide-white/[0.06] mt-2">
              {data?.expiring_soon?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No memberships expiring in the next 7 days.
                </div>
              ) : (
                data?.expiring_soon?.map((ms: Membership) => (
                  <div key={ms.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={ms.member_name || 'Member'} size="sm" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{ms.member_name}</h4>
                        <p className="text-[11px] text-slate-400">
                          {ms.plan_name} • Expires {formatDate(ms.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        {ms.days_left}d left
                      </span>
                      <button
                        onClick={() => setSelectedMembershipForRenew(ms)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
                      >
                        Renew
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Today's Attendance Desk */}
        <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white font-display">Live Floor Attendance</h3>
                  <p className="text-[11px] text-slate-400">Recent check-in stream</p>
                </div>
              </div>
              <button
                onClick={() => setQuickCheckInOpen(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
              >
                + Check-in
              </button>
            </div>

            <div className="divide-y divide-white/[0.06] mt-2">
              {data?.recent_attendance?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No attendance records logged today yet.
                </div>
              ) : (
                data?.recent_attendance?.slice(0, 5).map((att: any) => (
                  <div key={att.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={att.member_name} size="sm" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{att.member_name}</h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" /> In: {formatTime(att.check_in)}
                        </p>
                      </div>
                    </div>

                    <div>
                      {att.check_out ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-slate-400">
                          Out {formatTime(att.check_out)}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCheckout(att.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Check Out
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments Ledger Row */}
      <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-extrabold text-white font-display">Recent Financial Receipts</h3>
              <p className="text-xs text-slate-400">Latest transactions with instant tax receipts</p>
            </div>
          </div>
          <button
            onClick={() => setRecordPaymentOpen(true)}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
          >
            + Record Payment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Member</th>
                <th className="pb-3 font-semibold">Plan / Description</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {data?.recent_payments?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                data?.recent_payments?.map((pay: any) => (
                  <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-bold text-white">
                      {pay.member_name}
                      <span className="block text-[10px] text-slate-400 font-normal">{pay.member_code}</span>
                    </td>
                    <td className="py-3 text-slate-300">{pay.plan_name || 'Membership Dues'}</td>
                    <td className="py-3 capitalize text-slate-300">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] uppercase font-bold">
                        {pay.payment_method}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-emerald-400">{formatCurrency(pay.amount)}</td>
                    <td className="py-3 text-slate-400">{formatDate(pay.payment_date)}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedPaymentForReceipt(pay.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
                        title="View Official Receipt"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RenewMembershipModal
        isOpen={Boolean(selectedMembershipForRenew)}
        onClose={() => setSelectedMembershipForRenew(null)}
        membership={selectedMembershipForRenew}
        onSuccess={() => loadDashboardData()}
      />

      <ReceiptModal
        isOpen={Boolean(selectedPaymentForReceipt)}
        onClose={() => setSelectedPaymentForReceipt(null)}
        paymentId={selectedPaymentForReceipt}
      />
    </div>
  );
};
