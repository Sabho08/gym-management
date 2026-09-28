import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Zap,
  UserCheck,
  UserPlus,
  CreditCard,
  Bell,
  Sparkles,
  ChevronDown,
  Shield,
  Clock,
  Dumbbell
} from 'lucide-react';
import { UserRole } from '../../types';
import { InitialsAvatar } from '../ui/InitialsAvatar';

export const Navbar: React.FC = () => {
  const { user, settings, switchRole, setQuickCheckInOpen, setAddMemberOpen, setRecordPaymentOpen } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'admin', title: 'Admin / Owner', desc: 'Full club authority & finances' },
    { role: 'receptionist', title: 'Front Desk / Reception', desc: 'Check-ins, billing & admissions' },
    { role: 'trainer', title: 'Master Trainer / Coach', desc: 'Workouts, clients & progress' },
    { role: 'member', title: 'VIP Club Member', desc: 'Personal metrics & card' },
  ];

  return (
    <header className="sticky top-0 z-40 h-20 bg-[#0A0E17]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 flex items-center justify-between transition-all">
      {/* Left: Gym Branding & Quick Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
            <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white font-display">
                {settings?.gym_name || 'APEXFIT'}
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                ELITE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {settings?.tagline || 'Precision Training • Elite Wellness'}
            </p>
          </div>
        </div>
      </div>

      {/* Center / Right: Quick Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Quick Check-in Button */}
        <button
          onClick={() => setQuickCheckInOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span className="hidden md:inline">Quick Check-in</span>
        </button>

        {/* Add Member Button (Admin & Receptionist) */}
        {user?.role !== 'member' && (
          <button
            onClick={() => setAddMemberOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 hover:text-white font-semibold text-xs tracking-wide transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Add Member</span>
          </button>
        )}

        {/* Record Payment Button */}
        {user?.role !== 'member' && user?.role !== 'trainer' && (
          <button
            onClick={() => setRecordPaymentOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 hover:text-white font-semibold text-xs tracking-wide transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Record Payment</span>
          </button>
        )}

        {/* Role Persona Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Active Role</div>
              <div className="text-xs font-bold text-amber-300 capitalize">{user?.role || 'Admin'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Switch Persona
              </div>
              <div className="mt-1 space-y-1">
                {roles.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                      user?.role === item.role
                        ? 'bg-amber-500/15 border border-amber-500/30 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        user?.role === item.role ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.role[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Initials Avatar (No External Images) */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <InitialsAvatar name={user?.full_name || 'Admin'} size="sm" />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{user?.full_name || 'Admin'}</p>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
