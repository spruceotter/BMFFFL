/**
 * BMFFFL H2H Data Generator
 *
 * Generates src/lib/h2h-data.ts from two authoritative sources:
 *   - bimfle-data/espn-era/h2h-matchups.json  → ESPN era 2016-2019 (pulled via ESPN API)
 *   - bimfle-data/sleeper.db                  → Sleeper era 2020-2025
 *
 * Run: npx tsx scripts/generate-h2h-data.ts
 *
 * To refresh ESPN era data:
 *   python3 /home/bimfle/bimfle/scripts/pull-espn-h2h.py
 *   (requires fresh ESPN_SWID/ESPN_S2 credentials in .env)
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require('/home/bimfle/bimfle/node_modules/better-sqlite3') as typeof import('better-sqlite3');
import * as fs from 'fs';
import * as path from 'path';

// ─── Display Name → Slug Map ──────────────────────────────────────────────────
// Maps Sleeper db display_name → canonical slug

const DB_NAME_TO_SLUG: Record<string, string> = {
  'MLSchools12':     'mlschools12',
  'MilwaukeeBrowns': 'sexmachineandy',
  'Cogdeill11':      'cogdeill11',
  'Grandes':         'grandes',
  'rbr':             'rbr',
  'eldridsm':        'eldridsm',
  'delaurmr':        'juicybussy',
  'tdtd19844':       'tdtd19844',
  'eldridm20':       'eldridm20',
  'Tubes94':         'tubes94',
  'maleskcr1':       'cmaleski',
  // Alumni
  'mmoodie12':       'mmoodie12',
  'MCSchools':       'escuelas',
};

const SLUG_TO_DISPLAY: Record<string, string> = {
  'mlschools12':     'MLSchools12',
  'sexmachineandy':  'SexMachineAndyD',
  'cogdeill11':      'Cogdeill11',
  'grandes':         'Grandes',
  'rbr':             'rbr',
  'eldridsm':        'eldridsm',
  'juicybussy':      'JuicyBussy',
  'tdtd19844':       'tdtd19844',
  'eldridm20':       'eldridm20',
  'tubes94':         'Tubes94',
  'cmaleski':        'Cmaleski',
  'mmoodie12':       'MMoodie12',
  'escuelas':        'MCSchools',
  'miroslav081':     'Miroslav081',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface EraRecord {
  wins: number;
  losses: number;
  games: number;
  ptsFor: number;
  ptsAgainst: number;
}

interface GameTypeRecord {
  wins: number;
  losses: number;
  games: number;
}

type H2HKey = string; // 'slugA:slugB' where slugA < slugB

// ─── Helper: accumulate into a record ────────────────────────────────────────

function accumulate(map: Map<H2HKey, EraRecord>, key: H2HKey, aWins: boolean, ptsFor: number, ptsAgainst: number) {
  if (!map.has(key)) map.set(key, { wins: 0, losses: 0, games: 0, ptsFor: 0, ptsAgainst: 0 });
  const rec = map.get(key)!;
  rec.games++;
  rec.ptsFor += ptsFor;
  rec.ptsAgainst += ptsAgainst;
  if (aWins) rec.wins++; else rec.losses++;
}

function accumulateGT(map: Map<H2HKey, GameTypeRecord>, key: H2HKey, aWins: boolean) {
  if (!map.has(key)) map.set(key, { wins: 0, losses: 0, games: 0 });
  const rec = map.get(key)!;
  rec.games++;
  if (aWins) rec.wins++; else rec.losses++;
}

// ─── Load ESPN Era H2H ────────────────────────────────────────────────────────

interface EspnMatchup {
  week: number;
  away_slug: string;
  home_slug: string;
  away_pts: number;
  home_pts: number;
  is_playoff: boolean;
  bracket_type: 'winners' | 'consolation' | null;  // null = regular season
}

const espnMatchupsPath = '/home/bimfle/bimfle-data/espn-era/h2h-matchups.json';
const espnMatchups: Record<string, EspnMatchup[]> = JSON.parse(fs.readFileSync(espnMatchupsPath, 'utf-8'));

const espnH2H = new Map<H2HKey, EraRecord>();
const rsH2H = new Map<H2HKey, GameTypeRecord>();   // all-time regular season (ESPN + Sleeper)
const poH2H = new Map<H2HKey, GameTypeRecord>();   // all-time playoff (ESPN + Sleeper)

for (const [, matchups] of Object.entries(espnMatchups)) {
  for (const m of matchups) {
    const a = m.away_slug;
    const b = m.home_slug;
    const ap = m.away_pts;
    const hp = m.home_pts;
    const key: H2HKey = a < b ? `${a}:${b}` : `${b}:${a}`;
    const ptsA = a < b ? ap : hp;
    const ptsB = a < b ? hp : ap;
    const keyAWins = a < b ? ap > hp : hp > ap;

    accumulate(espnH2H, key, keyAWins, ptsA, ptsB);
    // Winners bracket → playoff. Regular season (null) → RS. Consolation → excluded entirely.
    if (m.bracket_type === 'winners') {
      accumulateGT(poH2H, key, keyAWins);
    } else if (!m.is_playoff) {
      // bracket_type === null means regular season
      accumulateGT(rsH2H, key, keyAWins);
    }
    // bracket_type === 'consolation' → omitted from both RS and PO counts
  }
}

console.log(`ESPN era: ${espnH2H.size} H2H pairings`);

// ─── Load Sleeper Era H2H ─────────────────────────────────────────────────────

const dbPath = '/home/bimfle/bimfle-data/sleeper.db';
const db = new Database(dbPath, { readonly: true });

interface SleeperH2HRow {
  owner1_name: string;
  owner2_name: string;
  w1: number;
  l1: number;
  games: number;
  pts1: number;
  pts2: number;
}

// Regular season only (week < playoffs_start_week)
const sleeperRSRows = db.prepare(`
  SELECT u1.display_name as owner1_name, u2.display_name as owner2_name,
    SUM(CASE WHEN m1.points > m2.points THEN 1 ELSE 0 END) as w1,
    SUM(CASE WHEN m1.points < m2.points THEN 1 ELSE 0 END) as l1,
    COUNT(*) as games,
    ROUND(SUM(m1.points), 2) as pts1,
    ROUND(SUM(m2.points), 2) as pts2
  FROM matchups m1
  JOIN matchups m2 ON m1.league_id = m2.league_id AND m1.week = m2.week
    AND m1.matchup_id = m2.matchup_id AND m1.roster_id < m2.roster_id
  JOIN rosters r1 ON m1.roster_id = r1.roster_id AND m1.league_id = r1.league_id
  JOIN rosters r2 ON m2.roster_id = r2.roster_id AND m2.league_id = r2.league_id
  JOIN users u1 ON r1.owner_id = u1.user_id
  JOIN users u2 ON r2.owner_id = u2.user_id
  JOIN leagues l ON m1.league_id = l.league_id
  JOIN league_settings ls ON m1.league_id = ls.league_id
  WHERE l.season BETWEEN 2020 AND 2025
    AND m1.week < ls.playoffs_start_week
  GROUP BY u1.user_id, u2.user_id
`).all() as SleeperH2HRow[];

// Playoff only — winners bracket only (JOIN playoffs table, bracket_type = 'winners')
// Excludes losers/consolation/moodie bowl games
const sleeperPORows = db.prepare(`
  SELECT u1.display_name as owner1_name, u2.display_name as owner2_name,
    SUM(CASE WHEN m1.points > m2.points THEN 1 ELSE 0 END) as w1,
    SUM(CASE WHEN m1.points < m2.points THEN 1 ELSE 0 END) as l1,
    COUNT(*) as games,
    ROUND(SUM(m1.points), 2) as pts1,
    ROUND(SUM(m2.points), 2) as pts2
  FROM matchups m1
  JOIN matchups m2 ON m1.league_id = m2.league_id AND m1.week = m2.week
    AND m1.matchup_id = m2.matchup_id AND m1.roster_id < m2.roster_id
  JOIN rosters r1 ON m1.roster_id = r1.roster_id AND m1.league_id = r1.league_id
  JOIN rosters r2 ON m2.roster_id = r2.roster_id AND m2.league_id = r2.league_id
  JOIN users u1 ON r1.owner_id = u1.user_id
  JOIN users u2 ON r2.owner_id = u2.user_id
  JOIN leagues l ON m1.league_id = l.league_id
  JOIN league_settings ls ON m1.league_id = ls.league_id
  JOIN playoffs p ON m1.league_id = p.league_id
    AND m1.matchup_id = p.matchup_id
    AND (r1.roster_id = p.team_1_roster_id OR r1.roster_id = p.team_2_roster_id)
  WHERE l.season BETWEEN 2020 AND 2025
    AND p.bracket_type = 'winners'
  GROUP BY u1.user_id, u2.user_id
`).all() as SleeperH2HRow[];

// All games (existing query for era record)
const sleeperRows = db.prepare(`
  SELECT u1.display_name as owner1_name, u2.display_name as owner2_name,
    SUM(CASE WHEN m1.points > m2.points THEN 1 ELSE 0 END) as w1,
    SUM(CASE WHEN m1.points < m2.points THEN 1 ELSE 0 END) as l1,
    COUNT(*) as games,
    ROUND(SUM(m1.points), 2) as pts1,
    ROUND(SUM(m2.points), 2) as pts2
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
`).all() as SleeperH2HRow[];

db.close();

const sleeperH2H = new Map<H2HKey, EraRecord>();
let unmapped = 0;

function mapSleeperRows(rows: SleeperH2HRow[], targetMap: Map<H2HKey, EraRecord> | Map<H2HKey, GameTypeRecord>, isEraRecord: boolean) {
  for (const row of rows) {
    const slug1 = DB_NAME_TO_SLUG[row.owner1_name];
    const slug2 = DB_NAME_TO_SLUG[row.owner2_name];
    if (!slug1 || !slug2) { if (isEraRecord) unmapped++; return; }

    const [keyA, , wins, losses, pts1, pts2] = slug1 < slug2
      ? [slug1, slug2, row.w1, row.l1, row.pts1, row.pts2]
      : [slug2, slug1, row.l1, row.w1, row.pts2, row.pts1];
    const key = `${keyA}:${slug1 < slug2 ? slug2 : slug1}`;

    if (isEraRecord) {
      (targetMap as Map<H2HKey, EraRecord>).set(key, { wins, losses, games: row.games, ptsFor: pts1, ptsAgainst: pts2 });
    } else {
      (targetMap as Map<H2HKey, GameTypeRecord>).set(key, { wins, losses, games: row.games });
    }
  }
}

mapSleeperRows(sleeperRows, sleeperH2H, true);

// Accumulate Sleeper RS/PO into the all-time game-type maps
for (const row of sleeperRSRows) {
  const slug1 = DB_NAME_TO_SLUG[row.owner1_name];
  const slug2 = DB_NAME_TO_SLUG[row.owner2_name];
  if (!slug1 || !slug2) continue;
  const [keyA, keyB, wins, losses] = slug1 < slug2
    ? [slug1, slug2, row.w1, row.l1] : [slug2, slug1, row.l1, row.w1];
  const key = `${keyA}:${keyB}`;
  if (!rsH2H.has(key)) rsH2H.set(key, { wins: 0, losses: 0, games: 0 });
  const r = rsH2H.get(key)!;
  r.wins += wins; r.losses += losses; r.games += row.games;
}

for (const row of sleeperPORows) {
  const slug1 = DB_NAME_TO_SLUG[row.owner1_name];
  const slug2 = DB_NAME_TO_SLUG[row.owner2_name];
  if (!slug1 || !slug2) continue;
  const [keyA, keyB, wins, losses] = slug1 < slug2
    ? [slug1, slug2, row.w1, row.l1] : [slug2, slug1, row.l1, row.w1];
  const key = `${keyA}:${keyB}`;
  if (!poH2H.has(key)) poH2H.set(key, { wins: 0, losses: 0, games: 0 });
  const p = poH2H.get(key)!;
  p.wins += wins; p.losses += losses; p.games += row.games;
}

if (unmapped > 0) {
  console.error(`❌  ${unmapped} Sleeper rows unmapped — update DB_NAME_TO_SLUG`);
  process.exit(1);
}

console.log(`Sleeper era: ${sleeperH2H.size} H2H pairings (RS: ${sleeperRSRows.length} pairs, PO: ${sleeperPORows.length} pairs)`);

// ─── Merge into Combined H2H ──────────────────────────────────────────────────

const allKeys = new Set<H2HKey>([...espnH2H.keys(), ...sleeperH2H.keys()]);

interface CombinedH2HRecord {
  wins: number;
  losses: number;
  games: number;
  avgPtsFor: number;
  avgPtsAgainst: number;
  espn: EraRecord | null;
  sleeper: EraRecord | null;
  regularSeason: GameTypeRecord | null;  // combined ESPN RS + Sleeper RS
  playoff: GameTypeRecord | null;         // combined ESPN PO + Sleeper PO
}

const combined = new Map<H2HKey, CombinedH2HRecord>();

for (const key of allKeys) {
  const espn = espnH2H.get(key) ?? null;
  const sleeper = sleeperH2H.get(key) ?? null;
  const rs = rsH2H.get(key) ?? null;
  const po = poH2H.get(key) ?? null;

  const totalWins = (espn?.wins ?? 0) + (sleeper?.wins ?? 0);
  const totalLosses = (espn?.losses ?? 0) + (sleeper?.losses ?? 0);
  const totalGames = (espn?.games ?? 0) + (sleeper?.games ?? 0);
  const totalPtsFor = (espn?.ptsFor ?? 0) + (sleeper?.ptsFor ?? 0);
  const totalPtsAgainst = (espn?.ptsAgainst ?? 0) + (sleeper?.ptsAgainst ?? 0);

  combined.set(key, {
    wins: totalWins,
    losses: totalLosses,
    games: totalGames,
    avgPtsFor: totalGames > 0 ? Math.round((totalPtsFor / totalGames) * 10) / 10 : 0,
    avgPtsAgainst: totalGames > 0 ? Math.round((totalPtsAgainst / totalGames) * 10) / 10 : 0,
    espn: espn ? { ...espn, ptsFor: Math.round(espn.ptsFor * 10) / 10, ptsAgainst: Math.round(espn.ptsAgainst * 10) / 10 } : null,
    sleeper: sleeper ? { ...sleeper, ptsFor: Math.round(sleeper.ptsFor * 10) / 10, ptsAgainst: Math.round(sleeper.ptsAgainst * 10) / 10 } : null,
    regularSeason: rs,
    playoff: po,
  });
}

console.log(`Combined: ${combined.size} H2H pairings`);

// ─── Build Summary Stats ──────────────────────────────────────────────────────

const allSlugs = Object.keys(SLUG_TO_DISPLAY);

interface OwnerH2HSummary {
  slug: string;
  displayName: string;
  totalWins: number;
  totalLosses: number;
  totalGames: number;
  winPct: number;
  espnWins: number;
  espnLosses: number;
  sleeperWins: number;
  sleeperLosses: number;
  nemesis: string | null;
  bestVictim: string | null;
  biggestRivalry: string | null;
}

const summaries: OwnerH2HSummary[] = [];

for (const slug of allSlugs) {
  let totalWins = 0, totalLosses = 0, totalGames = 0;
  let espnWins = 0, espnLosses = 0, sleeperWins = 0, sleeperLosses = 0;
  let nemesisSlug: string | null = null, nemesisLosses = -1;
  let bestVictimSlug: string | null = null, bestVictimNet = -999;
  let biggestRivalSlug: string | null = null, biggestRivalGames = -1;

  for (const opponent of allSlugs) {
    if (opponent === slug) continue;
    const [keyA, keyB] = slug < opponent ? [slug, opponent] : [opponent, slug];
    const entry = combined.get(`${keyA}:${keyB}`);
    if (!entry) continue;

    const wins = slug < opponent ? entry.wins : entry.losses;
    const losses = slug < opponent ? entry.losses : entry.wins;
    const ew = slug < opponent ? (entry.espn?.wins ?? 0) : (entry.espn?.losses ?? 0);
    const el = slug < opponent ? (entry.espn?.losses ?? 0) : (entry.espn?.wins ?? 0);
    const sw = slug < opponent ? (entry.sleeper?.wins ?? 0) : (entry.sleeper?.losses ?? 0);
    const sl = slug < opponent ? (entry.sleeper?.losses ?? 0) : (entry.sleeper?.wins ?? 0);

    totalWins += wins; totalLosses += losses; totalGames += entry.games;
    espnWins += ew; espnLosses += el;
    sleeperWins += sw; sleeperLosses += sl;

    if (losses > nemesisLosses) { nemesisLosses = losses; nemesisSlug = opponent; }
    const net = wins - losses;
    if (net > bestVictimNet) { bestVictimNet = net; bestVictimSlug = opponent; }
    if (entry.games > biggestRivalGames) { biggestRivalGames = entry.games; biggestRivalSlug = opponent; }
  }

  summaries.push({
    slug, displayName: SLUG_TO_DISPLAY[slug],
    totalWins, totalLosses, totalGames,
    winPct: totalGames > 0 ? Math.round((totalWins / totalGames) * 1000) / 1000 : 0,
    espnWins, espnLosses, sleeperWins, sleeperLosses,
    nemesis: nemesisSlug, bestVictim: bestVictimSlug, biggestRivalry: biggestRivalSlug,
  });
}

summaries.sort((a, b) => b.winPct - a.winPct || b.totalWins - a.totalWins);

// ─── Generate TypeScript ───────────────────────────────────────────────────────

function renderEraRecord(rec: EraRecord | null): string {
  if (!rec) return 'null';
  return `{ wins: ${rec.wins}, losses: ${rec.losses}, games: ${rec.games}, ptsFor: ${rec.ptsFor}, ptsAgainst: ${rec.ptsAgainst} }`;
}

function renderGTRecord(rec: GameTypeRecord | null): string {
  if (!rec) return 'null';
  return `{ wins: ${rec.wins}, losses: ${rec.losses}, games: ${rec.games} }`;
}

function renderCombined(key: string, rec: CombinedH2HRecord): string {
  return `  '${key}': { wins: ${rec.wins}, losses: ${rec.losses}, games: ${rec.games}, avgPtsFor: ${rec.avgPtsFor}, avgPtsAgainst: ${rec.avgPtsAgainst}, espn: ${renderEraRecord(rec.espn)}, sleeper: ${renderEraRecord(rec.sleeper)}, regularSeason: ${renderGTRecord(rec.regularSeason)}, playoff: ${renderGTRecord(rec.playoff)} },`;
}

function renderSummary(s: OwnerH2HSummary): string {
  return `  {
    slug: '${s.slug}', displayName: '${s.displayName}',
    totalWins: ${s.totalWins}, totalLosses: ${s.totalLosses}, totalGames: ${s.totalGames},
    winPct: ${s.winPct}, espnWins: ${s.espnWins}, espnLosses: ${s.espnLosses},
    sleeperWins: ${s.sleeperWins}, sleeperLosses: ${s.sleeperLosses},
    nemesis: ${s.nemesis ? `'${s.nemesis}'` : 'null'},
    bestVictim: ${s.bestVictim ? `'${s.bestVictim}'` : 'null'},
    biggestRivalry: ${s.biggestRivalry ? `'${s.biggestRivalry}'` : 'null'},
  }`;
}

const h2hLines = [...combined.entries()].map(([k, v]) => renderCombined(k, v));

const output = `/**
 * BMFFFL H2H Records — AUTO-GENERATED
 * Sources:
 *   ESPN era (2016–2019): bimfle-data/espn-era/h2h-matchups.json (from ESPN API)
 *   Sleeper era (2020–2025): bimfle-data/sleeper.db matchups table
 * Generated: ${new Date().toISOString()}
 *
 * DO NOT EDIT BY HAND — run scripts/generate-h2h-data.ts to regenerate.
 *
 * Key format: 'slugA:slugB' where slugA < slugB lexicographically.
 * wins/losses = slugA's record. Use getH2H(slugA, slugB) for direction-aware lookup.
 */

