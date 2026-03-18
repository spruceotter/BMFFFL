/**
 * SkeletonLoader — Loading skeleton screens for cards and tables.
 * Matches the shape and sizing of real components so the swap is smooth.
 * task-706
 */

import { cn } from '@/lib/cn';

// ─── Base pulse block ─────────────────────────────────────────────────────────

function PulseBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded bg-[#1e3045]', className)}
      aria-hidden="true"
    />
  );
}

// ─── SkeletonCard ─────────────────────────────────────────────────────────────

/**
 * Generic card-shaped skeleton.
 * Matches the padding / border-radius of real card components.
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#2d4a66] bg-[#16213e] p-4',
        className
      )}
      role="status"
      aria-label="Loading…"
    >
      {/* Pseudo-header row */}
      <div className="mb-3 flex items-center gap-3">
        <PulseBlock className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <PulseBlock className="h-3 w-1/2" />
          <PulseBlock className="h-2.5 w-1/3" />
        </div>
      </div>

      {/* Body lines */}
      <div className="space-y-2">
        <PulseBlock className="h-3 w-full" />
        <PulseBlock className="h-3 w-5/6" />
        <PulseBlock className="h-3 w-2/3" />
      </div>
    </div>
  );
}

// ─── SkeletonRow ──────────────────────────────────────────────────────────────

/**
 * Table row skeleton — renders `cols` equally-spaced cell placeholders.
 * Wrap several of these in a <tbody> while data is loading.
 */
export function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr
      className="border-b border-[#1e3045]"
      role="status"
      aria-label="Loading row…"
    >
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <PulseBlock
            className={cn(
              'h-3',
              // Vary widths so rows don't look identical
              i === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-1/2' : 'w-2/3'
            )}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── SkeletonText ─────────────────────────────────────────────────────────────

/**
 * Multi-line text block skeleton.
 * Defaults to 3 lines; each line is slightly shorter than the last.
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  // Pre-computed widths that cycle through to break visual monotony
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3', 'w-1/2'];

  return (
    <div
      className={cn('space-y-2', className)}
      role="status"
      aria-label="Loading text…"
    >
      {Array.from({ length: lines }, (_, i) => (
        <PulseBlock
          key={i}
          className={cn('h-3', widths[i % widths.length])}
        />
      ))}
    </div>
  );
}

// ─── SkeletonStatCard ─────────────────────────────────────────────────────────

/**
 * Skeleton that mirrors the layout of <StatCard>:
 *   label (xs, uppercase)
 *   value (2xl, monospace)
 *   subtext (xs, muted)
 */
export function SkeletonStatCard() {
  return (
    <div
      className="flex flex-col gap-1 rounded-lg border border-[#2d4a66] bg-[#16213e] p-4"
      role="status"
      aria-label="Loading stat…"
    >
      {/* Label */}
      <PulseBlock className="h-2.5 w-1/3" />

      {/* Value */}
      <PulseBlock className="mt-1 h-7 w-1/2" />

      {/* Subtext */}
      <PulseBlock className="h-2.5 w-2/5" />
    </div>
  );
}
