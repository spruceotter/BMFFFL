import Head from 'next/head';
import { MapPin, TrendingUp, TrendingDown, Info, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface LandingSpotEntry {
  name: string;
  pos: Position;
  college: string;
  topMock: string;
  confirmedTeam: string | null;
  dynastyImpact: string;
}

interface TeamSituation {
  team: string;
  bestFor: string;
  reason: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const LANDING_SPOTS: LandingSpotEntry[] = [
  {
    name: 'Jeremiyah Love',
    pos: 'RB',
    college: 'Notre Dame',
    topMock: 'Pick 3–8 (multiple teams)',
    confirmedTeam: null,
    dynastyImpact: 'Any top-10 team elevates floor. Avoid low-volume offenses (NYG, CAR).',
  },
  {
    name: 'Ryan Williams',
    pos: 'WR',
    college: 'Alabama',
    topMock: 'Top 15',
    confirmedTeam: null,
    dynastyImpact: 'Landing spot crucial — needs pass-heavy offense. BUF, DET, LAC ideal.',
  },
  {
    name: 'Makai Lemon',
    pos: 'WR',
    college: 'USC',
    topMock: 'Round 1–2',
    confirmedTeam: null,
    dynastyImpact: 'Elite hands = scheme-independent. Any landing spot works.',
  },
  {
    name: 'TreVeyon Henderson',
    pos: 'RB',
    college: 'Ohio State',
    topMock: 'Round 1–2',
    confirmedTeam: null,
    dynastyImpact: 'Needs feature-back role. Watch GB, NE, CHI.',
  },
  {
    name: 'Kenyon Sadiq',
    pos: 'TE',
    college: 'Oregon',
    topMock: 'Top 20',
    confirmedTeam: null,
    dynastyImpact: 'TE landing spots matter less — receiving TEs produce everywhere.',
  },
  {
    name: 'Eli Stowers',
    pos: 'TE',
    college: 'Vanderbilt',
    topMock: 'Round 1–2',
    confirmedTeam: null,
    dynastyImpact: 'Combine metrics suggest immediate starting role possible. SF/PIT ideal.',
  },
  {
    name: 'Jayden Higgins',
    pos: 'WR',
    college: 'Iowa State',
    topMock: 'Round 1–2',
    confirmedTeam: null,
    dynastyImpact: 'Physical WR. Needs QB who can throw to his size (6\'4").',
  },
  {
    name: 'Will Howard',
    pos: 'QB',
    college: 'Ohio State',
    topMock: 'Round 1–2',
    confirmedTeam: null,
    dynastyImpact: 'SF value depends on landing. Avoid bad OL situations. KC/SEA ideal.',
  },
  {
    name: 'Jack Bech',
    pos: 'WR',
    college: 'TCU',
    topMock: 'Round 1–3',
    confirmedTeam: null,
    dynastyImpact: 'High-floor WR. Any pass-heavy team works.',
  },
  {
    name: 'Damien Martinez',
    pos: 'RB',
    college: 'Oregon',
    topMock: 'Round 2–3',
    confirmedTeam: null,
    dynastyImpact: 'Power RB needs goal-line role. Watch teams with aging starter.',
  },
];

const BEST_SITUATIONS: TeamSituation[] = [
  { team: 'BUF', bestFor: 'WR',     reason: 'Josh Allen provides elite QB support. Wide open target share at WR after recent turnover.' },
  { team: 'DET', bestFor: 'RB / TE', reason: 'Run-heavy scheme with elite OL. Consistent TE usage under Ben Johnson system.' },
  { team: 'KC',  bestFor: 'WR',     reason: 'Mahomes keeps any receiver relevant. WR1 role wide open heading into 2026.' },
  { team: 'LAC', bestFor: 'RB',     reason: 'Jim Harbaugh\'s ground-and-pound system. Heavy RB usage, great OL infrastructure.' },
  { team: 'HOU', bestFor: 'Any',    reason: 'C.J. Stroud provides top-10 QB support. Growing offense with clear need at skill positions.' },
];

const WORST_SITUATIONS: TeamSituation[] = [
  { team: 'NYG', bestFor: 'QB / OL issues', reason: 'Uncertain QB situation. Weak OL limits RB ceiling and WR routes. Dynasty purgatory.' },
  { team: 'CAR', bestFor: 'Rebuild mode',   reason: 'Full organizational rebuild. Any rookie drafted here faces a multi-year development wait.' },
  { team: 'IND', bestFor: 'Post-Richardson uncertainty', reason: 'Anthony Richardson tenure in flux. Unclear QB1 means unpredictable target/touch distribution.' },
  { team: 'TEN', bestFor: 'QB flux',         reason: 'Tennessee has cycled QBs and OCs. No stable passing game identity to support a rookie WR.' },
  { team: 'NE',  bestFor: 'Belichick-adjacent', reason: 'New England has shown reluctance to deploy rookies in high-volume roles. Low immediate upside.' },
];

// ─── Shared Styles ────────────────────────────────────────────────────────────

const POS_STYLES: Record<Position, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9',
      POS_STYLES[pos]
    )}>
      {pos}
    </span>
  );
}

