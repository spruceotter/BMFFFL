/**
 * BMFFFL Manager Efficiency Data Generator
 *
 * Generates src/lib/manager-efficiency-data.ts from:
 *   bimfle-data/sleeper.db → analytics_v_efficiency_scores view
 *
 * Run: npx tsx scripts/generate-manager-efficiency.ts
 *
 * Source view: analytics_v_efficiency_scores
 *   - Per-week efficiency per owner per season (Sleeper era 2020-2025)
 *   - efficiency_pct = actual_points / optimal_points × 100
 *   - bench_mistakes = number of suboptimal bench decisions
 *   - lost_due_to_lineup = 1 if lineup mistake cost the game
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require('/home/bimfle/bimfle/node_modules/better-sqlite3') as typeof import('better-sqlite3');
import * as fs from 'fs';
import * as path from 'path';

// ─── Owner Name → Slug + Display Map ──────────────────────────────────────────
// Maps analytics_v_efficiency_scores.owner_name → { slug, displayName }

const OWNER_MAP: Record<string, { slug: string; displayName: string }> = {
  'rbr':           { slug: 'rbr',            displayName: 'rbr' },
  'MLSchools12':   { slug: 'mlschools12',    displayName: 'MLSchools12' },
  'Grandes':       { slug: 'grandes',        displayName: 'Grandes' },
  'Cogdeill11':    { slug: 'cogdeill11',     displayName: 'Cogdeill11' },
  'Tubes94':       { slug: 'tubes94',        displayName: 'Tubes94' },
  'MilwaukeeBrowns': { slug: 'sexmachineandy', displayName: 'SexMachineAndyD' },
  'maleskcr1':     { slug: 'cmaleski',       displayName: 'Cmaleski' },
  'eldridm20':     { slug: 'eldridm20',      displayName: 'eldridm20' },
  'eldridsm':      { slug: 'eldridsm',       displayName: 'eldridsm' },
  'tdtd19844':     { slug: 'tdtd19844',      displayName: 'tdtd19844' },
  'delaurmr':      { slug: 'juicybussy',     displayName: 'JuicyBussy' },
  'MCSchools':     { slug: 'escuelas',       displayName: 'MCSchools' },
  // Alumni
  'mmoodie12':     { slug: 'mmoodie12',      displayName: 'MMoodie12' },
};

// ─── DB Query ─────────────────────────────────────────────────────────────────

const db = new Database('/home/bimfle/bimfle-data/sleeper.db', { readonly: true });

interface CareerRow {
  owner_name: string;
  career_avg_efficiency: number;
  career_bench_mistakes: number;
  career_games_lost_to_lineup: number;
  total_weeks: number;
  seasons_played: number;
  first_season: string;
  last_season: string;
}

interface SeasonRow {
  owner_name: string;
  season: string;
  avg_efficiency: number;
  bench_mistakes: number;
  games_lost_to_lineup: number;
  avg_actual_pts: number;
  avg_optimal_pts: number;
  weeks: number;
}

const careerRows = db.prepare(`
  SELECT owner_name,
    ROUND(AVG(efficiency_pct), 1) as career_avg_efficiency,
    SUM(bench_mistakes) as career_bench_mistakes,
    SUM(lost_due_to_lineup) as career_games_lost_to_lineup,
    COUNT(*) as total_weeks,
    COUNT(DISTINCT season) as seasons_played,
    MIN(season) as first_season,
    MAX(season) as last_season
  FROM analytics_v_efficiency_scores
  GROUP BY owner_name
  ORDER BY career_avg_efficiency DESC
`).all() as CareerRow[];

const seasonRows = db.prepare(`
  SELECT owner_name, season,
    ROUND(AVG(efficiency_pct), 1) as avg_efficiency,
    SUM(bench_mistakes) as bench_mistakes,
    SUM(lost_due_to_lineup) as games_lost_to_lineup,
    ROUND(AVG(actual_points), 1) as avg_actual_pts,
    ROUND(AVG(optimal_points), 1) as avg_optimal_pts,
    COUNT(*) as weeks
  FROM analytics_v_efficiency_scores
  GROUP BY owner_name, season
  ORDER BY owner_name, season
`).all() as SeasonRow[];

db.close();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function efficiencyGrade(pct: number): string {
  if (pct >= 92) return 'Elite';
  if (pct >= 87) return 'Good';
  if (pct >= 82) return 'Average';
  return 'Poor';
}

// ─── Build Typed Data ─────────────────────────────────────────────────────────

// Career records (current owners only — Sleeper era, exclude alumni like mmoodie12 if desired)
const careerData = careerRows
  .filter(r => OWNER_MAP[r.owner_name])
  .map(r => {
    const owner = OWNER_MAP[r.owner_name];
    return {
      slug: owner.slug,
      displayName: owner.displayName,
      careerAvgEfficiency: r.career_avg_efficiency,
      careerBenchMistakes: r.career_bench_mistakes,
      careerGamesLostToLineup: r.career_games_lost_to_lineup,
      totalWeeks: r.total_weeks,
      seasonsPlayed: r.seasons_played,
      firstSeason: parseInt(r.first_season),
      lastSeason: parseInt(r.last_season),
      grade: efficiencyGrade(r.career_avg_efficiency),
    };
  });

// Season records indexed by slug
const seasonsBySeason: Record<string, Record<string, {
  avgEfficiency: number;
  benchMistakes: number;
  gamesLostToLineup: number;
  avgActualPts: number;
  avgOptimalPts: number;
  weeks: number;
  grade: string;
}>> = {};

for (const row of seasonRows) {
  const owner = OWNER_MAP[row.owner_name];
  if (!owner) continue;
  const { slug } = owner;
  if (!seasonsBySeason[slug]) seasonsBySeason[slug] = {};
  seasonsBySeason[slug][row.season] = {
    avgEfficiency: row.avg_efficiency,
    benchMistakes: row.bench_mistakes,
    gamesLostToLineup: row.games_lost_to_lineup,
    avgActualPts: row.avg_actual_pts,
    avgOptimalPts: row.avg_optimal_pts,
    weeks: row.weeks,
    grade: efficiencyGrade(row.avg_efficiency),
  };
}

// League-wide season averages for context
const leagueSeasonAvg: Record<string, number> = {};
const seasonGroups: Record<string, number[]> = {};
for (const row of seasonRows) {
  if (!OWNER_MAP[row.owner_name]) continue;
  if (!seasonGroups[row.season]) seasonGroups[row.season] = [];
  seasonGroups[row.season].push(row.avg_efficiency);
}
for (const [season, vals] of Object.entries(seasonGroups)) {
  leagueSeasonAvg[season] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

// ─── Log Summary ─────────────────────────────────────────────────────────────

console.log(`Career records: ${careerData.length} owners`);
console.log('\nTop 5 by career efficiency:');
careerData.slice(0, 5).forEach(r => {
  console.log(`  ${r.displayName.padEnd(16)} ${r.careerAvgEfficiency}% (${r.grade}) — ${r.careerGamesLostToLineup} games lost to lineup`);
});

// ─── Generate TypeScript ──────────────────────────────────────────────────────

function renderSeasonRecord(rec: typeof seasonsBySeason[string][string]): string {
  return `{ avgEfficiency: ${rec.avgEfficiency}, benchMistakes: ${rec.benchMistakes}, gamesLostToLineup: ${rec.gamesLostToLineup}, avgActualPts: ${rec.avgActualPts}, avgOptimalPts: ${rec.avgOptimalPts}, weeks: ${rec.weeks}, grade: '${rec.grade}' }`;
}

function renderCareer(r: typeof careerData[number]): string {
  const seasons = Object.entries(seasonsBySeason[r.slug] ?? {})
    .map(([yr, rec]) => `    '${yr}': ${renderSeasonRecord(rec)}`)
    .join(',\n');
  return `  {
    slug: '${r.slug}', displayName: '${r.displayName}',
    careerAvgEfficiency: ${r.careerAvgEfficiency},
    careerBenchMistakes: ${r.careerBenchMistakes},
    careerGamesLostToLineup: ${r.careerGamesLostToLineup},
    totalWeeks: ${r.totalWeeks},
    seasonsPlayed: ${r.seasonsPlayed},
    firstSeason: ${r.firstSeason}, lastSeason: ${r.lastSeason},
    grade: '${r.grade}',
    seasons: {
${seasons}
    },
  }`;
}

const leagueAvgLines = Object.entries(leagueSeasonAvg)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([yr, avg]) => `  '${yr}': ${avg}`)
  .join(',\n');

const output = `/**
 * BMFFFL Manager Efficiency Data — AUTO-GENERATED
 * Source: bimfle-data/sleeper.db → analytics_v_efficiency_scores
 * Covers: Sleeper era 2020–2025 (6 seasons)
 * Generated: ${new Date().toISOString()}
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
${careerData.map(renderCareer).join(',\n')}
];

/** League-wide average efficiency per season (for benchmarking). */
export const LEAGUE_AVG_EFFICIENCY: Record<string, number> = {
${leagueAvgLines}
};

/** Get efficiency record for a single manager by slug. */
export function getEfficiency(slug: string): ManagerEfficiencyRecord | null {
  return MANAGER_EFFICIENCY.find(r => r.slug === slug) ?? null;
}
`;

const outPath = path.join(process.cwd(), 'src/lib/manager-efficiency-data.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);
console.log(`\n✅  Generated ${outPath}`);
