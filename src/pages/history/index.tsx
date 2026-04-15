import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Star, TrendingUp, Award, BookOpen, Scroll, Users, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Hardcoded League Data ────────────────────────────────────────────────────

interface ChampionEntry {
  year: number;
  owner: string;
  tagline: string;
  record?: string;
  championship?: string;
}

// Champions validated 2026-04-14 (Sleeper era 2020-2025) and 2026-04-15 (ESPN era 2016-2019).
// ESPN era: validated via ESPN leagueHistory API (league 945797, rankCalculatedFinal=1).
// Runner-up mappings: chrisrioux=Grandes, mrio19=rbr, drc1183=Cogdeill11, vieyramf@sbu.edu=SexMachineAndyD.
const CHAMPIONS: ChampionEntry[] = [
  {
    year: 2016,
    owner: 'MLSchools12',
    tagline: 'Dynasty begins — the inaugural ESPN-era champion',
    championship: 'def. Grandes 155.98–136.56',
  },
  {
    year: 2017,
    owner: 'Cogdeill11',
    tagline: 'The 5-seed Cinderella — biggest upset in league history',
    championship: 'def. eldge19 109.32–89.54',
  },
  {
    year: 2018,
    owner: 'SexMachineAndyD',
    tagline: 'The one and only ring — nobody saw it coming',
    championship: 'def. MLSchools12 138.66–106.80',
  },
  {
    year: 2019,
    owner: 'MLSchools12',
    tagline: '197.98 championship points — dynasty dominates',
    championship: 'def. rbr 197.98–164.24',
  },
  {
    year: 2020,
    owner: 'Cogdeill11',
    tagline: 'Inaugural Sleeper-era champion',
    championship: 'def. eldridsm 203.10–198.34',
  },
  {
    year: 2021,
    owner: 'MLSchools12',
    tagline: 'The Murder Boners — dynasty resurgent',
    championship: 'def. SexMachineAndyD 193.10–111.34',
  },
  {
    year: 2022,
    owner: 'Grandes',
    tagline: 'Commissioner takes the crown',
    championship: 'def. rbr 137.82–115.08',
  },
  {
    year: 2023,
    owner: 'JuicyBussy',
    tagline: 'Most explosive championship run ever',
    championship: 'def. eldridm20 179.40–149.62',
  },
  {
    year: 2024,
    owner: 'MLSchools12',
    tagline: 'The Murder Boners — back on top',
    championship: 'def. SexMachineAndyD 168.40–146.86',
  },
  {
    year: 2025,
    owner: 'tdtd19844',
    tagline: 'The ultimate dark horse — THE Shameful Saggy sack',
    championship: 'def. Tubes94 152.92–135.08',
  },
];

interface OwnerRecord {
  owner: string;
  rings: number;
  playoffApps: number;
  wins: number;
  losses: number;
  note?: string;
}

// Records: Sleeper era (2020-2025) from Convex prod getOwnerCareerStats.
// Rings include ESPN era (2016-2019): MLSchools12 +2 (2016,2019), Cogdeill11 +1 (2017), SexMachineAndyD +1 (2018).
const ALL_TIME_RECORDS: OwnerRecord[] = [
  { owner: 'MLSchools12',     rings: 4, playoffApps: 6, wins: 68, losses: 15, note: '4x champion (2016, 2019, 2021, 2024)' },
  { owner: 'Cogdeill11',      rings: 2, playoffApps: 3, wins: 38, losses: 45, note: '2x champion (2017, 2020)' },
  { owner: 'SexMachineAndyD', rings: 1, playoffApps: 5, wins: 50, losses: 33, note: '2018 champion, 2x runner-up' },
  { owner: 'JuicyBussy',      rings: 1, playoffApps: 4, wins: 46, losses: 37, note: '2023 champion' },
  { owner: 'Grandes',         rings: 1, playoffApps: 3, wins: 42, losses: 41, note: '2022 champion — commissioner' },
  { owner: 'tdtd19844',       rings: 1, playoffApps: 3, wins: 36, losses: 47, note: '2025 champion' },
  { owner: 'rbr',             rings: 0, playoffApps: 5, wins: 44, losses: 39, note: '2022 runner-up' },
  { owner: 'eldridsm',        rings: 0, playoffApps: 3, wins: 41, losses: 42, note: '2020 runner-up' },
  { owner: 'eldridm20',       rings: 0, playoffApps: 3, wins: 39, losses: 44, note: '2023 runner-up' },
  { owner: 'Tubes94',         rings: 0, playoffApps: 3, wins: 34, losses: 36, note: '2025 runner-up' },
  { owner: 'Cmaleski',        rings: 0, playoffApps: 2, wins: 36, losses: 47 },
  { owner: 'MCSchools',       rings: 0, playoffApps: 0, wins: 20, losses: 63 },
];

