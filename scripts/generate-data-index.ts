#!/usr/bin/env npx tsx
/**
 * BMFFFL Site Manifest Generator
 * Run: npx tsx scripts/generate-data-index.ts
 * Reads content/data/ and content/articles/ and writes content/data/site-manifest.json
 */

import fs from 'fs';
import path from 'path';
// gray-matter ships its own types; the eslint/tsc error is a missing @types stub
// in devDependencies — the package itself works fine at runtime via tsx.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const matter = require('gray-matter') as typeof import('gray-matter');

// ─── Config ───────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'content', 'data');
const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleEntry {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
}

interface DataFileEntry {
  filename: string;
  sizeBytes: number;
  modifiedAt: string;
}

interface SiteManifest {
  generatedAt: string;
  articles: ArticleEntry[];
  dataFiles: DataFileEntry[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugFromFilename(filename: string): string {
  return filename.replace(/\.(mdx?|md)$/, '');
}

// ─── Read Articles ─────────────────────────────────────────────────────────────

function readArticles(): ArticleEntry[] {
  console.log(`\nReading articles from: ${ARTICLES_DIR}`);

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.warn('  Articles directory not found — skipping.');
    return [];
  }

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => /\.(mdx?|md)$/.test(f))
    .sort();

  const articles: ArticleEntry[] = [];

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter } = matter(raw);

      const slug = slugFromFilename(file);
      const entry: ArticleEntry = {
        slug,
        title: typeof frontmatter.title === 'string' ? frontmatter.title : slug,
        category:
          typeof frontmatter.category === 'string' ? frontmatter.category : 'uncategorized',
        publishedAt:
          typeof frontmatter.publishedAt === 'string'
            ? frontmatter.publishedAt
            : typeof frontmatter.date === 'string'
            ? frontmatter.date
            : '',
      };

      articles.push(entry);
      console.log(`  ✓ ${file}  →  "${entry.title}" [${entry.category}]`);
    } catch (err) {
      console.warn(`  ✗ ${file}: parse error — ${(err as Error).message}`);
    }
  }

  return articles;
}

// ─── Read Data Files ───────────────────────────────────────────────────────────

function readDataFiles(): DataFileEntry[] {
  console.log(`\nReading data files from: ${DATA_DIR}`);

  if (!fs.existsSync(DATA_DIR)) {
    console.warn('  Data directory not found — skipping.');
    return [];
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'site-manifest.json')
    .sort();

  const dataFiles: DataFileEntry[] = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    try {
      const stats = fs.statSync(filePath);
      dataFiles.push({
        filename: file,
        sizeBytes: stats.size,
        modifiedAt: stats.mtime.toISOString(),
      });
      console.log(`  ✓ ${file}  (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.warn(`  ✗ ${file}: stat error — ${(err as Error).message}`);
    }
  }

  return dataFiles;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log('='.repeat(60));
  console.log('BMFFFL Site Manifest Generator');
  console.log('='.repeat(60));

  const articles = readArticles();
  const dataFiles = readDataFiles();

  const manifest: SiteManifest = {
    generatedAt: new Date().toISOString(),
    articles,
    dataFiles,
  };

  const outputPath = path.join(DATA_DIR, 'site-manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log(`Manifest written to: ${outputPath}`);
  console.log(`  ${articles.length} articles indexed`);
  console.log(`  ${dataFiles.length} data files indexed`);
  console.log('='.repeat(60));
}

main();
