import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

export interface StandingsRow {
  rank: number;
  teamName: string;
  ownerName: string;
  wins: number;
  losses: number;
  pointsFor: number;
  playoffSeed?: number;
}

interface StandingsTableProps {
  standings: StandingsRow[];
  className?: string;
}

/** Rows ranked 1-6 receive a playoff badge; rank 1 gets champion styling. */
function getStatusBadge(row: StandingsRow): React.ReactNode {
  const seed = row.playoffSeed ?? row.rank;

  if (seed === 1) {
    return <Badge variant="champion" size="sm">#1 Seed</Badge>;
  }
  if (seed <= 6) {
    return <Badge variant="playoff" size="sm">Playoff</Badge>;
  }
  if (seed === 12) {
    return <Badge variant="last" size="sm">Last</Badge>;
  }
  return <span className="text-slate-500 text-xs">—</span>;
}

/**
 * Full regular-season standings table.
 * Mobile-scrollable with sticky first column (rank).
 */
export default function StandingsTable({ standings, className }: StandingsTableProps) {
  return (
    <div className={cn('table-scroll w-full rounded-lg overflow-hidden border border-[#2d4a66]', className)}>
      <table className="min-w-full text-sm" aria-label="League standings">

        {/* Header */}
        <thead>
          <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
            <th
              scope="col"
              className="sticky left-0 z-10 bg-[#0f2744] w-12 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Rk
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[140px]"
            >
              Team
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[110px]"
            >
              Owner
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-12"
            >
              W
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-12"
            >
              L
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]"
            >
              Pts For
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]"
            >
              Status
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-[#1e3347]">
          {standings.map((row, idx) => {
            const isEven       = idx % 2 === 0;
            const isPlayoff    = (row.playoffSeed ?? row.rank) <= 6;
            const isTopSeed    = (row.playoffSeed ?? row.rank) === 1;

            return (
              <tr
                key={`${row.ownerName}-${row.rank}`}
                className={cn(
                  'transition-colors duration-100 hover:bg-[#1f3550]',
                  isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                  isTopSeed && 'ring-1 ring-inset ring-[#ffd700]/20'
                )}
              >
                {/* Rank — sticky */}
                <td
                  className={cn(
                    'sticky left-0 z-10 w-12 px-3 py-3 text-center font-bold tabular-nums',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                    isTopSeed ? 'text-[#ffd700]' : 'text-slate-300'
                  )}
                >
                  {row.rank}
                </td>

                {/* Team name */}
                <td className="px-4 py-3 font-semibold text-white max-w-[160px] truncate">
                  {row.teamName}
                </td>

                {/* Owner */}
                <td className="px-4 py-3 text-slate-300">
                  {row.ownerName}
                </td>

                {/* Wins */}
                <td className="px-3 py-3 text-center font-mono font-semibold text-[#22c55e]">
                  {row.wins}
                </td>

                {/* Losses */}
                <td className="px-3 py-3 text-center font-mono font-semibold text-[#ef4444]">
                  {row.losses}
                </td>

                {/* Points For */}
                <td className="px-4 py-3 text-right font-mono text-slate-200 tabular-nums">
                  {row.pointsFor.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  {getStatusBadge(row)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
