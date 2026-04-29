/**
 * BMFFFL H2H Data Generator
 *
 * Generates src/lib/h2h-data.ts from bimfle-data/sleeper.db
 * Contains head-to-head W-L records for all owner pairings, Sleeper era 2020-2025.
 *
 * Run: npx tsx scripts/generate-h2h-data.ts
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require('/home/bimfle/bimfle/node_modules/better-sqlite3') as typeof import('better-sqlite3').default;
import * as fs from 'fs';
import * as path from 'path';

// ─── Display Name → Slug Map ──────────────────────────────────────────────────
// Maps db display_name → canonical slug used in league-data.ts

const DB_NAME_TO_SLUG: Record<string, string> = {
  'MLSchools12':    'mlschools12',
  'MilwaukeeBrowns':'sexmachineandy',
  'Cogdeill11':     'cogdeill11',
  'Grandes':        'grandes',
  'rbr':            'rbr',
  'eldridsm':       'eldridsm',
  'delaurmr':       'juicybussy',
  'tdtd19844':      'tdtd19844',
  'eldridm20':      'eldridm20',
  'Tubes94':        'tubes94',
  'maleskcr1':      'cmaleski',
  // Alumni
  'mmoodie12':      'mmoodie12',
  'MCSchools':      'escuelas',
};

const SLUG_TO_DISPLAY: Record<string, string> = {
  'mlschools12':    'MLSchools12',
  'sexmachineandy': 'SexMachineAndyD',
  'cogdeill11':     'Cogdeill11',
  'grandes':        'Grandes',
  'rbr':            'rbr',
  'eldridsm':       'eldridsm',
  'juicybussy':     'JuicyBussy',
  'tdtd19844':      'tdtd19844',
  'eldridm20':      'eldridm20',
  'tubes94':        'Tubes94',
  'cmaleski':       'Cmaleski',
  'mmoodie12':      'MMoodie12',
  'escuelas':       'MCSchools',
};

// ─── Load Sleeper DB ──────────────────────────────────────────────────────────

const dbPath = '/home/bimfle/bimfle-data/sleeper.db';
const db = new Database(dbPath, { readonly: true });

interface H2HRow {
  owner1_name: string;
  owner2_name: string;
  w1: number;
  l1: number;
  games: number;
  avg_pts1: number;
  avg_pts2: number;
}

const rows = db.prepare(`
  SELECT u1.display_name as owner1_name, u2.display_name as owner2_name,
    SUM(CASE WHEN m1.points > m2.points THEN 1 ELSE 0 END) as w1,
    SUM(CASE WHEN m1.points < m2.points THEN 1 ELSE 0 END) as l1,
    COUNT(*) as games,
    ROUND(AVG(m1.points), 1) as avg_pts1,
    ROUND(AVG(m2.points), 1) as avg_pts2
  FROM matchups m1
  JOIN matchups m2 ON m1.league_id = m2.league_id AND m1.week = m2.week
    AND m1.matchup_id = m2.matchup_id AND m1.roster_id < m2.roster_id
  JOIN rosters r1 ON m1.roster_id = r1.roster_id AND m1.league_id = r1.league_id
  JOIN rosters r2 ON m2.roster_id = r2.roster_id AND m2.league_id = r2.league_id
  JOIN users u1 ON r1.owner_id = u1.user_id
  JOIN users u2 ON r2.owner_id = u2.user_id
  JOIN leagues l ON m1.league_id = l.league_id
  WHERE l.season BETWEEN 2020 AND 2025
  GROUP BY u1.user_id, u2.user_id
  ORDER BY u1.display_name, u2.display_name
`).all() as H2HRow[];

db.close();

// ─── Build H2H Map ────────────────────────────────────────────────────────────
// h2h[slugA][slugB] = { wins, losses, games, avgPtsFor, avgPtsAgainst }
// Always stored with slugA < slugB lexicographically; wins = slugA's wins

interface H2HEntry {
  wins: number;   // owner A wins
  losses: number; // owner A losses
  games: number;
  avgPtsFor: number;    // owner A avg pts
  avgPtsAgainst: number; // owner B avg pts
}

const h2h: Record<string, Record<string, H2HEntry>> = {};

let unmapped = 0;
for (const row of rows) {
  const slug1 = DB_NAME_TO_SLUG[row.owner1_name];
  const slug2 = DB_NAME_TO_SLUG[row.owner2_name];

  if (!slug1 || !slug2) {
    console.warn(`⚠️  Unmapped display name: ${!slug1 ? row.owner1_name : row.owner2_name}`);
    unmapped++;
    continue;
  }

  // Ensure consistent key order (slug1 < slug2)
  const [keyA, keyB, wins, losses, avgFor, avgAgainst] = slug1 < slug2
    ? [slug1, slug2, row.w1, row.l1, row.avg_pts1, row.avg_pts2]
    : [slug2, slug1, row.l1, row.w1, row.avg_pts2, row.avg_pts1];

  if (!h2h[keyA]) h2h[keyA] = {};
  h2h[keyA][keyB] = { wins, losses, games: row.games, avgPtsFor: avgFor, avgPtsAgainst: avgAgainst };
}

if (unmapped > 0) {
  console.error(`❌  ${unmapped} rows unmapped — update DB_NAME_TO_SLUG`);
  process.exit(1);
}

// ─── Build Summary Stats ──────────────────────────────────────────────────────
// For each owner: overall H2H W-L, biggest rival (most games), best victim (most wins), nemesis (most losses)

interface OwnerH2HSummary {
  slug: string;
  displayName: string;
  totalWins: number;
  totalLosses: number;
  totalGames: number;
  winPct: number;
  nemesis: string | null;      // owner slug who beats this person most
  bestVictim: string | null;   // owner slug this person beats most
  biggestRivalry: string | null; // most games played against
}

const allSlugs = Object.keys(SLUG_TO_DISPLAY);
const summaries: OwnerH2HSummary[] = [];

for (const slug of allSlugs) {
  let totalWins = 0;
  let totalLosses = 0;
  let totalGames = 0;

  let nemesisSlug: string | null = null;
  let nemesisLosses = -1;
  let bestVictimSlug: string | null = null;
  let bestVictimWins = -1;
  let biggestRivalSlug: string | null = null;
  let biggestRivalGames = -1;

  for (const opponent of allSlugs) {
    if (opponent === slug) continue;

    const [keyA, keyB] = slug < opponent ? [slug, opponent] : [opponent, slug];
    const entry = h2h[keyA]?.[keyB];
    if (!entry) continue;

    const wins = slug < opponent ? entry.wins : entry.losses;
    const losses = slug < opponent ? entry.losses : entry.wins;

    totalWins += wins;
    totalLosses += losses;
    totalGames += entry.games;

    if (losses > nemesisLosses) { nemesisLosses = losses; nemesisSlug = opponent; }
    if (wins > bestVictimWins) { bestVictimWins = wins; bestVictimSlug = opponent; }
    if (entry.games > biggestRivalGames) { biggestRivalGames = entry.games; biggestRivalSlug = opponent; }
  }

  summaries.push({
    slug,
    displayName: SLUG_TO_DISPLAY[slug],
    totalWins,
    totalLosses,
    totalGames,
    winPct: totalGames > 0 ? Math.round((totalWins / totalGames) * 1000) / 1000 : 0,
    nemesis: nemesisSlug,
    bestVictim: bestVictimSlug,
    biggestRivalry: biggestRivalSlug,
  });
}

summaries.sort((a, b) => b.winPct - a.winPct || b.totalWins - a.totalWins);

// ─── Generate TypeScript ───────────────────────────────────────────────────────

function renderH2HEntry(entry: H2HEntry): string {
  return `{ wins: ${entry.wins}, losses: ${entry.losses}, games: ${entry.games}, avgPtsFor: ${entry.avgPtsFor}, avgPtsAgainst: ${entry.avgPtsAgainst} }`;
}

function renderSummary(s: OwnerH2HSummary): string {
  return `  {
    slug: '${s.slug}',
    displayName: '${s.displayName}',
    totalWins: ${s.totalWins},
    totalLosses: ${s.totalLosses},
    totalGames: ${s.totalGames},
    winPct: ${s.winPct},
    nemesis: ${s.nemesis ? `'${s.nemesis}'` : 'null'},
    bestVictim: ${s.bestVictim ? `'${s.bestVictim}'` : 'null'},
    biggestRivalry: ${s.biggestRivalry ? `'${s.biggestRivalry}'` : 'null'},
  }`;
}

const h2hLines: string[] = [];
for (const [keyA, opponents] of Object.entries(h2h)) {
  for (const [keyB, entry] of Object.entries(opponents)) {
    h2hLines.push(`  '${keyA}:${keyB}': ${renderH2HEntry(entry)},`);
  }
}

const output = `/**
 * BMFFFL H2H Records — AUTO-GENERATED
 * Source: bimfle-data/sleeper.db (matchups table, seasons 2020–2025)
 * Generated: ${new Date().toISOString()}
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
${h2hLines.join('\n')}
};

/** Per-owner H2H summary stats, sorted by overall H2H win%. */
export const H2H_SUMMARIES: OwnerH2HSummary[] = [
${summaries.map(renderSummary).join(',\n')}
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
  const entry = H2H_RECORDS[\`\${keyA}:\${keyB}\`];
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
export const H2H_OWNER_SLUGS = ${JSON.stringify(allSlugs)} as const;

/** Display name lookup for H2H owners. */
export const H2H_DISPLAY_NAMES: Record<string, string> = ${JSON.stringify(SLUG_TO_DISPLAY, null, 2)};
`;

const outPath = path.join(process.cwd(), 'src/lib/h2h-data.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);
console.log(`✅  Generated ${outPath}`);
console.log(`   ${rows.length} H2H pairings, ${allSlugs.length} owners`);
console.log('\nH2H Summary (by win%):');
summaries.slice(0, 6).forEach(s => {
  console.log(`  ${s.displayName.padEnd(16)} ${s.totalWins}-${s.totalLosses} (${(s.winPct * 100).toFixed(1)}%)  nemesis=${s.nemesis ?? 'none'}  victim=${s.bestVictim ?? 'none'}`);
});
