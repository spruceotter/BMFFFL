import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotificationBannerProps {
  message: string;
  type: 'info' | 'warning' | 'success';
  href?: string;
  /** Key used for sessionStorage dismissal. Defaults to a hash of the message. */
  storageKey?: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationBannerProps['type'],
  { bg: string; border: string; text: string; Icon: React.FC<{ className?: string }> }
> = {
  info: {
    bg:     'bg-[#0d1b2a]',
    border: 'border-[#ffd700]/30',
    text:   'text-[#ffd700]',
    Icon:   Info,
  },
  warning: {
    bg:     'bg-amber-950/60',
    border: 'border-amber-500/40',
    text:   'text-amber-300',
    Icon:   AlertTriangle,
  },
  success: {
    bg:     'bg-emerald-950/60',
    border: 'border-emerald-500/40',
    text:   'text-emerald-300',
    Icon:   CheckCircle,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationBanner({
  message,
  type,
  href,
  storageKey,
}: NotificationBannerProps) {
  const key = storageKey ?? `banner-dismissed:${message.slice(0, 40)}`;
  const [visible, setVisible] = useState(false);

  // Check sessionStorage on mount (client-only)
  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      const dismissed = sessionStorage.getItem(key);
      if (!dismissed) setVisible(true);
    }
  }, [key]);

  function dismiss() {
    sessionStorage.setItem(key, '1');
    setVisible(false);
  }

  if (!visible) return null;

  const cfg = TYPE_CONFIG[type];
  const IconComponent = cfg.Icon;

  const inner = (
    <span className="flex items-center gap-2 flex-1 min-w-0">
      <IconComponent className={cn('w-4 h-4 shrink-0', cfg.text)} aria-hidden="true" />
      <span className={cn('text-sm font-medium leading-snug', cfg.text)}>
        {message}
      </span>
      {href && (
        <span className={cn('text-xs font-semibold underline underline-offset-2 shrink-0 ml-1', cfg.text)}>
          Learn more →
        </span>
      )}
    </span>
  );

  return (
    <div
      role="alert"
      className={cn(
        'w-full border-b py-2 px-4',
        cfg.bg, cfg.border
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Message — optionally linked */}
        {href ? (
          <Link href={href} className="flex-1 min-w-0 hover:opacity-80 transition-opacity duration-150">
            {inner}
          </Link>
        ) : (
          <div className="flex-1 min-w-0">
            {inner}
          </div>
        )}

        {/* Dismiss button */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className={cn(
            'shrink-0 p-1 rounded transition-colors duration-150',
            'text-slate-500 hover:text-white hover:bg-white/10'
          )}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
