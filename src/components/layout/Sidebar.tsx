import React from 'react';
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
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'receptionist', 'trainer', 'member'] },
    { to: '/members', label: 'Members', icon: Users, roles: ['admin', 'receptionist', 'trainer'] },
    { to: '/memberships', label: 'Memberships & Plans', icon: Award, roles: ['admin', 'receptionist'] },
    { to: '/attendance', label: 'Attendance Desk', icon: CalendarCheck, roles: ['admin', 'receptionist', 'trainer'] },
    { to: '/payments', label: 'Payments & Revenue', icon: CreditCard, roles: ['admin', 'receptionist'] },
    { to: '/trainers', label: 'Coaches & Trainers', icon: Flame, roles: ['admin', 'receptionist', 'trainer'] },
    { to: '/workouts', label: 'Workouts & Exercises', icon: Dumbbell, roles: ['admin', 'receptionist', 'trainer', 'member'] },
    { to: '/reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['admin'] },
    { to: '/settings', label: 'Club Settings', icon: Settings, roles: ['admin'] },
  ];

  // Filter based on user's role if restricted
  const visibleItems = navItems.filter(item => !user || item.roles.includes(user.role));

  return (
    <aside className="hidden md:flex w-64 bg-[#080B11] border-r border-white/[0.08] flex-col justify-between p-4 min-h-[calc(100vh-5rem)]">
      <div>
        {/* Section title */}
        <div className="px-3 mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Club Operations
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-xs tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-l-4 border-amber-400 text-amber-300 shadow-md font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
