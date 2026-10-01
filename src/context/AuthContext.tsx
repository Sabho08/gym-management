import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Profile, GymSettings, UserRole } from '../types';
import { api } from '../lib/api';
import { supabase } from '../api/supabase';
import { useToast } from './ToastContext';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: Profile | null;
  authUser: User | null;
  session: Session | null;
  settings: GymSettings | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    phone?: string
  ) => Promise<{ requiresVerification: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
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
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [settings, setSettings] = useState<GymSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [isQuickCheckInOpen, setQuickCheckInOpen] = useState(false);
  const [isAddMemberOpen, setAddMemberOpen] = useState(false);
  const [isRecordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<string | null>(null);
  const toast = useToast();

  const loadUserProfile = useCallback(async (currentAuthUser: User) => {
    try {
      const profile = await api.getOrCreateProfile(currentAuthUser);
      setUser(profile);
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const s = await api.getSettings();
      setSettings(s);
    } catch (err: any) {
      console.error('Failed to refresh settings:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await loadUserProfile(data.session.user);
      }
    } catch (err: any) {
      console.error('Failed to refresh profile:', err);
    }
  }, [loadUserProfile]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        // 1. Fetch settings
        await refreshSettings();

        // 2. Get initial session from Supabase
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          console.warn('Session retrieval note:', sessionErr.message);
        }

        if (isMounted) {
          const currentSession = sessionData?.session || null;
          setSession(currentSession);
          setAuthUser(currentSession?.user || null);

          if (currentSession?.user) {
            await loadUserProfile(currentSession.user);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 3. Listen for live auth state changes (SignIn, SignOut, TokenRefresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      setAuthUser(newSession?.user || null);

      if (newSession?.user) {
        await loadUserProfile(newSession.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile, refreshSettings]);

  const signIn = async (email: string, password: string) => {
    const res = await api.signIn({ email, password });
    setUser(res.user);
    setSession(res.session);
    setAuthUser(res.session?.user || null);
    toast.success('Welcome Back', `Signed in as ${res.user.full_name} (${res.user.role.toUpperCase()})`);
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    phone?: string
  ) => {
    const res = await api.signUp({
      email,
      password,
      full_name: fullName,
      role,
      phone,
    });

    if (res.session) {
      setUser(res.user);
      setSession(res.session);
      setAuthUser(res.session.user);
      toast.success('Account Created', `Welcome to ApexFit, ${fullName}!`);
    } else if (res.requiresVerification) {
      toast.info('Verification Required', 'Please check your email to confirm your membership account.');
    }
    return { requiresVerification: res.requiresVerification };
  };

  const signOut = async () => {
    try {
      await api.signOut();
      setUser(null);
      setSession(null);
      setAuthUser(null);
      toast.info('Signed Out', 'You have been safely signed out of your session.');
    } catch (err: any) {
      toast.error('Sign Out Error', err.message);
    }
  };

  const resetPassword = async (email: string) => {
    await api.resetPassword(email);
    toast.success('Password Reset Email Sent', `Instructions sent to ${email}`);
  };

  const switchRole = async (role: UserRole) => {
    try {
      const res = await api.switchRole(role);
      setUser(res.user);
      toast.success('Persona Switch Successful', `Active role changed to ${role.toUpperCase()} (${res.user.full_name})`);
    } catch (err: any) {
      toast.error('Role switch failed', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        session,
        settings,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        switchRole,
        refreshProfile,
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
