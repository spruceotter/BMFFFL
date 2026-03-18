import Head from 'next/head';
import { AlertTriangle, TrendingUp, Users, BarChart3, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type StrengthRating = 'solid' | 'thin' | 'urgent';

interface PositionScarcity {
  pos: Position;
  score: number; // 0-100
  label: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
}

interface TeamScarcity {
  id: string;
  owner: string;
  ratings: Record<Position, StrengthRating>;
}

interface DepthEntry {
  pos: Position;
  tier: string;
  covered: number;
  total: number;
  note: string;
}

interface PremiumEntry {
  pos: Position;
  premium: number; // percentage above standard
  rationale: string;
  color: string;
  border: string;
  bg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const POSITIONS: Position[] = ['QB', 'RB', 'WR', 'TE'];

const SCARCITY_OVERVIEW: PositionScarcity[] = [
  {
    pos: 'QB',
    score: 35,
    label: 'Low Scarcity',
    severity: 'low',
    summary: 'Most teams have solid QB depth. SF league means two QBs per roster but the market is well-stocked.',
  },
  {
    pos: 'RB',
    score: 82,
    label: 'HIGH Scarcity',
    severity: 'high',
    summary: 'Thin across the league. Multiple teams running back-by-committee with no true bell cow. RB value is elevated.',
  },
  {
    pos: 'WR',
    score: 61,
    label: 'Medium Scarcity',
    severity: 'medium',
    summary: 'Top end is solid but mid-tier WR2 depth varies widely. Several teams lack a reliable second option.',
  },
  {
    pos: 'TE',
    score: 91,
    label: 'CRITICAL Scarcity',
    severity: 'critical',
    summary: 'Only 3 teams have a locked-in top-10 TE. The rest are streaming or holding aging assets. TE scarcity is the defining league feature of 2026.',
  },
];

const TEAMS: TeamScarcity[] = [
  { id: 'mlschools12',   owner: 'mlschools12',    ratings: { QB: 'solid',  RB: 'thin',   WR: 'solid',  TE: 'thin'   } },
  { id: 'tubes94',       owner: 'tubes94',         ratings: { QB: 'solid',  RB: 'urgent', WR: 'solid',  TE: 'solid'  } },
  { id: 'rbr',           owner: 'rbr',             ratings: { QB: 'solid',  RB: 'thin',   WR: 'thin',   TE: 'solid'  } },
  { id: 'juicybussy',    owner: 'juicybussy',      ratings: { QB: 'thin',   RB: 'solid',  WR: 'solid',  TE: 'thin'   } },
  { id: 'sexmachineandy',owner: 'sexmachineandy',  ratings: { QB: 'solid',  RB: 'solid',  WR: 'thin',   TE: 'thin'   } },
  { id: 'cogdeill11',    owner: 'cogdeill11',      ratings: { QB: 'urgent', RB: 'thin',   WR: 'thin',   TE: 'solid'  } },
  { id: 'grandes',       owner: 'grandes',         ratings: { QB: 'solid',  RB: 'urgent', WR: 'thin',   TE: 'solid'  } },
  { id: 'tdtd19844',     owner: 'tdtd19844',       ratings: { QB: 'solid',  RB: 'solid',  WR: 'solid',  TE: 'urgent' } },
  { id: 'eldridsm',      owner: 'eldridsm',        ratings: { QB: 'thin',   RB: 'solid',  WR: 'solid',  TE: 'urgent' } },
  { id: 'eldridm20',     owner: 'eldridm20',       ratings: { QB: 'solid',  RB: 'thin',   WR: 'solid',  TE: 'urgent' } },
  { id: 'cmaleski',      owner: 'cmaleski',         ratings: { QB: 'solid',  RB: 'thin',   WR: 'solid',  TE: 'thin'   } },
  { id: 'escuelas',      owner: 'escuelas',         ratings: { QB: 'urgent', RB: 'urgent', WR: 'thin',   TE: 'urgent' } },
];

const DEPTH_CHART: DepthEntry[] = [
  {
    pos: 'QB',
    tier: 'Starter-quality QB (20+ TD pace)',
    covered: 10,
    total: 12,
    note: 'Only 2 teams lacking a reliable SF starter. QB is the most well-covered position.',
  },
  {
    pos: 'RB',
    tier: 'RB1-quality back (bell cow / 200+ carry pace)',
    covered: 8,
    total: 12,
    note: '4 teams running thin at RB. Committee backs dominate several rosters.',
  },
  {
    pos: 'WR',
    tier: 'WR1-quality receiver (top-24 dynasty)',
    covered: 9,
    total: 12,
    note: '3 teams lack a true WR1. Mid-tier is the scarcity driver, not the top end.',
  },
  {
    pos: 'TE',
    tier: 'TE1-quality tight end (top-10 dynasty)',
    covered: 5,
    total: 12,
    note: 'CRITICAL: 7 of 12 teams have no locked-in TE1. The position is an extreme outlier in scarcity.',
  },
];

const PREMIUMS: PremiumEntry[] = [
  {
    pos: 'TE',
    premium: 25,
    rationale: 'TE scarcity at 91/100 is extreme. In trade negotiations, a locked-in TE1 commands a 25% markup above standard dynasty value charts. Acquiring Brock Bowers or Colston Loveland costs more than the chart says.',
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
  },
  {
    pos: 'RB',
    premium: 15,
    rationale: 'RB scarcity at 82/100 adds a 15% premium on true bell cows. Backfield committees are everywhere — teams will overpay to secure a workhorse. Volume backs are worth more than they appear on paper.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  {
    pos: 'WR',
    premium: 8,
    rationale: 'Medium scarcity (61/100) creates a modest WR1 premium. Top receivers are fine; the scarcity is at WR2 depth. Teams should target WR2/WR3 upside in the rookie draft rather than chasing elite WR1 prices.',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
  },
  {
    pos: 'QB',
    premium: 0,
    rationale: 'Low QB scarcity (35/100) means no premium above standard value. The SF market is saturated with viable starters. Do not overpay for a second QB — the position restocks easily via rookie drafts and waiver wire.',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
  },
];

const BIMFLE_INSIGHTS = [
  'The TE market in BMFFFL is structurally broken. If you have Brock Bowers or Colston Loveland, you are getting a positional advantage that affects your lineup every single week. That is worth more than any value chart suggests.',
  'RB scarcity is masking itself as "committee backs are fine now." They are not fine. Every team that does not have a true workhorse is one injury away from streaming running backs for eight weeks. This is the 2026 time bomb.',
  'QB feels cheap because everyone has one. But in superflex, the gap between QB1 and QB15 is massive in terms of actual points. The scarcity score is low because the market is liquid — not because the position is interchangeable.',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const POS_COLORS: Record<Position, { text: string; bg: string; border: string; badge: string }> = {
  QB: { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    badge: 'bg-red-500/15 text-red-400 border-red-500/30' },
  RB: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  WR: { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  TE: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
};

const SEVERITY_STYLES: Record<string, { bar: string; label: string; score: string }> = {
  low:      { bar: 'bg-emerald-500', label: 'text-emerald-400', score: 'text-emerald-300' },
  medium:   { bar: 'bg-amber-500',   label: 'text-amber-400',   score: 'text-amber-300'   },
  high:     { bar: 'bg-[#e94560]',   label: 'text-[#e94560]',   score: 'text-[#e94560]'   },
  critical: { bar: 'bg-[#e94560]',   label: 'text-[#e94560]',   score: 'text-[#e94560]'   },
};

const RATING_STYLES: Record<StrengthRating, { cell: string; label: string }> = {
  solid:  { cell: 'bg-emerald-500/15 text-emerald-300', label: 'SOLID'  },
  thin:   { cell: 'bg-amber-500/15 text-amber-300',     label: 'THIN'   },
  urgent: { cell: 'bg-[#e94560]/15 text-[#e94560]',     label: 'URGENT' },
};

function getWeakestPosition(team: TeamScarcity): Position {
  const order: StrengthRating[] = ['urgent', 'thin', 'solid'];
  for (const rating of order) {
    for (const pos of POSITIONS) {
      if (team.ratings[pos] === rating) return pos;
    }
  }
  return 'RB';
}

// ─── Scarcity Tile ────────────────────────────────────────────────────────────

function ScarcityTile({ entry }: { entry: PositionScarcity }) {
  const posC = POS_COLORS[entry.pos];
  const sevS = SEVERITY_STYLES[entry.severity];
  const barWidth = `${entry.score}%`;

  return (
    <div className={cn('rounded-xl border bg-[#16213e] p-5 flex flex-col gap-3', posC.border)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-black',
              posC.badge
            )}
            aria-hidden="true"
          >
            {entry.pos}
          </span>
          <div>
            <p className="text-base font-black text-white">{entry.pos}</p>
            <p className={cn('text-xs font-bold', sevS.label)}>{entry.label}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn('text-3xl font-black tabular-nums', sevS.score)}>{entry.score}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">/ 100</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 rounded-full bg-[#0d1b2a] overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', sevS.bar)}
          style={{ width: barWidth }}
          role="progressbar"
          aria-valuenow={entry.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${entry.pos} scarcity: ${entry.score} out of 100`}
        />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">{entry.summary}</p>
    </div>
  );
}

// ─── Team Scarcity Card ───────────────────────────────────────────────────────

function TeamScarcityCard({ team }: { team: TeamScarcity }) {
  const weakest = getWeakestPosition(team);
  const weakestRating = team.ratings[weakest];
  const hasUrgent = POSITIONS.some(p => team.ratings[p] === 'urgent');

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#16213e] p-4 flex flex-col gap-3 transition-all duration-150',
        hasUrgent ? 'border-[#e94560]/25' : 'border-[#2d4a66] hover:border-[#3d5a76]'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-black text-white">{team.owner}</p>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Weakest</span>
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-black uppercase',
            POS_COLORS[weakest].badge
          )}>
            {weakest}
            <span className="ml-0.5">
              {weakestRating === 'urgent' ? '— URGENT' : weakestRating === 'thin' ? '— THIN' : '— SOLID'}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {POSITIONS.map(pos => {
          const rating = team.ratings[pos];
          const s = RATING_STYLES[rating];
          return (
            <div key={pos} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{pos}</span>
              <span className={cn(
                'inline-flex items-center justify-center w-full py-0.5 rounded text-[9px] font-black uppercase tracking-wider',
                s.cell
              )}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Depth Bar ────────────────────────────────────────────────────────────────

function DepthBar({ entry }: { entry: DepthEntry }) {
  const pct = Math.round((entry.covered / entry.total) * 100);
  const posC = POS_COLORS[entry.pos];
  const isCritical = pct < 50;

  return (
    <div className={cn('rounded-xl border bg-[#16213e] p-5', posC.border)}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('px-2 py-0.5 rounded border text-[10px] font-black uppercase', posC.badge)}>
              {entry.pos}
            </span>
            {isCritical && (
              <span className="px-2 py-0.5 rounded border border-[#e94560]/40 bg-[#e94560]/15 text-[#e94560] text-[10px] font-black uppercase tracking-wider">
                CRITICAL
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-white">{entry.tier}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={cn('text-2xl font-black tabular-nums', posC.text)}>
            {entry.covered}
            <span className="text-sm text-slate-500 font-semibold">/{entry.total}</span>
          </p>
          <p className="text-[10px] text-slate-500">teams covered</p>
        </div>
      </div>

      {/* Fill bar with team dots */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: entry.total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-3 rounded-sm transition-colors',
              i < entry.covered ? (isCritical ? 'bg-[#e94560]' : posC.text.replace('text-', 'bg-')) : 'bg-[#1e3347]'
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">{entry.note}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScarcityIndexPage() {
  return (
    <>
      <Head>
        <title>Position Scarcity Index — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Position scarcity tracking across all 12 BMFFFL rosters. See which positions are thin league-wide, how it affects trade value, and where the premium is highest."
        />
      </Head>

      <main className="min-h-screen bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#1e3347]">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#16213e] border border-[#2d4a66]">
                  <BarChart3 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Position Scarcity Index
                </h1>
              </div>
              <p className="text-sm text-slate-400 max-w-xl">
                How scarce is each position across all 12 BMFFFL rosters? Higher scarcity = higher trade premium. Updated March 2026.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              <span>12 teams</span>
              <span className="text-slate-700">·</span>
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>4 positions tracked</span>
            </div>
          </div>

          {/* Section 1: Scarcity Overview */}
          <section aria-labelledby="overview-heading">
            <div className="flex items-center gap-3 mb-5">
              <BarChart3 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 id="overview-heading" className="text-lg font-black text-white">
                Scarcity Overview
              </h2>
              <span className="text-xs text-slate-500 font-medium">0 = plentiful, 100 = critical shortage</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SCARCITY_OVERVIEW.map(entry => (
                <ScarcityTile key={entry.pos} entry={entry} />
              ))}
            </div>
          </section>

          {/* Section 2: Per-Team Scarcity Ratings */}
          <section aria-labelledby="team-ratings-heading">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 id="team-ratings-heading" className="text-lg font-black text-white">
                Per-Team Scarcity Ratings
              </h2>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-5">
              <span className="font-semibold text-slate-400">Rating key:</span>
              {(['solid', 'thin', 'urgent'] as StrengthRating[]).map(r => {
                const s = RATING_STYLES[r];
                return (
                  <div key={r} className="flex items-center gap-1.5">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-black uppercase', s.cell)}>
                      {s.label}
                    </span>
                    <span>
                      {r === 'solid'  && '— adequate depth at that position'}
                      {r === 'thin'   && '— below-average, room to improve'}
                      {r === 'urgent' && '— critical weakness, must address'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TEAMS.map(team => (
                <TeamScarcityCard key={team.id} team={team} />
              ))}
            </div>
          </section>

          {/* Section 3: League-Wide Depth Chart */}
          <section aria-labelledby="depth-heading">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 id="depth-heading" className="text-lg font-black text-white">
                League-Wide Depth Chart
              </h2>
              <span className="text-xs text-slate-500 font-medium">How many of 12 teams are covered at each tier</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {DEPTH_CHART.map(entry => (
                <DepthBar key={entry.pos} entry={entry} />
              ))}
            </div>
          </section>

          {/* Section 4: Scarcity-Adjusted Trade Value */}
          <section aria-labelledby="premium-heading">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 id="premium-heading" className="text-lg font-black text-white">
                Scarcity-Adjusted Trade Value
              </h2>
              <span className="text-xs text-slate-500 font-medium">Premiums above standard dynasty value charts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PREMIUMS.map(entry => (
                <div key={entry.pos} className={cn('rounded-xl border p-5', entry.border, entry.bg)}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn('inline-flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-black', POS_COLORS[entry.pos].badge)}>
                      {entry.pos}
                    </span>
                    <div>
                      <p className="text-sm font-black text-white">{entry.pos} Premium</p>
                      {entry.premium > 0 ? (
                        <p className={cn('text-xl font-black tabular-nums', entry.color)}>+{entry.premium}%</p>
                      ) : (
                        <p className="text-xl font-black text-slate-500">No premium</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{entry.rationale}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Bimfle Scarcity Analysis */}
          <section aria-labelledby="bimfle-heading">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 id="bimfle-heading" className="text-lg font-black text-white">
                Bimfle Scarcity Analysis
              </h2>
            </div>
            <div className="rounded-xl border border-[#ffd700]/20 bg-[#16213e] p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-black text-[#ffd700] uppercase tracking-wider">Bimfle on Scarcity:</span>
              </div>
              <ul className="space-y-5">
                {BIMFLE_INSIGHTS.map((insight, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#ffd700]/40 bg-[#ffd700]/10 text-[#ffd700] text-xs font-black">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{insight}&rdquo;</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-[#1e3347]">
            <p className="text-xs text-slate-600 text-center">
              Scarcity scores reflect March 2026 BMFFFL roster construction. Ratings are qualitative assessments based on available starting-quality depth at each position.
              Premium percentages are estimated adjustments, not hard formulas. Bimfle assessments are final.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
