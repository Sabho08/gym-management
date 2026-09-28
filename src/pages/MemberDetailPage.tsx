import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Award,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Activity,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  User,
  Zap,
  RefreshCw,
  Plus,
  Receipt,
  Clock,
  Trash2,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatDate, formatTime } from '../lib/utils';
import { RenewMembershipModal } from '../components/ui/RenewMembershipModal';
import { ReceiptModal } from '../components/ui/ReceiptModal';
import { AddMeasurementModal } from '../components/ui/AddMeasurementModal';
import { CreateWorkoutPlanModal } from '../components/ui/CreateWorkoutPlanModal';
import { InitialsAvatar } from '../components/ui/InitialsAvatar';

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setRecordPaymentOpen, setSelectedMemberForAction } = useAuth();
  const toast = useToast();

  const [member, setMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'membership' | 'payments' | 'attendance' | 'workouts' | 'progress'>('overview');

  const [isRenewOpen, setRenewOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [isMeasurementOpen, setMeasurementOpen] = useState(false);
  const [isWorkoutPlanOpen, setWorkoutPlanOpen] = useState(false);

  const loadMemberData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.getMemberById(id);
      setMember(res);
    } catch (err: any) {
      toast.error('Failed to load member profile', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberData();
  }, [id]);

  const handleQuickCheckIn = async () => {
    if (!member) return;
    try {
      await api.markCheckIn({ member_id_or_code: member.id });
      toast.success('Access Granted', `${member.full_name} is checked into the gym.`);
      loadMemberData();
    } catch (err: any) {
      toast.error('Check-in Failed', err.message);
    }
  };

  if (loading && !member) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm font-semibold">Loading Member Dossier...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-lg font-bold text-white">Member Not Found</p>
        <button
          onClick={() => navigate('/members')}
          className="mt-4 px-4 py-2 bg-slate-800 text-amber-400 rounded-xl text-xs font-semibold"
        >
          Back to Members
        </button>
      </div>
    );
  }

  const measurementsChartData = (member.measurements || []).map((m: any) => ({
    date: formatDate(m.measured_at),
    weight: m.weight,
    body_fat: m.body_fat_percentage || 0,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button & Title Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/members')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members Directory
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleQuickCheckIn}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            Check In
          </button>
          <button
            onClick={() => {
              setSelectedMemberForAction(member.id);
              setRecordPaymentOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            Pay Dues
          </button>
        </div>
      </div>

      {/* Member Hero Dossier Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <InitialsAvatar name={member.full_name} size="xl" />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black text-white font-display">{member.full_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {member.status}
              </span>
            </div>

            <p className="text-xs font-mono font-bold text-amber-400">
              MEMBER ID: {member.member_code} • ENROLLED {formatDate(member.joining_date)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> {member.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> {member.email || 'No email provided'}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Dumbbell className="w-3.5 h-3.5 text-amber-400" /> Coach: {member.assigned_trainer_name || 'Unassigned'}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> {member.address || 'Mumbai, MH'}
              </div>
            </div>
          </div>
        </div>

        {/* Virtual VIP Pass */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="font-extrabold text-xs tracking-widest uppercase text-amber-400 font-display">
                APEXFIT VIP PASS
              </span>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 rounded">
              BLACK TIER
            </span>
          </div>

          <div className="my-4">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Plan</p>
            <h3 className="text-base font-black text-white font-display">
              {member.current_membership?.plan_name || 'No Active Membership'}
            </h3>
            {member.current_membership && (
              <p className="text-xs text-emerald-400 mt-0.5 font-medium">
                Valid until {formatDate(member.current_membership.end_date)}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="font-mono text-xs font-bold text-slate-400 tracking-widest">
              ||||| | |||| || ||| | {member.member_code}
            </div>
            {member.current_membership && (
              <button
                onClick={() => setRenewOpen(true)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Renew Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Personal & Emergency', icon: User },
          { id: 'membership', label: 'Membership & Plans', icon: Award },
          { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
          { id: 'attendance', label: 'Attendance Logs', icon: CalendarCheck },
          { id: 'workouts', label: 'Workout Regimen', icon: Dumbbell },
          { id: 'progress', label: 'Body Metrics & Progress', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-extrabold text-white font-display flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              Demographic & Health Profile
            </h3>
            <div className="divide-y divide-white/[0.06] text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Gender:</span>
                <span className="font-semibold text-white capitalize">{member.gender || 'Not specified'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Date of Birth:</span>
                <span className="font-semibold text-white">{formatDate(member.date_of_birth)}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Assigned Coach:</span>
                <span className="font-semibold text-amber-300">{member.assigned_trainer_name || 'None'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Fitness Notes:</span>
                <span className="font-medium text-slate-300 max-w-xs text-right">{member.notes || 'No specific limitations logged.'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-extrabold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Emergency Contact Information
            </h3>
            <div className="divide-y divide-white/[0.06] text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Contact Person:</span>
                <span className="font-semibold text-white">{member.emergency_contact_name || 'Not provided'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Emergency Phone:</span>
                <span className="font-semibold text-amber-300">{member.emergency_contact_phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'membership' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white font-display">Current Active Subscription</h3>
              <p className="text-xs text-slate-400">Membership tier and validity dates</p>
            </div>
            {member.current_membership && (
              <button
                onClick={() => setRenewOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Renew / Extend Plan
              </button>
            )}
          </div>

          <div className="overflow-x-auto bg-[#0B0F17]/90 border border-white/[0.08] rounded-3xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-5 font-semibold">Plan Name</th>
                  <th className="py-3.5 px-4 font-semibold">Start Date</th>
                  <th className="py-3.5 px-4 font-semibold">End Date</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Final Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {member.all_memberships?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">No subscriptions on record.</td>
                  </tr>
                ) : (
                  member.all_memberships?.map((ms: any) => (
                    <tr key={ms.id}>
                      <td className="py-3.5 px-5 font-bold text-white">{ms.plan_name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{formatDate(ms.start_date)}</td>
                      <td className="py-3.5 px-4 text-slate-300">{formatDate(ms.end_date)}</td>
                      <td className="py-3.5 px-4 text-slate-400">{formatCurrency(ms.price)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(ms.final_amount)}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {ms.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white font-display">All Invoices & Transactions</h3>
            <button
              onClick={() => {
                setSelectedMemberForAction(member.id);
                setRecordPaymentOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Record Payment
            </button>
          </div>

          <div className="overflow-x-auto bg-[#0B0F17]/90 border border-white/[0.08] rounded-3xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-5 font-semibold">Txn Reference</th>
                  <th className="py-3.5 px-4 font-semibold">Description</th>
                  <th className="py-3.5 px-4 font-semibold">Method</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {member.payments?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">No payment records found.</td>
                  </tr>
                ) : (
                  member.payments?.map((pay: any) => (
                    <tr key={pay.id}>
                      <td className="py-3.5 px-5 font-mono text-amber-400 font-bold">{pay.transaction_reference}</td>
                      <td className="py-3.5 px-4 text-white">{pay.notes || pay.plan_name || 'Membership Payment'}</td>
                      <td className="py-3.5 px-4 uppercase text-slate-300">{pay.payment_method}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(pay.amount)}</td>
                      <td className="py-3.5 px-4 text-slate-400">{formatDate(pay.payment_date)}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => setSelectedReceiptId(pay.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
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
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white font-display">Check-in Attendance History</h3>
            <button
              onClick={handleQuickCheckIn}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Quick Check In
            </button>
          </div>

          <div className="overflow-x-auto bg-[#0B0F17]/90 border border-white/[0.08] rounded-3xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-5 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Check In</th>
                  <th className="py-3.5 px-4 font-semibold">Check Out</th>
                  <th className="py-3.5 px-4 font-semibold">Marked By</th>
                  <th className="py-3.5 px-5 font-semibold">Session Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {member.attendance?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">No attendance records logged yet.</td>
                  </tr>
                ) : (
                  member.attendance?.map((att: any) => (
                    <tr key={att.id}>
                      <td className="py-3.5 px-5 font-bold text-white">{formatDate(att.attendance_date)}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">{formatTime(att.check_in)}</td>
                      <td className="py-3.5 px-4 text-slate-400">{att.check_out ? formatTime(att.check_out) : 'In Session'}</td>
                      <td className="py-3.5 px-4 text-slate-400">{att.marked_by}</td>
                      <td className="py-3.5 px-5 text-slate-300">{att.notes || 'Routine workout'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white font-display">Assigned Workout Routines</h3>
              <p className="text-xs text-slate-400">Structured training splits & exercise prescriptions</p>
            </div>
            <button
              onClick={() => setWorkoutPlanOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Assign New Split
            </button>
          </div>

          <div className="space-y-4">
            {member.workoutPlans?.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 bg-[#0B0F17]/90 rounded-3xl border border-white/[0.08]">
                No custom workout plan currently assigned. Click "Assign New Split" to prescribe a routine.
              </div>
            ) : (
              member.workoutPlans?.map((plan: any) => (
                <div key={plan.id} className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white font-display">{plan.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {plan.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-white/[0.05] border-t border-white/10 pt-2">
                    {plan.exercises?.map((ex: any) => (
                      <div key={ex.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{ex.exercise_name}</span>
                          <span className="text-[11px] text-slate-400 block">{ex.day_name} • {ex.muscle_group}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-amber-300 font-bold">{ex.sets} sets × {ex.reps}</span>
                          <span className="text-[11px] text-slate-400 block">Target: {ex.weight} (Rest: {ex.rest_seconds}s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white font-display">Body Composition Progression</h3>
              <p className="text-xs text-slate-400">Weight, body fat percentage and circumference logs</p>
            </div>
            <button
              onClick={() => setMeasurementOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Log Assessment
            </button>
          </div>

          {measurementsChartData.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
                Weight (kg) & Body Fat (%) Progression
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={measurementsChartData}>
                    <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="weight" stroke="#F59E0B" strokeWidth={3} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="body_fat" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="overflow-x-auto bg-[#0B0F17]/90 border border-white/[0.08] rounded-3xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-5 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Weight</th>
                  <th className="py-3.5 px-4 font-semibold">Body Fat</th>
                  <th className="py-3.5 px-4 font-semibold">Chest</th>
                  <th className="py-3.5 px-4 font-semibold">Waist</th>
                  <th className="py-3.5 px-4 font-semibold">Arms</th>
                  <th className="py-3.5 px-5 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {member.measurements?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">No measurements logged yet.</td>
                  </tr>
                ) : (
                  member.measurements?.map((m: any) => (
                    <tr key={m.id}>
                      <td className="py-3.5 px-5 font-bold text-white">{formatDate(m.measured_at)}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-300">{m.weight} kg</td>
                      <td className="py-3.5 px-4 text-emerald-400">{m.body_fat_percentage ? `${m.body_fat_percentage}%` : '—'}</td>
                      <td className="py-3.5 px-4 text-slate-300">{m.chest ? `${m.chest}"` : '—'}</td>
                      <td className="py-3.5 px-4 text-slate-300">{m.waist ? `${m.waist}"` : '—'}</td>
                      <td className="py-3.5 px-4 text-slate-300">{m.arms ? `${m.arms}"` : '—'}</td>
                      <td className="py-3.5 px-5 text-slate-400">{m.notes || 'Assessment log'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RenewMembershipModal
        isOpen={isRenewOpen}
        onClose={() => setRenewOpen(false)}
        membership={member.current_membership}
        onSuccess={() => loadMemberData()}
      />

      <ReceiptModal
        isOpen={Boolean(selectedReceiptId)}
        onClose={() => setSelectedReceiptId(null)}
        paymentId={selectedReceiptId}
      />

      <AddMeasurementModal
        isOpen={isMeasurementOpen}
        onClose={() => setMeasurementOpen(false)}
        memberId={member.id}
        onSuccess={() => loadMemberData()}
      />

      <CreateWorkoutPlanModal
        isOpen={isWorkoutPlanOpen}
        onClose={() => setWorkoutPlanOpen(false)}
        defaultMemberId={member.id}
        onSuccess={() => loadMemberData()}
      />
    </div>
  );
};
