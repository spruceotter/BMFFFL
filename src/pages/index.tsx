import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Trophy, Users, ArrowRight, TrendingUp, Repeat2, Calendar,
  Bot, BarChart2, BookOpen, Gavel, Newspaper, Flame, Star, Shield
} from 'lucide-react';
import BimfleWidget from '@/components/BimfleWidget';
import { cn } from '@/lib/cn';

// ─── Data ────────────────────────────────────────────────────────────────────

const ALL_TIME_LEADERS = [
  {
    rank: 1, owner: 'MLSchools12', teamName: 'Schoolcraft Football Team',
    rsRecord: '114-21', rsPct: '.844', playoffs: 10, rings: 4,
    ringYears: [2016, 2019, 2021, 2024], color: '#ffd700',
  },
  {
    rank: 2, owner: 'SexMachineAndyD', teamName: 'MilwaukeeBrowns',
    rsRecord: '78-57', rsPct: '.578', playoffs: 6, rings: 1,
    ringYears: [2018], color: '#c0c0c0',
  },
  {
    rank: 3, owner: 'rbr', teamName: 'Really Big Rings',
    rsRecord: '73-62', rsPct: '.541', playoffs: 8, rings: 0,
    ringYears: [], color: '#cd7f32',
  },
  {
    rank: 4, owner: 'Grandes', teamName: 'El Rioux Grandes',
    rsRecord: '71-64', rsPct: '.526', playoffs: 5, rings: 1,
    ringYears: [2022], color: '#e94560',
  },
  {
    rank: 5, owner: 'Cogdeill11', teamName: 'Earn it',
    rsRecord: '67-68', rsPct: '.496', playoffs: 5, rings: 2,
    ringYears: [2017, 2020], color: '#60a5fa',
  },
  {
    rank: 6, owner: 'JuicyBussy', teamName: 'Juicy Bussy',
    rsRecord: '67-68', rsPct: '.496', playoffs: 5, rings: 1,
    ringYears: [2023], color: '#a78bfa',
  },
  {
    rank: 7, owner: 'eldridsm', teamName: 'eldridsm',
    rsRecord: '59-76', rsPct: '.437', playoffs: 4, rings: 0,
    ringYears: [], color: '#94a3b8',
  },
  {
    rank: 8, owner: 'eldridm20', teamName: 'Franks Little Beauties',
    rsRecord: '39-44', rsPct: '.470', playoffs: 3, rings: 0,
    ringYears: [], color: '#94a3b8',
  },
  {
    rank: 9, owner: 'Cmaleski', teamName: 'Showtyme Boyz',
    rsRecord: '55-80', rsPct: '.407', playoffs: 4, rings: 0,
    ringYears: [], color: '#94a3b8',
  },
  {
    rank: 10, owner: 'tdtd19844', teamName: 'THE Shameful Saggy sack',
    rsRecord: '55-80', rsPct: '.407', playoffs: 4, rings: 1,
    ringYears: [2025], color: '#34d399',
  },
  {
    rank: 11, owner: 'Tubes94', teamName: 'Whale Tails',
    rsRecord: '34-36', rsPct: '.486', playoffs: 2, rings: 0,
    ringYears: [], color: '#94a3b8',
  },
];

