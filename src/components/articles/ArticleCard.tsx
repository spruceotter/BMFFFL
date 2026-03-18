import Link from 'next/link';
import { Calendar, User, Tag } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ArticleCategory } from '@/data/schema';

export interface ArticleCardData {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  publishedAt: string;   // ISO date string
  category: ArticleCategory;
  tags: string[];
  excerpt?: string;      // short description; falls back to subtitle
}

interface ArticleCardProps {
  article: ArticleCardData;
  className?: string;
}

const CATEGORY_CONFIG: Record<ArticleCategory, { label: string; bg: string; text: string }> = {
  analysis:  { label: 'Analysis',  bg: 'bg-blue-900/60',   text: 'text-blue-300'   },
  preview:   { label: 'Preview',   bg: 'bg-purple-900/60', text: 'text-purple-300' },
  recap:     { label: 'Recap',     bg: 'bg-green-900/60',  text: 'text-green-300'  },
  rankings:  { label: 'Rankings',  bg: 'bg-amber-900/60',  text: 'text-amber-300'  },
  strategy:  { label: 'Strategy',  bg: 'bg-teal-900/60',   text: 'text-teal-300'   },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

/**
 * Article card for a news feed or article list.
 * Clicking anywhere navigates to /articles/{slug}.
 */
export default function ArticleCard({ article, className }: ArticleCardProps) {
  const categoryCfg = CATEGORY_CONFIG[article.category];
  const displayText = article.excerpt ?? article.subtitle;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        'group block rounded-xl overflow-hidden',
        'bg-[#1a2d42] border border-[#2d4a66]',
        'transition-all duration-200',
        'hover:border-[#e94560] hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1',
        className
      )}
      aria-label={`Read article: ${article.title}`}
    >
      {/* Top accent bar — colored per category */}
      <div
        className={cn('h-1 w-full', categoryCfg.bg.replace('/60', ''))}
        aria-hidden="true"
      />

      <div className="p-5">
        {/* Category tag */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide',
              categoryCfg.bg,
              categoryCfg.text
            )}
          >
            <Tag className="w-3 h-3" aria-hidden="true" />
            {categoryCfg.label}
          </span>

          {/* Additional tags (first 2 only, space permitting) */}
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#0f2744] text-slate-400 uppercase tracking-wide border border-[#2d4a66]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-[#ffd700] transition-colors duration-150 line-clamp-2">
          {article.title}
        </h2>

        {/* Excerpt / subtitle */}
        {displayText && (
          <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
            {displayText}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-[#2d4a66] pt-3 mt-auto">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" aria-hidden="true" />
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
