/**
 * BMFFFL DogeFAAB Data Generator
 *
 * Generates public/data/dogefaab.json from:
 *   - bimfle-data/sleeper.db  → historical FAAB bid data, trades, player names (2020-2025)
 *   - Sleeper API snapshot     → current 2026 FAAB balances (manual update needed)
 *
 * Run: npx tsx scripts/generate-dogefaab-data.ts
 *
 * NOTE: Current FAAB balances (CURRENT_FAAB_BALANCES) must be manually updated
 * by running the Sleeper rosters API and recording waiver_budget_used values.
 * Remaining = 10000 - waiver_budget_used (Sleeper internal units).
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require('/home/bimfle/bimfle/node_modules/better-sqlite3') as typeof import('better-sqlite3');
import * as fs from 'fs';
import * as path from 'path';

// ─── Constants ────────────────────────────────────────────────────────────────

const DB_PATH = `${process.env.HOME}/bimfle-data/sleeper.db`;
const OUT_PATH = path.join(process.cwd(), 'public', 'data', 'dogefaab.json');

const TOTAL_DOGE_TREASURY = 2530;
const FAAB_BUY_RATE = 5; // 5 FAAB = 1 DOGE (fixed purchase rate)
const CURRENT_SEASON = '2026';

/**
 * Annual refresh buy limits for 2026 — set by Commissioner based on 2025 finish order.
 * Last place gets the highest limit. Values in FAAB units.
 * NOTE: Set to null until Commissioner provides confirmed values.
 * Formula: Pool = prior year total FAAB spend (4744), distributed inversely by standings.
 */
const REFRESH_LIMITS_2026: Record<string, number | null> = {
  'cogdeill11':      null,  // 2025 finish: 11th  → pending Commissioner confirmation
  'eldridsm':        null,  // 2025 finish: 9th
  'rbr':             null,  // 2025 finish: 10th
  'mlschools12':     null,  // 2025 finish: 1st  → lowest limit
  'sexmachineandyd': null,  // 2025 finish: 3rd
  'juicybussy':      null,  // 2025 finish: 5th
  'bimfle':          null,  // orphan roster
  'grandes':         null,  // 2025 finish: 12th → highest limit
  'cmaleski':        null,  // 2025 finish: 6th
  'tdtd19844':       null,  // 2025 finish: 4th  (2025 champion)
  'tubes94':         null,  // 2025 finish: 2nd
  'eldridm20':       null,  // 2025 finish: 7th
};

/**
 * Current 2026 FAAB balances (Sleeper API snapshot — update each season)
 * Source: Sleeper rosters endpoint, field: waiver_budget_used
 * Pulled: 2026-05-18 via Sleeper API
 * Remaining = 10000 - waiver_budget_used
 */
const CURRENT_FAAB_BALANCES: Record<string, number> = {
  'cogdeill11':      10000 - 5995,  // 4005
  'eldridsm':        10000 - 7833,  // 2167
  'rbr':             10000 - 8711,  // 1289
  'mlschools12':     10000 - 8715,  // 1285
  'sexmachineandyd': 10000 - 8844,  // 1156
  'juicybussy':      10000 - 8980,  // 1020
  'bimfle':          10000 - 9014,  // 986  (steward of orphan roster)
  'grandes':         10000 - 9248,  // 752
  'cmaleski':        10000 - 9319,  // 681
  'tdtd19844':       10000 - 9495,  // 505
  'tubes94':         10000 - 9747,  // 253
  'eldridm20':       10000 - 9816,  // 184
};

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
  playerName: string | null;
  playerPosition: string | null;
}

interface TradeNetFaab {
  season: string;
  username: string;
  displayName: string;
  netFaab: number;       // positive = gained FAAB in trades, negative = gave away
  received: number;
  sent: number;
}

interface RefreshLimit {
  username: string;
  displayName: string;
  limit: number | null;
}

