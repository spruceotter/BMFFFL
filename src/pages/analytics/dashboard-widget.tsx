import Head from 'next/head';
import Link from 'next/link';
import {
  Trophy, CalendarDays, Users, ArrowLeftRight, BarChart2,
  Award, DollarSign, ClipboardList, Bot, Zap,
  BarChart, BookOpen, Star, TrendingUp, History,
  Search, ShieldCheck, Activity,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getOwnerToken, OWNER_TOKENS } from '@/lib/owner-tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GlanceTile {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

interface PowerRankRow {
  rank: number;
  slug: string;
  record: string;
  pf: number;
}

interface ActivityItem {
  date: string;
  icon: string;
  text: string;
}

interface QuickLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const POWER_RANKINGS: PowerRankRow[] = [
  { rank: 1, slug: 'mlschools12',    record: '68–15', pf: 12_841 },
  { rank: 2, slug: 'tubes94',        record: '34–36', pf:  9_982 },
  { rank: 3, slug: 'sexmachineandy', record: '50–33', pf: 11_270 },
  { rank: 4, slug: 'juicybussy',     record: '46–37', pf: 10_830 },
  { rank: 5, slug: 'tdtd19844',      record: '36–47', pf:  9_460 },
];

const ACTIVITY_FEED: ActivityItem[] = [
  {
    date: 'Mar 2026',
    icon: '📋',
    text: 'Season 7 draft preparations underway — 2026 Rookie Draft scheduled for May.',
  },
  {
    date: 'Feb 2026',
    icon: '🏆',
    text: 'tdtd19844 (THE Shameful Saggy Sack) claimed the 2025 BMFFFL championship — defeated Tubes94 152.92–135.08 as the 4-seed dark horse.',
  },
  {
    date: 'Jan 2026',
    icon: '🔄',
    text: 'Most recent trade: Tubes94 and SexMachineAndyD swap 2026 picks in off-season deal.',
  },
  {
    date: 'Dec 2025',
    icon: '📊',
    text: 'Cmaleski posted 1,990 PF — 2nd-highest single-season score in league history.',
  },
  {
    date: 'Sep 2025',
    icon: '🏈',
    text: 'Season 6 kicked off — 12 managers, 14 regular-season weeks, 6-team playoff field.',
  },
];

