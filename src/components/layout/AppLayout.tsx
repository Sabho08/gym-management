import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useAuth } from '../../context/AuthContext';
import { LoginPage } from '../../pages/LoginPage';
import { QuickCheckInModal } from '../ui/QuickCheckInModal';
import { AddMemberModal } from '../ui/AddMemberModal';
import { RecordPaymentModal } from '../ui/RecordPaymentModal';
import { Dumbbell, Shield } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const {
    user,
    loading,
    settings,
    isQuickCheckInOpen,
    setQuickCheckInOpen,
    isAddMemberOpen,
    setAddMemberOpen,
    isRecordPaymentOpen,
    setRecordPaymentOpen,
    selectedMemberForAction,
    setSelectedMemberForAction,
  } = useAuth();

  // 1. Full-screen luxury loading splash
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-4 animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-2xl shadow-amber-500/30 gold-pulse-glow">
              <Dumbbell className="w-8 h-8 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#07090E] animate-ping" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-wider text-white font-display">
              {settings?.gym_name || 'APEXFIT LUXURY PERFORMANCE'}
            </h2>
            <p className="text-xs text-amber-400/90 font-medium tracking-widest uppercase flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Securing Supabase Auth Session
            </p>
          </div>

          <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/10 mt-2">
            <div className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Guard -> Render luxury login page
  if (!user) {
    return <LoginPage />;
  }

  // 3. Authenticated App Layout
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex pb-20 md:pb-0">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <MobileNav />

      {/* Global Quick Modals */}
      <QuickCheckInModal
        isOpen={isQuickCheckInOpen}
        onClose={() => setQuickCheckInOpen(false)}
        onSuccess={() => {
          // Revalidation triggers
        }}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setAddMemberOpen(false)}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => {
          setRecordPaymentOpen(false);
          setSelectedMemberForAction(null);
        }}
        defaultMemberId={selectedMemberForAction}
      />
    </div>
  );
};
