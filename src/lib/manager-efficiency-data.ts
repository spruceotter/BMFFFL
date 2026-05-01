/**
 * BMFFFL Manager Efficiency Data — AUTO-GENERATED
 * Source: bimfle-data/sleeper.db → analytics_v_efficiency_scores
 * Covers: Sleeper era 2020–2025 (6 seasons)
 * Generated: 2026-04-29T21:58:01.410Z
 *
 * DO NOT EDIT BY HAND — run scripts/generate-manager-efficiency.ts to regenerate.
 *
 * efficiency_pct = actual_points / optimal_points × 100
 * Grades: Elite ≥92%, Good ≥87%, Average ≥82%, Poor <82%
 */

export interface EfficiencySeasonRecord {
  avgEfficiency: number;    // avg efficiency% for the season
  benchMistakes: number;    // total bench errors (better player left on bench)
  gamesLostToLineup: number; // games where lineup cost them the win
  avgActualPts: number;     // avg points scored
  avgOptimalPts: number;    // avg optimal lineup points
  weeks: number;            // weeks of data
  grade: string;            // 'Elite' | 'Good' | 'Average' | 'Poor'
}

export interface ManagerEfficiencyRecord {
  slug: string;
  displayName: string;
  careerAvgEfficiency: number;  // career avg across all seasons
  careerBenchMistakes: number;  // total career bench errors
  careerGamesLostToLineup: number; // total career games lost to lineup
  totalWeeks: number;
  seasonsPlayed: number;
  firstSeason: number;
  lastSeason: number;
  grade: string;            // career grade
  seasons: Record<string, EfficiencySeasonRecord>;  // keyed by year string '2020'–'2025'
}

