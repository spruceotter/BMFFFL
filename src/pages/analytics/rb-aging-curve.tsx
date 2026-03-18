import { useState, useMemo } from 'react';
import Head from 'next/head';
import { TrendingUp, TrendingDown, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Recommendation = 'BUY' | 'HOLD' | 'SELL' | 'RENTAL';
type AgePhase = 'Upside' | 'Prime' | 'Peak' | 'Decline' | 'Significant Decline' | 'End Window' | 'Rental';

interface AgeBand {
  ages: string;
  ageMin: number;
  ageMax: number;
  phase: AgePhase;
  valueRange: string;
  valueMid: number;
  recommendation: Recommendation;
  description: string;
}

interface BmffflRb {
  name: string;
  nflTeam: string;
  age: number;
  bmffflOwner: string;
  ownerColor: string;
  dynastyValue: number;
  recommendation: Recommendation;
  note: string;
  buyReason?: string;
}

interface HistoricalDecision {
  title: string;
  player: string;
  age: number;
  decision: 'RIGHT' | 'WRONG' | 'LESSON';
  owner?: string;
  ownerColor?: string;
  summary: string;
  outcome: string;
  takeaway: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

// ─── Industry Consensus Aging Curve ───────────────────────────────────────────

const AGE_BANDS: AgeBand[] = [
  {
    ages: '22–23',
    ageMin: 22,
    ageMax: 23,
    phase: 'Upside',
    valueRange: '80–100',
    valueMid: 90,
    recommendation: 'BUY',
    description: 'High-upside window. Rookies and second-year players with top-12 potential. Buy aggressively — value will only rise if they earn a feature role.',
  },
  {
    ages: '24–25',
    ageMin: 24,
    ageMax: 25,
    phase: 'Prime',
    valueRange: '90–100',
    valueMid: 95,
    recommendation: 'BUY',
    description: 'Peak dynasty window. Established feature backs with proven production. These are the most coveted assets in any dynasty trade.',
  },
  {
    ages: '26',
    ageMin: 26,
    ageMax: 26,
    phase: 'Peak',
    valueRange: '85–95',
    valueMid: 90,
    recommendation: 'HOLD',
    description: 'Still elite production but the market begins discounting future years. Hold studs, monitor workload and injury history heading into age 27.',
  },
  {
    ages: '27',
    ageMin: 27,
    ageMax: 27,
    phase: 'Decline',
    valueRange: '70–85',
    valueMid: 77,
    recommendation: 'HOLD',
    description: 'Decline phase begins. Usage often remains high but efficiency and durability start to dip. Evaluate trade value — the sell window is NOW if dynasty depth is needed.',
  },
  {
    ages: '28',
    ageMin: 28,
    ageMax: 28,
    phase: 'Significant Decline',
    valueRange: '55–70',
    valueMid: 62,
    recommendation: 'SELL',
    description: 'Significant dynasty value erosion. Most RBs at 28 are heading off a cliff. Sell into the spot market before the market catches on.',
  },
  {
    ages: '29–30',
    ageMin: 29,
    ageMax: 30,
    phase: 'End Window',
    valueRange: '30–50',
    valueMid: 40,
    recommendation: 'SELL',
    description: 'End of viable dynasty window. Production can persist year-to-year but dynasty value is largely gone. Only contending teams should hold.',
  },
  {
    ages: '31+',
    ageMin: 31,
    ageMax: 99,
    phase: 'Rental',
    valueRange: '10–25',
    valueMid: 17,
    recommendation: 'RENTAL',
    description: 'Rental-only territory. Carry if competing now, but the dynasty value is essentially zero. Age 32+ RBs rarely maintain top-24 finishes for full seasons.',
  },
];

// ─── Current BMFFFL RBs ───────────────────────────────────────────────────────

const BMFFFL_RBS: BmffflRb[] = [
  // Age 22 — Upside tier
  {
    name: 'Ashton Jeanty',
    nflTeam: 'LV',
    age: 22,
    bmffflOwner: 'Grandes',
    ownerColor: 'text-purple-400',
    dynastyValue: 91,
    recommendation: 'BUY',
    note: 'Elite #1 overall RB prospect from the 2025 draft class. Boise State record-setter. Raiders feature back from Day 1.',
    buyReason: 'Buy at any price under 1.03-equivalent. Peak window age 22–25 coming.',
  },
  {
    name: 'Omarion Hampton',
    nflTeam: 'LAC',
    age: 22,
    bmffflOwner: 'Cogdeill11',
    ownerColor: 'text-[#e94560]',
    dynastyValue: 90,
    recommendation: 'BUY',
    note: '2025 draft pick — top-5 dynasty RB. Chargers gave up Josh Kelley to clear his path. High floor + ceiling.',
    buyReason: 'Lock him up. Age 22 RBs with starter roles are dynasty gold.',
  },
  {
    name: 'Quinshon Judkins',
    nflTeam: 'GB',
    age: 22,
    bmffflOwner: 'rbr',
    ownerColor: 'text-orange-400',
    dynastyValue: 83,
    recommendation: 'BUY',
    note: 'Ohio State product drafted by the Packers. Aaron Jones departure clears lane. Big college production translates.',
    buyReason: 'Dynasty buy. 22-year-old with a clear path to starting role in a run-heavy offense.',
  },
  // Age 23 — Still upside
  {
    name: 'Bucky Irving',
    nflTeam: 'TB',
    age: 23,
    bmffflOwner: 'MLSchools12',
    ownerColor: 'text-[#ffd700]',
    dynastyValue: 84,
    recommendation: 'BUY',
    note: 'Buccaneers RB1 after Rachaad White departure. Efficient runner with receiving upside. Second-year leap incoming.',
    buyReason: 'Best value at 23 — not yet at peak price but on trajectory.',
  },
  {
    name: "De'Von Achane",
    nflTeam: 'MIA',
    age: 23,
    bmffflOwner: 'JuicyBussy',
    ownerColor: 'text-emerald-400',
    dynastyValue: 81,
    recommendation: 'BUY',
    note: 'Elite speed + pass-catching ability. Miami\'s future RB1. Health is the only concern — elite when on the field.',
    buyReason: 'Buy on health discount if available. Ceiling is a top-3 dynasty RB.',
  },
  // Age 24 — Peak / Prime
  {
    name: 'Bijan Robinson',
    nflTeam: 'ATL',
    age: 24,
    bmffflOwner: 'Tubes94',
    ownerColor: 'text-rose-400',
    dynastyValue: 95,
    recommendation: 'BUY',
    note: 'Top dynasty RB in the industry. 1,500+ yard ceiling every season. Arthur Smith\'s bell cow in Atlanta — age 24–27 prime window.',
    buyReason: 'Franchise cornerstone. Do not trade under any circumstances unless in full rebuild.',
  },
  {
    name: 'Breece Hall',
    nflTeam: 'NYJ',
    age: 24,
    bmffflOwner: 'Tubes94',
    ownerColor: 'text-rose-400',
    dynastyValue: 93,
    recommendation: 'BUY',
    note: 'Jets\' workhorse RB. Elite receiving back entering the prime of his career. Double threat that caps upside on bad teams but maintains value.',
    buyReason: 'Buy and lock. Age-24 receiving back with a lead role = dynasty royalty.',
  },
  // Age 25 — Prime
  {
    name: 'Kyren Williams',
    nflTeam: 'LAR',
    age: 25,
    bmffflOwner: 'tdtd19844',
    ownerColor: 'text-amber-400',
    dynastyValue: 74,
    recommendation: 'HOLD',
    note: 'LAR bell cow but injury history is real. 1,100+ yards in healthy seasons. Hold heading into his peak age 25-26 window.',
    buyReason: 'Hold firmly. Age 25 with established role = peak value period.',
  },
  {
    name: 'James Cook',
    nflTeam: 'BUF',
    age: 25,
    bmffflOwner: 'eldridm20',
    ownerColor: 'text-lime-400',
    dynastyValue: 73,
    recommendation: 'HOLD',
    note: 'Bills feature back. Josh Allen company elevates floor. Age 25 means two more peak seasons ahead before monitoring decline.',
    buyReason: 'Do not sell. Hold into age 26 before reassessing.',
  },
  // Age 27 — Decline
  {
    name: 'Josh Jacobs',
    nflTeam: 'GB',
    age: 27,
    bmffflOwner: 'MLSchools12',
    ownerColor: 'text-[#ffd700]',
    dynastyValue: 73,
    recommendation: 'SELL',
    note: 'Still productive but age 27 is the historical tipping point for dynasty value. 1,100+ yards in 2025 inflates buy price — ideal sell window.',
    buyReason: undefined,
  },
  {
    name: 'Jonathan Taylor',
    nflTeam: 'IND',
    age: 27,
    bmffflOwner: 'SexMachineAndyD',
    ownerColor: 'text-blue-400',
    dynastyValue: 72,
    recommendation: 'SELL',
    note: 'Former dynasty RB1. Age 27 sell-high window is closing fast. Colts are rebuilding — Taylor\'s best production may be behind him.',
    buyReason: undefined,
  },
];

// ─── Historical BMFFFL RB Decisions ───────────────────────────────────────────

const HISTORICAL_DECISIONS: HistoricalDecision[] = [
  {
    title: 'The Right Call — Sell Age 27 RBs',
    player: 'Dalvin Cook',
    age: 27,
    decision: 'RIGHT',
    summary: 'One BMFFFL owner moved Dalvin Cook at age 27 when his market value was still near its peak. Cook then had an injury-plagued 2022 and was released by the Jets before age 29.',
    outcome: 'Received two early dynasty picks in return. Both hits contributed to a playoff run two seasons later.',
    takeaway: 'Age 27 is the inflection point. The market overvalues recent production over future trajectory. Always sell into strength.',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
  },
  {
    title: 'The Wrong Call — Holding CMC at 28',
    player: 'Christian McCaffrey',
    age: 28,
    decision: 'WRONG',
    owner: 'SexMachineAndyD',
    ownerColor: 'text-blue-400',
    summary: 'McCaffrey\'s dynasty value peaked in 2022 at age 25-26. Owners who held into his age 28-29 seasons (2024-2025) watched trade value collapse from the dynasty market.',
    outcome: 'McCaffrey\'s dynasty value dropped from top-5 to unrankable within two seasons. Sell windows were available at ages 26 and 27.',
    takeaway: 'Elite players get held too long. CMC\'s name value masked the aging reality. The data said sell at 27; hindsight confirms it.',
    color: 'text-[#e94560]',
    borderColor: 'border-[#e94560]/30',
    bgColor: 'bg-[#e94560]/5',
  },
  {
    title: 'The Lesson — Buy Young, Hold Through Prime',
    player: 'Bijan Robinson',
    age: 22,
    decision: 'LESSON',
    owner: 'Tubes94',
    ownerColor: 'text-rose-400',
    summary: 'Tubes94 acquired Bijan Robinson in the 2023 rookie draft at age 21. His roster now features both Robinson (24) and Breece Hall (24) — both in their prime dynasty windows simultaneously.',
    outcome: 'Tubes94 is Dynasty Rank #2 entering 2026 and reached the championship game in 2025. The young RB core is the foundation.',
    takeaway: 'Buy elite RBs in the 21-23 window and hold through 24-25. The dynasty curve rewards patience when you buy correctly.',
    color: 'text-rose-400',
    borderColor: 'border-rose-400/30',
    bgColor: 'bg-rose-400/5',
  },
  {
    title: 'The Josh Jacobs Dilemma',
    player: 'Josh Jacobs',
    age: 27,
    decision: 'LESSON',
    owner: 'MLSchools12',
    ownerColor: 'text-[#ffd700]',
    summary: 'MLSchools12 holds Josh Jacobs at age 27. His recent production (1,100+ yards in 2025) keeps dynasty value inflated. The question for 2026: hold for one more year or sell into the market now?',
    outcome: 'The dynasty consensus says age 27 is the sell window. MLSchools12 is contending now — he may rationally hold for one more year. But age 28 will likely be a steep drop-off.',
    takeaway: 'For contenders, holding an aging RB one extra year can be worth it. But two extra years is where dynasties rot. Know your window.',
    color: 'text-[#ffd700]',
    borderColor: 'border-[#ffd700]/30',
    bgColor: 'bg-[#ffd700]/5',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function recommendationStyle(rec: Recommendation): string {
  switch (rec) {
    case 'BUY':    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'HOLD':   return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'SELL':   return 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30';
    case 'RENTAL': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

function phaseBarWidth(valueMid: number): string {
  // valueMid ranges 17-95; map to 15%-100% width
  const pct = Math.round(15 + ((valueMid - 17) / (95 - 17)) * 85);
  return `${pct}%`;
}

function phaseBarColor(rec: Recommendation): string {
  switch (rec) {
    case 'BUY':    return 'bg-emerald-500';
    case 'HOLD':   return 'bg-amber-500';
    case 'SELL':   return 'bg-[#e94560]';
    case 'RENTAL': return 'bg-slate-500';
  }
}

function ageBandForAge(age: number): AgeBand | undefined {
  return AGE_BANDS.find(b => age >= b.ageMin && age <= b.ageMax);
}

// ─── Age curve visual bar ──────────────────────────────────────────────────────

function AgeCurveBar() {
  return (
    <div className="space-y-2" aria-label="RB dynasty aging curve">
      {AGE_BANDS.map(band => (
        <div key={band.ages} className="flex items-center gap-3">
          <div className="w-12 shrink-0 text-right">
            <span className="text-xs font-mono text-slate-400 tabular-nums">{band.ages}</span>
          </div>
          <div className="flex-1 bg-[#0d1b2a] rounded-sm h-7 overflow-hidden relative border border-[#2d4a66]/40">
            <div
              className={cn('h-full rounded-sm transition-all', phaseBarColor(band.recommendation))}
              style={{ width: phaseBarWidth(band.valueMid), opacity: 0.75 }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-center px-2 gap-2">
              <span className="text-[11px] font-semibold text-white/90 tabular-nums">{band.valueRange}</span>
              <span className="text-[10px] text-white/50">{band.phase}</span>
            </div>
          </div>
          <div className="w-16 shrink-0">
            <span className={cn(
              'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold border w-full',
              recommendationStyle(band.recommendation)
            )}>
              {band.recommendation}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RbAgingCurvePage() {
  const [filterRec, setFilterRec] = useState<Recommendation | 'ALL'>('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const filteredRbs = useMemo(() => {
    if (filterRec === 'ALL') return BMFFFL_RBS;
    return BMFFFL_RBS.filter(rb => rb.recommendation === filterRec);
  }, [filterRec]);

  const selectedRbData = selectedPlayer
    ? BMFFFL_RBS.find(rb => rb.name === selectedPlayer)
    : null;

  // Group by age band
  const rbsByBand = useMemo(() => {
    const groups: Record<string, BmffflRb[]> = {};
    AGE_BANDS.forEach(b => { groups[b.ages] = []; });
    BMFFFL_RBS.forEach(rb => {
      const band = ageBandForAge(rb.age);
      if (band) groups[band.ages].push(rb);
    });
    return groups;
  }, []);

  return (
    <>
      <Head>
        <title>RB Aging Curve — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Dynasty RB aging curve analysis — industry consensus value by age, BMFFFL RB buy/sell/hold recommendations, and historical decision breakdowns."
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
            RB Aging Curve
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Industry consensus dynasty value by age — with BMFFFL roster overlays, buy/sell/hold ratings, and historical decision breakdowns.
          </p>
        </header>

        {/* Two-column layout: curve + context */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6" aria-labelledby="curve-heading">

          {/* Aging curve visual */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6">
            <h2 id="curve-heading" className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
              Industry Consensus Curve
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Dynasty value index (0–100) by age phase — bar width represents relative value
            </p>
            <AgeCurveBar />
            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-[#2d4a66] flex flex-wrap gap-3">
              {(['BUY', 'HOLD', 'SELL', 'RENTAL'] as const).map(rec => (
                <div key={rec} className="flex items-center gap-1.5">
                  <div className={cn(
                    'w-3 h-3 rounded-sm shrink-0',
                    rec === 'BUY' ? 'bg-emerald-500' :
                    rec === 'HOLD' ? 'bg-amber-500' :
                    rec === 'SELL' ? 'bg-[#e94560]' : 'bg-slate-500'
                  )} aria-hidden="true" />
                  <span className="text-[11px] text-slate-500">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Age phase descriptions */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6">
            <h2 className="text-base font-bold text-white mb-1">Phase Breakdown</h2>
            <p className="text-xs text-slate-500 mb-4">What each age phase means for dynasty decisions</p>
            <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
              {AGE_BANDS.map(band => (
                <div key={band.ages} className={cn(
                  'rounded-lg border p-3',
                  band.recommendation === 'BUY'    ? 'border-emerald-500/20 bg-emerald-500/5' :
                  band.recommendation === 'HOLD'   ? 'border-amber-500/20 bg-amber-500/5' :
                  band.recommendation === 'SELL'   ? 'border-[#e94560]/20 bg-[#e94560]/5' :
                                                    'border-slate-500/20 bg-slate-500/5'
                )}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-300 font-mono">Age {band.ages}</span>
                    <span className={cn(
                      'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold border',
                      recommendationStyle(band.recommendation)
                    )}>
                      {band.recommendation}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto font-semibold">{band.phase}</span>
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">{band.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BMFFFL RB grid by age band */}
        <section className="mb-10" aria-labelledby="bmfffl-rbs-heading">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <h2 id="bmfffl-rbs-heading" className="text-lg font-bold text-white">
                BMFFFL Running Backs on the Curve
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Current BMFFFL RBs plotted by age with dynasty recommendations
              </p>
            </div>

            {/* Filter */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Filter by action</p>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by recommendation">
                {(['ALL', 'BUY', 'HOLD', 'SELL', 'RENTAL'] as const).map(rec => (
                  <button
                    key={rec}
                    onClick={() => setFilterRec(rec)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150',
                      filterRec === rec
                        ? rec === 'ALL'    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                          : rec === 'BUY'  ? 'bg-emerald-500 text-white border-emerald-500'
                          : rec === 'HOLD' ? 'bg-amber-500 text-[#0d1b2a] border-amber-500'
                          : rec === 'SELL' ? 'bg-[#e94560] text-white border-[#e94560]'
                          :                  'bg-slate-500 text-white border-slate-500'
                        : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                    )}
                    aria-pressed={filterRec === rec}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRbs.map(rb => {
              const band = ageBandForAge(rb.age);
              const isSelected = selectedPlayer === rb.name;
              return (
                <button
                  key={rb.name}
                  onClick={() => setSelectedPlayer(isSelected ? null : rb.name)}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-all duration-150 w-full group',
                    isSelected
                      ? 'border-[#ffd700]/50 bg-[#ffd700]/8 ring-1 ring-[#ffd700]/30'
                      : 'border-[#2d4a66] bg-[#16213e] hover:border-[#2d4a66]/80 hover:bg-[#1a2d42]'
                  )}
                  aria-pressed={isSelected}
                  aria-label={`${rb.name} — ${rb.recommendation}. Click for details.`}
                >
                  {/* Player header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-white leading-tight">{rb.name}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-[#2d4a66]/50 px-1.5 py-0.5 rounded">
                          {rb.nflTeam}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn('text-xs font-semibold', rb.ownerColor)}>{rb.bmffflOwner}</span>
                        <span className="text-[10px] text-slate-600">&bull;</span>
                        <span className="text-xs text-slate-500 font-mono">Age {rb.age}</span>
                      </div>
                    </div>
                    <span className={cn(
                      'inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold border shrink-0',
                      recommendationStyle(rb.recommendation)
                    )}>
                      {rb.recommendation}
                    </span>
                  </div>

                  {/* Dynasty value bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Dynasty Value</span>
                      <span className="text-[10px] font-bold text-[#ffd700] tabular-nums">{rb.dynastyValue}</span>
                    </div>
                    <div className="h-1.5 bg-[#0d1b2a] rounded-full overflow-hidden border border-[#2d4a66]/30">
                      <div
                        className={cn('h-full rounded-full transition-all', phaseBarColor(rb.recommendation))}
                        style={{ width: `${rb.dynastyValue}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Age band label */}
                  {band && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">Phase:</span>
                      <span className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded border',
                        band.recommendation === 'BUY'  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        band.recommendation === 'HOLD' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                                         'text-[#e94560] bg-[#e94560]/10 border-[#e94560]/20'
                      )}>
                        {band.phase}
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{rb.note}</p>
                </button>
              );
            })}
          </div>

          {filteredRbs.length === 0 && (
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-8 text-center">
              <p className="text-slate-500 text-sm">No BMFFFL RBs in that recommendation tier.</p>
            </div>
          )}

          {/* Selected player detail */}
          {selectedRbData && (() => {
            const band = ageBandForAge(selectedRbData.age);
            return (
              <div className="mt-4 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-base font-bold text-white">{selectedRbData.name}</span>
                      <span className="text-xs font-semibold text-slate-500">{selectedRbData.nflTeam}</span>
                      <span className="text-xs font-semibold text-slate-500">&bull; Age {selectedRbData.age}</span>
                      <span className={cn(
                        'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold border ml-auto',
                        recommendationStyle(selectedRbData.recommendation)
                      )}>
                        {selectedRbData.recommendation}
                      </span>
                    </div>
                    <p className={cn('text-xs font-semibold mb-2', selectedRbData.ownerColor)}>
                      Owner: {selectedRbData.bmffflOwner}
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed mb-2">{selectedRbData.note}</p>
                    {selectedRbData.buyReason && (
                      <p className="text-xs text-emerald-400 leading-relaxed">
                        <span className="font-semibold">Dynasty take:</span> {selectedRbData.buyReason}
                      </p>
                    )}
                    {band && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        <span className="text-slate-500 font-semibold">Age phase context:</span> {band.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Quick-view table */}
        <section className="mb-10" aria-labelledby="quick-table-heading">
          <h2 id="quick-table-heading" className="text-lg font-bold text-white mb-4">
            All BMFFFL RBs — Quick View
          </h2>
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="All BMFFFL running backs with age curve ratings">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider sticky left-0 bg-[#0f2744] z-10">Player</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">NFL</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">Age</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">Phase</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">Value</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">Action</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {[...BMFFFL_RBS].sort((a, b) => a.age - b.age).map((rb, idx) => {
                    const band = ageBandForAge(rb.age);
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={rb.name}
                        className={cn(
                          'transition-colors duration-100 hover:bg-[#1f3550]',
                          isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}
                      >
                        <td className={cn(
                          'px-4 py-3 sticky left-0 z-10 font-semibold text-white',
                          isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}>
                          {rb.name}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-slate-400 font-mono">{rb.nflTeam}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="text-xs font-bold text-slate-300 tabular-nums">{rb.age}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded border',
                            band?.recommendation === 'BUY'  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                            band?.recommendation === 'HOLD' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                            band?.recommendation === 'SELL' ? 'text-[#e94560] bg-[#e94560]/10 border-[#e94560]/20' :
                                                             'text-slate-400 bg-slate-500/10 border-slate-500/20'
                          )}>
                            {band?.phase ?? '—'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-[#0d1b2a] rounded-full overflow-hidden border border-[#2d4a66]/30">
                              <div
                                className={cn('h-full rounded-full', phaseBarColor(rb.recommendation))}
                                style={{ width: `${rb.dynastyValue}%` }}
                                aria-hidden="true"
                              />
                            </div>
                            <span className="text-xs font-bold text-[#ffd700] tabular-nums w-6 text-right">{rb.dynastyValue}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn(
                            'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold border w-12',
                            recommendationStyle(rb.recommendation)
                          )}>
                            {rb.recommendation}
                          </span>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <span className={cn('text-xs font-semibold', rb.ownerColor)}>{rb.bmffflOwner}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Historical BMFFFL decisions */}
        <section className="mb-10" aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-lg font-bold text-white mb-2">
            Historical BMFFFL RB Decisions
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Real examples where owners made the right or wrong call based on age — and what the aging curve teaches us in retrospect.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HISTORICAL_DECISIONS.map(decision => (
              <div
                key={decision.title}
                className={cn('rounded-xl border p-5', decision.borderColor, decision.bgColor)}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="shrink-0 mt-0.5">
                    {decision.decision === 'RIGHT' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    ) : decision.decision === 'WRONG' ? (
                      <AlertTriangle className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
                    ) : (
                      <Info className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={cn('text-[10px] font-bold uppercase tracking-widest', decision.color)}>
                        {decision.decision === 'RIGHT' ? 'Right Call' : decision.decision === 'WRONG' ? 'Wrong Call' : 'Lesson'}
                      </span>
                      <span className="text-[10px] text-slate-600">&bull;</span>
                      <span className="text-[10px] text-slate-500 font-mono">Age {decision.age}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">{decision.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-semibold text-slate-400">{decision.player}</span>
                      {decision.owner && (
                        <>
                          <span className="text-[10px] text-slate-600">&bull;</span>
                          <span className={cn('text-xs font-semibold', decision.ownerColor)}>{decision.owner}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">{decision.summary}</p>

                <div className="space-y-2">
                  <div className="rounded-lg bg-[#0d1b2a]/50 border border-[#2d4a66]/40 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-0.5">Outcome</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{decision.outcome}</p>
                  </div>
                  <div className={cn(
                    'rounded-lg px-3 py-2 border',
                    decision.decision === 'RIGHT' ? 'bg-emerald-500/8 border-emerald-500/15' :
                    decision.decision === 'WRONG' ? 'bg-[#e94560]/8 border-[#e94560]/15' :
                                                    'bg-[#ffd700]/5 border-[#ffd700]/15'
                  )}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-0.5">Takeaway</p>
                    <p className={cn('text-xs leading-relaxed', decision.color)}>{decision.takeaway}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary action guide */}
        <section className="mb-10" aria-labelledby="action-guide-heading">
          <h2 id="action-guide-heading" className="text-lg font-bold text-white mb-4">
            Dynasty Action Guide by Age Tier
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                rec: 'BUY' as const,
                ages: 'Age 22–25',
                headline: 'Buy Aggressively',
                bullets: [
                  'Dynasty value at or near peak',
                  'Multiple elite seasons ahead',
                  'Trade heavy assets if needed',
                  'Hold through age 26 at minimum',
                ],
                borderColor: 'border-emerald-500/30',
                bgColor: 'bg-emerald-500/5',
                textColor: 'text-emerald-400',
              },
              {
                rec: 'HOLD' as const,
                ages: 'Age 26–27',
                headline: 'Hold & Monitor',
                bullets: [
                  'Still productive; sell window opening',
                  'Watch injury history carefully',
                  'Evaluate whether team is contending',
                  'Age 27 = last reasonable sell window',
                ],
                borderColor: 'border-amber-500/30',
                bgColor: 'bg-amber-500/5',
                textColor: 'text-amber-400',
              },
              {
                rec: 'SELL' as const,
                ages: 'Age 28–29',
                headline: 'Sell Into Market',
                bullets: [
                  'Dynasty value collapsing',
                  'Market still pays for recent production',
                  'Move to younger assets immediately',
                  'Only hold if championship window now',
                ],
                borderColor: 'border-[#e94560]/30',
                bgColor: 'bg-[#e94560]/5',
                textColor: 'text-[#e94560]',
              },
              {
                rec: 'RENTAL' as const,
                ages: 'Age 30+',
                headline: 'Rental Only',
                bullets: [
                  'Zero dynasty value to preserve',
                  'Short-term starter if competing',
                  'Never trade future assets for this tier',
                  'Plan offseason replacement immediately',
                ],
                borderColor: 'border-slate-500/30',
                bgColor: 'bg-slate-500/5',
                textColor: 'text-slate-400',
              },
            ].map(tier => (
              <div key={tier.rec} className={cn('rounded-xl border p-4', tier.borderColor, tier.bgColor)}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={cn('text-[10px] font-bold uppercase tracking-widest', tier.textColor)}>
                    {tier.rec}
                  </span>
                  <span className="text-[10px] font-mono text-slate-600">{tier.ages}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-3">{tier.headline}</h3>
                <ul className="space-y-1.5" aria-label={`${tier.rec} tier guidance`}>
                  {tier.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
                      <span className={cn('mt-1 w-1 h-1 rounded-full shrink-0', tier.textColor.replace('text-', 'bg-'))} aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Data note:</span>{' '}
            Dynasty value scores are based on March 2026 consensus rankings. Age curve data represents industry consensus from FantasyPros, KTC, and dynasty community research.
            Individual players can outperform or underperform the curve — Christian McCaffrey, Arian Foster, and LeSean McCoy are historical outliers. The curve is a guide, not a guarantee.
            Click any player card to see the full breakdown and dynasty take.
          </p>
        </div>

      </div>
    </>
  );
}
