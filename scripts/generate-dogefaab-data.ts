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
 * 2026 Annual Refresh Buy Limits — computed from 2025 finish order + prior year FAAB spend.
 *
 * Pool = 2025 total FAAB spend (4,744 FAAB, lowest since 2022)
 * Formula (per Commissioner):
 *   Positions 1-3 (playoff 1st/2nd/3rd): 1.75% each
 *   Position 4 (playoff 4th): 3.51%
 *   Position 5 (playoff 5th): 5.26%
 *   Position 6 (playoff 6th): 7.02%
 *   Positions 7-12 (non-playoff, regular season order): 8.77%, 10.53%, 12.28%, 14.04%, 15.79%, 17.54%
 *
 * 2025 Playoff finish order:
 *   1st: tdtd19844 (Champion), 2nd: Tubes94, 3rd: MLSchools12, 4th: Cmaleski,
 *   5th: SexMachineAndyD, 6th: JuicyBussy
 * 2025 Non-playoff (regular season rank 7-12):
 *   7th: eldridm20, 8th: MCSchools (orphan→bimfle), 9th: eldridsm, 10th: rbr, 11th: Cogdeill11, 12th: Grandes
 *
 * Limits rounded to nearest integer. Total ≈ 4,744 FAAB.
 */
const POOL_2025 = 4744;
function pctToFaab(pct: number) { return Math.round(POOL_2025 * pct / 100); }

const REFRESH_LIMITS_2026: Record<string, number | null> = {
  'tdtd19844':       pctToFaab(1.75),   // 2025: Champion        → 83 FAAB
  'tubes94':         pctToFaab(1.75),   // 2025: Runner-up       → 83 FAAB
  'mlschools12':     pctToFaab(1.75),   // 2025: 3rd place       → 83 FAAB
  'cmaleski':        pctToFaab(3.51),   // 2025: 4th place       → 167 FAAB
  'sexmachineandyd': pctToFaab(5.26),   // 2025: 5th place       → 250 FAAB
  'juicybussy':      pctToFaab(7.02),   // 2025: 6th place       → 333 FAAB
  'eldridm20':       pctToFaab(8.77),   // 2025: 7th (reg seas.) → 416 FAAB
  'bimfle':          pctToFaab(10.53),  // 2025: 8th (MCSchools orphan → bimfle) → 500 FAAB
  'eldridsm':        pctToFaab(12.28),  // 2025: 9th             → 583 FAAB
  'rbr':             pctToFaab(14.04),  // 2025: 10th            → 666 FAAB
  'cogdeill11':      pctToFaab(15.79),  // 2025: 11th            → 749 FAAB
  'grandes':         pctToFaab(17.54),  // 2025: 12th            → 832 FAAB
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
  finishPosition: number;
  finishPct: number;
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

  // 1b. Refresh limits for current season — with finish position + pct for display
  const FINISH_ORDER_2026: Record<string, { pos: number; pct: number }> = {
    'tdtd19844':       { pos: 1,  pct: 1.75  },
    'tubes94':         { pos: 2,  pct: 1.75  },
    'mlschools12':     { pos: 3,  pct: 1.75  },
    'cmaleski':        { pos: 4,  pct: 3.51  },
    'sexmachineandyd': { pos: 5,  pct: 5.26  },
    'juicybussy':      { pos: 6,  pct: 7.02  },
    'eldridm20':       { pos: 7,  pct: 8.77  },
    'bimfle':          { pos: 8,  pct: 10.53 },
    'eldridsm':        { pos: 9,  pct: 12.28 },
    'rbr':             { pos: 10, pct: 14.04 },
    'cogdeill11':      { pos: 11, pct: 15.79 },
    'grandes':         { pos: 12, pct: 17.54 },
  };

  const refreshLimits: RefreshLimit[] = Object.entries(REFRESH_LIMITS_2026)
    .map(([username, limit]) => {
      const fo = FINISH_ORDER_2026[username] ?? { pos: 99, pct: 0 };
      return {
        username,
        displayName: USERNAME_TO_DISPLAY[username] ?? username,
        limit,
        finishPosition: fo.pos,
        finishPct: fo.pct,
      };
    })
    .sort((a, b) => a.finishPosition - b.finishPosition);

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
