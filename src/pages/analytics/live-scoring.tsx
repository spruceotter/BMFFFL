import Head from 'next/head';
import { Activity, Zap, Trophy, Users, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LivePlayer {
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  nflTeam: string;
  pts: number;
  status: 'final' | 'live' | 'upcoming';
}

interface MatchupTeam {
  manager: string;
  score: number;
  projectedFinal: number;
  livePlayers: number;
  winProb: number;
  players: LivePlayer[];
}

interface Matchup {
  id: number;
  home: MatchupTeam;
  away: MatchupTeam;
}

interface LeaderboardEntry {
  rank: number;
  manager: string;
  score: number;
  projected: number;
  record: string;
}

interface TopPerformer {
  player: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  nflTeam: string;
  manager: string;
  pts: number;
  status: 'final' | 'live' | 'upcoming';
}

// ─── Hardcoded mock data ───────────────────────────────────────────────────────

const MATCHUPS: Matchup[] = [
  {
    id: 1,
    home: {
      manager: 'mlschools12',
      score: 112.6,
      projectedFinal: 138.4,
      livePlayers: 2,
      winProb: 74,
      players: [
        { name: 'Lamar Jackson',   position: 'QB',  nflTeam: 'BAL', pts: 34.2, status: 'final' },
        { name: 'CeeDee Lamb',     position: 'WR',  nflTeam: 'DAL', pts: 21.4, status: 'live' },
        { name: 'Jahmyr Gibbs',    position: 'RB',  nflTeam: 'DET', pts: 18.8, status: 'final' },
        { name: 'Sam LaPorta',     position: 'TE',  nflTeam: 'DET', pts: 14.6, status: 'live' },
        { name: 'Davante Adams',   position: 'WR',  nflTeam: 'LV',  pts: 12.2, status: 'final' },
        { name: 'Isiah Pacheco',   position: 'RB',  nflTeam: 'KC',  pts: 11.4, status: 'final' },
      ],
    },
    away: {
      manager: 'tubes94',
      score: 87.4,
      projectedFinal: 108.2,
      livePlayers: 3,
      winProb: 26,
      players: [
        { name: 'Josh Allen',      position: 'QB',  nflTeam: 'BUF', pts: 28.6, status: 'final' },
        { name: 'Stefon Diggs',    position: 'WR',  nflTeam: 'NE',  pts: 8.4,  status: 'live' },
        { name: 'Austin Ekeler',   position: 'RB',  nflTeam: 'WSH', pts: 7.2,  status: 'live' },
        { name: 'Mark Andrews',    position: 'TE',  nflTeam: 'BAL', pts: 22.6, status: 'final' },
        { name: 'Christian Kirk',  position: 'WR',  nflTeam: 'JAX', pts: 12.4, status: 'live' },
        { name: 'Ezekiel Elliott', position: 'RB',  nflTeam: 'NE',  pts: 8.2,  status: 'final' },
      ],
    },
  },
  {
    id: 2,
    home: {
      manager: 'sexmachineandy',
      score: 104.8,
      projectedFinal: 129.6,
      livePlayers: 1,
      winProb: 62,
      players: [
        { name: 'Patrick Mahomes', position: 'QB',  nflTeam: 'KC',  pts: 31.4, status: 'final' },
        { name: 'Justin Jefferson', position: 'WR', nflTeam: 'MIN', pts: 24.2, status: 'final' },
        { name: 'Travis Kelce',    position: 'TE',  nflTeam: 'KC',  pts: 18.6, status: 'live' },
        { name: 'Breece Hall',     position: 'RB',  nflTeam: 'NYJ', pts: 16.4, status: 'final' },
        { name: 'Diontae Johnson', position: 'WR',  nflTeam: 'BAL', pts: 7.4,  status: 'final' },
        { name: 'Tony Pollard',    position: 'RB',  nflTeam: 'TEN', pts: 6.8,  status: 'final' },
      ],
    },
    away: {
      manager: 'cogdeill11',
      score: 96.2,
      projectedFinal: 118.8,
      livePlayers: 2,
      winProb: 38,
      players: [
        { name: 'Dak Prescott',    position: 'QB',  nflTeam: 'DAL', pts: 24.8, status: 'final' },
        { name: 'Tyreek Hill',     position: 'WR',  nflTeam: 'MIA', pts: 22.4, status: 'live' },
        { name: 'Derrick Henry',   position: 'RB',  nflTeam: 'TEN', pts: 14.6, status: 'final' },
        { name: 'Kyle Pitts',      position: 'TE',  nflTeam: 'ATL', pts: 12.2, status: 'live' },
        { name: 'Jaylen Waddle',   position: 'WR',  nflTeam: 'MIA', pts: 11.4, status: 'final' },
        { name: 'Miles Sanders',   position: 'RB',  nflTeam: 'CAR', pts: 10.8, status: 'final' },
      ],
    },
  },
  {
    id: 3,
    home: {
      manager: 'grandes',
      score: 98.6,
      projectedFinal: 122.4,
      livePlayers: 2,
      winProb: 55,
      players: [
        { name: 'Justin Herbert',  position: 'QB',  nflTeam: 'LAC', pts: 26.4, status: 'final' },
        { name: 'Davante Adams',   position: 'WR',  nflTeam: 'LV',  pts: 19.8, status: 'final' },
        { name: 'Nick Chubb',      position: 'RB',  nflTeam: 'CLE', pts: 17.6, status: 'live' },
        { name: 'Dalton Kincaid',  position: 'TE',  nflTeam: 'BUF', pts: 14.4, status: 'live' },
        { name: 'Tee Higgins',     position: 'WR',  nflTeam: 'CIN', pts: 12.2, status: 'final' },
        { name: 'AJ Dillon',       position: 'RB',  nflTeam: 'GB',  pts: 8.2,  status: 'final' },
      ],
    },
    away: {
      manager: 'juicybussy',
      score: 91.8,
      projectedFinal: 114.6,
      livePlayers: 3,
      winProb: 45,
      players: [
        { name: 'Jalen Hurts',     position: 'QB',  nflTeam: 'PHI', pts: 28.4, status: 'final' },
        { name: 'DeVonta Smith',   position: 'WR',  nflTeam: 'PHI', pts: 16.6, status: 'live' },
        { name: 'Saquon Barkley',  position: 'RB',  nflTeam: 'PHI', pts: 22.4, status: 'final' },
        { name: 'Dalton Schultz',  position: 'TE',  nflTeam: 'HOU', pts: 10.4, status: 'live' },
        { name: 'AJ Brown',        position: 'WR',  nflTeam: 'PHI', pts: 8.2,  status: 'live' },
        { name: 'Kareem Hunt',     position: 'RB',  nflTeam: 'CLE', pts: 5.8,  status: 'final' },
      ],
    },
  },
  {
    id: 4,
    home: {
      manager: 'tdtd19844',
      score: 78.4,
      projectedFinal: 101.2,
      livePlayers: 3,
      winProb: 42,
      players: [
        { name: 'Geno Smith',      position: 'QB',  nflTeam: 'SEA', pts: 18.4, status: 'final' },
        { name: 'DK Metcalf',      position: 'WR',  nflTeam: 'SEA', pts: 14.6, status: 'live' },
        { name: 'Rachaad White',   position: 'RB',  nflTeam: 'TB',  pts: 13.2, status: 'live' },
        { name: 'Evan Engram',     position: 'TE',  nflTeam: 'JAX', pts: 12.4, status: 'final' },
        { name: 'Ja\'Marr Chase',  position: 'WR',  nflTeam: 'CIN', pts: 11.8, status: 'final' },
        { name: 'Zack Moss',       position: 'RB',  nflTeam: 'IND', pts: 8.0,  status: 'live' },
      ],
    },
    away: {
      manager: 'eldridm20',
      score: 84.6,
      projectedFinal: 107.8,
      livePlayers: 2,
      winProb: 58,
      players: [
        { name: 'Jordan Love',     position: 'QB',  nflTeam: 'GB',  pts: 22.6, status: 'final' },
        { name: 'Romeo Doubs',     position: 'WR',  nflTeam: 'GB',  pts: 16.4, status: 'live' },
        { name: 'Rhamondre Stevenson', position: 'RB', nflTeam: 'NE', pts: 14.8, status: 'final' },
        { name: 'Cole Kmet',       position: 'TE',  nflTeam: 'CHI', pts: 12.4, status: 'live' },
        { name: 'Nico Collins',    position: 'WR',  nflTeam: 'HOU', pts: 10.2, status: 'final' },
        { name: 'Tyler Allgeier',  position: 'RB',  nflTeam: 'ATL', pts: 8.2,  status: 'final' },
      ],
    },
  },
  {
    id: 5,
    home: {
      manager: 'rbr',
      score: 89.2,
      projectedFinal: 112.6,
      livePlayers: 2,
      winProb: 48,
      players: [
        { name: 'Anthony Richardson', position: 'QB', nflTeam: 'IND', pts: 24.4, status: 'final' },
        { name: 'Michael Pittman Jr.', position: 'WR', nflTeam: 'IND', pts: 18.2, status: 'live' },
        { name: 'Jonathan Taylor', position: 'RB',  nflTeam: 'IND', pts: 14.6, status: 'final' },
        { name: 'David Njoku',     position: 'TE',  nflTeam: 'CLE', pts: 13.4, status: 'live' },
        { name: 'Josh Downs',      position: 'WR',  nflTeam: 'IND', pts: 10.4, status: 'final' },
        { name: 'Tyjae Spears',    position: 'RB',  nflTeam: 'TEN', pts: 8.2,  status: 'final' },
      ],
    },
    away: {
      manager: 'bro_set',
      score: 93.4,
      projectedFinal: 116.8,
      livePlayers: 2,
      winProb: 52,
      players: [
        { name: 'Trevor Lawrence', position: 'QB',  nflTeam: 'JAX', pts: 26.4, status: 'final' },
        { name: 'Christian Kirk',  position: 'WR',  nflTeam: 'JAX', pts: 14.8, status: 'live' },
        { name: 'Travis Etienne Jr.', position: 'RB', nflTeam: 'JAX', pts: 18.4, status: 'final' },
        { name: 'Evan Engram',     position: 'TE',  nflTeam: 'JAX', pts: 12.6, status: 'live' },
        { name: 'Zay Jones',       position: 'WR',  nflTeam: 'JAX', pts: 9.4,  status: 'final' },
        { name: 'D\'Andre Swift',  position: 'RB',  nflTeam: 'CHI', pts: 11.8, status: 'final' },
      ],
    },
  },
  {
    id: 6,
    home: {
      manager: 'cheeseandcrackers',
      score: 76.8,
      projectedFinal: 98.4,
      livePlayers: 4,
      winProb: 36,
      players: [
        { name: 'Sam Howell',      position: 'QB',  nflTeam: 'WSH', pts: 16.4, status: 'final' },
        { name: 'Terry McLaurin',  position: 'WR',  nflTeam: 'WSH', pts: 14.6, status: 'live' },
        { name: 'Brian Robinson Jr.', position: 'RB', nflTeam: 'WSH', pts: 12.4, status: 'live' },
        { name: 'Logan Thomas',    position: 'TE',  nflTeam: 'WSH', pts: 8.2,  status: 'live' },
        { name: 'Darnell Mooney',  position: 'WR',  nflTeam: 'CHI', pts: 11.4, status: 'final' },
        { name: 'Antonio Gibson',  position: 'RB',  nflTeam: 'WSH', pts: 13.8, status: 'live' },
      ],
    },
    away: {
      manager: 'jimmyeatwurld',
      score: 102.4,
      projectedFinal: 124.6,
      livePlayers: 1,
      winProb: 64,
      players: [
        { name: 'C.J. Stroud',     position: 'QB',  nflTeam: 'HOU', pts: 32.4, status: 'final' },
        { name: 'Tank Dell',       position: 'WR',  nflTeam: 'HOU', pts: 14.8, status: 'final' },
        { name: 'Joe Mixon',       position: 'RB',  nflTeam: 'HOU', pts: 18.6, status: 'final' },
        { name: 'Dalton Schultz',  position: 'TE',  nflTeam: 'HOU', pts: 16.4, status: 'live' },
        { name: 'Stefon Diggs',    position: 'WR',  nflTeam: 'NE',  pts: 11.2, status: 'final' },
        { name: 'Dameon Pierce',   position: 'RB',  nflTeam: 'HOU', pts: 9.0,  status: 'final' },
      ],
    },
  },
];

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1,  manager: 'mlschools12',      score: 112.6, projected: 138.4, record: '9-4' },
  { rank: 2,  manager: 'jimmyeatwurld',    score: 102.4, projected: 124.6, record: '7-6' },
  { rank: 3,  manager: 'sexmachineandy',   score: 104.8, projected: 129.6, record: '8-5' },
  { rank: 4,  manager: 'cogdeill11',       score: 96.2,  projected: 118.8, record: '6-7' },
  { rank: 5,  manager: 'grandes',          score: 98.6,  projected: 122.4, record: '7-6' },
  { rank: 6,  manager: 'bro_set',          score: 93.4,  projected: 116.8, record: '6-7' },
  { rank: 7,  manager: 'juicybussy',       score: 91.8,  projected: 114.6, record: '8-5' },
  { rank: 8,  manager: 'rbr',              score: 89.2,  projected: 112.6, record: '5-8' },
  { rank: 9,  manager: 'tubes94',          score: 87.4,  projected: 108.2, record: '7-6' },
  { rank: 10, manager: 'eldridm20',        score: 84.6,  projected: 107.8, record: '5-8' },
  { rank: 11, manager: 'tdtd19844',        score: 78.4,  projected: 101.2, record: '10-3' },
  { rank: 12, manager: 'cheeseandcrackers',score: 76.8,  projected: 98.4,  record: '4-9' },
];

