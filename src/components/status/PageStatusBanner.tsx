/**
 * PageStatusBanner
 * 
 * Optional banner that shows data quality status for a page.
 * Used by admin/commissioner-toolkit for review.
 * In production, only shows on 'placeholder' and 'coming-soon' pages.
 */

import React from 'react';
import { type PageStatus } from '@/data/page-status';

interface PageStatusBannerProps {
  status: PageStatus;
  notes?: string;
  /** If true, always show even for validated pages (admin mode) */
  forceShow?: boolean;
}

const STATUS_CONFIG: Record<PageStatus, { label: string; color: string; bg: string; border: string }> = {
  validated: {
    label: '✓ Data Validated',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/40',
  },
  partial: {
    label: '⚡ Partially Validated',
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-800/40',
  },
  placeholder: {
    label: '⚠ Placeholder Data',
    color: 'text-orange-400',
    bg: 'bg-orange-950/40',
    border: 'border-orange-800/40',
  },
  'coming-soon': {
    label: '🚧 Coming Soon',
    color: 'text-slate-400',
    bg: 'bg-slate-900/40',
    border: 'border-slate-700/40',
  },
};

export function PageStatusBanner({ status, notes, forceShow = false }: PageStatusBannerProps) {
  // Only show by default for pages with data issues
  if (!forceShow && (status === 'validated')) {
    return null;
  }

  const config = STATUS_CONFIG[status];

  return (
    <div
      className={`
        mb-4 rounded-md border px-3 py-2 text-xs font-medium
        ${config.bg} ${config.border}
      `}
      role="status"
      aria-label={`Page data status: ${config.label}`}
    >
      <span className={config.color}>{config.label}</span>
      {notes && (
        <span className="ml-2 text-slate-400">{notes}</span>
      )}
    </div>
  );
}
