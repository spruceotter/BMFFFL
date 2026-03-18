import Head from 'next/head';
import { Activity, AlertTriangle, Shield, TrendingDown, Trophy, Heart } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type LuckRating = 'Unlucky' | 'Very Unlucky' | 'Somewhat Unlucky' | 'Neutral' | 'Lucky';

interface ManagerInjuryRow {
  rank:          number;
  owner:         string;
  playersLost:   number;
  ptsLost:       number;
  playoffImpact: string;
  luckRating:    LuckRating;
  note:          string;
}

interface InjuryPronePlayer {
  rank:        number;
  player:      string;
  position:    string;
  owners:      string;
  irAppearances: number;
  estPtsLost:  number;
  note:        string;
}

interface SeasonInjuryEvent {
  season: string;
  event:  string;
  owner:  string;
  impact: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MANAGER_INJURY_RANKINGS: ManagerInjuryRow[] = [
  {
    rank:          1,
    owner:         'tubes94',
    playersLost:   12,
    ptsLost:       240,
    playoffImpact: 'Reached finals, 0 titles',
    luckRating:    'Very Unlucky',
    note:          'The most unlucky contender in league history',
  },
  {
    rank:          2,
    owner:         'cmaleski',
    playersLost:   7,
    ptsLost:       190,
    playoffImpact: 'Explains the 1990 pts gap in 2025',
    luckRating:    'Very Unlucky',
    note:          'Chronic bad timing — always losing key players at peak moments',
  },
  {
    rank:          3,
    owner:         'mlschools12',
    playersLost:   8,
    ptsLost:       180,
    playoffImpact: 'Won 2 titles despite losses',
    luckRating:    'Unlucky',
    note:          'Overcame everything — depth and roster management compensated',
  },
  {
    rank:          4,
    owner:         'sexmachineandy',
    playersLost:   9,
    ptsLost:       210,
    playoffImpact: 'Season-ending ACL in 2025',
    luckRating:    'Very Unlucky',
    note:          'Jonathon Brooks ACL was the worst single-season loss in recent memory',
  },
  {
    rank:          5,
    owner:         'juicybussy',
    playersLost:   6,
    ptsLost:       145,
    playoffImpact: 'Missed playoffs twice due to injury',
    luckRating:    'Unlucky',
    note:          'High-spend roster means high-profile injury exposure',
  },
  {
    rank:          6,
    owner:         'eldridsm',
    playersLost:   5,
    ptsLost:       115,
    playoffImpact: 'Borderline playoff miss in 2023',
    luckRating:    'Somewhat Unlucky',
    note:          'Consistent minor injuries rather than one catastrophic event',
  },
  {
    rank:          7,
    owner:         'rbr',
    playersLost:   4,
    ptsLost:       98,
    playoffImpact: 'Manageable — FAAB depth offset losses',
    luckRating:    'Somewhat Unlucky',
    note:          'Smart FAAB usage repeatedly covered injury gaps',
  },
  {
    rank:          8,
    owner:         'grandes',
    playersLost:   6,
    ptsLost:       130,
    playoffImpact: 'Mid-season implosion in 2022',
    luckRating:    'Unlucky',
    note:          'Multiple key contributors lost in concentrated bursts',
  },
  {
    rank:          9,
    owner:         'eldridm20',
    playersLost:   4,
    ptsLost:       89,
    playoffImpact: 'Minor — roster depth absorbed impact',
    luckRating:    'Somewhat Unlucky',
    note:          'Below-average injury exposure for a 6-season span',
  },
  {
    rank:          10,
    owner:         'tdtd19844',
    playersLost:   2,
    ptsLost:       48,
    playoffImpact: 'No meaningful playoff impact',
    luckRating:    'Lucky',
    note:          '2025 champion — key players stayed healthy through the entire postseason',
  },
  {
    rank:          11,
    owner:         'cogdeill11',
    playersLost:   3,
    ptsLost:       72,
    playoffImpact: 'Minimal — rarely contended anyway',
    luckRating:    'Neutral',
    note:          'Low contention ceiling means injury impact is muted statistically',
  },
  {
    rank:          12,
    owner:         'escuelas',
    playersLost:   3,
    ptsLost:       65,
    playoffImpact: 'Minimal — low roster investment in stars',
    luckRating:    'Neutral',
    note:          'Conservative roster approach reduces both upside and injury exposure',
  },
];

const INJURY_PRONE_PLAYERS: InjuryPronePlayer[] = [
  {
    rank:          1,
    player:        'Christian McCaffrey',
    position:      'RB',
    owners:        'mlschools12, tubes94',
    irAppearances: 4,
    estPtsLost:    320,
    note:          'Elite talent, perpetual injury cloud. Every owner who held CMC learned patience.',
  },
  {
    rank:          2,
    player:        'Jonathon Brooks',
    position:      'RB',
    owners:        'sexmachineandy',
    irAppearances: 2,
    estPtsLost:    280,
    note:          'ACL in 2025 wiped an entire promising season. Pre-injury ceiling was enormous.',
  },
  {
    rank:          3,
    player:        'Javonte Williams',
    position:      'RB',
    owners:        'rbr',
    irAppearances: 3,
    estPtsLost:    245,
    note:          'ACL in 2022 began a multi-year recovery arc that never fully resolved.',
  },
  {
    rank:          4,
    player:        'Stefon Diggs',
    position:      'WR',
    owners:        'tubes94, mlschools12',
    irAppearances: 3,
    estPtsLost:    198,
    note:          'Knee and hamstring issues recurred across seasons. Boom-bust dynasty hold.',
  },
  {
    rank:          5,
    player:        'Odell Beckham Jr.',
    position:      'WR',
    owners:        'grandes, juicybussy',
    irAppearances: 4,
    estPtsLost:    175,
    note:          'Every OBJ dynasty hold ended the same way. The league learned eventually.',
  },
  {
    rank:          6,
    player:        'Breece Hall',
    position:      'RB',
    owners:        'tubes94',
    irAppearances: 2,
    estPtsLost:    162,
    note:          'Early ACL, then chronic knee management. Tubes94 waited years for full production.',
  },
  {
    rank:          7,
    player:        'Rashee Rice',
    position:      'WR',
    owners:        'mlschools12',
    irAppearances: 2,
    estPtsLost:    148,
    note:          'Knee injury plus suspension. Two seasons of expected elite production, delayed.',
  },
  {
    rank:          8,
    player:        'Davante Adams',
    position:      'WR',
    owners:        'mlschools12',
    irAppearances: 2,
    estPtsLost:    132,
    note:          'Late-career knee soreness added to age decline — dynasty value collapse accelerated.',
  },
  {
    rank:          9,
    player:        'Kyren Williams',
    position:      'RB',
    owners:        'juicybussy',
    irAppearances: 2,
    estPtsLost:    98,
    note:          'Ankle issues in late 2025 took a top-12 RB off the board at a critical moment.',
  },
  {
    rank:          10,
    player:        'Tua Tagovailoa',
    position:      'QB',
    owners:        'mlschools12 (adjacent)',
    irAppearances: 2,
    estPtsLost:    88,
    note:          'Concussion protocols reshaped the value of Dolphins pass-catchers owned across the league.',
  },
];

const SEASON_EVENTS: SeasonInjuryEvent[] = [
  {
    season: '2025',
    event:  'Jonathon Brooks tears his ACL — full season lost',
    owner:  'sexmachineandy',
    impact: 'Largest single-player dynasty value destruction of the modern era. SexMachineAndyD drops from playoff contention.',
  },
  {
    season: '2024',
    event:  "Tua Tagovailoa concussion protocols — recurring absences",
    owner:  'mlschools12',
    impact: 'Dolphins skill position value fluctuated wildly. Affected trade windows and start/sit decisions across 6 weeks.',
  },
  {
    season: '2023',
    event:  "Worst dynasty value loss year on record — multiple ACL tears",
    owner:  'League-wide',
    impact: 'Three separate ACL injuries to BMFFFL-rostered players in a single season. Historically unprecedented injury density.',
  },
  {
    season: '2022',
    event:  'Javonte Williams ACL in Denver',
    owner:  'rbr',
    impact: 'Marked the beginning of a multi-year recovery arc. The league\'s first true patience test in the dynasty era.',
  },
  {
    season: '2021',
    event:  'Christian McCaffrey hamstring and ankle cascade',
    owner:  'mlschools12',
    impact: 'CMC played fewer than 8 games for the second straight year. Forced dynasty re-evaluation of injury-prone RBs.',
  },
  {
    season: '2020',
    event:  "Odell Beckham Jr. ACL — season-ending in Week 7",
    owner:  'grandes',
    impact: 'Established OBJ as the league\'s most injury-cursed dynasty hold. Never recovered his pre-injury value.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LUCK_CLASSES: Record<LuckRating, string> = {
  'Very Unlucky':     'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
  'Unlucky':          'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Somewhat Unlucky': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Neutral':          'bg-slate-500/15 text-slate-400 border-slate-500/30',
  'Lucky':            'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InjuryHistoryPage() {
  const totalPtsLost   = MANAGER_INJURY_RANKINGS.reduce((s, r) => s + r.ptsLost, 0);
  const mostUnlucky    = MANAGER_INJURY_RANKINGS[0];
  const totalIRSlots   = MANAGER_INJURY_RANKINGS.reduce((s, r) => s + r.playersLost, 0);

  return (
    <>
      <Head>
        <title>Injury History Tracker — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Six-season injury impact analysis for BMFFFL — which managers have suffered the most, which players caused the most pain, and the statistical tragedy of Tubes94."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Injury History Tracker
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            The Injury Tax: which managers have had the most bad luck with player injuries across six seasons of BMFFFL competition?
          </p>
        </header>

        {/* Section 1: Overview Stats */}
        <section className="mb-12" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="sr-only">League Injury Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 px-5 py-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total IR Slots (6 Seasons)</p>
              <p className="text-3xl font-black text-[#e94560] tabular-nums">{totalIRSlots}</p>
              <p className="text-slate-500 text-xs mt-1">Players placed on injured reserve</p>
            </div>
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-5 py-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Est. Points Lost (League-Wide)</p>
              <p className="text-3xl font-black text-orange-400 tabular-nums">{totalPtsLost.toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-1">Fantasy points lost to injury across all managers</p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Most Unlucky Contender</p>
              <p className="text-3xl font-black text-amber-400 capitalize">{mostUnlucky.owner}</p>
              <p className="text-slate-500 text-xs mt-1">{mostUnlucky.ptsLost} est. pts lost, 0 championships</p>
            </div>
          </div>
        </section>

        {/* Section 2: Injury Impact Rankings */}
        <section className="mb-12" aria-labelledby="rankings-heading">
          <h2 id="rankings-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
            Injury Impact Rankings
          </h2>
          <p className="text-slate-500 text-sm mb-5">
            All 12 managers ranked by total points lost to injury across 6 seasons. Higher rank = more injury damage.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Manager injury impact rankings">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Manager</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">IR (6yr)</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider w-28">Est. Pts Lost</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-28 hidden sm:table-cell">Luck Rating</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Playoff Impact</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {MANAGER_INJURY_RANKINGS.map((row, idx) => (
                    <tr
                      key={row.owner}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black',
                          row.rank === 1 ? 'bg-[#e94560] text-white' :
                          row.rank === 2 ? 'bg-orange-500 text-white' :
                          row.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-[#1e3347] text-slate-400'
                        )}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-white capitalize">{row.owner}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono font-bold text-slate-300 tabular-nums">{row.playersLost}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn(
                          'text-sm font-black font-mono tabular-nums',
                          row.ptsLost >= 200 ? 'text-[#e94560]' :
                          row.ptsLost >= 130 ? 'text-orange-400' :
                          row.ptsLost >= 80  ? 'text-amber-400' :
                          'text-emerald-400'
                        )}>
                          {row.ptsLost}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider',
                          LUCK_CLASSES[row.luckRating]
                        )}>
                          {row.luckRating}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-400">{row.playoffImpact}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-500">{row.note}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3: Most Injury-Prone Players */}
        <section className="mb-12" aria-labelledby="prone-players-heading">
          <h2 id="prone-players-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
            Most Injury-Prone Players in BMFFFL Rosters
          </h2>
          <p className="text-slate-500 text-sm mb-5">The 10 players who have caused the most IR pain across league history.</p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Most injury-prone players in BMFFFL">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Player</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-16 hidden sm:table-cell">Pos</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-20">IR Apps</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider w-28">Est. Pts Lost</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Owners Affected</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {INJURY_PRONE_PLAYERS.map((p, idx) => (
                    <tr
                      key={p.player}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black',
                          p.rank === 1 ? 'bg-[#e94560] text-white' :
                          p.rank === 2 ? 'bg-orange-500 text-white' :
                          p.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-[#1e3347] text-slate-400'
                        )}>
                          {p.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-white">{p.player}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="text-xs font-mono text-slate-400">{p.position}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-amber-400 tabular-nums">{p.irAppearances}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono font-bold text-[#e94560] tabular-nums">{p.estPtsLost}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-400 capitalize">{p.owners}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-500">{p.note}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4: Injury Timelines by Season */}
        <section className="mb-12" aria-labelledby="timelines-heading">
          <h2 id="timelines-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" aria-hidden="true" />
            Injury Timelines by Season
          </h2>
          <p className="text-slate-500 text-sm mb-5">For each of the 6 seasons, the most impactful injury event in BMFFFL history.</p>

          <div className="flex flex-col gap-3">
            {SEASON_EVENTS.map((evt) => (
              <div
                key={evt.season}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col sm:flex-row gap-4"
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-[#e94560]/10 border border-[#e94560]/20 flex items-center justify-center">
                    <span className="text-[#e94560] font-black text-sm">{evt.season}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white mb-0.5">{evt.event}</p>
                  <p className="text-xs text-[#e94560] font-semibold mb-1 capitalize">Owner: {evt.owner}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{evt.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Bimfle Injury Analysis */}
        <section className="mb-10" aria-labelledby="bimfle-analysis-heading">
          <h2 id="bimfle-analysis-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            Bimfle&rsquo;s Injury Analysis
          </h2>
          <p className="text-slate-500 text-sm mb-5">The Commissioner&rsquo;s official statistical verdict on injury luck in BMFFFL.</p>

          <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-6 py-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">A Word from Bimfle</span>
            </div>
            <blockquote className="text-slate-200 text-base leading-relaxed mb-4">
              &ldquo;Tubes94 has lost an estimated <span className="text-[#e94560] font-black">240 points</span> to injury across 6 seasons.
              They have reached the finals. They have 0 championships. By any objective measure, they should have
              <span className="text-[#ffd700] font-black"> 2 championships</span>. They have none.
              This is the most compelling statistical tragedy in BMFFFL history.&rdquo;
            </blockquote>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Meanwhile, tdtd19844 won the 2025 championship with an estimated 48 points lost to injury — the lowest in the league
              that season. Injury luck is not a minor variable. In a dynasty league, injury luck is often the difference between
              dynasty and heartbreak.
            </p>
            <p className="text-xs text-[#ffd700] font-semibold">&mdash; Love, Bimfle.</p>
          </div>
        </section>

        {/* Footer */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Six-Season Injury Data</span> &mdash; Points lost estimates are based on projected production and historical lineup frequency for each player during their injury absence. Data covers BMFFFL seasons 2020&ndash;2025.
          </p>
        </div>

      </div>
    </>
  );
}
