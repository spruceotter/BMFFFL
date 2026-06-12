import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { getAllFeedSlugs, getFeedEntryBySlug, FeedFrontmatter, FeedEntryType } from '@/lib/bimfle-feed';
import { Bot, Calendar, ArrowLeft, Tag, RefreshCw, TrendingUp, Zap, FileText } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeedSlugPageProps {
  frontmatter: FeedFrontmatter;
  mdxSource: MDXRemoteSerializeResult;
  slug: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<FeedEntryType, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  briefing: { label: 'Daily Brief', icon: <RefreshCw className="w-3.5 h-3.5" />, bg: 'bg-blue-900/60', text: 'text-blue-300' },
  analysis: { label: 'Analysis',    icon: <TrendingUp className="w-3.5 h-3.5" />, bg: 'bg-purple-900/60', text: 'text-purple-300' },
  update:   { label: 'Update',      icon: <Zap className="w-3.5 h-3.5" />, bg: 'bg-amber-900/60', text: 'text-amber-300' },
  article:  { label: 'Article',     icon: <FileText className="w-3.5 h-3.5" />, bg: 'bg-teal-900/60', text: 'text-teal-300' },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ─── Static generation ────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllFeedSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<FeedSlugPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const entry = getFeedEntryBySlug(slug);

  if (!entry) return { notFound: true };

  const mdxSource = await serialize(entry.content, {
    mdxOptions: { remarkPlugins: [remarkGfm] },
  });

  return {
    props: {
      frontmatter: entry.frontmatter,
      mdxSource,
      slug,
    },
  };
};

// ─── MDX custom components ────────────────────────────────────────────────────

const mdxComponents = {
  table: ({ children }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-[#2d4a66]">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-[#0f2744]">{children}</thead>
  ),
  tbody: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-[#2d4a66]">{children}</tbody>
  ),
  th: ({ children }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="text-left px-4 py-2.5 text-[#ffd700] text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-slate-200 text-sm align-top">
      {children}
    </td>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="hover:bg-[#0f2744]/40 transition-colors" {...props}>{children}</tr>
  ),
  h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-bold text-white mt-8 mb-3 pb-2 border-b border-[#2d4a66]">
      {children}
    </h2>
  ),
  h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-base font-bold text-white mt-6 mb-1">
      {children}
    </h3>
  ),
  h4: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-sm font-bold text-white mt-5 mb-1">
      {children}
    </h4>
  ),
  p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-slate-200 leading-relaxed mb-4">
      {children}
    </p>
  ),
  li: ({ children }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-slate-200">
      {children}
    </li>
  ),
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeedSlugPage({ frontmatter, mdxSource }: FeedSlugPageProps) {
  const cfg = TYPE_CONFIG[frontmatter.type];

  return (
    <>
      <Head>
        <title>{frontmatter.title} | Bimflé's Feed | BMFFFL</title>
        {frontmatter.excerpt && <meta name="description" content={frontmatter.excerpt} />}
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            href="/bimfle-feed"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#ffd700] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>

          {/* Header */}
          <div className="mb-8">
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide',
                cfg.bg, cfg.text,
              )}>
                {cfg.icon}
                {cfg.label}
              </span>
              {frontmatter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#0f2744] text-slate-400 uppercase tracking-wide border border-[#2d4a66]"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
              {frontmatter.title}
            </h1>

            {/* Excerpt */}
            {frontmatter.excerpt && (
              <p className="text-slate-400 text-base leading-relaxed mb-4">
                {frontmatter.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-slate-500 pb-6 border-b border-[#2d4a66]">
              <span className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#ffd700]/60" />
                {frontmatter.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(frontmatter.publishedAt)}
              </span>
            </div>

            {/* Rosters mentioned */}
            {frontmatter.rosters && frontmatter.rosters.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="text-xs text-slate-500 self-center">Owners:</span>
                {frontmatter.rosters.map((r) => (
                  <span
                    key={r}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30 uppercase tracking-wide"
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* MDX content */}
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none
            prose-p:text-slate-200 prose-p:leading-relaxed
            prose-strong:text-white
            prose-em:text-slate-300
            prose-a:text-[#ffd700] prose-a:no-underline hover:prose-a:underline
            prose-code:text-[#ffd700] prose-code:bg-[#1a2d42] prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-blockquote:border-[#ffd700]/40 prose-blockquote:text-slate-300
            prose-hr:border-[#2d4a66]
            prose-li:text-slate-200
            prose-ul:list-disc prose-ol:list-decimal
          ">
            <MDXRemote {...mdxSource} components={mdxComponents} />
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-[#2d4a66]">
            <Link
              href="/bimfle-feed"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#ffd700] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Feed
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
