import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GymSettings } from '../types';
import {
  Settings,
  Dumbbell,
  Shield,
  Save,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Percent,
  Database,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useAuth();
  const [form, setForm] = useState<Partial<GymSettings>>({});
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateSettings(form);
      await refreshSettings();
      toast.success('Settings Updated', 'Club configuration saved successfully.');
    } catch (err: any) {
      toast.error('Failed to update settings', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (
      window.confirm(
        'Are you sure you want to clear all member records, check-ins, and payment logs from the database?'
      )
    ) {
      try {
        setClearing(true);
        await api.reseed(); // clears to clean state
        await refreshSettings();
        toast.success('Database Cleared', 'All records have been reset.');
      } catch (err: any) {
        toast.error('Clear Failed', err.message);
      } finally {
        setClearing(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Club Configuration & Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              System Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Brand parameters, billing defaults, club hours & backend synchronization.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Contact Profile */}
        <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <Dumbbell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white font-display">Club Branding & Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gym Name</label>
              <input
                type="text"
                value={form.gym_name || ''}
                onChange={(e) => setForm({ ...form, gym_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Physical Address / Headquarters</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Tax Defaults */}
        <div className="p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white font-display">Operating Hours & Tax Parameters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Opening Time</label>
              <input
                type="text"
                value={form.opening_time || '05:30 AM'}
                onChange={(e) => setForm({ ...form, opening_time: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Closing Time</label>
              <input
                type="text"
                value={form.closing_time || '11:00 PM'}
                onChange={(e) => setForm({ ...form, closing_time: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={form.currency_symbol || '₹'}
                onChange={(e) => setForm({ ...form, currency_symbol: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-bold text-amber-300 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">GST / Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.tax_rate || 18.0}
                onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </form>

      {/* Database State Management */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-rose-950/20 border border-white/[0.08] shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-extrabold text-white font-display">Database & Data Management</h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Clean live database state. You can wipe all test members and transactions to start with a fresh slate anytime.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleClear}
            disabled={clearing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold text-xs tracking-wide transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className={`w-4 h-4 ${clearing ? 'animate-spin' : ''}`} />
            <span>{clearing ? 'Wiping Data...' : 'Clear All Member Records'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
