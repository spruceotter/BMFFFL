import Head from 'next/head';
import { Calendar, AlertTriangle, CheckCircle, Shield, BookOpen } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ByeWeekEntry {
  week: number;
  teams: string[];
}

interface ManagerByeRisk {
  manager: string;
  highRiskWeeks: number[];
  lowRiskWeeks: number[];
  vulnerabilityScore: number; // 1–10; higher = more difficult
  keyPlayersAffected: { week: number; player: string; team: string }[];
  notes: string;
}

// ─── 2026 NFL Bye Week Data ───────────────────────────────────────────────────
// Standard 18-week season; byes run weeks 5–14 (32 teams, 4 per week roughly)

const BYE_WEEKS: ByeWeekEntry[] = [
  { week: 5,  teams: ['BUF', 'MIA', 'TB', 'LAR'] },
  { week: 6,  teams: ['KC',  'DEN', 'JAX', 'NYG'] },
  { week: 7,  teams: ['SF',  'SEA', 'PHI', 'IND'] },
  { week: 8,  teams: ['BAL', 'CLE', 'MIN', 'TEN'] },
  { week: 9,  teams: ['DAL', 'ATL', 'NE',  'LV'] },
  { week: 10, teams: ['CIN', 'PIT', 'DET', 'NO'] },
  { week: 11, teams: ['LAC', 'ARI', 'CHI', 'GB'] },
  { week: 12, teams: ['NYJ', 'CAR', 'WAS', 'HOU'] },
  { week: 13, teams: ['DEN', 'OAK', 'MIA', 'TEN'] },
  { week: 14, teams: ['KC',  'CIN', 'PHI', 'SF'] },
];

// ─── Manager Bye Week Risk Data ───────────────────────────────────────────────

