import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Payment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  CreditCard,
  Search,
  Plus,
  Receipt,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Smartphone,
  Wallet
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { ReceiptModal } from '../components/ui/ReceiptModal';
import { RecordPaymentModal } from '../components/ui/RecordPaymentModal';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  const { isRecordPaymentOpen, setRecordPaymentOpen, selectedMemberForAction, setSelectedMemberForAction } = useAuth();
  const toast = useToast();

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.getPayments({ search, method: methodFilter });
      setPayments(res);
    } catch (err: any) {
      toast.error('Failed to load transactions', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      loadPayments();
    }, 200);
    return () => clearTimeout(t);
  }, [search, methodFilter]);

  const totalRevenue = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const upiTotal = payments
    .filter((p) => p.payment_method === 'upi' && p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const cardTotal = payments
    .filter((p) => p.payment_method === 'card' && p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const cashTotal = payments
    .filter((p) => p.payment_method === 'cash' && p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Payments & Financial Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {payments.length} Transactions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Revenue tracking, transaction audits, UPI settlement & automated GST receipts.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedMemberForAction(null);
            setRecordPaymentOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Payment</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-card-in stagger-1 luxury-card p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Collections</span>
          <div className="text-2xl font-black text-white font-display mt-2">{formatCurrency(totalRevenue)}</div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">100% verified settlement</p>
        </div>

        <div className="animate-card-in stagger-2 luxury-card p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">UPI / QR Collections</span>
          <div className="text-2xl font-black text-emerald-400 font-display mt-2">{formatCurrency(upiTotal)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Direct instant bank credit</p>
        </div>

        <div className="animate-card-in stagger-3 luxury-card p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Credit / Debit Cards</span>
          <div className="text-2xl font-black text-cyan-400 font-display mt-2">{formatCurrency(cardTotal)}</div>
          <p className="text-[11px] text-slate-400 mt-1">POS counter swipes</p>
        </div>

        <div className="animate-card-in stagger-4 luxury-card p-5 rounded-3xl bg-[#0B0F17]/90 border border-white/[0.08] shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cash Counter</span>
          <div className="text-2xl font-black text-amber-400 font-display mt-2">{formatCurrency(cashTotal)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Cash drawer reconciliations</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="animate-card-in stagger-5 flex flex-col md:flex-row items-center justify-between gap-3.5 bg-[#0B0F17]/90 p-4 rounded-2xl border border-white/[0.08] shadow-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by member, ref code or plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
          />
        </div>

        {/* Method Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {['all', 'upi', 'card', 'cash', 'bank_transfer'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                methodFilter === m
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#0B0F17]/90 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
            Loading financial ledger...
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No transactions found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-5 font-semibold">Txn Reference</th>
                  <th className="py-3.5 px-4 font-semibold">Member</th>
                  <th className="py-3.5 px-4 font-semibold">Plan / Service</th>
                  <th className="py-3.5 px-4 font-semibold">Channel</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Official Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-amber-400">
                      {p.transaction_reference}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.member_name}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">
                        {p.member_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {p.plan_name || p.notes || 'Gym Membership'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] uppercase font-bold text-slate-300">
                        {p.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(p.payment_date)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedReceiptId(p.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-semibold"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceiptId)}
        onClose={() => setSelectedReceiptId(null)}
        paymentId={selectedReceiptId}
      />
    </div>
  );
};
