#!/usr/bin/env npx tsx
/**
 * BMFFFL Unified Data Generator
 *
 * Single command to regenerate ALL derived static data from the two
 * authoritative sources:
 *   - bimfle-data/sleeper.db          (Sleeper era 2020-2025)
 *   - bimfle-data/espn-era/           (ESPN era 2016-2019)
 *
 * Usage:
 *   npm run generate         # regenerate all data files
 *
 * Output files (src/lib/):
 *   league-data.ts           ← from generate-league-data.ts
 *   h2h-data.ts              ← from generate-h2h-data.ts  (exp-006)
 *   manager-efficiency-data.ts ← from generate-manager-efficiency.ts
 *
 * Architecture principle: logic that defines a stat lives in ONE place —
 * the generate script that owns its domain. No page re-implements a shared
 * concept independently. Changes flow through: DB → generate script → static
 * data file → page(s).
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

interface GenerateTask {
  name: string;
  script: string;
  output: string;
}

const TASKS: GenerateTask[] = [
  {
    name: 'League Data',
    script: 'generate-league-data.ts',
    output: 'src/lib/league-data.ts',
  },
  {
    name: 'H2H Records',
    script: 'generate-h2h-data.ts',
    output: 'src/lib/h2h-data.ts',
  },
  {
    name: 'Manager Efficiency',
    script: 'generate-manager-efficiency.ts',
    output: 'src/lib/manager-efficiency-data.ts',
  },
];

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log('🏈 BMFFFL — Unified Data Generator');
console.log('   Sources: bimfle-data/sleeper.db + bimfle-data/espn-era/');
console.log('');

let passed = 0;
let failed = 0;
const start = Date.now();

for (const task of TASKS) {
  const scriptPath = path.join(SCRIPTS_DIR, task.script);
  const taskStart = Date.now();
  process.stdout.write(`  ${task.name.padEnd(24)} `);

  if (!fs.existsSync(scriptPath)) {
    const ms = Date.now() - taskStart;
    console.log(`⏭   SKIPPED — script not present (${ms}ms)`);
    continue;
  }

  try {
    execSync(`npx tsx ${scriptPath}`, { stdio: 'pipe' });
    const ms = Date.now() - taskStart;
    console.log(`✅  → ${task.output} (${ms}ms)`);
    passed++;
  } catch (err) {
    const ms = Date.now() - taskStart;
    const errMsg = (err as { stderr?: Buffer }).stderr?.toString().split('\n')[0] ?? 'unknown error';
    console.log(`❌  FAILED (${ms}ms): ${errMsg}`);
    failed++;
  }
}

const totalMs = Date.now() - start;
console.log('');
console.log(`${passed} passed, ${failed} failed — ${totalMs}ms total`);

if (failed > 0) {
  process.exit(1);
}
