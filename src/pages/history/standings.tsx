import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AllTimeOwner {
  slug: string;
  displayName: string;
  currentTeamName: string;
  wins: number;
  losses: number;
  winPct: number;
  championships: number[];
  runnerUps: number[];
  playoffAppearances: number;
  joinedYear?: number;
}

interface SeasonEntry {
  rank: number;
  ownerSlug: string;
  displayName: string;
  teamName: string;
  record: string;
  wins: number;
  losses: number;
  pointsFor: number;
  playoffResult: string;
  seed: number | null;
}

type SortKey = 'winPct' | 'wins' | 'championships' | 'playoffAppearances' | 'displayName';
type SortDir = 'asc' | 'desc';

// ─── All-Time Data ────────────────────────────────────────────────────────────

const ALL_TIME: AllTimeOwner[] = [
  {
    slug: 'mlschools12',
    displayName: 'MLSchools12',
    currentTeamName: 'Schoolcraft Football Team',
    wins: 68,
    losses: 15,
    winPct: 0.820,
    championships: [2021, 2024, 2025],
    runnerUps: [],
    playoffAppearances: 6,
  },
  {
    slug: 'sexmachineandy',
    displayName: 'SexMachineAndyD',
    currentTeamName: 'SexMachineAndyD',
    wins: 50,
    losses: 33,
    winPct: 0.603,
    championships: [],
    runnerUps: [2024],
    playoffAppearances: 4,
  },
  {
    slug: 'juicybussy',
    displayName: 'JuicyBussy',
    currentTeamName: 'Juicy Bussy',
    wins: 46,
    losses: 37,
    winPct: 0.554,
    championships: [2023],
    runnerUps: [],
    playoffAppearances: 5,
  },
  {
    slug: 'rbr',
    displayName: 'rbr',
    currentTeamName: 'Really Big Rings',
    wins: 44,
    losses: 39,
    winPct: 0.530,
    championships: [],
    runnerUps: [2021, 2022],
    playoffAppearances: 4,
  },
  {
    slug: 'grandes',
    displayName: 'Grandes',
    currentTeamName: 'El Rioux Grandes',
    wins: 42,
    losses: 41,
    winPct: 0.506,
    championships: [2022],
    runnerUps: [],
    playoffAppearances: 3,
  },
  {
    slug: 'eldridsm',
    displayName: 'eldridsm',
    currentTeamName: '(no name 2025)',
    wins: 41,
    losses: 42,
    winPct: 0.494,
    championships: [],
    runnerUps: [2020],
    playoffAppearances: 3,
  },
  {
    slug: 'tubes94',
    displayName: 'Tubes94',
    currentTeamName: 'Whale Tails',
    wins: 34,
    losses: 36,
    winPct: 0.486,
    championships: [],
    runnerUps: [2025],
    playoffAppearances: 2,
    joinedYear: 2021,
  },
  {
    slug: 'eldridm20',
    displayName: 'eldridm20',
    currentTeamName: 'Franks Little Beauties',
    wins: 39,
    losses: 44,
    winPct: 0.470,
    championships: [],
    runnerUps: [2023],
    playoffAppearances: 3,
  },
  {
    slug: 'cogdeill11',
    displayName: 'Cogdeill11',
    currentTeamName: 'Cogdeill11',
    wins: 38,
    losses: 45,
    winPct: 0.458,
    championships: [2020],
    runnerUps: [],
    playoffAppearances: 2,
  },
  {
    slug: 'cmaleski',
    displayName: 'Cmaleski',
    currentTeamName: 'Showtyme Boyz',
    wins: 36,
    losses: 47,
    winPct: 0.434,
    championships: [],
    runnerUps: [],
    playoffAppearances: 2,
  },
  {
    slug: 'tdtd19844',
    displayName: 'tdtd19844',
    currentTeamName: 'THE Shameful Saggy sack',
    wins: 36,
    losses: 47,
    winPct: 0.434,
    championships: [],
    runnerUps: [],
    playoffAppearances: 3,
  },
  {
    slug: 'escuelas',
    displayName: 'Escuelas',
    currentTeamName: 'Booty Cheeks',
    wins: 15,
    losses: 41,
    winPct: 0.268,
    championships: [],
    runnerUps: [],
    playoffAppearances: 0,
    joinedYear: 2022,
  },
];

// ─── Season Standings Data ────────────────────────────────────────────────────

