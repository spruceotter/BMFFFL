/**
 * StatTooltip — task-917
 * Pure-CSS hover popover that shows quick career stats for a manager.
 * No useState / useEffect — visibility is driven by Tailwind group-hover.
 *
 * Data source: src/lib/league-data.ts (auto-generated from dynasty-scores.json + sleeper.db)
 * Run `scripts/generate-league-data.ts` to refresh stats.
 *
 * Usage:
 *   <StatTooltip managerSlug="cogdeill11">
 *     <span>Cogdeill11</span>
 *   </StatTooltip>
 */

import { Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getManagerColor } from '@/data/manager-colors';
import { getManager, getWinPct } from '@/lib/league-data';

// ─── Component ────────────────────────────────────────────────────────────────

interface StatTooltipProps {
  managerSlug: string;
  children: React.ReactNode;
  /** Position of the popover relative to the trigger. Defaults to 'above'. */
  position?: 'above' | 'below';
  className?: string;
}

export default function StatTooltip({
  managerSlug,
  children,
  position = 'above',
  className,
}: StatTooltipProps) {
  const manager = getManager(managerSlug);
  const colors = getManagerColor(managerSlug);
  const isAbove = position === 'above';

  if (!manager) {
    // Unknown slug — render children without tooltip
    return <>{children}</>;
  }

  const winPct = getWinPct(manager.careerWins, manager.careerLosses);
  const champCount = manager.championships.length;

  return (
    <span
      className={cn('relative inline-flex items-center group cursor-pointer', className)}
      tabIndex={0}
    >
      {/* ── Trigger ── */}
      {children}

      {/* ── Popover bubble ── */}
      <span
        role="tooltip"
        className={cn(
          // Positioning
          'absolute z-50 left-1/2 -translate-x-1/2',
          isAbove ? 'bottom-full mb-3' : 'top-full mt-3',
          // Sizing
          'w-56 rounded-xl p-3',
          // Colours — dark card with primary-coloured top border
          'bg-[#0d1b2a] border border-[#2d4a66] text-white',
          'shadow-2xl shadow-black/50',
          // Visibility — pure CSS, no JS
          'pointer-events-none opacity-0 scale-95',
          'transition-all duration-200 ease-out',
          'group-hover:opacity-100 group-hover:scale-100',
          'group-focus-within:opacity-100 group-focus-within:scale-100',
        )}
        style={{ borderTopColor: colors.accent, borderTopWidth: '2px' }}
      >
        {/* Header */}
        <span className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-wide uppercase" style={{ color: colors.accent }}>
            {manager.displayName}
          </span>
          {champCount > 0 && (
            <span className="flex items-center gap-0.5">
              {Array.from({ length: champCount }).map((_, i) => (
                <Trophy key={i} size={12} className="text-yellow-400" />
              ))}
            </span>
          )}
        </span>

        {/* Stat rows */}
        <span className="flex flex-col gap-1 text-xs">
          {/* Record */}
          <span className="flex justify-between">
            <span className="text-slate-400">Record</span>
            <span className="font-mono font-semibold text-white">
              {manager.careerWins}–{manager.careerLosses}
              <span className="text-slate-500 ml-1">({winPct}%)</span>
            </span>
          </span>

          {/* Dynasty Score */}
          <span className="flex justify-between">
            <span className="text-slate-400">Dynasty Score</span>
            <span className="font-mono font-semibold text-white">
              {manager.dynastyScore.toFixed(2)}
            </span>
          </span>

          {/* Championships */}
          <span className="flex justify-between">
            <span className="text-slate-400">Championships</span>
            <span className="font-mono font-semibold" style={{ color: champCount > 0 ? '#ffd700' : '#94a3b8' }}>
              {champCount > 0
                ? `${champCount}x 🏆 (${manager.championships.join(', ')})`
                : '—'}
            </span>
          </span>

          {/* Dynasty Rank */}
          <span className="flex justify-between">
            <span className="text-slate-400">Dynasty Rank</span>
            <span
              className="font-mono font-semibold"
              style={{ color: manager.dynastyRank <= 3 ? colors.accent : '#94a3b8' }}
            >
              #{manager.dynastyRank}
            </span>
          </span>
        </span>

        {/* Arrow pointing toward the trigger */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-1/2 -translate-x-1/2 border-4 border-transparent',
            isAbove
              ? 'top-full border-t-[#2d4a66]'
              : 'bottom-full border-b-[#2d4a66]',
          )}
        />
      </span>
    </span>
  );
}
