/**
 * BMFFFL Owners Meeting History
 * /history/meetings
 *
 * Chronological archive of annual Owners Meetings — propositions, outcomes, context.
 * Data: public/data/meeting-history.json
 * Status: scaffold — full transcripts/notes to be imported by Commissioner.
 */

import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Gavel, CheckCircle, XCircle, Clock, FileText, AlertCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Proposition {
  letter: string;
  title: string;
  description: string;
  outcome: 'passed' | 'failed' | 'modified' | 'tabled' | 'pending' | string;
}

interface Meeting {
  year: number;
  date: string;
  status: 'confirmed' | 'partial' | 'placeholder' | 'upcoming';
  summary: string;
  context: string;
  propositions: Proposition[];
}

interface MeetingHistoryData {
  generatedAt: string;
  note: string;
  meetings: Meeting[];
}

interface Props {
  data: MeetingHistoryData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function outcomeStyle(outcome: string) {
  switch (outcome) {
    case 'passed':   return { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, label: 'Passed', cls: 'text-emerald-400 bg-emerald-900/30 border-emerald-800/50' };
    case 'failed':   return { icon: <XCircle className="w-4 h-4 text-red-400" />,      label: 'Failed', cls: 'text-red-400 bg-red-900/30 border-red-800/50' };
    case 'modified': return { icon: <AlertCircle className="w-4 h-4 text-yellow-400" />, label: 'Modified', cls: 'text-yellow-400 bg-yellow-900/30 border-yellow-800/50' };
    case 'tabled':   return { icon: <Clock className="w-4 h-4 text-slate-400" />,       label: 'Tabled', cls: 'text-slate-400 bg-slate-800 border-slate-700' };
    case 'pending':  return { icon: <Clock className="w-4 h-4 text-sky-400" />,         label: 'Pending', cls: 'text-sky-400 bg-sky-900/30 border-sky-800/50' };
    default:         return { icon: <Clock className="w-4 h-4 text-slate-500" />,       label: outcome, cls: 'text-slate-500 bg-slate-800 border-slate-700' };
  }
}

function statusBadge(status: Meeting['status']) {
  switch (status) {
    case 'confirmed':    return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800/50">Confirmed</span>;
    case 'partial':      return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-800/50">Partial Record</span>;
    case 'placeholder':  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">Transcript Needed</span>;
    case 'upcoming':     return <span className="text-xs px-2 py-0.5 rounded-full bg-sky-900/40 text-sky-400 border border-sky-800/50">Upcoming</span>;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MeetingsPage({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 2026: true });

  const toggle = (year: number) => setExpanded(prev => ({ ...prev, [year]: !prev[year] }));

  return (
    <>
      <Head>
        <title>Owners Meeting History | BMFFFL</title>
        <meta name="description" content="BMFFFL annual Owners Meeting archive — propositions, votes, and league governance history." />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="mb-8">
            <Link href="/history" className="text-xs text-slate-500 hover:text-slate-300 mb-4 inline-block">
              ← History
            </Link>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Gavel className="w-8 h-8 text-yellow-400" />
              Owners Meeting History
            </h1>
            <p className="text-slate-400 mt-2">
              Annual governance record — propositions, votes, and what shaped the BMFFFL.
            </p>
          </div>

          {/* Scaffold notice */}
          {data.meetings.some(m => m.status === 'placeholder') && (
            <div className="mb-6 bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex gap-3">
              <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-400">
                <span className="text-slate-300 font-medium">Transcript import pending.</span>{' '}
                Several years show placeholder records. Commissioner is supplying source files (transcripts, notes, presentations) to complete the archive.
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            {data.meetings.map((meeting) => {
              const isOpen = !!expanded[meeting.year];
              const hasPropositions = meeting.propositions.length > 0;

              return (
                <div
                  key={meeting.year}
                  className={`rounded-xl border overflow-hidden ${
                    meeting.status === 'upcoming'
                      ? 'border-sky-700/50 bg-sky-950/30'
                      : meeting.status === 'placeholder'
                      ? 'border-slate-700/40 bg-slate-900/40'
                      : 'border-slate-700/50 bg-slate-900/60'
                  }`}
                >
                  {/* Year header */}
                  <button
                    onClick={() => toggle(meeting.year)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${
                        meeting.status === 'upcoming' ? 'text-sky-300' :
                        meeting.status === 'placeholder' ? 'text-slate-500' : 'text-slate-200'
                      }`}>
                        {meeting.year}
                      </span>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {statusBadge(meeting.status)}
                          {hasPropositions && (
                            <span className="text-xs text-slate-500">
                              {meeting.propositions.length} proposition{meeting.propositions.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{meeting.date}</span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-700/30">
                      {/* Context */}
                      <div className="mt-4 mb-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-medium">Context</p>
                        <p className="text-sm text-slate-400">{meeting.context}</p>
                      </div>

                      {/* Summary */}
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-medium">Summary</p>
                        <p className={`text-sm ${meeting.status === 'placeholder' ? 'text-slate-600 italic' : 'text-slate-300'}`}>
                          {meeting.summary}
                        </p>
                      </div>

                      {/* Propositions */}
                      {hasPropositions ? (
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">Propositions</p>
                          <div className="space-y-2">
                            {meeting.propositions.map((prop, i) => {
                              const os = outcomeStyle(prop.outcome);
                              return (
                                <div
                                  key={i}
                                  className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2 flex-1">
                                      {prop.letter !== '—' && (
                                        <span className="text-xs font-bold text-yellow-500 bg-yellow-900/30 border border-yellow-800/50 rounded px-1.5 py-0.5 shrink-0 mt-0.5">
                                          Prop {prop.letter}
                                        </span>
                                      )}
                                      <div>
                                        <p className="text-sm font-medium text-slate-200">{prop.title}</p>
                                        {prop.description && (
                                          <p className="text-xs text-slate-400 mt-1">{prop.description}</p>
                                        )}
                                      </div>
                                    </div>
                                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border shrink-0 ${os.cls}`}>
                                      {os.icon}
                                      {os.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : meeting.status === 'placeholder' ? (
                        <div className="bg-slate-800/30 border border-dashed border-slate-700/40 rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-600">Propositions will be added when Commissioner shares transcript/notes.</p>
                        </div>
                      ) : null}

                      {/* Link to current meeting page */}
                      {meeting.status === 'upcoming' && (
                        <div className="mt-4">
                          <Link
                            href="/meeting"
                            className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 font-medium"
                          >
                            <Gavel className="w-4 h-4" />
                            View {meeting.year} Owners Meeting page →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-700 text-center mt-8">
            BMFFFL founded August 21, 2016 · Owners Meeting archive curated by Bimflé, Assistant Commissioner
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Static Props ─────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'meeting-history.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: MeetingHistoryData = JSON.parse(raw);
  return { props: { data } };
};
