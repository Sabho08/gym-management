import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, GymSettings, UserRole } from '../types';
import { api } from '../lib/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: Profile | null;
  settings: GymSettings | null;
  loading: boolean;
  switchRole: (role: UserRole) => Promise<void>;
  refreshSettings: () => Promise<void>;
  isQuickCheckInOpen: boolean;
  setQuickCheckInOpen: (open: boolean) => void;
  isAddMemberOpen: boolean;
  setAddMemberOpen: (open: boolean) => void;
  isRecordPaymentOpen: boolean;
  setRecordPaymentOpen: (open: boolean) => void;
  selectedMemberForAction: string | null;
  setSelectedMemberForAction: (memberId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<GymSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQuickCheckInOpen, setQuickCheckInOpen] = useState(false);
  const [isAddMemberOpen, setAddMemberOpen] = useState(false);
  const [isRecordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<string | null>(null);
  const toast = useToast();

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [authRes, settingsRes] = await Promise.all([
        api.getCurrentUser(),
        api.getSettings(),
      ]);
      setUser(authRes.user);
      setSettings(settingsRes);
    } catch (err: any) {
      console.error('Failed to load initial auth/settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const switchRole = async (role: UserRole) => {
    try {
      const res = await api.switchRole(role);
      setUser(res.user);
      toast.success(`Active Persona Changed`, `Now viewing as ${role.toUpperCase()} (${res.user.full_name})`);
    } catch (err: any) {
      toast.error('Role switch failed', err.message);
    }
  };

  const refreshSettings = async () => {
    try {
      const s = await api.getSettings();
      setSettings(s);
    } catch (err: any) {
      console.error('Failed to refresh settings:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        loading,
        switchRole,
        refreshSettings,
        isQuickCheckInOpen,
        setQuickCheckInOpen,
        isAddMemberOpen,
        setAddMemberOpen,
        isRecordPaymentOpen,
        setRecordPaymentOpen,
        selectedMemberForAction,
        setSelectedMemberForAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