function StatusBadge({ confirmed }: { confirmed: boolean }) {
  if (confirmed) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
        Confirmed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border border-[#2d4a66] bg-[#0d1b2a] text-slate-500">
      Pre-Draft
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingSpotsPage() {
  return (
    <>
      <Head>
        <title>2026 Rookie Landing Spot Tracker — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 Rookie Landing Spot Tracker — pre-draft analysis of where top NFL Draft prospects will land and what it means for dynasty fantasy football."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            2026 Rookie Landing Spot Tracker
          </h1>

          {/* Status banner */}
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                Pre-Draft Analysis — Updated through March 2026
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                All landing spots are projections based on current mock drafts and team needs.
                This page will update after the 2026 NFL Draft concludes April 23&ndash;25, 2026.
              </p>
            </div>
          </div>
        </header>

        {/* ── Section 1: Top Prospects Landing Spot Table ───────────────── */}
        <section className="mb-12" aria-labelledby="prospects-table-heading">
          <h2 id="prospects-table-heading" className="text-2xl font-black text-white mb-5">
            Top Prospect Landing Spots
          </h2>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="2026 prospect landing spots">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[140px]">
                      Prospect
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-16">
                      Pos
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">
                      College
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Top Mock Landing
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[220px] hidden lg:table-cell">
                      Dynasty Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {LANDING_SPOTS.map((entry, idx) => (
                    <tr
                      key={entry.name}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      {/* Prospect */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-white text-sm leading-tight block">
                          {entry.name}
                        </span>
                        <span className="text-[11px] text-slate-500 sm:hidden">{entry.college}</span>
                        {/* Dynasty impact on mobile */}
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug lg:hidden max-w-xs">
                          {entry.dynastyImpact}
                        </p>
                      </td>

                      {/* Pos */}
                      <td className="px-4 py-3 text-center">
                        <PosBadge pos={entry.pos} />
                      </td>

                      {/* College */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-400">{entry.college}</span>
                      </td>

                      {/* Top mock */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-semibold text-slate-300 whitespace-nowrap">
                          {entry.topMock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <StatusBadge confirmed={entry.confirmedTeam !== null} />
                        {entry.confirmedTeam && (
                          <p className="text-xs font-bold text-emerald-400 mt-1">{entry.confirmedTeam}</p>
                        )}
                      </td>

                      {/* Dynasty impact — desktop */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-xs text-slate-400 leading-relaxed">{entry.dynastyImpact}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Section 2: Landing Spot Impact Guide ──────────────────────── */}
        <section className="mb-12" aria-labelledby="impact-guide-heading">
          <h2 id="impact-guide-heading" className="text-2xl font-black text-white mb-2">
            Landing Spot Impact Guide
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Best and worst NFL team situations for incoming 2026 rookies — based on target share availability,
            QB quality, and OL ranking.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Best situations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white">5 Best Situations</h3>
              </div>
              <div className="space-y-3">
                {BEST_SITUATIONS.map((sit, idx) => (
                  <div
                    key={sit.team}
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 flex gap-3"
                  >
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-black text-emerald-400 tabular-nums">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-emerald-400 text-base">{sit.team}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold uppercase tracking-wider">
                          Best for: {sit.bestFor}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{sit.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worst situations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-[#e94560] shrink-0" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white">5 Worst Situations</h3>
              </div>
              <div className="space-y-3">
                {WORST_SITUATIONS.map((sit, idx) => (
                  <div
                    key={sit.team}
                    className="rounded-lg border border-[#e94560]/20 bg-[#e94560]/5 px-4 py-3 flex gap-3"
                  >
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-[#e94560]/20 border border-[#e94560]/30 flex items-center justify-center text-xs font-black text-[#e94560] tabular-nums">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-[#e94560] text-base">{sit.team}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-[#e94560]/30 bg-[#e94560]/10 text-[#e94560] font-semibold uppercase tracking-wider">
                          {sit.bestFor}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{sit.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Update Promise Banner ──────────────────────────────────────── */}
        <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-5 py-4 flex items-start gap-4 mb-8">
          <Calendar className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-[#ffd700] mb-1">
              Post-Draft Update Coming April 26, 2026
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              This page will be updated after the 2026 NFL Draft concludes{' '}
              <span className="font-semibold text-white">April 26, 2026</span>.
              Confirmed landing spots, post-draft dynasty impact scores, and BMFFFL roster implications
              will replace all pre-draft projections.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Mock draft projections are based on publicly available consensus information as of March 2026.
          Team need analysis reflects roster construction heading into the 2026 offseason — subject to
          free agency signings, trades, and coaching changes. Not affiliated with any NFL team or dynasty service.
        </p>

      </div>
    </>
  );
}
