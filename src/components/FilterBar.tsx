import { Search } from 'lucide-react';
import type { ReadingStatus, SortOption, StatusFilter } from '../interfaces/Book';
import { READING_STATUSES, STATUS_LABELS } from '../interfaces/Book';

interface FilterBarProps {
  statusFilter: StatusFilter;
  searchTerm: string;
  sortOption: SortOption;
  counts: Record<StatusFilter, number>;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (term: string) => void;
  onSortChange: (sort: SortOption) => void;
}

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'tumu', label: 'Tümü' },
  ...READING_STATUSES.map((status: ReadingStatus) => ({ value: status, label: STATUS_LABELS[status] })),
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'En yeni eklenen' },
  { value: 'oldest', label: 'En eski eklenen' },
  { value: 'title', label: 'Başlığa göre (A-Z)' },
  { value: 'rating', label: 'Puana göre' },
];

// Durum filtresi, arama kutusu ve sıralama seçimini içeren çubuk
function FilterBar({
  statusFilter,
  searchTerm,
  sortOption,
  counts,
  onStatusChange,
  onSearchChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Duruma göre filtrele">
        {FILTER_OPTIONS.map(({ value, label }) => {
          const isActive = statusFilter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onStatusChange(value)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-950/60 text-slate-500'
                }`}
              >
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Başlık veya yazar ara..."
            aria-label="Başlık veya yazar ara"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-slate-200 placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        <select
          value={sortOption}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          aria-label="Sıralama"
          className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 sm:w-56"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
