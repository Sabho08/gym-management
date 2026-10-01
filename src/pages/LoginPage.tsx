import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import confetti from 'canvas-confetti';
import {
  Dumbbell,
  Shield,
  Zap,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Users,
  Award,
  CreditCard,
  ChevronRight,
  HelpCircle,
  Clock
} from 'lucide-react';

interface DemoPreset {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  phone: string;
  badge: string;
  desc: string;
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    role: 'admin',
    name: 'Alexander Sterling',
    email: 'admin@apexfit.club',
    password: 'Password@123',
    phone: '+91 98765 43210',
    badge: 'Owner / Admin',
    desc: 'Full financial authority & club oversight',
  },
  {
    role: 'receptionist',
    name: 'Front Desk Concierge',
    email: 'reception@apexfit.club',
    password: 'Password@123',
    phone: '+91 98765 43211',
    badge: 'Front Desk',
    desc: 'Check-ins, memberships & desk payments',
  },
  {
    role: 'trainer',
    name: 'Vikramaditya Rao',
    email: 'trainer@apexfit.club',
    password: 'Password@123',
    phone: '+91 98111 22334',
    badge: 'Master Coach',
    desc: 'Workout plans, exercises & client roster',
  },
  {
    role: 'member',
    name: 'Aarav Singhania',
    email: 'member@apexfit.club',
    password: 'Password@123',
    phone: '+91 99001 11223',
    badge: 'VIP Member',
    desc: 'Personal metrics, workouts & digital card',
  },
];

