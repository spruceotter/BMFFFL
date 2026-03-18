import { cn } from '@/lib/cn';
import { StatBar, TrendArrow } from '@/components/ui/StatComponents';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RosterValueCardProps {
  ownerName: string;
  teamName: string;
  dynastyRank: number;
  totalRosterScore: number;
  breakdown: {
    qb: number;   // 0–25
    rb: number;   // 0–25
    wr: number;   // 0–25
    te: number;   // 0–15
    picks: number; // 0–10
  };
  championship: boolean;
  trend: 'up' | 'down' | 'neutral';
  keyAssets: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rankLabel(rank: number): string {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-[#ffd700]';
  if (score >= 65) return 'text-emerald-400';
  if (score >= 50) return 'text-slate-200';
  return 'text-[#e94560]';
}

function tierLabel(score: number): { label: string; className: string } {
  if (score >= 80) return { label: 'Contender', className: 'bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700]' };
  if (score >= 65) return { label: 'Near Window', className: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' };
  if (score >= 50) return { label: 'Middle Pack', className: 'bg-blue-500/15 border border-blue-500/30 text-blue-400' };
  return { label: 'Rebuild', className: 'bg-[#e94560]/15 border border-[#e94560]/30 text-[#e94560]' };
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  const isGold   = rank === 1;
  const isSilver = rank === 2;
  const isBronze = rank === 3;

  const badgeClass = isGold
    ? 'bg-[#ffd700] text-[#0d1b2a] border border-[#ffd700]'
    : isSilver
    ? 'bg-slate-300 text-[#0d1b2a] border border-slate-300'
    : isBronze
    ? 'bg-amber-600 text-white border border-amber-600'
    : 'bg-[#1a2d42] text-slate-300 border border-[#2d4a66]';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black shrink-0',
        badgeClass
      )}
      aria-label={`Dynasty rank ${rank}`}
    >
      {rank}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RosterValueCard({
  ownerName,
  teamName,
  dynastyRank,
  totalRosterScore,
  breakdown,
  championship,
  trend,
  keyAssets,
}: RosterValueCardProps) {
  const tier = tierLabel(totalRosterScore);

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#16213e] p-5 flex flex-col gap-4',
        dynastyRank === 1
          ? 'border-[#ffd700]/40 shadow-[0_0_0_1px_rgba(255,215,0,0.1)]'
          : 'border-[#2d4a66]'
      )}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <RankBadge rank={dynastyRank} />
          <div className="min-w-0">
            <p className="text-white font-bold text-base leading-tight truncate">
              {teamName !== ownerName ? teamName : ownerName}
            </p>
            {teamName !== ownerName && (
              <p className="text-slate-500 text-xs leading-tight truncate mt-0.5">
                {ownerName}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {championship && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700]"
              title="Past league champion"
            >
              Champ
            </span>
          )}
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider', tier.className)}>
            {tier.label}
          </span>
        </div>
      </div>

      {/* ── Score Row ──────────────────────────────────────────────────────── */}
      <div className="flex items-end gap-3">
        <div className="flex items-baseline gap-1">
          <span
            className={cn('font-black text-5xl leading-none tabular-nums', scoreColor(totalRosterScore))}
            style={{ fontFamily: "'Roboto Mono', monospace" }}
            aria-label={`Dynasty roster score: ${totalRosterScore} out of 100`}
          >
            {totalRosterScore.toFixed(1)}
          </span>
          <span className="text-slate-500 text-lg font-semibold leading-none mb-1">
            /100
          </span>
        </div>
        <div className="mb-1.5 ml-auto">
          <TrendArrow
            direction={trend}
            label={trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}
            size="md"
          />
        </div>
      </div>

      {/* ── Position Breakdown ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Position Breakdown
        </p>
        <StatBar label="QB" value={breakdown.qb} max={25} color="blue"  showValue size="sm" />
        <StatBar label="RB" value={breakdown.rb} max={25} color="green" showValue size="sm" />
        <StatBar label="WR" value={breakdown.wr} max={25} color="gold"  showValue size="sm" />
        <StatBar label="TE" value={breakdown.te} max={15} color="red"   showValue size="sm" />
        <StatBar label="Picks" value={breakdown.picks} max={10} color="slate" showValue size="sm" />
      </div>

      {/* ── Key Assets ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Key Assets
        </p>
        <div className="flex flex-wrap gap-1.5">
          {keyAssets.map((player) => (
            <span
              key={player}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#1a2d42] border border-[#2d4a66] text-slate-300"
            >
              {player}
            </span>
          ))}
        </div>
      </div>

      {/* ── Footer: rank label ─────────────────────────────────────────────── */}
      <div className="pt-1 border-t border-[#2d4a66] flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Dynasty Rank: <span className="text-slate-300 font-semibold">{rankLabel(dynastyRank)} of 12</span>
        </span>
      </div>
    </div>
  );
}
