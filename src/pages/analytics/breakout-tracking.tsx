import Head from 'next/head';
import { Target, TrendingUp, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Grade = 'HIT' | 'MISS' | 'PARTIAL';
type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface BreakoutPrediction {
  player: string;
  pos: Position;
  team: string;
  prediction: string;
  actual: string;
  grade: Grade;
  stats?: string;
}

interface FuturePickem {
  player: string;
  pos: Position;
  team: string;
  prediction: string;
  confidence: number;
}

interface YearlyAccuracy {
  year: number;
  hits: number;
  partials: number;
  misses: number;
  total: number;
  pct: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PREDICTIONS_2025: BreakoutPrediction[] = [
  {
    player:     'Brock Bowers',
    pos:        'TE',
    team:       'LV',
    prediction: 'TE1 — historic sophomore leap for the Raiders\' top weapon',
    actual:     'TE1 all season. 94 rec, 1,194 yds. Dominant from Week 1.',
    grade:      'HIT',
    stats:      '94 rec / 1,194 yds',
  },
  {
    player:     'Rashee Rice',
    pos:        'WR',
    team:       'KC',
    prediction: 'WR1/2 with Mahomes — top-5 receiver season',
    actual:     'Missed significant time with injury. Never found full rhythm.',
    grade:      'MISS',
  },
  {
    player:     'Jaylen Wright',
    pos:        'RB',
    team:       'MIA',
    prediction: 'RB2 starter in Miami — 250+ carries in a run-heavy system',
    actual:     'Shared backfield all season. Never secured true starter role.',
    grade:      'PARTIAL',
  },
  {
    player:     'Puka Nacua',
    pos:        'WR',
    team:       'LAR',
    prediction: 'Sophomore leap — 1,200+ yards and WR2 ranking',
    actual:     'Slight regression from rookie season. WR3 output.',
    grade:      'MISS',
  },
  {
    player:     'Rome Odunze',
    pos:        'WR',
    team:       'CHI',
    prediction: 'WR2 breakout with Caleb Williams — genuine fantasy starter',
    actual:     'Solid WR3 production but never reached WR2 ceiling.',
    grade:      'PARTIAL',
  },
  {
    player:     'Malik Nabers',
    pos:        'WR',
    team:       'NYG',
    prediction: 'WR1 by midseason — elite target share as top Giants weapon',
    actual:     'WR1-level all season. 89 rec, 1,204 yds. Couldn\'t be stopped.',
    grade:      'HIT',
    stats:      '89 rec / 1,204 yds',
  },
  {
    player:     'Bo Nix',
    pos:        'QB',
    team:       'DEN',
    prediction: '4,200+ passing yards and top-12 QB fantasy value',
    actual:     '3,915 yards. Top-15 QB. Close, but under the threshold.',
    grade:      'PARTIAL',
    stats:      '3,915 yds',
  },
  {
    player:     'Sam LaPorta',
    pos:        'TE',
    team:       'DET',
    prediction: 'Top-3 TE — elite target share in Detroit\'s passing game',
    actual:     'TE2-level output all season. Lions leaned on him heavily.',
    grade:      'HIT',
  },
  {
    player:     'Jaylen Waddle',
    pos:        'WR',
    team:       'MIA',
    prediction: 'Bounce-back season — 1,000+ yards after injury-hampered 2024',
    actual:     'Cleared 1,000 yards. Healthy full season. Bounce-back achieved.',
    grade:      'HIT',
    stats:      '1,000+ yds',
  },
  {
    player:     'Jaylen McPherson',
    pos:        'WR',
    team:       'CIN',
    prediction: 'Slot WR breakout — 80+ targets in Burrow\'s quick-pass system',
    actual:     'Minimal role. Never cracked the rotation meaningfully.',
    grade:      'MISS',
  },
];

const PICKS_2026: FuturePickem[] = [
  {
    player:     'Brian Thomas Jr.',
    pos:        'WR',
    team:       'JAX',
    prediction: 'Year 2 leap — WR1 for Jacksonville. 1,200+ yards with full offseason.',
    confidence: 88,
  },
  {
    player:     'Jonathon Brooks',
    pos:        'RB',
    team:       'CAR',
    prediction: 'Full ACL recovery. Carolina\'s lead back — 250+ touches.',
    confidence: 76,
  },
  {
    player:     'Adonai Mitchell',
    pos:        'WR',
    team:       'IND',
    prediction: 'Colts WR1 — massive target share as Richardson\'s top weapon.',
    confidence: 82,
  },
  {
    player:     'Bucky Irving',
    pos:        'RB',
    team:       'TB',
    prediction: 'Rachaad White fades out. Bucky Irving seizes the lead role.',
    confidence: 79,
  },
  {
    player:     'Trey McBride',
    pos:        'TE',
    team:       'ARI',
    prediction: 'Elite TE1 — Arizona fully commits to McBride as Harrison Jr.\'s safety valve.',
    confidence: 85,
  },
];

const HISTORICAL: YearlyAccuracy[] = [
  { year: 2021, hits: 3, partials: 2, misses: 5, total: 10, pct: 30 },
  { year: 2022, hits: 5, partials: 2, misses: 3, total: 10, pct: 50 },
  { year: 2023, hits: 4, partials: 3, misses: 3, total: 10, pct: 40 },
  { year: 2024, hits: 6, partials: 2, misses: 2, total: 10, pct: 60 },
  { year: 2025, hits: 4, partials: 3, misses: 3, total: 10, pct: 40 },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const GRADE_CONFIG: Record<Grade, { label: string; icon: typeof CheckCircle; color: string; bg: string; border: string }> = {
  HIT: {
    label:  'HIT',
    icon:   CheckCircle,
    color:  '#4ade80',
    bg:     'bg-emerald-500/10',
    border: 'border-emerald-500/40',
  },
  MISS: {
    label:  'MISS',
    icon:   XCircle,
    color:  '#e94560',
    bg:     'bg-red-500/10',
    border: 'border-red-500/40',
  },
  PARTIAL: {
    label:  'PARTIAL',
    icon:   AlertCircle,
    color:  '#fbbf24',
    bg:     'bg-amber-500/10',
    border: 'border-amber-500/40',
  },
};

const POS_CONFIG: Record<Position, string> = {
  QB: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  WR: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  TE: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9 shrink-0',
        POS_CONFIG[pos]
      )}
    >
      {pos}
    </span>
  );
}

