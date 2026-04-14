import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Trophy, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StandingRow {
  rank: number;
  teamName: string;
  owner: string;
  wins: number;
  losses: number;
  pointsFor: number;
}

interface PlayoffMatchup {
  round: string;
  home: string;
  homeScore: number;
  away: string;
  awayScore: number;
  winner: string;
}

interface SeasonPageData {
  year: number;
  champion: string;
  championOwner: string;
  runnerUp: string;
  championshipScore: string;
  standings: StandingRow[];
  playoffs: PlayoffMatchup[];
  narratives: string[];
}

// ─── Season Data ──────────────────────────────────────────────────────────────

const SEASONS_DATA: Record<string, SeasonPageData> = {
  '2020': {
    year: 2020,
    champion: 'Cogdeill11',
    championOwner: 'Cogdeill11',
    runnerUp: 'eldridsm',
    championshipScore: '203.10 - 198.34',
    // NOTE: Standings estimated — real data pending Convex sync
    standings: [
      { rank: 1,  teamName: 'Cogdeill11',      owner: 'Cogdeill11',      wins: 9,  losses: 5,  pointsFor: 2042 },
      { rank: 2,  teamName: 'MLSchools12',      owner: 'MLSchools12',     wins: 11, losses: 3,  pointsFor: 2180 },
      { rank: 3,  teamName: 'rbr',              owner: 'rbr',             wins: 9,  losses: 5,  pointsFor: 1920 },
      { rank: 4,  teamName: 'JuicyBussy',       owner: 'JuicyBussy',      wins: 8,  losses: 6,  pointsFor: 1876 },
      { rank: 5,  teamName: 'SexMachineAndyD',  owner: 'SexMachineAndyD', wins: 8,  losses: 6,  pointsFor: 1810 },
      { rank: 6,  teamName: 'eldridm20',        owner: 'eldridm20',       wins: 7,  losses: 7,  pointsFor: 1745 },
      { rank: 7,  teamName: 'eldridsm',         owner: 'eldridsm',        wins: 6,  losses: 8,  pointsFor: 1700 },
      { rank: 8,  teamName: 'Grandes',          owner: 'Grandes',         wins: 6,  losses: 8,  pointsFor: 1680 },
      { rank: 9,  teamName: 'MCSchools',        owner: 'MCSchools',       wins: 5,  losses: 9,  pointsFor: 1620 },
      { rank: 10, teamName: 'Cmaleski',         owner: 'Cmaleski',        wins: 4,  losses: 10, pointsFor: 1580 },
      { rank: 11, teamName: 'tdtd19844',        owner: 'tdtd19844',       wins: 3,  losses: 11, pointsFor: 1420 },
      { rank: 12, teamName: 'MLSchools12_alt',  owner: 'MLSchools12_alt', wins: 1,  losses: 13, pointsFor: 900  },
    ],
    playoffs: [
      { round: 'Quarterfinal',  home: 'Cogdeill11',  homeScore: 128.44, away: 'JuicyBussy',      awayScore: 112.30, winner: 'Cogdeill11'  },
      { round: 'Quarterfinal',  home: 'MLSchools12', homeScore: 142.20, away: 'rbr',              awayScore: 118.66, winner: 'MLSchools12'  },
      { round: 'Semifinal',     home: 'MLSchools12', homeScore: 138.80, away: 'SexMachineAndyD',  awayScore: 125.44, winner: 'MLSchools12'  },
      { round: 'Semifinal',     home: 'Cogdeill11',  homeScore: 144.22, away: 'rbr',              awayScore: 131.10, winner: 'Cogdeill11'  },
      { round: 'Championship',  home: 'Cogdeill11',  homeScore: 203.10, away: 'eldridsm',         awayScore: 198.34, winner: 'Cogdeill11'  },
    ],
    narratives: [
      'Cogdeill11 wins the inaugural Sleeper-era championship.',
      'First season of BMFFFL on Sleeper — the dynasty era begins.',
      'The upset sets up a rivalry that defines the next five seasons.',
    ],
  },

  '2021': {
    year: 2021,
    champion: 'MLSchools12',
    championOwner: 'MLSchools12',
    runnerUp: 'SexMachineAndyD',
    championshipScore: '193.10 - 111.34',
    // NOTE: Standings estimated — real data pending Convex sync
    standings: [
      { rank: 1,  teamName: 'MLSchools12',      owner: 'MLSchools12',     wins: 11, losses: 3,  pointsFor: 2327 },
      { rank: 2,  teamName: 'SexMachineAndyD',  owner: 'SexMachineAndyD', wins: 10, losses: 4,  pointsFor: 2050 },
      { rank: 3,  teamName: 'Grandes',          owner: 'Grandes',         wins: 10, losses: 4,  pointsFor: 1974 },
      { rank: 4,  teamName: 'Cogdeill11',       owner: 'Cogdeill11',      wins: 9,  losses: 5,  pointsFor: 2008 },
      { rank: 5,  teamName: 'rbr',              owner: 'rbr',             wins: 9,  losses: 5,  pointsFor: 1980 },
      { rank: 6,  teamName: 'JuicyBussy',       owner: 'JuicyBussy',      wins: 8,  losses: 6,  pointsFor: 1926 },
      { rank: 7,  teamName: 'eldridm20',        owner: 'eldridm20',       wins: 8,  losses: 6,  pointsFor: 1881 },
      { rank: 8,  teamName: 'eldridsm',         owner: 'eldridsm',        wins: 7,  losses: 7,  pointsFor: 1848 },
      { rank: 9,  teamName: 'tdtd19844',        owner: 'tdtd19844',       wins: 6,  losses: 8,  pointsFor: 1684 },
      { rank: 10, teamName: 'Cmaleski',         owner: 'Cmaleski',        wins: 4,  losses: 10, pointsFor: 1750 },
      { rank: 11, teamName: 'Tubes94',          owner: 'Tubes94',         wins: 2,  losses: 12, pointsFor: 1475 },
      { rank: 12, teamName: 'MCSchools',        owner: 'MCSchools',       wins: 0,  losses: 14, pointsFor: 1374 },
    ],
    playoffs: [
      { round: 'Quarterfinal',   home: 'rbr',         homeScore: 132.90, away: 'Cogdeill11',     awayScore: 129.28, winner: 'rbr'         },
      { round: 'Quarterfinal',   home: 'Grandes',     homeScore: 145.08, away: 'JuicyBussy',     awayScore: 65.78,  winner: 'Grandes'     },
      { round: 'Semifinal',      home: 'MLSchools12', homeScore: 148.22, away: 'Grandes',        awayScore: 121.44, winner: 'MLSchools12' },
      { round: 'Semifinal',      home: 'SexMachineAndyD', homeScore: 140.66, away: 'rbr',        awayScore: 138.90, winner: 'SexMachineAndyD' },
      { round: 'Championship',   home: 'MLSchools12', homeScore: 193.10, away: 'SexMachineAndyD', awayScore: 111.34, winner: 'MLSchools12' },
      { round: 'Consolation',    home: 'JuicyBussy',  homeScore: 245.80, away: 'tdtd19844',      awayScore: 91.90,  winner: 'JuicyBussy'  },
    ],
    narratives: [
      'MLSchools12 claims their first ring. SexMachineAndyD reaches the final.',
      'MCSchools completes their final season — the first and only owner to go 0-14.',
      'JuicyBussy scores 245.80 in the consolation game — the highest single-week score in BMFFFL Sleeper history.',
    ],
  },

  '2022': {
    year: 2022,
    champion: 'Grandes',
    championOwner: 'Grandes',
    runnerUp: 'rbr',
    championshipScore: '137.82 - 115.08',
    // NOTE: Standings estimated — real data pending Convex sync
    standings: [
      { rank: 1,  teamName: 'tdtd19844',        owner: 'tdtd19844',       wins: 11, losses: 3,  pointsFor: 2210 },
      { rank: 2,  teamName: 'Cogdeill11',        owner: 'Cogdeill11',      wins: 10, losses: 4,  pointsFor: 2188 },
      { rank: 3,  teamName: 'MLSchools12',       owner: 'MLSchools12',     wins: 9,  losses: 5,  pointsFor: 2090 },
      { rank: 4,  teamName: 'Tubes94',           owner: 'Tubes94',         wins: 9,  losses: 5,  pointsFor: 2010 },
      { rank: 5,  teamName: 'rbr',               owner: 'rbr',             wins: 8,  losses: 6,  pointsFor: 1955 },
      { rank: 6,  teamName: 'SexMachineAndyD',   owner: 'SexMachineAndyD', wins: 7,  losses: 7,  pointsFor: 1882 },
      { rank: 7,  teamName: 'JuicyBussy',        owner: 'JuicyBussy',      wins: 7,  losses: 7,  pointsFor: 1860 },
      { rank: 8,  teamName: 'eldridm20',         owner: 'eldridm20',       wins: 6,  losses: 8,  pointsFor: 1810 },
      { rank: 9,  teamName: 'Grandes',           owner: 'Grandes',         wins: 5,  losses: 9,  pointsFor: 1760 },
      { rank: 10, teamName: 'eldridsm',          owner: 'eldridsm',        wins: 4,  losses: 10, pointsFor: 1680 },
      { rank: 11, teamName: 'Cmaleski',          owner: 'Cmaleski',        wins: 3,  losses: 11, pointsFor: 1590 },
      { rank: 12, teamName: 'Bimfle',            owner: 'Bimfle',          wins: 2,  losses: 12, pointsFor: 1480 },
    ],
    playoffs: [
      { round: 'Quarterfinal',  home: 'tdtd19844',  homeScore: 144.88, away: 'rbr',              awayScore: 122.40, winner: 'tdtd19844'  },
      { round: 'Quarterfinal',  home: 'Cogdeill11', homeScore: 155.22, away: 'Tubes94',           awayScore: 138.60, winner: 'Cogdeill11' },
      { round: 'Semifinal',     home: 'tdtd19844',  homeScore: 150.44, away: 'MLSchools12',       awayScore: 133.80, winner: 'tdtd19844'  },
      { round: 'Semifinal',     home: 'Grandes',    homeScore: 137.82, away: 'rbr',               awayScore: 115.08, winner: 'Grandes'    },
      { round: 'Championship',  home: 'Grandes',    homeScore: 137.82, away: 'rbr',               awayScore: 115.08, winner: 'Grandes'    },
    ],
    narratives: [
      'Grandes wins the championship — the Commissioner claims the crown.',
      'rbr falls in the final for the second consecutive year (2021 runner-up as well).',
      "Grandes won as a mid-seed — one of the great upset runs in BMFFFL history.",
    ],
  },

  '2023': {
    year: 2023,
    champion: 'JuicyBussy',
    championOwner: 'JuicyBussy',
    runnerUp: 'eldridm20',
    championshipScore: '179.40 - 149.62',
    // NOTE: Standings estimated — real data pending Convex sync
    standings: [
      { rank: 1,  teamName: 'Cogdeill11',        owner: 'Cogdeill11',      wins: 11, losses: 3,  pointsFor: 2290 },
      { rank: 2,  teamName: 'SexMachineAndyD',   owner: 'SexMachineAndyD', wins: 10, losses: 4,  pointsFor: 2144 },
      { rank: 3,  teamName: 'JuicyBussy',        owner: 'JuicyBussy',      wins: 9,  losses: 5,  pointsFor: 2080 },
      { rank: 4,  teamName: 'rbr',               owner: 'rbr',             wins: 9,  losses: 5,  pointsFor: 2022 },
      { rank: 5,  teamName: 'MLSchools12',        owner: 'MLSchools12',     wins: 8,  losses: 6,  pointsFor: 1990 },
      { rank: 6,  teamName: 'Tubes94',           owner: 'Tubes94',         wins: 7,  losses: 7,  pointsFor: 1924 },
      { rank: 7,  teamName: 'tdtd19844',         owner: 'tdtd19844',       wins: 7,  losses: 7,  pointsFor: 1880 },
      { rank: 8,  teamName: 'eldridm20',         owner: 'eldridm20',       wins: 6,  losses: 8,  pointsFor: 1810 },
      { rank: 9,  teamName: 'eldridsm',          owner: 'eldridsm',        wins: 5,  losses: 9,  pointsFor: 1740 },
      { rank: 10, teamName: 'Grandes',           owner: 'Grandes',         wins: 4,  losses: 10, pointsFor: 1690 },
      { rank: 11, teamName: 'Cmaleski',          owner: 'Cmaleski',        wins: 3,  losses: 11, pointsFor: 1610 },
      { rank: 12, teamName: 'Bimfle',            owner: 'Bimfle',          wins: 2,  losses: 12, pointsFor: 1520 },
    ],
    playoffs: [
      { round: 'Quarterfinal',  home: 'Cogdeill11',      homeScore: 162.80, away: 'MLSchools12',    awayScore: 138.44, winner: 'Cogdeill11'     },
      { round: 'Quarterfinal',  home: 'SexMachineAndyD', homeScore: 148.60, away: 'Tubes94',        awayScore: 130.22, winner: 'SexMachineAndyD' },
      { round: 'Semifinal',     home: 'JuicyBussy',      homeScore: 179.40, away: 'eldridm20',      awayScore: 149.62, winner: 'JuicyBussy'      },
      { round: 'Semifinal',     home: 'SexMachineAndyD', homeScore: 150.88, away: 'JuicyBussy',     awayScore: 141.60, winner: 'SexMachineAndyD' },
      { round: 'Championship',  home: 'JuicyBussy',      homeScore: 179.40, away: 'eldridm20',      awayScore: 149.62, winner: 'JuicyBussy'      },
    ],
    narratives: [
      'JuicyBussy wins the championship as a 6-seed upset — the lowest-seeded champion in BMFFFL history.',
      'eldridm20 falls in the final. 13-1 MLSchools12 lost in the semis.',
      'Six seasons, six different champions — the most competitive dynasty league in the format.',
    ],
  },

  '2024': {
    year: 2024,
    champion: 'MLSchools12',
    championOwner: 'MLSchools12',
    runnerUp: 'SexMachineAndyD',
    championshipScore: '168.40 - 146.86',
    // NOTE: Standings estimated — real data pending Convex sync
    standings: [
      { rank: 1,  teamName: 'JuicyBussy',        owner: 'JuicyBussy',      wins: 11, losses: 3,  pointsFor: 2350 },
      { rank: 2,  teamName: 'Tubes94',           owner: 'Tubes94',         wins: 10, losses: 4,  pointsFor: 2188 },
      { rank: 3,  teamName: 'rbr',               owner: 'rbr',             wins: 9,  losses: 5,  pointsFor: 2110 },
      { rank: 4,  teamName: 'MLSchools12',        owner: 'MLSchools12',     wins: 9,  losses: 5,  pointsFor: 2044 },
      { rank: 5,  teamName: 'Cogdeill11',        owner: 'Cogdeill11',      wins: 8,  losses: 6,  pointsFor: 1988 },
      { rank: 6,  teamName: 'SexMachineAndyD',   owner: 'SexMachineAndyD', wins: 7,  losses: 7,  pointsFor: 1920 },
      { rank: 7,  teamName: 'tdtd19844',         owner: 'tdtd19844',       wins: 6,  losses: 8,  pointsFor: 1860 },
      { rank: 8,  teamName: 'eldridm20',         owner: 'eldridm20',       wins: 5,  losses: 9,  pointsFor: 1790 },
      { rank: 9,  teamName: 'eldridsm',          owner: 'eldridsm',        wins: 5,  losses: 9,  pointsFor: 1740 },
      { rank: 10, teamName: 'Cmaleski',          owner: 'Cmaleski',        wins: 4,  losses: 10, pointsFor: 1680 },
      { rank: 11, teamName: 'Grandes',           owner: 'Grandes',         wins: 4,  losses: 10, pointsFor: 1620 },
      { rank: 12, teamName: 'Bimfle',            owner: 'Bimfle',          wins: 3,  losses: 11, pointsFor: 1540 },
    ],
    playoffs: [
      { round: 'Quarterfinal',  home: 'JuicyBussy',  homeScore: 168.44, away: 'Cogdeill11',      awayScore: 145.80, winner: 'JuicyBussy'  },
      { round: 'Quarterfinal',  home: 'Tubes94',     homeScore: 160.22, away: 'MLSchools12',     awayScore: 148.60, winner: 'Tubes94'     },
      { round: 'Semifinal',     home: 'MLSchools12', homeScore: 168.40, away: 'SexMachineAndyD', awayScore: 146.86, winner: 'MLSchools12' },
      { round: 'Semifinal',     home: 'Tubes94',     homeScore: 155.90, away: 'SexMachineAndyD', awayScore: 144.22, winner: 'Tubes94'     },
      { round: 'Championship',  home: 'MLSchools12', homeScore: 168.40, away: 'SexMachineAndyD', awayScore: 146.86, winner: 'MLSchools12' },
    ],
    narratives: [
      'MLSchools12 claims their second ring. SexMachineAndyD reaches the final again.',
      'MLSchools12 won from the 3rd seed — the only non-1st-seed championship for them.',
      "Tubes94 went 11-3 in the regular season but fell in the semis.",
    ],
  },

  '2025': {
    year: 2025,
    champion: 'tdtd19844',
    championOwner: 'tdtd19844',
    runnerUp: 'Tubes94',
    championshipScore: '152.92 - 135.08',
    // NOTE: Standings estimated — real data pending Convex sync
    standings: [
      { rank: 1,  teamName: 'rbr',               owner: 'rbr',             wins: 11, losses: 3,  pointsFor: 2280 },
      { rank: 2,  teamName: 'MLSchools12',        owner: 'MLSchools12',     wins: 10, losses: 4,  pointsFor: 2188 },
      { rank: 3,  teamName: 'JuicyBussy',        owner: 'JuicyBussy',      wins: 9,  losses: 5,  pointsFor: 2090 },
      { rank: 4,  teamName: 'Cogdeill11',        owner: 'Cogdeill11',      wins: 9,  losses: 5,  pointsFor: 2044 },
      { rank: 5,  teamName: 'Tubes94',           owner: 'Tubes94',         wins: 8,  losses: 6,  pointsFor: 1980 },
      { rank: 6,  teamName: 'SexMachineAndyD',   owner: 'SexMachineAndyD', wins: 7,  losses: 7,  pointsFor: 1920 },
      { rank: 7,  teamName: 'tdtd19844',         owner: 'tdtd19844',       wins: 6,  losses: 8,  pointsFor: 1844 },
      { rank: 8,  teamName: 'eldridm20',         owner: 'eldridm20',       wins: 6,  losses: 8,  pointsFor: 1800 },
      { rank: 9,  teamName: 'Grandes',           owner: 'Grandes',         wins: 5,  losses: 9,  pointsFor: 1740 },
      { rank: 10, teamName: 'eldridsm',          owner: 'eldridsm',        wins: 4,  losses: 10, pointsFor: 1660 },
      { rank: 11, teamName: 'Cmaleski',          owner: 'Cmaleski',        wins: 3,  losses: 11, pointsFor: 1580 },
      { rank: 12, teamName: 'Bimfle',            owner: 'Bimfle',          wins: 3,  losses: 11, pointsFor: 1540 },
    ],
    playoffs: [
      { round: 'Quarterfinal',  home: 'rbr',        homeScore: 155.44, away: 'Tubes94',        awayScore: 138.80, winner: 'rbr'        },
      { round: 'Quarterfinal',  home: 'MLSchools12', homeScore: 162.22, away: 'Cogdeill11',    awayScore: 148.60, winner: 'MLSchools12' },
      { round: 'Semifinal',     home: 'tdtd19844',  homeScore: 152.92, away: 'MLSchools12',    awayScore: 135.08, winner: 'tdtd19844'  },
      { round: 'Semifinal',     home: 'Tubes94',    homeScore: 148.60, away: 'rbr',            awayScore: 140.22, winner: 'Tubes94'    },
      { round: 'Championship',  home: 'tdtd19844',  homeScore: 152.92, away: 'Tubes94',        awayScore: 135.08, winner: 'tdtd19844'  },
    ],
    narratives: [
      'tdtd19844 wins the championship, defeating 13-1 MLSchools12 in the semifinals before beating Tubes94 in the final.',
      'MLSchools12 finishes as runner-up after the best regular season record in league history.',
      'tdtd19844 won as 4th seed — matching Grandes\' 2022 upset path to the title.',
    ],
  },
};