const SEASON_STANDINGS: Record<number, SeasonEntry[]> = {
  2020: [
    { rank: 1,  ownerSlug: 'mlschools12',   displayName: 'MLSchools12',     teamName: 'The Murder Boners',    record: '11-2', wins: 11, losses: 2,  pointsFor: 2115.74, playoffResult: 'Lost semis',     seed: 1    },
    { rank: 2,  ownerSlug: 'cogdeill11',    displayName: 'Cogdeill11',      teamName: 'Cogdeill11',           record: '10-3', wins: 10, losses: 3,  pointsFor: 1914.48, playoffResult: 'CHAMPION',       seed: 2    },
    { rank: 3,  ownerSlug: 'sexmachineandy',displayName: 'SexMachineAndyD', teamName: 'Herbert\'s Heros',     record: '9-4',  wins: 9,  losses: 4,  pointsFor: 1930.78, playoffResult: 'Lost wild card',  seed: 3    },
    { rank: 4,  ownerSlug: 'eldridsm',      displayName: 'eldridsm',        teamName: 'eldridsm',             record: '8-5',  wins: 8,  losses: 5,  pointsFor: 1819.42, playoffResult: 'Runner-up',       seed: 4    },
    { rank: 5,  ownerSlug: 'rbr',           displayName: 'rbr',             teamName: 'Really Big Rings',     record: '6-7',  wins: 6,  losses: 7,  pointsFor: 1887.44, playoffResult: 'Lost round 1',    seed: 5    },
    { rank: 6,  ownerSlug: 'tdtd19844',     displayName: 'tdtd19844',       teamName: 'THE Shameful Saggy sack', record: '6-7', wins: 6, losses: 7, pointsFor: 1818.28, playoffResult: 'Lost semis',     seed: 6    },
    { rank: 7,  ownerSlug: 'cmaleski',      displayName: 'Cmaleski',        teamName: 'Showtyme Boyz',        record: '6-7',  wins: 6,  losses: 7,  pointsFor: 1598.98, playoffResult: 'Missed playoffs', seed: null },
    { rank: 8,  ownerSlug: 'juicybussy',    displayName: 'JuicyBussy',      teamName: 'Juicy Bussy',          record: '5-8',  wins: 5,  losses: 8,  pointsFor: 1783.40, playoffResult: 'Missed playoffs', seed: null },
    { rank: 9,  ownerSlug: 'grandes',       displayName: 'Grandes',         teamName: 'El Rioux Grandes',     record: '4-9',  wins: 4,  losses: 9,  pointsFor: 1697.70, playoffResult: 'Missed playoffs', seed: null },
    { rank: 10, ownerSlug: 'eldridm20',     displayName: 'eldridm20',       teamName: 'Franks Little Beauties',record: '4-9', wins: 4,  losses: 9,  pointsFor: 1625.74, playoffResult: 'Missed playoffs', seed: null },
  ],
  2021: [
    { rank: 1,  ownerSlug: 'mlschools12',   displayName: 'MLSchools12',     teamName: 'The Murder Boners',    record: '11-3', wins: 11, losses: 3,  pointsFor: 2327.06, playoffResult: 'CHAMPION',        seed: 1    },
    { rank: 2,  ownerSlug: 'sexmachineandy',displayName: 'SexMachineAndyD', teamName: 'SexMachineAndyD',      record: '10-4', wins: 10, losses: 4,  pointsFor: 2050.50, playoffResult: 'Lost semis',      seed: 2    },
    { rank: 3,  ownerSlug: 'grandes',       displayName: 'Grandes',         teamName: 'El Rioux Grandes',     record: '10-4', wins: 10, losses: 4,  pointsFor: 1974.92, playoffResult: 'Lost round 1',    seed: 3    },
    { rank: 4,  ownerSlug: 'cogdeill11',    displayName: 'Cogdeill11',      teamName: 'Cogdeill11',           record: '9-5',  wins: 9,  losses: 5,  pointsFor: 2008.02, playoffResult: 'Lost round 1',    seed: 4    },
    { rank: 5,  ownerSlug: 'rbr',           displayName: 'rbr',             teamName: 'Really Big Rings',     record: '9-5',  wins: 9,  losses: 5,  pointsFor: 1980.00, playoffResult: 'Runner-up',        seed: 5    },
    { rank: 6,  ownerSlug: 'juicybussy',    displayName: 'JuicyBussy',      teamName: 'Juicy Bussy',          record: '8-6',  wins: 8,  losses: 6,  pointsFor: 1926.12, playoffResult: 'Lost round 1',    seed: 6    },
    { rank: 7,  ownerSlug: 'eldridm20',     displayName: 'eldridm20',       teamName: 'Franks Little Beauties',record: '8-6', wins: 8,  losses: 6,  pointsFor: 1881.10, playoffResult: 'Consolation',     seed: null },
    { rank: 8,  ownerSlug: 'eldridsm',      displayName: 'eldridsm',        teamName: 'eldridsm',             record: '7-7',  wins: 7,  losses: 7,  pointsFor: 1848.60, playoffResult: 'Missed playoffs', seed: null },
    { rank: 9,  ownerSlug: 'tdtd19844',     displayName: 'tdtd19844',       teamName: 'THE Shameful Saggy sack', record: '6-8', wins: 6, losses: 8, pointsFor: 1684.74, playoffResult: 'Missed playoffs', seed: null },
    { rank: 10, ownerSlug: 'cmaleski',      displayName: 'Cmaleski',        teamName: 'Showtyme Boyz',        record: '4-10', wins: 4,  losses: 10, pointsFor: 1750.04, playoffResult: 'Missed playoffs', seed: null },
    { rank: 11, ownerSlug: 'tubes94',       displayName: 'Tubes94',         teamName: "Swamp Donkey's",       record: '2-12', wins: 2,  losses: 12, pointsFor: 1475.72, playoffResult: 'Missed playoffs', seed: null },
  ],
  2022: [
    { rank: 1,  ownerSlug: 'mlschools12',   displayName: 'MLSchools12',     teamName: 'The Murder Boners',    record: '10-4', wins: 10, losses: 4,  pointsFor: 2260.28, playoffResult: 'Lost semis',      seed: 1    },
    { rank: 2,  ownerSlug: 'juicybussy',    displayName: 'JuicyBussy',      teamName: 'Juicy Bussy',          record: '10-4', wins: 10, losses: 4,  pointsFor: 2105.18, playoffResult: 'Lost semis',      seed: 2    },
    { rank: 3,  ownerSlug: 'rbr',           displayName: 'rbr',             teamName: 'Really Big Rings',     record: '10-4', wins: 10, losses: 4,  pointsFor: 2082.38, playoffResult: 'Runner-up',        seed: 3    },
    { rank: 4,  ownerSlug: 'grandes',       displayName: 'Grandes',         teamName: 'El Rioux Grandes',     record: '8-6',  wins: 8,  losses: 6,  pointsFor: 2024.32, playoffResult: 'CHAMPION',        seed: 4    },
    { rank: 5,  ownerSlug: 'eldridsm',      displayName: 'eldridsm',        teamName: 'eldridsm',             record: '8-6',  wins: 8,  losses: 6,  pointsFor: 1936.96, playoffResult: 'Lost wild card',  seed: 5    },
    { rank: 6,  ownerSlug: 'eldridm20',     displayName: 'eldridm20',       teamName: 'Franks Little Beauties',record: '7-7', wins: 7,  losses: 7,  pointsFor: 1739.20, playoffResult: 'Lost wild card',  seed: 6    },
    { rank: 7,  ownerSlug: 'cogdeill11',    displayName: 'Cogdeill11',      teamName: 'Cogdeill11',           record: '7-7',  wins: 7,  losses: 7,  pointsFor: 1663.66, playoffResult: 'Missed playoffs', seed: null },
    { rank: 8,  ownerSlug: 'cmaleski',      displayName: 'Cmaleski',        teamName: 'Showtyme Boyz',        record: '7-7',  wins: 7,  losses: 7,  pointsFor: 1688.56, playoffResult: 'Missed playoffs', seed: null },
    { rank: 9,  ownerSlug: 'sexmachineandy',displayName: 'SexMachineAndyD', teamName: 'SexMachineAndyD',      record: '6-8',  wins: 6,  losses: 8,  pointsFor: 1807.84, playoffResult: 'Missed playoffs', seed: null },
    { rank: 10, ownerSlug: 'escuelas',      displayName: 'Escuelas',        teamName: "Grindin Gere's",       record: '4-10', wins: 4,  losses: 10, pointsFor: 1480.90, playoffResult: 'Missed playoffs', seed: null },
    { rank: 11, ownerSlug: 'tubes94',       displayName: 'Tubes94',         teamName: 'Burn it all',          record: '4-10', wins: 4,  losses: 10, pointsFor: 1340.28, playoffResult: 'Missed playoffs', seed: null },
    { rank: 12, ownerSlug: 'tdtd19844',     displayName: 'tdtd19844',       teamName: 'THE Shameful Saggy sack', record: '3-11', wins: 3, losses: 11, pointsFor: 1529.58, playoffResult: 'Last place',   seed: null },
  ],
  2023: [
    { rank: 1,  ownerSlug: 'mlschools12',   displayName: 'MLSchools12',     teamName: 'The Murder Boners',    record: '13-1', wins: 13, losses: 1,  pointsFor: 2201.02, playoffResult: 'Lost semis',      seed: 1    },
    { rank: 2,  ownerSlug: 'grandes',       displayName: 'Grandes',         teamName: 'El Rioux Grandes',     record: '9-5',  wins: 9,  losses: 5,  pointsFor: 2134.06, playoffResult: 'Lost semis',      seed: 2    },
    { rank: 3,  ownerSlug: 'eldridsm',      displayName: 'eldridsm',        teamName: 'eldridsm',             record: '9-5',  wins: 9,  losses: 5,  pointsFor: 1995.28, playoffResult: 'Lost wild card',  seed: 3    },
    { rank: 4,  ownerSlug: 'cmaleski',      displayName: 'Cmaleski',        teamName: 'Showtyme Boyz',        record: '9-5',  wins: 9,  losses: 5,  pointsFor: 1958.66, playoffResult: 'Lost round 1',    seed: 4    },
    { rank: 5,  ownerSlug: 'eldridm20',     displayName: 'eldridm20',       teamName: 'Franks Little Beauties',record: '8-6', wins: 8,  losses: 6,  pointsFor: 1897.36, playoffResult: 'Runner-up',        seed: 5    },
    { rank: 6,  ownerSlug: 'juicybussy',    displayName: 'JuicyBussy',      teamName: 'Juicy Bussy',          record: '8-6',  wins: 8,  losses: 6,  pointsFor: 1845.72, playoffResult: 'CHAMPION',        seed: 6    },
    { rank: 7,  ownerSlug: 'tubes94',       displayName: 'Tubes94',         teamName: 'Burn it all',          record: '7-7',  wins: 7,  losses: 7,  pointsFor: 1700.82, playoffResult: 'Missed playoffs', seed: null },
    { rank: 8,  ownerSlug: 'rbr',           displayName: 'rbr',             teamName: 'Really Big Rings',     record: '6-8',  wins: 6,  losses: 8,  pointsFor: 1758.56, playoffResult: 'Missed playoffs', seed: null },
    { rank: 9,  ownerSlug: 'tdtd19844',     displayName: 'tdtd19844',       teamName: 'THE Shameful Saggy sack', record: '5-9', wins: 5, losses: 9, pointsFor: 1639.20, playoffResult: 'Missed playoffs', seed: null },
    { rank: 10, ownerSlug: 'sexmachineandy',displayName: 'SexMachineAndyD', teamName: 'SexMachineAndyD',      record: '5-9',  wins: 5,  losses: 9,  pointsFor: 1615.18, playoffResult: 'Missed playoffs', seed: null },
    { rank: 11, ownerSlug: 'cogdeill11',    displayName: 'Cogdeill11',      teamName: 'Cogdeill11',           record: '3-11', wins: 3,  losses: 11, pointsFor: 1538.30, playoffResult: 'Missed playoffs', seed: null },
    { rank: 12, ownerSlug: 'escuelas',      displayName: 'Escuelas',        teamName: 'Loud and Stroud!',     record: '2-12', wins: 2,  losses: 12, pointsFor: 1526.06, playoffResult: 'Missed playoffs', seed: null },
  ],
  2024: [
    { rank: 1,  ownerSlug: 'sexmachineandy',displayName: 'SexMachineAndyD', teamName: 'SexMachineAndyD',      record: '11-3', wins: 11, losses: 3,  pointsFor: 2034.18, playoffResult: 'Runner-up',        seed: 1    },
    { rank: 2,  ownerSlug: 'tubes94',       displayName: 'Tubes94',         teamName: 'Nacua Matata',         record: '11-3', wins: 11, losses: 3,  pointsFor: 1928.36, playoffResult: '3rd place',        seed: 2    },
    { rank: 3,  ownerSlug: 'mlschools12',   displayName: 'MLSchools12',     teamName: 'Schoolcraft Football Team', record: '10-4', wins: 10, losses: 4, pointsFor: 1967.20, playoffResult: 'CHAMPION',   seed: 3    },
    { rank: 4,  ownerSlug: 'juicybussy',    displayName: 'JuicyBussy',      teamName: 'Juicy Bussy',          record: '8-6',  wins: 8,  losses: 6,  pointsFor: 2036.54, playoffResult: 'Lost semis',      seed: 4    },
    { rank: 5,  ownerSlug: 'tdtd19844',     displayName: 'tdtd19844',       teamName: 'THE Shameful Saggy sack', record: '8-6', wins: 8, losses: 6, pointsFor: 1915.58, playoffResult: 'Lost round 1',   seed: 5    },
    { rank: 6,  ownerSlug: 'rbr',           displayName: 'rbr',             teamName: 'Really Big Rings',     record: '8-6',  wins: 8,  losses: 6,  pointsFor: 1891.12, playoffResult: 'Lost wild card',  seed: 6    },
    { rank: 7,  ownerSlug: 'eldridm20',     displayName: 'eldridm20',       teamName: 'Franks Little Beauties',record: '6-8', wins: 6,  losses: 8,  pointsFor: 1917.28, playoffResult: 'Missed playoffs', seed: null },
    { rank: 8,  ownerSlug: 'grandes',       displayName: 'Grandes',         teamName: 'El Rioux Grandes',     record: '7-7',  wins: 7,  losses: 7,  pointsFor: 1941.48, playoffResult: 'Missed playoffs', seed: null },
    { rank: 9,  ownerSlug: 'cmaleski',      displayName: 'Cmaleski',        teamName: 'Showtyme Boyz',        record: '4-10', wins: 4,  losses: 10, pointsFor: 1718.72, playoffResult: 'Missed playoffs', seed: null },
    { rank: 10, ownerSlug: 'cogdeill11',    displayName: 'Cogdeill11',      teamName: 'Cogdeill11',           record: '4-10', wins: 4,  losses: 10, pointsFor: 1670.02, playoffResult: 'Missed playoffs', seed: null },
    { rank: 11, ownerSlug: 'eldridsm',      displayName: 'eldridsm',        teamName: '(no name 2025)',       record: '4-10', wins: 4,  losses: 10, pointsFor: 1601.00, playoffResult: 'Missed playoffs', seed: null },
    { rank: 12, ownerSlug: 'escuelas',      displayName: 'Escuelas',        teamName: 'The Young Guns + backups', record: '3-11', wins: 3, losses: 11, pointsFor: 1312.36, playoffResult: 'Missed playoffs', seed: null },
  ],
  2025: [
    { rank: 1,  ownerSlug: 'mlschools12',   displayName: 'MLSchools12',     teamName: 'Schoolcraft Football Team', record: '13-1', wins: 13, losses: 1, pointsFor: 2161.42, playoffResult: 'CHAMPION',       seed: 1    },
    { rank: 2,  ownerSlug: 'tubes94',       displayName: 'Tubes94',         teamName: 'Whale Tails',          record: '10-4', wins: 10, losses: 4,  pointsFor: 1934.66, playoffResult: 'Runner-up',        seed: 2    },
    { rank: 3,  ownerSlug: 'sexmachineandy',displayName: 'SexMachineAndyD', teamName: 'SexMachineAndyD',      record: '9-5',  wins: 9,  losses: 5,  pointsFor: 1996.48, playoffResult: 'Lost wild card',   seed: 3    },
    { rank: 4,  ownerSlug: 'tdtd19844',     displayName: 'tdtd19844',       teamName: 'THE Shameful Saggy sack', record: '8-6', wins: 8, losses: 6, pointsFor: 1934.24, playoffResult: 'Lost semis',      seed: 4    },
    { rank: 5,  ownerSlug: 'juicybussy',    displayName: 'JuicyBussy',      teamName: 'Juicy Bussy',          record: '7-7',  wins: 7,  losses: 7,  pointsFor: 1845.16, playoffResult: 'Lost wild card',   seed: 5    },
    { rank: 6,  ownerSlug: 'cmaleski',      displayName: 'Cmaleski',        teamName: 'Showtyme Boyz',        record: '6-8',  wins: 6,  losses: 8,  pointsFor: 1990.08, playoffResult: 'Lost semis',       seed: 6    },
    { rank: 7,  ownerSlug: 'eldridm20',     displayName: 'eldridm20',       teamName: 'Franks Little Beauties',record: '6-8', wins: 6,  losses: 8,  pointsFor: 1804.50, playoffResult: 'Missed playoffs',  seed: null },
    { rank: 8,  ownerSlug: 'escuelas',      displayName: 'Escuelas',        teamName: 'Booty Cheeks',         record: '6-8',  wins: 6,  losses: 8,  pointsFor: 1695.48, playoffResult: 'Missed playoffs',  seed: null },
    { rank: 9,  ownerSlug: 'cogdeill11',    displayName: 'Cogdeill11',      teamName: 'Cogdeill11',           record: '5-9',  wins: 5,  losses: 9,  pointsFor: 1626.50, playoffResult: 'Missed playoffs',  seed: null },
    { rank: 10, ownerSlug: 'rbr',           displayName: 'rbr',             teamName: 'Really Big Rings',     record: '5-9',  wins: 5,  losses: 9,  pointsFor: 1698.16, playoffResult: 'Missed playoffs',  seed: null },
    { rank: 11, ownerSlug: 'eldridsm',      displayName: 'eldridsm',        teamName: '(no name 2025)',       record: '5-9',  wins: 5,  losses: 9,  pointsFor: 1751.84, playoffResult: 'Missed playoffs',  seed: null },
    { rank: 12, ownerSlug: 'grandes',       displayName: 'Grandes',         teamName: 'El Rioux Grandes',     record: '4-10', wins: 4,  losses: 10, pointsFor: 1548.32, playoffResult: 'Moodie Bowl',       seed: null },
  ],
};

