/**
 * BMFFFL League Data Generator
 *
 * Generates src/lib/league-data.ts from authoritative sources:
 *   - public/data/dynasty-scores.json  → dynasty ranks, championship years, per-season results
 *   - bimfle-data/sleeper.db           → career W-L records (Sleeper era 2020-2025)
 *
 * Identity fields (slugs, display names, join years) are maintained here.
 * Statistics are derived — never hand-authored.
 *
 * Run: npx tsx scripts/generate-league-data.ts
 */

// better-sqlite3 lives in the bimfle workspace, not the BMFFFL site repo
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require('/home/bimfle/bimfle/node_modules/better-sqlite3') as typeof import('better-sqlite3').default;
import * as fs from 'fs';
import * as path from 'path';

// ─── Identity Map ─────────────────────────────────────────────────────────────
// Maps canonical slug → { displayName, dbDisplayName, joinedYear, status, isAlumni }
// dbDisplayName = the display_name in sleeper.db users table (may differ from Sleeper username)
// Only identity here — stats are derived below.

interface OwnerIdentity {
  slug: string;
  displayName: string;
  dynastyScoreSlug: string;  // slug used in dynasty-scores.json (may differ)
  dbDisplayName: string;     // display_name in sleeper.db users table
  joinedYear: number;
  isAlumni?: boolean;
}

const OWNERS: OwnerIdentity[] = [
  { slug: 'mlschools12',    displayName: 'MLSchools12',     dynastyScoreSlug: 'mlschools12',     dbDisplayName: 'MLSchools12',     joinedYear: 2016 },
  { slug: 'sexmachineandy', displayName: 'SexMachineAndyD', dynastyScoreSlug: 'sexmachineandyd', dbDisplayName: 'MilwaukeeBrowns', joinedYear: 2016 },
  { slug: 'cogdeill11',     displayName: 'Cogdeill11',      dynastyScoreSlug: 'cogdeill11',      dbDisplayName: 'Cogdeill11',      joinedYear: 2016 },
  { slug: 'grandes',        displayName: 'Grandes',         dynastyScoreSlug: 'grandes',         dbDisplayName: 'Grandes',         joinedYear: 2016 },
  { slug: 'rbr',            displayName: 'rbr',             dynastyScoreSlug: 'rbr',             dbDisplayName: 'rbr',             joinedYear: 2016 },
  { slug: 'eldridsm',       displayName: 'eldridsm',        dynastyScoreSlug: 'eldridsm',        dbDisplayName: 'eldridsm',        joinedYear: 2016 },
  { slug: 'juicybussy',     displayName: 'JuicyBussy',      dynastyScoreSlug: 'juicybussy',      dbDisplayName: 'delaurmr',        joinedYear: 2016 },
  { slug: 'tdtd19844',      displayName: 'tdtd19844',       dynastyScoreSlug: 'tdtd19844',       dbDisplayName: 'tdtd19844',       joinedYear: 2016 },
  { slug: 'eldridm20',      displayName: 'eldridm20',       dynastyScoreSlug: 'eldridm20',       dbDisplayName: 'eldridm20',       joinedYear: 2016 },
  { slug: 'tubes94',        displayName: 'Tubes94',         dynastyScoreSlug: 'tubes94',         dbDisplayName: 'Tubes94',         joinedYear: 2021 },
  { slug: 'cmaleski',       displayName: 'Cmaleski',        dynastyScoreSlug: 'cmaleski',        dbDisplayName: 'maleskcr1',       joinedYear: 2016 },
  // Alumni
  { slug: 'mmoodie12',      displayName: 'MMoodie12',       dynastyScoreSlug: 'mmoodie12',       dbDisplayName: 'mmoodie12',       joinedYear: 2016, isAlumni: true },
  { slug: 'escuelas',       displayName: 'MCSchools',       dynastyScoreSlug: 'escuelas',        dbDisplayName: 'MCSchools',       joinedYear: 2020, isAlumni: true },
  { slug: 'miroslav081',    displayName: 'Miroslav081',     dynastyScoreSlug: 'miroslav081',     dbDisplayName: 'miroslav081',     joinedYear: 2016, isAlumni: true },
];

