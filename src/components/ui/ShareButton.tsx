import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ShareButtonProps {
  /** Optional URL to share. Defaults to window.location.href. */
  url?: string;
  /** Optional page title for Web Share API. */
  title?: string;
  className?: string;
}

/**
 * "Share This Page" button.
 * Uses Web Share API when available; falls back to clipboard copy.
 * Shows "Copied!" confirmation for 2 seconds after clipboard fallback.
 */
export default function ShareButton({ url, title, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');
    const shareTitle = title ?? (typeof document !== 'undefined' ? document.title : 'BMFFFL');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch {
        // User cancelled or share failed — no-op
      }
      return;
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold',
        'bg-[#2d4a66]/60 border border-[#2d4a66] text-slate-300',
        'hover:bg-[#ffd700]/10 hover:border-[#ffd700]/40 hover:text-[#ffd700]',
        'transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]',
        className
      )}
      aria-label={copied ? 'Link copied to clipboard' : 'Share this page'}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
