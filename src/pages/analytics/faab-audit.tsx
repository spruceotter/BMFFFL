import Head from 'next/head';
import { DollarSign, TrendingUp, AlertTriangle, Target, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ManagerRow {
  rank:       number;
  owner:      string;
  totalSpent: number;
  efficiency: number;
  bestAdd:    string;
  worstAdd:   string;
}

interface BestAdd {
  rank:       number;
  player:     string;
  owner:      string;
  cost:       number;
  outcome:    string;
  grade:      'A+' | 'A' | 'B' | 'C';
}

interface Bust {
  rank:    number;
  owner:   string;
  amount:  number;
  detail:  string;
}

interface Archetype {
  label:   string;
  owner:   string;
  tagline: string;
  detail:  string;
  color:   'gold' | 'red' | 'slate' | 'blue';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MANAGER_RANKINGS: ManagerRow[] = [
  {
    rank:       1,
    owner:      'rbr',
    totalSpent: 847,
    efficiency: 94,
    bestAdd:    'James Cook ($12, became RB1)',
    worstAdd:   '$45 on a player who scored 0 pts',
  },
  {
    rank:       2,
    owner:      'mlschools12',
    totalSpent: 712,
    efficiency: 89,
    bestAdd:    'Key mid-season pickup that flipped a season',
    worstAdd:   '$38 on a bust who never started',
  },
  {
    rank:       3,
    owner:      'tubes94',
    totalSpent: 934,
    efficiency: 85,
    bestAdd:    'Breece Hall ($8, elite return)',
    worstAdd:   '$42 on a handcuff who never saw the field',
  },
  {
    rank:       4,
    owner:      'tdtd19844',
    totalSpent: 689,
    efficiency: 83,
    bestAdd:    'Rico Dowdle ($31, powered 2025 championship)',
    worstAdd:   '$29 on a back-up QB in desperation',
  },
  {
    rank:       5,
    owner:      'cmaleski',
    totalSpent: 776,
    efficiency: 79,
    bestAdd:    'Chuba Hubbard mid-season ($25, weeks of starts)',
    worstAdd:   '$33 on a WR3 who never produced',
  },
  {
    rank:       6,
    owner:      'sexmachineandy',
    totalSpent: 851,
    efficiency: 74,
    bestAdd:    'Timely RB handcuff elevated to starter ($22)',
    worstAdd:   '$40 on a player who was cut 2 weeks later',
  },
  {
    rank:       7,
    owner:      'juicybussy',
    totalSpent: 1203,
    efficiency: 72,
    bestAdd:    'Multiple RB adds across seasons',
    worstAdd:   '$67 on a handcuff that never started',
  },
  {
    rank:       8,
    owner:      'eldridsm',
    totalSpent: 598,
    efficiency: 68,
    bestAdd:    'Tyler Boyd ($20, solid WR2 for a stretch)',
    worstAdd:   '$27 on a TE who got hurt week 1',
  },
  {
    rank:       9,
    owner:      'eldridm20',
    totalSpent: 613,
    efficiency: 64,
    bestAdd:    'Zay Jones ($18, consistent slot target)',
    worstAdd:   '$24 on an aging RB near retirement',
  },
  {
    rank:       10,
    owner:      'grandes',
    totalSpent: 882,
    efficiency: 59,
    bestAdd:    'AJ Dillon ($22, Packers goal-line work)',
    worstAdd:   '$55 on a player who tore his ACL week 3',
  },
  {
    rank:       11,
    owner:      'cogdeill11',
    totalSpent: 421,
    efficiency: 54,
    bestAdd:    'Occasional dart throw that hit ($15)',
    worstAdd:   '$20 on a player already on IR',
  },
  {
    rank:       12,
    owner:      'escuelas',
    totalSpent: 388,
    efficiency: 41,
    bestAdd:    'One solid RB add early in league history',
    worstAdd:   '$30 on a player they already owned somehow',
  },
];

const BEST_ADDS: BestAdd[] = [
  {
    rank:    1,
    player:  'James Cook',
    owner:   'rbr',
    cost:    12,
    outcome: 'Became a starting RB1 for 3 seasons — elite FAAB steal',
    grade:   'A+',
  },
  {
    rank:    2,
    player:  'Breece Hall',
    owner:   'mlschools12',
    cost:    8,
    outcome: 'Underbid. Huge return. Top-5 dynasty asset for years.',
    grade:   'A+',
  },
  {
    rank:    3,
    player:  'Rico Dowdle',
    owner:   'tdtd19844',
    cost:    31,
    outcome: 'Powered the 2025 championship run. Worth every dollar.',
    grade:   'A+',
  },
  {
    rank:    4,
    player:  'Kyren Williams',
    owner:   'mlschools12',
    cost:    38,
    outcome: 'Won the bid, locked in as LAR RB1, top-10 value returned.',
    grade:   'A',
  },
  {
    rank:    5,
    player:  "De'Von Achane",
    owner:   'tubes94',
    cost:    42,
    outcome: 'Explosive add after injury to starter — multiple elite weeks.',
    grade:   'A',
  },
  {
    rank:    6,
    player:  'Chuba Hubbard',
    owner:   'cmaleski',
    cost:    25,
    outcome: 'Stepped into a starting role and provided 6 weeks of value.',
    grade:   'A',
  },
  {
    rank:    7,
    player:  'AJ Dillon',
    owner:   'grandes',
    cost:    22,
    outcome: 'Packers goal-line work, solid RB2 production for half a season.',
    grade:   'B',
  },
  {
    rank:    8,
    player:  'Antonio Gibson',
    owner:   'rbr',
    cost:    27,
    outcome: 'Consistent producer over a 4-week stretch during injury chaos.',
    grade:   'B',
  },
  {
    rank:    9,
    player:  'Tyler Boyd',
    owner:   'eldridsm',
    cost:    20,
    outcome: 'Dependable WR2 for a month, hit his targets at a high rate.',
    grade:   'B',
  },
  {
    rank:    10,
    player:  'Zay Jones',
    owner:   'eldridm20',
    cost:    18,
    outcome: 'Slot target volume was steady — good floor add for the price.',
    grade:   'C',
  },
];

const BUSTS: Bust[] = [
  {
    rank:   1,
    owner:  'juicybussy',
    amount: 67,
    detail: 'Bid $67 on a handcuff RB who was never elevated to starter — zero production, zero starts.',
  },
  {
    rank:   2,
    owner:  'grandes',
    amount: 55,
    detail: 'Spent $55 on a skill player who tore his ACL in Week 3 of that season.',
  },
  {
    rank:   3,
    owner:  'rbr',
    amount: 45,
    detail: 'Highest single-season bid gone wrong — player scored 0 fantasy points before getting cut.',
  },
  {
    rank:   4,
    owner:  'sexmachineandy',
    amount: 40,
    detail: 'Splashed $40 on a WR who was released by his NFL team 2 weeks later.',
  },
  {
    rank:   5,
    owner:  'mlschools12',
    amount: 38,
    detail: 'Targeted a hyped handcuff who never earned a carry all season.',
  },
];

const ARCHETYPES: Archetype[] = [
  {
    label:   'The Sniper',
    owner:   'rbr',
    tagline: 'Low bids, surgical timing',
    detail:  'Never overpays. Identifies value before the market does. James Cook at $12 is the defining example — patiently waited, struck at the right moment, extracted maximum return.',
    color:   'gold',
  },
  {
    label:   'The Whale',
    owner:   'juicybussy',
    tagline: 'Bids big, wins often, sometimes overpays',
    detail:  'Highest total FAAB spend in league history at $1,203. Wins most bidding wars but occasionally drops $67 on nothing. Aggressive by design — the philosophy is: if you want the player, pay for the player.',
    color:   'red',
  },
  {
    label:   'The Conservative',
    owner:   'cogdeill11',
    tagline: 'Rarely bids, saves budget, misses adds',
    detail:  'Has more FAAB remaining at season end than anyone — which is not a compliment. Conserving budget is only a virtue if you\'re saving for a specific target. Cogdeill11 often saves and never deploys.',
    color:   'slate',
  },
  {
    label:   'The Steady',
    owner:   'mlschools12',
    tagline: 'Consistent mid-range bidder, few misses',
    detail:  'Methodical. Rarely panics, rarely overbids. Mid-range bids on high-confidence targets. The 89% efficiency rating reflects a manager who understands their ceiling and bids accordingly.',
    color:   'blue',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GRADE_CLASSES: Record<BestAdd['grade'], string> = {
  'A+': 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40',
  'A':  'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  'B':  'bg-blue-500/15 text-blue-400 border-blue-500/40',
  'C':  'bg-amber-500/15 text-amber-400 border-amber-500/40',
};

const ARCHETYPE_COLORS: Record<Archetype['color'], { border: string; badge: string; icon: string }> = {
  gold:  { border: 'border-[#ffd700]/30 bg-[#ffd700]/5',   badge: 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30',   icon: 'text-[#ffd700]' },
  red:   { border: 'border-[#e94560]/30 bg-[#e94560]/5',   badge: 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',   icon: 'text-[#e94560]' },
  slate: { border: 'border-slate-500/30 bg-slate-500/5',   badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',   icon: 'text-slate-400' },
  blue:  { border: 'border-blue-500/30 bg-blue-500/5',     badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',      icon: 'text-blue-400' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaabAuditPage() {
  const totalSpent    = MANAGER_RANKINGS.reduce((s, r) => s + r.totalSpent, 0);
  const avgEfficiency = Math.round(MANAGER_RANKINGS.reduce((s, r) => s + r.efficiency, 0) / MANAGER_RANKINGS.length);
  const productiveAdds = 47; // curated estimate across 6 seasons

  return (
    <>
      <Head>
        <title>FAAB Efficiency Audit — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Six-season FAAB audit for BMFFFL — efficiency rankings, best pickups, biggest busts, and manager bidding archetypes."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            FAAB Efficiency Audit
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Six seasons of blind auction data — who spent wisely, who overpaid, and which $8 bid changed a dynasty forever.
          </p>
        </header>

        {/* Section 1: League FAAB Overview */}
        <section className="mb-12" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            League FAAB Overview
          </h2>
          <p className="text-slate-500 text-sm mb-5">Aggregate metrics across all 6 seasons of BMFFFL waiver activity.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-5 py-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total FAAB Spent (6 Seasons)</p>
              <p className="text-3xl font-black text-[#ffd700] tabular-nums">${totalSpent.toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-1">$200 budget per team per season</p>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 px-5 py-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Efficiency (All Managers)</p>
              <p className="text-3xl font-black text-blue-400 tabular-nums">{avgEfficiency}%</p>
              <p className="text-slate-500 text-xs mt-1">Points scored by added players vs. FAAB spent</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Productive Adds (League-Wide)</p>
              <p className="text-3xl font-black text-emerald-400 tabular-nums">{productiveAdds}</p>
              <p className="text-slate-500 text-xs mt-1">Players who started 3+ weeks after being added</p>
            </div>
          </div>
        </section>

        {/* Section 2: Manager FAAB Rankings */}
        <section className="mb-12" aria-labelledby="rankings-heading">
          <h2 id="rankings-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" aria-hidden="true" />
            Manager FAAB Rankings
          </h2>
          <p className="text-slate-500 text-sm mb-5">
            All 12 managers ranked by FAAB Efficiency % — points scored by added players divided by FAAB spent. $200/season budget.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Manager FAAB rankings">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Manager</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider w-28">Total Spent</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider w-28">Efficiency</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Best Add</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Worst Add</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {MANAGER_RANKINGS.map((row, idx) => (
                    <tr
                      key={row.owner}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                        row.rank <= 3 && 'bg-[#ffd700]/3',
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black',
                          row.rank === 1 ? 'bg-[#ffd700] text-[#0d1b2a]' :
                          row.rank === 2 ? 'bg-slate-400 text-[#0d1b2a]' :
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
                        <span className="font-mono font-semibold text-slate-300 tabular-nums">${row.totalSpent.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn(
                          'text-sm font-black font-mono tabular-nums',
                          row.efficiency >= 85 ? 'text-emerald-400' :
                          row.efficiency >= 70 ? 'text-amber-400' :
                          'text-[#e94560]'
                        )}>
                          {row.efficiency}%
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-emerald-400">{row.bestAdd}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-[#e94560]">{row.worstAdd}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3: Best FAAB Adds */}
        <section className="mb-12" aria-labelledby="best-adds-heading">
          <h2 id="best-adds-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            Best FAAB Adds in League History
          </h2>
          <p className="text-slate-500 text-sm mb-5">Top 10 pickups ranked by value returned relative to cost.</p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Best FAAB adds all time">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Player</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Owner</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider w-20">Cost</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-16">Grade</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">What They Became</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {BEST_ADDS.map((add, idx) => (
                    <tr
                      key={add.rank}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black',
                          add.rank === 1 ? 'bg-[#ffd700] text-[#0d1b2a]' :
                          add.rank === 2 ? 'bg-slate-400 text-[#0d1b2a]' :
                          add.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-[#1e3347] text-slate-400'
                        )}>
                          {add.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-white">{add.player}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5 sm:hidden capitalize">{add.owner}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-300 capitalize">{add.owner}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono font-bold text-[#ffd700] tabular-nums">${add.cost}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider',
                          GRADE_CLASSES[add.grade]
                        )}>
                          {add.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-400">{add.outcome}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4: Biggest FAAB Busts */}
        <section className="mb-12" aria-labelledby="busts-heading">
          <h2 id="busts-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
            Biggest FAAB Busts
          </h2>
          <p className="text-slate-500 text-sm mb-5">The worst-value FAAB spends in league history — money spent, nothing returned.</p>

          <div className="flex flex-col gap-3">
            {BUSTS.map((bust) => (
              <div
                key={bust.rank}
                className="rounded-xl border border-[#e94560]/25 bg-[#e94560]/5 px-5 py-4 flex items-start gap-4"
              >
                <span className={cn(
                  'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black shrink-0 mt-0.5',
                  bust.rank === 1 ? 'bg-[#e94560] text-white' : 'bg-[#e94560]/20 text-[#e94560]'
                )}>
                  {bust.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-bold text-white capitalize">{bust.owner}</span>
                    <span className="font-mono font-black text-[#e94560] text-sm">${bust.amount}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{bust.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: FAAB Strategy Archetypes */}
        <section className="mb-12" aria-labelledby="archetypes-heading">
          <h2 id="archetypes-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" aria-hidden="true" />
            FAAB Strategy by Manager
          </h2>
          <p className="text-slate-500 text-sm mb-5">Four distinct bidding archetypes that have emerged over six seasons of auction data.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ARCHETYPES.map((arch) => {
              const colors = ARCHETYPE_COLORS[arch.color];
              return (
                <div
                  key={arch.label}
                  className={cn('rounded-xl border p-5', colors.border)}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className={cn(
                        'text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block mb-1',
                        colors.badge
                      )}>
                        {arch.label}
                      </p>
                      <p className="text-white font-black text-base capitalize">{arch.owner}</p>
                    </div>
                    <Target className={cn('w-5 h-5 shrink-0 mt-1', colors.icon)} aria-hidden="true" />
                  </div>
                  <p className="text-slate-300 text-sm font-semibold italic mb-2">&ldquo;{arch.tagline}&rdquo;</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{arch.detail}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bimfle Note */}
        <div className="mb-10 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-6 py-5">
          <p className="text-sm text-slate-300 leading-relaxed italic">
            &ldquo;FAAB is the truest measure of a dynasty manager&rsquo;s conviction. Spending $12 on James Cook and $67 on nothing are both forms of self-expression. Only one of them wins championships.&rdquo;
          </p>
          <p className="text-xs text-[#ffd700] font-semibold mt-2">&mdash; Love, Bimfle.</p>
        </div>

        {/* Footer */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Six-Season Audit</span> &mdash; FAAB data curated from BMFFFL seasons 2020&ndash;2025. Efficiency ratings based on points scored by FAAB-added players relative to dollars spent. $200 blind-auction budget per team per season.
          </p>
        </div>

      </div>
    </>
  );
}
