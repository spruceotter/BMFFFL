import Head from 'next/head';
import { useState, useMemo } from 'react';
import { AlertTriangle, Shield, Activity, Filter } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types & Data ─────────────────────────────────────────────────────────────

type RiskLevel = 'high' | 'medium' | 'low';
type Position  = 'QB' | 'RB' | 'WR' | 'TE';

interface InjuryPlayer {
  player:       string;
  position:     Position;
  nflTeam:      string;
  age:          number;
  riskLevel:    RiskLevel;
  injuryHistory: string;
  dynastyImpact: string;
  bmffflOwner:  string;
}

const PLAYERS: InjuryPlayer[] = [
  // ── HIGH RISK ──────────────────────────────────────────────────────────────
  {
    player:        'Christian McCaffrey',
    position:      'RB',
    nflTeam:       'SF',
    age:           29,
    riskLevel:     'high',
    injuryHistory: 'Multiple injury-shortened seasons throughout his career; missed nearly all of 2024 with a hamstring/PCL issue. Fragility at age 29 is a serious dynasty concern.',
    dynastyImpact: 'Sell window is open — elite name value may never be higher.',
    bmffflOwner:   'MLSchools12',
  },
  {
    player:        'Tua Tagovailoa',
    position:      'QB',
    nflTeam:       'MIA',
    age:           27,
    riskLevel:     'high',
    injuryHistory: 'Three diagnosed concussions in two seasons; placed on IR in 2024 mid-year. Long-term brain health remains the central question around his career.',
    dynastyImpact: 'Sell if you can get fair value — the floor is near zero on another major head injury.',
    bmffflOwner:   'MLSchools12',
  },
  {
    player:        'Deebo Samuel',
    position:      'WR',
    nflTeam:       'FA',
    age:           30,
    riskLevel:     'high',
    injuryHistory: 'Recurring hamstring and shoulder injuries have limited him repeatedly since 2022. Now an unsigned free agent entering age-30 season.',
    dynastyImpact: 'Cut or trade for scraps — dynasty value is essentially exhausted.',
    bmffflOwner:   'MLSchools12',
  },
  {
    player:        'Joe Mixon',
    position:      'RB',
    nflTeam:       'HOU',
    age:           29,
    riskLevel:     'high',
    injuryHistory: 'Chronic injury history dating back to college; missed time with ankle, foot, and shoulder issues across multiple seasons in Cincinnati and Houston.',
    dynastyImpact: 'Sell window closing fast — age 29 RB with a heavy injury log.',
    bmffflOwner:   'Tubes94',
  },
  // ── MEDIUM RISK ────────────────────────────────────────────────────────────
  {
    player:        'Jaylen Waddle',
    position:      'WR',
    nflTeam:       'MIA',
    age:           27,
    riskLevel:     'medium',
    injuryHistory: 'Shoulder subluxation in 2023 cost him time; also dealt with an ankle issue in 2024. Production is heavily tied to a Tua Tagovailoa who himself is a major injury risk.',
    dynastyImpact: 'Monitor but hold — 2–3 prime years remain if Tua stays upright.',
    bmffflOwner:   'MLSchools12',
  },
  {
    player:        'Josh Jacobs',
    position:      'RB',
    nflTeam:       'GB',
    age:           28,
    riskLevel:     'medium',
    injuryHistory: 'Battled through wrist, knee, and hamstring issues across his career. Age 28 with heavy workload volume makes further wear-and-tear expected.',
    dynastyImpact: 'Sell soon — 2026 is likely his last high-value dynasty season.',
    bmffflOwner:   'MLSchools12',
  },
  {
    player:        'George Kittle',
    position:      'TE',
    nflTeam:       'SF',
    age:           32,
    riskLevel:     'medium',
    injuryHistory: 'Has missed time in nearly every season of his career with rib, knee, and foot injuries. Age 32 TE; a deep 2026 TE draft class makes replacement plausible.',
    dynastyImpact: 'Sell window open — peak value may not survive another injury.',
    bmffflOwner:   'MLSchools12',
  },
  {
    player:        'Travis Kelce',
    position:      'TE',
    nflTeam:       'KC',
    age:           36,
    riskLevel:     'medium',
    injuryHistory: 'Relatively durable historically but showed clear age-related decline in 2024 — drops, reduced separation, and reduced snap share. Age 36 is the ultimate injury risk.',
    dynastyImpact: 'Final season of relevance — plan your replacement now.',
    bmffflOwner:   'Tubes94',
  },
  {
    player:        'CeeDee Lamb',
    position:      'WR',
    nflTeam:       'DAL',
    age:           26,
    riskLevel:     'medium',
    injuryHistory: 'Shoulder injury in 2024 cost him multiple games at a critical fantasy stretch. Has otherwise been a durable WR1 across his career.',
    dynastyImpact: 'Hold firmly — age 26 prime with recovered shoulder; no reason to sell.',
    bmffflOwner:   'MLSchools12',
  },
  {
    player:        'Puka Nacua',
    position:      'WR',
    nflTeam:       'LAR',
    age:           24,
    riskLevel:     'medium',
    injuryHistory: 'Suffered a significant knee injury in 2024 that cut his season short after a dominant 2023 breakout. Durability is now the primary question around his dynasty ceiling.',
    dynastyImpact: 'Monitor recovery — if healthy, buy window may still be open at age 24.',
    bmffflOwner:   'Tubes94',
  },
  // ── LOW RISK ───────────────────────────────────────────────────────────────
  {
    player:        'Lamar Jackson',
    position:      'QB',
    nflTeam:       'BAL',
    age:           29,
    riskLevel:     'low',
    injuryHistory: 'Has missed time in the past as a scrambling QB, but has been remarkably durable in recent seasons. Running style always carries inherent contact risk.',
    dynastyImpact: 'Hold — best fantasy QB when healthy, and he has been recently.',
    bmffflOwner:   'MLSchools12',
  },
  {
    player:        "Ja'Marr Chase",
    position:      'WR',
    nflTeam:       'CIN',
    age:           25,
    riskLevel:     'low',
    injuryHistory: "Relatively clean injury history through his first four NFL seasons. No major soft-tissue scares; one of the safer dynasty WR1 profiles in the league.",
    dynastyImpact: 'Hold or buy — injury history is not a concern at this point.',
    bmffflOwner:   'Tubes94',
  },
  {
    player:        'Bijan Robinson',
    position:      'RB',
    nflTeam:       'ATL',
    age:           24,
    riskLevel:     'low',
    injuryHistory: 'Healthy through his first two NFL seasons despite carrying a workhorse workload. Age 24 limits historical risk, but heavy volume is always the RB wild card.',
    dynastyImpact: 'Monitor volume — talent is elite, but 250+ carry seasons accumulate.',
    bmffflOwner:   'Tubes94',
  },
] as const;

