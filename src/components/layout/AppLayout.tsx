import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useAuth } from '../../context/AuthContext';
import { QuickCheckInModal } from '../ui/QuickCheckInModal';
import { AddMemberModal } from '../ui/AddMemberModal';
import { RecordPaymentModal } from '../ui/RecordPaymentModal';

export const AppLayout: React.FC = () => {
  const {
    isQuickCheckInOpen,
    setQuickCheckInOpen,
    isAddMemberOpen,
    setAddMemberOpen,
    isRecordPaymentOpen,
    setRecordPaymentOpen,
    selectedMemberForAction,
    setSelectedMemberForAction,
  } = useAuth();

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
          // Trigger global revalidation
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
