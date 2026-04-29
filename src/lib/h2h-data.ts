/**
 * BMFFFL H2H Records — AUTO-GENERATED
 * Source: bimfle-data/sleeper.db (matchups table, seasons 2020–2025)
 * Generated: 2026-04-29T20:38:45.303Z
 *
 * DO NOT EDIT BY HAND — run scripts/generate-h2h-data.ts to regenerate.
 * Covers Sleeper era only (2020–2025). ESPN era (2016–2019) not available in DB.
 *
 * Key format: 'slugA:slugB' where slugA < slugB lexicographically.
 * Entry: wins = slugA's wins, losses = slugA's losses.
 * Use getH2H(slugA, slugB) helper to look up either direction.
 */

export interface H2HRecord {
  wins: number;
  losses: number;
  games: number;
  avgPtsFor: number;
  avgPtsAgainst: number;
}

export interface OwnerH2HSummary {
  slug: string;
  displayName: string;
  totalWins: number;
  totalLosses: number;
  totalGames: number;
  winPct: number;
  nemesis: string | null;
  bestVictim: string | null;
  biggestRivalry: string | null;
}

/** Raw H2H lookup. Key = 'slugA:slugB' (slugA < slugB). */
export const H2H_RECORDS: Record<string, H2HRecord> = {
  'cogdeill11:escuelas': { wins: 8, losses: 5, games: 13, avgPtsFor: 119.9, avgPtsAgainst: 101.9 },
  'cogdeill11:mlschools12': { wins: 2, losses: 9, games: 11, avgPtsFor: 116.3, avgPtsAgainst: 152.3 },
  'cogdeill11:tubes94': { wins: 2, losses: 3, games: 5, avgPtsFor: 101.6, avgPtsAgainst: 104.8 },
  'cogdeill11:juicybussy': { wins: 2, losses: 4, games: 6, avgPtsFor: 137.5, avgPtsAgainst: 158.3 },
  'cogdeill11:eldridm20': { wins: 3, losses: 4, games: 7, avgPtsFor: 130.4, avgPtsAgainst: 133.1 },
  'cogdeill11:eldridsm': { wins: 3, losses: 5, games: 8, avgPtsFor: 133.3, avgPtsAgainst: 150.7 },
  'cogdeill11:mmoodie12': { wins: 1, losses: 0, games: 1, avgPtsFor: 164, avgPtsAgainst: 100.8 },
  'cogdeill11:tdtd19844': { wins: 5, losses: 3, games: 8, avgPtsFor: 123.1, avgPtsAgainst: 117.5 },
  'cogdeill11:grandes': { wins: 4, losses: 4, games: 8, avgPtsFor: 129.1, avgPtsAgainst: 133.6 },
  'cogdeill11:sexmachineandy': { wins: 3, losses: 5, games: 8, avgPtsFor: 114.4, avgPtsAgainst: 131.9 },
  'cogdeill11:rbr': { wins: 4, losses: 6, games: 10, avgPtsFor: 127.1, avgPtsAgainst: 134.6 },
  'cmaleski:cogdeill11': { wins: 3, losses: 9, games: 12, avgPtsFor: 121.6, avgPtsAgainst: 132.8 },
  'cmaleski:grandes': { wins: 3, losses: 5, games: 8, avgPtsFor: 128.1, avgPtsAgainst: 136.1 },
  'cmaleski:mlschools12': { wins: 2, losses: 10, games: 12, avgPtsFor: 130.5, avgPtsAgainst: 149.7 },
  'cmaleski:sexmachineandy': { wins: 5, losses: 3, games: 8, avgPtsFor: 136.8, avgPtsAgainst: 136.4 },
  'cmaleski:escuelas': { wins: 9, losses: 3, games: 12, avgPtsFor: 131.1, avgPtsAgainst: 101.3 },
  'cmaleski:tubes94': { wins: 3, losses: 4, games: 7, avgPtsFor: 125.8, avgPtsAgainst: 130.6 },
  'cmaleski:juicybussy': { wins: 5, losses: 3, games: 8, avgPtsFor: 135.2, avgPtsAgainst: 132.6 },
  'cmaleski:eldridm20': { wins: 2, losses: 6, games: 8, avgPtsFor: 115.6, avgPtsAgainst: 135 },
  'cmaleski:eldridsm': { wins: 6, losses: 2, games: 8, avgPtsFor: 133.7, avgPtsAgainst: 121.7 },
  'cmaleski:mmoodie12': { wins: 2, losses: 0, games: 2, avgPtsFor: 127.3, avgPtsAgainst: 99.1 },
  'cmaleski:tdtd19844': { wins: 2, losses: 4, games: 6, avgPtsFor: 121.8, avgPtsAgainst: 128.6 },
  'cmaleski:rbr': { wins: 3, losses: 3, games: 6, avgPtsFor: 145.9, avgPtsAgainst: 144.7 },
  'escuelas:grandes': { wins: 3, losses: 5, games: 8, avgPtsFor: 91.7, avgPtsAgainst: 121.7 },
  'escuelas:tubes94': { wins: 3, losses: 4, games: 7, avgPtsFor: 104.1, avgPtsAgainst: 112.1 },
  'escuelas:mmoodie12': { wins: 0, losses: 2, games: 2, avgPtsFor: 106.9, avgPtsAgainst: 122.4 },
  'escuelas:tdtd19844': { wins: 2, losses: 5, games: 7, avgPtsFor: 124.7, avgPtsAgainst: 147.1 },
  'escuelas:mlschools12': { wins: 0, losses: 11, games: 11, avgPtsFor: 108.6, avgPtsAgainst: 161.9 },
  'escuelas:sexmachineandy': { wins: 1, losses: 6, games: 7, avgPtsFor: 114.9, avgPtsAgainst: 132.3 },
  'escuelas:juicybussy': { wins: 2, losses: 6, games: 8, avgPtsFor: 115.4, avgPtsAgainst: 135.8 },
  'escuelas:rbr': { wins: 1, losses: 7, games: 8, avgPtsFor: 95.7, avgPtsAgainst: 122.2 },
  'grandes:mlschools12': { wins: 4, losses: 5, games: 9, avgPtsFor: 135.7, avgPtsAgainst: 162.8 },
  'grandes:sexmachineandy': { wins: 5, losses: 8, games: 13, avgPtsFor: 136.1, avgPtsAgainst: 142.7 },
  'grandes:tubes94': { wins: 3, losses: 2, games: 5, avgPtsFor: 130.7, avgPtsAgainst: 117.5 },
  'grandes:juicybussy': { wins: 5, losses: 7, games: 12, avgPtsFor: 128.7, avgPtsAgainst: 136.4 },
  'grandes:mmoodie12': { wins: 1, losses: 0, games: 1, avgPtsFor: 139, avgPtsAgainst: 75.3 },
  'grandes:rbr': { wins: 5, losses: 8, games: 13, avgPtsFor: 138.7, avgPtsAgainst: 138.5 },
  'grandes:tdtd19844': { wins: 4, losses: 2, games: 6, avgPtsFor: 139.2, avgPtsAgainst: 116.8 },
  'eldridm20:grandes': { wins: 4, losses: 4, games: 8, avgPtsFor: 136.1, avgPtsAgainst: 140 },
  'eldridm20:mlschools12': { wins: 2, losses: 6, games: 8, avgPtsFor: 129.1, avgPtsAgainst: 151.7 },
  'eldridm20:sexmachineandy': { wins: 4, losses: 3, games: 7, avgPtsFor: 137.8, avgPtsAgainst: 132.9 },
  'eldridm20:escuelas': { wins: 4, losses: 3, games: 7, avgPtsFor: 145.7, avgPtsAgainst: 111.8 },
  'eldridm20:tubes94': { wins: 6, losses: 4, games: 10, avgPtsFor: 122.5, avgPtsAgainst: 113.6 },
  'eldridm20:juicybussy': { wins: 2, losses: 5, games: 7, avgPtsFor: 128.7, avgPtsAgainst: 156 },
  'eldridm20:eldridsm': { wins: 6, losses: 8, games: 14, avgPtsFor: 126, avgPtsAgainst: 136.3 },
  'eldridm20:mmoodie12': { wins: 2, losses: 0, games: 2, avgPtsFor: 108.3, avgPtsAgainst: 96.8 },
  'eldridm20:tdtd19844': { wins: 7, losses: 4, games: 11, avgPtsFor: 136.8, avgPtsAgainst: 122.4 },
  'eldridm20:rbr': { wins: 1, losses: 7, games: 8, avgPtsFor: 134.8, avgPtsAgainst: 143.9 },
  'eldridsm:grandes': { wins: 2, losses: 5, games: 7, avgPtsFor: 129.2, avgPtsAgainst: 161.1 },
  'eldridsm:escuelas': { wins: 7, losses: 1, games: 8, avgPtsFor: 142.7, avgPtsAgainst: 94.4 },
  'eldridsm:mlschools12': { wins: 1, losses: 6, games: 7, avgPtsFor: 118.5, avgPtsAgainst: 162.3 },
  'eldridsm:sexmachineandy': { wins: 3, losses: 3, games: 6, avgPtsFor: 128.5, avgPtsAgainst: 125.3 },
  'eldridsm:juicybussy': { wins: 4, losses: 4, games: 8, avgPtsFor: 128.9, avgPtsAgainst: 134.8 },
  'eldridsm:tubes94': { wins: 5, losses: 5, games: 10, avgPtsFor: 125.6, avgPtsAgainst: 112.5 },
  'eldridsm:mmoodie12': { wins: 1, losses: 0, games: 1, avgPtsFor: 120.2, avgPtsAgainst: 106.4 },
  'eldridsm:tdtd19844': { wins: 6, losses: 7, games: 13, avgPtsFor: 137.2, avgPtsAgainst: 140.8 },
  'eldridsm:rbr': { wins: 3, losses: 4, games: 7, avgPtsFor: 127, avgPtsAgainst: 137.8 },
  'mlschools12:tubes94': { wins: 4, losses: 2, games: 6, avgPtsFor: 139.9, avgPtsAgainst: 130.2 },
  'mlschools12:mmoodie12': { wins: 1, losses: 0, games: 1, avgPtsFor: 165.3, avgPtsAgainst: 106.9 },
  'mlschools12:tdtd19844': { wins: 7, losses: 1, games: 8, avgPtsFor: 159.3, avgPtsAgainst: 129 },
  'mlschools12:sexmachineandy': { wins: 7, losses: 1, games: 8, avgPtsFor: 163.4, avgPtsAgainst: 128.4 },
  'mlschools12:rbr': { wins: 6, losses: 2, games: 8, avgPtsFor: 169.5, avgPtsAgainst: 140.8 },
  'juicybussy:mlschools12': { wins: 2, losses: 5, games: 7, avgPtsFor: 142.5, avgPtsAgainst: 159.2 },
  'juicybussy:sexmachineandy': { wins: 5, losses: 8, games: 13, avgPtsFor: 142.4, avgPtsAgainst: 156.6 },
  'juicybussy:tubes94': { wins: 4, losses: 2, games: 6, avgPtsFor: 140.6, avgPtsAgainst: 129 },
  'juicybussy:mmoodie12': { wins: 1, losses: 0, games: 1, avgPtsFor: 154.9, avgPtsAgainst: 108.4 },
  'juicybussy:tdtd19844': { wins: 5, losses: 4, games: 9, avgPtsFor: 140.4, avgPtsAgainst: 126.6 },
  'juicybussy:rbr': { wins: 7, losses: 5, games: 12, avgPtsFor: 144.1, avgPtsAgainst: 138.2 },
  'sexmachineandy:tubes94': { wins: 4, losses: 2, games: 6, avgPtsFor: 126.3, avgPtsAgainst: 120.9 },
  'sexmachineandy:tdtd19844': { wins: 4, losses: 3, games: 7, avgPtsFor: 125.3, avgPtsAgainst: 126.5 },
  'mmoodie12:sexmachineandy': { wins: 0, losses: 1, games: 1, avgPtsFor: 123.1, avgPtsAgainst: 158.2 },
  'mmoodie12:rbr': { wins: 2, losses: 0, games: 2, avgPtsFor: 135.1, avgPtsAgainst: 119.4 },
  'mmoodie12:tdtd19844': { wins: 1, losses: 0, games: 1, avgPtsFor: 153.6, avgPtsAgainst: 102.1 },
  'rbr:sexmachineandy': { wins: 4, losses: 8, games: 12, avgPtsFor: 135.1, avgPtsAgainst: 141.9 },
  'rbr:tubes94': { wins: 1, losses: 4, games: 5, avgPtsFor: 106.1, avgPtsAgainst: 145.9 },
  'rbr:tdtd19844': { wins: 5, losses: 3, games: 8, avgPtsFor: 135.7, avgPtsAgainst: 124 },
  'tdtd19844:tubes94': { wins: 7, losses: 6, games: 13, avgPtsFor: 119.2, avgPtsAgainst: 121.6 },
};

