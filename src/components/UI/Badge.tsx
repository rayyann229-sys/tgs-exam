import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'info', size = 'sm', className = '' }: BadgeProps) {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    amber: 'bg-amber-600/20 text-amber-300 border-amber-500/30 font-semibold'
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full border',
    md: 'text-sm px-3 py-1 rounded-full border'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${styles} ${sizeStyles} ${className}`}>
      {children}
    </span>
  );
}