const SEASON_CHAMPIONS: Record<number, { champion: string; runnerUp: string }> = {
  2020: { champion: 'cogdeill11',    runnerUp: 'eldridsm'      },
  2021: { champion: 'mlschools12',   runnerUp: 'rbr'           },
  2022: { champion: 'grandes',       runnerUp: 'rbr'           },
  2023: { champion: 'juicybussy',    runnerUp: 'eldridm20'     },
  2024: { champion: 'mlschools12',   runnerUp: 'sexmachineandy'},
  2025: { champion: 'mlschools12',   runnerUp: 'tubes94'       },
};

const ALL_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPct(pct: number): string {
  return pct.toFixed(3).replace('0.', '.');
}

function playoffResultVariant(result: string): 'champion' | 'runner-up' | 'playoff' | 'last' | 'default' {
  if (result === 'CHAMPION') return 'champion';
  if (result === 'Runner-up') return 'runner-up';
  if (
    result.startsWith('Lost') ||
    result === 'Consolation' ||
    result === '3rd place'
  ) return 'playoff';
  if (result === 'Last place' || result === 'Moodie Bowl') return 'last';
  return 'default';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return <ChevronUp className="w-3 h-3 text-slate-600" aria-hidden="true" />;
  }
  return dir === 'desc'
    ? <ChevronDown className="w-3 h-3 text-[#ffd700]" aria-hidden="true" />
    : <ChevronUp   className="w-3 h-3 text-[#ffd700]" aria-hidden="true" />;
}