export const LoginPage: React.FC = () => {
  const { user, loading: authLoading, signIn, signUp, resetPassword, settings } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  React.useEffect(() => {
    if (user && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('admin');

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FDE68A', '#10B981', '#38BDF8'],
      });
    } catch (_) {}
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toast.warning('Missing Fields', 'Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      triggerConfetti();
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Sign in error:', err);
      // Helpful fallback if account doesn't exist yet for demo credentials
      if (err.message?.includes('Invalid login credentials') || err.message?.includes('Email not confirmed')) {
        toast.error('Authentication Notice', err.message || 'Invalid email or password. You can also sign up a new account or use one-click demo presets below.');
      } else {
        toast.error('Login Failed', err.message || 'Could not authenticate with Supabase.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.warning('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.warning('Password Requirement', 'Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await signUp(email, password, fullName, role, phone);
      triggerConfetti();
      if (!res.requiresVerification) {
        navigate(from, { replace: true });
      } else {
        setMode('signin');
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      toast.error('Registration Failed', err.message || 'Could not complete registration on Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Email Required', 'Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setMode('signin');
    } catch (err: any) {
      toast.error('Reset Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Instant 1-Click Demo Login with smart Supabase auto-provisioning
  const handleQuickDemoAccess = async (preset: DemoPreset) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setFullName(preset.name);
    setRole(preset.role);
    setPhone(preset.phone);

    try {
      setLoading(true);
      try {
        // Attempt immediate login
        await signIn(preset.email, preset.password);
        triggerConfetti();
        navigate(from, { replace: true });
      } catch (firstErr: any) {
        // If demo user isn't created in this Supabase project yet, auto-register and sign in
        if (
          firstErr.message?.includes('Invalid login credentials') ||
          firstErr.message?.includes('User not found') ||
          firstErr.message?.includes('credentials')
        ) {
          toast.info('Setting Up Demo Account', `Provisioning ${preset.badge} in Supabase Auth...`);
          await signUp(preset.email, preset.password, preset.name, preset.role, preset.phone);
          // Try signing in right after provisioning
          await signIn(preset.email, preset.password);
          triggerConfetti();
          navigate(from, { replace: true });
        } else {
          throw firstErr;
        }
      }
    } catch (err: any) {
      console.error('Demo login error:', err);
      toast.error('Demo Access Error', err.message || 'Could not log in with preset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />

      {/* Subtle background tech grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Luxury Gym Brand Showcase (Desktop) */}
          <div className="lg:col-span-6 space-y-8 animate-in fade-in duration-500">
            {/* Club Brand Emblem */}
            <div className="inline-flex items-center gap-3.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider text-white font-display">
                  {settings?.gym_name || 'APEXFIT PERFORMANCE CLUB'}
                </span>
                <span className="ml-2 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40">
                  SUPABASE AUTH
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.08]">
                Where Discipline Meets <br />
                <span className="gold-gradient-text">Elite Performance.</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Precision club management powered by Supabase live cloud database. Complete biometric attendance, tier memberships, real-time finances, and athletic coaching telemetry.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-md space-y-1.5 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <Shield className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Role-Based Access</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Custom portals for Owners, Reception Concierges, Coaches, and VIP Members.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-md space-y-1.5 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Zap className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Cloud Sync</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time Supabase PostgreSQL with encrypted JWT authentication sessions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-md space-y-1.5 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-2.5 text-cyan-400">
                  <Award className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Black Tier Subscriptions</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Automatic renewal tracking, GST invoicing, and POS payment reconciliation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-md space-y-1.5 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-2.5 text-amber-300">
                  <Clock className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Check-in Desk</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Instant member code attendance logging and active floor count telemetry.
                </p>
              </div>
            </div>

            {/* Club status badge */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Supabase Production Cluster Online</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400/90 font-medium">Club Hours: 05:30 AM – 11:00 PM</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Luxury Auth Card */}
          <div className="lg:col-span-6 animate-in fade-in duration-700">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17]/95 border border-white/[0.08] shadow-2xl backdrop-blur-2xl ring-1 ring-amber-500/10 relative overflow-hidden">
              
              {/* Card top shimmer accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

              {/* Header Title & Switcher */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                      {mode === 'signin' && 'Club Suite Sign In'}
                      {mode === 'signup' && 'Create Member / Staff Account'}
                      {mode === 'forgot' && 'Reset Security Credentials'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {mode === 'signin' && 'Enter your verified credentials to access club operations.'}
                      {mode === 'signup' && 'Register a new authenticated profile in Supabase.'}
                      {mode === 'forgot' && 'We will dispatch an encrypted reset link to your email.'}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                </div>

                {/* Mode Selector Tabs (Sign In / Sign Up) */}
                {mode !== 'forgot' && (
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        mode === 'signin'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        mode === 'signup'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Create Account</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Form Views */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@apexfit.club"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Authenticating on Supabase...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter ApexFit Suite</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {mode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alexander Sterling"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Role Selector Grid */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Account Persona / Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { r: 'admin' as UserRole, label: 'Admin / Owner', icon: Shield },
                        { r: 'receptionist' as UserRole, label: 'Front Desk Concierge', icon: CreditCard },
                        { r: 'trainer' as UserRole, label: 'Master Coach', icon: Dumbbell },
                        { r: 'member' as UserRole, label: 'VIP Club Member', icon: Award },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = role === item.r;
                        return (
                          <button
                            key={item.r}
                            type="button"
                            onClick={() => setRole(item.r)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md'
                                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                            <span className="text-[11px] font-bold truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@apexfit.club"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create secure password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Registering on Supabase...</span>
                      </>
                    ) : (
                      <>
                        <span>Create & Authenticate Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Account Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}

              {/* DEMO PRESETS / FAST TEST LOGIN SECTION */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Instant Demo Logins (1-Click Access)
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Live Supabase Auth
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.role}
                      type="button"
                      disabled={loading}
                      onClick={() => handleQuickDemoAccess(preset)}
                      className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/[0.06] hover:border-amber-500/40 text-left transition-all group flex items-start justify-between cursor-pointer disabled:opacity-50"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {preset.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-400/90 font-medium">{preset.badge}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{preset.email}</p>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition-all flex-shrink-0 mt-0.5">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Footer */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Supabase RLS Protected</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