const MANAGER_RISK: ManagerByeRisk[] = [
  {
    manager: 'mlschools12',
    highRiskWeeks: [7, 14],
    lowRiskWeeks: [5, 9, 11],
    vulnerabilityScore: 4,
    keyPlayersAffected: [
      { week: 7,  player: 'Brock Purdy',      team: 'SF' },
      { week: 7,  player: 'Deebo Samuel',     team: 'SF' },
      { week: 14, player: 'Travis Kelce',     team: 'KC' },
    ],
    notes: 'Two concentrated bye weeks but sufficient depth. 7 is the dangerous one with two SF pieces off the board.',
  },
  {
    manager: 'tubes94',
    highRiskWeeks: [10],
    lowRiskWeeks: [5, 6, 8, 12],
    vulnerabilityScore: 3,
    keyPlayersAffected: [
      { week: 10, player: 'Joe Burrow',        team: 'CIN' },
      { week: 10, player: 'Jamar Chase',       team: 'CIN' },
    ],
    notes: 'Highly favorable bye week spread — only one major conflict. The CIN stack in week 10 is the lone concern.',
  },
  {
    manager: 'rbr',
    highRiskWeeks: [8, 11],
    lowRiskWeeks: [6, 9],
    vulnerabilityScore: 5,
    keyPlayersAffected: [
      { week: 8,  player: 'Justin Jefferson',  team: 'MIN' },
      { week: 11, player: 'Justin Herbert',    team: 'LAC' },
      { week: 11, player: 'Keenan Allen',      team: 'LAC' },
    ],
    notes: 'LAC stack in week 11 is problematic. MIN week 8 manageable but stacks with a streaky weeks pattern.',
  },
  {
    manager: 'juicybussy',
    highRiskWeeks: [6, 9],
    lowRiskWeeks: [7, 10, 13],
    vulnerabilityScore: 5,
    keyPlayersAffected: [
      { week: 6,  player: 'Patrick Mahomes',   team: 'KC' },
      { week: 9,  player: 'CeeDee Lamb',       team: 'DAL' },
    ],
    notes: 'Loses the KC core in week 6. DAL week 9 adds pressure. Mid-range risk overall with solid depth at WR.',
  },
  {
    manager: 'cogdeill11',
    highRiskWeeks: [8, 10],
    lowRiskWeeks: [5, 6, 12],
    vulnerabilityScore: 6,
    keyPlayersAffected: [
      { week: 8,  player: 'Lamar Jackson',     team: 'BAL' },
      { week: 8,  player: 'Mark Andrews',      team: 'BAL' },
      { week: 10, player: 'Najee Harris',      team: 'PIT' },
    ],
    notes: 'Two BAL pieces disappear in week 8 simultaneously — QB + TE double-bye. Must have solid streaming options.',
  },
  {
    manager: 'tdtd19844',
    highRiskWeeks: [9],
    lowRiskWeeks: [5, 7, 11, 14],
    vulnerabilityScore: 3,
    keyPlayersAffected: [
      { week: 9,  player: 'Davante Adams',     team: 'LV' },
    ],
    notes: 'Excellent bye distribution across the season. Lone standout is LV week 9 — manageable with FAAB.',
  },
  {
    manager: 'eldridsm',
    highRiskWeeks: [7, 11, 14],
    lowRiskWeeks: [5, 9],
    vulnerabilityScore: 7,
    keyPlayersAffected: [
      { week: 7,  player: 'A.J. Brown',        team: 'PHI' },
      { week: 11, player: 'DJ Moore',          team: 'CHI' },
      { week: 14, player: 'Jalen Hurts',       team: 'PHI' },
    ],
    notes: 'PHI players scattered across two bye weeks — week 7 and 14. Three separate problem weeks total. Highest non-escuelas risk.',
  },
  {
    manager: 'eldridm20',
    highRiskWeeks: [10],
    lowRiskWeeks: [6, 7, 9, 12],
    vulnerabilityScore: 4,
    keyPlayersAffected: [
      { week: 10, player: 'George Pickens',    team: 'PIT' },
      { week: 10, player: 'Jaylen Warren',     team: 'PIT' },
    ],
    notes: 'PIT stack in week 10 is double trouble, but everything else is clean. Stream one spot and move on.',
  },
  {
    manager: 'SexMachineAndyD',
    highRiskWeeks: [6, 8],
    lowRiskWeeks: [5, 11, 14],
    vulnerabilityScore: 5,
    keyPlayersAffected: [
      { week: 6,  player: 'Javonte Williams',  team: 'DEN' },
      { week: 8,  player: 'Nick Chubb',        team: 'CLE' },
    ],
    notes: 'RB-heavy roster hurts when two RB1s hit byes in consecutive-ish weeks. Manageable if wire has depth.',
  },
  {
    manager: 'cmaleski',
    highRiskWeeks: [11, 12],
    lowRiskWeeks: [5, 7, 10],
    vulnerabilityScore: 6,
    keyPlayersAffected: [
      { week: 11, player: 'D\'Andre Swift',    team: 'CHI' },
      { week: 12, player: 'Sam LaPorta',       team: 'DET' },
      { week: 12, player: 'Amon-Ra St. Brown', team: 'DET' },
    ],
    notes: 'DET double-bye in week 12 hits hard — two starters affected. CHI week 11 adds consecutive-week strain.',
  },
  {
    manager: 'grandes',
    highRiskWeeks: [9, 12],
    lowRiskWeeks: [6, 10],
    vulnerabilityScore: 5,
    keyPlayersAffected: [
      { week: 9,  player: 'Ezekiel Elliott',   team: 'DAL' },
      { week: 12, player: 'Stefon Diggs',      team: 'HOU' },
    ],
    notes: 'Spread across different weeks — typical mid-tier challenge. Roster depth will determine how well this is managed.',
  },
  {
    manager: 'escuelas',
    highRiskWeeks: [5, 6, 7, 8],
    lowRiskWeeks: [13],
    vulnerabilityScore: 9,
    keyPlayersAffected: [
      { week: 5,  player: 'Josh Allen',        team: 'BUF' },
      { week: 6,  player: 'Isiah Pacheco',     team: 'KC' },
      { week: 7,  player: 'Kenneth Walker III', team: 'SEA' },
      { week: 8,  player: 'Dalvin Cook (SEA fill-in)', team: 'MIN' },
    ],
    notes: 'Four consecutive weeks with starter-level bye impacts. Escuelas faces unprecedented early-season scheduling adversity.',
  },
];

// ─── Strategy Tips ────────────────────────────────────────────────────────────