export interface EraRecord {
  wins: number;
  losses: number;
  games: number;
  ptsFor: number;     // total points scored
  ptsAgainst: number; // total points allowed
}

export interface GameTypeRecord {
  wins: number;
  losses: number;
  games: number;
}

export interface H2HRecord {
  wins: number;           // slugA wins (all-time)
  losses: number;         // slugA losses (all-time)
  games: number;          // total games (all-time)
  avgPtsFor: number;      // slugA avg pts per game
  avgPtsAgainst: number;  // slugB avg pts per game
  espn: EraRecord | null;    // ESPN era 2016-2019
  sleeper: EraRecord | null; // Sleeper era 2020-2025
  regularSeason: GameTypeRecord | null;  // all-time regular season only
  playoff: GameTypeRecord | null;         // all-time playoff only
}

export interface OwnerH2HSummary {
  slug: string;
  displayName: string;
  totalWins: number;
  totalLosses: number;
  totalGames: number;
  winPct: number;
  espnWins: number;
  espnLosses: number;
  sleeperWins: number;
  sleeperLosses: number;
  nemesis: string | null;
  bestVictim: string | null;
  biggestRivalry: string | null;
}

/** All-time H2H records (ESPN 2016-2019 + Sleeper 2020-2025). */
export const H2H_RECORDS: Record<string, H2HRecord> = {
${h2hLines.join('\n')}
};

