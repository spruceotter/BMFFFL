import Head from 'next/head';
import { Clock, Users, Radio, MessageSquare, ExternalLink, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Pos = 'QB' | 'RB' | 'WR' | 'TE';

interface CompletedPick {
  overall: number;
  round: number;
  pick: number;
  owner: string;
  ownerColor: string;
  playerName: string;
  pos: Pos;
  nflTeam: string;
}

interface AvailableProspect {
  rank: number;
  name: string;
  pos: Pos;
  nflTeam: string;
  note: string;
}

interface ChatMessage {
  author: string;
  text: string;
  authorColor: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_PICKS = 36;
const ROUNDS = 3;
const TEAMS = 12;

// Snake draft order for 3 rounds — the task specifies picks 1.01–1.05 made,
// 1.06 on the clock. Draft order taken from mock-draft page data (task spec).
const ROUND1_ORDER: { owner: string; ownerColor: string }[] = [
  { owner: 'rbr',           ownerColor: '#3b82f6' }, // 1.01 — 2025 champion (picks 1st per task)
  { owner: 'juicybussy',    ownerColor: '#f59e0b' },
  { owner: 'tubes94',       ownerColor: '#8b5cf6' },
  { owner: 'mlschools12',   ownerColor: '#10b981' },
  { owner: 'eldridsm',      ownerColor: '#f97316' },
  { owner: 'sexmachineandy',ownerColor: '#e94560' },
  { owner: 'eldridm20',     ownerColor: '#06b6d4' },
  { owner: 'tdtd19844',     ownerColor: '#84cc16' },
  { owner: 'cogdeill11',    ownerColor: '#a855f7' },
  { owner: 'grandes',       ownerColor: '#ec4899' },
  { owner: 'bimfle',        ownerColor: '#ffd700' },
  { owner: 'cmaleski',      ownerColor: '#94a3b8' },
];

// Build all 36 pick slots (3-round snake)
interface SlotMeta { overall: number; round: number; pick: number; owner: string; ownerColor: string }

function buildSlots(): SlotMeta[] {
  const slots: SlotMeta[] = [];
  for (let r = 1; r <= ROUNDS; r++) {
    const order = r % 2 === 1 ? ROUND1_ORDER : [...ROUND1_ORDER].reverse();
    order.forEach((team, i) => {
      slots.push({
        overall: (r - 1) * TEAMS + i + 1,
        round: r,
        pick: i + 1,
        owner: team.owner,
        ownerColor: team.ownerColor,
      });
    });
  }
  return slots;
}

const ALL_SLOTS = buildSlots();

// ─── Mock pick data (picks 1.01–1.05 made) ───────────────────────────────────

const COMPLETED_PICKS: CompletedPick[] = [
  { overall: 1, round: 1, pick: 1,  owner: 'rbr',         ownerColor: '#3b82f6', playerName: 'Tetairoa McMillan', pos: 'WR', nflTeam: 'CAR' },
  { overall: 2, round: 1, pick: 2,  owner: 'juicybussy',  ownerColor: '#f59e0b', playerName: 'Omarion Hampton',   pos: 'RB', nflTeam: 'LAC' },
  { overall: 3, round: 1, pick: 3,  owner: 'tubes94',     ownerColor: '#8b5cf6', playerName: 'Emeka Egbuka',       pos: 'WR', nflTeam: 'TB'  },
  { overall: 4, round: 1, pick: 4,  owner: 'mlschools12', ownerColor: '#10b981', playerName: 'Quinshon Judkins',   pos: 'RB', nflTeam: 'CLE' },
  { overall: 5, round: 1, pick: 5,  owner: 'eldridsm',    ownerColor: '#f97316', playerName: 'Luther Burden III',  pos: 'WR', nflTeam: 'CHI' },
];

const ON_THE_CLOCK_SLOT = ALL_SLOTS.find(s => s.overall === 6)!;

// ─── Available prospects queue ────────────────────────────────────────────────

const AVAILABLE_PROSPECTS: AvailableProspect[] = [
  { rank: 1,  name: 'Ollie Gordon II',    pos: 'RB', nflTeam: 'TEN', note: 'Oklahoma State — power runner, high-volume back' },
  { rank: 2,  name: 'Isaiah Davis',        pos: 'RB', nflTeam: 'NYJ', note: 'USC — three-down back, pass-catcher' },
  { rank: 3,  name: 'Jaylen Wright',       pos: 'RB', nflTeam: 'MIA', note: 'Tennessee — elite speed, pass game role' },
  { rank: 4,  name: 'Evan Stewart',        pos: 'WR', nflTeam: 'JAC', note: 'Oregon — contested-catch WR, 6\'2"' },
  { rank: 5,  name: 'Tez Johnson',         pos: 'WR', nflTeam: 'DEN', note: 'Oregon — slot receiver, YAC monster' },
  { rank: 6,  name: 'Tre Harris',          pos: 'WR', nflTeam: 'LAC', note: 'Ole Miss — volume WR, good target share' },
  { rank: 7,  name: 'Elic Ayomanor',       pos: 'WR', nflTeam: 'TEN', note: 'Stanford — big target, red-zone threat' },
  { rank: 8,  name: 'TreVeyon Henderson',  pos: 'RB', nflTeam: 'NE',  note: 'Ohio State — three-down back' },
  { rank: 9,  name: 'Will Howard',         pos: 'QB', nflTeam: 'PIT', note: 'Ohio State QB — national champion' },
  { rank: 10, name: 'Dont\'e Thornton',    pos: 'WR', nflTeam: 'NYJ', note: 'Tennessee — elite athleticism, upside' },
];

// ─── Mock chat messages ───────────────────────────────────────────────────────

const CHAT_MESSAGES: ChatMessage[] = [
  { author: 'rbr',         authorColor: '#3b82f6', text: 'McMillan no question' },
  { author: 'mlschools12', authorColor: '#10b981', text: '👑 Judkins at 1.04. Value.' },
  { author: 'juicybussy',  authorColor: '#f59e0b', text: 'Hampton gonna go off in LAC offense' },
  { author: 'eldridsm',    authorColor: '#f97316', text: 'Burden sleeper hit. CHI rebuild is real' },
  { author: 'bimfle',      authorColor: '#ffd700', text: 'Probability analysis complete. You have all made statistically defensible choices.' },
];

// ─── Position style maps ──────────────────────────────────────────────────────

const POS_BG: Record<Pos, string> = {
  QB: 'bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
};

const POS_DOT: Record<Pos, string> = {
  QB: 'bg-[#e94560]',
  RB: 'bg-emerald-500',
  WR: 'bg-blue-500',
  TE: 'bg-orange-500',
};

// ─── Helper: format pick label ────────────────────────────────────────────────

function pickLabel(round: number, pick: number): string {
  return `${round}.${String(pick).padStart(2, '0')}`;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function OfflineBanner() {
  return (
    <div
      className="w-full rounded-xl border border-yellow-500/40 bg-yellow-500/5 px-4 py-3 flex items-start gap-3"
      role="status"
    >
      <span className="text-yellow-400 text-base leading-none mt-px shrink-0" aria-hidden="true">🟡</span>
      <p className="text-sm text-yellow-300 leading-relaxed">
        <span className="font-bold">Draft Room — Offline Mode.</span>{' '}
        Live drafts require the Sleeper app. This preview shows the 2026 Rookie Draft board.
      </p>
    </div>
  );
}

function DraftHeader() {
  return (
    <section className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-3">
            <Radio className="w-3 h-3" aria-hidden="true" />
            Live Draft Room
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            2026 BMFFFL Rookie Draft
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            3 rounds · {TOTAL_PICKS} picks · Snake format
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</span>
          <span className="text-sm font-bold text-[#ffd700]">Draft Date: TBD — Spring 2026</span>
          <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block" aria-hidden="true" />
            Pick {COMPLETED_PICKS.length + 1} of {TOTAL_PICKS}
          </div>
        </div>
      </div>
    </section>
  );
}

function OnTheClockCard() {
  const lastThree = COMPLETED_PICKS.slice(-3);

  return (
    <section
      className="rounded-xl border-2 border-[#e94560]/60 bg-[#16213e] overflow-hidden"
      aria-labelledby="otc-heading"
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#e94560] via-[#ffd700] to-[#e94560]" aria-hidden="true" />

      <div className="px-5 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Left: pick info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">On the Clock</p>
            <div className="flex items-center gap-3 mb-2">
              <span
                id="otc-heading"
                className="text-4xl font-black text-white tabular-nums"
              >
                {pickLabel(ON_THE_CLOCK_SLOT.round, ON_THE_CLOCK_SLOT.pick)}
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: ON_THE_CLOCK_SLOT.ownerColor }}
              >
                {ON_THE_CLOCK_SLOT.owner}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pick {ON_THE_CLOCK_SLOT.overall} of {TOTAL_PICKS} · Round 1
            </p>
          </div>

          {/* Center: countdown */}
          <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 shrink-0">
            <div className="flex items-center gap-1.5 text-[#e94560] mb-0.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Time Remaining</span>
            </div>
            <span className="text-4xl font-black text-white tabular-nums tracking-tight" aria-label="15 minutes remaining">
              15:00
            </span>
            <div className="w-full mt-2 h-1.5 rounded-full bg-[#2d4a66] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#e94560] transition-all"
                style={{ width: '100%' }}
                role="progressbar"
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Time remaining"
              />
            </div>
          </div>

          {/* Right: pick history strip */}
          {lastThree.length > 0 && (
            <div className="shrink-0">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Last Picks</p>
              <div className="flex flex-col gap-1.5">
                {lastThree.map(cp => (
                  <div
                    key={cp.overall}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] min-w-[180px]"
                  >
                    <span className="text-[10px] font-black text-[#ffd700] tabular-nums w-8 shrink-0">
                      {pickLabel(cp.round, cp.pick)}
                    </span>
                    <span
                      className={cn('text-[9px] font-bold px-1 py-0.5 rounded shrink-0', POS_BG[cp.pos])}
                    >
                      {cp.pos}
                    </span>
                    <span className="text-xs font-semibold text-white truncate">{cp.playerName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DraftBoardGrid() {
  const pickedMap = Object.fromEntries(COMPLETED_PICKS.map(p => [p.overall, p]));

  return (
    <section aria-labelledby="board-heading">
      <h2 id="board-heading" className="text-base font-bold text-white mb-4 flex items-center gap-2">
        Draft Board
        <span className="text-sm text-slate-500 font-normal">
          ({COMPLETED_PICKS.length}/{TOTAL_PICKS} picks made)
        </span>
      </h2>

      {/* Progress bar */}
      <div className="mb-4 w-full h-1.5 rounded-full bg-[#2d4a66] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#ffd700] transition-all duration-500"
          style={{ width: `${(COMPLETED_PICKS.length / TOTAL_PICKS) * 100}%` }}
          role="progressbar"
          aria-valuenow={COMPLETED_PICKS.length}
          aria-valuemin={0}
          aria-valuemax={TOTAL_PICKS}
          aria-label="Draft progress"
        />
      </div>

      <div className="space-y-6">
        {Array.from({ length: ROUNDS }, (_, ri) => {
          const round = ri + 1;
          const roundSlots = ALL_SLOTS.filter(s => s.round === round);
          const isSnakeBack = round % 2 === 0;

          return (
            <div key={round}>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-sm font-bold text-white">Round {round}</h3>
                <span className="text-xs text-slate-600">
                  {isSnakeBack ? 'Snake — 12→1' : 'Picks 1→12'}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-1.5">
                {roundSlots.map(slot => {
                  const cp = pickedMap[slot.overall];
                  const isOnClock = slot.overall === ON_THE_CLOCK_SLOT.overall;
                  const label = pickLabel(slot.round, slot.pick);

                  return (
                    <div
                      key={slot.overall}
                      className={cn(
                        'rounded-lg border overflow-hidden',
                        cp
                          ? 'border-[#2d4a66] bg-[#16213e]'
                          : isOnClock
                          ? 'border-[#e94560]/60 bg-[#e94560]/5 ring-1 ring-[#e94560]/30'
                          : 'border-[#1e3347]/60 bg-[#0d1b2a]/40'
                      )}
                      aria-label={
                        cp
                          ? `${label} ${slot.owner}: ${cp.playerName}`
                          : isOnClock
                          ? `${label} ${slot.owner}: On the clock`
                          : `${label} ${slot.owner}: Upcoming`
                      }
                    >
                      {/* Header row */}
                      <div
                        className={cn(
                          'px-2 py-1 flex items-center justify-between border-b',
                          cp
                            ? 'bg-[#0f2744] border-[#1e3347]'
                            : isOnClock
                            ? 'bg-[#e94560]/10 border-[#e94560]/20'
                            : 'bg-[#0d1b2a]/30 border-[#1e3347]/30'
                        )}
                      >
                        <span
                          className={cn(
                            'text-[9px] font-black tabular-nums',
                            cp ? 'text-[#ffd700]' : isOnClock ? 'text-[#e94560]' : 'text-slate-700'
                          )}
                        >
                          {label}
                        </span>
                        <span
                          className="text-[8px] truncate max-w-[48px]"
                          style={{ color: slot.ownerColor + 'cc' }}
                        >
                          {slot.owner.slice(0, 7)}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="px-2 py-1.5 min-h-[44px] flex flex-col justify-center">
                        {cp ? (
                          <>
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', POS_DOT[cp.pos])} aria-hidden="true" />
                              <span className="text-[10px] font-bold text-white leading-tight truncate">{cp.playerName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={cn('text-[8px] font-bold uppercase px-1 rounded', POS_BG[cp.pos])}>
                                {cp.pos}
                              </span>
                              <span className="text-[8px] text-slate-600">{cp.nflTeam}</span>
                            </div>
                          </>
                        ) : isOnClock ? (
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse shrink-0" aria-hidden="true" />
                            <span className="text-[10px] font-bold text-[#e94560]">ON CLOCK</span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-700 text-center w-full block">upcoming</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AvailablePlayersQueue() {
  return (
    <section
      className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden"
      aria-labelledby="avail-heading"
    >
      <div className="px-5 py-4 border-b border-[#2d4a66] bg-[#0f2744]">
        <div className="flex items-center justify-between gap-2">
          <h2 id="avail-heading" className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            Available Players
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">{AVAILABLE_PROSPECTS.length} prospects</span>
        </div>
      </div>

      <ul className="divide-y divide-[#1e3347]" aria-label="Top available prospects">
        {AVAILABLE_PROSPECTS.map(p => (
          <li key={p.rank} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a2d42] transition-colors">
            <span className="shrink-0 w-6 h-6 rounded-md bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center text-[10px] font-black text-slate-500 tabular-nums">
              {p.rank}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-semibold text-white truncate">{p.name}</span>
                <span className={cn('shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded', POS_BG[p.pos])}>
                  {p.pos}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug truncate">{p.note}</p>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-slate-600">{p.nflTeam}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SleeperIntegrationNote() {
  return (
    <section
      className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4"
      aria-labelledby="sleeper-note-heading"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] shrink-0 mt-0.5">
          <ExternalLink className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
        </div>
        <div>
          <h2 id="sleeper-note-heading" className="text-sm font-bold text-white mb-1.5">
            Sleeper Integration
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            For live draft day, use the{' '}
            <span className="text-[#ffd700] font-semibold">Sleeper app</span>. This board
            auto-syncs with your Sleeper league. The draft room here is for{' '}
            <span className="text-white font-medium">post-draft review and pick tracking</span>.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { icon: CheckCircle2, text: 'Post-draft review' },
              { icon: CheckCircle2, text: 'Pick history tracking' },
              { icon: Circle, text: 'Real-time pick entry (Sleeper app)' },
              { icon: Circle, text: 'Live timer sync (Sleeper app)' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                <Icon
                  className={cn('w-3.5 h-3.5 shrink-0', i < 2 ? 'text-emerald-400' : 'text-slate-600')}
                  aria-hidden="true"
                />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DraftChatMock() {
  return (
    <section
      className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden"
      aria-labelledby="chat-heading"
    >
      <div className="px-5 py-3 border-b border-[#2d4a66] bg-[#0f2744] flex items-center justify-between">
        <h2 id="chat-heading" className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
          Draft Chat
        </h2>
        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Preview only</span>
      </div>

      <ul className="divide-y divide-[#1e3347]" aria-label="Mock draft chat messages">
        {CHAT_MESSAGES.map((msg, i) => (
          <li key={i} className="px-4 py-3 flex items-start gap-3">
            <div
              className="shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-black text-[#0d1b2a] uppercase mt-0.5"
              style={{ borderColor: msg.authorColor, backgroundColor: msg.authorColor + '33' }}
              aria-hidden="true"
            >
              <span style={{ color: msg.authorColor }}>
                {msg.author.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold" style={{ color: msg.authorColor }}>
                {msg.author}
              </span>
              <p className="text-sm text-slate-300 leading-snug mt-0.5">{msg.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="px-4 py-3 border-t border-[#1e3347] bg-[#0d1b2a]/40">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-600 text-sm">
          <span className="flex-1 italic text-xs">Chat requires live Sleeper session…</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveDraftPage() {
  return (
    <>
      <Head>
        <title>Live Draft Room — 2026 BMFFFL Rookie Draft</title>
        <meta
          name="description"
          content="2026 BMFFFL Rookie Draft room preview — 3-round snake draft board, pick history, available player queue, and draft chat. Live drafts use the Sleeper app."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-5">

        {/* Status banner */}
        <OfflineBanner />

        {/* Draft header */}
        <DraftHeader />

        {/* On the clock */}
        <OnTheClockCard />

        {/* Main content — board + sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 items-start">
          {/* Left: full draft board */}
          <DraftBoardGrid />

          {/* Right: sidebar */}
          <div className="space-y-5">
            <AvailablePlayersQueue />
            <SleeperIntegrationNote />
            <DraftChatMock />
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-slate-600 pt-2">
          This is a static preview of the 2026 BMFFFL Rookie Draft. Picks 1.01–1.05 are
          shown as completed based on the mock draft simulator. Live draft day requires
          the Sleeper app. Draft date TBD — Spring 2026.
        </p>

      </div>
    </>
  );
}
