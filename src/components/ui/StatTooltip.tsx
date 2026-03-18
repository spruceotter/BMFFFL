/**
 * StatTooltip — task-917
 * Pure-CSS hover popover that shows quick career stats for a manager.
 * No useState / useEffect — visibility is driven by Tailwind group-hover.
 *
 * Usage:
 *   <StatTooltip managerSlug="cogdeill11">
 *     <span>Cogdeill11</span>
 *   </StatTooltip>
 */

import { Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getManagerColor } from '@/data/manager-colors';

// ─── Inline stat registry ─────────────────────────────────────────────────────

interface ManagerStat {
  displayName: string;
  wins: number;
  losses: number;
  pointsScored: number;  // career total
  championships: number;
  currentRank: number;   // 2025 final rank
}

const MANAGER_STATS: Record<string, ManagerStat> = {
  cogdeill11:        { displayName: 'Cogdeill11',       wins: 68, losses: 22, pointsScored: 14820, championships: 2, currentRank: 4  },
  mlschools12:       { displayName: 'MLSchools12',      wins: 55, losses: 35, pointsScored: 13450, championships: 1, currentRank: 2  },
  rbr:               { displayName: 'rbr',              wins: 52, losses: 38, pointsScored: 13100, championships: 1, currentRank: 1  },
  juicybussy:        { displayName: 'JuicyBussy',       wins: 48, losses: 42, pointsScored: 12780, championships: 1, currentRank: 6  },
  tdtd19844:         { displayName: 'tdtd19844',        wins: 45, losses: 45, pointsScored: 12210, championships: 1, currentRank: 5  },
  sexmachineandy:    { displayName: 'SexMachineAndyD',  wins: 44, losses: 46, pointsScored: 12050, championships: 0, currentRank: 7  },
  eldridm20:         { displayName: 'eldridm20',        wins: 42, losses: 48, pointsScored: 11870, championships: 0, currentRank: 8  },
  tubes94:           { displayName: 'Tubes94',          wins: 35, losses: 35, pointsScored: 9640,  championships: 0, currentRank: 3  },
  grandes:           { displayName: 'Grandes',          wins: 40, losses: 50, pointsScored: 11420, championships: 0, currentRank: 9  },
  bro_set:           { displayName: 'Bro_Set',          wins: 32, losses: 58, pointsScored: 10800, championships: 0, currentRank: 11 },
  cheeseandcrackers: { displayName: 'CheeseAndCrackers', wins: 30, losses: 60, pointsScored: 10350, championships: 0, currentRank: 12 },
  jimmyeatwurld:     { displayName: 'JimmyEatWurld',    wins: 10, losses: 20, pointsScored: 3820,  championships: 0, currentRank: 10 },
};

const FALLBACK_STAT: ManagerStat = {
  displayName: 'Unknown',
  wins: 0,
  losses: 0,
  pointsScored: 0,
  championships: 0,
  currentRank: 0,
};

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
  const stat = MANAGER_STATS[managerSlug] ?? FALLBACK_STAT;
  const colors = getManagerColor(managerSlug);
  const winPct = stat.wins + stat.losses > 0
    ? ((stat.wins / (stat.wins + stat.losses)) * 100).toFixed(1)
    : '0.0';

  const isAbove = position === 'above';

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
            {stat.displayName}
          </span>
          {stat.championships > 0 && (
            <span className="flex items-center gap-0.5">
              {Array.from({ length: stat.championships }).map((_, i) => (
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
              {stat.wins}–{stat.losses}
              <span className="text-slate-500 ml-1">({winPct}%)</span>
            </span>
          </span>

          {/* Points */}
          <span className="flex justify-between">
            <span className="text-slate-400">Career Pts</span>
            <span className="font-mono font-semibold text-white">
              {stat.pointsScored.toLocaleString()}
            </span>
          </span>

          {/* Championships */}
          <span className="flex justify-between">
            <span className="text-slate-400">Championships</span>
            <span className="font-mono font-semibold" style={{ color: stat.championships > 0 ? '#ffd700' : '#94a3b8' }}>
              {stat.championships > 0 ? `${stat.championships}x 🏆` : '—'}
            </span>
          </span>

          {/* Current rank */}
          <span className="flex justify-between">
            <span className="text-slate-400">2025 Rank</span>
            <span
              className="font-mono font-semibold"
              style={{ color: stat.currentRank <= 3 ? colors.accent : '#94a3b8' }}
            >
              #{stat.currentRank}
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
