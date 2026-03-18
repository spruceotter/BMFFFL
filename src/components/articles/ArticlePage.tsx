import type { ReactNode } from 'react';
import { Calendar, User, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/cn';
import ArticleCard from '@/components/articles/ArticleCard';
import type { ArticleCardData } from '@/components/articles/ArticleCard';
import type { ArticleCategory } from '@/data/schema';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticlePageProps {
  title: string;
  author: string;
  publishedAt: string;      // ISO date string
  category: string;
  tags?: string[];
  readTime?: number;        // minutes
  content: ReactNode;       // already-rendered MDX content
  validAsOf?: string;       // ISO date string — data freshness notice
  relatedArticles?: Array<{
    slug: string;
    title: string;
    category: string;
    publishedAt: string;
  }>;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  analysis:  { label: 'Analysis',  bg: 'bg-blue-900/60',   text: 'text-blue-300'   },
  preview:   { label: 'Preview',   bg: 'bg-purple-900/60', text: 'text-purple-300' },
  recap:     { label: 'Recap',     bg: 'bg-green-900/60',  text: 'text-green-300'  },
  rankings:  { label: 'Rankings',  bg: 'bg-amber-900/60',  text: 'text-amber-300'  },
  strategy:  { label: 'Strategy',  bg: 'bg-teal-900/60',   text: 'text-teal-300'   },
};

const DEFAULT_CATEGORY = { label: 'Article', bg: 'bg-[#2d4a66]', text: 'text-slate-300' };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function buildRelatedCard(article: {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
}): ArticleCardData {
  return {
    slug: article.slug,
    title: article.title,
    author: '',
    publishedAt: article.publishedAt,
    category: article.category as ArticleCategory,
    tags: [],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Full article page layout.
 * Accepts pre-rendered content (MDX or JSX) and renders it with manual
 * prose styling (does not depend on @tailwindcss/typography).
 */
export default function ArticlePage({
  title,
  author,
  publishedAt,
  category,
  tags = [],
  readTime,
  content,
  validAsOf,
  relatedArticles,
}: ArticlePageProps) {
  const catCfg = CATEGORY_CONFIG[category] ?? DEFAULT_CATEGORY;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

      {/* ── Article Header ──────────────────────────────────────────────── */}
      <header className="mb-10 pb-8 border-b border-[#2d4a66]">

        {/* Category tag */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide',
              catCfg.bg, catCfg.text
            )}
          >
            <Tag className="w-3 h-3" aria-hidden="true" />
            {catCfg.label}
          </span>

          {/* Tags */}
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-[#0f2744] text-slate-400 uppercase tracking-wide border border-[#2d4a66]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6">
          {title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          {author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" aria-hidden="true" />
              <span>{author}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          </span>
          {readTime !== undefined && readTime > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{readTime} min read</span>
            </span>
          )}
        </div>
      </header>

      {/* ── Valid-As-Of notice ───────────────────────────────────────────── */}
      {validAsOf && (
        <div className="mb-6 px-4 py-3 rounded-md bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm">
          Data valid as of {formatDate(validAsOf)}. Stats may have changed since publication.
        </div>
      )}

      {/* ── Article Body ─────────────────────────────────────────────────── */}
      {/*
        Manual prose styles — avoids dependency on @tailwindcss/typography.
        All heading/paragraph/list styles are applied via className on the
        wrapper div. The actual content elements are controlled by the caller
        (MDX processor or JSX), so we target common HTML elements via CSS
        classes applied with the `[&_...]` variant pattern supported by
        Tailwind v3+.
      */}
      <div
        className={cn(
          'text-slate-300 leading-7 text-base',
          // Paragraphs
          '[&_p]:mb-5 [&_p]:leading-7',
          // Headings
          '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-tight',
          '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:leading-tight',
          '[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-white [&_h4]:mt-6 [&_h4]:mb-2',
          // Unordered / ordered lists
          '[&_ul]:mb-5 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:text-slate-300',
          '[&_ol]:mb-5 [&_ol]:pl-6 [&_ol]:list-decimal [&_ol]:text-slate-300',
          '[&_li]:mb-1.5 [&_li]:leading-7',
          // Blockquote
          '[&_blockquote]:border-l-4 [&_blockquote]:border-[#e94560] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-6',
          // Code
          '[&_code]:font-mono [&_code]:text-sm [&_code]:bg-[#0f2744] [&_code]:text-[#ffd700] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded',
          '[&_pre]:bg-[#0f2744] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-5 [&_pre]:border [&_pre]:border-[#2d4a66]',
          '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-200',
          // Horizontal rule
          '[&_hr]:border-[#2d4a66] [&_hr]:my-8',
          // Strong / emphasis
          '[&_strong]:text-white [&_strong]:font-bold',
          '[&_em]:italic [&_em]:text-slate-200',
          // Links
          '[&_a]:text-[#ffd700] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#fff0a0]',
          // Tables
          '[&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_table]:mb-6',
          '[&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-slate-300 [&_th]:border [&_th]:border-[#2d4a66] [&_th]:bg-[#0f2744]',
          '[&_td]:px-3 [&_td]:py-2 [&_td]:border [&_td]:border-[#2d4a66] [&_td]:text-slate-300',
        )}
      >
        {content}
      </div>

      {/* ── Related Articles ─────────────────────────────────────────────── */}
      {relatedArticles && relatedArticles.length > 0 && (
        <aside
          className="mt-14 pt-10 border-t border-[#2d4a66]"
          aria-labelledby="related-heading"
        >
          <h2
            id="related-heading"
            className="text-xl font-bold text-white mb-6"
          >
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={buildRelatedCard(article)}
              />
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
