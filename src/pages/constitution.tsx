import Head from 'next/head';
import Link from 'next/link';
import { ScrollText, Shield, Crown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface ConstitutionSection {
  number: string;
  title: string;
  clauses: {
    id: string;
    text: string;
  }[];
}

const SECTIONS: ConstitutionSection[] = [
  {
    number: '1',
    title: 'Name and Purpose',
    clauses: [
      {
        id: '1.1',
        text: 'The league shall be known as the Best Motherfucking Fantasy Football League, abbreviated BMFFFL. Its founding occurred in 2016, following leadership dissatisfaction with a prior structure, with the express vision of creating something superior and more competent in its place.',
      },
      {
        id: '1.2',
        text: 'The stated purpose of this league is to become the most best and most powerful fantasy football league ever created. In pursuit of this purpose, the league shall promote friendly competition among its members, enhance the enjoyment of professional football, strengthen the bonds between members, and achieve cultural and geopolitical significance.',
      },
    ],
  },
  {
    number: '2',
    title: 'Membership',
    clauses: [
      {
        id: '2.1',
        text: 'Membership in the BMFFFL requires invitation by existing members and approval by the Commissioner and the league at large. Members possess the right to participate in all league activities and may freely express opinions on league matters, subject to the authority of the Commissioner.',
      },
    ],
  },
  {
    number: '3',
    title: 'The Commissioner',
    clauses: [
      {
        id: '3.1',
        text: 'The Commissioner shall serve as the chief executive officer of the league, holding ultimate interpretive and enforcement authority over all league matters. All decisions made by the Commissioner are final, unless specified otherwise in this Constitution. The Commissioner may delegate responsibilities to appointed assistants or subcommittees as deemed necessary.',
      },
    ],
  },
  {
    number: '4',
    title: 'Powers of the Commissioner',
    clauses: [
      {
        id: '4.1',
        text: "The Commissioner's authority shall include, but is not limited to: creating and organizing league rules through the Annual Owners' Meeting and codifying them in the unpublished BMFFFL Code of League Rules and Laws, also referred to as the LRL; proposing, creating, amending, adjusting, removing, interpreting, and enforcing all league rules; approving or canceling waiver claims, trades, acquisitions, and transactions; settling disputes between members and imposing sanctions where warranted; and appointing subcommittees and assistants to assist in league operations.",
      },
    ],
  },
  {
    number: '5',
    title: 'Decision Making',
    clauses: [
      {
        id: '5.1',
        text: 'Though holding ultimate authority, the Commissioner is encouraged to give reasonable consideration to suggestions and concerns raised by league members. League-wide votes may occur at the discretion of the Commissioner; however, the Commissioner retains the right to make the final decision, even if it goes against the majority vote, for the protection of the league.',
      },
    ],
  },
  {
    number: '6',
    title: 'Amendments to the Constitution',
    clauses: [
      {
        id: '6.1',
        text: 'Any member of the BMFFFL may submit a proposal for amendment to this Constitution. The Commissioner retains final authority over the wording, implementation, or rejection of any proposed amendment. No amendment shall take effect without the express approval of the Commissioner.',
      },
    ],
  },
  {
    number: '7',
    title: 'Season and Playoffs',
    clauses: [
      {
        id: '7.1',
        text: 'The Commissioner shall determine the regular season schedule on an annual basis and may adjust the season format, structure, and duration as circumstances require. Playoff seeding, bracket format, and scheduling shall likewise be determined at the Commissioner\'s discretion, consistent with the prevailing League Rules and Laws.',
      },
    ],
  },
  {
    number: '8',
    title: 'Conclusion',
    clauses: [
      {
        id: '8.1',
        text: 'Participation in the BMFFFL constitutes full and unconditional agreement to abide by this Constitution and to respect the authority of the Commissioner. This agreement is made in the spirit of smooth operation, fairness, and enjoyment of the league for all its members.',
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionBlock({ section }: { section: ConstitutionSection }) {
  return (
    <section aria-labelledby={`section-${section.number}-heading`} className="mb-8">
      {/* Section header */}
      <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-[#2d4a66]">
        <span className="text-xs font-black uppercase tracking-widest text-[#ffd700] font-mono shrink-0">
          § {section.number}
        </span>
        <h2
          id={`section-${section.number}-heading`}
          className="text-base font-black uppercase tracking-wide text-white"
        >
          {section.title}
        </h2>
      </div>

      {/* Clauses */}
      <div className="space-y-4 pl-1">
        {section.clauses.map((clause) => (
          <div key={clause.id} className="grid grid-cols-[3rem_1fr] gap-4 items-start">
            <span className="text-xs font-mono font-bold text-[#ffd700]/60 pt-0.5 text-right">
              {clause.id}
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{clause.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConstitutionPage() {
  return (
    <>
      <Head>
        <title>League Constitution — BMFFFL</title>
        <meta
          name="description"
          content="The Constitution of the Best Motherfucking Fantasy Football League — the founding document governing all BMFFFL operations, established 2016."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">Constitution</span>
          </nav>

          {/* Seal / icon lockup */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-5">
              {/* Outer ring */}
              <div
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center',
                  'bg-[#16213e] border-2 border-[#ffd700]/60',
                  'shadow-[0_0_30px_rgba(255,215,0,0.15)]'
                )}
              >
                <Crown className="w-9 h-9 text-[#ffd700]" aria-hidden="true" />
              </div>
              {/* Established badge */}
              <div
                className={cn(
                  'absolute -bottom-3 left-1/2 -translate-x-1/2',
                  'px-2.5 py-0.5 rounded-full',
                  'bg-[#ffd700] text-[#0d1b2a]',
                  'text-[10px] font-black uppercase tracking-widest whitespace-nowrap'
                )}
              >
                Est. 2016
              </div>
            </div>

            {/* League label */}
            <p className="text-xs font-bold uppercase tracking-widest text-[#ffd700] mb-3 mt-2">
              BMFFFL
            </p>

            {/* Document title */}
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-1">
              The Constitution
            </h1>
            <p className="text-base text-slate-400 font-medium">
              of the Best Motherfucking Fantasy Football League
            </p>
          </div>

          {/* Divider with shield icon */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-[#2d4a66]" />
            <Shield className="w-4 h-4 text-[#2d4a66] shrink-0" aria-hidden="true" />
            <div className="flex-1 h-px bg-[#2d4a66]" />
          </div>

          {/* Preamble */}
          <div
            className={cn(
              'rounded-xl p-6 sm:p-8',
              'bg-[#16213e] border border-[#2d4a66]',
              'shadow-[inset_0_1px_0_rgba(255,215,0,0.06)]'
            )}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-[#ffd700]/70 mb-4">
              Preamble
            </p>
            <blockquote>
              <p
                className={cn(
                  'text-base sm:text-lg leading-8 text-slate-200',
                  'italic font-serif'
                )}
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                &ldquo;We, the members of the BMFFFL, in our desire for fair play, governed by a
                competent authority, to promote competition and camaraderie, do hereby adopt and
                proclaim this Constitution to guide our league, entrusting the Commissioner with the
                ultimate executive power and authority over the rules and regulations of our
                league.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Document body ─────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Scroll icon + "Articles" label */}
        <div className="flex items-center gap-3 mb-10">
          <ScrollText className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Articles of the Constitution
          </span>
          <div className="flex-1 h-px bg-[#2d4a66]" />
        </div>

        {/* Sections */}
        <div>
          {SECTIONS.map((section) => (
            <SectionBlock key={section.number} section={section} />
          ))}
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer className="mt-12 pt-8 border-t border-[#2d4a66]">

          {/* Signature block */}
          <div
            className={cn(
              'rounded-xl p-6 bg-[#16213e] border border-[#2d4a66] mb-8',
              'text-center'
            )}
          >
            <Crown className="w-5 h-5 text-[#ffd700] mx-auto mb-3" aria-hidden="true" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
              Commissioner
            </p>
            <p className="text-lg font-black text-white">Grandes</p>
            <div className="mt-4 pt-4 border-t border-[#2d4a66]">
              <p className="text-xs text-slate-500 italic">
                Amended as needed at Annual Owners&apos; Meetings
              </p>
            </div>
          </div>

          {/* Related links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <Link
              href="/rules"
              className={cn(
                'flex items-center justify-between gap-3',
                'rounded-lg px-5 py-4 text-sm font-semibold',
                'bg-[#16213e] border border-[#2d4a66] text-slate-200',
                'hover:border-[#ffd700] hover:text-[#ffd700]',
                'transition-colors duration-150 group'
              )}
            >
              <span>
                <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-[#ffd700]/60 mb-0.5">
                  Operational Rules
                </span>
                League Rules &amp; Laws (LRL)
              </span>
              <ExternalLink className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100" aria-hidden="true" />
            </Link>

            <Link
              href="/season/owners-meeting-2026"
              className={cn(
                'flex items-center justify-between gap-3',
                'rounded-lg px-5 py-4 text-sm font-semibold',
                'bg-[#16213e] border border-[#2d4a66] text-slate-200',
                'hover:border-[#e94560] hover:text-[#e94560]',
                'transition-colors duration-150 group'
              )}
            >
              <span>
                <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-[#e94560]/60 mb-0.5">
                  Annual Meeting
                </span>
                2026 Owners&apos; Meeting
              </span>
              <ExternalLink className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100" aria-hidden="true" />
            </Link>
          </div>

          {/* Fine print */}
          <p className="text-xs text-slate-600 text-center">
            BMFFFL &mdash; Established 2016. This document is the supreme governing authority of
            the league. All operational rules derive their legitimacy from this Constitution.
          </p>
        </footer>
      </div>
    </>
  );
}
