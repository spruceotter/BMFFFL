import Head from 'next/head';
import { Zap, Target, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ManagerProfile {
  manager: string;
  avgScore: number;
  stdDev: number;
  highWeek: number;
  lowWeek: number;
  profile: string;
  profileColor: string;
  quadrant: 'boom-kings' | 'wild-cards' | 'reliable-elite' | 'floor-teams';
}

interface ExtremeWeek {
  manager: string;
  score: number;
  week: number;
  note: string;
}

interface AllTimeRecord {
  label: string;
  value: string;
  sub: string;
  accent: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// Quadrant thresholds: avg >= 140 = "high avg"; stdDev >= 18 = "high variance"
const AVG_THRESHOLD = 140;
const STD_THRESHOLD = 18;

const MANAGERS: ManagerProfile[] = [
  {
    manager:      'JuicyBussy',
    avgScore:     134.0,
    stdDev:       28.4,
    highWeek:     208.6,
    lowWeek:      84.2,
    profile:      'EXPLOSIVE BOOM',
    profileColor: '#e94560',
    quadrant:     'wild-cards',
  },
  {
    manager:      'Cmaleski',
    avgScore:     142.2,
    stdDev:       22.1,
    highWeek:     192.4,
    lowWeek:      98.6,
    profile:      'BOOM-HEAVY',
    profileColor: '#f97316',
    quadrant:     'boom-kings',
  },
  {
    manager:      'Tubes94',
    avgScore:     154.2,
    stdDev:       18.6,
    highWeek:     196.8,
    lowWeek:      112.4,
    profile:      'HIGH FLOOR BOOM',
    profileColor: '#ffd700',
    quadrant:     'boom-kings',
  },
  {
    manager:      'MLSchools12',
    avgScore:     151.4,
    stdDev:       16.2,
    highWeek:     188.4,
    lowWeek:      116.8,
    profile:      'ELITE CONSISTENT',
    profileColor: '#ffd700',
    quadrant:     'reliable-elite',
  },
  {
    manager:      'tdtd19844',
    avgScore:     141.5,
    stdDev:       21.8,
    highWeek:     189.2,
    lowWeek:      94.6,
    profile:      'BOOM-CAPABLE',
    profileColor: '#f97316',
    quadrant:     'boom-kings',
  },
  {
    manager:      'SexMachineAndyD',
    avgScore:     146.8,
    stdDev:       14.8,
    highWeek:     176.4,
    lowWeek:      118.2,
    profile:      'CONSISTENT',
    profileColor: '#4ade80',
    quadrant:     'reliable-elite',
  },
  {
    manager:      'rbr',
    avgScore:     142.3,
    stdDev:       12.4,
    highWeek:     164.8,
    lowWeek:      118.6,
    profile:      'VERY CONSISTENT',
    profileColor: '#4ade80',
    quadrant:     'reliable-elite',
  },
  {
    manager:      'eldridsm',
    avgScore:     134.6,
    stdDev:       17.2,
    highWeek:     168.2,
    lowWeek:      100.4,
    profile:      'CONSISTENT',
    profileColor: '#4ade80',
    quadrant:     'floor-teams',
  },
  {
    manager:      'eldridm20',
    avgScore:     138.2,
    stdDev:       19.4,
    highWeek:     178.6,
    lowWeek:      96.8,
    profile:      'SLIGHTLY BOOM',
    profileColor: '#fb923c',
    quadrant:     'wild-cards',
  },
  {
    manager:      'Grandes',
    avgScore:     129.4,
    stdDev:       15.6,
    highWeek:     158.4,
    lowWeek:      96.2,
    profile:      'BELOW-AVG CONSISTENT',
    profileColor: '#94a3b8',
    quadrant:     'floor-teams',
  },
  {
    manager:      'Cogdeill11',
    avgScore:     125.8,
    stdDev:       18.8,
    highWeek:     172.4,
    lowWeek:      88.4,
    profile:      'UNRELIABLE',
    profileColor: '#e94560',
    quadrant:     'wild-cards',
  },
  {
    manager:      'Escuelas',
    avgScore:     122.4,
    stdDev:       24.6,
    highWeek:     182.2,
    lowWeek:      68.4,
    profile:      'VOLATILE BUST',
    profileColor: '#e94560',
    quadrant:     'wild-cards',
  },
];

const TOP_EXPLOSIVE_WEEKS: ExtremeWeek[] = [
  { manager: 'JuicyBussy',    score: 208.6, week: 8,  note: 'Highest regular season week of 2025' },
  { manager: 'Tubes94',       score: 196.8, week: 13, note: 'Final week of dominant 3-week stretch' },
  { manager: 'Tubes94',       score: 182.0, week: 11, note: 'Mid-stretch dominance' },
  { manager: 'Escuelas',      score: 182.2, week: 6,  note: 'Volatile spike — peak of a chaotic season' },
  { manager: 'tdtd19844',     score: 174.2, week: 17, note: 'Championship Week — the clutch boom that won the title' },
];

const ALL_TIME_RECORDS: AllTimeRecord[] = [
  {
    label:  'Most Explosive Single Week Ever',
    value:  '245.80 pts',
    sub:    'JuicyBussy — Week 16, 2021 (All-time record)',
    accent: '#e94560',
  },
  {
    label:  'Most Consistent Manager All-Time',
    value:  'MLSchools12',
    sub:    'Std dev avg 15.4 across all seasons',
    accent: '#4ade80',
  },
  {
    label:  'Most Volatile Manager All-Time',
    value:  'JuicyBussy',
    sub:    'Std dev avg 26.8 across all seasons',
    accent: '#e94560',
  },
  {
    label:  'Highest Season Average All-Time',
    value:  '154.2 / week',
    sub:    'Tubes94 — 2025 season (14 regular season weeks)',
    accent: '#ffd700',
  },
];

// ─── Quadrant config ──────────────────────────────────────────────────────────

const QUADRANTS = [
  {
    id:          'boom-kings' as const,
    label:       'BOOM KINGS',
    description: 'High avg + high variance — dangerous every week',
    accent:      '#f97316',
    corner:      'Top-Right',
  },
  {
    id:          'reliable-elite' as const,
    label:       'RELIABLE ELITE',
    description: 'High avg + low variance — the gold standard',
    accent:      '#ffd700',
    corner:      'Bottom-Right',
  },
  {
    id:          'wild-cards' as const,
    label:       'WILD CARDS',
    description: 'Low avg + high variance — unpredictable, dangerous or dead',
    accent:      '#e94560',
    corner:      'Top-Left',
  },
  {
    id:          'floor-teams' as const,
    label:       'FLOOR TEAMS',
    description: 'Low avg + low variance — predictable, consistently below average',
    accent:      '#94a3b8',
    corner:      'Bottom-Left',
  },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileBadge({ profile, color }: { profile: string; color: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-black tracking-wide uppercase"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {profile}
    </span>
  );
}

function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex-1 bg-[#0d1b2a] rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ManagerCard({ m }: { m: ManagerProfile }) {
  const range = m.highWeek - m.lowWeek;
  return (
    <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4 flex flex-col gap-3 hover:border-[#3a5a7a] transition-colors duration-150">
      <div className="flex items-start justify-between gap-2">
        <span className="font-black text-white text-sm">{m.manager}</span>
        <ProfileBadge profile={m.profile} color={m.profileColor} />
      </div>

      {/* Avg score bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Avg Score</span>
          <span className="text-xs font-bold text-slate-300 tabular-nums">{m.avgScore.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <StatBar value={m.avgScore} max={165} color={m.profileColor} />
        </div>
      </div>

      {/* Std dev bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Std Dev</span>
          <span className="text-xs font-bold text-slate-300 tabular-nums">{m.stdDev.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <StatBar value={m.stdDev} max={32} color={m.profileColor} />
        </div>
      </div>

      {/* High / Low / Range */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#2d4a66]">
        <div className="text-center">
          <div className="text-xs text-slate-500">High</div>
          <div className="text-sm font-black text-[#4ade80] tabular-nums">{m.highWeek.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500">Low</div>
          <div className="text-sm font-black text-[#e94560] tabular-nums">{m.lowWeek.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500">Range</div>
          <div className="text-sm font-black text-slate-300 tabular-nums">{range.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BoomOrBustPage() {
  // Sort by std dev for reliability leaderboard (most consistent first)
  const byConsistency = [...MANAGERS].sort((a, b) => a.stdDev - b.stdDev);

  // Sort by avg for scatter reference
  const allAvgs = MANAGERS.map((m) => m.avgScore);
  const leagueAvg = allAvgs.reduce((s, v) => s + v, 0) / allAvgs.length;

  return (
    <>
      <Head>
        <title>Boom or Bust | BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL 2025 weekly scoring variance analysis — which managers are explosive BOOM types and which are reliable BUST-proof machines."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Boom or Bust</h1>
          <p className="text-slate-400 text-sm">
            Weekly scoring variance and explosiveness ratings — 2025 season
          </p>
        </div>
      </section>

      {/* ── League variance overview stat strip ─────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'League Avg / Week',  value: `${leagueAvg.toFixed(1)} pts`, accent: '#ffd700' },
              { label: 'Most Explosive',     value: 'JuicyBussy',  sub: '28.4 std dev',   accent: '#e94560' },
              { label: 'Most Consistent',    value: 'rbr',         sub: '12.4 std dev',   accent: '#4ade80' },
              { label: 'Highest Avg 2025',   value: 'Tubes94',     sub: '154.2 / week',   accent: '#ffd700' },
            ].map(({ label, value, sub, accent }) => (
              <div
                key={label}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4 text-center"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</div>
                <div className="text-xl font-black" style={{ color: accent }}>{value}</div>
                {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quadrant classification grid ────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">Scoring Profile Quadrants</h2>
          <p className="text-slate-400 text-sm mb-6">
            Teams plotted by average weekly score (horizontal) vs. scoring standard deviation (vertical).
            Thresholds: avg ≥ {AVG_THRESHOLD} pts = high avg; std dev ≥ {STD_THRESHOLD} = high variance.
          </p>

          {/* Axis labels */}
          <div className="mb-2 flex justify-between items-center px-1">
            <span className="text-xs text-slate-600 uppercase tracking-wide">← Lower Avg</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Avg Weekly Score →</span>
            <span className="text-xs text-slate-600 uppercase tracking-wide">Higher Avg →</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUADRANTS.map((q) => {
              const members = MANAGERS.filter((m) => m.quadrant === q.id);
              return (
                <div
                  key={q.id}
                  className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5"
                  style={{ borderLeft: `4px solid ${q.accent}` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: q.accent }}>
                      {q.corner}
                    </span>
                    <span className="text-white font-black text-sm">{q.label}</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-4">{q.description}</p>
                  <div className="flex flex-col gap-2">
                    {members.map((m) => (
                      <div key={m.manager} className="flex items-center justify-between gap-3">
                        <span className="text-sm text-white font-medium">{m.manager}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 tabular-nums">
                            avg {m.avgScore.toFixed(1)}
                          </span>
                          <span className="text-xs text-slate-500">|</span>
                          <span className="text-xs text-slate-400 tabular-nums">
                            σ {m.stdDev.toFixed(1)}
                          </span>
                          <ProfileBadge profile={m.profile} color={m.profileColor} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Manager profile cards ────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">Manager Variance Cards</h2>
          <p className="text-slate-400 text-sm mb-6">
            All 12 teams — detailed weekly scoring range and explosiveness profile for the 2025 season.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MANAGERS.map((m) => (
              <ManagerCard key={m.manager} m={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Most explosive weeks ─────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Most Explosive Weeks — 2025</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  {['Rank', 'Manager', 'Score', 'Week', 'Context'].map((h) => (
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
                {TOP_EXPLOSIVE_WEEKS.map((w, idx) => (
                  <tr
                    key={`${w.manager}-${w.week}`}
                    className="border-b border-[#1a2d42] hover:bg-[#16213e]/50 transition-colors duration-100"
                  >
                    <td className="py-3 pr-6">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black',
                          idx === 0
                            ? 'bg-[#ffd700] text-[#0d1b2a]'
                            : idx === 1
                            ? 'bg-slate-400 text-[#0d1b2a]'
                            : idx === 2
                            ? 'bg-[#b87333] text-white'
                            : 'bg-[#16213e] text-slate-400 border border-[#2d4a66]'
                        )}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 pr-6 font-black text-white">{w.manager}</td>
                    <td className="py-3 pr-6 font-black text-[#ffd700] tabular-nums text-base">{w.score.toFixed(1)}</td>
                    <td className="py-3 pr-6 text-slate-400 tabular-nums">Wk {w.week}</td>
                    <td className="py-3 pr-6 text-slate-400 text-xs max-w-xs">{w.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Reliability leaderboard ──────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-[#4ade80]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Reliability Leaderboard</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Ranked by standard deviation — most consistent (lowest σ) to most volatile (highest σ).
          </p>
          <div className="grid gap-2">
            {byConsistency.map((m, idx) => (
              <div
                key={m.manager}
                className="flex items-center gap-4 bg-[#16213e] border border-[#2d4a66] rounded-lg px-4 py-3 hover:border-[#3a5a7a] transition-colors duration-100"
              >
                <span className="text-sm font-black text-slate-500 w-5 text-right shrink-0">{idx + 1}</span>
                <span className="text-sm font-medium text-white w-36 shrink-0">{m.manager}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <StatBar value={m.stdDev} max={32} color={m.profileColor} />
                    <span className="text-xs text-slate-400 tabular-nums w-10 text-right shrink-0">
                      σ {m.stdDev.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block shrink-0">
                  <ProfileBadge profile={m.profile} color={m.profileColor} />
                </div>
                <span className="text-xs text-slate-500 w-24 text-right shrink-0 tabular-nums hidden md:block">
                  avg {m.avgScore.toFixed(1)} pts
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Lower std dev = more consistent weekly output. Higher std dev = more boom/bust tendencies.
          </p>
        </div>
      </section>

      {/* ── All-time boom/bust records ───────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">All-Time Boom / Bust Records</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_TIME_RECORDS.map((r) => (
              <div
                key={r.label}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5"
                style={{ borderTop: `3px solid ${r.accent}` }}
              >
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{r.label}</div>
                <div className="text-2xl font-black mb-1" style={{ color: r.accent }}>{r.value}</div>
                <div className="text-xs text-slate-400">{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notable stretches ───────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#60a5fa]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Notable Moments — 2025</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title:  'Week 8 Explosion',
                detail: "JuicyBussy's 208.6-point week was the highest regular season output of 2025 — a full 26 points above their own season high from any other week. EXPLOSIVE BOOM in full effect.",
                accent: '#e94560',
              },
              {
                title:  'Tubes94 Three-Week Run',
                detail: 'Wks 11-13: 174, 182, 196 — the most sustained dominance in the 2025 regular season. No other manager posted 170+ in three consecutive weeks. The definition of HIGH FLOOR BOOM.',
                accent: '#ffd700',
              },
              {
                title:  'tdtd19844 Championship Boom',
                detail: 'Week 17 championship game: 174.20 pts — the clutch boom that sealed the 2025 title. Avg manager, high variance. Proves that BOOM-CAPABLE wins rings when it counts.',
                accent: '#f97316',
              },
            ].map(({ title, detail, accent }) => (
              <div
                key={title}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5"
                style={{ borderLeft: `3px solid ${accent}` }}
              >
                <h3 className="font-black text-white text-sm mb-2">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Profile classification guide ─────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-4">Profile Classification Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                profile: 'EXPLOSIVE BOOM',
                color:   '#e94560',
                desc:    'High variance + dangerous avg. Most lethal opponent on the right week. Hard to game-plan for.',
              },
              {
                profile: 'HIGH FLOOR BOOM',
                color:   '#ffd700',
                desc:    'Dominant average with boom upside. Can be caught on an off week but rarely underperforms badly.',
              },
              {
                profile: 'ELITE CONSISTENT',
                color:   '#ffd700',
                desc:    'The gold standard. High avg, low variance. Rarely loses because of their own score.',
              },
              {
                profile: 'BOOM-CAPABLE',
                color:   '#f97316',
                desc:    'Mid avg but high variance. Dangerous in single-elimination playoffs — streaks are their weapon.',
              },
              {
                profile: 'CONSISTENT',
                color:   '#4ade80',
                desc:    'Predictable and reliable. You know what you\'re getting. Good, not great, every week.',
              },
              {
                profile: 'VOLATILE BUST',
                color:   '#e94560',
                desc:    'Low avg + high variance. Wild swings that usually end up disappointing. Hard to trust in any format.',
              },
            ].map(({ profile, color, desc }) => (
              <div key={profile} className="flex gap-3">
                <div
                  className="w-1 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <ProfileBadge profile={profile} color={color} />
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{desc}</p>
                </div>
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Commissioner's Note</span>
            </div>
            <blockquote className="text-slate-300 text-sm leading-relaxed italic">
              "The explosive team is the dynasty's assassin — dangerous on any given week. The consistent team is
              the dynasty's backbone. Your Commissioner has observed that championships are won by those who can
              be both."
            </blockquote>
            <div className="mt-3 text-right text-xs text-[#ffd700] font-black tracking-wide">~Love, Bimfle.</div>
          </div>
        </div>
      </section>
    </>
  );
}