const STRATEGY_TIPS = [
  {
    title: 'Draft bye-week diversification',
    body: 'In dynasty, you own players long-term — but in season, try not to stack 3+ starters from the same team unless they have favorable bye placement. During your startup or off-season adds, note bye weeks alongside tier.',
    icon: 'shield' as const,
  },
  {
    title: 'Use FAAB proactively in bye weeks',
    body: 'Week before a major bye conflict is your signal to spend FAAB. The best streamers get claimed early. Budget $10–$20 in advance for your highest-risk weeks rather than scrambling same-day.',
    icon: 'alert' as const,
  },
  {
    title: 'Identify low-risk playoff weeks',
    body: 'Weeks 13–16 are dynasty playoff weeks. Check your starters\' bye schedules before the season and ensure your best players have no byes during those critical stretches.',
    icon: 'check' as const,
  },
  {
    title: 'Trade for players with ideal byes',
    body: 'If your key stack all land on the same bye week, consider trading one of those assets for an equal-value player on a different team. Bye-week diversification has real in-season value.',
    icon: 'calendar' as const,
  },
];

// ─── Helper: score color ──────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 8) return 'text-red-400';
  if (score >= 6) return 'text-orange-400';
  if (score >= 4) return 'text-yellow-400';
  return 'text-emerald-400';
}

