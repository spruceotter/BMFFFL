import * as fs from 'fs';
import * as path from 'path';

const LEAGUE_ID = '1312123497203376128';
const BASE_URL = 'https://api.sleeper.app/v1';
const SEASON = '2025';

interface MatchupEntry {
  roster_id: number;
  matchup_id: number;
  points: number;
  custom_points: number | null;
  players: string[];
  starters: string[];
  players_points: Record<string, number>;
  starters_points: number[];
}

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchMatchupsForWeek(week: number): Promise<MatchupEntry[]> {
  const url = `${BASE_URL}/league/${LEAGUE_ID}/matchups/${week}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  Error fetching week ${week}: HTTP ${res.status}`);
      return [];
    }
    const data = await res.json() as MatchupEntry[];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`  Exception fetching week ${week}:`, err);
    return [];
  }
}

async function main(): Promise<void> {
  const weeklyMatchups: Record<string, MatchupEntry[]> = {};

  // Fetch weeks 1-17 for current season
  for (let week = 1; week <= 17; week++) {
    console.log(`Fetching week ${week}...`);
    const matchups = await fetchMatchupsForWeek(week);
    console.log(`  Got ${matchups.length} matchup entries for week ${week}`);
    weeklyMatchups[`week${week}`] = matchups;
    await sleep(100);
  }

  const output = {
    fetchedAt: new Date().toISOString(),
    leagueId: LEAGUE_ID,
    seasons: {
      [SEASON]: weeklyMatchups,
    },
  };

  const outPath = path.join(process.cwd(), 'content', 'data', 'matchups-history.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch(console.error);
