import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type DynastyTier = 'elite' | 'tier1' | 'tier2' | 'tier3' | 'speculative';

interface PlayerCardProps {
  name: string;
  position: Position;
  nflTeam: string;
  age: number;
  dynastyTier?: DynastyTier;
  keyStat?: string;   // e.g. "1,585 rush yds, 18 TDs"
  compact?: boolean;  // compact variant for roster display
}

// ─── Config ───────────────────────────────────────────────────────────────────

const POSITION_CONFIG: Record<Position, { bg: string; text: string; border: string }> = {
  QB: { bg: 'bg-blue-900/60',   text: 'text-blue-300',   border: 'border-blue-700/50'   },
  RB: { bg: 'bg-green-900/60',  text: 'text-green-300',  border: 'border-green-700/50'  },
  WR: { bg: 'bg-amber-900/60',  text: 'text-amber-300',  border: 'border-amber-700/50'  },
  TE: { bg: 'bg-purple-900/60', text: 'text-purple-300', border: 'border-purple-700/50' },
};

const TIER_CONFIG: Record<DynastyTier, { label: string; bg: string; text: string; border: string }> = {
  elite:       { label: 'Elite',       bg: 'bg-[#ffd700]/20', text: 'text-[#ffd700]',    border: 'border-[#ffd700]/40'   },
  tier1:       { label: 'Tier 1',      bg: 'bg-cyan-900/60',  text: 'text-cyan-300',     border: 'border-cyan-700/50'    },
  tier2:       { label: 'Tier 2',      bg: 'bg-slate-700/60', text: 'text-slate-300',    border: 'border-slate-600/50'   },
  tier3:       { label: 'Tier 3',      bg: 'bg-slate-800/60', text: 'text-slate-400',    border: 'border-slate-700/50'   },
  speculative: { label: 'Speculative', bg: 'bg-orange-900/60', text: 'text-orange-300',  border: 'border-orange-700/50'  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PositionBadge({ position, size = 'md' }: { position: Position; size?: 'sm' | 'md' }) {
  const cfg = POSITION_CONFIG[position];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold uppercase tracking-wide rounded border',
        cfg.bg, cfg.text, cfg.border,
        size === 'sm'
          ? 'px-1.5 py-0.5 text-xs min-w-[28px]'
          : 'px-2 py-1 text-sm min-w-[36px]'
      )}
      aria-label={`Position: ${position}`}
    >
      {position}
    </span>
  );
}

function TierBadge({ tier }: { tier: DynastyTier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold tracking-wide',
        cfg.bg, cfg.text, cfg.border
      )}
      aria-label={`Dynasty tier: ${cfg.label}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * PlayerCard displays a dynasty player's key info.
 *
 * - `compact`: horizontal pill-style row (for roster tables)
 * - default: full card with stat and tier badges
 */
export default function PlayerCard({
  name,
  position,
  nflTeam,
  age,
  dynastyTier,
  keyStat,
  compact = false,
}: PlayerCardProps) {
  // ── Compact variant ──────────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-[#16213e] border border-[#2d4a66]',
          'transition-colors duration-150 hover:border-[#3a5f80]'
        )}
      >
        <PositionBadge position={position} size="sm" />
        <span className="text-sm font-semibold text-white truncate flex-1">
          {name}
        </span>
        <span className="text-xs text-slate-400 font-medium shrink-0">
          {nflTeam}
        </span>
      </div>
    );
  }

  // ── Full card variant ────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-[#16213e] border border-[#2d4a66]',
        'transition-all duration-200 hover:border-[#3a5f80] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30'
      )}
    >
      {/* Position color accent bar */}
      <div
        className={cn('h-1 w-full', POSITION_CONFIG[position].bg.replace('/60', ''))}
        aria-hidden="true"
      />

      <div className="p-4">
        {/* Header row: position badge + team */}
        <div className="flex items-center justify-between mb-3">
          <PositionBadge position={position} />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {nflTeam}
          </span>
        </div>

        {/* Player name */}
        <h3 className="text-lg font-bold text-white leading-tight mb-1">
          {name}
        </h3>

        {/* Age */}
        <p className="text-xs text-slate-500 mb-3">
          Age {age}
        </p>

        {/* Key stat */}
        {keyStat && (
          <p className="text-sm text-slate-300 leading-snug mb-3 border-t border-[#2d4a66] pt-3">
            {keyStat}
          </p>
        )}

        {/* Dynasty tier badge */}
        {dynastyTier && (
          <div className={cn('mt-auto', !keyStat && 'border-t border-[#2d4a66] pt-3')}>
            <TierBadge tier={dynastyTier} />
          </div>
        )}
      </div>
    </div>
  );
}
