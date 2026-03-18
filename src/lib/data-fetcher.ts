/**
 * BMFFFL Static Data Fetcher
 * Server-side utilities for loading JSON data files from content/data/.
 * Safe to call from getStaticProps — uses fs.readFileSync, never fetch.
 */

import fs from 'fs';
import path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RosterPlayer {
  player: string;
  pos: string;
  nflTeam: string;
  age: number;
}

export interface RosterEntry {
  rosterId: number;
  owner: string;
  teamName: string;
  division: string;
  record2025: string;
  points2025: number;
  dynastyRank: number;
  starters: RosterPlayer[];
  keyBench: RosterPlayer[];
  taxi: string[];
  note?: string;
}

export interface SeasonStanding {
  rank: number;
  owner: string;
  team: string;
  wins: number;
  losses: number;
  pointsFor: number;
  seed: number | null;
  playoffResult: string;
}

export interface SeasonHistory {
  champion: string;
  runnerUp: string;
  thirdPlace?: string | null;
  moodieBowl?: string | null;
  regularSeasonWinner: string;
  standings: SeasonStanding[];
}

export interface StandingsHistory {
  seasons: Record<string, SeasonHistory>;
}

export interface OwnerStats {
  owner: string;
  allTimeRecord: string;
  winPct: number;
  championships: number;
  championshipSeasons?: number[];
  playoffAppearances: number;
  playoffRate: number;
  runnerUps: number;
  runnerUpSeasons?: number[];
  moodieBowls: number;
  validationStatus: string;
  crossReferenceNotes: string;
  discrepancies: string;
}

export interface ChampionEntry {
  season: number;
  champion: string;
  teamName: string;
  championshipScore: number | null;
  runnerUpScore?: number | null;
  margin?: number | null;
  runnerUp: string;
  thirdPlace?: string;
  moodieBowl?: string;
  championRecord: string;
  championSeed: number;
  notablePlayer: string;
  consistencyCheck: string;
  notes: string;
}

export interface PickSummaryEntry {
  owner: string;
  picks2026: number;
  picks2027: number;
  total: number;
  firsts2026: number;
  firsts2027: number;
  note: string;
}

export interface PickDetail {
  round: number;
  source: string;
  note?: string;
}

export interface PickInventory {
  summary: PickSummaryEntry[];
  highlights: Record<string, string>;
  picks2026: Record<string, PickDetail[]>;
  picks2027?: Record<string, PickDetail[]>;
}

export interface SnapshotMeta {
  generatedAt: string;
  leagueId: string;
  season: number;
}

// ─── Core Loader ──────────────────────────────────────────────────────────────

/**
 * Load any JSON file from content/data/.
 * Safe for server-side use in getStaticProps.
 */
export function loadDataFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'content', 'data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

// ─── Typed Loaders ────────────────────────────────────────────────────────────

/**
 * Load the 2026 offseason roster data.
 * File: content/data/rosters-2026.json
 */
export function loadCurrentRosters(): RosterEntry[] {
  const data = loadDataFile<{ rosters: RosterEntry[] }>('rosters-2026.json');
  return data.rosters;
}

/**
 * Load historical standings from 2020 through the current season.
 * File: content/data/standings-history.json
 */
export function loadStandingsHistory(): StandingsHistory {
  const data = loadDataFile<StandingsHistory>('standings-history.json');
  return data;
}

/**
 * Load verified owner career stats.
 * File: content/data/owner-stats-verified.json
 */
export function loadOwnerStats(): OwnerStats[] {
  const data = loadDataFile<{ verifiedRecords: OwnerStats[] }>('owner-stats-verified.json');
  return data.verifiedRecords;
}

/**
 * Load verified champion history from 2020–2025.
 * File: content/data/champions-verified.json
 */
export function loadChampions(): ChampionEntry[] {
  const data = loadDataFile<{ champions: ChampionEntry[] }>('champions-verified.json');
  return data.champions;
}

/**
 * Load the 2026/2027 draft pick inventory.
 * File: content/data/pick-inventory-2026.json
 */
export function loadPickInventory(): PickInventory {
  return loadDataFile<PickInventory>('pick-inventory-2026.json');
}

/**
 * Load the snapshot metadata written by fetch-sleeper-snapshot.ts.
 * Returns null if the file does not yet exist (pre-first-run).
 * File: content/data/snapshot-meta.json
 */
export function loadSnapshotMeta(): SnapshotMeta | null {
  try {
    return loadDataFile<SnapshotMeta>('snapshot-meta.json');
  } catch {
    return null;
  }
}
