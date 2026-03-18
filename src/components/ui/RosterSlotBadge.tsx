import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RosterPosition =
  | 'QB'
  | 'RB'
  | 'WR'
  | 'TE'
  | 'K'
  | 'DEF'
  | 'FLEX'
  | 'BN'
  | 'IR'
  | 'TAXI';

export interface RosterSlotBadgeProps {
  player?: string;
  pos?: RosterPosition;
  nflTeam?: string;
  age?: number;
  size?: 'sm' | 'md';
}

// ─── Position color config ────────────────────────────────────────────────────

const POS_COLORS: Record<RosterPosition, string> = {
  QB:   'bg-purple-900/60 text-purple-300 border-purple-700/60',
  RB:   'bg-green-900/60  text-green-300  border-green-700/60',
  WR:   'bg-blue-900/60   text-blue-300   border-blue-700/60',
  TE:   'bg-yellow-900/60 text-yellow-300 border-yellow-700/60',
  K:    'bg-slate-700/60  text-slate-300  border-slate-600/60',
  DEF:  'bg-slate-700/60  text-slate-300  border-slate-600/60',
  FLEX: 'bg-teal-900/60   text-teal-300   border-teal-700/60',
  BN:   'bg-[#1a2d42]     text-slate-400  border-[#2d4a66]',
  IR:   'bg-red-900/50    text-red-400    border-red-700/50',
  TAXI: 'bg-orange-900/50 text-orange-300 border-orange-700/50',
};

const POS_PILL_COLORS: Record<RosterPosition, string> = {
  QB:   'bg-purple-600 text-white',
  RB:   'bg-green-600  text-white',
  WR:   'bg-blue-600   text-white',
  TE:   'bg-yellow-600 text-[#1a1a2e]',
  K:    'bg-slate-500  text-white',
  DEF:  'bg-slate-500  text-white',
  FLEX: 'bg-teal-600   text-white',
  BN:   'bg-[#2d4a66]  text-slate-300',
  IR:   'bg-red-700    text-white',
  TAXI: 'bg-orange-600 text-white',
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Small badge/pill for displaying a dynasty roster slot.
 * Shows position indicator, player name, and optional NFL team + age metadata.
 *
 * @example
 * <RosterSlotBadge pos="QB" player="Patrick Mahomes" nflTeam="KC" age={28} />
 * <RosterSlotBadge pos="BN" player="Justin Jefferson" nflTeam="MIN" />
 * <RosterSlotBadge pos="TAXI" />  // empty slot
 */
export default function RosterSlotBadge({
  player,
  pos,
  nflTeam,
  age,
  size = 'sm',
}: RosterSlotBadgeProps) {
  const isEmpty = !player;
  const containerBorder = pos ? POS_COLORS[pos] : 'bg-[#1a2d42] text-slate-500 border-[#2d4a66]';
  const pillColor       = pos ? POS_PILL_COLORS[pos] : 'bg-[#2d4a66] text-slate-400';

  const isMd = size === 'md';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded border',
        isMd ? 'px-2.5 py-1.5' : 'px-2 py-1',
        containerBorder
      )}
      title={player ?? `Empty ${pos ?? 'slot'}`}
    >
      {/* Position pill */}
      {pos && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded font-bold leading-none',
            isMd ? 'px-1.5 py-0.5 text-[11px]' : 'px-1 py-0.5 text-[10px]',
            pillColor
          )}
          aria-label={`Position: ${pos}`}
        >
          {pos}
        </span>
      )}

      {/* Player name or empty indicator */}
      <span
        className={cn(
          'font-medium leading-none truncate max-w-[120px]',
          isMd ? 'text-sm' : 'text-xs',
          isEmpty ? 'text-slate-500 italic' : 'text-slate-200'
        )}
      >
        {isEmpty ? 'Empty' : player}
      </span>

      {/* NFL team abbreviation */}
      {nflTeam && !isEmpty && (
        <span
          className={cn(
            'font-mono leading-none text-slate-400 shrink-0',
            isMd ? 'text-xs' : 'text-[10px]'
          )}
          aria-label={`NFL team: ${nflTeam}`}
        >
          {nflTeam}
        </span>
      )}

      {/* Age */}
      {age !== undefined && !isEmpty && (
        <span
          className={cn(
            'leading-none text-slate-500 shrink-0',
            isMd ? 'text-xs' : 'text-[10px]'
          )}
          aria-label={`Age: ${age}`}
        >
          ({age})
        </span>
      )}
    </div>
  );
}
