import { useState, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  defaultSortKey?: keyof T;
  defaultSortDir?: 'asc' | 'desc';
  filterPlaceholder?: string;
  filterKeys?: (keyof T)[];
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
}

type SortDir = 'asc' | 'desc';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function compareValues(a: unknown, b: unknown, dir: SortDir): number {
  let result = 0;
  if (a === null || a === undefined) result = -1;
  else if (b === null || b === undefined) result = 1;
  else if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  } else {
    result = String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
  }
  return dir === 'asc' ? result : -result;
}

function getAlignClass(align?: 'left' | 'center' | 'right'): string {
  if (align === 'center') return 'text-center';
  if (align === 'right')  return 'text-right';
  return 'text-left';
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />;
  }
  return dir === 'asc'
    ? <ChevronUp   className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
    : <ChevronDown className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DataTable<T extends object>({
  columns,
  data,
  defaultSortKey,
  defaultSortDir = 'asc',
  filterPlaceholder = 'Filter…',
  filterKeys,
  pageSize = 25,
  className,
  emptyMessage = 'No results found.',
}: DataTableProps<T>) {
  const [sortKey, setSortKey]     = useState<keyof T | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir]     = useState<SortDir>(defaultSortDir);
  const [filterText, setFilterText] = useState('');
  const [page, setPage]           = useState(0);

  // ── Derived: filtered + sorted + paged data ──────────────────────────────

  const filtered = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return data;

    const keys = filterKeys && filterKeys.length > 0 ? filterKeys : (columns.map(c => c.key) as (keyof T)[]);

    return data.filter(row =>
      keys.some(k => {
        const val = row[k];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, filterText, filterKeys, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => compareValues(a[sortKey], b[sortKey], sortDir));
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage   = Math.min(page, totalPages - 1);

  const paged = useMemo(() => {
    const start = safePage * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage, pageSize]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSort = useCallback((key: keyof T) => {
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        return key;
      }
      setSortDir('asc');
      return key;
    });
    setPage(0);
  }, []);

  const handleFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
    setPage(0);
  }, []);

  // ── Pagination labels ────────────────────────────────────────────────────

  const showFrom = sorted.length === 0 ? 0 : safePage * pageSize + 1;
  const showTo   = Math.min(safePage * pageSize + pageSize, sorted.length);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={cn('flex flex-col gap-3', className)}>

      {/* Filter input */}
      <div className="flex items-center">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={filterText}
            onChange={handleFilter}
            placeholder={filterPlaceholder}
            aria-label="Filter table"
            className={cn(
              'w-full rounded-lg px-3 py-2 text-sm',
              'bg-[#16213e] border border-[#2d4a66]',
              'text-slate-200 placeholder-slate-500',
              'focus:outline-none focus:border-[#3a5f80] focus:ring-1 focus:ring-[#3a5f80]',
              'transition-colors duration-150'
            )}
          />
        </div>
        {filterText && (
          <span className="ml-3 text-xs text-slate-500">
            {sorted.length} result{sorted.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table wrapper — horizontal scroll on mobile */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#2d4a66]">
        <table className="min-w-full text-sm" aria-label="Data table">

          {/* Column widths */}
          <colgroup>
            {columns.map((col, i) => (
              <col key={i} className={col.width} />
            ))}
          </colgroup>

          {/* Header */}
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              {columns.map((col, i) => {
                const isActive = sortKey === col.key;
                const isSortable = col.sortable !== false && col.sortable !== undefined ? col.sortable : false;

                return (
                  <th
                    key={i}
                    scope="col"
                    onClick={isSortable ? () => handleSort(col.key) : undefined}
                    aria-sort={
                      isActive
                        ? sortDir === 'asc' ? 'ascending' : 'descending'
                        : undefined
                    }
                    className={cn(
                      'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400',
                      getAlignClass(col.align),
                      isSortable && 'cursor-pointer select-none hover:text-slate-200 transition-colors duration-100',
                      isActive && 'text-[#ffd700]',
                      // Sticky first column on mobile
                      i === 0 && 'sticky left-0 z-10 bg-[#0f2744]'
                    )}
                  >
                    <span className={cn('inline-flex items-center gap-1', col.align === 'right' ? 'flex-row-reverse' : '')}>
                      {col.label}
                      {isSortable && <SortIcon active={isActive} dir={sortDir} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#1e3347]">
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-500 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, rowIdx) => {
                const isEven = rowIdx % 2 === 0;
                return (
                  <tr
                    key={rowIdx}
                    className={cn(
                      'transition-colors duration-100 hover:bg-[#1f3550]',
                      isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                    )}
                  >
                    {columns.map((col, colIdx) => {
                      const rawValue = row[col.key];
                      const cell = col.render
                        ? col.render(rawValue, row)
                        : (rawValue !== null && rawValue !== undefined ? String(rawValue) : '—');

                      return (
                        <td
                          key={colIdx}
                          className={cn(
                            'px-4 py-3 text-slate-300',
                            getAlignClass(col.align),
                            // Sticky first column on mobile
                            colIdx === 0 && cn(
                              'sticky left-0 z-10 font-semibold text-white',
                              isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                            )
                          )}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sorted.length > pageSize && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 tabular-nums">
            Showing {showFrom}–{showTo} of {sorted.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Previous page"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium',
                'border border-[#2d4a66] transition-colors duration-100',
                safePage === 0
                  ? 'text-slate-600 bg-[#16213e] cursor-not-allowed'
                  : 'text-slate-300 bg-[#16213e] hover:bg-[#1f3550] hover:border-[#3a5f80] cursor-pointer'
              )}
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Prev
            </button>

            <span className="px-2 text-xs text-slate-500 tabular-nums">
              {safePage + 1} / {totalPages}
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              aria-label="Next page"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium',
                'border border-[#2d4a66] transition-colors duration-100',
                safePage >= totalPages - 1
                  ? 'text-slate-600 bg-[#16213e] cursor-not-allowed'
                  : 'text-slate-300 bg-[#16213e] hover:bg-[#1f3550] hover:border-[#3a5f80] cursor-pointer'
              )}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Showing X-Y of Z when NOT paginated (just showing count) */}
      {sorted.length > 0 && sorted.length <= pageSize && (
        <p className="text-xs text-slate-600 tabular-nums">
          Showing {sorted.length} of {data.length} rows
        </p>
      )}
    </div>
  );
}
