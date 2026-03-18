import Head from 'next/head';
import Link from 'next/link';
import {
  Mic,
  Youtube,
  Radio,
  Play,
  Calendar,
  Clock,
  BarChart2,
  TrendingUp,
  Users,
  Star,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Headphones,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EpisodeConcept {
  id: string;
  title: string;
  icon: React.ElementType;
  duration: string;
  cadence: string;
  description: string;
  segments: string[];
}

interface PlatformGuide {
  name: string;
  icon: React.ElementType;
  effort: 'Low' | 'Medium' | 'High';
  timeToLaunch: string;
  cost: string;
  steps: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const EPISODE_CONCEPTS: EpisodeConcept[] = [
  {
    id: 'weekly-recap',
    title: 'Weekly Recap',
    icon: BarChart2,
    duration: '30–40 min',
    cadence: 'Weekly (in season)',
    description:
      'Every Tuesday after the weekend locks. Bimfle runs through the scores, biggest upsets, waiver wire movers, and the standings shakeup.',
    segments: ['Scoreboard rundown', 'Performance of the week', 'Waiver wire buzz', 'Standings update'],
  },
  {
    id: 'trade-analysis',
    title: 'Trade Analysis',
    icon: TrendingUp,
    duration: '25–35 min',
    cadence: 'As needed',
    description:
      'Deep dive on notable trades that went down in the league. Who won? Who got fleeced? What does the dynasty calculus actually say?',
    segments: ['Trade breakdown', 'Value comparison', 'Winner / loser verdict', 'Dynasty implications'],
  },
  {
    id: 'draft-day-special',
    title: 'Draft Day Special',
    icon: Star,
    duration: '60–90 min',
    cadence: 'Annually',
    description:
      'Live or same-day coverage of the annual rookie draft. Pick-by-pick reaction, immediate grades, and post-draft power rankings.',
    segments: ['Pre-draft big board', 'Live pick reactions', 'Best available analysis', 'Post-draft grades'],
  },
  {
    id: 'championship-preview',
    title: 'Championship Preview',
    icon: Play,
    duration: '35–45 min',
    cadence: 'Annually',
    description:
      'The week before the championship game, Bimfle previews the matchup. Strengths, weaknesses, key players, and a bold prediction.',
    segments: ['Matchup breakdown', 'Playoff path review', 'Key positional battles', 'Bold prediction'],
  },
  {
    id: 'dynasty-deep-dive',
    title: 'Dynasty Deep Dive',
    icon: Lightbulb,
    duration: '40–50 min',
    cadence: 'Monthly (offseason)',
    description:
      'Long-form strategy content. RB aging curves, buy-low windows, keeper calculus, and what the data says about dynasty decision-making.',
    segments: ['Topic framing', 'Data review', 'BMFFFL case studies', 'Actionable takeaways'],
  },
  {
    id: 'commissioners-corner',
    title: "Commissioner's Corner",
    icon: Users,
    duration: '20–30 min',
    cadence: 'Offseason',
    description:
      'Grandes hosts a state-of-the-league roundtable. Rule change proposals, format discussions, and what the managers actually think.',
    segments: ['State of the league', 'Rule proposals', 'Manager takes', 'Decisions for next season'],
  },
];

const PLATFORM_GUIDES: PlatformGuide[] = [
  {
    name: 'YouTube',
    icon: Youtube,
    effort: 'Medium',
    timeToLaunch: '1–2 hours setup',
    cost: 'Free',
    steps: [
      'Create a Google/YouTube account for BMFFFL',
      'Set up channel art (1280×720 banner, 800×800 logo)',
      'Record with OBS (free) or Riverside.fm (paid)',
      'Upload as unlisted first to test quality',
      'Publish and share to league group chat',
    ],
  },
  {
    name: 'Spotify / RSS',
    icon: Headphones,
    effort: 'Low',
    timeToLaunch: '30 min setup',
    cost: 'Free via Anchor/Spotify for Podcasters',
    steps: [
      'Sign up at podcasters.spotify.com',
      'Record audio with Audacity (free) or your phone',
      'Upload MP3 — Spotify hosts and distributes',
      'Auto-submits to Apple Podcasts, Amazon Music',
      'Share RSS feed link anywhere',
    ],
  },
  {
    name: 'Apple Podcasts',
    icon: Radio,
    effort: 'Low',
    timeToLaunch: 'Auto-distributed via Spotify',
    cost: 'Free (through Spotify for Podcasters)',
    steps: [
      'No separate setup needed if using Spotify for Podcasters',
      'Your RSS feed is submitted automatically',
      'Apple reviews and approves (1–5 days)',
      'Listeners can subscribe directly in Apple Podcasts',
    ],
  },
];

const TECH_STACK = [
  { label: 'Recording', options: 'OBS Studio (free) · Riverside.fm · Zoom + record' },
  { label: 'Audio editing', options: 'Audacity (free) · Descript · Adobe Podcast' },
  { label: 'Hosting', options: 'Spotify for Podcasters (free) · Buzzsprout · Transistor' },
  { label: 'Video editing', options: 'DaVinci Resolve (free) · CapCut · iMovie' },
  { label: 'Thumbnail', options: 'Canva (free) · Figma · Photoshop' },
  { label: 'Distribution', options: 'YouTube + Spotify + Apple Podcasts automatically' },
];

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

const EFFORT_COLORS: Record<PlatformGuide['effort'], string> = {
  Low: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/40',
  Medium: 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30',
  High: 'bg-red-900/30 text-red-300 border-red-700/40',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PodcastPage() {
  return (
    <>
      <Head>
        <title>BMFFFL Media Hub — Bimfle Broadcasting Network</title>
        <meta
          name="description"
          content="Design preview for the BMFFFL podcast and YouTube channel. Episode concepts, platform setup guide, and fan request poll for the Bimfle Broadcasting Network."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources" className="hover:text-[#ffd700] transition-colors duration-150">Resources</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">Media Hub</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#ffd700]/10 border border-[#ffd700]/30 mb-6">
            <Mic className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">
              Design Preview
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
            BMFFFL Media Hub
          </h1>
          <p className="text-xl font-semibold text-[#ffd700] mb-5">
            Bimfle Broadcasting Network
          </p>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            No microphone has been turned on yet — but when it is, this is the design.
            Episode concepts, platform setup guide, and a fan vote to kick things off.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Current Status ───────────────────────────────────────────── */}
        <section aria-labelledby="status-heading">
          <Card>
            <SectionHeader
              icon={AlertCircle}
              id="status-heading"
              label="Current Status"
              title="No Podcast or Channel Yet"
            />
            <div className="rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20 p-5">
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                BMFFFL does not currently have an official podcast or YouTube channel. The
                Bimfle Broadcasting Network is a design concept — this page shows what a
                BMFFFL media presence would look like when the league is ready to launch it.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Everything below — the episode formats, platform guides, and fan vote — is
                a preview. The infrastructure cost is low. The main bottleneck is time and
                a willing host.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Episodes recorded', value: '0' },
                { label: 'Subscribers', value: '0' },
                { label: 'Status', value: 'Concept' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4 text-center">
                  <p className="text-2xl font-black text-[#ffd700] mb-1">{value}</p>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ── Episode Format Design ─────────────────────────────────────── */}
        <section aria-labelledby="format-heading">
          <Card>
            <SectionHeader
              icon={Mic}
              id="format-heading"
              label="Episode Format Design"
              title="What a BMFFFL Episode Would Look Like"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { icon: Clock, label: 'Runtime', value: '30–45 min' },
                { icon: Calendar, label: 'Cadence', value: 'Weekly in-season' },
                { icon: Mic, label: 'Host', value: 'Bimfle-narrated' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
                  </div>
                  <p className="text-lg font-black text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white mb-2">Standard Episode Structure</p>
              {[
                { time: '0:00', segment: 'Cold open', detail: 'Best moment from last week — a crazy score, a controversial trade, a meme-worthy start' },
                { time: '2:00', segment: 'Intro & housekeeping', detail: 'Standings update, key schedule notes, any league business' },
                { time: '6:00', segment: 'Main segment', detail: 'The week\'s featured topic — recap, trade analysis, or deep dive' },
                { time: '25:00', segment: 'Waiver wire corner', detail: 'Three players to target this week, with dynasty context' },
                { time: '32:00', segment: 'Manager mailbag', detail: 'Submitted questions from league managers — answered live' },
                { time: '38:00', segment: 'Bold prediction', detail: 'One specific, testable, accountable call before signing off' },
              ].map(({ time, segment, detail }) => (
                <div key={segment} className="flex items-start gap-3 py-3 border-b border-[#2d4a66]/60 last:border-0">
                  <span className="text-[10px] font-bold text-slate-600 w-10 shrink-0 mt-0.5 tabular-nums">{time}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white leading-snug">{segment}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ── Episode Concepts ─────────────────────────────────────────── */}
        <section aria-labelledby="concepts-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
              <Play className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                6 Episode Types
              </p>
              <h2 id="concepts-heading" className="text-lg font-black text-white leading-tight">
                Content Ideas
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {EPISODE_CONCEPTS.map((concept) => {
              const Icon = concept.icon;
              return (
                <div
                  key={concept.id}
                  className="rounded-2xl bg-[#16213e] border border-[#2d4a66] p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-black text-white leading-snug">{concept.title}</h3>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0d1b2a] border border-[#2d4a66] text-slate-400">
                      {concept.duration}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0d1b2a] border border-[#2d4a66] text-slate-400">
                      {concept.cadence}
                    </span>
                  </div>

                  <p className="text-[12px] text-slate-400 leading-relaxed mb-4 flex-1">
                    {concept.description}
                  </p>

                  <ul className="space-y-1">
                    {concept.segments.map((seg) => (
                      <li key={seg} className="flex items-center gap-2 text-[11px] text-slate-500">
                        <CheckCircle className="w-3 h-3 text-[#ffd700]/50 shrink-0" aria-hidden="true" />
                        {seg}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Start a Channel ──────────────────────────────────────────── */}
        <section aria-labelledby="start-heading">
          <Card>
            <SectionHeader
              icon={Youtube}
              id="start-heading"
              label="Quick Guide"
              title="How to Start the Channel"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
              {PLATFORM_GUIDES.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.name} className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                        <h3 className="text-sm font-black text-white">{platform.name}</h3>
                      </div>
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                        EFFORT_COLORS[platform.effort]
                      )}>
                        {platform.effort}
                      </span>
                    </div>
                    <div className="space-y-1 mb-4">
                      <p className="text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">Setup time:</span>{' '}
                        {platform.timeToLaunch}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">Cost:</span>{' '}
                        {platform.cost}
                      </p>
                    </div>
                    <ol className="space-y-1.5">
                      {platform.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
                          <span className="shrink-0 w-4 h-4 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[9px] font-black text-[#ffd700] mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>

            {/* Tech Stack */}
            <div>
              <p className="text-sm font-bold text-white mb-3">Recommended Tech Stack</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TECH_STACK.map(({ label, options }) => (
                  <div key={label} className="rounded-lg bg-[#0d1b2a] border border-[#2d4a66] px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                    <p className="text-[12px] text-slate-300 leading-relaxed">{options}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Effort estimate */}
            <div className="mt-6 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]">
                  Realistic Effort Estimate
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                First episode to live: 4–6 hours (setup + record + edit + publish). Ongoing per episode: 2–3 hours.
                With Spotify for Podcasters + OBS, the total hard cost is{' '}
                <span className="font-bold text-white">$0</span>.
              </p>
            </div>
          </Card>
        </section>

        {/* ── Fan Vote ─────────────────────────────────────────────────── */}
        <section aria-labelledby="vote-heading">
          <Card>
            <SectionHeader
              icon={Users}
              id="vote-heading"
              label="Fan Request (Mock)"
              title="Should We Start the Podcast?"
            />

            <div className="rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20 px-4 py-3 mb-6 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-slate-300 leading-relaxed">
                This is a mock vote showing the intended design. No real votes have been cast.
                Actual polling requires authentication infrastructure not yet built.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Yes */}
              <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <span className="text-base font-black text-white">Yes, launch it</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400">75%</span>
                </div>
                <div className="h-3 rounded-full bg-[#16213e] border border-[#2d4a66] overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: '75%' }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[11px] text-slate-500">9 of 12 mock votes</p>
              </div>

              {/* No */}
              <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-slate-500" aria-hidden="true" />
                    <span className="text-base font-black text-white">Not interested</span>
                  </div>
                  <span className="text-2xl font-black text-slate-400">25%</span>
                </div>
                <div className="h-3 rounded-full bg-[#16213e] border border-[#2d4a66] overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-slate-600 transition-all duration-500"
                    style={{ width: '25%' }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[11px] text-slate-500">3 of 12 mock votes</p>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Mic className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <p className="text-sm font-bold text-white">Ready to make it real?</p>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                If the league actually wants this, the setup cost is near zero. Bimfle grabs a mic,
                OBS starts recording, and Episode 1 ships to Spotify within an afternoon. DM the
                Commissioner to make it official.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]">
                  <Radio className="w-3 h-3" aria-hidden="true" />
                  Bimfle Broadcasting Network
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300">
                  Season 7 launch candidate
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* ── Bottom links ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2d4a66]">
          <div className="flex flex-wrap gap-4 text-xs">
            <Link
              href="/resources/voting"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Voting System
            </Link>
            <Link
              href="/resources/contribute"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Contribute
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
            BMFFFL Future Feature Preview
          </p>
        </div>

      </div>
    </>
  );
}
