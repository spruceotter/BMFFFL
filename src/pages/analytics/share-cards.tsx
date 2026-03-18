import { useState } from 'react';
import Head from 'next/head';
import { Share2, Camera, Trophy, Zap, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getOwnerToken, OWNER_TOKENS } from '@/lib/owner-tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type CardType = 'championship' | 'weekly' | 'trade' | 'awards' | 'spotlight';

interface WeekMatchup {
  week: number;
  winnerSlug: string;
  winnerScore: number;
  loserSlug: string;
  loserScore: number;
  bimfleLine: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const CARD_TABS: { id: CardType; label: string }[] = [
  { id: 'championship', label: 'Championship' },
  { id: 'weekly',       label: 'Weekly Matchup' },
  { id: 'trade',        label: 'Big Trade' },
  { id: 'awards',       label: 'Season Awards' },
  { id: 'spotlight',    label: 'Team Spotlight' },
];

const WEEKLY_MATCHUPS: WeekMatchup[] = [
  {
    week: 1,
    winnerSlug: 'mlschools12',
    winnerScore: 178.6,
    loserSlug: 'escuelas',
    loserScore: 101.2,
    bimfleLine: 'MLSchools12 served notice on Week 1 — it\'s his league and he knows it.',
  },
  {
    week: 4,
    winnerSlug: 'juicybussy',
    winnerScore: 203.4,
    loserSlug: 'cogdeill11',
    loserScore: 152.8,
    bimfleLine: 'The Chaos Engine detonated against the Founding Champion. 50 points of chaos.',
  },
  {
    week: 8,
    winnerSlug: 'tubes94',
    winnerScore: 189.7,
    loserSlug: 'sexmachineandy',
    loserScore: 166.3,
    bimfleLine: 'The Rising Tide crashes over Perennial Contender in the marquee mid-season clash.',
  },
  {
    week: 12,
    winnerSlug: 'rbr',
    winnerScore: 214.2,
    loserSlug: 'tdtd19844',
    loserScore: 177.5,
    bimfleLine: 'The Chess Master executes a flawless 91% optimal lineup in the biggest win of his season.',
  },
  {
    week: 16,
    winnerSlug: 'mlschools12',
    winnerScore: 221.4,
    loserSlug: 'tubes94',
    loserScore: 198.7,
    bimfleLine: 'Crown secured. Dynasty sealed. Two rings, zero mercy.',
  },
];

const SPOTLIGHT_OWNER_SLUGS = OWNER_TOKENS.map((t) => t.slug);

// ─── Championship Card ────────────────────────────────────────────────────────

function ChampionshipCard() {
  const champion = getOwnerToken('mlschools12');
  const runnerUp = getOwnerToken('tubes94');
  if (!champion || !runnerUp) return null;

  const champScore = 221.4;
  const ruScore    = 198.7;
  const margin     = (champScore - ruScore).toFixed(1);

  return (
    <div
      className="mx-auto max-w-md rounded-2xl border-2 border-[#ffd700] bg-[#0a0f1e] shadow-2xl shadow-[#ffd700]/10 overflow-hidden"
      aria-label="Championship share card"
    >
      {/* Gold banner */}
      <div className="bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] px-6 py-3 text-center">
        <p className="text-[#0a0f1e] text-xs font-black uppercase tracking-[0.2em]">
          BMFFFL 2025
        </p>
      </div>

      <div className="px-6 pt-6 pb-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-1" aria-hidden="true">🏆</div>
          <h2 className="text-2xl font-black text-[#ffd700] uppercase tracking-widest leading-none">
            CHAMPION
          </h2>
        </div>

        {/* Champion row */}
        <div className="rounded-xl border border-[#ffd700]/40 bg-[#ffd700]/5 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{champion.emoji}</span>
            <div>
              <p className="text-lg font-black text-[#ffd700] leading-tight">
                {champion.displayName}
              </p>
              <p className="text-[10px] text-[#ffd700]/60 uppercase tracking-wider font-semibold">
                Champion
              </p>
            </div>
          </div>
          <p className="text-3xl font-black text-white tabular-nums font-mono">
            {champScore.toFixed(1)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#2d4a66]" />
          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">vs</span>
          <div className="flex-1 h-px bg-[#2d4a66]" />
        </div>

        {/* Runner-up row */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{runnerUp.emoji}</span>
            <div>
              <p className="text-base font-bold text-slate-300 leading-tight">
                {runnerUp.displayName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Runner-Up
              </p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-400 tabular-nums font-mono">
            {ruScore.toFixed(1)}
          </p>
        </div>

        {/* Margin */}
        <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-4 py-3 text-center">
          <p className="text-[10px] text-[#ffd700]/60 uppercase tracking-widest font-semibold mb-0.5">
            Margin of Victory
          </p>
          <p className="text-2xl font-black text-[#ffd700]">
            +{margin} pts
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 font-semibold tracking-wider uppercase">
          December 2025 &bull; Dynasty Secured
        </p>
      </div>

      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent" />
    </div>
  );
}

// ─── Weekly Matchup Card ──────────────────────────────────────────────────────

interface WeeklyCardProps {
  matchup: WeekMatchup;
}

function WeeklyMatchupCard({ matchup }: WeeklyCardProps) {
  const winner = getOwnerToken(matchup.winnerSlug);
  const loser  = getOwnerToken(matchup.loserSlug);
  if (!winner || !loser) return null;

  const margin = (matchup.winnerScore - matchup.loserScore).toFixed(1);

  return (
    <div
      className="mx-auto max-w-md rounded-2xl border border-[#2d4a66] bg-[#0a0f1e] shadow-2xl overflow-hidden"
      aria-label={`Week ${matchup.week} matchup share card`}
    >
      {/* Header band */}
      <div className="bg-[#16213e] border-b border-[#2d4a66] px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
          BMFFFL 2025
        </span>
        <span className="text-xs font-black text-white uppercase tracking-widest">
          Week {matchup.week}
        </span>
      </div>

      <div className="px-6 pt-5 pb-7 space-y-4">

        {/* Winner */}
        <div className="rounded-xl border border-[#ffd700]/40 bg-[#ffd700]/5 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{winner.emoji}</span>
            <div>
              <p className="text-base font-black text-[#ffd700]">{winner.displayName}</p>
              <p className="text-[10px] text-[#ffd700]/60 uppercase tracking-wider font-semibold">Winner</p>
            </div>
          </div>
          <p className="text-2xl font-black text-white tabular-nums font-mono">
            {matchup.winnerScore.toFixed(1)}
          </p>
        </div>

        {/* Loser */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e]/60 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl opacity-60" aria-hidden="true">{loser.emoji}</span>
            <div>
              <p className="text-sm font-bold text-slate-400">{loser.displayName}</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">L</p>
            </div>
          </div>
          <p className="text-xl font-black text-slate-500 tabular-nums font-mono">
            {matchup.loserScore.toFixed(1)}
          </p>
        </div>

        {/* Margin pill */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700] text-xs font-black">
            <Trophy className="w-3 h-3" aria-hidden="true" />
            +{margin} margin
          </span>
        </div>

        {/* Bimfle line */}
        <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-1">
            Bimfle Says
          </p>
          <p className="text-sm text-slate-300 italic leading-snug">
            &ldquo;{matchup.bimfleLine}&rdquo;
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent" />
    </div>
  );
}

// ─── Big Trade Card ───────────────────────────────────────────────────────────

function BigTradeCard() {
  return (
    <div
      className="mx-auto max-w-md rounded-2xl border border-[#2d4a66] bg-[#0a0f1e] shadow-2xl overflow-hidden"
      aria-label="Big trade share card"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#16213e] to-[#1a1a2e] border-b border-[#2d4a66] px-6 py-4 text-center">
        <div className="text-2xl mb-1" aria-hidden="true">📊</div>
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
          Blockbuster Trade
        </h2>
        <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Week 7 · 2025 Season</p>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">

          {/* Team A */}
          <div className="rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/5 p-4 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg" aria-hidden="true">🐋</span>
              <p className="text-xs font-black text-[#38bdf8] uppercase tracking-wide">Tubes94 Gave</p>
            </div>
            <ul className="space-y-1">
              {['Puka Nacua', 'Amon-Ra St. Brown', '2026 1st (Top 3)'].map((item) => (
                <li key={item} className="text-xs text-slate-300 font-semibold leading-snug">{item}</li>
              ))}
            </ul>
          </div>

          {/* Team B */}
          <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-4 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg" aria-hidden="true">👑</span>
              <p className="text-xs font-black text-[#ffd700] uppercase tracking-wide">MLSchools12 Gave</p>
            </div>
            <ul className="space-y-1">
              {['Justin Jefferson', '2026 2nd', '2027 1st (Top 4)'].map((item) => (
                <li key={item} className="text-xs text-slate-300 font-semibold leading-snug">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verdict */}
        <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-1">
            Bimfle Verdict
          </p>
          <p className="text-sm text-slate-300 italic leading-snug">
            &ldquo;MLSchools12 mortgaged the future for a dynasty window. Tubes94 is playing the long game.&rdquo;
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#38bdf8]/30 to-transparent" />
    </div>
  );
}

// ─── Season Awards Card ───────────────────────────────────────────────────────

function SeasonAwardsCard() {
  const awards = [
    {
      emoji:  '🏆',
      label:  'Champion',
      owner:  'MLSchools12',
      detail: '2-Time Dynast',
      color:  '#ffd700',
    },
    {
      emoji:  '📈',
      label:  'High Score',
      owner:  'JuicyBussy',
      detail: '245.80 pts',
      color:  '#f97316',
    },
    {
      emoji:  '🎯',
      label:  'Most Efficient',
      owner:  'rbr',
      detail: '91.2% optimal',
      color:  '#60a5fa',
    },
    {
      emoji:  '💀',
      label:  'Low Score Week',
      owner:  'Escuelas',
      detail: '78.1 pts',
      color:  '#94a3b8',
    },
  ];

  return (
    <div
      className="mx-auto max-w-md rounded-2xl border border-[#2d4a66] bg-[#0a0f1e] shadow-2xl overflow-hidden"
      aria-label="Season awards share card"
    >
      {/* Header */}
      <div className="bg-[#16213e] border-b border-[#2d4a66] px-6 py-4 text-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold mb-0.5">
          BMFFFL 2025
        </p>
        <h2 className="text-base font-black text-white uppercase tracking-widest">
          Season Awards
        </h2>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {awards.map((award) => (
            <div
              key={award.label}
              className="rounded-xl border bg-[#16213e] p-4 flex flex-col gap-2"
              style={{ borderColor: `${award.color}30` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">{award.emoji}</span>
                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: award.color }}>
                  {award.label}
                </p>
              </div>
              <div>
                <p className="text-sm font-black text-white leading-tight">{award.owner}</p>
                <p className="text-[11px] text-slate-500 font-semibold">{award.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-5 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
          December 2025 &bull; #BMFFFL
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent" />
    </div>
  );
}

// ─── Team Spotlight Card ──────────────────────────────────────────────────────

interface SpotlightCardProps {
  ownerSlug: string;
}

function TeamSpotlightCard({ ownerSlug }: SpotlightCardProps) {
  const token = getOwnerToken(ownerSlug);
  if (!token) return null;

  // Static per-owner stat snapshots (no API)
  const SPOTLIGHT_STATS: Record<string, { record: string; pts: string; rank: string; verdict: string }> = {
    mlschools12:   { record: '13-1',  pts: '2,189',  rank: '#1',  verdict: 'Greatest regular season in BMFFFL history.' },
    tubes94:       { record: '10-4',  pts: '1,902',  rank: '#2',  verdict: 'Runner-up finish. The throne will be his.' },
    sexmachineandy:{ record: '9-5',   pts: '1,876',  rank: '#3',  verdict: 'Fourth playoff run. The title is long overdue.' },
    juicybussy:    { record: '8-6',   pts: '1,955',  rank: '#4',  verdict: 'League all-time high scorer. Chaos incarnate.' },
    rbr:           { record: '7-7',   pts: '1,820',  rank: '#5',  verdict: '91.2% optimal. The chess master at his peak.' },
    cogdeill11:    { record: '7-7',   pts: '1,800',  rank: '#6',  verdict: 'Founding champion in a rebuilding year.' },
    grandes:       { record: '6-8',   pts: '1,755',  rank: '#7',  verdict: 'The commissioner holds the law and the cap.' },
    tdtd19844:     { record: '6-8',   pts: '1,740',  rank: '#8',  verdict: 'From 3-11 to champion. Never count them out.' },
    eldridsm:      { record: '5-9',   pts: '1,690',  rank: '#9',  verdict: 'Giant slayer lurking — watch the playoffs.' },
    eldridm20:     { record: '5-9',   pts: '1,680',  rank: '#10', verdict: 'Eliminated two #1 seeds. Still can\'t close.' },
    cmaleski:      { record: '4-10',  pts: '1,990',  rank: '#11', verdict: '1,990 points — the record doesn\'t tell the story.' },
    escuelas:      { record: '3-11',  pts: '1,601',  rank: '#12', verdict: 'The long rebuild. The climb continues.' },
  };

  const stats = SPOTLIGHT_STATS[token.slug] ?? { record: '—', pts: '—', rank: '—', verdict: 'Dynasty in progress.' };

  return (
    <div
      className="mx-auto max-w-md rounded-2xl border-2 bg-[#0a0f1e] shadow-2xl overflow-hidden"
      style={{ borderColor: `${token.color}50` }}
      aria-label={`${token.displayName} team spotlight card`}
    >
      {/* Color bar */}
      <div
        className="h-1.5"
        style={{ background: `linear-gradient(90deg, transparent, ${token.color}, transparent)` }}
      />

      <div className="px-6 pt-5 pb-7 space-y-5">
        {/* Owner identity */}
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden="true">{token.emoji}</span>
          <div>
            <p className="text-xl font-black text-white leading-tight">{token.displayName}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: token.color }}>
              {token.personality}
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div
          className="rounded-lg px-4 py-3 border"
          style={{ borderColor: `${token.color}25`, background: `${token.color}08` }}
        >
          <p className="text-sm text-slate-300 italic leading-snug">
            &ldquo;{token.tagline}&rdquo;
          </p>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Record',  value: stats.record },
            { label: '2025 Pts', value: stats.pts },
            { label: 'Rank',    value: stats.rank },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-3 py-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
              <p
                className="text-base font-black tabular-nums font-mono"
                style={{ color: token.color }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Bimfle verdict */}
        <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-1">
            Bimfle Verdict
          </p>
          <p className="text-sm text-slate-300 leading-snug">{stats.verdict}</p>
        </div>

        <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
          BMFFFL 2025 &bull; #BMFFFL
        </p>
      </div>
    </div>
  );
}

// ─── How to Share ─────────────────────────────────────────────────────────────

function HowToShare() {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
      <div className="flex items-start gap-3">
        <Camera className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider mb-1">
            How to Share
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Screenshot the card above, then share to Twitter, Discord, or the group chat.
            Tag <span className="text-[#ffd700] font-bold">#BMFFFL</span> so the league can find it.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Twitter / X', 'Discord', 'Group Chat', 'Instagram'].map((platform) => (
              <span
                key={platform}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#2d4a66] bg-[#0d1b2a] text-slate-400 text-[11px] font-semibold"
              >
                <Share2 className="w-2.5 h-2.5" aria-hidden="true" />
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ShareCardsPage() {
  const [activeCard, setActiveCard]     = useState<CardType>('championship');
  const [selectedWeek, setSelectedWeek] = useState<number>(16);
  const [spotlightOwner, setSpotlightOwner] = useState<string>('mlschools12');

  const currentMatchup = WEEKLY_MATCHUPS.find((m) => m.week === selectedWeek) ?? WEEKLY_MATCHUPS[0];

  return (
    <>
      <Head>
        <title>Share Cards — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Generate beautiful shareable cards for BMFFFL moments — championship wins, weekly matchups, big trades, season awards, and team spotlights."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Share Cards
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Beautiful cards for key BMFFFL moments. Screenshot and share.
          </p>
        </header>

        {/* ── Card Type Selector ──────────────────────────────────────────── */}
        <section aria-labelledby="card-type-heading" className="mb-8">
          <h2 id="card-type-heading" className="sr-only">Card Type</h2>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Card type">
            {CARD_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeCard === tab.id}
                onClick={() => setActiveCard(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-black border transition-colors duration-150',
                  activeCard === tab.id
                    ? 'bg-[#ffd700] text-[#1a1a2e] border-[#ffd700]'
                    : 'border-[#2d4a66] bg-[#16213e] text-slate-300 hover:border-[#ffd700]/40 hover:text-white'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Card Panels ─────────────────────────────────────────────────── */}
        <div className="space-y-8">

          {/* Championship */}
          {activeCard === 'championship' && (
            <section aria-label="Championship card">
              <ChampionshipCard />
              <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                Screenshot to share
              </p>
            </section>
          )}

          {/* Weekly Matchup */}
          {activeCard === 'weekly' && (
            <section aria-label="Weekly matchup card">
              {/* Week selector */}
              <div className="mb-6 max-w-md mx-auto">
                <label
                  htmlFor="week-select"
                  className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2"
                >
                  Select Week
                </label>
                <select
                  id="week-select"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#2d4a66] bg-[#16213e] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#ffd700]/50 focus:ring-1 focus:ring-[#ffd700]/30"
                >
                  {WEEKLY_MATCHUPS.map((m) => (
                    <option key={m.week} value={m.week}>
                      Week {m.week}
                    </option>
                  ))}
                </select>
              </div>

              <WeeklyMatchupCard matchup={currentMatchup} />
              <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                Screenshot to share
              </p>
            </section>
          )}

          {/* Big Trade */}
          {activeCard === 'trade' && (
            <section aria-label="Big trade card">
              <BigTradeCard />
              <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                Screenshot to share
              </p>
            </section>
          )}

          {/* Season Awards */}
          {activeCard === 'awards' && (
            <section aria-label="Season awards card">
              <SeasonAwardsCard />
              <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                Screenshot to share
              </p>
            </section>
          )}

          {/* Team Spotlight */}
          {activeCard === 'spotlight' && (
            <section aria-label="Team spotlight card">
              {/* Owner selector */}
              <div className="mb-6 max-w-md mx-auto">
                <label
                  htmlFor="owner-select"
                  className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2"
                >
                  Select Manager
                </label>
                <select
                  id="owner-select"
                  value={spotlightOwner}
                  onChange={(e) => setSpotlightOwner(e.target.value)}
                  className="w-full rounded-lg border border-[#2d4a66] bg-[#16213e] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#ffd700]/50 focus:ring-1 focus:ring-[#ffd700]/30"
                >
                  {SPOTLIGHT_OWNER_SLUGS.map((slug) => {
                    const token = getOwnerToken(slug);
                    return token ? (
                      <option key={slug} value={slug}>
                        {token.emoji} {token.displayName}
                      </option>
                    ) : null;
                  })}
                </select>
              </div>

              <TeamSpotlightCard ownerSlug={spotlightOwner} />
              <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                Screenshot to share
              </p>
            </section>
          )}

          {/* ── How to Share ───────────────────────────────────────────────── */}
          <HowToShare />

        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-center text-slate-600">
          All card data reflects BMFFFL 2025 season records.
          Stats are estimates — full Sleeper API integration coming in Phase G.
        </p>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