const CHAMPION_HISTORY = [
  { year: 2025, owner: 'tdtd19844', team: 'THE Shameful Saggy sack', seed: '#4' },
  { year: 2024, owner: 'MLSchools12', team: 'Schoolcraft Football Team', seed: '#1' },
  { year: 2023, owner: 'JuicyBussy', team: 'Juicy Bussy', seed: '#6' },
  { year: 2022, owner: 'Grandes', team: 'El Rioux Grandes', seed: '#4' },
  { year: 2021, owner: 'MLSchools12', team: 'The Murder Boners', seed: '#1' },
  { year: 2020, owner: 'Cogdeill11', team: 'Cogdeill11', seed: '#1' },
  { year: 2019, owner: 'MLSchools12', team: 'The Murder Boners', seed: '#1' },
  { year: 2018, owner: 'SexMachineAndyD', team: 'Stand Against Trade Rape', seed: '#2' },
  { year: 2017, owner: 'Cogdeill11', team: 'Team Cogdeill', seed: '#5' },
  { year: 2016, owner: 'MLSchools12', team: 'The Murder Boners', seed: '#1' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-black text-white tabular-nums" style={{ letterSpacing: '-0.03em' }}>
        {value}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function OwnerRow({ owner, idx }: { owner: typeof ALL_TIME_LEADERS[0]; idx: number }) {
  const isTop3 = idx < 3;
  return (
    <div className={cn(
      'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 group',
      'hover:bg-[#1a2d42] border border-transparent hover:border-[#2d4a66]',
      isTop3 && 'bg-[#16213e] border-[#2d4a66]'
    )}>
      {/* Rank */}
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0',
        idx === 0 ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40' :
        idx === 1 ? 'bg-slate-300/10 text-slate-300 border border-slate-300/30' :
        idx === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' :
        'text-slate-600 border border-[#1e3347]'
      )}>
        {owner.rank}
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm font-black"
        style={{ background: owner.color + '20', border: `1px solid ${owner.color}40`, color: owner.color }}>
        {owner.owner[0]}
      </div>

      {/* Name + team */}
      <div className="flex-1 min-w-0">
        <div className={cn('text-sm font-bold truncate', isTop3 ? 'text-white' : 'text-slate-300')}>
          {owner.owner}
        </div>
        {isTop3 && <div className="text-[10px] text-slate-500 truncate">{owner.teamName}</div>}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 shrink-0 text-right">
        <div className="hidden sm:block">
          <div className="text-xs font-mono font-bold text-slate-200 tabular-nums">{owner.rsRecord}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">RS W-L</div>
        </div>
        <div className="hidden sm:block w-10 text-right">
          <div className="text-xs font-mono text-slate-400 tabular-nums">{owner.rsPct}</div>
          <div className="text-[10px] text-slate-600 uppercase">Win%</div>
        </div>
        <div className="w-8 text-right">
          <div className="text-xs font-mono text-blue-300 tabular-nums font-bold">{owner.playoffs}</div>
          <div className="text-[10px] text-slate-600 uppercase">POs</div>
        </div>
        <div className="w-8 text-right">
          {owner.rings > 0 ? (
            <div>
              <div className="text-xs font-mono font-black" style={{ color: owner.color }}>{owner.rings}×</div>
              <div className="text-[10px] text-slate-600 uppercase">🏆</div>
            </div>
          ) : (
            <div className="text-xs text-slate-700 font-mono">—</div>
          )}
        </div>
      </div>
    </div>
  );
}

