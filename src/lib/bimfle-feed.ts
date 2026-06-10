import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const FEED_DIR = path.join(process.cwd(), 'content', 'bimfle-feed');

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedEntryType = 'briefing' | 'analysis' | 'update' | 'article';

export interface FeedFrontmatter {
  title: string;
  type: FeedEntryType;
  publishedAt: string;   // ISO date string
  author: string;
  excerpt: string;
  tags: string[];
  rosters?: string[];    // BMFFFL owner IDs mentioned
  players?: string[];    // Player names mentioned
  featured?: boolean;
}

export interface FeedEntry {
  slug: string;
  frontmatter: FeedFrontmatter;
  content: string;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getAllFeedSlugs(): string[] {
  if (!fs.existsSync(FEED_DIR)) return [];
  return fs
    .readdirSync(FEED_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.(mdx|md)$/, ''));
}

export function getFeedEntryBySlug(slug: string): FeedEntry | null {
  const mdxPath = path.join(FEED_DIR, `${slug}.mdx`);
  const mdPath  = path.join(FEED_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as FeedFrontmatter,
    content,
  };
}

export function getAllFeedEntries(): FeedEntry[] {
  return getAllFeedSlugs()
    .map(getFeedEntryBySlug)
    .filter((e): e is FeedEntry => e !== null)
    .sort((a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
    );
}
