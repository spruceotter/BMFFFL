#!/usr/bin/env npx tsx
/**
 * BMFFFL Sleeper Data Snapshot Script
 * Run: npx tsx scripts/fetch-sleeper-snapshot.ts
 * Fetches current league data and writes to content/data/
 */

import fs from 'fs';
import path from 'path';

// ─── Config ───────────────────────────────────────────────────────────────────

const LEAGUE_ID = '1312123497203376128';
const SLEEPER_BASE = 'https://api.sleeper.app/v1';
const OUTPUT_DIR = path.join(process.cwd(), 'content', 'data');
const SEASON = 2025;
const REGULAR_SEASON_WEEKS = 14;
const RATE_LIMIT_MS = 100;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SleeperLeagueInfo {
  name: string;
  season: string;
  status: string;
  total_rosters: number;
  scoring_settings: Record<string, number>;
  roster_positions: string[];
}

interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
}

interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  players: string[];
  starters: string[];
  reserve: string[] | null;
  taxi: string[] | null;
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_decimal: number;
    fpts_against: number;
    fpts_against_decimal: number;
  };
}

interface SleeperMatchup {
  matchup_id: number;
  roster_id: number;
  starters: string[];
  players: string[];
  points: number;
  starters_points: number[];
}

interface SleeperTransaction {
  transaction_id: string;
  type: 'trade' | 'free_agent' | 'waiver';
  status: string;
  created: number;
  adds: Record<string, number> | null;
  drops: Record<string, number> | null;
  roster_ids: number[];
  draft_picks: Array<{
    season: string;
    round: number;
    roster_id: number;
    previous_owner_id: number;
    owner_id: number;
  }>;
  metadata: Record<string, string> | null;
  leg: number;
  consenter_ids: number[];
  waiver_budget: Array<{ sender: number; receiver: number; amount: number }>;
}

interface WeeklyMatchups {
  week: number;
  matchups: SleeperMatchup[];
}

interface WeeklyTransactions {
  week: number;
  transactions: SleeperTransaction[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function writeJson(filename: string, data: unknown): void {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✓ Wrote ${filename}`);
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}

// ─── Fetch Functions ──────────────────────────────────────────────────────────

async function fetchLeagueInfo(): Promise<SleeperLeagueInfo> {
  console.log('\n[1/6] Fetching league info...');
  const data = await fetchJson<SleeperLeagueInfo>(
    `${SLEEPER_BASE}/league/${LEAGUE_ID}`
  );
  writeJson('league-info.json', data);
  return data;
}

async function fetchUsers(): Promise<SleeperUser[]> {
  console.log('\n[2/6] Fetching users...');
  const data = await fetchJson<SleeperUser[]>(
    `${SLEEPER_BASE}/league/${LEAGUE_ID}/users`
  );
  writeJson('users.json', data);
  return data;
}

async function fetchCurrentRosters(): Promise<SleeperRoster[]> {
  console.log('\n[3/6] Fetching current rosters...');
  const data = await fetchJson<SleeperRoster[]>(
    `${SLEEPER_BASE}/league/${LEAGUE_ID}/rosters`
  );
  writeJson('rosters-current.json', data);
  return data;
}

async function fetchAllMatchups(): Promise<WeeklyMatchups[]> {
  console.log(`\n[4/6] Fetching matchups for weeks 1–${REGULAR_SEASON_WEEKS}...`);
  const allMatchups: WeeklyMatchups[] = [];

  for (let week = 1; week <= REGULAR_SEASON_WEEKS; week++) {
    try {
      const matchups = await fetchJson<SleeperMatchup[]>(
        `${SLEEPER_BASE}/league/${LEAGUE_ID}/matchups/${week}`
      );
      allMatchups.push({ week, matchups });
      console.log(`  Week ${week}: ${matchups.length} matchup entries`);
    } catch (err) {
      console.warn(`  Week ${week}: fetch failed — ${(err as Error).message}`);
      allMatchups.push({ week, matchups: [] });
    }
    await delay(RATE_LIMIT_MS);
  }

  writeJson('matchups-2025.json', {
    _meta: `BMFFFL matchups — ${SEASON} regular season weeks 1–${REGULAR_SEASON_WEEKS}`,
    leagueId: LEAGUE_ID,
    season: SEASON,
    weeks: allMatchups,
  });

  return allMatchups;
}

async function fetchAllTransactions(): Promise<WeeklyTransactions[]> {
  console.log(`\n[5/6] Fetching transactions for weeks 1–${REGULAR_SEASON_WEEKS}...`);
  const allTransactions: WeeklyTransactions[] = [];

  for (let week = 1; week <= REGULAR_SEASON_WEEKS; week++) {
    try {
      const transactions = await fetchJson<SleeperTransaction[]>(
        `${SLEEPER_BASE}/league/${LEAGUE_ID}/transactions/${week}`
      );
      const trades = transactions.filter((t) => t.type === 'trade');
      allTransactions.push({ week, transactions });
      console.log(
        `  Week ${week}: ${transactions.length} transactions (${trades.length} trades)`
      );
    } catch (err) {
      console.warn(`  Week ${week}: fetch failed — ${(err as Error).message}`);
      allTransactions.push({ week, transactions: [] });
    }
    await delay(RATE_LIMIT_MS);
  }

  writeJson('transactions-2025.json', {
    _meta: `BMFFFL transactions — ${SEASON} season weeks 1–${REGULAR_SEASON_WEEKS}`,
    leagueId: LEAGUE_ID,
    season: SEASON,
    weeks: allTransactions,
  });

  return allTransactions;
}

function writeSnapshotMeta(): void {
  console.log('\n[6/6] Writing snapshot metadata...');
  writeJson('snapshot-meta.json', {
    generatedAt: new Date().toISOString(),
    leagueId: LEAGUE_ID,
    season: SEASON,
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('BMFFFL Sleeper Data Snapshot');
  console.log(`League ID : ${LEAGUE_ID}`);
  console.log(`Season    : ${SEASON}`);
  console.log(`Output    : ${OUTPUT_DIR}`);
  console.log('='.repeat(60));

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  try {
    await fetchLeagueInfo();
    await delay(RATE_LIMIT_MS);

    await fetchUsers();
    await delay(RATE_LIMIT_MS);

    await fetchCurrentRosters();
    await delay(RATE_LIMIT_MS);

    await fetchAllMatchups();

    await fetchAllTransactions();

    writeSnapshotMeta();

    console.log('\n' + '='.repeat(60));
    console.log('Snapshot complete.');
    console.log('='.repeat(60));
  } catch (err) {
    console.error('\nFatal error during snapshot:', (err as Error).message);
    process.exit(1);
  }
}

main();
