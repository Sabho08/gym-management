import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  role?: string;
}

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 'md',
  className = '',
  role,
}) => {
  const getInitials = (n: string) => {
    if (!n) return 'AP';
    const parts = n.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Generate deterministic gold / amber / slate gradient based on name characters
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorVariants = [
    'from-amber-500/25 via-amber-600/20 to-slate-900 text-amber-300 border-amber-500/30',
    'from-emerald-500/25 via-emerald-600/20 to-slate-900 text-emerald-300 border-emerald-500/30',
    'from-cyan-500/25 via-cyan-600/20 to-slate-900 text-cyan-300 border-cyan-500/30',
    'from-indigo-500/25 via-indigo-600/20 to-slate-900 text-indigo-300 border-indigo-500/30',
    'from-rose-500/25 via-rose-600/20 to-slate-900 text-rose-300 border-rose-500/30',
  ];
  const variant = colorVariants[charCodeSum % colorVariants.length];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-24 h-24 text-2xl sm:w-28 sm:h-28 sm:text-3xl',
  }[size];

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${variant} border flex items-center justify-center font-black font-display tracking-wider flex-shrink-0 shadow-inner ${sizeClasses} ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
};
