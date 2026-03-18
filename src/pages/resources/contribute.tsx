import Head from 'next/head';
import Link from 'next/link';
import {
  FileText,
  AlertCircle,
  Star,
  BarChart2,
  ArrowRight,
  GitPullRequest,
  MessageSquare,
  Clock,
  CheckCircle,
  User,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  id,
  label,
  title,
}: {
  icon: React.ElementType;
  id: string;
  label: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
        <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
          {label}
        </p>
        <h2 id={id} className="text-lg font-black text-white leading-tight">
          {title}
        </h2>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl p-6 bg-[#16213e] border border-[#2d4a66]', className)}>
      {children}
    </div>
  );
}

function ContributeMethod({
  icon: Icon,
  title,
  description,
  cta,
  ctaHref,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  cta: string;
  ctaHref: string;
}) {
  const isExternal = ctaHref.startsWith('http');
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#2d4a66]/60 last:border-0">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mt-0.5">
        <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white leading-snug mb-1">{title}</p>
        <p className="text-xs text-slate-400 leading-relaxed mb-2">{description}</p>
        {isExternal ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ffd700] hover:text-white transition-colors duration-150"
          >
            {cta}
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </a>
        ) : (
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ffd700] hover:text-white transition-colors duration-150"
          >
            {cta}
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

function StyleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#2d4a66]/60 last:border-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-28 shrink-0 mt-0.5">
        {label}
      </p>
      <p className="text-sm text-slate-200 leading-snug">{value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContributePage() {
  const FRONT_MATTER = `---
title: "Your Article Title"
date: "2026-03-16"
author: "Your Team Name"
slug: "your-article-slug"
category: "analysis"
---`;

  return (
    <>
      <Head>
        <title>How to Contribute — BMFFFL</title>
        <meta
          name="description"
          content="How managers can submit articles, report data errors, suggest features, and contribute to the BMFFFL dynasty fantasy football site."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources" className="hover:text-[#ffd700] transition-colors duration-150">Resources</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">Contribute</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <GitPullRequest className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Community
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            How to Contribute
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            This site belongs to the league. Managers can submit articles, flag data errors,
            suggest features, and help make BMFFFL the best-documented dynasty league on the
            internet.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Ways to Contribute ────────────────────────────────────────── */}
        <section aria-labelledby="ways-heading">
          <Card>
            <SectionHeader
              icon={Star}
              id="ways-heading"
              label="Overview"
              title="Ways to Contribute"
            />
            <ContributeMethod
              icon={FileText}
              title="Submit an Article"
              description="Write a Commish Speaks post, analysis piece, or trade retrospective. We publish anything analytically useful or entertainingly Bimfle-adjacent."
              cta="See submission guide below"
              ctaHref="#submit-article"
            />
            <ContributeMethod
              icon={AlertCircle}
              title="Report a Data Error"
              description="Found a wrong score, a missing trade, or a historical record that&apos;s off? Flag it and it gets corrected in the next data push."
              cta="DM @Grandes on Sleeper"
              ctaHref="https://sleeper.com"
            />
            <ContributeMethod
              icon={Star}
              title="Suggest a Feature"
              description="Have an idea for a new analytics page, a poll system, or a trade tool? Open an issue on GitHub or drop it in the Discord."
              cta="Open a GitHub issue"
              ctaHref="https://github.com/spruceotter/BMFFFL/issues/new"
            />
            <ContributeMethod
              icon={BarChart2}
              title="Request a Trade Analysis"
              description="Want a data-backed breakdown of a trade you&apos;re considering or one that already happened? Request one and it may become a published article."
              cta="Post in league chat"
              ctaHref="https://sleeper.com"
            />
          </Card>
        </section>

        {/* ── Row: Submit Article + Report Errors ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Submit an Article */}
          <section aria-labelledby="submit-article">
            <Card>
              <SectionHeader
                icon={FileText}
                id="submit-article"
                label="Articles"
                title="Submit an Article"
              />

              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Articles are written in <strong className="text-white">MDX format</strong> with
                a front matter block. The easiest submission paths are a GitHub PR or a Discord
                message with the file attached.
              </p>

              <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4 mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] mb-2">
                  Required Front Matter
                </p>
                <pre className="text-xs font-mono text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
                  {FRONT_MATTER}
                </pre>
              </div>

              <div className="space-y-0">
                {[
                  {
                    icon: GitPullRequest,
                    label: 'GitHub PR',
                    detail: 'Fork spruceotter/BMFFFL, add your .mdx file to /content/articles/, and open a pull request.',
                  },
                  {
                    icon: MessageSquare,
                    label: 'Discord',
                    detail: 'Drop the file in #site-submissions on the BMFFFL Discord. Commissioner will handle the merge.',
                  },
                ].map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="flex items-start gap-3 py-3 border-b border-[#2d4a66]/60 last:border-0">
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">{label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Report Errors */}
          <section aria-labelledby="errors-heading">
            <Card>
              <SectionHeader
                icon={AlertCircle}
                id="errors-heading"
                label="Data Integrity"
                title="Report Data Errors"
              />

              <div className="rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20 p-4 mb-5">
                <p className="text-sm text-slate-200 leading-relaxed">
                  DM <strong className="text-[#ffd700]">@Grandes</strong> on Sleeper or create a
                  GitHub issue at{' '}
                  <a
                    href="https://github.com/spruceotter/BMFFFL/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ffd700] hover:text-white underline underline-offset-2 transition-colors duration-150"
                  >
                    spruceotter/BMFFFL
                  </a>
                  .
                </p>
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                What to Include
              </p>
              <ul className="space-y-0">
                {[
                  'The page or section where you found the error',
                  'What the data currently says',
                  'What it should say, with a source if possible',
                  'The season or week it relates to',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 py-2.5 border-b border-[#2d4a66]/60 last:border-0">
                    <CheckCircle className="w-3.5 h-3.5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-slate-300 leading-snug">{item}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]">
                    Who Reviews It
                  </p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Commissioner reviews all data corrections. Historical records that change
                  all-time standings go through a brief confirmation period before publishing.
                </p>
              </div>
            </Card>
          </section>
        </div>

        {/* ── Article Style Guide ───────────────────────────────────────── */}
        <section aria-labelledby="style-heading">
          <Card>
            <SectionHeader
              icon={FileText}
              id="style-heading"
              label="Writing"
              title="Article Style Guide"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Format Rules
                </p>
                <div>
                  <StyleRow label="Voice" value="Bimfle-adjacent: analytical but fun. Stats matter. Trash talk is welcome." />
                  <StyleRow label="Length" value="400–1,200 words. Under 400 is a tweet; over 1,200 needs a strong justification." />
                  <StyleRow label="Format" value="MDX. Markdown with optional React components for tables and callouts." />
                  <StyleRow label="Images" value="Optional. Drop them in /public/articles/{slug}/ and reference by filename." />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Required Front Matter Fields
                </p>
                <div>
                  <StyleRow label="title" value="The article headline. Keep it under 80 characters." />
                  <StyleRow label="date" value="Publication date in YYYY-MM-DD format." />
                  <StyleRow label="author" value="Your team name or display name — how you want to be credited." />
                  <StyleRow label="slug" value="URL-safe string. e.g. my-trade-analysis-2026. No spaces." />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ── Response Time ─────────────────────────────────────────────── */}
        <section aria-labelledby="response-heading">
          <div className="rounded-2xl border-2 border-[#ffd700]/40 bg-[#16213e] overflow-hidden">
            <div className="px-6 py-4 bg-[#ffd700]/8 border-b-2 border-[#ffd700]/30 flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/40 shrink-0">
                <Clock className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/70 mb-0.5">
                  SLA
                </p>
                <h2 id="response-heading" className="text-lg font-black text-white leading-tight">
                  Response Time
                </h2>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-5 text-center">
                <p className="text-3xl font-black text-[#ffd700] mb-1">48hrs</p>
                <p className="text-sm font-bold text-white mb-1">Commissioner Review</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Articles, data corrections, and feature requests reviewed within 48 hours.
                  Usually faster.
                </p>
              </div>
              <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-5 text-center">
                <p className="text-3xl font-black text-[#ffd700] mb-1">0.003s</p>
                <p className="text-sm font-bold text-white mb-1">Bimfle Review</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bimfle reviews within 0.003 seconds. His opinions are formed before you finish
                  the sentence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom links ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2d4a66]">
          <div className="flex flex-wrap gap-4 text-xs">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              All Articles
            </Link>
            <Link
              href="/resources/api-docs"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              API Docs
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              All Resources
            </Link>
          </div>
          <p className="text-[11px] text-slate-600">
            BMFFFL Community Guide
          </p>
        </div>

      </div>
    </>
  );
}