/** Per-owner H2H summary stats, sorted by overall H2H win%. */
export const H2H_SUMMARIES: OwnerH2HSummary[] = [
  {
    slug: 'mlschools12',
    displayName: 'MLSchools12',
    totalWins: 77,
    totalLosses: 19,
    totalGames: 96,
    winPct: 0.802,
    nemesis: 'grandes',
    bestVictim: 'escuelas',
    biggestRivalry: 'cmaleski',
  },
  {
    slug: 'sexmachineandy',
    displayName: 'SexMachineAndyD',
    totalWins: 54,
    totalLosses: 42,
    totalGames: 96,
    winPct: 0.563,
    nemesis: 'mlschools12',
    bestVictim: 'grandes',
    biggestRivalry: 'grandes',
  },
  {
    slug: 'juicybussy',
    displayName: 'JuicyBussy',
    totalWins: 53,
    totalLosses: 44,
    totalGames: 97,
    winPct: 0.546,
    nemesis: 'sexmachineandy',
    bestVictim: 'grandes',
    biggestRivalry: 'sexmachineandy',
  },
  {
    slug: 'rbr',
    displayName: 'rbr',
    totalWins: 52,
    totalLosses: 47,
    totalGames: 99,
    winPct: 0.525,
    nemesis: 'sexmachineandy',
    bestVictim: 'grandes',
    biggestRivalry: 'grandes',
  },
  {
    slug: 'grandes',
    displayName: 'Grandes',
    totalWins: 50,
    totalLosses: 48,
    totalGames: 98,
    winPct: 0.51,
    nemesis: 'sexmachineandy',
    bestVictim: 'sexmachineandy',
    biggestRivalry: 'sexmachineandy',
  },
  {
    slug: 'eldridm20',
    displayName: 'eldridm20',
    totalWins: 48,
    totalLosses: 49,
    totalGames: 97,
    winPct: 0.495,
    nemesis: 'eldridsm',
    bestVictim: 'tdtd19844',
    biggestRivalry: 'eldridsm',
  },
  {
    slug: 'eldridsm',
    displayName: 'eldridsm',
    totalWins: 47,
    totalLosses: 50,
    totalGames: 97,
    winPct: 0.485,
    nemesis: 'tdtd19844',
    bestVictim: 'eldridm20',
    biggestRivalry: 'eldridm20',
  },
  {
    slug: 'tubes94',
    displayName: 'Tubes94',
    totalWins: 38,
    totalLosses: 42,
    totalGames: 80,
    winPct: 0.475,
    nemesis: 'tdtd19844',
    bestVictim: 'tdtd19844',
    biggestRivalry: 'tdtd19844',
  },
  {
    slug: 'cogdeill11',
    displayName: 'Cogdeill11',
    totalWins: 46,
    totalLosses: 51,
    totalGames: 97,
    winPct: 0.474,
    nemesis: 'mlschools12',
    bestVictim: 'cmaleski',
    biggestRivalry: 'escuelas',
  },
  {
    slug: 'cmaleski',
    displayName: 'Cmaleski',
    totalWins: 45,
    totalLosses: 52,
    totalGames: 97,
    winPct: 0.464,
    nemesis: 'mlschools12',
    bestVictim: 'escuelas',
    biggestRivalry: 'mlschools12',
  },
  {
    slug: 'tdtd19844',
    displayName: 'tdtd19844',
    totalWins: 43,
    totalLosses: 54,
    totalGames: 97,
    winPct: 0.443,
    nemesis: 'mlschools12',
    bestVictim: 'eldridsm',
    biggestRivalry: 'eldridsm',
  },
  {
    slug: 'mmoodie12',
    displayName: 'MMoodie12',
    totalWins: 5,
    totalLosses: 10,
    totalGames: 15,
    winPct: 0.333,
    nemesis: 'eldridm20',
    bestVictim: 'rbr',
    biggestRivalry: 'rbr',
  },
  {
    slug: 'escuelas',
    displayName: 'MCSchools',
    totalWins: 24,
    totalLosses: 74,
    totalGames: 98,
    winPct: 0.245,
    nemesis: 'mlschools12',
    bestVictim: 'cogdeill11',
    biggestRivalry: 'cogdeill11',
  }
];

