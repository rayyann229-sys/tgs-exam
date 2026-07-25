import React, { ReactNode } from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
  children
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl my-4">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/5">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mt-1 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-all shadow-md shadow-amber-600/20 active:scale-95 text-sm"
        >
          {actionLabel}
        </button>
      )}
      {children}
    </div>
  );
}
