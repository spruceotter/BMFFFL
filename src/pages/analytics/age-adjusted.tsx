import Head from 'next/head';
import { TrendingUp, Users, AlertTriangle, Trophy, Activity } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Pos = 'QB' | 'RB' | 'WR' | 'TE';

interface PlayerRow {
  rank:     number;
  name:     string;
  pos:      Pos;
  age:      number;
  rawValue: number;
  adjPct:   number;  // 0–100
  adjValue: number;
  window:   string;  // e.g. "2025–2029"
}

interface RosterAgeScore {
  manager:   string;
  rawTotal:  number;
  adjTotal:  number;
  adjPct:    number;
  note:      string;
  phase:     'Young' | 'Prime' | 'Aging' | 'Veteran';
}

interface PeakCurve {
  pos:      Pos;
  peak:     string;
  cliff:    string;
  color:    string;
  bg:       string;
  border:   string;
  bar:      string;
  note:     string;
}

// ─── Age Adjustment Model ─────────────────────────────────────────────────────

function calcAdjPct(age: number): number {
  if (age <= 25) return 100;
  if (age <= 28) return 85;
  if (age <= 31) return 60;
  return 25;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOP_40: PlayerRow[] = [
  { rank:  1, name: 'Tetairoa McMillan',  pos: 'WR', age: 21, rawValue:  9800, adjPct: 100, adjValue:  9800, window: '2026–2032' },
  { rank:  2, name: "Ja'Marr Chase",      pos: 'WR', age: 24, rawValue:  9600, adjPct: 100, adjValue:  9600, window: '2025–2030' },
  { rank:  3, name: 'Justin Jefferson',   pos: 'WR', age: 25, rawValue:  9400, adjPct: 100, adjValue:  9400, window: '2025–2030' },
  { rank:  4, name: 'CJ Stroud',          pos: 'QB', age: 23, rawValue:  9100, adjPct: 100, adjValue:  9100, window: '2026–2033' },
  { rank:  5, name: 'Bijan Robinson',     pos: 'RB', age: 23, rawValue:  8900, adjPct: 100, adjValue:  8900, window: '2025–2029' },
  { rank:  6, name: 'Puka Nacua',         pos: 'WR', age: 23, rawValue:  8700, adjPct: 100, adjValue:  8700, window: '2026–2031' },
  { rank:  7, name: 'Malik Nabers',       pos: 'WR', age: 22, rawValue:  8600, adjPct: 100, adjValue:  8600, window: '2025–2032' },
  { rank:  8, name: 'Jaylen Waddle',      pos: 'WR', age: 26, rawValue:  8400, adjPct:  85, adjValue:  7140, window: '2025–2028' },
  { rank:  9, name: 'Sam LaPorta',        pos: 'TE', age: 23, rawValue:  8200, adjPct: 100, adjValue:  8200, window: '2026–2031' },
  { rank: 10, name: 'Kyren Williams',     pos: 'RB', age: 24, rawValue:  8000, adjPct: 100, adjValue:  8000, window: '2025–2029' },
  { rank: 11, name: 'Drake London',       pos: 'WR', age: 24, rawValue:  7900, adjPct: 100, adjValue:  7900, window: '2025–2030' },
  { rank: 12, name: 'Jordan Love',        pos: 'QB', age: 26, rawValue:  7800, adjPct:  85, adjValue:  6630, window: '2025–2030' },
  { rank: 13, name: 'Rashee Rice',        pos: 'WR', age: 24, rawValue:  7700, adjPct: 100, adjValue:  7700, window: '2026–2031' },
  { rank: 14, name: 'Amon-Ra St. Brown',  pos: 'WR', age: 25, rawValue:  7600, adjPct: 100, adjValue:  7600, window: '2025–2030' },
  { rank: 15, name: 'Tank Dell',          pos: 'WR', age: 24, rawValue:  7400, adjPct: 100, adjValue:  7400, window: '2025–2030' },
  { rank: 16, name: 'Brian Thomas Jr.',   pos: 'WR', age: 22, rawValue:  7300, adjPct: 100, adjValue:  7300, window: '2025–2032' },
  { rank: 17, name: 'Breece Hall',        pos: 'RB', age: 24, rawValue:  7200, adjPct: 100, adjValue:  7200, window: '2025–2029' },
  { rank: 18, name: 'Josh Allen',         pos: 'QB', age: 29, rawValue:  8800, adjPct:  60, adjValue:  5280, window: '2025–2027' },
  { rank: 19, name: 'Jayden Daniels',     pos: 'QB', age: 24, rawValue:  7000, adjPct: 100, adjValue:  7000, window: '2026–2033' },
  { rank: 20, name: 'Trey McBride',       pos: 'TE', age: 24, rawValue:  6900, adjPct: 100, adjValue:  6900, window: '2025–2031' },
  { rank: 21, name: 'Dalton Kincaid',     pos: 'TE', age: 25, rawValue:  6700, adjPct: 100, adjValue:  6700, window: '2025–2030' },
  { rank: 22, name: "De'Von Achane",      pos: 'RB', age: 23, rawValue:  6600, adjPct: 100, adjValue:  6600, window: '2025–2029' },
  { rank: 23, name: 'Bo Nix',             pos: 'QB', age: 25, rawValue:  6500, adjPct: 100, adjValue:  6500, window: '2026–2032' },
  { rank: 24, name: 'Jonathon Brooks',    pos: 'RB', age: 23, rawValue:  6400, adjPct: 100, adjValue:  6400, window: '2026–2030' },
  { rank: 25, name: 'Lamar Jackson',      pos: 'QB', age: 28, rawValue:  7800, adjPct:  85, adjValue:  6630, window: '2025–2028' },
  { rank: 26, name: 'Cam Ward',           pos: 'QB', age: 23, rawValue:  6200, adjPct: 100, adjValue:  6200, window: '2026–2033' },
  { rank: 27, name: 'Travis Hunter',      pos: 'WR', age: 21, rawValue:  6100, adjPct: 100, adjValue:  6100, window: '2026–2032' },
  { rank: 28, name: 'Stefon Diggs',       pos: 'WR', age: 32, rawValue:  4100, adjPct:  25, adjValue:  1025, window: '2026 only' },
  { rank: 29, name: 'Isiah Pacheco',      pos: 'RB', age: 25, rawValue:  5900, adjPct: 100, adjValue:  5900, window: '2025–2029' },
  { rank: 30, name: 'Keon Coleman',       pos: 'WR', age: 22, rawValue:  5800, adjPct: 100, adjValue:  5800, window: '2026–2032' },
  { rank: 31, name: 'Patrick Mahomes',    pos: 'QB', age: 30, rawValue:  7200, adjPct:  60, adjValue:  4320, window: '2025–2027' },
  { rank: 32, name: 'Chuba Hubbard',      pos: 'RB', age: 26, rawValue:  5600, adjPct:  85, adjValue:  4760, window: '2025–2027' },
  { rank: 33, name: 'Zay Flowers',        pos: 'WR', age: 24, rawValue:  5500, adjPct: 100, adjValue:  5500, window: '2025–2030' },
  { rank: 34, name: 'Dallas Goedert',     pos: 'TE', age: 30, rawValue:  5800, adjPct:  60, adjValue:  3480, window: '2025–2026' },
  { rank: 35, name: 'Jaxon Smith-Njigba', pos: 'WR', age: 22, rawValue:  5300, adjPct: 100, adjValue:  5300, window: '2026–2032' },
  { rank: 36, name: 'Saquon Barkley',     pos: 'RB', age: 28, rawValue:  5800, adjPct:  85, adjValue:  4930, window: '2025–2026' },
  { rank: 37, name: 'Ashton Jeanty',      pos: 'RB', age: 21, rawValue:  5100, adjPct: 100, adjValue:  5100, window: '2025–2030' },
  { rank: 38, name: 'George Pickens',     pos: 'WR', age: 23, rawValue:  5000, adjPct: 100, adjValue:  5000, window: '2025–2031' },
  { rank: 39, name: 'Davante Adams',      pos: 'WR', age: 33, rawValue:  4200, adjPct:  25, adjValue:   1050, window: 'Terminal' },
  { rank: 40, name: 'Travis Kelce',       pos: 'TE', age: 36, rawValue:  3200, adjPct:  25, adjValue:   800, window: 'Terminal' },
];

// Re-sort by age-adjusted value descending
const TOP_40_SORTED = [...TOP_40].sort((a, b) => b.adjValue - a.adjValue);

const ROSTER_SCORES: RosterAgeScore[] = [
  { manager: 'tubes94',        rawTotal: 98200, adjTotal: 95400, adjPct: 97.2, note: 'Youngest quality roster in the league — dynasty ceiling is sky high.',          phase: 'Young'   },
  { manager: 'tdtd19844',      rawTotal: 94100, adjTotal: 91200, adjPct: 96.9, note: 'Championship-winning core in their prime opening window.',                       phase: 'Young'   },
  { manager: 'juicybussy',     rawTotal: 91800, adjTotal: 88300, adjPct: 96.2, note: 'Young core with high upside — age adjustments barely dent raw value.',            phase: 'Young'   },
  { manager: 'mlschools12',    rawTotal: 96400, adjTotal: 89700, adjPct: 93.1, note: 'Defending champion in peak window — blending youth with proven contributors.',    phase: 'Prime'   },
  { manager: 'cmaleski',       rawTotal: 92300, adjTotal: 85100, adjPct: 92.2, note: 'Mixed roster with young WRs buffering older depth.',                              phase: 'Prime'   },
  { manager: 'sexmachineandy', rawTotal: 89700, adjTotal: 82400, adjPct: 91.9, note: 'Balanced roster — prime-age QB anchors solid age-adjusted score.',               phase: 'Prime'   },
  { manager: 'eldridm20',      rawTotal: 88200, adjTotal: 78900, adjPct: 89.5, note: 'Solid foundation but a few aging skill players drag down the adjusted number.',  phase: 'Prime'   },
  { manager: 'rbr',            rawTotal: 87400, adjTotal: 74900, adjPct: 85.7, note: 'Closing window — older QB and RB assets reduce 3-year outlook considerably.',    phase: 'Aging'   },
  { manager: 'eldridsm',       rawTotal: 85100, adjTotal: 71800, adjPct: 84.4, note: 'Talent is there on paper, but age adjustments expose a 2–3 year ceiling.',       phase: 'Aging'   },
  { manager: 'escuelas',       rawTotal: 78300, adjTotal: 64100, adjPct: 81.9, note: 'Young at some spots but low raw value limits adjusted score even at 100%.',      phase: 'Aging'   },
  { manager: 'grandes',        rawTotal: 76900, adjTotal: 60100, adjPct: 78.2, note: 'Aging core across all positions — rebuild is overdue.',                          phase: 'Veteran' },
  { manager: 'cogdeill11',     rawTotal: 74200, adjTotal: 54300, adjPct: 73.2, note: 'Most age-penalized roster in the league — terminal value in multiple slots.',    phase: 'Veteran' },
];

const PEAK_CURVES: PeakCurve[] = [
  {
    pos: 'QB', peak: '27–30', cliff: '34+',
    color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/20', bar: 'bg-blue-500',
    note: 'QBs age the most gracefully. They peak later and hold value longer than any skill position. A 30-year-old QB is still a dynasty cornerstone. Career longevity means QBs are the lowest-risk age investment.',
  },
  {
    pos: 'RB', peak: '23–26', cliff: '28+',
    color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', bar: 'bg-emerald-500',
    note: 'The most age-sensitive position in dynasty. The RB cliff arrives fast and hard — a 28-year-old RB is a liability unless your championship window is now. Age-adjusted value drops sharply for any RB over 27.',
  },
  {
    pos: 'WR', peak: '24–28', cliff: '31+',
    color: 'text-[#ffd700]', bg: 'bg-[#ffd700]/5', border: 'border-[#ffd700]/20', bar: 'bg-[#ffd700]',
    note: 'WRs have a wide prime window but dynasty market value starts declining before production does. Elite WRs can produce at 30–31, but 3-year outlook value dips significantly. Sell at 27, re-evaluate at 28.',
  },
  {
    pos: 'TE', peak: '26–30', cliff: '33+',
    color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/20', bar: 'bg-purple-500',
    note: 'TEs age the best of any skill position. Late development and long careers mean a 29-year-old TE can still have 4+ elite seasons ahead. Travis Kelce at 36 is the exception but TEs regularly produce through 32.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const POS_COLORS: Record<Pos, string> = {
  QB: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  RB: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  WR: 'text-[#ffd700] bg-[#ffd700]/15 border-[#ffd700]/30',
  TE: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
};

function adjPctColor(pct: number): string {
  if (pct === 100)  return 'text-emerald-400';
  if (pct >= 85)    return 'text-yellow-400';
  if (pct >= 60)    return 'text-orange-400';
  return 'text-red-400';
}

function phaseStyle(phase: RosterAgeScore['phase']): { badge: string; text: string } {
  switch (phase) {
    case 'Young':   return { badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', text: 'text-emerald-400' };
    case 'Prime':   return { badge: 'bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30',       text: 'text-[#ffd700]'   };
    case 'Aging':   return { badge: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',    text: 'text-orange-400'  };
    case 'Veteran': return { badge: 'bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30',       text: 'text-[#e94560]'   };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgeAdjustedPage() {
  const sortedRosters = [...ROSTER_SCORES].sort((a, b) => b.adjPct - a.adjPct);

  return (
    <>
      <Head>
        <title>Age-Adjusted Dynasty Rankings | BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL Age-Adjusted Dynasty Rankings — player values penalized for age trajectory. See actual vs 3-year adjusted dynasty value across positions and rosters."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">
            Age-Adjusted Dynasty Rankings
          </h1>
          <p className="text-slate-400 text-sm mb-1">
            3-Year Outlook &mdash; player values adjusted for age trajectory
          </p>
          <p className="text-slate-500 text-xs">March 2026 &middot; 40 Players &middot; All 12 Rosters</p>

          {/* Bimfle */}
          <div className="mt-5 inline-block bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg px-4 py-3 max-w-2xl">
            <p className="text-sm text-[#ffd700] italic leading-relaxed">
              &ldquo;Raw dynasty values lie. A 32-year-old WR listed at 4,200 is not worth 4,200 to a dynasty manager
              with a 3-year horizon. I have adjusted every player for the cold arithmetic of age.
              The rankings that follow are what dynasty assets are actually worth to your future.&rdquo;
            </p>
            <p className="text-xs text-[#ffd700]/60 mt-1">~Love, Bimfle</p>
          </div>
        </div>
      </section>

      {/* ── Age Adjustment Model ── */}
      <section className="bg-[#16213e] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Age Adjustment Model
            </h2>
          </div>
          <p className="text-sm text-slate-400 mb-5 max-w-2xl">
            Each player&rsquo;s raw dynasty value is multiplied by an age-based coefficient reflecting
            how much of their productive output is expected over the next 3 years.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { range: '22–25', pct: '100%', label: 'Full Value',          color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
              { range: '26–28', pct: '85%',  label: 'Slight Decline',      color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30'  },
              { range: '29–31', pct: '60%',  label: 'Significant Decline', color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/30'  },
              { range: '32+',   pct: '25%',  label: 'Terminal Value',      color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30'     },
            ].map((tier) => (
              <div key={tier.range} className={cn('rounded-xl border p-4 text-center', tier.bg, tier.border)}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ages {tier.range}</p>
                <p className={cn('text-3xl font-black tabular-nums', tier.color)}>{tier.pct}</p>
                <p className="text-xs text-slate-400 mt-1">{tier.label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Age coefficients apply to all positions. Position-specific aging notes are shown in the Position Age Curves section below.
          </p>
        </div>
      </section>

      {/* ── Top 40 Age-Adjusted Rankings ── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Top 40 Age-Adjusted Rankings
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Sorted by age-adjusted value. Raw rank in parentheses shows where the player would rank on raw value alone.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Top 40 age-adjusted dynasty player rankings">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-8">Rank</th>
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Player</th>
                  <th className="text-center py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Pos</th>
                  <th className="text-center py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Age</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Raw Value</th>
                  <th className="text-center py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Adj%</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Adj Value</th>
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Dynasty Window</th>
                </tr>
              </thead>
              <tbody>
                {TOP_40_SORTED.map((p, idx) => {
                  const rawRank = TOP_40.find((r) => r.name === p.name)?.rank ?? idx + 1;
                  const rankDiff = rawRank - (idx + 1);
                  return (
                    <tr
                      key={p.name}
                      className={cn(
                        'border-b border-[#2d4a66]/50 transition-colors',
                        idx < 3
                          ? 'bg-[#ffd700]/5'
                          : idx % 2 === 0 ? 'bg-[#16213e]/40' : ''
                      )}
                    >
                      <td className="py-3 px-3 text-slate-400 font-mono text-xs tabular-nums">
                        {idx + 1}
                        {rankDiff !== 0 && (
                          <span className={cn('ml-1 text-[10px]', rankDiff > 0 ? 'text-emerald-400' : 'text-red-400')}>
                            {rankDiff > 0 ? `+${rankDiff}` : rankDiff}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">{p.name}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(
                          'inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold border',
                          POS_COLORS[p.pos]
                        )}>
                          {p.pos}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300 text-xs tabular-nums">{p.age}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400 text-xs tabular-nums">
                        {p.rawValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn('font-black text-xs tabular-nums', adjPctColor(p.adjPct))}>
                          {p.adjPct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white text-sm tabular-nums">
                        {p.adjValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-xs hidden sm:table-cell">
                        {p.window}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-600 mt-3">
            Rank delta (green/red) shows movement vs raw value ranking. Positive = age adjustment boosted ranking. Negative = age penalized ranking.
          </p>
        </div>
      </section>

      {/* ── BMFFFL Roster Age Analysis ── */}
      <section className="bg-[#16213e] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              BMFFFL Roster Age Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Each manager&rsquo;s roster scored by age-adjusted dynasty value vs raw value &mdash; sorted by adjusted efficiency.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="BMFFFL roster age-adjusted dynasty scores">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-8">#</th>
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Manager</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Raw Total</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Adj Total</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Adj Score</th>
                  <th className="text-center py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Phase</th>
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {sortedRosters.map((r, idx) => {
                  const ps = phaseStyle(r.phase);
                  return (
                    <tr
                      key={r.manager}
                      className={cn(
                        'border-b border-[#2d4a66]/50 transition-colors',
                        idx === 0
                          ? 'bg-emerald-500/5'
                          : idx % 2 === 0 ? 'bg-[#0d1b2a]/40' : ''
                      )}
                    >
                      <td className="py-3 px-3 text-slate-500 font-mono text-xs">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-white">{r.manager}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400 text-xs tabular-nums">
                        {r.rawTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white text-sm tabular-nums">
                        {r.adjTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-[#2d4a66] overflow-hidden hidden sm:block">
                            <div
                              className={cn('h-full rounded-full',
                                r.adjPct >= 95 ? 'bg-emerald-500' :
                                r.adjPct >= 90 ? 'bg-yellow-400' :
                                r.adjPct >= 82 ? 'bg-orange-400' : 'bg-red-500'
                              )}
                              style={{ width: `${((r.adjPct - 70) / 30) * 100}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className={cn(
                            'font-black text-sm tabular-nums',
                            r.adjPct >= 95 ? 'text-emerald-400' :
                            r.adjPct >= 90 ? 'text-yellow-400' :
                            r.adjPct >= 82 ? 'text-orange-400' : 'text-red-400'
                          )}>
                            {r.adjPct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-bold', ps.badge)}>
                          {r.phase}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-xs leading-relaxed hidden lg:table-cell">
                        {r.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Position Age Curves ── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Position Age Curves
            </h2>
          </div>
          <p className="text-sm text-slate-400 mb-6 max-w-2xl">
            Typical peak age window and decline cliff by position. Understanding these curves is the foundation of age-adjusted dynasty valuation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PEAK_CURVES.map((curve) => (
              <div key={curve.pos} className={cn('rounded-xl border p-5', curve.bg, curve.border)}>
                <div className="flex items-center justify-between mb-3">
                  <span className={cn('text-2xl font-black', curve.color)}>{curve.pos}</span>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Peak</p>
                      <p className={cn('text-sm font-black', curve.color)}>{curve.peak}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Cliff</p>
                      <p className="text-sm font-black text-red-400">{curve.cliff}</p>
                    </div>
                  </div>
                </div>

                {/* Visual age bar */}
                <div className="relative mb-3" aria-hidden="true">
                  <div className="h-2 bg-[#2d4a66] rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full opacity-70', curve.bar)}
                      style={{
                        marginLeft: `${((parseInt(curve.peak.split('–')[0]) - 20) / 20) * 100}%`,
                        width: `${((parseInt(curve.peak.split('–')[1]) - parseInt(curve.peak.split('–')[0])) / 20) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-600">Age 20</span>
                    <span className="text-[10px] text-slate-600">Age 40</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{curve.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Takeaways ── */}
      <section className="bg-[#16213e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Key Takeaways
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0d1b2a] border border-emerald-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Biggest Riser</p>
              </div>
              <p className="text-lg font-black text-white mb-1">Tetairoa McMillan</p>
              <p className="text-sm text-emerald-400 font-bold mb-2">Raw #28 &rarr; Adj #1</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Age 21 with a 7-year dynasty window means 100% age-adjusted value. The age model rockets young talent to the top of true dynasty rankings.
              </p>
            </div>

            <div className="bg-[#0d1b2a] border border-red-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">Biggest Faller</p>
              </div>
              <p className="text-lg font-black text-white mb-1">Davante Adams</p>
              <p className="text-sm text-red-400 font-bold mb-2">Raw value 4,200 &rarr; Adj value 1,050</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                At 33, the 25% age coefficient is devastating. Age-adjusted dynasty value is barely a quarter of his listed market price — a massive overpay risk.
              </p>
            </div>

            <div className="bg-[#0d1b2a] border border-[#ffd700]/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]">Dynasty Insight</p>
              </div>
              <p className="text-lg font-black text-white mb-1">tubes94 leads</p>
              <p className="text-sm text-[#ffd700] font-bold mb-2">97.2% adj efficiency</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                The youngest quality roster in the BMFFFL. Age adjustments barely dent their raw total — a sign their dynasty ceiling is among the highest in league history.
              </p>
            </div>
          </div>

          {/* Bimfle note */}
          <div className="mt-6 rounded-xl border border-[#2d4a66] bg-[#0d1b2a] px-6 py-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">
              A Note from Your Commissioner
            </p>
            <blockquote className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-[#ffd700] pl-4">
              &ldquo;The manager who buys a 33-year-old WR at full market price has not bought talent &mdash;
              they have bought memories. Dynasty value is not what a player has done. It is what a player
              will do over the next 3 years. Age is the tax on complacency. Pay it knowingly, or not at all.&rdquo;
            </blockquote>
            <p className="text-xs text-[#ffd700] font-bold mt-3 pl-4">~Love, Bimfle</p>
          </div>
        </div>
      </section>
    </>
  );
}
