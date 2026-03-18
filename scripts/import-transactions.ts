import * as fs from 'fs';
import * as path from 'path';

const LEAGUE_ID = '1312123497203376128';
const BASE_URL = 'https://api.sleeper.app/v1';

interface Transaction {
  transaction_id: string;
  type: 'trade' | 'waiver' | 'free_agent';
  status: string;
  created: number;
  consenter_ids: string[];
  adds: Record<string, string> | null;
  drops: Record<string, string> | null;
  draft_picks: unknown[];
}

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchTransactionsForRound(round: number): Promise<Transaction[]> {
  const url = `${BASE_URL}/league/${LEAGUE_ID}/transactions/${round}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  Error fetching round ${round}: HTTP ${res.status}`);
      return [];
    }
    const data = await res.json() as Transaction[];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`  Exception fetching round ${round}:`, err);
    return [];
  }
}

async function main(): Promise<void> {
  const allTransactions: Transaction[] = [];

  // Fetch rounds 1-18 for full season coverage
  for (let week = 1; week <= 18; week++) {
    console.log(`Fetching week ${week}...`);
    const transactions = await fetchTransactionsForRound(week);
    console.log(`  Got ${transactions.length} transactions for round ${week}`);
    allTransactions.push(...transactions);
    await sleep(100);
  }

  // Deduplicate by transaction_id
  const seen = new Set<string>();
  const unique = allTransactions.filter(t => {
    if (seen.has(t.transaction_id)) return false;
    seen.add(t.transaction_id);
    return true;
  });

  console.log(`\nTotal unique transactions: ${unique.length}`);

  const output = {
    fetchedAt: new Date().toISOString(),
    leagueId: LEAGUE_ID,
    transactions: unique,
  };

  const outPath = path.join(process.cwd(), 'content', 'data', 'transactions-history.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch(console.error);
