import Head from 'next/head';
import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Rec = 'START' | 'SIT' | 'FLEX';
type Position = 'QB' | 'RB' | 'WR' | 'TE';
type Matchup = 'favorable' | 'tough' | 'neutral';

interface PlayerEntry {
  player:    string;
  team:      string;
  position:  Position;
  rec:       Rec;
  reason:    string;
  projLow:   number;
  projHigh:  number;
  matchup:   Matchup;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLAYERS: PlayerEntry[] = [
  // ── QB ──
  {
    player: 'Lamar Jackson',   team: 'BAL', position: 'QB', rec: 'START',
    reason: 'Home vs CLE with an elite floor — the league\'s best fantasy QB in a near-automatic 30+ point spot.',
    projLow: 32, projHigh: 48, matchup: 'favorable',
  },
  {
    player: 'Josh Allen',      team: 'BUF', position: 'QB', rec: 'START',
    reason: 'Must-win scenario unlocks peak Josh Allen — rushing upside pushes his ceiling through the roof.',
    projLow: 28, projHigh: 44, matchup: 'favorable',
  },
  {
    player: 'Jalen Hurts',     team: 'PHI', position: 'QB', rec: 'START',
    reason: 'Clinched seed but expected to play a full game — Hurts\' rushing floor is too valuable to bench.',
    projLow: 22, projHigh: 34, matchup: 'neutral',
  },
  {
    player: 'Russell Wilson',  team: 'PIT', position: 'QB', rec: 'SIT',
    reason: 'Road game vs Baltimore\'s elite defense sharply caps his ceiling in a low-leverage matchup.',
    projLow: 10, projHigh: 20, matchup: 'tough',
  },
  {
    player: 'Kirk Cousins',    team: 'ATL', position: 'QB', rec: 'SIT',
    reason: 'Already eliminated with potential rest management — game-script motivation is absent.',
    projLow:  8, projHigh: 18, matchup: 'tough',
  },

  // ── RB ──
  {
    player: 'Bijan Robinson',  team: 'ATL', position: 'RB', rec: 'START',
    reason: 'Workhorse role secured regardless of standings — carries the full load in Atlanta\'s run-heavy scheme.',
    projLow: 16, projHigh: 28, matchup: 'favorable',
  },
  {
    player: 'Jahmyr Gibbs',    team: 'DET', position: 'RB', rec: 'START',
    reason: 'Must-win game context means Detroit feeds Gibbs — expect heavy usage through all four quarters.',
    projLow: 18, projHigh: 30, matchup: 'favorable',
  },
  {
    player: 'De\'Von Achane',  team: 'MIA', position: 'RB', rec: 'START',
    reason: 'Soft matchup vs NYJ\'s porous run defense — Achane\'s explosive speed creates ceiling-busting upside.',
    projLow: 14, projHigh: 26, matchup: 'favorable',
  },
  {
    player: 'Tony Pollard',    team: 'TEN', position: 'RB', rec: 'SIT',
    reason: 'Eliminated Tennessee team with rest incentive — Pollard\'s snap count is genuinely unreliable.',
    projLow:  6, projHigh: 14, matchup: 'neutral',
  },
  {
    player: 'Zack Moss',       team: 'IND', position: 'RB', rec: 'SIT',
    reason: 'Eliminated Colts offer no positive game-script — expect committee usage and limited carries.',
    projLow:  5, projHigh: 12, matchup: 'tough',
  },
  {
    player: 'Gus Edwards',     team: 'LAC', position: 'RB', rec: 'SIT',
    reason: 'Heavy roster chalk with a low ceiling — safer options exist at RB in most lineup builds.',
    projLow:  8, projHigh: 15, matchup: 'neutral',
  },

  // ── WR ──
  {
    player: 'Ja\'Marr Chase',  team: 'CIN', position: 'WR', rec: 'START',
    reason: 'Chase consistently elevates in must-win games — this is the exact spot where he goes OFF.',
    projLow: 18, projHigh: 36, matchup: 'favorable',
  },
  {
    player: 'Justin Jefferson', team: 'MIN', position: 'WR', rec: 'START',
    reason: 'Division title on the line means Jefferson commands a massive target share all game long.',
    projLow: 16, projHigh: 32, matchup: 'favorable',
  },
  {
    player: 'CeeDee Lamb',     team: 'DAL', position: 'WR', rec: 'START',
    reason: 'Must-win for Dallas — Dak targets Lamb relentlessly in elimination scenarios, expect 10+ looks.',
    projLow: 16, projHigh: 30, matchup: 'favorable',
  },
  {
    player: 'Amon-Ra St. Brown', team: 'DET', position: 'WR', rec: 'FLEX',
    reason: 'Must-win game boosts his floor but volatile usage with Gibbs dominant — strong FLEX with upside.',
    projLow: 12, projHigh: 24, matchup: 'favorable',
  },
  {
    player: 'Davante Adams',   team: 'LV',  position: 'WR', rec: 'SIT',
    reason: 'Raiders are fully out of playoff contention — zero motivation and reduced snap counts expected.',
    projLow:  7, projHigh: 16, matchup: 'tough',
  },
  {
    player: 'Stefon Diggs',    team: 'NE',  position: 'WR', rec: 'SIT',
    reason: 'Eliminated Patriots with likely limited snaps — Diggs is a clear fade in Week 18 garbage time.',
    projLow:  5, projHigh: 14, matchup: 'tough',
  },

  // ── TE ──
  {
    player: 'Sam LaPorta',     team: 'DET', position: 'TE', rec: 'START',
    reason: 'Must-win Detroit game elevates LaPorta\'s target share — reliable starting TE in high-stakes spot.',
    projLow: 10, projHigh: 20, matchup: 'favorable',
  },
  {
    player: 'Trey McBride',    team: 'ARI', position: 'TE', rec: 'START',
    reason: 'Workhorse TE with a dependable weekly floor — McBride is one of the safest starts regardless of context.',
    projLow: 10, projHigh: 18, matchup: 'neutral',
  },
  {
    player: 'Dallas Goedert',  team: 'PHI', position: 'TE', rec: 'SIT',
    reason: 'Philadelphia clinched their seed — genuine rest risk makes Goedert a dangerous start this week.',
    projLow:  4, projHigh: 12, matchup: 'neutral',
  },
  {
    player: 'Evan Engram',     team: 'JAX', position: 'TE', rec: 'SIT',
    reason: 'Eliminated Jaguars have nothing to play for — Engram will see limited snaps in a meaningless game.',
    projLow:  3, projHigh: 10, matchup: 'tough',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const REC_CONFIG = {
  START: {
    label: 'START',
    color: '#4ade80',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: CheckCircle,
  },
  SIT: {
    label: 'SIT',
    color: '#e94560',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: XCircle,
  },
  FLEX: {
    label: 'FLEX',
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: AlertCircle,
  },
} as const;

const MATCHUP_CONFIG = {
  favorable: { symbol: '✓', label: 'Favorable', color: 'text-green-400' },
  tough:     { symbol: '✗', label: 'Tough',      color: 'text-red-400'   },
  neutral:   { symbol: '~', label: 'Neutral',    color: 'text-slate-400' },
} as const;

const POSITIONS: Position[] = ['QB', 'RB', 'WR', 'TE'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StartSitPage() {
  const [activePos, setActivePos] = useState<Position>('QB');

  const filtered = PLAYERS.filter((p) => p.position === activePos);

  const counts = {
    start: filtered.filter((p) => p.rec === 'START').length,
    sit:   filtered.filter((p) => p.rec === 'SIT').length,
    flex:  filtered.filter((p) => p.rec === 'FLEX').length,
  };

  return (
    <>
      <Head>
        <title>Start / Sit Analyzer | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Week 18 2025 start/sit recommendations — a final-week retrospective guide for BMFFFL dynasty lineup strategy heading into 2026."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Page header */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Start / Sit Analyzer</h1>
          <p className="text-slate-400 text-sm">Week 18 &middot; 2025 Season &middot; Final Week Analysis</p>

          {/* Bimfle note */}
          <div className="mt-5 inline-block bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg px-4 py-3 max-w-xl">
            <p className="text-sm text-[#ffd700] italic leading-relaxed">
              &ldquo;One must never bench their studs in elimination scenarios.&rdquo;
            </p>
            <p className="text-xs text-[#ffd700]/60 mt-1">~Love, Bimfle</p>
          </div>
        </div>
      </section>

      {/* Offseason note banner */}
      <div className="bg-[#16213e] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Offseason Note:</span>{' '}
            2025 season is complete. Use this as a historical reference for 2026 lineup strategy.
          </p>
        </div>
      </div>

      {/* Position filter tabs */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 flex-wrap">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setActivePos(pos)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-100',
                  activePos === pos
                    ? 'bg-[#ffd700] text-[#1a1a2e]'
                    : 'bg-[#16213e] text-slate-400 hover:text-white border border-[#2d4a66]'
                )}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Rec summary pills */}
          <div className="flex gap-3 mt-3 flex-wrap">
            {(['START', 'FLEX', 'SIT'] as Rec[]).map((r) => {
              const cfg = REC_CONFIG[r];
              const count = r === 'START' ? counts.start : r === 'SIT' ? counts.sit : counts.flex;
              if (count === 0) return null;
              return (
                <div
                  key={r}
                  className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold', cfg.bg, cfg.border)}
                  style={{ color: cfg.color }}
                >
                  <cfg.icon className="w-3 h-3" aria-hidden="true" />
                  {cfg.label}: {count}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Player cards */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-slate-500 mb-5">
            Showing {filtered.length} {activePos}s &mdash; Week 18, 2025 regular season final week.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((entry) => {
              const cfg = REC_CONFIG[entry.rec];
              const mCfg = MATCHUP_CONFIG[entry.matchup];
              const Icon = cfg.icon;

              return (
                <div
                  key={entry.player}
                  className={cn('bg-[#16213e] rounded-xl p-4 border', cfg.border)}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="min-w-0">
                      <div className="font-black text-white text-base leading-tight truncate">{entry.player}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {entry.position} &middot; {entry.team}
                      </div>
                    </div>
                    {/* Badge */}
                    <div
                      className={cn(
                        'flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wide',
                        cfg.bg
                      )}
                      style={{ color: cfg.color }}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      {cfg.label}
                    </div>
                  </div>

                  {/* Reason */}
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">{entry.reason}</p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between text-xs">
                    {/* Proj range */}
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-200">
                        {entry.projLow}&ndash;{entry.projHigh} pts
                      </span>
                      <span className="text-slate-600 ml-1">proj</span>
                    </div>
                    {/* Matchup */}
                    <div className={cn('flex items-center gap-1 font-semibold', mCfg.color)}>
                      <span className="text-base leading-none">{mCfg.symbol}</span>
                      <span>{mCfg.label}</span>
                    </div>
                  </div>

                  {/* Projection bar */}
                  <div className="mt-3 h-0.5 rounded-full bg-[#2d4a66]">
                    <div
                      className="h-0.5 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (entry.projHigh / 50) * 100)}%`,
                        backgroundColor: cfg.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
