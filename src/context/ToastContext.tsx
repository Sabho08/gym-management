import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => showToast(title, message, 'success'), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast(title, message, 'error'), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast(title, message, 'warning'), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast(title, message, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className="fixed top-5 right-0 left-0 md:left-auto md:right-6 z-50 flex flex-col items-center md:items-end gap-3 max-w-md md:w-96 pointer-events-none px-4 mx-auto md:mx-0">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-[#0B1A14]/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50 shadow-2xl ring-1 ring-emerald-500/20',
            error: 'bg-[#1A0B0E]/95 border-rose-500/40 text-rose-200 shadow-rose-950/50 shadow-2xl ring-1 ring-rose-500/20',
            warning: 'bg-[#1A140B]/95 border-amber-500/40 text-amber-200 shadow-amber-950/50 shadow-2xl ring-1 ring-amber-500/20',
            info: 'bg-[#0F172A]/95 border-cyan-500/40 text-cyan-200 shadow-cyan-950/50 shadow-2xl ring-1 ring-cyan-500/20',
          }[toast.type];

          const IconComponent = {
            success: CheckCircle2,
            error: AlertCircle,
            warning: AlertTriangle,
            info: Info,
          }[toast.type];

          const iconColor = {
            success: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
            error: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
            warning: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
            info: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
          }[toast.type];

          const barColor = {
            success: 'bg-emerald-400',
            error: 'bg-rose-400',
            warning: 'bg-amber-400',
            info: 'bg-cyan-400',
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`animate-toast-pop pointer-events-auto relative overflow-hidden flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-2xl transition-all duration-300 w-full ${typeStyles}`}
            >
              <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${iconColor}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-white tracking-wide text-sm font-display">{toast.title}</p>
                </div>
                {toast.message && <p className="mt-1 text-slate-300 leading-relaxed font-medium">{toast.message}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Subtle animated timer bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
                <div className={`h-full ${barColor} animate-[shrink_4.5s_linear_forwards] w-full`} />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
