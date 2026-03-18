import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Simple breadcrumb trail.
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Analytics', href: '/analytics' },
 *     { label: 'Dynasty Power Index' },   // last item — no href, rendered as current page
 *   ]} />
 *
 * Renders:  Home › Analytics › Dynasty Power Index
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className="flex flex-wrap items-center gap-1 text-xs text-slate-500"
        role="list"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {/* Separator — skip for first item */}
              {index > 0 && (
                <span className="select-none text-slate-600" aria-hidden="true">
                  &rsaquo;
                </span>
              )}

              {/* Linked item */}
              {!isLast && item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-slate-300 transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ) : isLast ? (
                /* Current page — gold, not linked */
                <span
                  className="font-medium text-[#ffd700]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                /* Item without href that isn't last — plain text */
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