interface AllTimeTableProps {
  owners: AllTimeOwner[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

function AllTimeTable({ owners, sortKey, sortDir, onSort }: AllTimeTableProps) {
  const thCls = (key: SortKey) =>
    cn(
      'px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none',
      'hover:text-white transition-colors duration-100',
      sortKey === key ? 'text-[#ffd700]' : 'text-slate-400'
    );

  return (
    <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="All-time standings sorted by win percentage">
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-12">
                #
              </th>
              <th
                scope="col"
                className={cn(thCls('displayName'), 'text-left min-w-[160px]')}
                onClick={() => onSort('displayName')}
              >
                <span className="inline-flex items-center gap-1">
                  Owner
                  <SortIcon active={sortKey === 'displayName'} dir={sortDir} />
                </span>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[160px] hidden sm:table-cell">
                Team
              </th>
              <th
                scope="col"
                className={cn(thCls('wins'), 'text-center w-16')}
                onClick={() => onSort('wins')}
              >
                <span className="inline-flex items-center gap-1">
                  W
                  <SortIcon active={sortKey === 'wins'} dir={sortDir} />
                </span>
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
                L
              </th>
              <th
                scope="col"
                className={cn(thCls('winPct'), 'text-center w-20')}
                onClick={() => onSort('winPct')}
              >
                <span className="inline-flex items-center gap-1">
                  Win%
                  <SortIcon active={sortKey === 'winPct'} dir={sortDir} />
                </span>
              </th>
              <th
                scope="col"
                className={cn(thCls('championships'), 'text-center w-24')}
                onClick={() => onSort('championships')}
              >
                <span className="inline-flex items-center gap-1">
                  Rings
                  <SortIcon active={sortKey === 'championships'} dir={sortDir} />
                </span>
              </th>
              <th
                scope="col"
                className={cn(thCls('playoffAppearances'), 'text-center w-24')}
                onClick={() => onSort('playoffAppearances')}
              >
                <span className="inline-flex items-center gap-1">
                  Playoffs
                  <SortIcon active={sortKey === 'playoffAppearances'} dir={sortDir} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {owners.map((owner, idx) => {
              const isChamp = owner.championships.length > 0;
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={owner.slug}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                    isChamp && 'ring-1 ring-inset ring-[#ffd700]/15'
                  )}
                >
                  {/* Rank */}
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                      idx === 0
                        ? 'bg-[#ffd700] text-[#1a1a2e]'
                        : idx === 1
                        ? 'bg-slate-400 text-[#1a1a2e]'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'text-slate-500'
                    )}>
                      {idx + 1}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isChamp && (
                        <Trophy className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
                      )}
                      <div>
                        <span className={cn('font-semibold', isChamp ? 'text-[#ffd700]' : 'text-white')}>
                          {owner.displayName}
                        </span>
                        {owner.joinedYear && (
                          <span className="ml-1.5 text-[10px] text-slate-500 font-normal">
                            (joined {owner.joinedYear})
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Team name */}
                  <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">
                    {owner.currentTeamName}
                  </td>

                  {/* Wins */}
                  <td className="px-4 py-3 text-center font-mono font-semibold text-[#22c55e]">
                    {owner.wins}
                  </td>

                  {/* Losses */}
                  <td className="px-4 py-3 text-center font-mono font-semibold text-[#ef4444]">
                    {owner.losses}
                  </td>

                  {/* Win% */}
                  <td className="px-4 py-3 text-center font-mono tabular-nums text-slate-300">
                    {fmtPct(owner.winPct)}
                  </td>

                  {/* Championships */}
                  <td className="px-4 py-3 text-center">
                    {owner.championships.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[#ffd700]">
                        {owner.championships.map((yr) => (
                          <span key={yr} className="inline-flex items-center gap-0.5">
                            <Trophy className="w-3 h-3" aria-hidden="true" />
                            <span className="text-xs font-bold">{yr}</span>
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Playoff appearances */}
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'font-semibold tabular-nums',
                      owner.playoffAppearances >= 5
                        ? 'text-[#22c55e]'
                        : owner.playoffAppearances >= 3
                        ? 'text-slate-300'
                        : owner.playoffAppearances >= 1
                        ? 'text-slate-500'
                        : 'text-[#ef4444]'
                    )}>
                      {owner.playoffAppearances}
                      <span className="text-slate-600 font-normal">
                        /{owner.joinedYear ? ALL_YEARS.filter(y => y >= owner.joinedYear!).length : ALL_YEARS.length}
                      </span>
                    </span>
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

interface SeasonTableProps {
  year: number;
  entries: SeasonEntry[];
}

function SeasonTable({ year, entries }: SeasonTableProps) {
  const { champion, runnerUp } = SEASON_CHAMPIONS[year];

  return (
    <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label={`${year} season standings`}>
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-12">
                #
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[140px]">
                Owner
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[160px] hidden md:table-cell">
                Team Name
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-20">
                Record
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-28 hidden sm:table-cell">
                Pts For
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[140px]">
                Result
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {entries.map((entry, idx) => {
              const isChamp   = entry.ownerSlug === champion;
              const isRunnerUp = entry.ownerSlug === runnerUp;
              const isPlayoff = entry.seed !== null;
              const isLast    = entry.rank === entries.length;
              const isEven    = idx % 2 === 0;

              return (
                <tr
                  key={entry.ownerSlug}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                    isChamp && 'ring-1 ring-inset ring-[#ffd700]/30'
                  )}
                >
                  {/* Rank badge */}
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
                      isChamp
                        ? 'bg-[#ffd700] text-[#1a1a2e]'
                        : isRunnerUp
                        ? 'bg-slate-400 text-[#1a1a2e]'
                        : isPlayoff
                        ? 'bg-[#16213e] text-[#22c55e] border border-[#22c55e]/40'
                        : 'bg-[#16213e] text-slate-500 border border-[#2d4a66]'
                    )}>
                      {entry.rank}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isChamp && (
                        <Trophy className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
                      )}
                      <span className={cn('font-semibold', isChamp ? 'text-[#ffd700]' : 'text-white')}>
                        {entry.displayName}
                      </span>
                    </div>
                  </td>

                  {/* Team name */}
                  <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">
                    {entry.teamName}
                  </td>

                  {/* Record */}
                  <td className="px-4 py-3 text-center font-mono tabular-nums">
                    <span className="text-[#22c55e] font-semibold">{entry.wins}</span>
                    <span className="text-slate-500">-</span>
                    <span className="text-[#ef4444] font-semibold">{entry.losses}</span>
                  </td>

                  {/* Points for */}
                  <td className="px-4 py-3 text-center font-mono text-slate-300 tabular-nums text-xs hidden sm:table-cell">
                    {entry.pointsFor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Playoff result */}
                  <td className="px-4 py-3">
                    <Badge
                      variant={playoffResultVariant(entry.playoffResult)}
                      size="sm"
                    >
                      {entry.playoffResult}
                    </Badge>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabYear = 'all-time' | 2020 | 2021 | 2022 | 2023 | 2024 | 2025;

export default function HistoricalStandingsPage() {
  const [activeTab, setActiveTab] = useState<TabYear>('all-time');
  const [sortKey, setSortKey] = useState<SortKey>('winPct');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Sort all-time owners
  const sortedOwners = [...ALL_TIME].sort((a, b) => {
    let valA: number | string;
    let valB: number | string;

    switch (sortKey) {
      case 'wins':             valA = a.wins;                      valB = b.wins;                      break;
      case 'winPct':           valA = a.winPct;                    valB = b.winPct;                    break;
      case 'championships':    valA = a.championships.length;      valB = b.championships.length;      break;
      case 'playoffAppearances': valA = a.playoffAppearances;      valB = b.playoffAppearances;        break;
      case 'displayName':      valA = a.displayName.toLowerCase(); valB = b.displayName.toLowerCase(); break;
      default:                 valA = a.winPct;                    valB = b.winPct;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDir === 'asc'
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'displayName' ? 'asc' : 'desc');
    }
  }

  const seasonData = activeTab !== 'all-time' ? SEASON_STANDINGS[activeTab] : null;
  const seasonChampion = activeTab !== 'all-time' ? SEASON_CHAMPIONS[activeTab] : null;

  return (
    <>
      <Head>
        <title>Historical Standings — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL all-time standings and season-by-season records. Six seasons of dynasty fantasy football history, 2020–2025."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'History', href: '/history' },
          { label: 'Standings' },
        ]} />

        {/* ── Page header ───────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            League Records
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
            Historical Standings
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-slate-400 text-lg">
              BMFFFL &bull; 2020&ndash;2025
            </p>
            <ShareButton />
          </div>
        </header>

        {/* ── Season selector tabs ──────────────────────────────────────── */}
        <div className="mb-8">
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Select season or all-time standings"
          >
            {/* All-Time tab */}
            <button
              role="tab"
              aria-selected={activeTab === 'all-time'}
              aria-controls="standings-panel"
              onClick={() => setActiveTab('all-time')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                'border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/50',
                activeTab === 'all-time'
                  ? 'bg-[#ffd700] text-[#1a1a2e] border-[#ffd700] shadow-lg shadow-[#ffd700]/20'
                  : 'bg-[#16213e] text-slate-300 border-[#2d4a66] hover:border-[#ffd700]/50 hover:text-white'
              )}
            >
              All-Time
            </button>

            {/* Year tabs */}
            {ALL_YEARS.map((year) => {
              const isActive = activeTab === year;
              const champ = SEASON_CHAMPIONS[year].champion;
              return (
                <button
                  key={year}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="standings-panel"
                  onClick={() => setActiveTab(year as TabYear)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                    'border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/50',
                    'inline-flex items-center gap-1.5',
                    isActive
                      ? 'bg-[#ffd700] text-[#1a1a2e] border-[#ffd700] shadow-lg shadow-[#ffd700]/20'
                      : 'bg-[#16213e] text-slate-300 border-[#2d4a66] hover:border-[#ffd700]/50 hover:text-white'
                  )}
                >
                  {year}
                  {isActive && (
                    <Trophy className="w-3 h-3" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Season champion callout (season view only) ────────────────── */}
        {activeTab !== 'all-time' && seasonChampion && seasonData && (() => {
          const champEntry = seasonData.find(e => e.ownerSlug === seasonChampion.champion);
          const ruEntry    = seasonData.find(e => e.ownerSlug === seasonChampion.runnerUp);
          return (
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/30 px-5 py-3 shadow-lg shadow-[#ffd700]/5">
                <Trophy className="w-5 h-5 text-[#ffd700] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#ffd700]">Champion</p>
                  <p className="text-white font-black">{champEntry?.displayName}</p>
                  {champEntry && (
                    <p className="text-xs text-slate-400">{champEntry.teamName} &bull; {champEntry.record}</p>
                  )}
                </div>
              </div>
              {ruEntry && (
                <div className="flex items-center gap-3 rounded-xl bg-[#16213e] border border-[#2d4a66] px-5 py-3">
                  <div className="w-5 h-5 rounded-full bg-slate-400/20 border border-slate-400/30 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-black text-slate-400">2</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Runner-Up</p>
                    <p className="text-white font-black">{ruEntry.displayName}</p>
                    <p className="text-xs text-slate-400">{ruEntry.teamName} &bull; {ruEntry.record}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Standings panel ───────────────────────────────────────────── */}
        <div id="standings-panel" role="tabpanel">
          {activeTab === 'all-time' ? (
            <>
              {/* Sort hint */}
              <p className="text-xs text-slate-500 mb-3">
                Click column headers to sort. Default: all-time win percentage.
              </p>
              <AllTimeTable
                owners={sortedOwners}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Trophy className="w-3 h-3 text-[#ffd700]" aria-hidden="true" />
                  Championship season
                </span>
                <span>Win% = wins / (wins + losses)</span>
                <span>Playoffs = appearances / seasons played</span>
              </div>
            </>
          ) : (
            seasonData && (
              <>
                <p className="text-xs text-slate-500 mb-3">
                  Regular season final standings &bull; Top 6 seeds advance to playoffs
                </p>
                <SeasonTable year={activeTab} entries={seasonData} />

                {/* Season nav */}
                <div className="mt-6 flex items-center justify-between pt-5 border-t border-[#2d4a66]">
                  {ALL_YEARS.indexOf(activeTab) > 0 ? (
                    <button
                      onClick={() => setActiveTab(ALL_YEARS[ALL_YEARS.indexOf(activeTab) - 1] as TabYear)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] transition-all duration-150 text-sm"
                    >
                      &larr; {ALL_YEARS[ALL_YEARS.indexOf(activeTab) - 1]}
                    </button>
                  ) : <div />}

                  <Link
                    href={`/history/${activeTab}`}
                    className="text-xs text-slate-500 hover:text-[#ffd700] transition-colors duration-150"
                  >
                    Full {activeTab} season page &rarr;
                  </Link>

                  {ALL_YEARS.indexOf(activeTab) < ALL_YEARS.length - 1 ? (
                    <button
                      onClick={() => setActiveTab(ALL_YEARS[ALL_YEARS.indexOf(activeTab) + 1] as TabYear)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] transition-all duration-150 text-sm"
                    >
                      {ALL_YEARS[ALL_YEARS.indexOf(activeTab) + 1]} &rarr;
                    </button>
                  ) : <div />}
                </div>
              </>
            )
          )}
        </div>

        {/* ── Quick champion reference ──────────────────────────────────── */}
        <section className="mt-12" aria-labelledby="champs-ref-heading">
          <h2 id="champs-ref-heading" className="text-xl font-black text-white mb-4">
            Champions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ALL_YEARS.map((year) => {
              const { champion } = SEASON_CHAMPIONS[year];
              const owner = ALL_TIME.find(o => o.slug === champion);
              const isActive = activeTab === year;
              return (
                <button
                  key={year}
                  onClick={() => setActiveTab(year as TabYear)}
                  className={cn(
                    'group flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center',
                    'transition-all duration-150',
                    'hover:border-[#ffd700]/50 hover:-translate-y-0.5',
                    isActive
                      ? 'bg-[#ffd700]/10 border-[#ffd700]/50'
                      : 'bg-[#16213e] border-[#2d4a66]'
                  )}
                  aria-label={`View ${year} season — champion ${owner?.displayName}`}
                >
                  <span className={cn(
                    'text-2xl font-black tabular-nums leading-none',
                    isActive ? 'text-[#ffd700]' : 'text-slate-300 group-hover:text-[#ffd700]'
                  )}>
                    {year}
                  </span>
                  <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                  <span className="text-xs text-slate-400 leading-tight">
                    {owner?.displayName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
}
