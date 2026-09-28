import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Award,
  Dumbbell,
  BarChart3,
  Settings,
  Flame,
  Menu,
  X,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNav: React.FC = () => {
  const { user, switchRole, setQuickCheckInOpen } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/members', label: 'Members', icon: Users, roleCheck: () => user?.role !== 'member' },
    { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  ].filter(tab => !tab.roleCheck || tab.roleCheck());

  const allLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'receptionist', 'trainer', 'member'] },
    { to: '/members', label: 'Members Directory', icon: Users, roles: ['admin', 'receptionist', 'trainer'] },
    { to: '/memberships', label: 'Memberships & Plans', icon: Award, roles: ['admin', 'receptionist'] },
    { to: '/attendance', label: 'Attendance Desk', icon: CalendarCheck, roles: ['admin', 'receptionist', 'trainer'] },
    { to: '/payments', label: 'Payments & Revenue', icon: CreditCard, roles: ['admin', 'receptionist'] },
    { to: '/trainers', label: 'Coaches & Trainers', icon: Flame, roles: ['admin', 'receptionist', 'trainer'] },
    { to: '/workouts', label: 'Workouts & Exercises', icon: Dumbbell, roles: ['admin', 'receptionist', 'trainer', 'member'] },
    { to: '/reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['admin'] },
    { to: '/settings', label: 'Club Settings', icon: Settings, roles: ['admin'] },
  ];

  const visibleLinks = allLinks.filter(item => !user || item.roles.includes(user.role));

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E17]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around shadow-2xl safe-bottom">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}

        {/* Quick Check-in Center FAB */}
        <button
          onClick={() => setQuickCheckInOpen(true)}
          className="flex flex-col items-center justify-center -mt-5 p-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>

        {/* More Drawer Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
            drawerOpen ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </nav>

      {/* Slide-over Drawer Modal for Mobile Navigation */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative bg-[#0D121F] border-t border-amber-500/20 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-sm tracking-wider uppercase text-white font-display">
                  Club Navigation
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-5">
              {visibleLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                          : 'bg-slate-800/60 border border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Switch Role on Mobile */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Switch Persona
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['admin', 'receptionist', 'trainer', 'member'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setDrawerOpen(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      user?.role === r
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
