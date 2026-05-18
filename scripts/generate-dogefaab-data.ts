/**
 * BMFFFL DogeFAAB Data Generator
 *
 * Generates public/data/dogefaab.json from:
 *   - bimfle-data/sleeper.db  → historical FAAB bid data (2020-2025)
 *   - Sleeper API snapshot     → current 2026 FAAB balances (manual update needed)
 *
 * Run: npx tsx scripts/generate-dogefaab-data.ts
 *
 * NOTE: Current FAAB balances (CURRENT_FAAB_BALANCES) must be manually updated
 * by running the Sleeper rosters API and recording waiver_budget_used values.
 * Total budget per team = 10,000 FAAB. Remaining = 10,000 - waiver_budget_used.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require('/home/bimfle/bimfle/node_modules/better-sqlite3') as typeof import('better-sqlite3');
import * as fs from 'fs';
import * as path from 'path';

// ─── Constants ────────────────────────────────────────────────────────────────

const DB_PATH = `${process.env.HOME}/bimfle-data/sleeper.db`;
const OUT_PATH = path.join(process.cwd(), 'public', 'data', 'dogefaab.json');

/** Total DOGE held in BMFFFL treasury (Commissioner escrow) */
const TOTAL_DOGE_TREASURY = 2530;

/** FAAB buy rate: how many FAAB per 1 DOGE (fixed for purchases) */
const FAAB_BUY_RATE = 5; // 5 FAAB = 1 DOGE

/** Total FAAB budget per team per season (Sleeper internal units) */
const FAAB_BUDGET_PER_TEAM = 10000;

/**
 * Current 2026 FAAB balances (Sleeper API snapshot — update when season starts)
 * Source: Sleeper rosters endpoint, field: waiver_budget_used
 * Pulled: 2026-05-18 via Sleeper API
 * Remaining = FAAB_BUDGET_PER_TEAM - waiver_budget_used
 */
const CURRENT_FAAB_BALANCES: Record<string, number> = {
  'cogdeill11':    10000 - 5995,  // 4005
  'eldridsm':      10000 - 7833,  // 2167
  'rbr':           10000 - 8711,  // 1289
  'mlschools12':   10000 - 8715,  // 1285
  'sexmachineandyd': 10000 - 8844, // 1156
  'juicybussy':    10000 - 8980,  // 1020
  'bimfle':        10000 - 9014,  // 986  (steward of orphan roster)
  'grandes':       10000 - 9248,  // 752
  'cmaleski':      10000 - 9319,  // 681
  'tdtd19844':     10000 - 9495,  // 505
  'tubes94':       10000 - 9747,  // 253
  'eldridm20':     10000 - 9816,  // 184
};