const TOP_PERFORMERS: TopPerformer[] = [
  { player: 'Lamar Jackson',     position: 'QB', nflTeam: 'BAL', manager: 'mlschools12',    pts: 34.2, status: 'final' },
  { player: 'Patrick Mahomes',   position: 'QB', nflTeam: 'KC',  manager: 'sexmachineandy', pts: 31.4, status: 'final' },
  { player: 'C.J. Stroud',       position: 'QB', nflTeam: 'HOU', manager: 'jimmyeatwurld',  pts: 32.4, status: 'final' },
  { player: 'Josh Allen',        position: 'QB', nflTeam: 'BUF', manager: 'tubes94',        pts: 28.6, status: 'final' },
  { player: 'Jalen Hurts',       position: 'QB', nflTeam: 'PHI', manager: 'juicybussy',     pts: 28.4, status: 'final' },
  { player: 'CeeDee Lamb',       position: 'WR', nflTeam: 'DAL', manager: 'mlschools12',    pts: 21.4, status: 'live' },
  { player: 'Saquon Barkley',    position: 'RB', nflTeam: 'PHI', manager: 'juicybussy',     pts: 22.4, status: 'final' },
  { player: 'Justin Jefferson',  position: 'WR', nflTeam: 'MIN', manager: 'sexmachineandy', pts: 24.2, status: 'final' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const POSITION_COLORS: Record<string, string> = {
  QB:  'bg-red-500/20 text-red-400 border-red-500/30',
  RB:  'bg-green-500/20 text-green-400 border-green-500/30',
  WR:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  TE:  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  K:   'bg-purple-500/20 text-purple-400 border-purple-500/30',
  DEF: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

function PositionBadge({ position }: { position: string }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center w-8 text-center text-xs font-bold px-1 py-0.5 rounded border',
      POSITION_COLORS[position] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    )}>
      {position}
    </span>
  );
}

