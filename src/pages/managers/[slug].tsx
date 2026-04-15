import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, ChevronLeft, Star, Swords, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonRecord {
  year: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  finish: number;
  result: 'champion' | 'runner-up' | 'playoff' | 'miss';
}

interface TradeEntry {
  year: number;
  gave: string;
  received: string;
  verdict: 'win' | 'loss' | 'push';
  note: string;
}

interface Rivalry {
  opponent: string;
  record: string;
  description: string;
}

interface FunStats {
  bestWeek: number;
  worstWeek: number;
  biggestWinMargin: number;
  biggestLossMargin: number;
  bestSeasonYear: number;
  bestSeasonRecord: string;
}

interface ManagerProfile {
  slug: string;
  displayName: string;
  teamName: string;
  championships: number[];
  runnerUps: number[];
  overallRecord: { wins: number; losses: number };
  pointsScored: number;
  playoffApps: number;
  dynastyRank: number;
  avgPointsPerGame: number;
  bio: string;
  seasons: SeasonRecord[];
  roster: string[];
  trades: TradeEntry[];
  funStats: FunStats;
  rivalries: Rivalry[];
}

// ─── Manager Data ─────────────────────────────────────────────────────────────

const MANAGERS: ManagerProfile[] = [
  {
    slug: 'mlschools12',
    displayName: 'MLSchools12',
    teamName: 'The Murder Boners',
    championships: [2016, 2019, 2021, 2024],
    runnerUps: [],
    overallRecord: { wins: 74, losses: 16 },
    pointsScored: 11240,
    playoffApps: 6,
    dynastyRank: 1,
    avgPointsPerGame: 124.9,
    bio: "The undisputed dynasty of the BMFFFL. Four championships across all eras — 2016, 2019 (ESPN era), 2021, 2024 (Sleeper era). Holds the all-time wins record with a .822 win percentage. Six consecutive playoff appearances. In 2025, went 13-1 (the best regular-season record in league history) but was upset before the finals. The benchmark every season.",
    seasons: [
      { year: 2020, wins: 11, losses: 2, pointsFor: 1820, pointsAgainst: 1530, finish: 1, result: 'playoff' },
      { year: 2021, wins: 11, losses: 3, pointsFor: 1980, pointsAgainst: 1650, finish: 1, result: 'champion' },
      { year: 2022, wins: 10, losses: 4, pointsFor: 1870, pointsAgainst: 1610, finish: 1, result: 'playoff' },
      { year: 2023, wins: 13, losses: 1, pointsFor: 2140, pointsAgainst: 1540, finish: 1, result: 'playoff' },
      { year: 2024, wins: 10, losses: 4, pointsFor: 1910, pointsAgainst: 1690, finish: 3, result: 'champion' },
      { year: 2025, wins: 13, losses: 1, pointsFor: 2120, pointsAgainst: 1590, finish: 1, result: 'playoff' },
    ],
    roster: [
      'CeeDee Lamb (WR)',
      'Tyreek Hill (WR)',
      'Garrett Wilson (WR)',
      'Brock Purdy (QB)',
      'Breece Hall (RB)',
      'Sam LaPorta (TE)',
    ],
    trades: [
      { year: 2021, gave: 'DeAndre Hopkins', received: 'Garrett Wilson + 2022 1st', verdict: 'win', note: 'Shipped aging Hopkins for future WR1 and a first — textbook dynasty trade.' },
      { year: 2022, gave: '2023 1st (top-3)', received: 'CeeDee Lamb', verdict: 'win', note: 'Paid top pick for CeeDee mid-season. Anchored the next three championship runs.' },
      { year: 2023, gave: 'Davante Adams + 2024 2nd', received: 'Breece Hall', verdict: 'win', note: 'Moved off declining Adams for elite young RB just in time for the 2024 run.' },
      { year: 2024, gave: 'Tony Pollard + 2025 3rd', received: 'Sam LaPorta', verdict: 'push', note: 'Swapped aging RB for TE upside. LaPorta delivered in the championship.' },
    ],
    funStats: {
      bestWeek: 245.8,
      worstWeek: 71.2,
      biggestWinMargin: 98.4,
      biggestLossMargin: 44.1,
      bestSeasonYear: 2023,
      bestSeasonRecord: '13-1',
    },
    rivalries: [
      { opponent: 'Tubes94', record: '8-2', description: 'Two deep playoff runs intersected — Tubes94 reached the 2025 finals but the 4th seed tdtd19844 beat them both to the crown.' },
      { opponent: 'SexMachineAndyD', record: '9-3', description: 'Two playoff crossings — including the 2024 championship. Closest regular rival.' },
      { opponent: 'Eldridm20', record: '7-3', description: 'Eldridm20 stunned the 13-1 MLSchools12 in the 2023 semis — the dynasty\'s lone playoff loss of note.' },
    ],
  },
  {
    slug: 'tubes94',
    displayName: 'Tubes94',
    teamName: 'Whale Tails',
    championships: [],
    runnerUps: [2025],
    overallRecord: { wins: 37, losses: 33 },
    pointsScored: 5280,
    playoffApps: 3,
    dynastyRank: 2,
    avgPointsPerGame: 119.1,
    bio: "The most dramatic rebuild arc in the dynasty. Went 2-12 in 2021 debut, then methodically accumulated assets. Reached the 2025 championship game as the 2-seed — only to run into tdtd19844's dark-horse run. Lost 135.08–152.92. The title was right there.",
    seasons: [
      { year: 2021, wins: 2, losses: 12, pointsFor: 1310, pointsAgainst: 1720, finish: 11, result: 'miss' },
      { year: 2022, wins: 4, losses: 10, pointsFor: 1450, pointsAgainst: 1680, finish: 10, result: 'miss' },
      { year: 2023, wins: 7, losses: 7, pointsFor: 1620, pointsAgainst: 1630, finish: 7, result: 'miss' },
      { year: 2024, wins: 11, losses: 3, pointsFor: 1940, pointsAgainst: 1590, finish: 2, result: 'playoff' },
      { year: 2025, wins: 10, losses: 4, pointsFor: 1960, pointsAgainst: 1680, finish: 2, result: 'runner-up' },
    ],
    roster: [
      'Bijan Robinson (RB)',
      'Breece Hall (RB)',
      'Drake London (WR)',
      'Trevor Lawrence (QB)',
      'Puka Nacua (WR)',
      'Trey McBride (TE)',
    ],
    trades: [
      { year: 2022, gave: '2022 1st + 2023 2nd', received: 'Bijan Robinson (devy)', verdict: 'win', note: 'Spent big on Bijan before the NFL draft. The cornerstone of the entire rebuild.' },
      { year: 2023, gave: 'Cooper Kupp + 2024 3rd', received: 'Drake London + 2024 2nd', verdict: 'win', note: 'Swapped aging Kupp for young London. Perfect age curve trade.' },
      { year: 2024, gave: '2025 2nd', received: 'Trey McBride', verdict: 'win', note: 'Filled the TE void with an ascending McBride. Completed the championship roster.' },
      { year: 2025, gave: 'Puka Nacua + 2026 3rd', received: '2025 1st', verdict: 'push', note: 'Attempted to upgrade into the 2025 draft. Pick didn\'t pan out but the run was special.' },
    ],
    funStats: {
      bestWeek: 221.4,
      worstWeek: 68.9,
      biggestWinMargin: 87.2,
      biggestLossMargin: 52.3,
      bestSeasonYear: 2024,
      bestSeasonRecord: '11-3',
    },
    rivalries: [
      { opponent: 'tdtd19844', record: '1-1', description: 'The 2025 championship — Tubes94 reached the finals as the 2-seed but fell to tdtd19844 135.08–152.92. The dark horse beat the heir apparent.' },
      { opponent: 'SexMachineAndyD', record: '5-5', description: 'Perfectly even rivalry. Both teams rose together as the league\'s top two non-champion contenders in 2024-25.' },
      { opponent: 'JuicyBussy', record: '4-6', description: 'JuicyBussy\'s explosive weeks have burned Tubes94 more than once. Tubes94 leads since 2024.' },
    ],
  },
  {
    slug: 'sexmachineandy',
    displayName: 'SexMachineAndyD',
    teamName: 'SexMachineAndyD',
    championships: [],
    runnerUps: [2024],
    overallRecord: { wins: 52, losses: 34 },
    pointsScored: 7980,
    playoffApps: 4,
    dynastyRank: 3,
    avgPointsPerGame: 116.8,
    bio: "Four playoff appearances including the 2024 championship game. Consistently finishes in the top-4 of the regular season but has been unable to break through in single-elimination. The most frustrating resume in the dynasty — elite talent, no ring.",
    seasons: [
      { year: 2020, wins: 9, losses: 4, pointsFor: 1680, pointsAgainst: 1520, finish: 3, result: 'playoff' },
      { year: 2021, wins: 10, losses: 4, pointsFor: 1790, pointsAgainst: 1620, finish: 2, result: 'playoff' },
      { year: 2022, wins: 6, losses: 8, pointsFor: 1510, pointsAgainst: 1640, finish: 7, result: 'miss' },
      { year: 2023, wins: 5, losses: 9, pointsFor: 1430, pointsAgainst: 1620, finish: 8, result: 'miss' },
      { year: 2024, wins: 11, losses: 3, pointsFor: 1970, pointsAgainst: 1610, finish: 1, result: 'runner-up' },
      { year: 2025, wins: 9, losses: 5, pointsFor: 1760, pointsAgainst: 1640, finish: 3, result: 'playoff' },
    ],
    roster: [
      'Josh Allen (QB)',
      'Jonathan Taylor (RB)',
      'Davante Adams (WR)',
      'Cooper Kupp (WR)',
      'Tony Pollard (RB)',
      'Dalton Kincaid (TE)',
    ],
    trades: [
      { year: 2021, gave: '2022 1st', received: 'Josh Allen', verdict: 'win', note: 'Paid a king\'s ransom for Josh Allen. Has delivered every single season.' },
      { year: 2022, gave: 'Tyreek Hill', received: 'Jonathan Taylor + 2023 2nd', verdict: 'push', note: 'Shipped Tyreek at peak value for Taylor. Taylor\'s injuries made this sting in 2023.' },
      { year: 2024, gave: '2025 1st', received: 'Davante Adams', verdict: 'loss', note: 'Bought Adams for the 2024 run. Adams declined mid-season but the team nearly won it all.' },
      { year: 2025, gave: 'Cooper Kupp + 2026 2nd', received: 'Dalton Kincaid + 2025 2nd', verdict: 'push', note: 'Aging receiver out, young TE in. Smart age-curve thinking.' },
    ],
    funStats: {
      bestWeek: 198.3,
      worstWeek: 74.6,
      biggestWinMargin: 79.1,
      biggestLossMargin: 61.4,
      bestSeasonYear: 2024,
      bestSeasonRecord: '11-3',
    },
    rivalries: [
      { opponent: 'MLSchools12', record: '3-9', description: 'The eternal rivalry. MLSchools12 beat SexMachineAndyD in the 2024 championship. SexMachineAndyD is 1-5 vs the champ in playoffs.' },
      { opponent: 'Tubes94', record: '5-5', description: 'The league\'s premier 50-50 rivalry. Both chasing a title, both elite, neither willing to blink.' },
      { opponent: 'JuicyBussy', record: '7-3', description: 'One of SexMachineAndyD\'s favorite matchups. The consistency vs explosiveness battle usually goes consistency\'s way.' },
    ],
  },
  {
    slug: 'cogdeill11',
    displayName: 'Cogdeill11',
    teamName: 'The Originals',
    championships: [2020],
    runnerUps: [],
    overallRecord: { wins: 38, losses: 45 },
    pointsScored: 6230,
    playoffApps: 2,
    dynastyRank: 4,
    avgPointsPerGame: 110.8,
    bio: "Founding member and 2020 champion — won the tightest championship in league history (203.10–198.34). Has not replicated that early magic, missing the playoffs in four of the last five seasons. The ghost of a dynasty past.",
    seasons: [
      { year: 2020, wins: 10, losses: 3, pointsFor: 1720, pointsAgainst: 1540, finish: 2, result: 'champion' },
      { year: 2021, wins: 9, losses: 5, pointsFor: 1640, pointsAgainst: 1610, finish: 4, result: 'playoff' },
      { year: 2022, wins: 7, losses: 7, pointsFor: 1560, pointsAgainst: 1590, finish: 5, result: 'miss' },
      { year: 2023, wins: 3, losses: 11, pointsFor: 1280, pointsAgainst: 1740, finish: 11, result: 'miss' },
      { year: 2024, wins: 4, losses: 10, pointsFor: 1310, pointsAgainst: 1670, finish: 10, result: 'miss' },
      { year: 2025, wins: 5, losses: 9, pointsFor: 1420, pointsAgainst: 1640, finish: 7, result: 'miss' },
    ],
    roster: [
      "Ja'Marr Chase (WR)",
      'Saquon Barkley (RB)',
      'Omarion Hampton (RB)',
      'Brock Purdy (QB)',
      'Colston Loveland (TE)',
      'Rashid Shaheed (WR)',
    ],
    trades: [
      { year: 2020, gave: 'Le\'Veon Bell + 2021 3rd', received: 'Saquon Barkley', verdict: 'win', note: 'Swapped the declining Bell for a fresh Saquon. Saquon anchored the 2020 title run.' },
      { year: 2022, gave: 'Ja\'Marr Chase (devy)', received: '2022 1st + 2022 2nd', verdict: 'loss', note: 'Famously sold Ja\'Marr Chase before he became a top-3 WR. The trade that changed the dynasty\'s trajectory.' },
      { year: 2023, gave: '2024 1st', received: "Ja'Marr Chase (buy-back)", verdict: 'push', note: 'Bought Chase back at nearly peak price. Painful lesson in dynasty asset valuation.' },
      { year: 2025, gave: 'Josh Palmer + 2026 3rd', received: 'Omarion Hampton (rookie)', verdict: 'win', note: 'Smart add of Hampton in the rookie draft — one of the few bright spots in the rebuild.' },
    ],
    funStats: {
      bestWeek: 203.1,
      worstWeek: 64.8,
      biggestWinMargin: 75.4,
      biggestLossMargin: 68.2,
      bestSeasonYear: 2020,
      bestSeasonRecord: '10-3',
    },
    rivalries: [
      { opponent: 'MLSchools12', record: '4-8', description: 'Cogdeill11 beat MLSchools12 in the 2020 semifinals en route to the title. MLSchools12 has dominated every meeting since.' },
      { opponent: 'Grandes', record: '5-7', description: 'Two founding members, two different trajectories. Grandes won a title in 2022; Cogdeill11 was already fading.' },
      { opponent: 'Eldridm20', record: '6-6', description: 'The perfectly even founding-era rivalry. Both went 6-6 head-to-head across six years.' },
    ],
  },
  {
    slug: 'grandes',
    displayName: 'Grandes',
    teamName: 'La Familia',
    championships: [2022],
    runnerUps: [],
    overallRecord: { wins: 42, losses: 41 },
    pointsScored: 6840,
    playoffApps: 3,
    dynastyRank: 5,
    avgPointsPerGame: 114.6,
    bio: "The 2022 champion and league Commissioner. Went from near-last in 2020 to champion in 2022, then crashed back to the Moodie Bowl in 2025 — the fastest championship-to-cellar swing in BMFFFL history. A living proof that dynasty is cyclical.",
    seasons: [
      { year: 2020, wins: 4, losses: 9, pointsFor: 1360, pointsAgainst: 1620, finish: 10, result: 'miss' },
      { year: 2021, wins: 10, losses: 4, pointsFor: 1810, pointsAgainst: 1650, finish: 3, result: 'playoff' },
      { year: 2022, wins: 8, losses: 6, pointsFor: 1620, pointsAgainst: 1580, finish: 4, result: 'champion' },
      { year: 2023, wins: 9, losses: 5, pointsFor: 1750, pointsAgainst: 1630, finish: 2, result: 'playoff' },
      { year: 2024, wins: 7, losses: 7, pointsFor: 1580, pointsAgainst: 1630, finish: 6, result: 'miss' },
      { year: 2025, wins: 4, losses: 10, pointsFor: 1420, pointsAgainst: 1710, finish: 12, result: 'miss' },
    ],
    roster: [
      'C.J. Stroud (QB)',
      'Rashee Rice (WR)',
      'Rhamondre Stevenson (RB)',
      'Evan Engram (TE)',
      'Dameon Pierce (RB)',
      'Michael Pittman Jr. (WR)',
    ],
    trades: [
      { year: 2021, gave: '2022 2nd + 2022 3rd', received: 'Tyreek Hill', verdict: 'win', note: 'Bought Tyreek before his Miami explosion. Anchored the 2022 championship run.' },
      { year: 2022, gave: 'Tyreek Hill', received: 'C.J. Stroud (devy) + 2023 1st', verdict: 'win', note: 'Sold Tyreek at peak, pivoted to Stroud. Perfect dynasty asset management.' },
      { year: 2023, gave: '2024 1st (top-5)', received: 'Rashee Rice', verdict: 'push', note: 'Paid a premium for Rice. Suspension in 2024 wrecked the timeline.' },
      { year: 2025, gave: 'Rhamondre Stevenson + 2026 2nd', received: '2025 1st + 2025 2nd', verdict: 'loss', note: 'Sold assets for picks in a desperate rebuild. The picks didn\'t land.' },
    ],
    funStats: {
      bestWeek: 192.6,
      worstWeek: 67.3,
      biggestWinMargin: 81.3,
      biggestLossMargin: 70.1,
      bestSeasonYear: 2021,
      bestSeasonRecord: '10-4',
    },
    rivalries: [
      { opponent: 'MLSchools12', record: '4-8', description: 'The Commissioner vs the dynasty king. MLSchools12 eliminated Grandes in the 2022 semis before winning it all in reverse-year.' },
      { opponent: 'JuicyBussy', record: '6-6', description: 'An even rivalry with a twist — Grandes beat JuicyBussy in the 2022 championship bracket to claim the title.' },
      { opponent: 'Tubes94', record: '4-6', description: 'Tubes94\'s rise has corresponded with Grandes\'s fall. The torch passed in 2024.' },
    ],
  },
  {
    slug: 'juicybussy',
    displayName: 'JuicyBussy',
    teamName: 'JuicyBussy',
    championships: [2023],
    runnerUps: [],
    overallRecord: { wins: 46, losses: 37 },
    pointsScored: 7810,
    playoffApps: 5,
    dynastyRank: 6,
    avgPointsPerGame: 117.4,
    bio: "The 2023 champion who entered the playoffs as the 6th seed and went on a run. Holds the all-time single-week scoring record (245.80 pts, Week 16 2021). The most explosive offense in the league — capable of beating anyone on any given week.",
    seasons: [
      { year: 2020, wins: 5, losses: 8, pointsFor: 1490, pointsAgainst: 1620, finish: 9, result: 'miss' },
      { year: 2021, wins: 8, losses: 6, pointsFor: 1740, pointsAgainst: 1680, finish: 6, result: 'playoff' },
      { year: 2022, wins: 10, losses: 4, pointsFor: 1830, pointsAgainst: 1640, finish: 2, result: 'playoff' },
      { year: 2023, wins: 8, losses: 6, pointsFor: 1660, pointsAgainst: 1610, finish: 4, result: 'champion' },
      { year: 2024, wins: 8, losses: 6, pointsFor: 1690, pointsAgainst: 1650, finish: 4, result: 'playoff' },
      { year: 2025, wins: 7, losses: 7, pointsFor: 1600, pointsAgainst: 1620, finish: 5, result: 'miss' },
    ],
    roster: [
      'Joe Burrow (QB)',
      "De'Von Achane (RB)",
      'Malik Nabers (WR)',
      'Harold Fannin Jr. (TE)',
      'Matthew Golden (WR)',
      'Rome Odunze (WR)',
    ],
    trades: [
      { year: 2021, gave: '2022 1st', received: 'Joe Burrow', verdict: 'win', note: 'Bought Burrow the season he went supernova. The QB foundation that\'s never wavered.' },
      { year: 2022, gave: 'Stefon Diggs + 2023 3rd', received: "De'Von Achane (devy)", verdict: 'win', note: 'Shipped aging Diggs for devy Achane. Perfect timing — Achane became an elite RB.' },
      { year: 2023, gave: '2024 1st + 2024 2nd', received: 'Malik Nabers (draft pick slot)', verdict: 'win', note: 'Used the picks to move up for Nabers in the startup. Instant WR1 upgrade.' },
      { year: 2024, gave: 'Jaylen Waddle', received: 'Harold Fannin Jr. + 2025 2nd', verdict: 'push', note: 'Traded Waddle for the elite TE. Fills the last positional void heading into 2025.' },
    ],
    funStats: {
      bestWeek: 245.8,
      worstWeek: 69.1,
      biggestWinMargin: 102.6,
      biggestLossMargin: 58.4,
      bestSeasonYear: 2022,
      bestSeasonRecord: '10-4',
    },
    rivalries: [
      { opponent: 'Eldridm20', record: '5-7', description: 'The 2023 championship. JuicyBussy def. Eldridm20 in the title game to cap the 6th-seed run.' },
      { opponent: 'MLSchools12', record: '3-9', description: 'JuicyBussy\'s kryptonite. Despite the highest point ceiling in the league, MLSchools12 consistently finds a way.' },
      { opponent: 'Grandes', record: '6-6', description: 'The explosion vs commissioner battle. Always one of the most entertaining matchups on the schedule.' },
    ],
  },
  {
    slug: 'tdtd19844',
    displayName: 'TDTD19844',
    teamName: 'The Dark Horse',
    championships: [2025],
    runnerUps: [],
    overallRecord: { wins: 36, losses: 47 },
    pointsScored: 5990,
    playoffApps: 3,
    dynastyRank: 7,
    avgPointsPerGame: 109.5,
    bio: "The ultimate comeback story. Went 3-11 in 2022 and finished dead last. Quietly rebuilt through losing seasons, then entered the 2025 playoffs as the 4th seed (8-6) and stunned everyone — upsetting the 13-1 MLSchools12 in the semis and defeating Tubes94 in the championship (152.92–135.08). THE Shameful Saggy Sack is the 2025 BMFFFL champion.",
    seasons: [
      { year: 2020, wins: 6, losses: 7, pointsFor: 1460, pointsAgainst: 1540, finish: 6, result: 'miss' },
      { year: 2021, wins: 6, losses: 8, pointsFor: 1490, pointsAgainst: 1590, finish: 8, result: 'miss' },
      { year: 2022, wins: 3, losses: 11, pointsFor: 1270, pointsAgainst: 1780, finish: 12, result: 'miss' },
      { year: 2023, wins: 5, losses: 9, pointsFor: 1380, pointsAgainst: 1640, finish: 9, result: 'miss' },
      { year: 2024, wins: 8, losses: 6, pointsFor: 1680, pointsAgainst: 1600, finish: 5, result: 'playoff' },
      { year: 2025, wins: 8, losses: 6, pointsFor: 1710, pointsAgainst: 1630, finish: 4, result: 'champion' },
    ],
    roster: [
      'Jayden Daniels (QB)',
      'Kyren Williams (RB)',
      'Tee Higgins (WR)',
      'Sam LaPorta (TE)',
      'Jalen McMillan (WR)',
      'Olamide Zaccheaus (WR)',
    ],
    trades: [
      { year: 2022, gave: 'Derrick Henry + 2023 1st', received: 'Multiple 2023-2024 picks', verdict: 'win', note: 'Sold Henry at peak value and tanked strategically. Accumulated a war chest of picks.' },
      { year: 2023, gave: '2024 1st + 2024 2nd', received: 'Jayden Daniels (draft slot)', verdict: 'win', note: 'Moved up for Daniels before the NFL draft. Became the QB of the window.' },
      { year: 2024, gave: 'Tyler Lockett + 2025 3rd', received: 'Tee Higgins', verdict: 'win', note: 'Shipped the aging slot WR for a legitimate WR1. The move that put them over the top.' },
      { year: 2025, gave: '2026 2nd', received: 'Kyren Williams', verdict: 'push', note: 'Bought Kyren\'s upside for one last push. Williams delivered in the playoff run.' },
    ],
    funStats: {
      bestWeek: 186.4,
      worstWeek: 61.2,
      biggestWinMargin: 73.8,
      biggestLossMargin: 84.6,
      bestSeasonYear: 2025,
      bestSeasonRecord: '8-6',
    },
    rivalries: [
      { opponent: 'RBR', record: '5-7', description: 'RBR\'s veteran savvy has given TDTD19844 fits. RBR leads the all-time series decisively.' },
      { opponent: 'Tubes94', record: '4-6', description: 'Two teams on similar rebuild arcs — both peaked around 2024-25 as the league\'s rising contenders.' },
      { opponent: 'CheeseAndCrackers', record: '6-6', description: 'Perfectly even across the full dynasty. Every matchup has felt like a playoff game.' },
    ],
  },
  {
    slug: 'eldridm20',
    displayName: 'Eldridm20',
    teamName: 'Eldridm20',
    championships: [],
    runnerUps: [2023],
    overallRecord: { wins: 39, losses: 44 },
    pointsScored: 6340,
    playoffApps: 3,
    dynastyRank: 8,
    avgPointsPerGame: 111.2,
    bio: "The 2023 runner-up after eliminating the #1 seed MLSchools12 (13-1) in the semifinals with 154.30 points. Consistently competitive without breaking through for the title. Three playoff appearances and a near-miss at the championship.",
    seasons: [
      { year: 2020, wins: 4, losses: 9, pointsFor: 1370, pointsAgainst: 1640, finish: 11, result: 'miss' },
      { year: 2021, wins: 8, losses: 6, pointsFor: 1620, pointsAgainst: 1640, finish: 5, result: 'playoff' },
      { year: 2022, wins: 7, losses: 7, pointsFor: 1530, pointsAgainst: 1580, finish: 6, result: 'playoff' },
      { year: 2023, wins: 8, losses: 6, pointsFor: 1640, pointsAgainst: 1610, finish: 5, result: 'runner-up' },
      { year: 2024, wins: 6, losses: 8, pointsFor: 1490, pointsAgainst: 1620, finish: 7, result: 'miss' },
      { year: 2025, wins: 6, losses: 8, pointsFor: 1490, pointsAgainst: 1640, finish: 6, result: 'miss' },
    ],
    roster: [
      'Josh Allen (QB)',
      'Luther Burden III (WR)',
      'Jayden Reed (WR)',
      'James Cook (RB)',
      'Chuba Hubbard (RB)',
      'Jelani Woods (TE)',
    ],
    trades: [
      { year: 2021, gave: '2022 1st', received: 'Josh Allen', verdict: 'win', note: 'Paid the price for Allen before he fully became Allen. Worth every pick.' },
      { year: 2022, gave: 'Tyreek Hill + 2023 3rd', received: 'Jayden Reed (devy) + 2023 2nd', verdict: 'push', note: 'Moved off aging Tyreek for youth and draft capital. Reed has been solid.' },
      { year: 2023, gave: '2024 1st (top-4)', received: 'James Cook', verdict: 'push', note: 'Bought Cook for the 2023 run. Valuable, but cost a valuable pick in hindsight.' },
      { year: 2024, gave: 'James Conner + 2025 2nd', received: 'Luther Burden III (rookie)', verdict: 'win', note: 'Rebuilt at RB depth while adding young receiver in Burden. Smart pivot for the next window.' },
    ],
    funStats: {
      bestWeek: 191.7,
      worstWeek: 65.4,
      biggestWinMargin: 77.6,
      biggestLossMargin: 63.8,
      bestSeasonYear: 2023,
      bestSeasonRecord: '8-6',
    },
    rivalries: [
      { opponent: 'JuicyBussy', record: '7-5', description: 'The 2023 championship. Eldridm20 made the final but JuicyBussy had the hotter run. Eldridm20 leads the all-time series.' },
      { opponent: 'MLSchools12', record: '3-9', description: 'Eldridm20 stunned the 13-1 MLSchools12 in the 2023 semis (154.30 pts) — the dynasty\'s most memorable upset.' },
      { opponent: 'RBR', record: '5-7', description: 'Two consistent finishers who have never dominated one another. RBR leads narrowly.' },
    ],
  },
  {
    slug: 'rbr',
    displayName: 'RBR',
    teamName: 'RBR',
    championships: [],
    runnerUps: [],
    overallRecord: { wins: 44, losses: 39 },
    pointsScored: 7020,
    playoffApps: 5,
    dynastyRank: 9,
    avgPointsPerGame: 113.4,
    bio: "The quintessential veteran manager. Five playoff appearances, the best lineup IQ in the league (89.78%), and a deeply professional approach to dynasty roster management. Never the flashiest — always dangerous. The league's most underrated manager by reputation.",
    seasons: [
      { year: 2020, wins: 6, losses: 7, pointsFor: 1510, pointsAgainst: 1570, finish: 5, result: 'miss' },
      { year: 2021, wins: 9, losses: 5, pointsFor: 1710, pointsAgainst: 1640, finish: 4, result: 'playoff' },
      { year: 2022, wins: 10, losses: 4, pointsFor: 1820, pointsAgainst: 1630, finish: 3, result: 'playoff' },
      { year: 2023, wins: 6, losses: 8, pointsFor: 1520, pointsAgainst: 1640, finish: 6, result: 'playoff' },
      { year: 2024, wins: 8, losses: 6, pointsFor: 1670, pointsAgainst: 1620, finish: 5, result: 'playoff' },
      { year: 2025, wins: 5, losses: 9, pointsFor: 1490, pointsAgainst: 1630, finish: 8, result: 'miss' },
    ],
    roster: [
      'Patrick Mahomes (QB)',
      'Marvin Harrison Jr. (WR)',
      'Travis Kelce (TE)',
      'Quinshon Judkins (RB)',
      'Stefon Diggs (WR)',
      'Amari Cooper (WR)',
    ],
    trades: [
      { year: 2021, gave: '2022 1st + 2022 2nd', received: 'Patrick Mahomes', verdict: 'win', note: 'Paid up for Mahomes when others hesitated. The pick paid dividends across every season.' },
      { year: 2022, gave: 'Travis Etienne + 2023 2nd', received: 'Marvin Harrison Jr. (devy)', verdict: 'win', note: 'Sold Etienne before the injury history caught up, bought Harrison before anyone knew how good he\'d be.' },
      { year: 2023, gave: 'Amon-Ra St. Brown', received: 'Quinshon Judkins (rookie) + 2024 3rd', verdict: 'win', note: 'Moved a declining slot WR for an ascending RB. Classic RBR — calm, calculated, correct.' },
      { year: 2025, gave: 'Brandin Cooks + 2026 3rd', received: 'Amari Cooper', verdict: 'push', note: 'Receiver swap for a team in win-now mode. Neither player moved the needle in 2025.' },
    ],
    funStats: {
      bestWeek: 194.2,
      worstWeek: 66.7,
      biggestWinMargin: 82.4,
      biggestLossMargin: 57.1,
      bestSeasonYear: 2022,
      bestSeasonRecord: '10-4',
    },
    rivalries: [
      { opponent: 'MLSchools12', record: '4-8', description: 'RBR\'s biggest wall. Despite superior lineup IQ on paper, MLSchools12\'s depth has been too much.' },
      { opponent: 'TDTD19844', record: '7-5', description: 'RBR has mentored and beaten TDTD19844 across the dynasty. The student hasn\'t quite surpassed the teacher yet.' },
      { opponent: 'SexMachineAndyD', record: '6-6', description: 'Two veteran managers who\'ve swapped playoff spots repeatedly. Dead even across six years.' },
    ],
  },
  {
    slug: 'bro_set',
    displayName: 'Bro_Set',
    teamName: 'Bro_Set',
    championships: [],
    runnerUps: [],
    overallRecord: { wins: 28, losses: 44 },
    pointsScored: 4980,
    playoffApps: 1,
    dynastyRank: 10,
    avgPointsPerGame: 104.8,
    bio: "An expansion manager still finding their footing in the dynasty. One playoff appearance but clear upward trajectory. Building patiently through the draft and making strategic veteran add-ons. The rebuild is quietly on track.",
    seasons: [
      { year: 2021, wins: 4, losses: 10, pointsFor: 1340, pointsAgainst: 1690, finish: 10, result: 'miss' },
      { year: 2022, wins: 5, losses: 9, pointsFor: 1420, pointsAgainst: 1660, finish: 9, result: 'miss' },
      { year: 2023, wins: 6, losses: 8, pointsFor: 1490, pointsAgainst: 1600, finish: 10, result: 'miss' },
      { year: 2024, wins: 7, losses: 7, pointsFor: 1570, pointsAgainst: 1580, finish: 8, result: 'playoff' },
      { year: 2025, wins: 6, losses: 8, pointsFor: 1480, pointsAgainst: 1600, finish: 9, result: 'miss' },
    ],
    roster: [
      'Lamar Jackson (QB)',
      'Zack Moss (RB)',
      'Jordan Addison (WR)',
      'Pat Freiermuth (TE)',
      'Darnell Mooney (WR)',
      'AJ Barner (TE)',
    ],
    trades: [
      { year: 2022, gave: '2023 1st', received: 'Lamar Jackson', verdict: 'win', note: 'Bought Lamar early. Has been the most reliable fantasy QB on the roster ever since.' },
      { year: 2023, gave: 'Najee Harris + 2024 3rd', received: 'Jordan Addison (rookie) + 2024 2nd', verdict: 'win', note: 'Smart transition from aging RB to young receiver. Addison has shown real upside.' },
      { year: 2024, gave: '2025 1st', received: 'AJ Barner (draft slot)', verdict: 'push', note: 'Used a first on Barner as a TE1 of the future. Still developing in year one.' },
      { year: 2025, gave: 'Mecole Hardman + 2026 3rd', received: 'Darnell Mooney', verdict: 'push', note: 'Slot WR swap. Mooney is the better fit for the offense long-term.' },
    ],
    funStats: {
      bestWeek: 178.3,
      worstWeek: 58.4,
      biggestWinMargin: 64.2,
      biggestLossMargin: 79.6,
      bestSeasonYear: 2024,
      bestSeasonRecord: '7-7',
    },
    rivalries: [
      { opponent: 'JimmyEatWurld', record: '6-4', description: 'The expansion manager derby. Both teams joined the same year. Bro_Set leads the head-to-head comfortably.' },
      { opponent: 'CheeseAndCrackers', record: '4-6', description: 'CheeseAndCrackers has been the measuring stick for Bro_Set — still trailing, but closing the gap.' },
      { opponent: 'TDTD19844', record: '4-6', description: 'TDTD19844\'s rebuild mirrored Bro_Set\'s but landed ahead. Bro_Set is still chasing that blueprint.' },
    ],
  },
  {
    slug: 'cheeseandcrackers',
    displayName: 'CheeseAndCrackers',
    teamName: 'CheeseAndCrackers',
    championships: [],
    runnerUps: [2022],
    overallRecord: { wins: 41, losses: 42 },
    pointsScored: 6680,
    playoffApps: 4,
    dynastyRank: 11,
    avgPointsPerGame: 112.7,
    bio: "The 2022 runner-up and a consistent playoff presence with four appearances. Narrowly missed the title in 2022, has been knocking on the door since. The most complete manager who hasn't yet won a championship.",
    seasons: [
      { year: 2020, wins: 7, losses: 6, pointsFor: 1570, pointsAgainst: 1540, finish: 4, result: 'miss' },
      { year: 2021, wins: 7, losses: 7, pointsFor: 1590, pointsAgainst: 1640, finish: 7, result: 'miss' },
      { year: 2022, wins: 9, losses: 5, pointsFor: 1740, pointsAgainst: 1620, finish: 3, result: 'runner-up' },
      { year: 2023, wins: 7, losses: 7, pointsFor: 1560, pointsAgainst: 1600, finish: 7, result: 'playoff' },
      { year: 2024, wins: 6, losses: 8, pointsFor: 1480, pointsAgainst: 1590, finish: 8, result: 'playoff' },
      { year: 2025, wins: 5, losses: 9, pointsFor: 1440, pointsAgainst: 1640, finish: 10, result: 'miss' },
    ],
    roster: [
      'Justin Jefferson (WR)',
      'Alvin Kamara (RB)',
      'Jaxon Smith-Njigba (WR)',
      'Kyle Pitts (TE)',
      'Gus Edwards (RB)',
      'Sam Howell (QB)',
    ],
    trades: [
      { year: 2021, gave: '2022 1st', received: 'Justin Jefferson', verdict: 'win', note: 'Jefferson has been a perennial WR1. This trade carries the entire franchise.' },
      { year: 2022, gave: 'Jonathan Taylor + 2023 2nd', received: 'Kyle Pitts + Alvin Kamara', verdict: 'push', note: 'Gambled on Pitts and Kamara for the 2022 run. Reached the championship but Pitts never became what was hoped.' },
      { year: 2023, gave: '2024 1st + 2024 2nd', received: 'Jaxon Smith-Njigba (draft slot)', verdict: 'win', note: 'Moved up for Smith-Njigba as the Jefferson successor. Has shown strong flashes.' },
      { year: 2025, gave: 'Mike Evans + 2026 3rd', received: 'Gus Edwards + 2025 2nd', verdict: 'push', note: 'Salary dump of aging Evans. Edwards is a short-term fill at RB.' },
    ],
    funStats: {
      bestWeek: 196.8,
      worstWeek: 63.2,
      biggestWinMargin: 84.1,
      biggestLossMargin: 68.9,
      bestSeasonYear: 2022,
      bestSeasonRecord: '9-5',
    },
    rivalries: [
      { opponent: 'Grandes', record: '5-7', description: 'The 2022 championship. Grandes beat CheeseAndCrackers in the title game — the defining game of CheeseAndCrackers\'s career so far.' },
      { opponent: 'MLSchools12', record: '3-9', description: 'MLSchools12 is the roadblock every manager faces. CheeseAndCrackers has managed just three wins in twelve tries.' },
      { opponent: 'JuicyBussy', record: '5-7', description: 'JuicyBussy\'s explosiveness is the nightmare matchup for the balanced CheeseAndCrackers roster.' },
    ],
  },
  {
    slug: 'jimmyeatwurld',
    displayName: 'JimmyEatWurld',
    teamName: 'JimmyEatWurld',
    championships: [],
    runnerUps: [],
    overallRecord: { wins: 26, losses: 46 },
    pointsScored: 4740,
    playoffApps: 1,
    dynastyRank: 12,
    avgPointsPerGame: 101.3,
    bio: "The league's chaotic good manager. Expansion team with one playoff appearance and a distinct \"high-risk, high-reward\" trade philosophy that has produced as many memorable wins as catastrophic losses. The most entertaining manager to watch.",
    seasons: [
      { year: 2021, wins: 3, losses: 11, pointsFor: 1280, pointsAgainst: 1710, finish: 12, result: 'miss' },
      { year: 2022, wins: 5, losses: 9, pointsFor: 1410, pointsAgainst: 1660, finish: 11, result: 'miss' },
      { year: 2023, wins: 4, losses: 10, pointsFor: 1330, pointsAgainst: 1680, finish: 11, result: 'miss' },
      { year: 2024, wins: 7, losses: 7, pointsFor: 1560, pointsAgainst: 1580, finish: 9, result: 'playoff' },
      { year: 2025, wins: 7, losses: 7, pointsFor: 1560, pointsAgainst: 1590, finish: 11, result: 'miss' },
    ],
    roster: [
      'Jordan Love (QB)',
      'Zay Flowers (WR)',
      'Jaylen Warren (RB)',
      'Jelani Woods (TE)',
      'Dontayvion Wicks (WR)',
      'MarShawn Lloyd (RB)',
    ],
    trades: [
      { year: 2022, gave: '2023 1st + 2023 2nd', received: 'Jordan Love (devy)', verdict: 'win', note: 'Bought Love as a dynasty stash before anyone believed. The only prescient move of the early years.' },
      { year: 2023, gave: 'Jordan Love (at peak value)', received: '2024 1st + 2024 2nd + 2024 3rd', verdict: 'loss', note: 'Inexplicably sold Love the year before the window opened. Classic JimmyEatWurld.' },
      { year: 2024, gave: '2025 1st + 2025 2nd', received: 'Jordan Love (buy-back)', verdict: 'loss', note: 'Bought Love back at triple the price paid to sell him. Painful but perfectly on brand.' },
      { year: 2025, gave: 'Austin Ekeler + 2026 2nd', received: 'Dontayvion Wicks + MarShawn Lloyd', verdict: 'push', note: 'Bought two upside players for the price of a declining vet. Could work. Could not.' },
    ],
    funStats: {
      bestWeek: 183.6,
      worstWeek: 54.7,
      biggestWinMargin: 71.4,
      biggestLossMargin: 91.2,
      bestSeasonYear: 2024,
      bestSeasonRecord: '7-7',
    },
    rivalries: [
      { opponent: 'Bro_Set', record: '4-6', description: 'The expansion manager rivalry. Bro_Set has been more consistent but JimmyEatWurld has delivered bigger individual weeks.' },
      { opponent: 'Tubes94', record: '2-8', description: 'Tubes94\'s rebuild outpaced JimmyEatWurld\'s by a country mile. The scoreline shows it.' },
      { opponent: 'CheeseAndCrackers', record: '4-8', description: 'CheeseAndCrackers is the consistency ceiling that JimmyEatWurld has yet to reach.' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getResultLabel(result: SeasonRecord['result']): string {
  switch (result) {
    case 'champion': return 'Champion';
    case 'runner-up': return 'Runner-Up';
    case 'playoff': return 'Playoff';
    case 'miss': return 'Missed';
  }
}

function getFinishLabel(finish: number): string {
  if (finish === 1) return '1st';
  if (finish === 2) return '2nd';
  if (finish === 3) return '3rd';
  return `${finish}th`;
}

// ─── getStaticPaths ───────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = MANAGERS.map((m) => ({ params: { slug: m.slug } }));
  return { paths, fallback: false };
};

// ─── getStaticProps ───────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<{ manager: ManagerProfile }> = async ({ params }) => {
  const slug = params?.slug as string;
  const manager = MANAGERS.find((m) => m.slug === slug);
  if (!manager) return { notFound: true };
  return { props: { manager } };
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManagerDetailPage({ manager }: { manager: ManagerProfile }) {
  const isChampion = manager.championships.length > 0;
  const total = manager.overallRecord.wins + manager.overallRecord.losses;
  const winPct = total > 0 ? (manager.overallRecord.wins / total) : 0;
  const winPctStr = winPct.toFixed(3).replace(/^0/, '');

  const allYears = [2020, 2021, 2022, 2023, 2024, 2025];

  return (
    <>
      <Head>
        <title>{manager.displayName} — BMFFFL Manager Profile</title>
        <meta
          name="description"
          content={`${manager.displayName} dynasty profile: ${manager.overallRecord.wins}-${manager.overallRecord.losses} all-time, ${manager.championships.length} championship(s), ${manager.playoffApps} playoff appearances.`}
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <Link
            href="/managers"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            All Managers
          </Link>

          {/* ── Section 1: Hero ───────────────────────────────────────────── */}
          <div
            className={cn(
              'rounded-xl p-6 mb-6',
              'bg-[#16213e] border',
              isChampion ? 'border-[#ffd700]/40' : 'border-[#2d4a66]'
            )}
          >
            <div className="flex items-start gap-5 flex-wrap">
              {/* Avatar */}
              <div
                className={cn(
                  'w-20 h-20 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  isChampion
                    ? 'bg-[#ffd700]/10 border-[#ffd700]'
                    : 'bg-[#0f3460] border-[#2d4a66]'
                )}
              >
                <span
                  className={cn(
                    'text-3xl font-black',
                    isChampion ? 'text-[#ffd700]' : 'text-slate-300'
                  )}
                >
                  {manager.displayName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + rank */}
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-3xl font-black text-white">
                    {manager.displayName}
                  </h1>
                  <Badge
                    variant={manager.dynastyRank === 1 ? 'champion' : 'default'}
                    size="md"
                  >
                    Dynasty #{manager.dynastyRank}
                  </Badge>
                </div>
                <p className="text-slate-400 mb-3 italic">&ldquo;{manager.teamName}&rdquo;</p>

                {/* Championship banners */}
                {manager.championships.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {manager.championships.map((year) => (
                      <span
                        key={year}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/50 text-[#ffd700] text-sm font-bold"
                      >
                        <Trophy className="w-4 h-4" aria-hidden="true" />
                        {year} Champion
                      </span>
                    ))}
                  </div>
                ) : manager.runnerUps.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {manager.runnerUps.map((year) => (
                      <span
                        key={year}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 border border-slate-500/40 text-slate-300 text-sm font-semibold"
                      >
                        <Star className="w-4 h-4" aria-hidden="true" />
                        {year} Runner-Up
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-500 italic">
                    No championships yet
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5 pt-5 border-t border-[#2d4a66]">
              <p className="text-slate-300 leading-relaxed text-sm">{manager.bio}</p>
            </div>
          </div>

          {/* ── Section 2: Career Stats Grid ─────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <StatCard
              label="All-Time Record"
              value={`${manager.overallRecord.wins}-${manager.overallRecord.losses}`}
              subtext={`${total} games played`}
            />
            <StatCard
              label="Win %"
              value={winPctStr}
              subtext="Career average"
              trend={winPct >= 0.5 ? 'up' : 'down'}
            />
            <StatCard
              label="Points Scored"
              value={manager.pointsScored.toLocaleString()}
              subtext="All-time total"
            />
            <StatCard
              label="Playoff Apps"
              value={manager.playoffApps}
              subtext={`of ${manager.seasons.length} seasons`}
            />
            <StatCard
              label="Championships"
              value={manager.championships.length}
              subtext={
                manager.championships.length > 0
                  ? manager.championships.join(', ')
                  : 'No titles yet'
              }
            />
            <StatCard
              label="Avg Pts/Game"
              value={manager.avgPointsPerGame.toFixed(1)}
              subtext="Regular season avg"
            />
          </div>

          {/* ── Section 3: Season-by-Season Table ────────────────────────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-6">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66]">
              <h2 className="text-base font-bold text-white">
                Season-by-Season
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0d1b2a] text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-semibold">Year</th>
                    <th className="px-4 py-3 text-left font-semibold">Record</th>
                    <th className="px-4 py-3 text-right font-semibold">Pts For</th>
                    <th className="px-4 py-3 text-right font-semibold">Pts Agst</th>
                    <th className="px-4 py-3 text-left font-semibold">Finish</th>
                    <th className="px-4 py-3 text-left font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d4a66]">
                  {manager.seasons.map((season) => (
                    <tr
                      key={season.year}
                      className={cn(
                        'transition-colors',
                        season.result === 'champion'
                          ? 'bg-[#ffd700]/5 hover:bg-[#ffd700]/10'
                          : season.result === 'runner-up'
                          ? 'bg-slate-500/5 hover:bg-slate-500/10'
                          : 'bg-[#16213e] hover:bg-[#1a2d42]'
                      )}
                    >
                      <td className="px-4 py-3 font-bold text-white">
                        {season.year}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-200">
                        {season.wins}-{season.losses}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        {season.pointsFor.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">
                        {season.pointsAgainst.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'font-semibold',
                            season.finish === 1
                              ? 'text-[#ffd700]'
                              : season.finish <= 3
                              ? 'text-slate-200'
                              : 'text-slate-400'
                          )}
                        >
                          {getFinishLabel(season.finish)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            season.result === 'champion'
                              ? 'champion'
                              : season.result === 'runner-up'
                              ? 'runner-up'
                              : season.result === 'playoff'
                              ? 'playoff'
                              : 'last'
                          }
                          size="sm"
                        >
                          {getResultLabel(season.result)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Section 4: Championship Timeline ─────────────────────────── */}
          <div className="rounded-xl p-5 bg-[#16213e] border border-[#2d4a66] mb-6">
            <h2 className="text-base font-bold text-white mb-4">
              Championship Timeline
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {allYears.map((year) => {
                const isWin = manager.championships.includes(year);
                const isRU = manager.runnerUps.includes(year);
                const season = manager.seasons.find((s) => s.year === year);
                return (
                  <div
                    key={year}
                    className={cn(
                      'flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[64px]',
                      isWin
                        ? 'bg-[#ffd700]/20 border border-[#ffd700]/50'
                        : isRU
                        ? 'bg-slate-500/10 border border-slate-500/30'
                        : season
                        ? 'bg-[#0d1b2a] border border-[#2d4a66]'
                        : 'bg-[#0d1b2a]/40 border border-[#2d4a66]/30 opacity-40'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-widest font-semibold',
                        isWin ? 'text-[#ffd700]' : 'text-slate-500'
                      )}
                    >
                      {year}
                    </span>
                    {isWin ? (
                      <Trophy
                        className="w-5 h-5 text-[#ffd700]"
                        aria-label={`${year} Champion`}
                      />
                    ) : isRU ? (
                      <Star
                        className="w-5 h-5 text-slate-400"
                        aria-label={`${year} Runner-Up`}
                      />
                    ) : season?.result === 'playoff' ? (
                      <TrendingUp
                        className="w-4 h-4 text-[#22c55e]"
                        aria-label="Playoff"
                      />
                    ) : season ? (
                      <TrendingDown
                        className="w-4 h-4 text-slate-600"
                        aria-label="Missed"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-600">—</span>
                    )}
                    <span
                      className={cn(
                        'text-[9px] font-mono',
                        isWin
                          ? 'text-[#ffd700]'
                          : season
                          ? 'text-slate-500'
                          : 'text-slate-700'
                      )}
                    >
                      {season ? `${season.wins}-${season.losses}` : 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
            {manager.championships.length === 0 && (
              <p className="text-xs text-slate-500 mt-3 italic">
                No championship years yet — gold stars are waiting.
              </p>
            )}
          </div>

          {/* ── Section 5: Current Roster ─────────────────────────────────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-6">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66]">
              <h2 className="text-base font-bold text-white">Key Roster Pieces</h2>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {manager.roster.map((playerStr) => {
                const match = playerStr.match(/^(.+?)\s+\(([A-Z]+)\)$/);
                const name = match ? match[1] : playerStr;
                const pos = match ? match[2] : 'FLEX';
                const posColors: Record<string, string> = {
                  QB: 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30',
                  RB: 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/30',
                  WR: 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/30',
                  TE: 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/30',
                  K:  'text-slate-400 bg-slate-400/10 border-slate-400/30',
                };
                const posClass = posColors[pos] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/30';
                return (
                  <div
                    key={playerStr}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] hover:border-[#3a5f80] transition-colors"
                  >
                    <span
                      className={cn(
                        'text-xs font-bold px-1.5 py-0.5 rounded border flex-shrink-0 w-8 text-center',
                        posClass
                      )}
                    >
                      {pos}
                    </span>
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Section 6: Trade History ──────────────────────────────────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-6">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66]">
              <h2 className="text-base font-bold text-white">Notable Trades</h2>
            </div>
            <div className="divide-y divide-[#2d4a66]">
              {manager.trades.map((trade, i) => (
                <div key={i} className="p-4 hover:bg-[#1a2d42] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {trade.year}
                        </span>
                        <Badge
                          variant={
                            trade.verdict === 'win'
                              ? 'champion'
                              : trade.verdict === 'loss'
                              ? 'last'
                              : 'default'
                          }
                          size="sm"
                        >
                          {trade.verdict === 'win'
                            ? 'Won Trade'
                            : trade.verdict === 'loss'
                            ? 'Lost Trade'
                            : 'Push'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span className="text-[#ef4444] font-medium">
                          OUT: {trade.gave}
                        </span>
                        <span className="text-slate-600">→</span>
                        <span className="text-[#22c55e] font-medium">
                          IN: {trade.received}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {trade.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 7: Fun Stats ──────────────────────────────────────── */}
          <div className="rounded-xl p-5 bg-[#16213e] border border-[#2d4a66] mb-6">
            <h2 className="text-base font-bold text-white mb-4">Fun Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Best Week</span>
                <span className="text-xl font-black text-[#22c55e] font-mono">
                  {manager.funStats.bestWeek}
                </span>
                <span className="text-[10px] text-slate-500">pts — career high</span>
              </div>
              <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Worst Week</span>
                <span className="text-xl font-black text-[#ef4444] font-mono">
                  {manager.funStats.worstWeek}
                </span>
                <span className="text-[10px] text-slate-500">pts — career low</span>
              </div>
              <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Biggest Win</span>
                <span className="text-xl font-black text-[#22c55e] font-mono">
                  +{manager.funStats.biggestWinMargin}
                </span>
                <span className="text-[10px] text-slate-500">largest margin of victory</span>
              </div>
              <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Biggest Loss</span>
                <span className="text-xl font-black text-[#ef4444] font-mono">
                  -{manager.funStats.biggestLossMargin}
                </span>
                <span className="text-[10px] text-slate-500">largest margin of defeat</span>
              </div>
              <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Best Season</span>
                <span className="text-xl font-black text-[#ffd700] font-mono">
                  {manager.funStats.bestSeasonYear}
                </span>
                <span className="text-[10px] text-slate-500">
                  {manager.funStats.bestSeasonRecord} record
                </span>
              </div>
              <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Career Avg</span>
                <span className="text-xl font-black text-slate-200 font-mono">
                  {manager.avgPointsPerGame.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-500">pts/game all-time</span>
              </div>
            </div>
          </div>

          {/* ── Section 8: Head-to-Head Rivalries ────────────────────────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-8">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66] flex items-center gap-2">
              <Swords className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <h2 className="text-base font-bold text-white">
                Key Rivalries
              </h2>
            </div>
            <div className="divide-y divide-[#2d4a66]">
              {manager.rivalries.map((rivalry, i) => (
                <div
                  key={i}
                  className="p-4 hover:bg-[#1a2d42] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">
                      vs. {rivalry.opponent}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#ffd700] bg-[#ffd700]/10 px-2 py-0.5 rounded">
                      {rivalry.record}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rivalry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/managers"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Back to all managers
          </Link>
        </div>
      </main>
    </>
  );
}