/** Display name mapping for consistency across seasons */
const USERNAME_TO_DISPLAY: Record<string, string> = {
  'grandes':         'Grandes',
  'sexmachineandyd': 'SexMachineAndyD',
  'rbr':             'rbr',
  'cogdeill11':      'Cogdeill11',
  'mlschools12':     'MLSchools12',
  'cmaleski':        'Cmaleski',
  'eldridm20':       'eldridm20',
  'juicybussy':      'JuicyBussy',
  'escuelas':        'MCSchools',
  'eldridsm':        'eldridsm',
  'tdtd19844':       'tdtd19844',
  'tubes94':         'Tubes94',
  'mmoodie12':       'MMoodie12',
  'bimfle':          'Bimflé',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface OwnerBalance {
  username: string;
  displayName: string;
  faabRemaining: number;
  pctOfPool: number;
  dogeShare: number;
}

interface SeasonSpend {
  season: string;
  username: string;
  displayName: string;
  totalSpent: number;
  claims: number;
  biggestBid: number;
}

interface TopBid {
  season: string;
  week: number;
  username: string;
  displayName: string;
  bidAmount: number;
  transactionId: string;
}

interface DogeFaabData {
  generatedAt: string;
  treasury: {
    totalDoge: number;
    totalFaabOutstanding: number;
    buyRate: number;  // FAAB per DOGE (fixed)
    sellRate: number; // FAAB per DOGE (variable = totalFaab / totalDoge)
    balancesPulledAt: string;
  };
  currentBalances: OwnerBalance[];
  historicalSpend: SeasonSpend[];
  topBids: TopBid[];
  leagueTotalsBySeasonFaab: Record<string, number>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function generate(): DogeFaabData {
  const db = new Database(DB_PATH, { readonly: true });

  // 1. Current balances + DOGE allocations
  const totalFaab = Object.values(CURRENT_FAAB_BALANCES).reduce((a, b) => a + b, 0);
  const sellRate = totalFaab / TOTAL_DOGE_TREASURY;

  const currentBalances: OwnerBalance[] = Object.entries(CURRENT_FAAB_BALANCES)
    .map(([username, remaining]) => ({
      username,
      displayName: USERNAME_TO_DISPLAY[username] ?? username,
      faabRemaining: remaining,
      pctOfPool: Math.round((remaining / totalFaab) * 1000) / 10, // 1 decimal
      dogeShare: Math.round((remaining / totalFaab) * TOTAL_DOGE_TREASURY * 10) / 10,
    }))
    .sort((a, b) => b.faabRemaining - a.faabRemaining);

  // 2. Historical FAAB spend by season + owner
  const spendRows = (db.prepare(`
    SELECT fb.season, utm.username,
      SUM(fb.bid_amount)  AS total_spent,
      COUNT(*)            AS claims,
      MAX(fb.bid_amount)  AS biggest_bid
    FROM stage_v_faab_bids fb
    JOIN core_v_user_team_mappings utm
      ON fb.roster_id = utm.roster_id AND fb.season = utm.season
    WHERE fb.is_winner = 1
    GROUP BY fb.season, utm.username
    ORDER BY fb.season, total_spent DESC
  `) as import('better-sqlite3').Statement).all() as Array<{
    season: string; username: string;
    total_spent: number; claims: number; biggest_bid: number;
  }>;

  const historicalSpend: SeasonSpend[] = spendRows.map(r => ({
    season: r.season,
    username: r.username,
    displayName: USERNAME_TO_DISPLAY[r.username] ?? r.username,
    totalSpent: r.total_spent,
    claims: r.claims,
    biggestBid: r.biggest_bid,
  }));

  // League totals by season (FAAB units)
  const leagueTotals: Record<string, number> = {};
  for (const r of historicalSpend) {
    leagueTotals[r.season] = (leagueTotals[r.season] ?? 0) + r.totalSpent;
  }

  // 3. Top FAAB bids all-time
  const topBidRows = (db.prepare(`
    SELECT fb.season, fb.week, utm.username, fb.bid_amount, fb.transaction_id
    FROM stage_v_faab_bids fb
    JOIN core_v_user_team_mappings utm
      ON fb.roster_id = utm.roster_id AND fb.season = utm.season
    WHERE fb.is_winner = 1 AND fb.bid_amount > 0
    ORDER BY fb.bid_amount DESC
    LIMIT 25
  `) as import('better-sqlite3').Statement).all() as Array<{
    season: string; week: number; username: string;
    bid_amount: number; transaction_id: string;
  }>;

  const topBids: TopBid[] = topBidRows.map(r => ({
    season: r.season,
    week: r.week,
    username: r.username,
    displayName: USERNAME_TO_DISPLAY[r.username] ?? r.username,
    bidAmount: r.bid_amount,
    transactionId: r.transaction_id,
  }));

  db.close();

  return {
    generatedAt: new Date().toISOString(),
    treasury: {
      totalDoge: TOTAL_DOGE_TREASURY,
      totalFaabOutstanding: totalFaab,
      buyRate: FAAB_BUY_RATE,
      sellRate: Math.round(sellRate * 100) / 100,
      balancesPulledAt: '2026-05-18',
    },
    currentBalances,
    historicalSpend,
    topBids,
    leagueTotalsBySeasonFaab: leagueTotals,
  };
}

// ─── Run ──────────────────────────────────────────────────────────────────────

const data = generate();
fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 2));
console.log(`✓ Generated ${OUT_PATH}`);
console.log(`  Treasury: ${data.treasury.totalDoge} DOGE | ${data.treasury.totalFaabOutstanding} FAAB outstanding`);
console.log(`  Buy rate: ${data.treasury.buyRate} FAAB/DOGE | Sell rate: ${data.treasury.sellRate} FAAB/DOGE`);
console.log(`  Top holder: ${data.currentBalances[0].displayName} — ${data.currentBalances[0].faabRemaining} FAAB (${data.currentBalances[0].dogeShare} DOGE)`);
console.log(`  Historical seasons: ${Object.keys(data.leagueTotalsBySeasonFaab).join(', ')}`);
console.log(`  Top bid: ${data.topBids[0].displayName} — ${data.topBids[0].bidAmount} FAAB (${data.topBids[0].season} Wk ${data.topBids[0].week})`);