/**
 * Get H2H record between two owners (direction-aware).
 * Returns { wins, losses, games, avgPtsFor, avgPtsAgainst } from ownerA's perspective.
 * Returns null if no games played between these two owners.
 */
export function getH2H(slugA: string, slugB: string): H2HRecord | null {
  const [keyA, keyB, flip] = slugA < slugB
    ? [slugA, slugB, false]
    : [slugB, slugA, true];
  const entry = H2H_RECORDS[`${keyA}:${keyB}`];
  if (!entry) return null;
  if (flip) {
    return {
      wins: entry.losses,
      losses: entry.wins,
      games: entry.games,
      avgPtsFor: entry.avgPtsAgainst,
      avgPtsAgainst: entry.avgPtsFor,
    };
  }
  return entry;
}

/** All owner slugs that appear in the H2H data. */
export const H2H_OWNER_SLUGS = ["mlschools12","sexmachineandy","cogdeill11","grandes","rbr","eldridsm","juicybussy","tdtd19844","eldridm20","tubes94","cmaleski","mmoodie12","escuelas"] as const;

/** Display name lookup for H2H owners. */
export const H2H_DISPLAY_NAMES: Record<string, string> = {
  "mlschools12": "MLSchools12",
  "sexmachineandy": "SexMachineAndyD",
  "cogdeill11": "Cogdeill11",
  "grandes": "Grandes",
  "rbr": "rbr",
  "eldridsm": "eldridsm",
  "juicybussy": "JuicyBussy",
  "tdtd19844": "tdtd19844",
  "eldridm20": "eldridm20",
  "tubes94": "Tubes94",
  "cmaleski": "Cmaleski",
  "mmoodie12": "MMoodie12",
  "escuelas": "MCSchools"
};
