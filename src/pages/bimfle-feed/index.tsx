import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import { Bot, Calendar, Tag, FileText, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getAllFeedEntries, FeedEntry, FeedEntryType } from '@/lib/bimfle-feed';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeedPageProps {
  entries: Array<{
    slug: string;
    title: string;
    type: FeedEntryType;
    publishedAt: string;
    author: string;
    excerpt: string;
    tags: string[];
    rosters?: string[];
  }>;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<FeedEntryType, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  briefing: {
    label: 'Daily Brief',
    icon: <RefreshCw className="w-3 h-3" />,
    bg: 'bg-blue-900/60',
    text: 'text-blue-300',
    border: 'border-blue-700/40',
  },
  analysis: {
    label: 'Analysis',
    icon: <TrendingUp className="w-3 h-3" />,
    bg: 'bg-purple-900/60',
    text: 'text-purple-300',
    border: 'border-purple-700/40',
  },
  update: {
    label: 'Update',
    icon: <Zap className="w-3 h-3" />,
    bg: 'bg-amber-900/60',
    text: 'text-amber-300',
    border: 'border-amber-700/40',
  },
  article: {
    label: 'Article',
    icon: <FileText className="w-3 h-3" />,
    bg: 'bg-teal-900/60',
    text: 'text-teal-300',
    border: 'border-teal-700/40',
  },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ─── Feed Card ────────────────────────────────────────────────────────────────

function FeedCard({ entry }: { entry: FeedPageProps['entries'][0] }) {
  const cfg = TYPE_CONFIG[entry.type];

  return (
    <Link
      href={`/bimfle-feed/${entry.slug}`}
      className={cn(
        'group block rounded-xl overflow-hidden',
        'bg-[#1a2d42] border border-[#2d4a66]',
        'transition-all duration-200',
        'hover:border-[#ffd700] hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5',
      )}
    >
      {/* Top accent */}
      <div className={cn('h-0.5 w-full', cfg.bg.replace('/60', ''))} />

      <div className="p-5">
        {/* Type badge + tags */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide',
            cfg.bg, cfg.text,
          )}>
            {cfg.icon}
            {cfg.label}
          </span>
          {entry.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#0f2744] text-slate-400 uppercase tracking-wide border border-[#2d4a66]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-[#ffd700] transition-colors duration-150">
          {entry.title}
        </h2>

        {/* Excerpt */}
        {entry.excerpt && (
          <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
            {entry.excerpt}
          </p>
        )}

        {/* Rosters mentioned */}
        {entry.rosters && entry.rosters.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {entry.rosters.map((r) => (
              <span
                key={r}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30 uppercase tracking-wide"
              >
                {r}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-[#2d4a66] pt-3">
          <span className="flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-[#ffd700]/60" />
            {entry.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(entry.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BimfleFeedPage({ entries }: FeedPageProps) {
  return (
    <>
      <Head>
        <title>Bimflé's Feed — BMFFFL</title>
        <meta
          name="description"
          content="Daily NFL briefings, dynasty analysis, and roster notes from Bimflé — the BMFFFL AI Commissioner Assistant."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/30">
              <Bot className="w-6 h-6 text-[#ffd700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bimflé's Feed</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Daily briefings, dynasty analysis &amp; roster notes
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(Object.entries(TYPE_CONFIG) as [FeedEntryType, typeof TYPE_CONFIG[FeedEntryType]][]).map(([type, cfg]) => (
              <span
                key={type}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
                  cfg.bg, cfg.text,
                )}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            ))}
          </div>

          {/* Feed */}
          {entries.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No entries yet — check back soon.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {entries.map((entry) => (
                <FeedCard key={entry.slug} entry={entry} />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}

// ─── Static generation ────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<FeedPageProps> = async () => {
  const raw = getAllFeedEntries();
  const entries = raw.map((e: FeedEntry) => ({
    slug: e.slug,
    title: e.frontmatter.title,
    type: e.frontmatter.type,
    publishedAt: e.frontmatter.publishedAt,
    author: e.frontmatter.author,
    excerpt: e.frontmatter.excerpt,
    tags: e.frontmatter.tags,
    rosters: e.frontmatter.rosters,
  }));

  return { props: { entries } };
};
