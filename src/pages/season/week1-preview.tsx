import Head from 'next/head';
import { Calendar, AlertTriangle, Target, Eye, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Matchup {
  id: number;
  home: string;
  away: string;
  projHome: number;
  projAway: number;
  favorite: string;
  keyPlayer: string;
  injuryWatch: string;
  bimflePick: string;
}

interface PlayerWatch {
  rank: number;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  nflTeam: string;
  dynastyOwner: string;
  context: string;
  dynastyImpact: 'high' | 'medium' | 'watch';
}

interface TrapGame {
  favorite: string;
  underdog: string;
  reason: string;
  riskLevel: 'extreme' | 'high' | 'moderate';
}

interface BimflePick {
  matchup: string;
  pick: string;
  confidence: number;
  reasoning: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const MATCHUPS: Matchup[] = [
  {
    id: 1,
    home: 'MLSchools12',
    away: 'Escuelas',
    projHome: 142.6,
    projAway: 98.4,
    favorite: 'MLSchools12',
    keyPlayer: 'MLSchools12 QB stack',
    injuryWatch: 'Monitor RB depth early in camp',
    bimflePick: 'MLSchools12',
  },
  {
    id: 2,
    home: 'Tubes94',
    away: 'eldridsm',
    projHome: 138.2,
    projAway: 108.8,
    favorite: 'Tubes94',
    keyPlayer: 'Tubes94 WR corps',
    injuryWatch: 'eldridsm RB1 status unclear — camp report pending',
    bimflePick: 'Tubes94',
  },
  {
    id: 3,
    home: 'tdtd19844',
    away: 'Cmaleski',
    projHome: 136.4,
    projAway: 124.0,
    favorite: 'tdtd19844',
    keyPlayer: 'Cmaleski WR1 — elite upside',
    injuryWatch: 'tdtd19844 TE situation needs monitoring',
    bimflePick: 'Cmaleski',
  },
  {
    id: 4,
    home: 'JuicyBussy',
    away: 'rbr',
    projHome: 131.8,
    projAway: 125.2,
    favorite: 'JuicyBussy',
    keyPlayer: 'JuicyBussy RB committee',
    injuryWatch: 'rbr WR1 preseason load management — full go expected',
    bimflePick: 'rbr',
  },
  {
    id: 5,
    home: 'SexMachineAndyD',
    away: 'Grandes',
    projHome: 130.0,
    projAway: 115.6,
    favorite: 'SexMachineAndyD',
    keyPlayer: 'SexMachineAndyD QB1 rushing floor',
    injuryWatch: 'Grandes WR depth — rookie integration unknown',
    bimflePick: 'SexMachineAndyD',
  },
  {
    id: 6,
    home: 'eldridm20',
    away: 'Cogdeill11',
    projHome: 122.4,
    projAway: 119.8,
    favorite: 'eldridm20',
    keyPlayer: 'Cogdeill11 TE1 — matchup dependent',
    injuryWatch: 'eldridm20 RB2 role in new offense unclear',
    bimflePick: 'Cogdeill11',
  },
];

const PLAYERS_TO_WATCH: PlayerWatch[] = [
  {
    rank: 1,
    name: 'Cam Ward',
    position: 'QB',
    nflTeam: 'TEN',
    dynastyOwner: 'TBD — high ADP',
    context: 'Year 2 Titans QB. Elevated completion rates in camp. Full-season starter locked in.',
    dynastyImpact: 'high',
  },
  {
    rank: 2,
    name: 'Travis Hunter',
    position: 'WR',
    nflTeam: 'JAX',
    dynastyOwner: 'TBD — top WR ADP',
    context: 'Breakout candidate in Year 2. New OC in Jacksonville prioritizes slot targets.',
    dynastyImpact: 'high',
  },
  {
    rank: 3,
    name: 'Ashton Jeanty',
    position: 'RB',
    nflTeam: 'LV',
    dynastyOwner: 'TBD',
    context: 'Raiders feature back. Week 1 target share and snap count will set the tone for his dynasty arc.',
    dynastyImpact: 'high',
  },
  {
    rank: 4,
    name: 'Tetairoa McMillan',
    position: 'WR',
    nflTeam: 'CAR',
    dynastyOwner: 'TBD',
    context: 'Carolina #1 WR. Rookie season was inconsistent — Year 2 leap is the key question.',
    dynastyImpact: 'high',
  },
  {
    rank: 5,
    name: 'Shedeur Sanders',
    position: 'QB',
    nflTeam: 'CLE',
    dynastyOwner: 'Various',
    context: 'Starting QB situation in Cleveland unclear. Week 1 depth chart is a pivotal dynasty signal.',
    dynastyImpact: 'watch',
  },
  {
    rank: 6,
    name: 'Omarion Hampton',
    position: 'RB',
    nflTeam: 'LAC',
    dynastyOwner: 'TBD — 2026 rookie pick',
    context: '2026 first-rounder. Chargers backfield split in Week 1 determines dynasty timeline.',
    dynastyImpact: 'high',
  },
  {
    rank: 7,
    name: 'Luther Burden III',
    position: 'WR',
    nflTeam: 'CHI',
    dynastyOwner: 'TBD — 2026 rookie pick',
    context: 'Bears WR opposite DJ Moore. Target share from Week 1 sets dynasty floor.',
    dynastyImpact: 'medium',
  },
  {
    rank: 8,
    name: 'Elic Ayomanor',
    position: 'WR',
    nflTeam: 'TEN',
    dynastyOwner: 'TBD',
    context: 'Cam Ward connection in Tennessee. Deep threat upside — Week 1 chemistry watch.',
    dynastyImpact: 'medium',
  },
  {
    rank: 9,
    name: 'RB1 — New Scheme',
    position: 'RB',
    nflTeam: 'Various',
    dynastyOwner: 'Various',
    context: 'Teams changing offensive coordinators in 2026. New scheme RBs face usage uncertainty in Week 1.',
    dynastyImpact: 'watch',
  },
  {
    rank: 10,
    name: '2026 Draft Class Devy',
    position: 'WR',
    nflTeam: 'Various',
    dynastyOwner: 'TBD',
    context: 'The 2026 class tops from the BMFFFL draft will debut this week. First impressions matter in dynasty.',
    dynastyImpact: 'medium',
  },
];

const TRAP_GAMES: TrapGame[] = [
  {
    favorite: 'tdtd19844',
    underdog: 'Cmaleski',
    reason: 'Reigning champ opens as favourite but Cmaleski scored 1,990 points in 2025 with a 6-8 record — systemic bad luck that corrects. Elite WR corps with massive upside. Week 1 on the road against a motivated team.',
    riskLevel: 'extreme',
  },
  {
    favorite: 'JuicyBussy',
    underdog: 'rbr',
    reason: 'rbr has two runner-up finishes and a professional roster management style. JuicyBussy has the higher ceiling but the floor is lower. Week 1 nerves in a closely projected matchup.',
    riskLevel: 'high',
  },
  {
    favorite: 'eldridm20',
    underdog: 'Cogdeill11',
    reason: 'The closest projected matchup on the board. Cogdeill11 holds the founding champion legacy and tends to elevate in revenge-spot situations. Under-2-point spread is a coin flip.',
    riskLevel: 'moderate',
  },
];

const BIMFLE_PICKS: BimflePick[] = [
  {
    matchup: 'MLSchools12 vs Escuelas',
    pick: 'MLSchools12',
    confidence: 94,
    reasoning: 'The historical record remains unambiguous. MLSchools12 opens as heavy favourite and the roster depth justifies it.',
  },
  {
    matchup: 'Tubes94 vs eldridsm',
    pick: 'Tubes94',
    confidence: 78,
    reasoning: 'Capital-rich, ascending team. eldridsm enters the season without their 2027 1st and on a recent decline.',
  },
  {
    matchup: 'tdtd19844 vs Cmaleski',
    pick: 'Cmaleski',
    confidence: 52,
    reasoning: 'Trap game of the week. 1,990 points in 2025 deserved a better record. I expect regression to excellence here.',
  },
  {
    matchup: 'JuicyBussy vs rbr',
    pick: 'rbr',
    confidence: 55,
    reasoning: 'The fade on rbr all offseason feels overdone. Two runner-ups. Professional operation. I am not laying the points.',
  },
  {
    matchup: 'SexMachineAndyD vs Grandes',
    pick: 'SexMachineAndyD',
    confidence: 70,
    reasoning: 'Consistent, deep, and motivated. Grandes cannot shake the 2025 Moodie Bowl shadow.',
  },
  {
    matchup: 'eldridm20 vs Cogdeill11',
    pick: 'Cogdeill11',
    confidence: 51,
    reasoning: 'Closest projected matchup. The founding champion in a motivated spot. I am taking the slight upset.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function positionColor(pos: PlayerWatch['position']): string {
  switch (pos) {
    case 'QB': return 'bg-red-500/15 text-red-300 border-red-500/30';
    case 'RB': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'WR': return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    case 'TE': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }
}

function impactColor(impact: PlayerWatch['dynastyImpact']): string {
  switch (impact) {
    case 'high': return 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30';
    case 'medium': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
    case 'watch': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  }
}

function riskColor(risk: TrapGame['riskLevel']): { badge: string; border: string; bg: string } {
  switch (risk) {
    case 'extreme': return {
      badge: 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
      border: 'border-[#e94560]/30',
      bg: 'bg-[#e94560]/5',
    };
    case 'high': return {
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
    };
    case 'moderate': return {
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
    };
  }
}

function confidenceColor(pct: number): string {
  if (pct >= 80) return 'text-emerald-400';
  if (pct >= 65) return 'text-[#ffd700]';
  if (pct >= 55) return 'text-amber-400';
  return 'text-[#e94560]';
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Week1PreviewPage() {
  return (
    <>
      <Head>
        <title>Week 1 Preview — BMFFFL Season 7</title>
        <meta
          name="description"
          content="BMFFFL Season 7 Week 1 preview. Opening matchup projections, players to watch, trap game alerts, and Bimfle's Week 1 picks."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Hero ── */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            Season
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-bold uppercase tracking-widest mb-4 ml-2">
            Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Week 1 Preview
          </h1>
          <p className="text-xl text-slate-300 font-bold mb-2">
            BMFFFL Season 7 &mdash; September 2026
          </p>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Opening week matchup projections, dynasty players to watch, trap game alerts,
            and Bimfle&rsquo;s picks. Page fully activates Week 1 of the 2026 NFL season.
          </p>
        </header>

        {/* ── Section 1: Opening Week Matchups ── */}
        <section className="mb-14" aria-labelledby="matchups-heading">
          <h2 id="matchups-heading" className="text-xl font-black text-white mb-1">
            Opening Week Matchups
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Projected based on predicted power rankings. Projections are pre-draft estimates — final projections update at season start.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {MATCHUPS.map((m) => {
              const homeWin = m.projHome > m.projAway;
              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden"
                >
                  {/* Matchup header */}
                  <div className="px-5 pt-4 pb-3 border-b border-[#2d4a66]">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
                        Matchup {m.id}
                      </span>
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">
                        Week 1
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Away */}
                      <div className={cn('flex-1 text-center', m.favorite === m.away ? '' : 'opacity-60')}>
                        <p className="text-sm font-black text-white leading-tight">{m.away}</p>
                        <p className={cn(
                          'text-xl font-black tabular-nums mt-1',
                          m.favorite === m.away ? 'text-[#ffd700]' : 'text-slate-400'
                        )}>
                          {m.projAway}
                        </p>
                      </div>

                      <div className="text-slate-600 font-black text-xs px-2">vs</div>

                      {/* Home */}
                      <div className={cn('flex-1 text-center', m.favorite === m.home ? '' : 'opacity-60')}>
                        <p className="text-sm font-black text-white leading-tight">{m.home}</p>
                        <p className={cn(
                          'text-xl font-black tabular-nums mt-1',
                          m.favorite === m.home ? 'text-[#ffd700]' : 'text-slate-400'
                        )}>
                          {m.projHome}
                        </p>
                      </div>
                    </div>

                    {/* Spread bar */}
                    <div className="mt-3">
                      <div className="h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden flex">
                        {(() => {
                          const total = m.projHome + m.projAway;
                          const awayPct = Math.round((m.projAway / total) * 100);
                          const homePct = 100 - awayPct;
                          return (
                            <>
                              <div
                                className={cn('h-full rounded-l-full', homeWin ? 'bg-slate-600' : 'bg-[#ffd700]')}
                                style={{ width: `${awayPct}%` }}
                              />
                              <div
                                className={cn('h-full rounded-r-full', homeWin ? 'bg-[#ffd700]' : 'bg-slate-600')}
                                style={{ width: `${homePct}%` }}
                              />
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-5 py-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <Star className="w-3 h-3 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-[11px] text-slate-300">
                        <span className="font-bold text-white">Key Player:</span> {m.keyPlayer}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-[11px] text-slate-400">
                        <span className="font-bold text-amber-300">Injury Watch:</span> {m.injuryWatch}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-[11px] text-slate-400">
                        <span className="font-bold text-emerald-300">Bimfle&rsquo;s Pick:</span>{' '}
                        <span className="text-white font-bold">{m.bimflePick}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Players to Watch ── */}
        <section className="mb-14" aria-labelledby="players-heading">
          <h2 id="players-heading" className="text-xl font-black text-white mb-1">
            Players to Watch &mdash; Week 1 Starts
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            10 players with dynasty implications in their opening week. First impressions shape season-long value.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <table className="min-w-full text-xs" aria-label="Players to watch Week 1">
              <thead>
                <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider w-8">#</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Player</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">NFL Team</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Dynasty Owner</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Context</th>
                  <th scope="col" className="px-3 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3347]">
                {PLAYERS_TO_WATCH.map((p, idx) => (
                  <tr
                    key={p.rank}
                    className={cn(
                      'transition-colors hover:bg-[#1f3550]',
                      idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                    )}
                  >
                    <td className="px-3 py-3 text-slate-500 font-black tabular-nums">{p.rank}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0',
                          positionColor(p.position)
                        )}>
                          {p.position}
                        </span>
                        <span className="font-black text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="font-mono text-slate-300 font-bold">{p.nflTeam}</span>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-slate-400">{p.dynastyOwner}</td>
                    <td className="px-3 py-3 text-slate-400 leading-relaxed max-w-xs">{p.context}</td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      <span className={cn(
                        'inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border',
                        impactColor(p.dynastyImpact)
                      )}>
                        {p.dynastyImpact === 'high' ? 'High Impact' : p.dynastyImpact === 'medium' ? 'Medium' : 'Watch'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 3: Trap Games ── */}
        <section className="mb-14" aria-labelledby="trapgames-heading">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
            <h2 id="trapgames-heading" className="text-xl font-black text-white">
              Trap Game Alert
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Matchups where the favourite could be upset. Proceed with your lineup decisions carefully.
          </p>

          <div className="space-y-4">
            {TRAP_GAMES.map((tg, idx) => {
              const colors = riskColor(tg.riskLevel);
              return (
                <div
                  key={idx}
                  className={cn(
                    'rounded-xl border p-5',
                    colors.border,
                    colors.bg
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase border',
                        colors.badge
                      )}>
                        {tg.riskLevel} risk
                      </span>
                      <div>
                        <span className="text-sm font-black text-white">{tg.favorite}</span>
                        <span className="text-slate-500 mx-2 text-xs">vs</span>
                        <span className="text-sm font-bold text-slate-300">{tg.underdog}</span>
                      </div>
                    </div>
                    <div className="sm:ml-auto text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Upset Candidate</span>
                      <p className="text-xs font-black text-white">{tg.underdog}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tg.reason}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 4: Bimfle's Week 1 Picks ── */}
        <section className="mb-10" aria-labelledby="picks-heading">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="picks-heading" className="text-xl font-black text-white">
              Bimfle&rsquo;s Week 1 Picks
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Six picks with confidence percentage. The archive will record the results.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BIMFLE_PICKS.map((pick, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5"
              >
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2">
                  {pick.matchup}
                </p>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-lg font-black text-white">{pick.pick}</span>
                  <span className={cn(
                    'text-2xl font-black tabular-nums',
                    confidenceColor(pick.confidence)
                  )}>
                    {pick.confidence}%
                  </span>
                </div>

                {/* Confidence bar */}
                <div className="h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden mb-3">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      pick.confidence >= 80 ? 'bg-emerald-400' :
                      pick.confidence >= 65 ? 'bg-[#ffd700]' :
                      pick.confidence >= 55 ? 'bg-amber-400' : 'bg-[#e94560]'
                    )}
                    style={{ width: `${pick.confidence}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 italic leading-relaxed">{pick.reasoning}</p>

                <div className="mt-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-slate-600" aria-hidden="true" />
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">
                    {pick.confidence >= 75 ? 'High Confidence' : pick.confidence >= 60 ? 'Lean' : 'Coin Flip'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bimfle Note ── */}
        <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-6 text-center">
          <p className="text-sm text-slate-300 leading-relaxed italic max-w-2xl mx-auto">
            &ldquo;Week 1 is not predictive. It is instructive. Watch the snaps. Watch the target
            share. The first box score of the season is the most information-dense document you
            will read all year. Treat it accordingly.&rdquo;
          </p>
          <p className="text-xs text-[#ffd700] font-bold mt-2 uppercase tracking-widest">
            &mdash; Love, Bimfle
          </p>
        </div>

        <p className="mt-8 text-xs text-center text-slate-600">
          All projections are pre-season estimates based on power rankings and roster evaluation (March 2026).
          Final projections and lineup data update at the start of Season 7. For entertainment purposes only.
        </p>

      </div>
    </>
  );
}
