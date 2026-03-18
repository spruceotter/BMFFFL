import Head from 'next/head';
import { Users, GitMerge, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type OverlapLevel = 'Low' | 'Medium' | 'High';

interface PlayerOwnership {
  player:   string;
  position: Position;
  owner:    string | null; // null = Available
}

interface TeamCorrelation {
  teamA:       string;
  teamB:       string;
  shared:      number;
  level:       OverlapLevel;
  note:        string;
}

interface UniqueAsset {
  manager: string;
  player:  string;
  position: Position;
  note:    string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const OWNERSHIP_MAP: PlayerOwnership[] = [
  { player: 'Justin Jefferson',  position: 'WR', owner: 'mlschools12' },
  { player: 'Ja\'Marr Chase',    position: 'WR', owner: 'rbr' },
  { player: 'CeeDee Lamb',       position: 'WR', owner: 'tubes94' },
  { player: 'Tyreek Hill',       position: 'WR', owner: 'mlschools12' },
  { player: 'Davante Adams',     position: 'WR', owner: 'sexmachineandy' },
  { player: 'Justin Herbert',    position: 'QB', owner: 'rbr' },
  { player: 'Jalen Hurts',       position: 'QB', owner: 'mlschools12' },
  { player: 'Joe Burrow',        position: 'QB', owner: 'tubes94' },
  { player: 'Saquon Barkley',    position: 'RB', owner: 'juicybussy' },
  { player: 'Derrick Henry',     position: 'RB', owner: 'tdtd19844' },
  { player: 'CMC',               position: 'RB', owner: null },
  { player: 'Stefon Diggs',      position: 'WR', owner: 'cogdeill11' },
  { player: 'Travis Kelce',      position: 'TE', owner: 'grandes' },
  { player: 'Sam LaPorta',       position: 'TE', owner: 'eldridsm' },
  { player: 'Brock Bowers',      position: 'TE', owner: null },
  { player: 'Rashee Rice',       position: 'WR', owner: 'eldridm20' },
  { player: 'Malik Nabers',      position: 'WR', owner: 'cmaleski' },
  { player: 'Rome Odunze',       position: 'WR', owner: 'escuelas' },
  { player: 'Puka Nacua',        position: 'WR', owner: null },
  { player: 'Ladd McConkey',     position: 'WR', owner: 'tubes94' },
];

const CORRELATIONS: TeamCorrelation[] = [
  {
    teamA: 'mlschools12', teamB: 'rbr', shared: 1, level: 'Low',
    note: 'Low overlap (1 shared player). Trade partner potential.',
  },
  {
    teamA: 'tubes94', teamB: 'sexmachineandy', shared: 2, level: 'Medium',
    note: 'Medium overlap. Both WR-heavy. Correlated ceiling outcomes.',
  },
  {
    teamA: 'juicybussy', teamB: 'tdtd19844', shared: 1, level: 'Low',
    note: 'Low overlap. Both RB-first but different backs. Good trade partners.',
  },
  {
    teamA: 'mlschools12', teamB: 'tubes94', shared: 0, level: 'Low',
    note: 'Minimal overlap. Divergent construction. Ideal trade partnership.',
  },
  {
    teamA: 'cogdeill11', teamB: 'escuelas', shared: 1, level: 'Low',
    note: 'Low overlap. Both in rebuild mode. Pick-swap friendly.',
  },
  {
    teamA: 'grandes', teamB: 'eldridsm', shared: 1, level: 'Low',
    note: 'TE-correlated outcomes. Both relying on aging single assets.',
  },
];

const UNIQUE_ASSETS: UniqueAsset[] = [
  { manager: 'mlschools12',    player: 'Justin Jefferson',  position: 'WR', note: 'Only elite WR1 of his tier in the league.' },
  { manager: 'rbr',            player: 'Ja\'Marr Chase',    position: 'WR', note: 'Explosive upside. No one else has this ceiling.' },
  { manager: 'tubes94',        player: 'CeeDee Lamb',       position: 'WR', note: 'Superstar WR1 that no one else can access.' },
  { manager: 'sexmachineandy', player: 'Davante Adams',     position: 'WR', note: 'Aging star, but uniquely owned high-floor asset.' },
  { manager: 'juicybussy',     player: 'Saquon Barkley',    position: 'RB', note: 'Best RB in the league. Irreplaceable.' },
  { manager: 'tdtd19844',      player: 'Derrick Henry',     position: 'RB', note: 'Volume beast. Exclusively owned workhorse.' },
  { manager: 'cogdeill11',     player: 'Stefon Diggs',      position: 'WR', note: 'Most valuable asset in an otherwise thin roster.' },
  { manager: 'grandes',        player: 'Travis Kelce',      position: 'TE', note: 'Last elite TE in the GOAT window.' },
  { manager: 'eldridsm',       player: 'Sam LaPorta',       position: 'TE', note: 'Young TE1 with a long runway. Exclusively owned.' },
  { manager: 'eldridm20',      player: 'Rashee Rice',       position: 'WR', note: 'Buy-low returning from injury. High ceiling.' },
  { manager: 'cmaleski',       player: 'Malik Nabers',      position: 'WR', note: 'Year 2 breakout candidate. Best unique asset at value.' },
  { manager: 'escuelas',       player: 'Rome Odunze',       position: 'WR', note: 'Learning curve complete. New WR1 in Chicago.' },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

const POS_COLORS: Record<Position, string> = {
  QB: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  RB: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  WR: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  TE: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

const OVERLAP_COLORS: Record<OverlapLevel, string> = {
  Low:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  High:   'text-red-400 bg-red-500/10 border-red-500/30',
};

function PosBadge({ position }: { position: Position }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-9 h-6 rounded text-[10px] font-black uppercase tracking-wider border shrink-0',
        POS_COLORS[position]
      )}
    >
      {position}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RosterOverlapPage() {
  const available = OWNERSHIP_MAP.filter((p) => p.owner === null);
  const owned     = OWNERSHIP_MAP.filter((p) => p.owner !== null);

  return (
    <>
      <Head>
        <title>Roster Overlap Analyzer | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Which BMFFFL managers share core dynasty players? High overlap means correlated playoff outcomes — identify trade partners and unique assets."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-5">
            <GitMerge className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics — Roster Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Roster Overlap Analyzer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            How much do rosters overlap? High overlap = correlated playoff outcomes. Know your
            competition. Know your trade partners.
          </p>

          {/* Summary stats */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#16213e] border border-[#2d4a66] text-slate-300 text-sm font-semibold">
              <Users className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              {OWNERSHIP_MAP.length} Key Dynasty Players Tracked
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
              {owned.length} Owned
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400 text-sm font-semibold">
              {available.length} Available
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* ── Player Ownership Map ────────────────────────────────────────── */}
        <section aria-label="Player ownership map">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-black uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              Ownership Map
            </div>
            <h2 className="text-2xl font-black text-white">Who Owns What</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl">
            20 key dynasty players and their current BMFFFL manager. Available players represent
            waiver wire or free agency targets with no current owner in the league.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="bg-[#0d1b2a] border-b border-[#2d4a66]">
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Player</th>
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Pos</th>
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Owned By</th>
                </tr>
              </thead>
              <tbody>
                {OWNERSHIP_MAP.map((entry, idx) => (
                  <tr
                    key={entry.player}
                    className={cn(
                      'border-b border-[#1e3347] last:border-0 transition-colors duration-100 hover:bg-white/[0.02]',
                      idx % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#0d1b2a]'
                    )}
                  >
                    <td className="px-4 py-3 font-semibold text-white">{entry.player}</td>
                    <td className="px-4 py-3">
                      <PosBadge position={entry.position} />
                    </td>
                    <td className="px-4 py-3">
                      {entry.owner ? (
                        <span className="text-slate-200 font-semibold">{entry.owner}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/15 border border-slate-500/30 text-slate-400 text-xs font-semibold">
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#2d4a66]" aria-hidden="true" />

        {/* ── Correlation Matrix ──────────────────────────────────────────── */}
        <section aria-label="Roster correlation matrix">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-black uppercase tracking-widest">
              <GitMerge className="w-3.5 h-3.5" aria-hidden="true" />
              Correlation Matrix
            </div>
            <h2 className="text-2xl font-black text-white">Similar Roster Pairings</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl">
            Teams with high overlap in core players tend to rise and fall together. Low-overlap teams
            make the best trade partners — they need what you have and vice versa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CORRELATIONS.map((pair) => (
              <div
                key={`${pair.teamA}-${pair.teamB}`}
                className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5 hover:border-[#ffd700]/25 transition-colors duration-150"
              >
                {/* Team pair header */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-white font-black text-sm">{pair.teamA}</span>
                  <span className="text-slate-600 text-xs">vs</span>
                  <span className="text-white font-black text-sm">{pair.teamB}</span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-white font-black text-xl tabular-nums">{pair.shared}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Shared</p>
                  </div>
                  <div className="flex-1" />
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border',
                      OVERLAP_COLORS[pair.level]
                    )}
                  >
                    {pair.level} Overlap
                  </span>
                </div>

                {/* Note */}
                <p className="text-slate-400 text-xs leading-relaxed">{pair.note}</p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-3">
            {(['Low', 'Medium', 'High'] as OverlapLevel[]).map((level) => (
              <div
                key={level}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold', OVERLAP_COLORS[level])}
              >
                {level} Overlap
                {level === 'Low' && <span className="text-slate-500 font-normal ml-1">— trade friendly</span>}
                {level === 'Medium' && <span className="text-slate-500 font-normal ml-1">— moderate correlation</span>}
                {level === 'High' && <span className="text-slate-500 font-normal ml-1">— correlated outcomes</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#2d4a66]" aria-hidden="true" />

        {/* ── Unique Assets ───────────────────────────────────────────────── */}
        <section aria-label="Unique assets per team">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-black uppercase tracking-widest">
              <Star className="w-3.5 h-3.5" aria-hidden="true" />
              Unique Assets
            </div>
            <h2 className="text-2xl font-black text-white">What Only You Own</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl">
            Every manager&rsquo;s signature player — the asset exclusively on their roster that no
            one else in BMFFFL can access. These are the irreplaceable pillars of each team.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {UNIQUE_ASSETS.map((asset) => (
              <div
                key={asset.manager}
                className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-4 hover:border-[#ffd700]/25 transition-colors duration-150"
              >
                {/* Manager name */}
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">
                  {asset.manager}
                </div>
                {/* Player */}
                <div className="flex items-center gap-2 mb-2">
                  <PosBadge position={asset.position} />
                  <span className="text-white font-black text-base">{asset.player}</span>
                </div>
                {/* Note */}
                <p className="text-slate-400 text-xs leading-relaxed">{asset.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Methodology note ────────────────────────────────────────────── */}
        <div className="border-t border-[#1e3347] pt-5 text-xs text-slate-600 leading-relaxed">
          <p>
            Ownership data reflects March 2026 dynasty rosters. Available players may be on the
            waiver wire or unsigned free agents. Correlation analysis is based on 20 tracked key
            players across all 12 BMFFFL rosters.
          </p>
        </div>

      </div>
    </>
  );
}