// ─── Config ───────────────────────────────────────────────────────────────────

const RISK_CONFIG = {
  high:   {
    label:    'High Risk',
    shortLabel: 'High',
    color:    '#e94560',
    bg:       'bg-red-500/10',
    border:   'border-red-500/30',
    icon:     AlertTriangle,
  },
  medium: {
    label:    'Medium Risk',
    shortLabel: 'Medium',
    color:    '#fbbf24',
    bg:       'bg-yellow-500/10',
    border:   'border-yellow-500/30',
    icon:     Activity,
  },
  low:    {
    label:    'Low Risk',
    shortLabel: 'Low',
    color:    '#4ade80',
    bg:       'bg-green-500/10',
    border:   'border-green-500/30',
    icon:     Shield,
  },
} as const;

// ─── Filter types ─────────────────────────────────────────────────────────────

type FilterRisk = 'all' | RiskLevel;
type FilterPos  = 'all' | Position;

// ─── Component ────────────────────────────────────────────────────────────────

export default function InjuryRiskPage() {
  const [riskFilter, setRiskFilter] = useState<FilterRisk>('all');
  const [posFilter,  setPosFilter]  = useState<FilterPos>('all');

  const filtered = useMemo(() => {
    return PLAYERS.filter((p) => {
      if (riskFilter !== 'all' && p.riskLevel !== riskFilter) return false;
      if (posFilter  !== 'all' && p.position  !== posFilter)  return false;
      return true;
    });
  }, [riskFilter, posFilter]);

  const counts = useMemo(() => ({
    high:   PLAYERS.filter((p) => p.riskLevel === 'high').length,
    medium: PLAYERS.filter((p) => p.riskLevel === 'medium').length,
    low:    PLAYERS.filter((p) => p.riskLevel === 'low').length,
  }), []);

  return (
    <>
      <Head>
        <title>Injury Risk Watchlist | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Injury risk watchlist for BMFFFL dynasty rosters — high, medium, and low risk players with history summaries and dynasty impact notes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Injury Risk Watchlist</h1>
          <p className="text-slate-400 text-sm">
            BMFFFL dynasty players with notable injury history or current risk factors — March 2026
          </p>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            {(['high', 'medium', 'low'] as const).map((r) => {
              const cfg = RISK_CONFIG[r];
              const Icon = cfg.icon;
              return (
                <div
                  key={r}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold',
                    cfg.bg,
                    cfg.border,
                  )}
                  style={{ color: cfg.color }}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {cfg.label}: {counts[r]}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />

            {/* Risk filter */}
            {(['all', 'high', 'medium', 'low'] as FilterRisk[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRiskFilter(r)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors duration-100',
                  riskFilter === r
                    ? 'bg-[#ffd700] text-[#1a1a2e]'
                    : 'bg-[#16213e] text-slate-400 hover:text-white border border-[#2d4a66]',
                )}
              >
                {r === 'all' ? 'All Risk' : r}
              </button>
            ))}

            <span className="text-slate-600 text-xs">|</span>

            {/* Position filter */}
            {(['all', 'QB', 'RB', 'WR', 'TE'] as FilterPos[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosFilter(p)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-100',
                  posFilter === p
                    ? 'bg-[#e94560] text-white'
                    : 'bg-[#16213e] text-slate-400 hover:text-white border border-[#2d4a66]',
                )}
              >
                {p === 'all' ? 'All Pos' : p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Player Cards ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-slate-500 mb-6">
            Showing {filtered.length} of {PLAYERS.length} players
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Shield className="w-10 h-10 mb-3 opacity-30" aria-hidden="true" />
              <p className="text-sm">No players match the current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((player) => {
                const cfg  = RISK_CONFIG[player.riskLevel];
                const Icon = cfg.icon;
                return (
                  <div
                    key={player.player}
                    className={cn(
                      'bg-[#16213e] rounded-xl p-5 border flex flex-col gap-3',
                      cfg.border,
                    )}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-black text-white text-base leading-tight truncate">
                          {player.player}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {player.position} · {player.nflTeam} · Age {player.age}
                        </div>
                      </div>

                      {/* Risk badge */}
                      <div
                        className={cn(
                          'flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
                          cfg.bg,
                        )}
                        style={{ color: cfg.color }}
                      >
                        <Icon className="w-3 h-3" aria-hidden="true" />
                        {cfg.shortLabel}
                      </div>
                    </div>

                    {/* Colored accent bar */}
                    <div
                      className="h-px w-full rounded-full opacity-30"
                      style={{ backgroundColor: cfg.color }}
                    />

                    {/* Injury history */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                        Injury History
                      </p>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {player.injuryHistory}
                      </p>
                    </div>

                    {/* Dynasty impact */}
                    <div className={cn('rounded-lg px-3 py-2', cfg.bg)}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: cfg.color }}>
                        Dynasty Impact
                      </p>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {player.dynastyImpact}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-1">
                      <span>Owner: <span className="text-slate-300 font-medium">{player.bmffflOwner}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer note */}
          <p className="text-xs text-slate-600 mt-10 text-center border-t border-[#2d4a66] pt-6">
            Updated March 2026 — based on known injury history and age factors
          </p>
        </div>
      </section>
    </>
  );
}
