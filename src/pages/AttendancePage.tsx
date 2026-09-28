import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { AttendanceRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  CalendarCheck,
  Zap,
  Search,
  Clock,
  UserCheck,
  Calendar,
  LogOut,
  RefreshCw,
  Users
} from 'lucide-react';
import { formatDate, formatTime } from '../lib/utils';
import { InitialsAvatar } from '../components/ui/InitialsAvatar';
import confetti from 'canvas-confetti';

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickInput, setQuickInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const { setQuickCheckInOpen } = useAuth();
  const toast = useToast();

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const targetDate = activeTab === 'today' ? new Date().toISOString().split('T')[0] : selectedDate;
      const res = await api.getAttendance({ date: targetDate });
      setRecords(res);
    } catch (err: any) {
      toast.error('Failed to load attendance', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [activeTab, selectedDate]);

  const handleQuickCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    try {
      const res = await api.markCheckIn({ member_id_or_code: quickInput.trim() });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981'],
      });
      toast.success('Access Granted', res.message);
      setQuickInput('');
      loadAttendance();
    } catch (err: any) {
      toast.error('Check-in Failed', err.message);
    }
  };

  const handleCheckOut = async (recordId: string) => {
    try {
      await api.markCheckOut({ attendance_id: recordId });
      toast.success('Check-out Recorded', 'Session time logged.');
      loadAttendance();
    } catch (err: any) {
      toast.error('Check-out Failed', err.message);
    }
  };

  const currentlyInCount = records.filter((r) => !r.check_out).length;
  const filteredRecords = records.filter(
    (r) =>
      r.member_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.member_code.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Live Attendance & Access Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {currentlyInCount} Currently On Floor
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime front-gate check-ins, barcode badge verification & session tracking.
          </p>
        </div>

        <button
          onClick={() => setQuickCheckInOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Instant Scanner</span>
        </button>
      </div>

      {/* Fast Check-in Bar */}
      <div className="animate-card-in stagger-1 luxury-card p-5 rounded-3xl bg-[#0B0F17]/90 border border-amber-500/30 shadow-2xl">
        <form onSubmit={handleQuickCheckIn} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="text"
              placeholder="Enter Member Code (e.g. APX-1001) or Member Name to Check-in..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-2xl text-white text-sm outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Mark In</span>
          </button>
        </form>
      </div>

      {/* Tabs & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'today'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Today's Live Roster ({records.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Attendance Archive</span>
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-400"
            />
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-[#0B0F17]/90 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
            Syncing attendance telemetry...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <p className="font-semibold text-white">No check-ins logged for this date.</p>
            <p className="text-xs text-slate-500 mt-1">Use the quick check-in bar above or scan member badge.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-5 font-semibold">Member</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Check In</th>
                  <th className="py-3.5 px-4 font-semibold">Check Out</th>
                  <th className="py-3.5 px-4 font-semibold">Status / Duration</th>
                  <th className="py-3.5 px-4 font-semibold">Marked By</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={record.member_name} size="sm" />
                        <div>
                          <span className="font-bold text-white block">{record.member_name}</span>
                          <span className="text-[10px] font-mono text-amber-400">{record.member_code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{formatDate(record.attendance_date)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{formatTime(record.check_in)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{record.check_out ? formatTime(record.check_out) : '—'}</td>
                    <td className="py-3.5 px-4">
                      {record.check_out ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">
                          Completed Session
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          In Gym Now
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{record.marked_by}</td>
                    <td className="py-3.5 px-5 text-right">
                      {!record.check_out ? (
                        <button
                          onClick={() => handleCheckOut(record.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Check Out
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs">Logged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