function DomainCard({
  label, href, icon: Icon, desc, accent
}: {
  label: string; href: string; icon: React.FC<{ className?: string }>;
  desc: string; accent: string;
}) {
  return (
    <Link href={href} className={cn(
      'group relative flex flex-col gap-3 p-5 rounded-2xl overflow-hidden',
      'bg-[#0d1b2a] border border-[#2d4a66]',
      'hover:border-opacity-0 transition-all duration-200',
      'hover:shadow-lg hover:-translate-y-0.5'
    )} style={{ '--accent': accent } as React.CSSProperties}>
      {/* Accent glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${accent}08 0%, transparent 60%)`, border: `1px solid ${accent}30` }} />

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200"
          style={{ background: accent + '20', border: `1px solid ${accent}40`, color: accent }}>
          <Icon className="w-5 h-5 transition-colors duration-200" />
        </div>
        <div className="text-base font-black text-white group-hover:text-white transition-colors leading-tight">
          {label}
        </div>
        <div className="text-xs text-slate-500 mt-1 leading-snug group-hover:text-slate-400 transition-colors">
          {desc}
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [showAllChampions, setShowAllChampions] = useState(false);

  return (
    <>
      <Head>
        <title>BMFFFL — Best MFing Fantasy Football League</title>
        <meta name="description"
          content="BMFFFL — 10 seasons of dynasty excellence. 12 teams, 257 trades, 6 champions. The best fantasy football league you're not in." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex flex-col justify-end bg-[#060d16]"
        aria-labelledby="hero-heading">

        {/* Background grid pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(45,74,102,0.08) 30px, rgba(45,74,102,0.08) 31px)`,
          }} />

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-20%] left-[10%] w-[700px] h-[700px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #e94560 0%, transparent 70%)' }} />
          <div className="absolute top-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)' }} />
          <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
        </div>

        {/* Season pill — top right */}
        <div className="absolute top-6 right-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: '#e9456012', border: '1px solid #e9456030', color: '#e94560' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse" />
            2026 Offseason
          </div>
        </div>

        {/* Main hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0">

          {/* Split layout: hero text left, champion card right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">

            {/* Left: Text */}
            <div>
              {/* Era label */}
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Since 2016 &nbsp;·&nbsp; Dynasty &nbsp;·&nbsp; Full PPR &nbsp;·&nbsp; Sleeper
                </span>
              </div>

              {/* BMFFFL title */}
              <h1 id="hero-heading" className="font-black text-white leading-none mb-3"
                style={{ fontSize: 'clamp(64px, 14vw, 160px)', letterSpacing: '-0.05em' }}>
                <span style={{
                  background: 'linear-gradient(130deg, #ffd700 0%, #ffffff 45%, #e94560 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  BMFFFL
                </span>
              </h1>

              {/* Tagline */}
              <p className="text-xl sm:text-2xl font-bold text-slate-300 mb-2"
                style={{ letterSpacing: '-0.01em' }}>
                The Best M&mdash;ing Fantasy Football League.
              </p>
              <p className="text-sm text-slate-500 mb-8">
                12 dynasties. 10 seasons. 6 champions. 257 trades. One throne.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/history"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-[#0d1b2a] transition-all duration-150 hover:scale-105 active:scale-100"
                  style={{ background: 'linear-gradient(135deg, #ffd700, #ffb700)', boxShadow: '0 0 40px rgba(255,215,0,0.25)' }}>
                  <Trophy className="w-4 h-4" />
                  League History
                </Link>
                <Link href="/analytics/all-time-records"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border text-white transition-all duration-150 hover:border-[#ffd700]/50 hover:text-[#ffd700]"
                  style={{ background: '#16213e', border: '1px solid #2d4a66' }}>
                  All-Time Records
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: 2025 Champion card */}
            <div className="hidden lg:flex justify-end items-end pb-0">
              <div className="relative rounded-2xl overflow-hidden w-full max-w-sm"
                style={{ background: 'linear-gradient(135deg, #1a2d42 0%, #16213e 100%)', border: '1px solid #2d4a66' }}>
                {/* Gold accent line */}
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #ffd700, #ffb700)' }} />

                <div className="p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3">
                    Reigning Champion
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0"
                      style={{ background: '#ffd70015', border: '1px solid #ffd70040', color: '#ffd700' }}>
                      T
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>tdtd19844</div>
                      <div className="text-xs text-slate-400 font-medium">THE Shameful Saggy sack</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: '#ffd70015', border: '1px solid #ffd70030', color: '#ffd700' }}>
                          2025 🏆
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: '#e9456015', border: '1px solid #e9456030', color: '#e94560' }}>
                          #4 Seed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Season record */}
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { label: 'Season', value: '8-6' },
                      { label: 'Playoffs', value: '3W-0L' },
                      { label: 'All-Time', value: '1 Ring' },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center py-2 rounded-lg" style={{ background: '#0d1b2a' }}>
                        <div className="text-sm font-black text-white tabular-nums">{value}</div>
                        <div className="text-[10px] text-slate-600 uppercase tracking-wider mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip — full width at bottom of hero */}
        <div className="relative z-10 border-t border-[#2d4a66] bg-[#0d1b2a]/80 backdrop-blur-sm mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-4 gap-8">
              <StatPill value="10" label="Seasons" />
              <StatPill value="12" label="Active Teams" />
              <StatPill value="6" label="Champions" />
              <StatPill value="257" label="All-Time Trades" />
            </div>
          </div>
        </div>
      </section>

      {/* ── DYNASTY STANDINGS ─────────────────────────────────────────────── */}
      <section className="bg-[#090f18] border-b border-[#2d4a66]" aria-labelledby="standings-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* All-time leaders (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-1">
                    All-Time Regular Season
                  </div>
                  <h2 id="standings-heading" className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
                    Dynasty Power Rankings
                  </h2>
                </div>
                <Link href="/analytics/all-time-records"
                  className="text-xs font-bold text-[#ffd700] hover:text-[#fff0a0] transition-colors flex items-center gap-1">
                  Full Records <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Owner table */}
              <div className="flex flex-col gap-1">
                {ALL_TIME_LEADERS.map((owner, idx) => (
                  <OwnerRow key={owner.owner} owner={owner} idx={idx} />
                ))}
              </div>

              <div className="mt-3 text-[10px] text-slate-600">
                RS = Regular season only (ESPN 2016–2019 + Sleeper 2020–2025), API-verified. POs = playoff appearances. 🏆 = championship rings.
              </div>
            </div>

            {/* Champion history sidebar (1/3 width) */}
            <div>
              <div className="mb-5">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-1">Hall of Champions</div>
                <h2 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
                  Title History
                </h2>
              </div>

              <div className="flex flex-col gap-1">
                {(showAllChampions ? CHAMPION_HISTORY : CHAMPION_HISTORY.slice(0, 5)).map((c) => (
                  <div key={c.year}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 hover:border-[#2d4a66]',
                      c.year === 2025
                        ? 'bg-[#ffd700]/5 border-[#ffd700]/20'
                        : 'bg-[#0d1b2a] border-[#1e3347]'
                    )}>
                    <div className={cn(
                      'text-sm font-black tabular-nums shrink-0 w-10',
                      c.year === 2025 ? 'text-[#ffd700]' : 'text-slate-500'
                    )}>
                      {c.year}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn('text-sm font-bold truncate', c.year === 2025 ? 'text-white' : 'text-slate-300')}>
                        {c.owner}
                      </div>
                      <div className="text-[10px] text-slate-600 truncate">{c.team}</div>
                    </div>
                    <div className="shrink-0">
                      {c.year === 2025 ? <Trophy className="w-4 h-4 text-[#ffd700]" /> :
                        <span className="text-[10px] text-slate-600 font-bold">{c.seed}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {!showAllChampions && (
                <button onClick={() => setShowAllChampions(true)}
                  className="mt-3 w-full text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors py-2 rounded-lg border border-[#1e3347] hover:border-[#2d4a66]">
                  Show All 10 Champions ↓
                </button>
              )}

              {/* Quick facts */}
              <div className="mt-6 rounded-2xl p-4"
                style={{ background: '#16213e', border: '1px solid #2d4a66' }}>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-3">League Superlatives</div>
                <div className="flex flex-col gap-2 text-xs">
                  {[
                    { label: 'Most Rings', value: 'MLSchools12 (4)' },
                    { label: 'Lowest Seed to Win', value: 'JuicyBussy #6 (2023)' },
                    { label: 'Most Runner-Ups', value: 'rbr & SexMachineAndyD (2×)' },
                    { label: 'Perfect Reg Season', value: 'MLSchools12 13-1 (2×)' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-2">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-200 font-bold text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── DOMAIN EXPLORER ──────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]" aria-labelledby="domains-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-1">Navigate the League</div>
            <h2 id="domains-heading" className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Explore BMFFFL
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Season', href: '/season/offseason-hub', icon: Calendar, desc: 'News & matchups', accent: '#e94560' },
              { label: 'Draft', href: '/nfl-draft/2026', icon: Trophy, desc: 'NFL Draft & rookies', accent: '#ffd700' },
              { label: 'Analytics', href: '/analytics/all-time-records', icon: BarChart2, desc: 'Stats & records', accent: '#60a5fa' },
              { label: 'History', href: '/history', icon: BookOpen, desc: 'Past seasons & awards', accent: '#a78bfa' },
              { label: 'League', href: '/about', icon: Gavel, desc: 'Rules, owners & lore', accent: '#34d399' },
              { label: 'Articles', href: '/articles', icon: Newspaper, desc: 'Analysis & strategy', accent: '#f97316' },
            ].map((d) => <DomainCard key={d.label} {...d} />)}
          </div>
        </div>
      </section>

      {/* ── BOTTOM ROW: Commissioner's Dispatch + Quick Links ────────────── */}
      <section className="bg-[#090f18] border-b border-[#2d4a66]" aria-labelledby="dispatch-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Commissioner's Dispatch */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: '#ffd70015', border: '1px solid #ffd70030' }}>
                  <Bot className="w-3.5 h-3.5 text-[#ffd700]" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Office of Bimflé</div>
                  <h2 id="dispatch-heading" className="text-lg font-black text-white leading-tight">
                    Commissioner&apos;s Dispatch
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { date: 'Apr 2026', text: 'The 2026 Rookie Draft is scheduled for the first Friday of June. All esteemed managers are encouraged to prepare their draft boards with due diligence.' },
                  { date: 'Mar 2026', text: 'The 2025 season archives are now fully compiled. tdtd19844 is hereby recognized as the 2025 BMFFFL Champion. Congratulations — and condolences to all who stood in his path.' },
                  { date: 'Mar 2026', text: 'The annual Owners Meeting agenda has been published. All proprietors are encouraged to review the proposed constitution amendments before the May convening.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl"
                    style={{ background: '#16213e', border: '1px solid #2d4a66', borderLeft: '3px solid #ffd700' }}>
                    <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap pt-0.5 w-16 shrink-0">{item.date}</div>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2026 Draft Game spotlight */}
            <div>
              <div className="mb-5">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-1">Now Open</div>
                <h2 className="text-lg font-black text-white">2026 Draft Game</h2>
              </div>

              <div className="rounded-2xl p-6 mb-4"
                style={{ background: 'linear-gradient(135deg, #1a2d42 0%, #16213e 100%)', border: '1px solid #ffd700/30', borderColor: 'rgba(255,215,0,0.2)' }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ background: '#ffd70015', border: '1px solid #ffd70030', color: '#ffd700' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
                  NFL Draft — April 23, 2026
                </div>
                <h3 className="text-xl font-black text-white mb-2">35 Questions. One Trophy.</h3>
                <p className="text-sm text-slate-400 mb-5">
                  Pick your answers before the NFL Draft starts. Bimflé scores everything live. Highest points wins BMFFFL glory and bragging rights.
                </p>
                <div className="flex gap-3">
                  <Link href="/nfl-draft-game"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-[#0d1b2a] transition-all hover:scale-105 active:scale-100"
                    style={{ background: 'linear-gradient(135deg, #ffd700, #ffb700)' }}>
                    <Trophy className="w-4 h-4" />
                    Draft Game
                  </Link>
                </div>
              </div>

              {/* Latest articles mini-list */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-3">Latest Analysis</div>
                <div className="flex flex-col gap-2">
                  {[
                    { title: 'State of the League: March 2026', tag: 'Analysis', href: '/articles/state-of-the-league-march-2026' },
                    { title: '2026 Rookie Draft Preview', tag: 'Preview', href: '/articles/2026-rookie-draft-preview' },
                    { title: 'Buyers and Sellers: March 2026', tag: 'Strategy', href: '/articles/buyers-sellers-2026' },
                  ].map((a) => (
                    <Link key={a.title} href={a.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-[#16213e] hover:border-[#2d4a66] transition-all duration-150 group">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 w-14 shrink-0 group-hover:text-slate-500">
                        {a.tag}
                      </span>
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors truncate">
                        {a.title}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0 group-hover:text-[#ffd700] transition-colors ml-auto" />
                    </Link>
                  ))}
                </div>
                <Link href="/articles"
                  className="mt-2 block text-center text-xs font-bold text-slate-600 hover:text-[#ffd700] transition-colors py-2">
                  All Articles →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────────────── */}
      <section className="bg-[#060d16] border-t border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4">Est. 2016</div>
          <h2 className="font-black text-white mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
            The best league you&apos;re not in.
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto mb-8">
            12 managers. Full PPR dynasty. Rookie drafts. 257 trades. One throne per year.
          </p>

          {/* Orphan spot CTA */}
          <div className="inline-block rounded-2xl p-6 mb-2 text-left max-w-md mx-auto"
            style={{ background: 'linear-gradient(135deg, #16213e, #1a2d42)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
              style={{ background: '#e9456015', border: '1px solid #e9456030', color: '#e94560' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse" />
              1 Roster Spot Open — Apply by May 9
            </div>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              A dynasty roster is available. Apply to join the league or refer someone — referrals earn up to $50 FAAB.
            </p>
            <Link href="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-[#0d1b2a] transition-all hover:scale-105 active:scale-100"
              style={{ background: 'linear-gradient(135deg, #ffd700, #ffb700)', boxShadow: '0 0 24px rgba(255,215,0,0.2)' }}>
              <Users className="w-4 h-4" />
              Apply to Join
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bimfle chatbot widget ─────────────────────────────────────────── */}
      <BimfleWidget />
    </>
  );
}