// ─── Load Dynasty Scores ──────────────────────────────────────────────────────

const dynastyScoresPath = path.join(process.cwd(), 'public/data/dynasty-scores.json');
const dynastyData = JSON.parse(fs.readFileSync(dynastyScoresPath, 'utf-8'));

interface DynastyEntry {
  rank: number;
  owner: string;
  combined_total: number;
  seasons: Record<string, { rs_wins: number; rank: number; place_pts: number; playoff_wins: number; season_score: number }>;
}

const dynastyBySlug = new Map<string, DynastyEntry>();
for (const entry of dynastyData.rankings as DynastyEntry[]) {
  dynastyBySlug.set(entry.owner, entry);
}

// ─── Load Sleeper DB ──────────────────────────────────────────────────────────

const dbPath = '/home/bimfle/bimfle-data/sleeper.db';
const db = new Database(dbPath, { readonly: true });

interface WLRow { display_name: string; wins: number; losses: number; }
const sleeperWL: WLRow[] = db.prepare(`
  SELECT u.display_name,
    SUM(CASE WHEN m1.points > m2.points THEN 1 ELSE 0 END) as wins,
    SUM(CASE WHEN m1.points < m2.points THEN 1 ELSE 0 END) as losses
  FROM matchups m1
  JOIN matchups m2 ON m1.league_id = m2.league_id
    AND m1.week = m2.week
    AND m1.matchup_id = m2.matchup_id
    AND m1.roster_id != m2.roster_id
  JOIN rosters r ON m1.roster_id = r.roster_id AND m1.league_id = r.league_id
  JOIN users u ON r.owner_id = u.user_id
  JOIN leagues l ON m1.league_id = l.league_id
  WHERE l.season BETWEEN 2020 AND 2025
  GROUP BY u.user_id
`).all() as WLRow[];

const sleeperWLByDisplayName = new Map(sleeperWL.map(r => [r.display_name, r]));

// ─── Build Manager Records ─────────────────────────────────────────────────────

const ESPN_SEASONS = ['2016', '2017', '2018', '2019'];
const ESPN_RS_GAMES_PER_SEASON = 13; // 12-team league, 13-game regular season

interface ManagerRecord {
  slug: string;
  displayName: string;
  dynastyRank: number;
  dynastyScore: number;
  championships: number[];
  runnerUps: number[];
  playoffApps: number;
  espnWins: number;
  espnLosses: number;
  sleeperWins: number;
  sleeperLosses: number;
  careerWins: number;
  careerLosses: number;
  joinedYear: number;
  isAlumni: boolean;
  note?: string;
}

const managers: ManagerRecord[] = [];

for (const owner of OWNERS) {
  const dynasty = dynastyBySlug.get(owner.dynastyScoreSlug);
  const sleeper = sleeperWLByDisplayName.get(owner.dbDisplayName);

  if (!dynasty) {
    console.warn(`⚠️  No dynasty data found for ${owner.slug} (dynastyScoreSlug: ${owner.dynastyScoreSlug})`);
  }

  // Championships and runner-ups from dynasty-scores
  const championships: number[] = [];
  const runnerUps: number[] = [];
  let playoffApps = 0;

  if (dynasty) {
    for (const [year, season] of Object.entries(dynasty.seasons)) {
      if (season.place_pts === 10) championships.push(parseInt(year));
      else if (season.place_pts === 6) runnerUps.push(parseInt(year));
      if (season.place_pts >= 1) playoffApps++;
    }
  }

  // ESPN-era W-L (computed from rs_wins; losses approximate based on 13-game RS)
  let espnWins = 0;
  let espnSeasonsPlayed = 0;
  if (dynasty) {
    for (const yr of ESPN_SEASONS) {
      if (dynasty.seasons[yr]) {
        espnWins += dynasty.seasons[yr].rs_wins;
        espnSeasonsPlayed++;
      }
    }
  }
  const espnLosses = Math.max(0, (espnSeasonsPlayed * ESPN_RS_GAMES_PER_SEASON) - espnWins);

  // Sleeper-era W-L from DB
  const sleeperWins = sleeper?.wins ?? 0;
  const sleeperLosses = sleeper?.losses ?? 0;

  const note = espnSeasonsPlayed > 0
    ? `ESPN W-L approx (${espnSeasonsPlayed} seasons × ${ESPN_RS_GAMES_PER_SEASON} games − rs_wins). Sleeper W-L from DB.`
    : undefined;

  managers.push({
    slug: owner.slug,
    displayName: owner.displayName,
    dynastyRank: dynasty?.rank ?? 99,
    dynastyScore: dynasty?.combined_total ?? 0,
    championships,
    runnerUps,
    playoffApps,
    espnWins,
    espnLosses,
    sleeperWins,
    sleeperLosses,
    careerWins: espnWins + sleeperWins,
    careerLosses: espnLosses + sleeperLosses,
    joinedYear: owner.joinedYear,
    isAlumni: owner.isAlumni ?? false,
    note,
  });
}