/** Per-owner H2H summary stats, sorted by overall H2H win%. */
export const H2H_SUMMARIES: OwnerH2HSummary[] = [
${summaries.map(renderSummary).join(',\n')}
];

/**
 * Get H2H record between two owners (direction-aware).
 * Returns stats from ownerA's perspective. Returns null if no games played.
 */
export function getH2H(slugA: string, slugB: string): H2HRecord | null {
  const flip = slugA >= slugB;
  const [keyA, keyB] = flip ? [slugB, slugA] : [slugA, slugB];
  const entry = H2H_RECORDS[\`\${keyA}:\${keyB}\`];
  if (!entry) return null;
  if (!flip) return entry;
  const flipGT = (r: GameTypeRecord | null) => r ? { wins: r.losses, losses: r.wins, games: r.games } : null;
  return {
    wins: entry.losses,
    losses: entry.wins,
    games: entry.games,
    avgPtsFor: entry.avgPtsAgainst,
    avgPtsAgainst: entry.avgPtsFor,
    espn: entry.espn ? { wins: entry.espn.losses, losses: entry.espn.wins, games: entry.espn.games, ptsFor: entry.espn.ptsAgainst, ptsAgainst: entry.espn.ptsFor } : null,
    sleeper: entry.sleeper ? { wins: entry.sleeper.losses, losses: entry.sleeper.wins, games: entry.sleeper.games, ptsFor: entry.sleeper.ptsAgainst, ptsAgainst: entry.sleeper.ptsFor } : null,
    regularSeason: flipGT(entry.regularSeason),
    playoff: flipGT(entry.playoff),
  };
}

/** All owner slugs in the H2H data. */
export const H2H_OWNER_SLUGS = ${JSON.stringify(allSlugs)} as const;

/** Display name lookup. */
export const H2H_DISPLAY_NAMES: Record<string, string> = ${JSON.stringify(SLUG_TO_DISPLAY, null, 2)};
`;

const outPath = path.join(process.cwd(), 'src/lib/h2h-data.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);
console.log(`\n✅  Generated ${outPath}`);
console.log(`   ${combined.size} all-time pairings`);
console.log('\nTop 6 by all-time H2H win%:');
summaries.slice(0, 6).forEach(s => {
  const pct = (s.winPct * 100).toFixed(1);
  console.log(`  ${s.displayName.padEnd(16)} ${s.totalWins}-${s.totalLosses} (${pct}%) ESPN:${s.espnWins}-${s.espnLosses} Sleeper:${s.sleeperWins}-${s.sleeperLosses}`);
});
