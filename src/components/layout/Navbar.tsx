import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dumbbell,
  LogOut,
  Settings,
  User,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../../types';
import { InitialsAvatar } from '../ui/InitialsAvatar';

export const Navbar: React.FC = () => {
  const { user, settings, signOut, switchRole, setQuickCheckInOpen, setAddMemberOpen, setRecordPaymentOpen } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'admin', title: 'Admin / Owner', desc: 'Full club authority & finances' },
    { role: 'receptionist', title: 'Front Desk / Reception', desc: 'Check-ins, billing & admissions' },
    { role: 'trainer', title: 'Master Trainer / Coach', desc: 'Workouts, clients & progress' },
    { role: 'member', title: 'VIP Club Member', desc: 'Personal metrics & card' },
  ];

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-20 bg-[#0A0E17]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between transition-all">
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

      {/* Center / Right: Quick Actions & User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3">
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

        {/* User Profile & Auth Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer group"
          >
            <InitialsAvatar name={user?.full_name || 'Admin'} size="sm" />
            
            <div className="hidden sm:block text-left pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {user?.full_name || 'Guest User'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                {user?.role || 'Admin'}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 transition-transform duration-200" />
          </button>

          {/* Luxury Profile Popover Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0F172A] border border-slate-700 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-amber-500/20">
              {/* Profile Card Header */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/[0.06] mb-2 space-y-2">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={user?.full_name || 'Admin'} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Admin'}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email || 'admin@apexfit.club'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px]">
                  <span className="text-slate-400">Auth Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Supabase Verified
                  </span>
                </div>
              </div>

              {/* Persona Switcher Section */}
              <div className="space-y-1 py-1">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Switch Role View
                  </span>
                  <span className="text-[9px] text-amber-400/80 font-normal">Active: {user?.role}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {roles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setShowProfileMenu(false);
                      }}
                      className={`p-2 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                        user?.role === item.role
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
                          : 'bg-slate-900/40 hover:bg-slate-800 text-slate-300 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="capitalize">{item.role}</div>
                      <div className="text-[9px] text-slate-400 truncate">{item.title.split('/')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Divider */}
              <div className="pt-2 mt-2 border-t border-slate-800 space-y-1">
                {user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Club Settings</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Supabase</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
