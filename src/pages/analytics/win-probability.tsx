import { useState } from 'react';
import Head from 'next/head';
import { TrendingUp, Trophy, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';
import Tooltip from '@/components/ui/Tooltip';

// ─── Types ────────────────────────────────────────────────────────────────────

type Outcome = 'Champion' | 'Runner-Up' | 'Semi-Final' | 'Quarter-Final' | 'Missed';

interface TeamData {
  name: string;
  seed: number;
  record: string;
  outcome: Outcome;
  color: string;
  bgColor: string;
  borderColor: string;
  probabilities: number[]; // weeks 1–17
  isChampion?: boolean;
}

// ─── 2025 Season Data ─────────────────────────────────────────────────────────

const TEAMS_2025: TeamData[] = [
  {
    name: 'Tubes94',
    seed: 1,
    record: '11-3',
    outcome: 'Runner-Up',
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/8',
    borderColor: 'border-rose-400/40',
    probabilities: [55, 58, 62, 65, 70, 72, 75, 80, 82, 85, 88, 90, 92, 94, 95, 75, 0],
  },
  {
    name: 'MLSchools12',
    seed: 2,
    record: '11-3',
    outcome: 'Semi-Final',
    color: 'text-[#ffd700]',
    bgColor: 'bg-[#ffd700]/8',
    borderColor: 'border-[#ffd700]/40',
    probabilities: [65, 68, 70, 72, 74, 76, 78, 80, 83, 85, 88, 90, 90, 90, 90, 45, 0],
  },
  {
    name: 'JuicyBussy',
    seed: 3,
    record: '9-5',
    outcome: 'Semi-Final',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/8',
    borderColor: 'border-emerald-400/40',
    probabilities: [45, 42, 48, 50, 52, 55, 58, 60, 62, 65, 68, 65, 70, 72, 75, 35, 0],
  },
  {
    name: 'tdtd19844',
    seed: 5,
    record: '8-6',
    outcome: 'Champion',
    color: 'text-[#ffd700]',
    bgColor: 'bg-[#ffd700]/10',
    borderColor: 'border-[#ffd700]/60',
    probabilities: [30, 28, 32, 35, 38, 40, 38, 42, 45, 48, 50, 52, 55, 58, 60, 75, 100],
    isChampion: true,
  },
  {
    name: 'SexMachineAndyD',
    seed: 4,
    record: '9-5',
    outcome: 'Quarter-Final',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/8',
    borderColor: 'border-blue-400/40',
    probabilities: [50, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 72, 70, 72, 70, 0, 0],
  },
  {
    name: 'Cmaleski',
    seed: 6,
    record: '7-7',
    outcome: 'Quarter-Final',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/8',
    borderColor: 'border-indigo-400/40',
    probabilities: [25, 22, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 0, 0],
  },
];

const WEEKS = Array.from({ length: 17 }, (_, i) => i + 1);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCellColor(prob: number, isChampion: boolean): string {
  if (prob === 100) return 'bg-[#ffd700] text-[#0d1b2a]';
  if (prob === 0)   return 'bg-[#2d4a66]/30 text-slate-600';
  if (isChampion) {
    if (prob >= 70) return 'bg-amber-500/30 text-amber-300';
    if (prob >= 50) return 'bg-amber-500/20 text-amber-400';
    if (prob >= 30) return 'bg-amber-500/12 text-amber-500';
    return 'bg-amber-500/8 text-amber-600';
  }
  if (prob >= 80) return 'bg-emerald-500/30 text-emerald-300';
  if (prob >= 60) return 'bg-emerald-500/20 text-emerald-400';
  if (prob >= 50) return 'bg-emerald-500/12 text-emerald-400';
  if (prob >= 35) return 'bg-slate-400/15 text-slate-400';
  return 'bg-[#e94560]/15 text-[#e94560]';
}

function getOutcomeBadge(outcome: Outcome): string {
  switch (outcome) {
    case 'Champion':      return 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40';
    case 'Runner-Up':     return 'bg-slate-400/15 text-slate-300 border border-slate-400/30';
    case 'Semi-Final':    return 'bg-blue-500/15 text-blue-300 border border-blue-400/30';
    case 'Quarter-Final': return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
    default:              return 'bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30';
  }
}

// The week a team first crossed 50% probability (playoff clinch-ish moment)
function firstClinchWeek(probs: number[]): number | null {
  const idx = probs.findIndex(p => p >= 50);
  return idx >= 0 ? idx + 1 : null;
}

// ─── Mini Sparkline Bar Chart ─────────────────────────────────────────────────

function SparkBars({ probs, isChampion }: { probs: number[]; isChampion?: boolean }) {
  return (
    <div className="flex items-end gap-px h-6" aria-hidden="true">
      {probs.map((p, i) => {
        const height = Math.max(p, 2);
        const color = p === 0
          ? 'bg-slate-700'
          : p === 100
          ? 'bg-[#ffd700]'
          : isChampion
          ? 'bg-amber-500'
          : p >= 60
          ? 'bg-emerald-500'
          : p >= 40
          ? 'bg-slate-400'
          : 'bg-[#e94560]';
        return (
          <div
            key={i}
            className="flex-1 flex items-end"
            title={`Wk ${i + 1}: ${p}%`}
          >
            <div
              className={cn('w-full rounded-sm transition-all', color)}
              style={{ height: `${height}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WinProbabilityPage() {
  const [selectedSeason] = useState(2025);
  const [highlightedTeam, setHighlightedTeam] = useState<string | null>(null);

  const teams = TEAMS_2025;

  // Sort: champion first, then by outcome, then by seed
  const outcomeOrder: Record<Outcome, number> = {
    Champion: 0,
    'Runner-Up': 1,
    'Semi-Final': 2,
    'Quarter-Final': 3,
    Missed: 4,
  };
  const sorted = [...teams].sort((a, b) => {
    const diff = outcomeOrder[a.outcome] - outcomeOrder[b.outcome];
    return diff !== 0 ? diff : a.seed - b.seed;
  });

  return (
    <>
      <Head>
        <title>Win Probability Chart — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Week-by-week playoff probability chart for all BMFFFL managers in the 2025 season. Track how championship odds evolved throughout the year."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Win Probability Chart
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            2025 Season &mdash; Playoff probability by week
          </p>
        </header>

        {/* Season selector */}
        <div className="mb-8 flex flex-wrap gap-3 items-center">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Season</span>
          <button
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150',
              selectedSeason === 2025
                ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
            )}
            aria-pressed={selectedSeason === 2025}
          >
            2025
          </button>
          <span className="text-xs text-slate-600 italic">(historical seasons coming in future updates)</span>
        </div>

        {/* Legend */}
        <div className="mb-6 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Probability heat guide</p>
          <div className="flex flex-wrap gap-2 items-center" aria-label="Color legend">
            {[
              { label: '100% — Champion', cls: 'bg-[#ffd700] border-[#ffd700]', textCls: 'text-[#0d1b2a]' },
              { label: '≥ 80%', cls: 'bg-emerald-500/30 border-emerald-500/40', textCls: 'text-emerald-300' },
              { label: '60–79%', cls: 'bg-emerald-500/20 border-emerald-500/30', textCls: 'text-emerald-400' },
              { label: '50–59%', cls: 'bg-emerald-500/12 border-emerald-500/20', textCls: 'text-emerald-400' },
              { label: '35–49%', cls: 'bg-slate-400/15 border-slate-400/20', textCls: 'text-slate-400' },
              { label: '< 35%', cls: 'bg-[#e94560]/15 border-[#e94560]/20', textCls: 'text-[#e94560]' },
              { label: '0% / Eliminated', cls: 'bg-[#2d4a66]/30 border-[#2d4a66]', textCls: 'text-slate-600' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={cn('w-4 h-4 rounded-sm shrink-0 border', item.cls)} aria-hidden="true" />
                <span className="text-[11px] text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            Cells with a <span className="text-white font-semibold">white ring</span> mark the first week a team crossed 50% playoff probability.
          </p>
        </div>

        {/* Main heatmap table */}
        <section aria-label="Win probability heatmap">
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Playoff probability by week, 2025 season">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    {/* Manager col */}
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider sticky left-0 bg-[#0f2744] z-10 min-w-[140px]"
                    >
                      Manager
                    </th>
                    {/* Week columns */}
                    {WEEKS.map(w => (
                      <th
                        key={w}
                        scope="col"
                        className={cn(
                          'px-1.5 py-3 text-center text-xs font-semibold uppercase tracking-wider w-10',
                          w >= 16 ? 'text-[#ffd700]' : 'text-slate-400'
                        )}
                      >
                        {w >= 16 ? `PO${w - 15}` : `W${w}`}
                      </th>
                    ))}
                    {/* Outcome col */}
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-28"
                    >
                      Outcome
                    </th>
                    {/* Trend col */}
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-28 hidden sm:table-cell"
                    >
                      <Tooltip tip="Probability arc shows how each team's championship win probability evolved week by week throughout the season. Taller bars = higher probability.">
                        <span>Arc</span>
                      </Tooltip>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {sorted.map((team, idx) => {
                    const isHighlighted = highlightedTeam === team.name;
                    const isDimmed = highlightedTeam !== null && !isHighlighted;
                    const clinchWeek = firstClinchWeek(team.probabilities);
                    const isEven = idx % 2 === 0;

                    return (
                      <tr
                        key={team.name}
                        className={cn(
                          'transition-all duration-150 cursor-pointer',
                          isDimmed ? 'opacity-25' : '',
                          isHighlighted
                            ? cn(team.bgColor, 'ring-1 ring-inset', team.borderColor)
                            : isEven
                            ? 'bg-[#1a2d42] hover:bg-[#1f3550]'
                            : 'bg-[#162638] hover:bg-[#1f3550]'
                        )}
                        onClick={() => setHighlightedTeam(highlightedTeam === team.name ? null : team.name)}
                        role="button"
                        aria-label={`Toggle highlight for ${team.name}`}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setHighlightedTeam(highlightedTeam === team.name ? null : team.name);
                          }
                        }}
                      >
                        {/* Manager name cell */}
                        <td className={cn(
                          'px-4 py-3 sticky left-0 z-10',
                          isHighlighted ? team.bgColor : isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}>
                          <div className="flex items-center gap-1.5">
                            {team.isChampion && (
                              <Trophy className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-label="Champion" />
                            )}
                            <span className={cn('text-sm font-bold leading-tight', team.color)}>
                              {team.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-500 font-mono">{team.record}</span>
                            <span className="text-[10px] text-slate-600">&bull;</span>
                            <span className="text-[10px] text-slate-500">Seed {team.seed}</span>
                          </div>
                        </td>

                        {/* Probability cells */}
                        {team.probabilities.map((prob, weekIdx) => {
                          const week = weekIdx + 1;
                          const isClinch = week === clinchWeek;
                          const cellColor = getCellColor(prob, !!team.isChampion);
                          return (
                            <td
                              key={week}
                              className="px-1 py-2 text-center"
                              title={`${team.name} — Week ${week}: ${prob}%${isClinch ? ' (crossed 50%)' : ''}`}
                            >
                              <span
                                className={cn(
                                  'inline-flex items-center justify-center w-8 h-7 rounded text-[10px] font-bold tabular-nums leading-none',
                                  cellColor,
                                  isClinch && 'ring-2 ring-white/60 ring-offset-1 ring-offset-transparent'
                                )}
                              >
                                {prob === 0 ? '—' : `${prob}`}
                              </span>
                            </td>
                          );
                        })}

                        {/* Outcome badge */}
                        <td className="px-3 py-3 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-bold leading-none whitespace-nowrap',
                              getOutcomeBadge(team.outcome)
                            )}
                          >
                            {team.isChampion && '🏆 '}{team.outcome}
                          </span>
                        </td>

                        {/* Sparkline arc */}
                        <td className="px-3 py-3 hidden sm:table-cell">
                          <SparkBars probs={team.probabilities} isChampion={team.isChampion} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Column header note */}
        <p className="text-[11px] text-slate-600 mt-2 px-1">
          W1–W15 = Regular season weeks. PO1 = Quarterfinal round, PO2 = Championship game.
          Highlighted cells with white rings mark each team&apos;s first week crossing 50% playoff probability.
        </p>

        {/* tdtd19844 champion callout */}
        <section
          className="mt-8 rounded-xl border border-[#ffd700]/40 bg-[#ffd700]/5 px-5 py-5"
          aria-label="Bimfle's championship note"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-[#ffd700] mb-1 uppercase tracking-widest">Bimfle Note</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                The most improbable championship trajectory in BMFFFL history belongs to{' '}
                <span className="text-amber-300 font-bold">tdtd19844</span>. Your Commissioner&apos;s
                probability model assigned them a{' '}
                <span className="text-white font-bold">3% championship probability</span> in Week 1.
                Bimfle has since recalibrated.{' '}
                <span className="text-slate-400 italic">~Love, Bimfle.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Notable arcs */}
        <section className="mt-8" aria-labelledby="arcs-heading">
          <h2
            id="arcs-heading"
            className="text-lg font-bold text-white mb-4 flex items-center gap-2"
          >
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            Probability Arc Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'The Comeback King',
                team: 'tdtd19844',
                color: 'text-amber-400',
                border: 'border-amber-400/30',
                bg: 'bg-amber-400/5',
                summary:
                  'Started at 30% playoff odds — below every other playoff team. Crossed 50% only in Week 11. Exploded to 75% in the QF round, then 100%. The most dramatic probability arc in BMFFFL history.',
              },
              {
                title: 'The Favorite Falters',
                team: 'Tubes94',
                color: 'text-rose-400',
                border: 'border-rose-400/30',
                bg: 'bg-rose-400/5',
                summary:
                  'Peaked at 95% entering playoffs as the #1 seed. Dropped to 75% after a semifinal scare, then to 0% — the highest-probability collapse in league history. Runner-up heartbreak.',
              },
              {
                title: 'The Dominant Exit',
                team: 'MLSchools12',
                color: 'text-yellow-400',
                border: 'border-yellow-400/30',
                bg: 'bg-yellow-400/5',
                summary:
                  'Led the league in probability from Week 1 through Week 15. Flat-lined at 90% for three straight weeks — then the upset hit. From 90% to eliminated in one week.',
              },
              {
                title: 'The Volatile Contender',
                team: 'JuicyBussy',
                color: 'text-emerald-400',
                border: 'border-emerald-400/30',
                bg: 'bg-emerald-400/5',
                summary:
                  'Week 2 dipped to 42% — near the bottom of playoff teams — before a steady 13-week climb to 75%. Then a first-round semifinal exit dropped them back to 35% and eventually 0%.',
              },
              {
                title: 'The Early Exit',
                team: 'SexMachineAndyD',
                color: 'text-blue-400',
                border: 'border-blue-400/30',
                bg: 'bg-blue-400/5',
                summary:
                  'Built steadily to 75% by Week 11, then wobbled slightly before playoff entry. Eliminated in the quarterfinals — probability dropped from 70% to 0% immediately.',
              },
              {
                title: 'The Long Shot',
                team: 'Cmaleski',
                color: 'text-indigo-400',
                border: 'border-indigo-400/30',
                bg: 'bg-indigo-400/5',
                summary:
                  'Started at just 25% and spent most of the season under 50%. Finally crossed the threshold in Week 12 and peaked at 58% before playoff entry — then QF elimination ended the run.',
              },
            ].map(arc => (
              <div key={arc.title} className={cn('rounded-xl border p-4', arc.border, arc.bg)}>
                <p className={cn('text-xs font-bold uppercase tracking-widest mb-1', arc.color)}>
                  {arc.title}
                </p>
                <p className="text-sm font-semibold text-white mb-2">{arc.team}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{arc.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-8 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Methodology:</span> Probabilities are
            curated weekly snapshots from Bimfle&apos;s playoff probability model, incorporating
            record, strength of schedule, remaining games, and historical performance patterns.
            Weeks 16–17 represent playoff rounds (QF/SF and Championship respectively).
            Click any row to highlight that manager&apos;s probability arc.
          </p>
        </div>

      </div>
    </>
  );
}