/** Manager efficiency records sorted by career avg efficiency (desc). */
export const MANAGER_EFFICIENCY: ManagerEfficiencyRecord[] = [
  {
    slug: 'rbr', displayName: 'rbr',
    careerAvgEfficiency: 91.9,
    careerBenchMistakes: 323,
    careerGamesLostToLineup: 46,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Good',
    seasons: {
    '2020': { avgEfficiency: 89.2, benchMistakes: 50, gamesLostToLineup: 8, avgActualPts: 143.5, avgOptimalPts: 161.3, weeks: 17, grade: 'Good' },
    '2021': { avgEfficiency: 91, benchMistakes: 68, gamesLostToLineup: 7, avgActualPts: 135.3, avgOptimalPts: 149.7, weeks: 18, grade: 'Good' },
    '2022': { avgEfficiency: 95.2, benchMistakes: 48, gamesLostToLineup: 5, avgActualPts: 146.3, avgOptimalPts: 155, weeks: 18, grade: 'Elite' },
    '2023': { avgEfficiency: 89.4, benchMistakes: 47, gamesLostToLineup: 10, avgActualPts: 125, avgOptimalPts: 138.8, weeks: 18, grade: 'Good' },
    '2024': { avgEfficiency: 91.8, benchMistakes: 51, gamesLostToLineup: 7, avgActualPts: 134.7, avgOptimalPts: 147.5, weeks: 18, grade: 'Good' },
    '2025': { avgEfficiency: 94.3, benchMistakes: 59, gamesLostToLineup: 9, avgActualPts: 120.8, avgOptimalPts: 129.5, weeks: 18, grade: 'Elite' }
    },
  },
  {
    slug: 'tdtd19844', displayName: 'tdtd19844',
    careerAvgEfficiency: 88.2,
    careerBenchMistakes: 470,
    careerGamesLostToLineup: 54,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Good',
    seasons: {
    '2020': { avgEfficiency: 84.3, benchMistakes: 73, gamesLostToLineup: 9, avgActualPts: 138.6, avgOptimalPts: 165.5, weeks: 17, grade: 'Average' },
    '2021': { avgEfficiency: 91.4, benchMistakes: 74, gamesLostToLineup: 9, avgActualPts: 116.9, avgOptimalPts: 127.6, weeks: 18, grade: 'Good' },
    '2022': { avgEfficiency: 85.6, benchMistakes: 96, gamesLostToLineup: 12, avgActualPts: 107.7, avgOptimalPts: 127, weeks: 18, grade: 'Average' },
    '2023': { avgEfficiency: 90.8, benchMistakes: 64, gamesLostToLineup: 10, avgActualPts: 117.2, avgOptimalPts: 128.9, weeks: 18, grade: 'Good' },
    '2024': { avgEfficiency: 89.3, benchMistakes: 83, gamesLostToLineup: 8, avgActualPts: 134.4, avgOptimalPts: 152.9, weeks: 18, grade: 'Good' },
    '2025': { avgEfficiency: 87.8, benchMistakes: 80, gamesLostToLineup: 6, avgActualPts: 139, avgOptimalPts: 158.3, weeks: 18, grade: 'Good' }
    },
  },
  {
    slug: 'juicybussy', displayName: 'JuicyBussy',
    careerAvgEfficiency: 87.3,
    careerBenchMistakes: 320,
    careerGamesLostToLineup: 44,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Good',
    seasons: {
    '2020': { avgEfficiency: 93.3, benchMistakes: 48, gamesLostToLineup: 9, avgActualPts: 137.3, avgOptimalPts: 147.3, weeks: 17, grade: 'Elite' },
    '2021': { avgEfficiency: 83.3, benchMistakes: 58, gamesLostToLineup: 6, avgActualPts: 140.8, avgOptimalPts: 166.7, weeks: 18, grade: 'Average' },
    '2022': { avgEfficiency: 90.8, benchMistakes: 39, gamesLostToLineup: 6, avgActualPts: 146.2, avgOptimalPts: 160.1, weeks: 18, grade: 'Good' },
    '2023': { avgEfficiency: 88.9, benchMistakes: 65, gamesLostToLineup: 6, avgActualPts: 137, avgOptimalPts: 154, weeks: 18, grade: 'Good' },
    '2024': { avgEfficiency: 85.8, benchMistakes: 46, gamesLostToLineup: 8, avgActualPts: 140.6, avgOptimalPts: 164.3, weeks: 18, grade: 'Average' },
    '2025': { avgEfficiency: 81.8, benchMistakes: 64, gamesLostToLineup: 9, avgActualPts: 132.3, avgOptimalPts: 161.7, weeks: 18, grade: 'Poor' }
    },
  },
  {
    slug: 'mmoodie12', displayName: 'MMoodie12',
    careerAvgEfficiency: 87,
    careerBenchMistakes: 81,
    careerGamesLostToLineup: 10,
    totalWeeks: 17,
    seasonsPlayed: 1,
    firstSeason: 2020, lastSeason: 2020,
    grade: 'Good',
    seasons: {
    '2020': { avgEfficiency: 87, benchMistakes: 81, gamesLostToLineup: 10, avgActualPts: 109.6, avgOptimalPts: 126.5, weeks: 17, grade: 'Good' }
    },
  },
  {
    slug: 'sexmachineandy', displayName: 'SexMachineAndyD',
    careerAvgEfficiency: 86.8,
    careerBenchMistakes: 485,
    careerGamesLostToLineup: 38,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Average',
    seasons: {
    '2020': { avgEfficiency: 84.3, benchMistakes: 112, gamesLostToLineup: 6, avgActualPts: 143.3, avgOptimalPts: 170.7, weeks: 17, grade: 'Average' },
    '2021': { avgEfficiency: 83, benchMistakes: 92, gamesLostToLineup: 5, avgActualPts: 141.7, avgOptimalPts: 171.1, weeks: 18, grade: 'Average' },
    '2022': { avgEfficiency: 86.3, benchMistakes: 67, gamesLostToLineup: 8, avgActualPts: 127.2, avgOptimalPts: 148.8, weeks: 18, grade: 'Average' },
    '2023': { avgEfficiency: 94.4, benchMistakes: 69, gamesLostToLineup: 10, avgActualPts: 110.6, avgOptimalPts: 118.8, weeks: 18, grade: 'Elite' },
    '2024': { avgEfficiency: 86.7, benchMistakes: 72, gamesLostToLineup: 3, avgActualPts: 150.5, avgOptimalPts: 174.9, weeks: 18, grade: 'Average' },
    '2025': { avgEfficiency: 85.9, benchMistakes: 73, gamesLostToLineup: 6, avgActualPts: 139.7, avgOptimalPts: 161.3, weeks: 18, grade: 'Average' }
    },
  },
  {
    slug: 'mlschools12', displayName: 'MLSchools12',
    careerAvgEfficiency: 86,
    careerBenchMistakes: 483,
    careerGamesLostToLineup: 19,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Average',
    seasons: {
    '2020': { avgEfficiency: 85.7, benchMistakes: 79, gamesLostToLineup: 3, avgActualPts: 164.7, avgOptimalPts: 191.7, weeks: 17, grade: 'Average' },
    '2021': { avgEfficiency: 84.5, benchMistakes: 77, gamesLostToLineup: 3, avgActualPts: 162.6, avgOptimalPts: 192.9, weeks: 18, grade: 'Average' },
    '2022': { avgEfficiency: 84.1, benchMistakes: 81, gamesLostToLineup: 5, avgActualPts: 157.7, avgOptimalPts: 189, weeks: 18, grade: 'Average' },
    '2023': { avgEfficiency: 87.2, benchMistakes: 86, gamesLostToLineup: 2, avgActualPts: 158.2, avgOptimalPts: 182.4, weeks: 18, grade: 'Good' },
    '2024': { avgEfficiency: 86.8, benchMistakes: 82, gamesLostToLineup: 4, avgActualPts: 142.5, avgOptimalPts: 164.6, weeks: 18, grade: 'Average' },
    '2025': { avgEfficiency: 87.9, benchMistakes: 78, gamesLostToLineup: 2, avgActualPts: 142.9, avgOptimalPts: 162.1, weeks: 18, grade: 'Good' }
    },
  },
  {
    slug: 'eldridm20', displayName: 'eldridm20',
    careerAvgEfficiency: 85.8,
    careerBenchMistakes: 437,
    careerGamesLostToLineup: 48,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Average',
    seasons: {
    '2020': { avgEfficiency: 85.5, benchMistakes: 76, gamesLostToLineup: 9, avgActualPts: 128.9, avgOptimalPts: 151.2, weeks: 17, grade: 'Average' },
    '2021': { avgEfficiency: 82.4, benchMistakes: 73, gamesLostToLineup: 7, avgActualPts: 128.4, avgOptimalPts: 155.3, weeks: 18, grade: 'Average' },
    '2022': { avgEfficiency: 82, benchMistakes: 75, gamesLostToLineup: 8, avgActualPts: 121, avgOptimalPts: 147.7, weeks: 18, grade: 'Average' },
    '2023': { avgEfficiency: 87.1, benchMistakes: 73, gamesLostToLineup: 7, avgActualPts: 136.8, avgOptimalPts: 157.5, weeks: 18, grade: 'Good' },
    '2024': { avgEfficiency: 98.1, benchMistakes: 56, gamesLostToLineup: 8, avgActualPts: 137.6, avgOptimalPts: 140.9, weeks: 18, grade: 'Elite' },
    '2025': { avgEfficiency: 79.8, benchMistakes: 84, gamesLostToLineup: 9, avgActualPts: 127.8, avgOptimalPts: 159.8, weeks: 18, grade: 'Poor' }
    },
  },
  {
    slug: 'grandes', displayName: 'Grandes',
    careerAvgEfficiency: 84.1,
    careerBenchMistakes: 548,
    careerGamesLostToLineup: 46,
    totalWeeks: 108,
    seasonsPlayed: 7,
    firstSeason: 2019, lastSeason: 2025,
    grade: 'Average',
    seasons: {
    '2019': { avgEfficiency: 72.4, benchMistakes: 4, gamesLostToLineup: 0, avgActualPts: 93.5, avgOptimalPts: 129.1, weeks: 1, grade: 'Poor' },
    '2020': { avgEfficiency: 82.2, benchMistakes: 101, gamesLostToLineup: 11, avgActualPts: 132.3, avgOptimalPts: 161.1, weeks: 17, grade: 'Average' },
    '2021': { avgEfficiency: 84.2, benchMistakes: 87, gamesLostToLineup: 5, avgActualPts: 136.3, avgOptimalPts: 161.9, weeks: 18, grade: 'Average' },
    '2022': { avgEfficiency: 83.6, benchMistakes: 95, gamesLostToLineup: 6, avgActualPts: 145.8, avgOptimalPts: 174.4, weeks: 18, grade: 'Average' },
    '2023': { avgEfficiency: 86.1, benchMistakes: 81, gamesLostToLineup: 6, avgActualPts: 150.6, avgOptimalPts: 176.3, weeks: 18, grade: 'Average' },
    '2024': { avgEfficiency: 82.1, benchMistakes: 88, gamesLostToLineup: 6, avgActualPts: 131.7, avgOptimalPts: 161.1, weeks: 18, grade: 'Average' },
    '2025': { avgEfficiency: 86.8, benchMistakes: 92, gamesLostToLineup: 12, avgActualPts: 105.3, avgOptimalPts: 121.7, weeks: 18, grade: 'Average' }
    },
  },
  {
    slug: 'escuelas', displayName: 'MCSchools',
    careerAvgEfficiency: 83.6,
    careerBenchMistakes: 473,
    careerGamesLostToLineup: 73,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Average',
    seasons: {
    '2020': { avgEfficiency: 89.5, benchMistakes: 57, gamesLostToLineup: 11, avgActualPts: 117.3, avgOptimalPts: 132.1, weeks: 17, grade: 'Good' },
    '2021': { avgEfficiency: 82.8, benchMistakes: 66, gamesLostToLineup: 14, avgActualPts: 95.7, avgOptimalPts: 115.4, weeks: 18, grade: 'Average' },
    '2022': { avgEfficiency: 81.1, benchMistakes: 81, gamesLostToLineup: 12, avgActualPts: 97.3, avgOptimalPts: 119.5, weeks: 18, grade: 'Poor' },
    '2023': { avgEfficiency: 87.4, benchMistakes: 75, gamesLostToLineup: 13, avgActualPts: 105.1, avgOptimalPts: 120.7, weeks: 18, grade: 'Good' },
    '2024': { avgEfficiency: 75.3, benchMistakes: 111, gamesLostToLineup: 13, avgActualPts: 85.8, avgOptimalPts: 113.6, weeks: 18, grade: 'Poor' },
    '2025': { avgEfficiency: 86.1, benchMistakes: 83, gamesLostToLineup: 10, avgActualPts: 115.3, avgOptimalPts: 134.3, weeks: 18, grade: 'Average' }
    },
  },
  {
    slug: 'cmaleski', displayName: 'Cmaleski',
    careerAvgEfficiency: 83.1,
    careerBenchMistakes: 464,
    careerGamesLostToLineup: 52,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Average',
    seasons: {
    '2020': { avgEfficiency: 78.5, benchMistakes: 88, gamesLostToLineup: 7, avgActualPts: 127.3, avgOptimalPts: 162.5, weeks: 17, grade: 'Poor' },
    '2021': { avgEfficiency: 85, benchMistakes: 59, gamesLostToLineup: 11, avgActualPts: 121.4, avgOptimalPts: 143.3, weeks: 18, grade: 'Average' },
    '2022': { avgEfficiency: 86.9, benchMistakes: 66, gamesLostToLineup: 7, avgActualPts: 120.4, avgOptimalPts: 139.5, weeks: 18, grade: 'Average' },
    '2023': { avgEfficiency: 86.5, benchMistakes: 92, gamesLostToLineup: 6, avgActualPts: 135, avgOptimalPts: 157.2, weeks: 18, grade: 'Average' },
    '2024': { avgEfficiency: 76.4, benchMistakes: 89, gamesLostToLineup: 11, avgActualPts: 122, avgOptimalPts: 162.1, weeks: 18, grade: 'Poor' },
    '2025': { avgEfficiency: 84.8, benchMistakes: 70, gamesLostToLineup: 10, avgActualPts: 137.6, avgOptimalPts: 161.7, weeks: 18, grade: 'Average' }
    },
  },
  {
    slug: 'tubes94', displayName: 'Tubes94',
    careerAvgEfficiency: 83,
    careerBenchMistakes: 460,
    careerGamesLostToLineup: 41,
    totalWeeks: 90,
    seasonsPlayed: 5,
    firstSeason: 2021, lastSeason: 2025,
    grade: 'Average',
    seasons: {
    '2021': { avgEfficiency: 79.7, benchMistakes: 83, gamesLostToLineup: 14, avgActualPts: 104.5, avgOptimalPts: 130.5, weeks: 18, grade: 'Poor' },
    '2022': { avgEfficiency: 79.2, benchMistakes: 84, gamesLostToLineup: 12, avgActualPts: 91, avgOptimalPts: 115.1, weeks: 18, grade: 'Poor' },
    '2023': { avgEfficiency: 82.4, benchMistakes: 97, gamesLostToLineup: 7, avgActualPts: 128.2, avgOptimalPts: 155.7, weeks: 18, grade: 'Average' },
    '2024': { avgEfficiency: 87.1, benchMistakes: 92, gamesLostToLineup: 4, avgActualPts: 139.4, avgOptimalPts: 161.5, weeks: 18, grade: 'Good' },
    '2025': { avgEfficiency: 86.4, benchMistakes: 104, gamesLostToLineup: 4, avgActualPts: 141.9, avgOptimalPts: 165.9, weeks: 18, grade: 'Average' }
    },
  },
  {
    slug: 'eldridsm', displayName: 'eldridsm',
    careerAvgEfficiency: 81.7,
    careerBenchMistakes: 545,
    careerGamesLostToLineup: 50,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Poor',
    seasons: {
    '2020': { avgEfficiency: 81.9, benchMistakes: 69, gamesLostToLineup: 6, avgActualPts: 142.8, avgOptimalPts: 174.2, weeks: 17, grade: 'Poor' },
    '2021': { avgEfficiency: 80.4, benchMistakes: 112, gamesLostToLineup: 9, avgActualPts: 128, avgOptimalPts: 159.3, weeks: 18, grade: 'Poor' },
    '2022': { avgEfficiency: 79.5, benchMistakes: 103, gamesLostToLineup: 8, avgActualPts: 132.4, avgOptimalPts: 167.1, weeks: 18, grade: 'Poor' },
    '2023': { avgEfficiency: 83.4, benchMistakes: 93, gamesLostToLineup: 7, avgActualPts: 133.4, avgOptimalPts: 159.7, weeks: 18, grade: 'Average' },
    '2024': { avgEfficiency: 78.8, benchMistakes: 99, gamesLostToLineup: 11, avgActualPts: 113.9, avgOptimalPts: 144.6, weeks: 18, grade: 'Poor' },
    '2025': { avgEfficiency: 86.1, benchMistakes: 69, gamesLostToLineup: 9, avgActualPts: 125.4, avgOptimalPts: 146, weeks: 18, grade: 'Average' }
    },
  },
  {
    slug: 'cogdeill11', displayName: 'Cogdeill11',
    careerAvgEfficiency: 80.6,
    careerBenchMistakes: 558,
    careerGamesLostToLineup: 51,
    totalWeeks: 107,
    seasonsPlayed: 6,
    firstSeason: 2020, lastSeason: 2025,
    grade: 'Poor',
    seasons: {
    '2020': { avgEfficiency: 85.4, benchMistakes: 84, gamesLostToLineup: 3, avgActualPts: 151.1, avgOptimalPts: 177.8, weeks: 17, grade: 'Average' },
    '2021': { avgEfficiency: 80.6, benchMistakes: 74, gamesLostToLineup: 7, avgActualPts: 141.3, avgOptimalPts: 175.5, weeks: 18, grade: 'Poor' },
    '2022': { avgEfficiency: 78.3, benchMistakes: 95, gamesLostToLineup: 8, avgActualPts: 111.1, avgOptimalPts: 141.9, weeks: 18, grade: 'Poor' },
    '2023': { avgEfficiency: 77.6, benchMistakes: 112, gamesLostToLineup: 11, avgActualPts: 108.5, avgOptimalPts: 140.7, weeks: 18, grade: 'Poor' },
    '2024': { avgEfficiency: 83.6, benchMistakes: 105, gamesLostToLineup: 12, avgActualPts: 119.9, avgOptimalPts: 144.2, weeks: 18, grade: 'Average' },
    '2025': { avgEfficiency: 78.3, benchMistakes: 88, gamesLostToLineup: 10, avgActualPts: 114.5, avgOptimalPts: 146.7, weeks: 18, grade: 'Poor' }
    },
  }
];

/** League-wide average efficiency per season (for benchmarking). */
export const LEAGUE_AVG_EFFICIENCY: Record<string, number> = {
  '2019': 72.4,
  '2020': 85.6,
  '2021': 84,
  '2022': 84.4,
  '2023': 86.8,
  '2024': 85.1,
  '2025': 85.5
};

/** Get efficiency record for a single manager by slug. */
export function getEfficiency(slug: string): ManagerEfficiencyRecord | null {
  return MANAGER_EFFICIENCY.find(r => r.slug === slug) ?? null;
}
