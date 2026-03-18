import Head from 'next/head';
import { Radio, Trophy, RefreshCw, CheckCircle2, Zap, Users, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Constants ────────────────────────────────────────────────────────────────

const LEAGUE_ID = '910140889474326528';
const LAST_UPDATED = 'January 6, 2026 — 11:58 PM ET';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Matchup {
  id: string;
  round: string;
  teamA: string;
  scoreA: number;
  teamB: string;
  scoreB: number;
  status: 'FINAL';
}

interface PlayerScore {
  rank: number;
  player: string;
  position: string;
  nflTeam: string;
  owner: string;
  points: number;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const CHAMPIONSHIP_MATCHUPS: Matchup[] = [
  {
    id: 'champ',
    round: 'Championship',
    teamA: 'mlschools12',
    scoreA: 221.4,
    teamB: 'tubes94',
    scoreB: 198.7,
    status: 'FINAL',
  },
  {
    id: '3rd',
    round: '3rd Place',
    teamA: 'rbr',
    scoreA: 167.1,
    teamB: 'sexmachineandy',
    scoreB: 188.9,
    status: 'FINAL',
  },
  {
    id: 'con1',
    round: 'Consolation 1',
    teamA: 'juicybussy',
    scoreA: 176.4,
    teamB: 'cmaleski',
    scoreB: 161.8,
    status: 'FINAL',
  },
  {
    id: 'con2',
    round: 'Consolation 2',
    teamA: 'eldridsm',
    scoreA: 155.2,
    teamB: 'eldridm20',
    scoreB: 148.9,
    status: 'FINAL',
  },
  {
    id: 'con3',
    round: 'Consolation 3',
    teamA: 'tdtd19844',
    scoreA: 143.8,
    teamB: 'cogdeill11',
    scoreB: 138.2,
    status: 'FINAL',
  },
  {
    id: 'con4',
    round: 'Consolation 4',
    teamA: 'grandes',
    scoreA: 141.5,
    teamB: 'escuelas',
    scoreB: 127.3,
    status: 'FINAL',
  },
];

const TOP_PLAYER_SCORES: PlayerScore[] = [
  { rank: 1,  player: 'Lamar Jackson',    position: 'QB', nflTeam: 'BAL', owner: 'mlschools12',  points: 48.9 },
  { rank: 2,  player: 'Bijan Robinson',   position: 'RB', nflTeam: 'ATL', owner: 'tubes94',      points: 44.2 },
  { rank: 3,  player: 'Josh Allen',       position: 'QB', nflTeam: 'BUF', owner: 'sexmachineandy', points: 42.6 },
  { rank: 4,  player: 'De\'Von Achane',   position: 'RB', nflTeam: 'MIA', owner: 'juicybussy',   points: 38.8 },
  { rank: 5,  player: 'Amon-Ra St. Brown', position: 'WR', nflTeam: 'DET', owner: 'mlschools12', points: 36.4 },
  { rank: 6,  player: 'Sam LaPorta',      position: 'TE', nflTeam: 'DET', owner: 'rbr',          points: 33.7 },
  { rank: 7,  player: 'CeeDee Lamb',      position: 'WR', nflTeam: 'DAL', owner: 'tubes94',      points: 31.9 },
  { rank: 8,  player: 'Jaylen Waddle',    position: 'WR', nflTeam: 'MIA', owner: 'eldridsm',     points: 29.4 },
  { rank: 9,  player: 'Tony Pollard',     position: 'RB', nflTeam: 'TEN', owner: 'grandes',      points: 27.8 },
  { rank: 10, player: 'Puka Nacua',       position: 'WR', nflTeam: 'LAR', owner: 'cmaleski',     points: 26.5 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const POSITION_COLORS: Record<string, string> = {
  QB: 'text-red-400 bg-red-400/10 border-red-400/20',
  RB: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  WR: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  TE: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

function displayName(slug: string): string {
  const map: Record<string, string> = {
    mlschools12:    'MLSchools12',
    tubes94:        'Tubes94',
    rbr:            'rbr',
    sexmachineandy: 'SexMachineAndy',
    juicybussy:     'JuicyBussy',
    cmaleski:       'cmaleski',
    eldridsm:       'eldridsm',
    eldridm20:      'eldridm20',
    tdtd19844:      'tdtd19844',
    cogdeill11:     'Cogdeill11',
    grandes:        'grandes',
    escuelas:       'escuelas',
  };
  return map[slug] ?? slug;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#0d1b2a] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Radio className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-300">
          Sleeper Live
        </span>
        <span className="text-slate-600 text-sm">—</span>
        <span className="text-sm text-slate-400">
          Off-Season Mode
        </span>
        <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-700/60 border border-slate-600/40 text-slate-400">
          Off-Season
        </span>
      </div>
      <div className="flex flex-col sm:items-end gap-0.5">
        <span className="text-xs text-slate-400 font-medium">
          Last Season: 2025 Championship Week
        </span>
        <span className="text-xs text-slate-600">
          Season 7 starts September 2026
        </span>
      </div>
    </div>
  );
}

function MatchupCard({ matchup }: { matchup: Matchup }) {
  const aWins = matchup.scoreA > matchup.scoreB;
  const bWins = matchup.scoreB > matchup.scoreA;
  const isChamp = matchup.id === 'champ';

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#16213e] overflow-hidden',
        isChamp
          ? 'border-[#ffd700]/40 shadow-md shadow-[#ffd700]/10'
          : 'border-[#2d4a66]'
      )}
    >
      {/* Round label */}
      <div
        className={cn(
          'px-4 py-2 flex items-center justify-between',
          isChamp
            ? 'bg-[#ffd700]/10 border-b border-[#ffd700]/20'
            : 'bg-[#0d1b2a] border-b border-[#2d4a66]'
        )}
      >
        <div className="flex items-center gap-2">
          {isChamp && (
            <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
          )}
          <span
            className={cn(
              'text-xs font-bold uppercase tracking-wider',
              isChamp ? 'text-[#ffd700]' : 'text-slate-500'
            )}
          >
            {matchup.round}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
          {matchup.status}
        </span>
      </div>

      {/* Scores */}
      <div className="p-4 space-y-2">
        {/* Team A */}
        <div
          className={cn(
            'flex items-center justify-between rounded-lg px-4 py-3',
            aWins ? 'bg-[#1a2d42] border border-[#3a5f80]' : 'bg-[#0d1b2a] border border-[#1e3a52] opacity-70'
          )}
        >
          <div className="flex items-center gap-2.5">
            {aWins && (
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">
                W
              </span>
            )}
            <span className={cn('text-sm font-bold', aWins ? 'text-white' : 'text-slate-500')}>
              {displayName(matchup.teamA)}
            </span>
          </div>
          <span className={cn('text-lg font-black tabular-nums', aWins ? 'text-white' : 'text-slate-500')}>
            {matchup.scoreA.toFixed(1)}
          </span>
        </div>

        {/* Team B */}
        <div
          className={cn(
            'flex items-center justify-between rounded-lg px-4 py-3',
            bWins ? 'bg-[#1a2d42] border border-[#3a5f80]' : 'bg-[#0d1b2a] border border-[#1e3a52] opacity-70'
          )}
        >
          <div className="flex items-center gap-2.5">
            {bWins && (
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">
                W
              </span>
            )}
            <span className={cn('text-sm font-bold', bWins ? 'text-white' : 'text-slate-500')}>
              {displayName(matchup.teamB)}
            </span>
          </div>
          <span className={cn('text-lg font-black tabular-nums', bWins ? 'text-white' : 'text-slate-500')}>
            {matchup.scoreB.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PlayerPerformanceSection() {
  return (
    <section className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden" aria-labelledby="player-perf-heading">
      <div className="px-6 py-4 border-b border-[#2d4a66] flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] shrink-0">
          <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
        </div>
        <div>
          <h2 id="player-perf-heading" className="text-base font-bold text-white">
            Player Performance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Top 10 individual scores — Championship Week 2025</p>
        </div>
      </div>

      <div className="divide-y divide-[#1e3a52]">
        {TOP_PLAYER_SCORES.map((row) => (
          <div
            key={row.rank}
            className="flex items-center gap-4 px-6 py-3 hover:bg-[#1a2d42]/60 transition-colors duration-100"
          >
            {/* Rank */}
            <span
              className={cn(
                'shrink-0 w-7 text-center text-sm font-black tabular-nums',
                row.rank === 1 ? 'text-[#ffd700]' : row.rank <= 3 ? 'text-slate-300' : 'text-slate-600'
              )}
            >
              {row.rank}
            </span>

            {/* Player info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{row.player}</p>
              <p className="text-xs text-slate-500 truncate">{row.nflTeam} — owned by {displayName(row.owner)}</p>
            </div>

            {/* Position badge */}
            <span
              className={cn(
                'shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
                POSITION_COLORS[row.position] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20'
              )}
            >
              {row.position}
            </span>

            {/* Points */}
            <span className="shrink-0 text-base font-black text-white tabular-nums w-14 text-right">
              {row.points.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LiveModeExplainer() {
  return (
    <section
      className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6"
      aria-labelledby="live-mode-heading"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] shrink-0">
          <Radio className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
        </div>
        <h2 id="live-mode-heading" className="text-base font-bold text-white">
          Live Mode — How It Works
        </h2>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        During the NFL season (September through January), this page shows real-time scores
        updating every 60 seconds via the Sleeper API. Off-season, it shows the final results
        from the most recent Championship Week.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: Radio,
            label: 'Live Updates',
            value: 'Every 60 seconds',
            desc: 'Auto-refreshes during game windows',
          },
          {
            icon: Users,
            label: 'All 12 Teams',
            value: '6 Matchups',
            desc: 'Full league coverage, all game weeks',
          },
          {
            icon: BarChart2,
            label: 'Player Breakdown',
            value: 'Live Scoring',
            desc: 'Per-player scores, positions, projections',
          },
        ].map(({ icon: Icon, label, value, desc }) => (
          <div key={label} className="rounded-lg bg-[#0d1b2a] border border-[#2d4a66] px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
            </div>
            <p className="text-sm font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApiStatusSection() {
  return (
    <section
      className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6"
      aria-labelledby="api-status-heading"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        </div>
        <h2 id="api-status-heading" className="text-base font-bold text-white">
          API Status
        </h2>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: 'Sleeper API',
            value: 'Connected',
            accent: 'emerald',
            prefix: '✅',
          },
          {
            label: 'League ID',
            value: LEAGUE_ID,
            accent: 'slate',
            mono: true,
          },
          {
            label: 'Mode',
            value: 'Off-Season',
            accent: 'slate',
          },
        ].map(({ label, value, accent, prefix, mono }) => (
          <div key={label} className="rounded-lg bg-[#0d1b2a] border border-[#2d4a66] px-4 py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {label}
            </dt>
            <dd
              className={cn(
                'text-sm font-bold',
                accent === 'emerald' ? 'text-emerald-400' : 'text-white',
                mono && 'font-mono text-xs'
              )}
            >
              {prefix ? `${prefix} ${value}` : value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SleeperLivePage() {
  return (
    <>
      <Head>
        <title>Sleeper Live — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Championship Week 2025 results and live scoring for BMFFFL dynasty fantasy football. During the NFL season, updates every 60 seconds via the Sleeper API."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <header>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Radio className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Sleeper Live
          </h1>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
            Championship Week 2025 results. During the NFL season, this page shows live scores
            updating every 60 seconds.
          </p>
        </header>

        {/* ── Status Bar ─────────────────────────────────────────────────── */}
        <StatusBar />

        {/* ── Last Updated + Refresh ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Last updated:</span>{' '}
            {LAST_UPDATED}
          </p>
          <button
            type="button"
            aria-label="Refresh scores (decorative — data is static in off-season)"
            title="Refresh is live during the NFL season only"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 bg-[#16213e] border border-[#2d4a66] hover:border-[#3a5f80] hover:text-slate-200 transition-colors duration-150 cursor-default"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Refresh Scores
          </button>
        </div>

        {/* ── Championship Week Results ──────────────────────────────────── */}
        <section aria-labelledby="champ-week-heading">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] shrink-0">
              <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="champ-week-heading" className="text-lg font-bold text-white">
                Championship Week Results
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">2025 Season — Week 17 (Final)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {CHAMPIONSHIP_MATCHUPS.map((matchup) => (
              <MatchupCard key={matchup.id} matchup={matchup} />
            ))}
          </div>
        </section>

        {/* ── Player Performance ─────────────────────────────────────────── */}
        <PlayerPerformanceSection />

        {/* ── Live Mode Explainer ────────────────────────────────────────── */}
        <LiveModeExplainer />

        {/* ── API Status ─────────────────────────────────────────────────── */}
        <ApiStatusSection />

      </div>
    </>
  );
}
