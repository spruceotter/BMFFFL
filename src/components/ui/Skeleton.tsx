import React from 'react';
import { cn } from '@/lib/cn';

// ─── Base Skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base skeleton shimmer block. Use for any loading placeholder.
 */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-slate-700/60',
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

// ─── Preset Skeletons ─────────────────────────────────────────────────────────

/** Single line of text */
export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-4 w-full', className)} />;
}

/** Stat card: number + label */
export function SkeletonStatCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-slate-700 bg-slate-800 p-4', className)}>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

/** Player card: name + position + points */
export function SkeletonPlayerCard({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center gap-3 p-3 rounded-lg border border-slate-700/50', className)}>
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-6 w-12 rounded" />
    </div>
  );
}

/** Manager row in a table */
export function SkeletonManagerRow({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center gap-4 py-3 border-b border-slate-700/50', className)}>
      <Skeleton className="h-4 w-6" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-16 ml-auto" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

/** Matchup card skeleton */
export function SkeletonMatchupCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-xl border border-slate-700 bg-slate-800/50 p-4', className)}>
      <div className="flex justify-between items-center mb-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-6 w-8" />
        <div className="space-y-2 text-right">
          <Skeleton className="h-4 w-24 ml-auto" />
          <Skeleton className="h-6 w-16 ml-auto" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

/** Chart / data visualization placeholder */
export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-slate-700 bg-slate-800/50 p-4', className)}>
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="flex items-end gap-2 h-32">
        {[60, 80, 45, 90, 70, 55, 85, 40, 75, 65, 50, 95].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Full page loading skeleton — used when an entire data section is loading */
export function SkeletonPageSection({ className, rows = 5 }: SkeletonProps & { rows?: number }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonManagerRow key={i} />
      ))}
    </div>
  );
}

/** Grid of stat cards */
export function SkeletonStatGrid({ className, count = 4 }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