function scoreBg(score: number): string {
  if (score >= 8) return 'border-red-500/30 bg-red-500/5';
  if (score >= 6) return 'border-orange-500/30 bg-orange-500/5';
  if (score >= 4) return 'border-yellow-500/30 bg-yellow-500/5';
  return 'border-emerald-500/30 bg-emerald-500/5';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScheduleStrengthV2Page() {
  const sorted = [...MANAGER_RISK].sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);

  return (
    <>
      <Head>
        <title>Bye Week Impact Analyzer 2026 — BMFFFL Analytics</title>
        <meta
          name="description"
          content="How 2026 NFL bye weeks will affect each BMFFFL manager's starting lineup. Vulnerability ratings, key player conflicts, and strategy guide."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics v2
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Lineup Impact — NFL Bye Weeks 2026
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Which BMFFFL managers face the most lineup damage from 2026 NFL bye weeks?
            Vulnerability ratings, problem weeks, and strategy guidance.
          </p>
        </header>

        {/* ── 2026 Bye Week Calendar ───────────────────────────────────────── */}
        <section aria-labelledby="bye-cal-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="bye-cal-heading" className="text-2xl font-black text-white">
              2026 NFL Bye Week Schedule
            </h2>
          </div>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {BYE_WEEKS.map((entry) => (
                <div
                  key={entry.week}
                  className="rounded-lg border border-[#2d4a66] bg-[#0f2744] p-3"
                >
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    Week {entry.week}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {entry.teams.map((team) => (
                      <span
                        key={team}
                        className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#1e3347] border border-[#2d4a66] text-slate-300"
                      >
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-slate-600">
              Projected 2026 NFL bye weeks based on standard scheduling patterns. Some teams appear in multiple bye slots due to London/Mexico City game logistics.
            </p>
          </div>
        </section>

        {/* ── Manager Bye Week Risk ────────────────────────────────────────── */}
        <section aria-labelledby="manager-risk-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="manager-risk-heading" className="text-2xl font-black text-white">
              Manager Bye Week Risk
            </h2>
          </div>

          <div className="space-y-4">
            {sorted.map((m) => (
              <div
                key={m.manager}
                className={cn('rounded-xl border p-5', scoreBg(m.vulnerabilityScore))}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-black text-white capitalize">{m.manager}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{m.notes}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                      Vulnerability
                    </p>
                    <p className={cn('text-3xl font-black tabular-nums', scoreColor(m.vulnerabilityScore))}>
                      {m.vulnerabilityScore}
                      <span className="text-base text-slate-600 font-semibold">/10</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  {/* High risk weeks */}
                  <div>
                    <p className="text-[10px] text-red-400 uppercase tracking-wider font-semibold mb-1.5">
                      High Risk Weeks
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.highRiskWeeks.length > 0 ? m.highRiskWeeks.map((w) => (
                        <span
                          key={w}
                          className="px-2 py-0.5 rounded-full text-xs font-black border border-red-500/40 bg-red-500/10 text-red-400"
                        >
                          Wk {w}
                        </span>
                      )) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                  </div>

                  {/* Low risk weeks */}
                  <div>
                    <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold mb-1.5">
                      Clean Weeks
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.lowRiskWeeks.slice(0, 4).map((w) => (
                        <span
                          key={w}
                          className="px-2 py-0.5 rounded-full text-xs font-black border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        >
                          Wk {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key players affected */}
                  <div>
                    <p className="text-[10px] text-orange-400 uppercase tracking-wider font-semibold mb-1.5">
                      Key Players on Bye
                    </p>
                    <ul className="space-y-0.5">
                      {m.keyPlayersAffected.map((p) => (
                        <li key={p.player} className="text-xs text-slate-400">
                          <span className="text-slate-600">Wk {p.week} —</span>{' '}
                          <span className="text-white font-semibold">{p.player}</span>
                          {' '}
                          <span className="text-[10px] text-slate-600">({p.team})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Vulnerability Rating Summary ──────────────────────────────────── */}
        <section aria-labelledby="rating-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="rating-heading" className="text-2xl font-black text-white">
              Bye Week Vulnerability Ratings
            </h2>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="min-w-full text-xs"
                aria-label="Manager bye week vulnerability ratings"
              >
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Rank</th>
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Manager</th>
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Score (1–10)</th>
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">High Risk Weeks</th>
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {sorted.map((m, idx) => (
                    <tr
                      key={m.manager}
                      className={cn(
                        'transition-colors hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      <td className="px-4 py-3 text-slate-500 font-bold tabular-nums">{idx + 1}</td>
                      <td className="px-4 py-3 font-bold text-white capitalize">{m.manager}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('text-xl font-black tabular-nums', scoreColor(m.vulnerabilityScore))}>
                          {m.vulnerabilityScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono tabular-nums text-slate-300">
                        {m.highRiskWeeks.length}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[120px] h-2 rounded-full bg-[#0d1b2a] overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all', {
                                'bg-red-500': m.vulnerabilityScore >= 8,
                                'bg-orange-500': m.vulnerabilityScore >= 6 && m.vulnerabilityScore < 8,
                                'bg-yellow-500': m.vulnerabilityScore >= 4 && m.vulnerabilityScore < 6,
                                'bg-emerald-500': m.vulnerabilityScore < 4,
                              })}
                              style={{ width: `${m.vulnerabilityScore * 10}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className={cn('text-[10px] font-bold uppercase tracking-wide', scoreColor(m.vulnerabilityScore))}>
                            {m.vulnerabilityScore >= 8 ? 'Critical' :
                             m.vulnerabilityScore >= 6 ? 'High' :
                             m.vulnerabilityScore >= 4 ? 'Moderate' : 'Low'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Strategy Guide ────────────────────────────────────────────────── */}
        <section aria-labelledby="strategy-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <BookOpen className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="strategy-heading" className="text-2xl font-black text-white">
              Bye Week Strategy Guide
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STRATEGY_TIPS.map((tip) => (
              <div key={tip.title} className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {tip.icon === 'shield'   && <Shield   className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />}
                    {tip.icon === 'alert'    && <AlertTriangle className="w-4 h-4 text-orange-400" aria-hidden="true" />}
                    {tip.icon === 'check'    && <CheckCircle   className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
                    {tip.icon === 'calendar' && <Calendar      className="w-4 h-4 text-cyan-400" aria-hidden="true" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white mb-1.5">{tip.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bimfle note */}
        <section className="mb-8">
          <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-6">
            <p className="text-[10px] text-[#ffd700]/60 uppercase tracking-widest font-semibold mb-3">
              A note from your Commissioner
            </p>
            <blockquote className="text-sm text-slate-300 leading-relaxed italic">
              &ldquo;Bye weeks are the one scheduling force in dynasty that you have no excuse not to plan for.
              They are published months in advance. Escuelas, please take note of week 5.
              Everyone else: the waiver wire exists for a reason. Use it proactively.
              ~Love, Bimfle.&rdquo;
            </blockquote>
          </div>
        </section>

        <p className="text-xs text-center text-slate-600">
          2026 NFL bye weeks are projected based on standard scheduling patterns and are subject to change.
          Player-team assignments reflect projected dynasty rosters and may shift with off-season transactions.
          Vulnerability scores are calculated from number of high-risk weeks, total starters on bye, and roster depth estimates.
        </p>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
