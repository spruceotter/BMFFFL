import { cn } from '@/lib/cn';

// ─── Tooltip ──────────────────────────────────────────────────────────────────
//
// A pure-CSS tooltip wrapper. Hover the child element to reveal a floating
// explanation above it. No JS required — visibility is driven entirely by the
// CSS :hover / group-hover mechanism via Tailwind.
//
// Usage:
//   <Tooltip tip="Dynasty Power Index combines wins (40%), playoff success (30%)...">
//     <span>94.2</span>
//   </Tooltip>
//
// The component renders a wrapping <span> with `position: relative` and
// injects the tooltip text as a pseudo-element via a `data-tip` attribute.
// Because Tailwind cannot target arbitrary `data-*` attribute content in CSS,
// we use a sibling <span> approach with group-hover instead.

interface TooltipProps {
  tip: string;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({ tip, children, className }: TooltipProps) {
  return (
    <span
      className={cn('relative inline-flex items-center group cursor-help', className)}
      tabIndex={0}
      aria-describedby={undefined}
    >
      {/* Trigger content */}
      {children}

      {/* Tooltip bubble — shown on group hover or focus-within */}
      <span
        role="tooltip"
        className={cn(
          // Positioning: above the trigger, centred
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
          // Sizing & shape
          'w-max max-w-[260px] rounded-lg px-3 py-2',
          // Colours
          'bg-[#0d1b2a] border border-[#2d4a66] text-white text-xs leading-relaxed',
          // Shadow
          'shadow-xl shadow-black/40',
          // Visibility — hidden by default, revealed on hover/focus
          'pointer-events-none opacity-0 scale-95',
          'transition-all duration-150 ease-out',
          'group-hover:opacity-100 group-hover:scale-100',
          'group-focus-within:opacity-100 group-focus-within:scale-100'
        )}
      >
        {tip}
        {/* Downward-pointing arrow */}
        <span
          aria-hidden="true"
          className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[#2d4a66]"
        />
      </span>
    </span>
  );
}
