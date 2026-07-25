import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-800/80 rounded-lg ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-10 w-full mt-2 rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800/80 gap-4">
      <Skeleton className="h-5 w-1/6" />
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-5 w-1/6" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );
}
