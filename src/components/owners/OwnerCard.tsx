import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';

export interface OwnerCardData {
  name: string;
  teamName: string;
  allTimeRecord: {
    wins: number;
    losses: number;
    ties: number;
    winPct: number;
  };
  championships: number;   // count of titles
  playoffAppearances: number;
  winPct: number;          // decimal, e.g. 0.623
}

interface OwnerCardProps {
  owner: OwnerCardData;
  variant?: 'compact' | 'expanded';
  className?: string;
}

/**
 * Renders championship rings as gold circle badges.
 */
function ChampionshipRings({ count }: { count: number }) {
  if (count === 0) {
    return <span className="text-xs text-slate-500 italic">No titles yet</span>;
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap" aria-label={`${count} championship${count !== 1 ? 's' : ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="w-6 h-6 rounded-full bg-[#ffd700] border-2 border-[#c9a800] flex items-center justify-center shadow-sm"
          title="Championship"
          aria-hidden="true"
        >
          <Trophy className="w-3 h-3 text-[#1a1a2e]" />
        </span>
      ))}
    </div>
  );
}

/**
 * Owner profile card — compact (list-friendly) or expanded (detail page).
 *
 * @example
 * <OwnerCard owner={ownerData} variant="expanded" />
 */
export default function OwnerCard({
  owner,
  variant = 'compact',
  className,
}: OwnerCardProps) {
  const winPctFormatted = owner.winPct.toFixed(3).replace(/^0/, '');
  const { wins, losses, ties } = owner.allTimeRecord;
  const recordStr = ties > 0
    ? `${wins}-${losses}-${ties}`
    : `${wins}-${losses}`;

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-4 p-4 rounded-lg',
          'bg-[#1a2d42] border border-[#2d4a66]',
          'hover:border-[#3a5f80] transition-colors duration-150',
          className
        )}
      >
        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-[#0f3460] border-2 border-[#2d4a66] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-[#ffd700]">
            {owner.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white truncate">{owner.name}</p>
          <p className="text-xs text-slate-400 truncate">{owner.teamName}</p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3 text-right flex-shrink-0">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Record</p>
            <p className="text-sm font-mono font-semibold text-slate-200">{recordStr}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Win%</p>
            <p className="text-sm font-mono font-semibold text-[#22c55e]">{winPctFormatted}</p>
          </div>
          {owner.championships > 0 && (
            <Badge variant="champion" size="sm">
              <Trophy className="w-3 h-3 mr-0.5" aria-hidden="true" />
              {owner.championships}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  // Expanded variant
  return (
    <div
      className={cn(
        'rounded-xl p-6',
        'bg-[#1a2d42] border border-[#2d4a66]',
        'shadow-lg',
        owner.championships > 0 && 'border-[#ffd700]/30',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        {/* Avatar */}
        <div
          className={cn(
            'w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0',
            owner.championships > 0
              ? 'bg-[#ffd700]/10 border-[#ffd700]'
              : 'bg-[#0f3460] border-[#2d4a66]'
          )}
        >
          <span
            className={cn(
              'text-xl font-black',
              owner.championships > 0 ? 'text-[#ffd700]' : 'text-slate-300'
            )}
          >
            {owner.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-white truncate">{owner.name}</h3>
          <p className="text-sm text-slate-400 truncate">{owner.teamName}</p>

          {/* Championships row */}
          <div className="mt-2">
            <ChampionshipRings count={owner.championships} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center p-3 rounded-lg bg-[#0f2744] border border-[#1e3a5f]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Record</span>
          <span className="text-base font-mono font-bold text-slate-200">{recordStr}</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg bg-[#0f2744] border border-[#1e3a5f]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Win %</span>
          <span className="text-base font-mono font-bold text-[#22c55e]">{winPctFormatted}</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg bg-[#0f2744] border border-[#1e3a5f]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Playoffs</span>
          <span className="text-base font-mono font-bold text-slate-200">{owner.playoffAppearances}</span>
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-4 pt-4 border-t border-[#2d4a66] flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
          All-time stats
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {owner.championships} title{owner.championships !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
