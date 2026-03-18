/**
 * BMFFFL Website — Master Data Schema
 * All key entity types for the league website.
 * Generated: 2026-03-15 | task-537
 */

// ─── Core Entities ──────────────────────────────────────────────────────────

export interface League {
  id: string;               // Sleeper league ID
  name: string;             // "BMFFFL"
  season: number;           // e.g. 2025
  settings: LeagueSettings;
  commissioner: string;     // owner_id
  totalTeams: number;       // 12
}

export interface LeagueSettings {
  scoringType: 'half_ppr' | 'ppr' | 'standard';
  rosterSlots: RosterSlot[];
  playoffWeeks: [number, number];  // [start_week, end_week]
  dynastyMode: boolean;
  tradeDeadlineWeek: number;
}

export interface RosterSlot {
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'SF' | 'K' | 'DEF' | 'BN' | 'IR' | 'TAXI';
  count: number;
}

// ─── Season ─────────────────────────────────────────────────────────────────

export interface Season {
  year: number;
  status: 'pre_draft' | 'in_season' | 'playoffs' | 'complete' | 'offseason';
  champion?: Owner;
  runnerUp?: Owner;
  regularSeasonWinner?: Owner;
  mostPointsScored?: Owner;
  lowestSeed?: Owner;         // last place / toilet bowl loser
  standings: TeamStanding[];
}

export interface TeamStanding {
  ownerId: string;
  rank: number;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;            // e.g. "W3"
  playoffSeed?: number;
}

// ─── Owner ───────────────────────────────────────────────────────────────────

export interface Owner {
  id: string;               // Sleeper user_id
  displayName: string;      // "Chris", "Nick", etc.
  teamName: string;         // current team name
  avatar?: string;          // Sleeper avatar URL
  allTimeRecord: WinLossRecord;
  championships: number[];  // years won
  careerStats: CareerStats;
  seasons: OwnerSeason[];   // one per league year
}

export interface WinLossRecord {
  wins: number;
  losses: number;
  ties: number;
  winPct: number;
}

export interface CareerStats {
  totalPointsScored: number;
  avgPointsPerGame: number;
  highScore: number;
  highScoreYear: number;
  lowScore: number;
  playoffAppearances: number;
  championships: number;
  runnerUps: number;
  lastPlaceFinishes: number;
}

export interface OwnerSeason {
  year: number;
  teamName: string;
  finalRank: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  champion: boolean;
  runnerUp: boolean;
  playoff: boolean;
  draftPosition?: number;   // rookie draft slot
}

// ─── Player ──────────────────────────────────────────────────────────────────

export interface Player {
  id: string;               // Sleeper player_id
  fullName: string;
  firstName: string;
  lastName: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  nflTeam: string;          // "SF", "DAL", etc.
  jerseyNumber?: number;
  college?: string;
  birthDate?: string;       // ISO date
  height?: number;          // inches
  weight?: number;          // lbs
  yearsExp: number;         // NFL experience
  status: 'Active' | 'Injured Reserve' | 'Practice Squad' | 'Free Agent' | 'Retired';
  injuryStatus?: 'Q' | 'D' | 'O' | 'PUP' | 'IR' | null;
  searchRank?: number;      // Sleeper search rank
  avatarUrl?: string;       // https://sleepercdn.com/content/nfl/players/thumb/{id}.jpg
}

// ─── Roster / Team ───────────────────────────────────────────────────────────

export interface Roster {
  rosterId: number;         // Sleeper roster_id
  ownerId: string;
  leagueId: string;
  season: number;
  players: string[];        // player_ids
  starters: string[];
  reserve: string[];        // IR
  taxi: string[];
  metadata: RosterMetadata;
}

export interface RosterMetadata {
  record: string;           // "8-5-0"
  streak: string;
  pointsFor: number;
  pointsAgainst: number;
}

// ─── Draft ───────────────────────────────────────────────────────────────────

export interface Draft {
  id: string;               // Sleeper draft_id
  type: 'snake' | 'auction' | 'linear';
  draftType: 'rookie' | 'startup';
  season: number;
  status: 'pre_draft' | 'in_progress' | 'complete';
  picks: DraftPick[];
  settings: DraftSettings;
}

export interface DraftSettings {
  rounds: number;
  pickTimer: number;        // seconds
  slots: string[];          // position slots
}

export interface DraftPick {
  pickNumber: number;
  round: number;
  slot: number;
  ownerId: string;
  originalOwnerId?: string; // if traded
  playerId?: string;        // filled when pick made
  metadata?: PickMetadata;
}

export interface PickMetadata {
  playerName?: string;
  position?: string;
  team?: string;
  nominationAmount?: number; // auction
  amount?: number;           // auction winning bid
}

// ─── Trade ───────────────────────────────────────────────────────────────────

export interface Trade {
  transactionId: string;
  type: 'trade';
  status: 'complete' | 'failed';
  rosterIds: number[];      // rosters involved
  adds: Record<string, number>;   // playerId -> rosterId (receiving)
  drops: Record<string, number>;  // playerId -> rosterId (sending)
  draftPicks: TradedPick[];
  consenterIds: number[];
  week: number;
  season: number;
  timestamp: number;        // Unix ms
}

export interface TradedPick {
  season: number;
  round: number;
  rosterId: number;         // original owner
  previousOwnerId: number;
  ownerId: number;          // current owner
}

// ─── Matchup ─────────────────────────────────────────────────────────────────

export interface Matchup {
  matchupId: number;
  week: number;
  season: number;
  rosterId: number;
  starters: string[];
  starterPoints: number[];
  players: string[];
  points: number;
  customPoints?: number;
}

// ─── Article ─────────────────────────────────────────────────────────────────

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;           // "Flint" | owner display name
  publishedAt: string;      // ISO date
  updatedAt?: string;
  tags: string[];
  category: 'analysis' | 'preview' | 'recap' | 'rankings' | 'strategy';
  featured: boolean;
  coverImage?: string;
  content: string;          // Markdown
  validAsOf?: string;       // temporal context note
}

// ─── Convenience Types ───────────────────────────────────────────────────────

export type Position = Player['position'];
export type SeasonStatus = Season['status'];
export type ArticleCategory = Article['category'];

// ─── Sleeper API Response Types ──────────────────────────────────────────────

export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
}

export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  status: string;
  sport: string;
  settings: Record<string, unknown>;
  scoring_settings: Record<string, number>;
  roster_positions: string[];
  total_rosters: number;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  league_id: string;
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
    streak: number;
    waiver_position: number;
    total_moves: number;
  };
  metadata: Record<string, string> | null;
}
