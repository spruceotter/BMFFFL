import Head from 'next/head';
import { Trophy, Target, AlertTriangle, MessageSquare, BarChart2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeedPrediction {
  seed:            number;
  manager:         string;
  playoffOdds:     number;
  champOdds:       number | null;
  chaosFlag?:      boolean;
}

interface BubbleTeam {
  manager:     string;
  playoffOdds: number;
  tier:        'bubble' | 'unlikely';
}

interface ManagerComment {
  manager: string;
  quote:   string;
  seed:    number;
}

interface AccuracyRecord {
  year:    number;
  correct: number;
  total:   number;
  note?:   string;
}

interface UpsetAlert {
  manager:     string;
  currentSeed: number;
  upsetPotential: string;
  reason:      string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PREDICTED_SEEDS: SeedPrediction[] = [
  { seed: 1, manager: 'mlschools12',   playoffOdds: 88, champOdds: 34 },
  { seed: 2, manager: 'tubes94',       playoffOdds: 81, champOdds: 23 },
  { seed: 3, manager: 'rbr',           playoffOdds: 75, champOdds: 18 },
  { seed: 4, manager: 'tdtd19844',     playoffOdds: 68, champOdds: 12 },
  { seed: 5, manager: 'sexmachineandy',playoffOdds: 61, champOdds: 8 },
  { seed: 6, manager: 'juicybussy',    playoffOdds: 55, champOdds: null, chaosFlag: true },
];

const BUBBLE_TEAMS: BubbleTeam[] = [
  { manager: 'eldridsm',   playoffOdds: 47, tier: 'bubble' },
  { manager: 'cmaleski',   playoffOdds: 44, tier: 'bubble' },
  { manager: 'eldridm20',  playoffOdds: 41, tier: 'bubble' },
  { manager: 'grandes',    playoffOdds: 32, tier: 'unlikely' },
  { manager: 'cogdeill11', playoffOdds: 22, tier: 'unlikely' },
  { manager: 'escuelas',   playoffOdds: 12, tier: 'unlikely' },
];

const MANAGER_COMMENTS: ManagerComment[] = [
  { manager: 'mlschools12',    seed: 1, quote: 'Three-peat incoming. Bimfle knows.' },
  { manager: 'tubes94',        seed: 2, quote: 'This is my year. I have receipts from 2025.' },
  { manager: 'rbr',            seed: 3, quote: "The bracket doesn't scare me. The lineup does." },
  { manager: 'juicybussy',     seed: 6, quote: 'CHAOS. COMPLETE. CHAOS.' },
  { manager: 'escuelas',       seed: -1, quote: 'Year 5. This is the year. I feel it.' },
];

const ACCURACY_RECORDS: AccuracyRecord[] = [
  { year: 2022, correct: 4, total: 6 },
  { year: 2023, correct: 5, total: 6 },
  { year: 2024, correct: 4, total: 6 },
  {
    year: 2025, correct: 5, total: 6,
    note: 'Missed escuelas making playoffs (they didn\'t) and juicybussy missing (made it as 6th seed)',
  },
];

const UPSET_ALERTS: UpsetAlert[] = [
  {
    manager: 'eldridsm',
    currentSeed: -1,
    upsetPotential: 'Surprise Playoff Qualifier',
    reason: 'Deep roster with undervalued veterans. Consistently outperforms projections in the back half of the season.',
  },
  {
    manager: 'cmaleski',
    currentSeed: -1,
    upsetPotential: 'Bracket Buster',
    reason: 'High-variance lineup with boom-or-bust weapons. Dangerous in a single-week playoff format.',
  },
  {
    manager: 'rbr',
    currentSeed: 3,
    upsetPotential: 'Dark Horse Champion',
    reason: 'Projected 3rd seed but carries elite upside. Has outperformed seeding in two of three prior playoff runs.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEED_COLORS: Record<number, string> = {
  1: 'text-[#ffd700]',
  2: 'text-rose-400',
  3: 'text-emerald-400',
  4: 'text-blue-400',
  5: 'text-amber-400',
  6: 'text-indigo-400',
};

const SEED_BG: Record<number, string> = {
  1: 'bg-[#ffd700]/10 border-[#ffd700]/40',
  2: 'bg-rose-400/10 border-rose-400/40',
  3: 'bg-emerald-400/10 border-emerald-400/40',
  4: 'bg-blue-400/10 border-blue-400/40',
  5: 'bg-amber-400/10 border-amber-400/40',
  6: 'bg-indigo-400/10 border-indigo-400/40',
};

function OddsBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full bg-[#2d4a66] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PredictedBracket() {
  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Predicted Playoff Bracket</h2>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          Seeds 1 and 2 receive first-round byes. Most likely projected matchup path shown below.
        </p>

        {/* Bracket visual — CSS only */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px] flex gap-4 items-stretch">

            {/* Round 1 */}
            <div className="flex flex-col gap-6 flex-none w-44">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-2">Round 1</div>

              {/* Matchup A: 3 vs 6 */}
              <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] overflow-hidden">
                <div className="px-3 py-2.5 border-b border-[#2d4a66] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-black', SEED_COLORS[3])}>3</span>
                    <span className="text-white text-sm font-semibold">rbr</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">Fav</span>
                </div>
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <span className={cn('text-xs font-black', SEED_COLORS[6])}>6</span>
                  <span className="text-slate-300 text-sm">juicybussy</span>
                </div>
              </div>

              {/* Matchup B: 4 vs 5 */}
              <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] overflow-hidden">
                <div className="px-3 py-2.5 border-b border-[#2d4a66] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-black', SEED_COLORS[4])}>4</span>
                    <span className="text-white text-sm font-semibold">tdtd19844</span>
                  </div>
                  <span className="text-xs text-blue-400 font-bold">Fav</span>
                </div>
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <span className={cn('text-xs font-black', SEED_COLORS[5])}>5</span>
                  <span className="text-slate-300 text-sm">sexmachineandy</span>
                </div>
              </div>
            </div>

            {/* Connector arrows */}
            <div className="flex flex-col justify-center items-center flex-none w-6 gap-6 pt-8">
              <div className="h-16 flex flex-col justify-center gap-1">
                <div className="w-full h-px bg-[#2d4a66]" />
                <div className="w-full h-px bg-[#2d4a66] mt-8" />
              </div>
              <div className="text-[#2d4a66] text-lg leading-none">→</div>
              <div className="h-16 flex flex-col justify-center gap-1">
                <div className="w-full h-px bg-[#2d4a66]" />
                <div className="w-full h-px bg-[#2d4a66] mt-8" />
              </div>
            </div>

            {/* Semifinals */}
            <div className="flex flex-col gap-4 flex-none w-48">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-2">Semifinals</div>

              {/* SF1: 1-seed bye vs R1A winner */}
              <div className="rounded-lg border border-[#ffd700]/40 bg-[#ffd700]/5 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-[#ffd700]/20 flex items-center gap-2">
                  <span className={cn('text-xs font-black', SEED_COLORS[1])}>1</span>
                  <span className="text-white text-sm font-semibold">mlschools12</span>
                  <span className="ml-auto text-xs text-[#ffd700]">BYE</span>
                </div>
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-400">3</span>
                  <span className="text-slate-400 text-sm italic">rbr (proj.)</span>
                </div>
              </div>

              <div className="h-4" />

              {/* SF2: 2-seed bye vs R1B winner */}
              <div className="rounded-lg border border-rose-400/40 bg-rose-400/5 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-rose-400/20 flex items-center gap-2">
                  <span className={cn('text-xs font-black', SEED_COLORS[2])}>2</span>
                  <span className="text-white text-sm font-semibold">tubes94</span>
                  <span className="ml-auto text-xs text-rose-400">BYE</span>
                </div>
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <span className="text-xs font-black text-blue-400">4</span>
                  <span className="text-slate-400 text-sm italic">tdtd19844 (proj.)</span>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex flex-col justify-center items-center flex-none w-6 pt-8">
              <div className="text-[#2d4a66] text-lg">→</div>
            </div>

            {/* Championship */}
            <div className="flex flex-col justify-center flex-none w-52">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3">Championship</div>
              <div className="rounded-xl border-2 border-[#ffd700]/60 bg-gradient-to-b from-[#ffd700]/10 to-[#ffd700]/5 overflow-hidden shadow-lg shadow-[#ffd700]/10">
                <div className="px-4 py-3 border-b border-[#ffd700]/20 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">Most Likely Final</span>
                </div>
                <div className="px-4 py-3 border-b border-[#ffd700]/10 flex items-center gap-2">
                  <span className={cn('text-sm font-black', SEED_COLORS[1])}>1</span>
                  <span className="text-white font-bold">mlschools12</span>
                </div>
                <div className="px-4 py-3 flex items-center gap-2">
                  <span className={cn('text-sm font-black', SEED_COLORS[2])}>2</span>
                  <span className="text-white font-bold">tubes94</span>
                </div>
                <div className="px-4 py-2 bg-[#ffd700]/5">
                  <p className="text-[10px] text-[#ffd700]/70 text-center uppercase tracking-wider">
                    Bimfle&apos;s Projected Final
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BracketPredictorPage() {
  const careerTotal   = ACCURACY_RECORDS.reduce((s, r) => s + r.correct, 0);
  const careerPossible = ACCURACY_RECORDS.reduce((s, r) => s + r.total, 0);
  const careerPct     = Math.round((careerTotal / careerPossible) * 100);

  return (
    <>
      <Head>
        <title>Playoff Bracket Predictor | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Bimfle's 2026 pre-season playoff predictions — projected seeds, bracket path, upset alerts, and historical accuracy."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
            2026 Playoff Predictions
          </h1>
          <p className="text-lg text-[#ffd700] font-semibold mb-4">
            Bimfle&apos;s Pre-Season Forecast
          </p>
          <div className="flex items-start gap-2 bg-[#16213e] border border-[#2d4a66] rounded-lg px-4 py-3 max-w-2xl">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-slate-400">
              Season 7 starts September 2026. These are projections based on roster quality and historical patterns.
              Predictions will be locked once the season begins.
            </p>
          </div>
        </div>
      </section>

      {/* ── Predicted Playoff Seeds ────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Predicted Playoff Seeds</h2>
          </div>
          <p className="text-slate-400 text-sm mb-8">
            Top 6 projected finishers for the 6-team playoff. Odds reflect Bimfle&apos;s pre-season confidence.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
            {PREDICTED_SEEDS.map((p) => {
              const colorClass = SEED_COLORS[p.seed] ?? 'text-slate-400';
              const bgClass    = SEED_BG[p.seed]    ?? 'bg-[#16213e] border-[#2d4a66]';
              const colorHex   = ['#ffd700','#f87171','#34d399','#60a5fa','#fbbf24','#818cf8'][p.seed - 1];
              return (
                <div key={p.manager} className={cn('rounded-xl border p-5 bg-[#16213e]', bgClass)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('text-3xl font-black leading-none w-8', colorClass)}>
                        {p.seed}
                      </div>
                      <div>
                        <div className="font-black text-white text-base leading-tight">{p.manager}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Projected {p.seed === 1 ? '1st' : p.seed === 2 ? '2nd' : `${p.seed}th`} seed</div>
                      </div>
                    </div>
                    {p.chaosFlag && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-400/20 text-indigo-400 border border-indigo-400/30">
                        Chaos Factor
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Playoff Odds</span>
                        <span className={cn('font-bold', colorClass)}>{p.playoffOdds}%</span>
                      </div>
                      <OddsBar value={p.playoffOdds} color={colorHex} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Championship Odds</span>
                        <span className="font-bold text-white">
                          {p.champOdds !== null ? `${p.champOdds}%` : 'Chaos'}
                        </span>
                      </div>
                      <OddsBar value={p.champOdds ?? 0} color="#818cf8" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bubble + Unlikely */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(['bubble', 'unlikely'] as const).map((tier) => {
              const teams = BUBBLE_TEAMS.filter((t) => t.tier === tier);
              return (
                <div key={tier} className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5">
                  <h3 className={cn('text-sm font-black uppercase tracking-wider mb-4', tier === 'bubble' ? 'text-amber-400' : 'text-slate-500')}>
                    {tier === 'bubble' ? 'Bubble Teams' : 'Long Shots'}
                  </h3>
                  <div className="space-y-3">
                    {teams.map((t) => (
                      <div key={t.manager}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">{t.manager}</span>
                          <span className={cn('font-bold', tier === 'bubble' ? 'text-amber-400' : 'text-slate-500')}>
                            {t.playoffOdds}%
                          </span>
                        </div>
                        <OddsBar value={t.playoffOdds} color={tier === 'bubble' ? '#fbbf24' : '#4b5563'} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Predicted Bracket ─────────────────────────────────────────────── */}
      <PredictedBracket />

      {/* ── Manager Comments ──────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Manager Reactions</h2>
          </div>
          <p className="text-slate-400 text-sm mb-8">
            What the managers had to say about Bimfle&apos;s predictions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MANAGER_COMMENTS.map((c) => {
              const seedColor = c.seed > 0 ? (SEED_COLORS[c.seed] ?? 'text-slate-400') : 'text-slate-400';
              const seedBg    = c.seed > 0 ? (SEED_BG[c.seed]    ?? 'bg-[#16213e] border-[#2d4a66]') : 'bg-[#16213e] border-[#2d4a66]';
              return (
                <div key={c.manager} className={cn('rounded-xl border p-5 bg-[#16213e] flex flex-col gap-3', seedBg)}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <span className="font-black text-white text-sm">{c.manager}</span>
                    {c.seed > 0 && (
                      <span className={cn('ml-auto text-xs font-bold', seedColor)}>
                        Seed {c.seed}
                      </span>
                    )}
                    {c.seed === -1 && (
                      <span className="ml-auto text-xs font-bold text-slate-500">Bubble</span>
                    )}
                  </div>
                  <blockquote className="text-slate-300 text-sm italic leading-relaxed border-l-2 border-[#2d4a66] pl-3">
                    &ldquo;{c.quote}&rdquo;
                  </blockquote>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Historical Prediction Accuracy ────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Bimfle&apos;s Track Record</h2>
          </div>
          <p className="text-slate-400 text-sm mb-8">
            Historical accuracy of Bimfle&apos;s pre-season playoff predictions.
          </p>

          {/* Career stat */}
          <div className="flex gap-4 mb-8">
            <div className="bg-[#16213e] border border-[#ffd700]/30 rounded-xl px-6 py-4 text-center">
              <div className="text-4xl font-black text-[#ffd700]">{careerPct}%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Career Accuracy</div>
            </div>
            <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl px-6 py-4 text-center">
              <div className="text-4xl font-black text-white">{careerTotal}/{careerPossible}</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Teams Correctly Called</div>
            </div>
          </div>

          <div className="space-y-3">
            {ACCURACY_RECORDS.map((r) => {
              const pct = Math.round((r.correct / r.total) * 100);
              const isGood = pct >= 80;
              return (
                <div key={r.year} className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-black text-white w-16 shrink-0">{r.year}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-300">
                          {r.correct}/{r.total} playoff teams correctly predicted
                        </span>
                        <span className={cn('font-black text-base', isGood ? 'text-emerald-400' : 'text-amber-400')}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#2d4a66] rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', isGood ? 'bg-emerald-400' : 'bg-amber-400')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {r.note && (
                        <p className="text-xs text-slate-500 mt-2 italic">{r.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Upset Alerts ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Upset Alerts</h2>
          </div>
          <p className="text-slate-400 text-sm mb-8">
            Three teams most likely to outperform Bimfle&apos;s expectations in 2026.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPSET_ALERTS.map((u, i) => (
              <div key={u.manager} className="bg-[#16213e] rounded-xl border border-[#e94560]/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#e94560] font-black text-2xl leading-none">#{i + 1}</span>
                  <div>
                    <div className="font-black text-white text-sm">{u.manager}</div>
                    <div className="text-xs text-[#e94560] font-semibold">{u.upsetPotential}</div>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{u.reason}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-600 mt-8 text-center">
            All predictions are pre-season projections by Bimfle. Updated once per year before Week 1.
          </p>
        </div>
      </section>
    </>
  );
}
