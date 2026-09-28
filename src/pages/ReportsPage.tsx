import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  CreditCard,
  CalendarCheck,
  Award,
  RefreshCw,
  PieChart as PieIcon,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { formatCurrency } from '../lib/utils';

export const ReportsPage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any | null>(null);
  const [attendanceData, setAttendanceData] = useState<any | null>(null);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadReports = async () => {
    try {
      setLoading(true);
      const [rev, att, dash] = await Promise.all([
        api.getRevenueReport(),
        api.getAttendanceReport(),
        api.getDashboard(),
      ]);
      setRevenueData(rev);
      setAttendanceData(att);
      setDashboardData(dash);
    } catch (err: any) {
      toast.error('Failed to load analytical reports', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Total Revenue,${revenueData?.total_revenue || 0}\n` +
      `Total Transactions,${revenueData?.transactions_count || 0}\n` +
      `Average Transaction,${revenueData?.average_transaction_value || 0}\n` +
      `Total Checkins,${attendanceData?.total_checkins || 0}\n` +
      `Peak Hour,${attendanceData?.peak_hour || '7:00 PM'}\n` +
      `Busiest Day,${attendanceData?.busiest_day || 'Monday'}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apexfit-executive-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report Exported', 'CSV summary downloaded.');
  };

  const COLORS = ['#10B981', '#38BDF8', '#F59E0B', '#8B5CF6'];

  const methodBreakdownChart = revenueData?.method_breakdown
    ? Object.entries(revenueData.method_breakdown).map(([name, value]) => ({
        name: name.toUpperCase(),
        value: Number(value),
      }))
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Reports & Business Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Audit Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Revenue breakdowns, peak floor traffic analysis and member retention metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white font-bold text-xs tracking-wide transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Collections</span>
          <div className="text-2xl font-black text-white font-display mt-2">
            {formatCurrency(revenueData?.total_revenue || 0)}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">{revenueData?.transactions_count || 0} Invoices Settled</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg. Transaction Size</span>
          <div className="text-2xl font-black text-amber-400 font-display mt-2">
            {formatCurrency(revenueData?.average_transaction_value || 0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">High average member yield</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Recorded Check-ins</span>
          <div className="text-2xl font-black text-cyan-400 font-display mt-2">
            {attendanceData?.total_checkins || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg Session: {attendanceData?.avg_duration_minutes || 72} mins</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Peak Congestion Time</span>
          <div className="text-2xl font-black text-emerald-400 font-display mt-2">
            {attendanceData?.peak_hour || '07:00 PM'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Busiest Day: {attendanceData?.busiest_day || 'Monday'}</p>
        </div>
      </div>

      {/* Deep Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Channel Share Donut */}
        <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-white font-display">Payment Channel Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">UPI, Card, Cash & Bank Wire splits</p>
            </div>
            <PieIcon className="w-5 h-5 text-amber-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodBreakdownChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {methodBreakdownChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            {methodBreakdownChart.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="font-semibold">{entry.name}:</span>
                <span className="font-bold text-white">₹{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Tier Distribution */}
        <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-white font-display">Membership Plan Enrollments</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active subscribers per membership tier</p>
            </div>
            <Award className="w-5 h-5 text-amber-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData?.charts?.plan_distribution || []}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`${val} active members`, 'Subscribers']}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