interface DogeFaabData {
  generatedAt: string;
  currentSeason: string;
  treasury: {
    totalDoge: number;
    totalFaabOutstanding: number;
    buyRate: number;
    sellRate: number;
    balancesPulledAt: string;
    buyWindowStatus: string;
    buyWindowNote: string;
  };
  currentBalances: OwnerBalance[];
  refreshLimits: RefreshLimit[];
  historicalSpend: SeasonSpend[];
  topBids: TopBid[];
  tradeFaab: TradeNetFaab[];
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
      pctOfPool: Math.round((remaining / totalFaab) * 1000) / 10,
      dogeShare: Math.round((remaining / totalFaab) * TOTAL_DOGE_TREASURY * 10) / 10,
    }))
    .sort((a, b) => b.faabRemaining - a.faabRemaining);

  // 1b. Refresh limits for current season
  const refreshLimits: RefreshLimit[] = Object.entries(REFRESH_LIMITS_2026).map(([username, limit]) => ({
    username,
    displayName: USERNAME_TO_DISPLAY[username] ?? username,
    limit,
  }));

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

  const leagueTotals: Record<string, number> = {};
  for (const r of historicalSpend) {
    leagueTotals[r.season] = (leagueTotals[r.season] ?? 0) + r.totalSpent;
  }
  // Ensure current season appears in the matrix even with 0 spending (preseason)
  if (!leagueTotals[CURRENT_SEASON]) {
    leagueTotals[CURRENT_SEASON] = 0;
  }

  // 3. Top FAAB bids with player names
  const topBidRows = (db.prepare(`
    SELECT fb.season, fb.week, utm.username, fb.bid_amount, fb.transaction_id,
           txn.adds
    FROM stage_v_faab_bids fb
    JOIN core_v_user_team_mappings utm
      ON fb.roster_id = utm.roster_id AND fb.season = utm.season
    JOIN transactions txn ON fb.transaction_id = txn.transaction_id
    WHERE fb.is_winner = 1 AND fb.bid_amount > 0
    ORDER BY fb.bid_amount DESC
    LIMIT 25
  `) as import('better-sqlite3').Statement).all() as Array<{
    season: string; week: number; username: string;
    bid_amount: number; transaction_id: string;
    adds: string | null;
  }>;

  const topBids: TopBid[] = topBidRows.map(r => {
    let playerName: string | null = null;
    let playerPosition: string | null = null;

    if (r.adds) {
      try {
        const addsObj = JSON.parse(r.adds) as Record<string, number>;
        // Find player_id where the value (roster_id) matches the bidding roster
        // We just take the first player added in this transaction
        const playerIds = Object.keys(addsObj);
        if (playerIds.length > 0) {
          const playerStmt = db.prepare('SELECT first_name, last_name, position FROM players WHERE player_id=?') as import('better-sqlite3').Statement;
          const pRow = playerStmt.get(playerIds[0]) as { first_name: string; last_name: string; position: string } | undefined;
          if (pRow) {
            playerName = `${pRow.first_name} ${pRow.last_name}`;
            playerPosition = pRow.position;
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    return {
      season: r.season,
      week: r.week,
      username: r.username,
      displayName: USERNAME_TO_DISPLAY[r.username] ?? r.username,
      bidAmount: r.bid_amount,
      transactionId: r.transaction_id,
      playerName,
      playerPosition,
    };
  });

  // 4. FAAB in trades (net per owner per season)
  const tradeRows = (db.prepare(`
    SELECT l.season,
           json_extract(wb.value, '$.receiver') AS receiver_roster,
           json_extract(wb.value, '$.sender')   AS sender_roster,
           json_extract(wb.value, '$.amount')   AS amount
    FROM transactions txn
    JOIN leagues l ON txn.league_id = l.league_id
    JOIN json_each(txn.waiver_budget) wb
    WHERE txn.type = 'trade'
      AND txn.waiver_budget != '[]'
      AND txn.waiver_budget IS NOT NULL
    ORDER BY l.season
  `) as import('better-sqlite3').Statement).all() as Array<{
    season: string; receiver_roster: number; sender_roster: number; amount: number;
  }>;

  // Build net FAAB per roster per season
  const tradeNet: Record<string, { received: number; sent: number }> = {};
  for (const row of tradeRows) {
    const kR = `${row.season}:${row.receiver_roster}`;
    const kS = `${row.season}:${row.sender_roster}`;
    if (!tradeNet[kR]) tradeNet[kR] = { received: 0, sent: 0 };
    if (!tradeNet[kS]) tradeNet[kS] = { received: 0, sent: 0 };
    tradeNet[kR].received += row.amount;
    tradeNet[kS].sent += row.amount;
  }

  // Map roster_id → username per season using UTM
  const utmRows = (db.prepare(
    'SELECT season, roster_id, username FROM core_v_user_team_mappings'
  ) as import('better-sqlite3').Statement).all() as Array<{
    season: string; roster_id: number; username: string;
  }>;
  const rosterToUsername: Record<string, string> = {};
  for (const u of utmRows) {
    rosterToUsername[`${u.season}:${u.roster_id}`] = u.username;
  }

  const tradeFaab: TradeNetFaab[] = Object.entries(tradeNet)
    .map(([key, { received, sent }]) => {
      const [season, rosterStr] = key.split(':');
      const username = rosterToUsername[key] ?? `roster_${rosterStr}`;
      return {
        season,
        username,
        displayName: USERNAME_TO_DISPLAY[username] ?? username,
        netFaab: received - sent,
        received,
        sent,
      };
    })
    .sort((a, b) => a.season.localeCompare(b.season) || b.netFaab - a.netFaab);

  db.close();

  return {
    generatedAt: new Date().toISOString(),
    currentSeason: CURRENT_SEASON,
    treasury: {
      totalDoge: TOTAL_DOGE_TREASURY,
      totalFaabOutstanding: totalFaab,
      buyRate: FAAB_BUY_RATE,
      sellRate: Math.round(sellRate * 100) / 100,
      balancesPulledAt: '2026-05-18',
      buyWindowStatus: 'pending',
      buyWindowNote: '2026 annual refresh buy window opens after the Owners Meeting (May 26)',
    },
    currentBalances,
    refreshLimits,
    historicalSpend,
    topBids,
    tradeFaab,
    leagueTotalsBySeasonFaab: leagueTotals,
  };
}

// ─── Run ──────────────────────────────────────────────────────────────────────

const data = generate();
fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 2));
console.log(`✓ Generated ${OUT_PATH}`);
console.log(`  Treasury: ${data.treasury.totalDoge} DOGE | ${data.treasury.totalFaabOutstanding} FAAB`);
console.log(`  Top bid: ${data.topBids[0]?.displayName} — ${data.topBids[0]?.bidAmount} FAAB for ${data.topBids[0]?.playerName ?? '?'} (${data.topBids[0]?.season} Wk ${data.topBids[0]?.week})`);
console.log(`  Trade FAAB records: ${data.tradeFaab.length}`);