function GradeBadge({ grade }: { grade: Grade }) {
  const cfg = GRADE_CONFIG[grade];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wide border shrink-0',
        cfg.bg,
        cfg.border
      )}
      style={{ color: cfg.color }}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function PredictionRow({ p, idx }: { p: BreakoutPrediction; idx: number }) {
  const cfg = GRADE_CONFIG[p.grade];
  return (
    <div
      className={cn(
        'rounded-xl border bg-[#16213e] p-4 sm:p-5 transition-colors duration-150',
        p.grade === 'HIT'     ? 'border-emerald-500/20 hover:border-emerald-500/40' :
        p.grade === 'MISS'    ? 'border-red-500/20 hover:border-red-500/40' :
                                'border-amber-500/20 hover:border-amber-500/40'
      )}
      style={{ borderLeft: `3px solid ${cfg.color}` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-600 w-5">#{idx + 1}</span>
          <span className="text-base font-black text-white">{p.player}</span>
          <PosBadge pos={p.pos} />
          <span className="text-xs font-mono text-slate-500">{p.team}</span>
        </div>
        <GradeBadge grade={p.grade} />
      </div>

      {/* Prediction vs Actual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
            Pre-Season Prediction
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">&ldquo;{p.prediction}&rdquo;</p>
        </div>
        <div>
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: `${cfg.color}99` }}
          >
            Actual Result
          </div>
          <p className="text-xs leading-relaxed" style={{ color: cfg.color }}>
            {p.actual}
          </p>
          {p.stats && (
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black tracking-wide"
              style={{ backgroundColor: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
            >
              {p.stats}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums text-slate-400 w-10 text-right shrink-0">
        {value}%
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BreakoutTrackingPage() {
  const hits     = PREDICTIONS_2025.filter((p) => p.grade === 'HIT').length;
  const partials = PREDICTIONS_2025.filter((p) => p.grade === 'PARTIAL').length;
  const misses   = PREDICTIONS_2025.filter((p) => p.grade === 'MISS').length;
  const total    = PREDICTIONS_2025.length;

  const maxHistPct = Math.max(...HISTORICAL.map((h) => h.pct));

  return (
    <>
      <Head>
        <title>Breakout Tracking 2025 | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Bimfle tracks every pre-season breakout prediction against actual 2025 results. Hits, misses, partials — full accountability report."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Breakout Tracking 2025 — The Receipts
          </h1>
          <div className="max-w-2xl bg-[#16213e] border border-[#ffd700]/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#ffd700] text-lg leading-none">~</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Bimfle</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "I made 10 breakout predictions before 2025. Here is my accountability report. I do not hide
              from the record. Every call — hits, partials, and outright disasters — is documented below
              for the league's scrutiny."
            </p>
            <div className="mt-2 text-right text-xs text-[#ffd700] font-black tracking-wide">~Love, Bimfle.</div>
          </div>
        </div>
      </section>

      {/* ── Summary scorecard strip ──────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label:  'Predictions',
                value:  String(total),
                sub:    'Total calls made',
                accent: '#60a5fa',
              },
              {
                label:  'Hits',
                value:  `${hits}/${total}`,
                sub:    `${Math.round((hits / total) * 100)}% accuracy`,
                accent: '#4ade80',
              },
              {
                label:  'Partials',
                value:  `${partials}/${total}`,
                sub:    `${Math.round((partials / total) * 100)}% close calls`,
                accent: '#fbbf24',
              },
              {
                label:  'Misses',
                value:  `${misses}/${total}`,
                sub:    `${Math.round((misses / total) * 100)}% whiffs`,
                accent: '#e94560',
              },
            ].map(({ label, value, sub, accent }) => (
              <div
                key={label}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4 text-center"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</div>
                <div className="text-2xl font-black tabular-nums" style={{ color: accent }}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Breakout scorecard ───────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">2025 Prediction Scorecard</h2>
          <p className="text-slate-400 text-sm mb-6">
            All 10 pre-season breakout calls graded against real 2025 outcomes.
          </p>
          <div className="flex flex-col gap-3">
            {PREDICTIONS_2025.map((p, idx) => (
              <PredictionRow key={p.player} p={p} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Prediction accuracy summary ──────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#60a5fa]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Prediction Accuracy — 2025</h2>
          </div>

          {/* Grade bar breakdown */}
          <div className="max-w-xl mb-8">
            {[
              { label: 'Hits',     count: hits,     total, color: '#4ade80' },
              { label: 'Partials', count: partials,  total, color: '#fbbf24' },
              { label: 'Misses',   count: misses,    total, color: '#e94560' },
            ].map(({ label, count, color }) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={label} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
                    <span className="text-xs font-black tabular-nums" style={{ color }}>
                      {count}/{total} &nbsp;({pct}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[#16213e] overflow-hidden border border-[#2d4a66]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Context callout */}
          <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 max-w-2xl">
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="font-black text-[#4ade80]">40% full accuracy</span> puts Bimfle above the
              fantasy industry average — most analysts hit on roughly 25–35% of breakout predictions.
              With partials counted as partial credit, the effective success rate climbs to{' '}
              <span className="font-black text-[#fbbf24]">55%</span>.{' '}
              Bimfle's confidence was calibrated. The four clean hits — Bowers, Nabers, LaPorta, Waddle —
              represent legitimate foresight, not luck.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2026 breakout predictions ────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">2026 Breakout Predictions</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Five calls locked in before the 2026 season. Come back and check these receipts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PICKS_2026.map((pick) => {
              const confColor =
                pick.confidence >= 85 ? '#4ade80' :
                pick.confidence >= 80 ? '#fbbf24' : '#60a5fa';
              return (
                <div
                  key={pick.player}
                  className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4 hover:border-[#3a5a7a] transition-colors duration-150"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-white text-sm">{pick.player}</span>
                      <PosBadge pos={pick.pos} />
                      <span className="text-[11px] font-mono text-slate-500">{pick.team}</span>
                    </div>
                    <span
                      className="text-xl font-black tabular-nums shrink-0"
                      style={{ color: confColor }}
                    >
                      {pick.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic mb-3">
                    &ldquo;{pick.prediction}&rdquo;
                  </p>
                  <ConfidenceBar value={pick.confidence} color={confColor} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Historical accuracy table ────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#60a5fa]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Historical Accuracy by Year</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Bimfle's breakout prediction record since 2021 — hits out of 10 per season.
          </p>

          {/* Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  {['Year', 'Hits', 'Partials', 'Misses', 'Hit %', 'Trend'].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-6 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORICAL.map((row) => (
                  <tr
                    key={row.year}
                    className={cn(
                      'border-b border-[#1a2d42] hover:bg-[#16213e]/50 transition-colors duration-100',
                      row.year === 2025 && 'bg-[#16213e]/30'
                    )}
                  >
                    <td className="py-3 pr-6 font-black text-white tabular-nums">
                      {row.year}
                      {row.year === 2025 && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#ffd700] border border-[#ffd700]/30 bg-[#ffd700]/10 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-6 font-black text-[#4ade80] tabular-nums">{row.hits}/10</td>
                    <td className="py-3 pr-6 font-bold text-[#fbbf24] tabular-nums">{row.partials}/10</td>
                    <td className="py-3 pr-6 font-bold text-[#e94560] tabular-nums">{row.misses}/10</td>
                    <td className="py-3 pr-6">
                      <span
                        className="font-black tabular-nums text-base"
                        style={{
                          color:
                            row.pct >= 50 ? '#4ade80' :
                            row.pct >= 40 ? '#fbbf24' : '#e94560',
                        }}
                      >
                        {row.pct}%
                      </span>
                    </td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-[#0d1b2a] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width:           `${(row.pct / maxHistPct) * 100}%`,
                              backgroundColor:
                                row.pct >= 50 ? '#4ade80' :
                                row.pct >= 40 ? '#fbbf24' : '#e94560',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Career summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl">
            {[
              {
                label:  'Career Hit Rate',
                value:  `${Math.round(HISTORICAL.reduce((s, h) => s + h.hits, 0) / HISTORICAL.reduce((s, h) => s + h.total, 0) * 100)}%`,
                accent: '#4ade80',
              },
              {
                label:  'Best Season',
                value:  '60% (2024)',
                accent: '#ffd700',
              },
              {
                label:  'Worst Season',
                value:  '30% (2021)',
                accent: '#e94560',
              },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4 text-center"
              >
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</div>
                <div className="text-xl font-black" style={{ color: accent }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bimfle note ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#16213e] border border-[#ffd700]/30 rounded-xl p-6 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#ffd700] text-lg">~</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Commissioner's Post-Mortem</span>
            </div>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                Rashee Rice was the most painful miss. I had every reason to be right — the talent, the
                quarterback, the scheme. The injury was not foreseeable. I accept it. I do not excuse it.
              </p>
              <p>
                Brock Bowers at a HIT barely counts as a prediction. The man was always going to be TE1.
                I merely wrote it down. But I will take the credit because the record demands accuracy
                above humility.
              </p>
              <p>
                Malik Nabers at a HIT — that is the one I am proud of. WR1 by midseason on a bad Giants
                offense. Nobody was saying that in July. I was.
              </p>
            </div>
            <div className="mt-3 text-right text-xs text-[#ffd700] font-black tracking-wide">~Love, Bimfle.</div>
          </div>
        </div>
      </section>
    </>
  );
}