// Sort by dynasty rank
managers.sort((a, b) => a.dynastyRank - b.dynastyRank);

// ─── Generate TypeScript ───────────────────────────────────────────────────────

function renderManager(m: ManagerRecord, indent: string): string {
  return `${indent}{
${indent}  slug: '${m.slug}',
${indent}  displayName: '${m.displayName}',
${indent}  dynastyRank: ${m.dynastyRank},
${indent}  dynastyScore: ${m.dynastyScore},
${indent}  championships: [${m.championships.join(', ')}],
${indent}  runnerUps: [${m.runnerUps.join(', ')}],
${indent}  playoffApps: ${m.playoffApps},
${indent}  careerWins: ${m.careerWins},
${indent}  careerLosses: ${m.careerLosses},
${indent}  // espn: ${m.espnWins}–${m.espnLosses}${m.espnLosses > 0 ? ' (approx)' : ''} | sleeper: ${m.sleeperWins}–${m.sleeperLosses}
${indent}  joinedYear: ${m.joinedYear},${m.isAlumni ? '\n' + indent + '  isAlumni: true,' : ''}
${indent}}`;
}

const activeManagers = managers.filter(m => !m.isAlumni);
const alumni = managers.filter(m => m.isAlumni);

const output = `/**
 * BMFFFL League Data — AUTO-GENERATED
 * Source: public/data/dynasty-scores.json + bimfle-data/sleeper.db
 * Generated: ${new Date().toISOString()}
 *
 * DO NOT EDIT BY HAND — run scripts/generate-league-data.ts to regenerate.
 * ESPN W-L records are approximate (rs_wins from dynasty-scores.json, losses estimated
 * from ${ESPN_RS_GAMES_PER_SEASON}-game regular season). Sleeper W-L from authoritative DB.
 */

export interface Manager {
  slug: string;
  displayName: string;
  dynastyRank: number;
  dynastyScore: number;
  championships: number[];
  runnerUps: number[];
  playoffApps: number;
  careerWins: number;
  careerLosses: number;
  joinedYear: number;
  isAlumni?: boolean;
}

export const MANAGERS: Manager[] = [
${activeManagers.map(m => renderManager(m, '  ')).join(',\n')}
];

export const ALUMNI: Manager[] = [
${alumni.map(m => renderManager(m, '  ')).join(',\n')}
];

export const ALL_MANAGERS = [...MANAGERS, ...ALUMNI];

export function getManager(slug: string): Manager | undefined {
  return ALL_MANAGERS.find(m => m.slug === slug);
}

export function getWinPct(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return '.000';
  return (wins / total).toFixed(3).replace(/^0/, '');
}
`;

const outPath = path.join(process.cwd(), 'src/lib/league-data.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);
console.log(`✅  Generated ${outPath}`);
console.log(`   ${activeManagers.length} active managers, ${alumni.length} alumni`);
console.log('');
console.log('Dynasty rank order:');
activeManagers.forEach(m => {
  console.log(`  #${m.dynastyRank} ${m.displayName.padEnd(16)} score=${m.dynastyScore.toFixed(1).padStart(5)} champs=[${m.championships.join(',')}] career=${m.careerWins}-${m.careerLosses}`);
});
