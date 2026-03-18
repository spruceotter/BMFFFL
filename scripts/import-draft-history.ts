import * as fs from 'fs';
import * as path from 'path';

const LEAGUE_ID = '1312123497203376128';
const BASE_URL = 'https://api.sleeper.app/v1';

interface DraftSettings {
  rounds: number;
  teams: number;
  [key: string]: unknown;
}

interface Draft {
  draft_id: string;
  type: 'snake' | 'linear';
  status: string;
  season: string;
  settings: DraftSettings;
  league_id: string;
  [key: string]: unknown;
}

interface DraftPick {
  round: number;
  roster_id: number;
  player_id: string;
  picked_by: string;
  pick_no: number;
  metadata: Record<string, unknown>;
  [key: string]: unknown;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchDrafts(): Promise<Draft[]> {
  const url = `${BASE_URL}/league/${LEAGUE_ID}/drafts`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Error fetching drafts list: HTTP ${res.status}`);
      return [];
    }
    const data = await res.json() as Draft[];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Exception fetching drafts list:', err);
    return [];
  }
}

async function fetchPicksForDraft(draftId: string): Promise<DraftPick[]> {
  const url = `${BASE_URL}/draft/${draftId}/picks`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  Error fetching picks for draft ${draftId}: HTTP ${res.status}`);
      return [];
    }
    const data = await res.json() as DraftPick[];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`  Exception fetching picks for draft ${draftId}:`, err);
    return [];
  }
}

async function main(): Promise<void> {
  console.log('Fetching drafts list...');
  const drafts = await fetchDrafts();
  console.log(`Found ${drafts.length} draft(s)`);
  await sleep(100);

  const draftsWithPicks = [];

  for (const draft of drafts) {
    console.log(`Fetching picks for draft ${draft.draft_id} (season ${draft.season})...`);
    const picks = await fetchPicksForDraft(draft.draft_id);
    console.log(`  Got ${picks.length} picks`);

    draftsWithPicks.push({
      draft_id: draft.draft_id,
      type: draft.type,
      status: draft.status,
      season: draft.season,
      settings: draft.settings,
      picks,
    });

    await sleep(100);
  }

  const output = {
    fetchedAt: new Date().toISOString(),
    drafts: draftsWithPicks,
  };

  const outPath = path.join(process.cwd(), 'content', 'data', 'draft-history.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch(console.error);
