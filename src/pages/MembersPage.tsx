import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Member } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  MoreVertical,
  Award,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { RenewMembershipModal } from '../components/ui/RenewMembershipModal';
import { InitialsAvatar } from '../components/ui/InitialsAvatar';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMembershipForRenew, setSelectedMembershipForRenew] = useState<any | null>(null);

  const { setAddMemberOpen, setRecordPaymentOpen, setSelectedMemberForAction } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await api.getMembers({ search, status: statusFilter });
      setMembers(res);
    } catch (err: any) {
      toast.error('Failed to load members', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      loadMembers();
    }, 200);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.toggleMemberStatus(id, newStatus);
      toast.success('Status Updated', `Member status changed to ${newStatus}.`);
      loadMembers();
    } catch (err: any) {
      toast.error('Status Update Failed', err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove member ${name}?`)) {
      try {
        await api.deleteMember(id);
        toast.success('Member Removed', `${name} has been archived.`);
        loadMembers();
      } catch (err: any) {
        toast.error('Delete Failed', err.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Club Members Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {members.length} Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, view profile dossiers, renewals and workout assignments.
          </p>
        </div>

        <button
          onClick={() => setAddMemberOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New Member</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="animate-card-in stagger-1 flex flex-col md:flex-row items-center justify-between gap-3.5 bg-[#0B0F17]/90 p-4 rounded-2xl border border-white/[0.08] shadow-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID code, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {['all', 'active', 'inactive', 'blocked'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="animate-card-in stagger-2 bg-[#0B0F17]/90 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
            Loading member directory...
          </div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <p className="font-semibold text-white">No members currently in database.</p>
            <p className="text-xs text-slate-500 mt-1">Click "+ Add New Member" above to create your first member.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-5 font-semibold">Member</th>
                  <th className="py-3.5 px-4 font-semibold">Contact</th>
                  <th className="py-3.5 px-4 font-semibold">Membership Plan</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Coach</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {members.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => navigate(`/members/${m.id}`)}
                  >
                    {/* Member Name + Initials Avatar + Code */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={m.full_name} size="md" />
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                            {m.full_name}
                          </div>
                          <span className="font-mono text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {m.member_code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{m.phone}</div>
                      <div className="text-[11px] text-slate-500">{m.email || '—'}</div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      {m.current_membership ? (
                        <div>
                          <span className="font-semibold text-white">
                            {m.current_membership.plan_name}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            Valid till {formatDate(m.current_membership.end_date)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No Active Plan</span>
                      )}
                    </td>

                    {/* Assigned Trainer */}
                    <td className="py-3.5 px-4">
                      {m.assigned_trainer_name ? (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
                          {m.assigned_trainer_name}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          m.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : m.status === 'blocked'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                        {m.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/members/${m.id}`)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {m.current_membership && (
                          <button
                            onClick={() => setSelectedMembershipForRenew(m.current_membership)}
                            className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-colors"
                            title="Renew Membership"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedMemberForAction(m.id);
                            setRecordPaymentOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-colors"
                          title="Record Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(m.id, m.status)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          title="Toggle Status"
                        >
                          {m.status === 'active' ? <XCircle className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.full_name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RenewMembershipModal
        isOpen={Boolean(selectedMembershipForRenew)}
        onClose={() => setSelectedMembershipForRenew(null)}
        membership={selectedMembershipForRenew}
        onSuccess={() => loadMembers()}
      />
    </div>
  );
};