const QUICK_LINKS: QuickLink[] = [
  { label: 'Analytics Hub',        href: '/analytics',                       icon: <BarChart className="w-4 h-4" /> },
  { label: 'Dynasty Rankings',     href: '/analytics/dynasty-rankings',      icon: <Star className="w-4 h-4" /> },
  { label: 'Power Rankings',       href: '/analytics/power-rankings',        icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'All-Time Standings',   href: '/history/standings',               icon: <History className="w-4 h-4" /> },
  { label: 'Trade Ledger',         href: '/analytics/trade-ledger',          icon: <ArrowLeftRight className="w-4 h-4" /> },
  { label: 'Weekly Recap',         href: '/analytics/weekly-recap',          icon: <CalendarDays className="w-4 h-4" /> },
  { label: 'Keeper Calculator',    href: '/analytics/keeper-calculator',     icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Dynasty Power Index',  href: '/analytics/dynasty-power-index',  icon: <BarChart2 className="w-4 h-4" /> },
  { label: 'FAAB Tracker',         href: '/analytics/faab-tracker',         icon: <DollarSign className="w-4 h-4" /> },
  { label: 'Playoff Simulator',    href: '/analytics/playoff-simulator',    icon: <Trophy className="w-4 h-4" /> },
  { label: 'Site Search',          href: '/search',                         icon: <Search className="w-4 h-4" /> },
  { label: 'League Rules',         href: '/rules',                          icon: <ShieldCheck className="w-4 h-4" /> },
];

// ─── Glance Tiles Data ────────────────────────────────────────────────────────

function buildGlanceTiles(): GlanceTile[] {
  return [
    {
      icon: <Trophy className="w-5 h-5" />,
      label: 'Current Champion',
      value: 'mlschools12',
      sub: '3× Champion',
      accent: '#ffd700',
    },
    {
      icon: <CalendarDays className="w-5 h-5" />,
      label: 'Season',
      value: '7 (2026)',
      sub: 'Starts September',
      accent: '#60a5fa',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Active Teams',
      value: '12',
      sub: 'All managers active',
      accent: '#34d399',
    },
    {
      icon: <ArrowLeftRight className="w-5 h-5" />,
      label: 'Last Trade',
      value: 'Off-season',
      sub: 'Tubes94 ↔ SexMachineAndyD',
      accent: '#a78bfa',
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: 'League Avg PF',
      value: '1,762 pts',
      sub: 'Per season (all-time)',
      accent: '#f97316',
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Career Win%',
      value: '82.0%',
      sub: 'mlschools12 (68–15)',
      accent: '#ffd700',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'FAAB Budget',
      value: '$200 / team',
      sub: 'Per season',
      accent: '#4ade80',
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      label: 'Draft Format',
      value: '3 rounds',
      sub: '36 rookie picks total',
      accent: '#fb923c',
    },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlanceTileCard({ tile }: { tile: GlanceTile }) {
  return (
    <div
      className="rounded-xl border border-[#2d4a66]/60 bg-[#1a2a3a]/40 p-3 sm:p-4 flex flex-col gap-1"
      style={{ borderTopColor: tile.accent ? `${tile.accent}40` : undefined }}
    >
      <div
        className="flex items-center gap-1.5 mb-1"
        style={{ color: tile.accent ?? '#94a3b8' }}
        aria-hidden="true"
      >
        {tile.icon}
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {tile.label}
        </span>
      </div>
      <p className="text-lg font-black text-white leading-tight">{tile.value}</p>
      {tile.sub && <p className="text-[11px] text-slate-500 leading-snug">{tile.sub}</p>}
    </div>
  );
}

function PowerRow({ row }: { row: PowerRankRow }) {
  const token = getOwnerToken(row.slug);
  const medal = row.rank === 1 ? 'text-[#ffd700]' : row.rank === 2 ? 'text-slate-300' : row.rank === 3 ? 'text-amber-600' : 'text-slate-500';
  return (
    <tr className="border-t border-[#2d4a66]/40 hover:bg-[#ffd700]/3 transition-colors">
      <td className={cn('py-2 pl-3 pr-2 font-black tabular-nums text-sm w-8', medal)}>
        #{row.rank}
      </td>
      <td className="py-2 px-2">
        <span className="mr-1.5 text-base" aria-hidden="true">{token?.emoji ?? '🏈'}</span>
        <span className="text-sm font-semibold text-white">{token?.displayName ?? row.slug}</span>
      </td>
      <td className="py-2 px-2 text-xs text-slate-400 tabular-nums font-mono">{row.record}</td>
      <td className="py-2 pl-2 pr-3 text-xs text-slate-400 tabular-nums font-mono text-right">
        {row.pf.toLocaleString()}
      </td>
    </tr>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <li className="flex items-start gap-3 py-2.5 border-t border-[#2d4a66]/30 first:border-t-0">
      <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 leading-snug">{item.text}</p>
        <p className="text-[11px] text-slate-600 mt-0.5">{item.date}</p>
      </div>
    </li>
  );
}

function QuickLinkCard({ link }: { link: QuickLink }) {
  return (
    <Link
      href={link.href}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-xl border border-[#2d4a66]/50',
        'bg-[#1a2a3a]/30 text-slate-400',
        'hover:border-[#ffd700]/40 hover:text-[#ffd700] hover:bg-[#ffd700]/5',
        'transition-colors duration-150 text-center'
      )}
    >
      <span aria-hidden="true">{link.icon}</span>
      <span className="text-[11px] font-semibold leading-tight">{link.label}</span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardWidgetPage() {
  const tiles = buildGlanceTiles();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Head>
        <title>League Dashboard — BMFFFL Quick View</title>
        <meta
          name="description"
          content="BMFFFL league dashboard: quick stats, power rankings, recent activity, and fast links to every page."
        />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <Breadcrumb items={[
          { label: 'Home',      href: '/' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Dashboard' },
        ]} />

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-3">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" />
            Quick View
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-1">
            League Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            BMFFFL Quick View &middot; {dateStr} &middot; Season 7 (2026)
          </p>
        </header>

        {/* ── At a Glance (4×2 grid) ──────────────────────────────────────────── */}
        <section className="mb-8" aria-labelledby="glance-heading">
          <h2 id="glance-heading" className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            At a Glance
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiles.map((tile) => (
              <GlanceTileCard key={tile.label} tile={tile} />
            ))}
          </div>
        </section>

        {/* ── Two-column: Power Rankings + Activity Feed ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Power Rankings */}
          <section
            className="rounded-xl border border-[#2d4a66]/60 bg-[#1a2a3a]/30 overflow-hidden"
            aria-labelledby="power-heading"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2d4a66]/40">
              <TrendingUp className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <h2 id="power-heading" className="text-sm font-bold text-white">
                Top 5 Power Rankings
              </h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-600">
                  <th className="py-2 pl-3 pr-2 font-semibold">Rk</th>
                  <th className="py-2 px-2 font-semibold">Manager</th>
                  <th className="py-2 px-2 font-semibold">W–L</th>
                  <th className="py-2 pl-2 pr-3 font-semibold text-right">Career PF</th>
                </tr>
              </thead>
              <tbody>
                {POWER_RANKINGS.map((row) => (
                  <PowerRow key={row.slug} row={row} />
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 border-t border-[#2d4a66]/30">
              <Link
                href="/analytics/power-rankings"
                className="text-[11px] text-slate-500 hover:text-[#ffd700] transition-colors"
              >
                View full power rankings →
              </Link>
            </div>
          </section>

          {/* Recent Activity Feed */}
          <section
            className="rounded-xl border border-[#2d4a66]/60 bg-[#1a2a3a]/30 overflow-hidden"
            aria-labelledby="activity-heading"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2d4a66]/40">
              <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <h2 id="activity-heading" className="text-sm font-bold text-white">
                Recent Activity
              </h2>
            </div>
            <ul className="px-4 py-1" aria-label="Recent league activity">
              {ACTIVITY_FEED.map((item, i) => (
                <ActivityRow key={i} item={item} />
              ))}
            </ul>
            <div className="px-4 py-2 border-t border-[#2d4a66]/30">
              <Link
                href="/analytics/transaction-browser"
                className="text-[11px] text-slate-500 hover:text-[#ffd700] transition-colors"
              >
                Transaction browser →
              </Link>
            </div>
          </section>
        </div>

        {/* ── Quick Links Grid (12 links) ─────────────────────────────────────── */}
        <section className="mb-8" aria-labelledby="links-heading">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 id="links-heading" className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Quick Links
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {QUICK_LINKS.map((link) => (
              <QuickLinkCard key={link.href} link={link} />
            ))}
          </div>
        </section>

        {/* ── Bimfle Status ───────────────────────────────────────────────────── */}
        <section
          className={cn(
            'rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3',
            'flex items-start gap-3'
          )}
          aria-label="Bimfle status"
        >
          <Bot className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-emerald-400 mb-0.5">
              BMFFFL Status: Optimal.
            </p>
            <p className="text-xs text-slate-400">
              All systems nominal. Season 7 preparations underway. mlschools12 remains the greatest dynasty
              this league has ever seen. Bimfle is watching. Bimfle is ready.
            </p>
          </div>
          <span className="text-xs text-emerald-600 font-mono ml-auto shrink-0 tabular-nums">
            S7 / 2026
          </span>
        </section>

      </div>
    </>
  );
}