interface Milestone {
  icon: 'trophy' | 'stat' | 'record' | 'star';
  label: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    icon: 'stat',
    label: 'Highest Single-Week Score',
    description: 'JuicyBussy — 245.80 pts (2021 Consolation)',
  },
  {
    icon: 'record',
    label: 'Only 0-14 Season',
    description: 'MCSchools — 2021',
  },
  {
    icon: 'trophy',
    label: 'Most Championships',
    description: 'MLSchools12 — 4 rings (2016, 2019, 2021, 2024)',
  },
  {
    icon: 'star',
    label: 'First Sleeper-Era Champion',
    description: 'Cogdeill11 — 2020 inaugural Sleeper season',
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

function winPct(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return '.000';
  return (wins / total).toFixed(3).replace('0.', '.');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MilestoneIcon({ type }: { type: Milestone['icon'] }) {
  const cls = 'w-5 h-5 shrink-0';
  if (type === 'trophy')  return <Trophy  className={cn(cls, 'text-[#ffd700]')} aria-hidden="true" />;
  if (type === 'stat')    return <TrendingUp className={cn(cls, 'text-[#e94560]')} aria-hidden="true" />;
  if (type === 'record')  return <Award   className={cn(cls, 'text-cyan-400')}    aria-hidden="true" />;
  return                         <Star    className={cn(cls, 'text-purple-400')}  aria-hidden="true" />;
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function HistoryPage() {
  return (
    <>
      <Head>
        <title>League History — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL dynasty fantasy football league history — champions, all-time records, and key milestones from 2016 to present."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <header className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            All-Time Records
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
            League History
          </h1>
          <p className="text-slate-400 text-lg">
            BMFFFL &bull; 2016 &ndash; Present
          </p>
        </header>

        {/* ── Champion Timeline ─────────────────────────────────────────── */}
        <section
          className="mb-16"
          aria-labelledby="timeline-heading"
        >
          <h2
            id="timeline-heading"
            className="text-2xl font-black text-white mb-6"
          >
            Champion Timeline
          </h2>

          {/* Horizontal scroll on mobile, 3-col grid on desktop */}
          <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:mx-0 sm:px-0">
            <div className="flex gap-4 pb-4 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-3 sm:gap-5 w-max sm:w-auto">
              {CHAMPIONS.map((c, idx) => {
                const isLatest = idx === CHAMPIONS.length - 1;
                return (
                  <Link
                    key={c.year}
                    href={`/history/${c.year}`}
                    className={cn(
                      'group relative flex flex-col rounded-xl border p-5 min-w-[220px] sm:min-w-0',
                      'bg-[#16213e] transition-all duration-200',
                      'hover:border-[#ffd700]/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40',
                      isLatest
                        ? 'border-[#ffd700]/40 shadow-lg shadow-[#ffd700]/5'
                        : 'border-[#2d4a66]'
                    )}
                    aria-label={`${c.year} season — champion: ${c.owner}`}
                  >
                    {/* "Reigning" badge for latest */}
                    {isLatest && (
                      <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-[#ffd700] text-[#1a1a2e] text-[10px] font-black uppercase tracking-wider">
                        Reigning
                      </span>
                    )}

                    {/* Year */}
                    <span className="text-4xl font-black text-[#ffd700] leading-none tabular-nums mb-3">
                      {c.year}
                    </span>

                    {/* Owner */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
                      <span className="text-white font-bold text-sm">{c.owner}</span>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-slate-400 leading-snug mb-3 flex-1">
                      {c.tagline}
                    </p>

                    {/* Optional record / championship note */}
                    {(c.record || c.championship) && (
                      <div className="border-t border-[#2d4a66] pt-2 mt-auto space-y-0.5">
                        {c.record && (
                          <p className="text-xs text-slate-500 font-mono">{c.record}</p>
                        )}
                        {c.championship && (
                          <p className="text-xs text-slate-500">{c.championship}</p>
                        )}
                      </div>
                    )}

                    {/* Hover cue */}
                    <span className="mt-3 text-[10px] text-slate-600 group-hover:text-[#ffd700] transition-colors duration-150 uppercase tracking-wider font-semibold">
                      View Season &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── All-Time Records Table ────────────────────────────────────── */}
        <section
          className="mb-16"
          aria-labelledby="records-heading"
        >
          <h2
            id="records-heading"
            className="text-2xl font-black text-white mb-6"
          >
            All-Time Records
          </h2>

          <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
            <div className="overflow-x-auto">
              <table
                className="min-w-full text-sm"
                aria-label="All-time owner records"
              >
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[140px]">
                      Owner
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
                      Rings
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-20">
                      Playoffs
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
                      W
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
                      L
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
                      Pct
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[120px]">
                      Note
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#1e3347]">
                  {ALL_TIME_RECORDS.map((r, idx) => {
                    const isEven = idx % 2 === 0;
                    const isTopOwner = r.owner === 'Cogdeill11';
                    const hasRings = r.rings > 0;

                    return (
                      <tr
                        key={r.owner}
                        className={cn(
                          'transition-colors duration-100 hover:bg-[#1f3550]',
                          isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                          isTopOwner && 'ring-1 ring-inset ring-[#ffd700]/20'
                        )}
                      >
                        {/* Owner name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'font-semibold',
                                isTopOwner ? 'text-[#ffd700]' : 'text-white'
                              )}
                            >
                              {r.owner}
                            </span>
                            {isTopOwner && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] font-bold uppercase tracking-wider border border-[#ffd700]/30">
                                GOAT
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Rings */}
                        <td className="px-4 py-3 text-center">
                          {r.rings > 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-[#ffd700] font-bold">
                              {Array.from({ length: r.rings }).map((_, i) => (
                                <Trophy key={i} className="w-3.5 h-3.5" aria-hidden="true" />
                              ))}
                              <span className="ml-1 text-sm">{r.rings}</span>
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>

                        {/* Playoff appearances */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              'font-semibold text-sm',
                              r.playoffApps >= 4
                                ? 'text-[#22c55e]'
                                : r.playoffApps >= 2
                                ? 'text-slate-300'
                                : 'text-slate-500'
                            )}
                          >
                            {r.playoffApps}
                          </span>
                        </td>

                        {/* Wins */}
                        <td className="px-4 py-3 text-center font-mono font-semibold text-[#22c55e]">
                          {r.wins}
                        </td>

                        {/* Losses */}
                        <td className="px-4 py-3 text-center font-mono font-semibold text-[#ef4444]">
                          {r.losses}
                        </td>

                        {/* Win % */}
                        <td className="px-4 py-3 text-center font-mono text-slate-300 tabular-nums">
                          {winPct(r.wins, r.losses)}
                        </td>

                        {/* Note */}
                        <td className="px-4 py-3 text-xs text-slate-500 italic">
                          {r.note ?? ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Key Milestones ───────────────────────────────────────────── */}
        <section
          className="mb-16"
          aria-labelledby="milestones-heading"
        >
          <h2
            id="milestones-heading"
            className="text-2xl font-black text-white mb-6"
          >
            Key Milestones
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MILESTONES.map((m) => (
              <li
                key={m.label}
                className="flex items-start gap-4 rounded-xl bg-[#16213e] border border-[#2d4a66] p-5"
              >
                <div className="mt-0.5">
                  <MilestoneIcon type={m.icon} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{m.label}</p>
                  <p className="text-sm text-slate-400 leading-snug">{m.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Moodie Bowl ──────────────────────────────────────────────── */}
        <section
          className="mb-16"
          aria-labelledby="moodie-bowl-heading"
        >
          <h2
            id="moodie-bowl-heading"
            className="text-2xl font-black text-white mb-6 flex items-center gap-3"
          >
            <span className="text-2xl" role="img" aria-label="toilet">🚽</span>
            The Moodie Bowl
          </h2>

          <div className="rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 p-6">
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Every dynasty has its glory — and its basement. The{' '}
              <span className="text-white font-bold">Moodie Bowl</span> is BMFFFL&apos;s
              toilet-bowl tradition: the two lowest finishers at season&apos;s end battle for the
              dubious honor of not being last. Year after year, two managers have made this
              matchup their annual home.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Tubes94 */}
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-white font-black text-base leading-tight">Tubes94</p>
                    <p className="text-xs text-[#e94560] font-semibold uppercase tracking-wider">Moodie Bowl Veteran</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Joined in 2022 and has been a consistent presence at the wrong end of the
                  standings. Despite flashes of competence — including a lone playoff appearance —
                  Tubes94 has an uncanny ability to collapse at the worst time and find himself
                  staring down the toilet bowl bracket.
                </p>
              </div>

              {/* Escuelas */}
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-white font-black text-base leading-tight">Escuelas</p>
                    <p className="text-xs text-[#e94560] font-semibold uppercase tracking-wider">Moodie Bowl Veteran</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  A founding member of the league and, unfortunately, a founding member of the
                  bottom tier. Escuelas has been the other half of the Moodie Bowl equation more
                  often than not — holding down the 1.12 pick in rookie drafts and the last seed
                  in the playoff race with impressive regularity.
                </p>
              </div>
            </div>

            <p className="text-slate-500 text-xs italic">
              The Moodie Bowl is contested annually between the two lowest-seeded teams not in the
              championship bracket. Bragging rights for &ldquo;not last&rdquo; are fiercely
              defended.
            </p>
          </div>
        </section>

        {/* ── League Lore & Constitution ───────────────────────────────── */}
        <section
          className="mb-16"
          aria-labelledby="league-lore-heading"
        >
          <h2
            id="league-lore-heading"
            className="text-2xl font-black text-white mb-6"
          >
            League Resources
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* League Lore */}
            <Link
              href="/league-lore"
              className={cn(
                'group flex items-start gap-4 rounded-xl border p-6',
                'bg-[#16213e] border-[#2d4a66]',
                'hover:border-[#ffd700]/50 hover:bg-[#1a2d42] hover:-translate-y-0.5',
                'transition-all duration-200'
              )}
              aria-label="Read League Lore"
            >
              <div className="w-11 h-11 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-black text-base group-hover:text-[#ffd700] transition-colors duration-150">
                    League Lore
                  </p>
                  <span className="text-slate-600 group-hover:text-[#ffd700] transition-colors duration-150 text-sm">
                    &rarr;
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The stories, rivalries, trades, and moments that define BMFFFL history. Who
                  won the infamous trade war of 2022? Why does everyone hate the 1.01?
                  Find out here.
                </p>
              </div>
            </Link>

            {/* Constitution */}
            <Link
              href="/constitution"
              className={cn(
                'group flex items-start gap-4 rounded-xl border p-6',
                'bg-[#16213e] border-[#2d4a66]',
                'hover:border-[#ffd700]/50 hover:bg-[#1a2d42] hover:-translate-y-0.5',
                'transition-all duration-200'
              )}
              aria-label="Read the League Constitution"
            >
              <div className="w-11 h-11 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center shrink-0">
                <Scroll className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-black text-base group-hover:text-[#ffd700] transition-colors duration-150">
                    Constitution
                  </p>
                  <span className="text-slate-600 group-hover:text-[#ffd700] transition-colors duration-150 text-sm">
                    &rarr;
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The official rules and bylaws of BMFFFL. Scoring settings, trade deadlines,
                  keeper rules, and the sacred clauses that govern every decision in the league.
                </p>
              </div>
            </Link>

            {/* Shame Board */}
            <Link
              href="/history/shame-board"
              className={cn(
                'group flex items-start gap-4 rounded-xl border p-6',
                'bg-[#16213e] border-[#2d4a66]',
                'hover:border-[#e94560]/50 hover:bg-[#1a2d42] hover:-translate-y-0.5',
                'transition-all duration-200'
              )}
              aria-label="View the Shame Board — Bottom Dwellers Hall of Dishonor"
            >
              <div className="w-11 h-11 rounded-lg bg-[#e94560]/10 border border-[#e94560]/20 flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-black text-base group-hover:text-[#e94560] transition-colors duration-150">
                    Shame Board
                  </p>
                  <span className="text-slate-600 group-hover:text-[#e94560] transition-colors duration-150 text-sm">
                    &rarr;
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The Bottom Dwellers Hall of Dishonor. Moodie Bowl results, the worst seasons
                  in BMFFFL history, and the greatest rebuild arcs that rose from the basement.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Season Archive Links ─────────────────────────────────────── */}
        <section
          aria-labelledby="archives-heading"
        >
          <h2
            id="archives-heading"
            className="text-2xl font-black text-white mb-6"
          >
            Season Archives
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CHAMPIONS.map((c) => (
              <Link
                key={c.year}
                href={`/history/${c.year}`}
                className={cn(
                  'group flex flex-col items-center justify-center gap-2 rounded-xl border p-5',
                  'bg-[#16213e] transition-all duration-200',
                  'hover:border-[#ffd700]/60 hover:bg-[#1a2d42] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30',
                  'border-[#2d4a66]'
                )}
                aria-label={`${c.year} season archive`}
              >
                <span className="text-3xl font-black text-[#ffd700] tabular-nums group-hover:scale-105 transition-transform duration-150">
                  {c.year}
                </span>
                <span className="text-xs text-slate-400 text-center leading-snug">
                  {c.owner}
                </span>
                <Trophy
                  className="w-4 h-4 text-slate-600 group-hover:text-[#ffd700] transition-colors duration-150"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