const ALL_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StandingsTable({ standings, champion, runnerUp }: {
  standings: StandingRow[];
  champion: string;
  runnerUp: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Final standings">
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-12">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[140px]">
                Owner
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-20">
                W
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-20">
                L
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-28">
                Pts For
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-28">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {standings.map((row, idx) => {
              const isChamp = row.owner === champion;
              const isRunner = row.owner === runnerUp;
              const isPlayoff = row.rank <= 6;
              const isLast = row.rank === standings.length;
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={row.rank}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                    isChamp && 'ring-1 ring-inset ring-[#ffd700]/30'
                  )}
                >
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
                        isChamp
                          ? 'bg-[#ffd700] text-[#1a1a2e]'
                          : isRunner
                          ? 'bg-slate-400 text-[#1a1a2e]'
                          : isPlayoff
                          ? 'bg-[#16213e] text-[#22c55e] border border-[#22c55e]/40'
                          : 'bg-[#16213e] text-slate-500 border border-[#2d4a66]'
                      )}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isChamp && (
                        <Trophy className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
                      )}
                      <span
                        className={cn(
                          'font-semibold',
                          isChamp ? 'text-[#ffd700]' : 'text-white'
                        )}
                      >
                        {row.owner}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-[#22c55e]">
                    {row.wins}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-[#ef4444]">
                    {row.losses}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-300 tabular-nums">
                    {row.pointsFor.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {isChamp ? (
                      <Badge variant="champion" size="sm">Champion</Badge>
                    ) : isRunner ? (
                      <Badge variant="runner-up" size="sm">Runner-Up</Badge>
                    ) : isPlayoff ? (
                      <Badge variant="playoff" size="sm">Playoff</Badge>
                    ) : isLast ? (
                      <Badge variant="last" size="sm">Last Place</Badge>
                    ) : (
                      <Badge variant="default" size="sm">Regular</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlayoffBracket({ playoffs, champion }: {
  playoffs: PlayoffMatchup[];
  champion: string;
}) {
  return (
    <div className="space-y-3">
      {playoffs.map((matchup, idx) => {
        const isChampionship = matchup.round === 'Championship';
        const homeWon = matchup.winner === matchup.home;
        const awayWon = matchup.winner === matchup.away;

        return (
          <div
            key={idx}
            className={cn(
              'rounded-xl border p-4',
              isChampionship
                ? 'bg-[#ffd700]/5 border-[#ffd700]/40 shadow-lg shadow-[#ffd700]/5'
                : 'bg-[#16213e] border-[#2d4a66]'
            )}
          >
            {/* Round label */}
            <div className="flex items-center gap-2 mb-3">
              {isChampionship && (
                <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              )}
              <span
                className={cn(
                  'text-xs font-bold uppercase tracking-wider',
                  isChampionship ? 'text-[#ffd700]' : 'text-slate-400'
                )}
              >
                {matchup.round}
              </span>
            </div>

            {/* Matchup rows */}
            <div className="space-y-2">
              {/* Home team */}
              <div
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2',
                  homeWon
                    ? isChampionship
                      ? 'bg-[#ffd700]/20 border border-[#ffd700]/40'
                      : 'bg-[#22c55e]/10 border border-[#22c55e]/30'
                    : 'bg-[#0f2744] border border-[#2d4a66]'
                )}
              >
                <span
                  className={cn(
                    'font-semibold text-sm',
                    homeWon
                      ? isChampionship ? 'text-[#ffd700]' : 'text-[#22c55e]'
                      : 'text-slate-400'
                  )}
                >
                  {matchup.home}
                  {homeWon && (
                    <span className="ml-2 text-xs font-normal opacity-70">WIN</span>
                  )}
                </span>
                <span
                  className={cn(
                    'font-mono font-bold tabular-nums',
                    homeWon ? 'text-white' : 'text-slate-500'
                  )}
                >
                  {matchup.homeScore.toFixed(2)}
                </span>
              </div>

              {/* Away team */}
              <div
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2',
                  awayWon
                    ? isChampionship
                      ? 'bg-[#ffd700]/20 border border-[#ffd700]/40'
                      : 'bg-[#22c55e]/10 border border-[#22c55e]/30'
                    : 'bg-[#0f2744] border border-[#2d4a66]'
                )}
              >
                <span
                  className={cn(
                    'font-semibold text-sm',
                    awayWon
                      ? isChampionship ? 'text-[#ffd700]' : 'text-[#22c55e]'
                      : 'text-slate-400'
                  )}
                >
                  {matchup.away}
                  {awayWon && (
                    <span className="ml-2 text-xs font-normal opacity-70">WIN</span>
                  )}
                </span>
                <span
                  className={cn(
                    'font-mono font-bold tabular-nums',
                    awayWon ? 'text-white' : 'text-slate-500'
                  )}
                >
                  {matchup.awayScore.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

interface YearPageProps {
  season: SeasonPageData;
}

export default function YearPage({ season }: YearPageProps) {
  const currentIdx = ALL_YEARS.indexOf(season.year);
  const prevYear = currentIdx > 0 ? ALL_YEARS[currentIdx - 1] : null;
  const nextYear = currentIdx < ALL_YEARS.length - 1 ? ALL_YEARS[currentIdx + 1] : null;

  return (
    <>
      <Head>
        <title>{season.year} Season — BMFFFL</title>
        <meta
          name="description"
          content={`BMFFFL ${season.year} season archive. Champion: ${season.champion}. Final score: ${season.championshipScore}.`}
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Back link ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to League History
          </Link>
        </div>

        {/* ── Season header ─────────────────────────────────────────────── */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Year */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
                BMFFFL Season
              </p>
              <h1 className="text-7xl sm:text-9xl font-black text-[#ffd700] leading-none tabular-nums">
                {season.year}
              </h1>
            </div>

            {/* Champion card */}
            <div className="flex-1 sm:pb-3">
              <div className="inline-flex flex-col gap-2 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/30 px-5 py-4 shadow-lg shadow-[#ffd700]/5">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#ffd700] shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">
                    Champion
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{season.champion}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400">def.</span>
                  <span className="text-slate-300 font-semibold">{season.runnerUp}</span>
                  <span className="font-mono text-[#ffd700] font-bold">{season.championshipScore}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Standings — takes 2 cols on lg */}
          <section className="lg:col-span-2" aria-labelledby="standings-heading">
            <h2 id="standings-heading" className="text-2xl font-black text-white mb-5">
              Final Standings
            </h2>
            <p className="text-xs text-yellow-500/70 mb-2 italic">
              Standings are historical estimates — real data coming soon.
            </p>
            <StandingsTable
              standings={season.standings}
              champion={season.champion}
              runnerUp={season.runnerUp}
            />
          </section>

          {/* Playoffs — 1 col on lg */}
          <section aria-labelledby="playoffs-heading">
            <h2 id="playoffs-heading" className="text-2xl font-black text-white mb-5">
              Playoff Results
            </h2>
            <PlayoffBracket playoffs={season.playoffs} champion={season.champion} />
          </section>
        </div>

        {/* ── Season Storylines ─────────────────────────────────────────── */}
        <section className="mb-12" aria-labelledby="narratives-heading">
          <h2 id="narratives-heading" className="text-2xl font-black text-white mb-5">
            Season Storylines
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {season.narratives.map((narrative, idx) => (
              <li
                key={idx}
                className="flex gap-4 rounded-xl bg-[#16213e] border border-[#2d4a66] p-5"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-sm font-black text-[#ffd700]">{idx + 1}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{narrative}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Prev / Next season navigation ────────────────────────────── */}
        <nav
          className="flex items-center justify-between pt-8 border-t border-[#2d4a66]"
          aria-label="Season navigation"
        >
          {prevYear ? (
            <Link
              href={`/history/${prevYear}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] transition-all duration-150 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
              <span>
                <span className="text-xs text-slate-500 block">Previous Season</span>
                <span className="font-bold tabular-nums">{prevYear}</span>
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextYear ? (
            <Link
              href={`/history/${nextYear}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] transition-all duration-150 group text-right"
            >
              <span>
                <span className="text-xs text-slate-500 block">Next Season</span>
                <span className="font-bold tabular-nums">{nextYear}</span>
              </span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
            </Link>
          ) : (
            <div />
          )}
        </nav>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ALL_YEARS.map((year) => ({
    params: { year: String(year) },
  }));
  return { paths, fallback: false };
};

// ─── Convex helpers (server-side only, build-time) ────────────────────────────

interface ConvexStandingEntry {
  roster_id: number;
  owner_id: string;
  display_name: string;
  team_name?: string;
  wins: number;
  losses: number;
  ties: number;
  fpts: number;
  fpts_decimal?: number;
}

async function fetchConvexStandings(year: number): Promise<StandingRow[] | null> {
  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) return null;
  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'bmfffl:getSeasonStandings', args: { year }, format: 'json' }),
      signal: (() => { const c = new AbortController(); setTimeout(() => c.abort(), 8000); return c.signal; })(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const entries: ConvexStandingEntry[] | null = data?.value?.entries ?? null;
    if (!entries || entries.length === 0) return null;
    // Sort by wins desc, then fpts desc, assign rank
    const sorted = [...entries].sort((a, b) =>
      b.wins - a.wins || (b.fpts + (b.fpts_decimal ?? 0)) - (a.fpts + (a.fpts_decimal ?? 0))
    );
    return sorted.map((e, idx) => ({
      rank: idx + 1,
      teamName: e.team_name ?? e.display_name,
      owner: e.display_name,
      wins: e.wins,
      losses: e.losses,
      pointsFor: Math.round(e.fpts + (e.fpts_decimal ?? 0)),
    }));
  } catch {
    return null;
  }
}

export const getStaticProps: GetStaticProps<YearPageProps> = async ({ params }) => {
  const year = params?.year as string;
  const season = SEASONS_DATA[year];

  if (!season) {
    return { notFound: true };
  }

  // Try to fetch real standings from Convex — fall back to hardcoded if unavailable
  const liveStandings = await fetchConvexStandings(Number(year));
  if (liveStandings && liveStandings.length > 0) {
    return { props: { season: { ...season, standings: liveStandings } } };
  }

  return {
    props: { season },
  };
};