function StatusDot({ status }: { status: 'final' | 'live' | 'upcoming' }) {
  if (status === 'live') {
    return (
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
      </span>
    );
  }
  if (status === 'final') {
    return <span className="h-2 w-2 rounded-full bg-slate-500 shrink-0" />;
  }
  return <span className="h-2 w-2 rounded-full bg-slate-600 border border-slate-500 shrink-0" />;
}

function WinProbBar({ homeProb, homeName, awayName }: { homeProb: number; homeName: string; awayName: string }) {
  const awayProb = 100 - homeProb;
  const homeWinning = homeProb >= 50;
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{homeName}</span>
        <span className="text-slate-400 text-xs">Win Prob</span>
        <span>{awayName}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
        <div
          className={cn('h-full transition-all duration-500', homeWinning ? 'bg-green-500' : 'bg-red-500')}
          style={{ width: `${homeProb}%` }}
        />
        <div
          className={cn('h-full transition-all duration-500', !homeWinning ? 'bg-green-500' : 'bg-red-500')}
          style={{ width: `${awayProb}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-bold mt-1">
        <span className={homeWinning ? 'text-green-400' : 'text-red-400'}>{homeProb}%</span>
        <span className={!homeWinning ? 'text-green-400' : 'text-red-400'}>{awayProb}%</span>
      </div>
    </div>
  );
}

function TeamHalf({ team, side }: { team: MatchupTeam; side: 'home' | 'away' }) {
  const isRight = side === 'away';
  return (
    <div className={cn('flex-1 min-w-0', isRight && 'text-right')}>
      <p className={cn(
        'text-xs font-bold uppercase tracking-wider mb-0.5 truncate',
        'text-[#ffd700]'
      )}>
        {team.manager}
      </p>
      <p className="text-3xl font-black text-white tabular-nums leading-none">
        {team.score.toFixed(1)}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">
        Proj: <span className="text-slate-300">{team.projectedFinal.toFixed(1)}</span>
      </p>
      {team.livePlayers > 0 && (
        <div className={cn(
          'inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full',
          'bg-green-500/10 border border-green-500/20'
        )}>
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          <span className="text-xs text-green-400 font-medium">
            {team.livePlayers} live
          </span>
        </div>
      )}
    </div>
  );
}

function MatchupCard({ matchup }: { matchup: Matchup }) {
  const { home, away } = matchup;
  const homeLeading = home.score >= away.score;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-[#ffd700]/30 transition-colors duration-200">
      {/* Card header */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Matchup {matchup.id}
        </span>
        <span className={cn(
          'inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full',
          'bg-green-500/10 border border-green-500/20 text-green-400'
        )}>
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          In Progress
        </span>
      </div>

      {/* Score row */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start gap-4">
          <TeamHalf team={home} side="home" />
          <div className="flex flex-col items-center justify-center pt-1 shrink-0">
            <span className="text-slate-600 font-bold text-lg">vs</span>
            {homeLeading
              ? <span className="text-xs text-green-400 font-bold mt-0.5">▲ Home</span>
              : <span className="text-xs text-green-400 font-bold mt-0.5">▲ Away</span>
            }
          </div>
          <TeamHalf team={away} side="away" />
        </div>

        <WinProbBar
          homeProb={home.winProb}
          homeName={home.manager}
          awayName={away.manager}
        />
      </div>

      {/* Top players */}
      <div className="px-4 pb-4 mt-2 space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Key Players
        </p>
        {[...home.players, ...away.players]
          .sort((a, b) => b.pts - a.pts)
          .slice(0, 4)
          .map((p, i) => (
            <div key={`${p.name}-${i}`} className="flex items-center gap-2 text-xs">
              <StatusDot status={p.status} />
              <PositionBadge position={p.position} />
              <span className="text-slate-300 flex-1 truncate">{p.name}</span>
              <span className="text-[#ffd700] font-bold tabular-nums">{p.pts.toFixed(1)}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveScoringPage() {
  const sortedLeaderboard = [...LEADERBOARD].sort((a, b) => b.score - a.score).map((e, i) => ({ ...e, rank: i + 1 }));

  return (
    <>
      <Head>
        <title>Live Scoring — Week 14 | BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL Live Scoring — Week 14 in progress. All 6 matchups, real-time scores, win probability, and top performers."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="BMFFFL Live Scoring — Week 14" />
        <meta property="og:description" content="All 6 BMFFFL matchups in progress. Live scores, win probability, and top performers." />
      </Head>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Scoring</span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">BMFFFL Live Scoring</h1>
                {/* Pulsing live badge */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-sm font-bold text-red-400 uppercase tracking-wider">LIVE</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Week 14 &bull; In Progress &bull; NFL games in progress: <span className="text-white font-bold">3 of 16</span> remaining
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm">
              <Zap className="w-4 h-4 text-[#ffd700] shrink-0" />
              <span className="text-slate-300">
                <span className="text-white font-bold">6 matchups</span> active &bull; Last updated: <span className="text-[#ffd700] font-bold">just now</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Static disclaimer ───────────────────────────────────────────────── */}
      <div className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs text-blue-300">
              <span className="font-bold">Design preview.</span>{' '}
              This is a static mockup showing what live scoring would look like. Real-time data requires Sleeper API integration —
              see{' '}
              <a href="/resources/api-docs" className="underline hover:text-blue-200 transition-colors">
                /resources/api-docs
              </a>
              {' '}for setup instructions.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="bg-[#0d1b2a] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

            {/* ── Left: matchup grid (3-col on xl) ────────────────────────── */}
            <div className="xl:col-span-3 space-y-8">

              {/* Game window status */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '1 PM Games', count: '8 games', status: 'Final' as const, color: 'text-slate-500 bg-slate-800 border-slate-700' },
                  { label: '4 PM Games', count: '5 games', status: 'In Progress' as const, color: 'text-green-400 bg-green-500/10 border-green-500/30' },
                  { label: 'SNF',        count: '1 game',  status: 'Upcoming' as const,    color: 'text-slate-500 bg-slate-800 border-slate-700' },
                  { label: 'MNF',        count: '1 game',  status: 'Tomorrow' as const,    color: 'text-slate-500 bg-slate-800 border-slate-700' },
                  { label: 'TNF',        count: '1 game',  status: 'Thursday' as const,    color: 'text-slate-500 bg-slate-800 border-slate-700' },
                ].map(({ label, count, status, color }) => (
                  <div key={label} className={cn('px-3 py-2 rounded-lg border text-xs font-medium', color)}>
                    <span className="font-bold">{label}</span>
                    <span className="mx-1 opacity-50">·</span>
                    <span className="opacity-75">{count}</span>
                    <span className="mx-1 opacity-50">·</span>
                    <span>{status}</span>
                  </div>
                ))}
              </div>

              {/* 6 matchup cards */}
              <div>
                <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                  All Matchups — Week 14
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MATCHUPS.map((m) => (
                    <MatchupCard key={m.id} matchup={m} />
                  ))}
                </div>
              </div>

              {/* Top performers table */}
              <div>
                <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                  Top Performers — Week 14
                </h2>
                <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 bg-slate-900">
                          <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Player</th>
                          <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Pos</th>
                          <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Team</th>
                          <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Manager</th>
                          <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                          <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TOP_PERFORMERS.sort((a, b) => b.pts - a.pts).map((p, i) => (
                          <tr
                            key={`${p.player}-${i}`}
                            className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors duration-100"
                          >
                            <td className="py-3 px-4 text-white font-medium">{p.player}</td>
                            <td className="py-3 px-4">
                              <PositionBadge position={p.position} />
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-xs font-bold">{p.nflTeam}</td>
                            <td className="py-3 px-4 text-[#ffd700] text-xs font-medium">{p.manager}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <StatusDot status={p.status} />
                                <span className={cn(
                                  'text-xs capitalize',
                                  p.status === 'live' ? 'text-green-400' : 'text-slate-500'
                                )}>
                                  {p.status}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-[#ffd700] font-black tabular-nums text-base">
                                {p.pts.toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: sidebar ───────────────────────────────────────────── */}
            <div className="xl:col-span-1 space-y-6">

              {/* Live leaderboard */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                  <h3 className="text-sm font-black text-white">Live Leaderboard</h3>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {sortedLeaderboard.map((entry) => {
                    const isTop3 = entry.rank <= 3;
                    return (
                      <div
                        key={entry.manager}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/20 transition-colors duration-100',
                          isTop3 && 'bg-[#ffd700]/3'
                        )}
                      >
                        <span className={cn(
                          'text-xs font-black w-5 text-center shrink-0',
                          entry.rank === 1 && 'text-[#ffd700]',
                          entry.rank === 2 && 'text-slate-300',
                          entry.rank === 3 && 'text-amber-600',
                          entry.rank > 3 && 'text-slate-600',
                        )}>
                          {entry.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{entry.manager}</p>
                          <p className="text-xs text-slate-500">
                            {entry.record} &bull; proj <span className="text-slate-400">{entry.projected.toFixed(1)}</span>
                          </p>
                        </div>
                        <span className="text-sm font-black text-[#ffd700] tabular-nums shrink-0">
                          {entry.score.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connect to Sleeper CTA */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-[#ffd700]/20 rounded-xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                    <h3 className="text-sm font-black text-white">Connect to Sleeper</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    This page will show <span className="text-white font-bold">real live data</span> when connected to the Sleeper API.
                    Scores update automatically every 30 seconds during NFL game windows.
                  </p>
                  <ul className="space-y-1.5 mb-4">
                    {[
                      'Real-time score updates',
                      'Live player point tracking',
                      'Auto win probability calc',
                      'Push notification alerts',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-[#ffd700] font-bold shrink-0">→</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/resources/api-docs"
                    className={cn(
                      'block w-full text-center text-xs font-bold py-2 px-4 rounded-lg',
                      'bg-[#ffd700] text-[#0d1b2a] hover:bg-[#ffd700]/90 transition-colors duration-150'
                    )}
                  >
                    View API Setup Docs
                  </a>
                  <a
                    href="/analytics/sleeper-oauth"
                    className={cn(
                      'block w-full text-center text-xs font-medium py-2 px-4 rounded-lg mt-2',
                      'bg-transparent border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-colors duration-150'
                    )}
                  >
                    Sleeper OAuth
                  </a>
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-700">
                  <h3 className="text-sm font-black text-white">Week 14 Snapshot</h3>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {[
                    { label: 'Highest Score',   value: '112.6', sub: 'mlschools12' },
                    { label: 'Lowest Score',     value: '76.8',  sub: 'cheeseandcrackers' },
                    { label: 'Avg Score',        value: '92.8',  sub: 'league avg' },
                    { label: 'Total Live Pts',   value: '1,113.6', sub: '12 managers' },
                    { label: 'Players Live',     value: '22',    sub: 'still active' },
                    { label: 'Games Remaining',  value: '3 of 16', sub: 'NFL Week 14' },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5">
                      <div>
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="text-xs text-slate-400">{sub}</p>
                      </div>
                      <span className="text-sm font-black text-[#ffd700] tabular-nums">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
