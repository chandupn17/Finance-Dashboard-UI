import PropTypes from 'prop-types';
import { CATEGORIES } from '../../data/mockData';

/**
 * @param {Object} props
 * @param {{ search: string, category: string, type: string, dateRange: string, tag: string }} props.filters
 * @param {string[]} [props.tagOptions]
 * @param {(key: string, value: string) => void} props.onChange
 * @param {() => void} props.onReset
 */
export function TransactionFilters({ filters, onChange, onReset, tagOptions = [] }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <div className="sm:col-span-2 xl:col-span-2">
            <label htmlFor="flt-search" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Search
            </label>
            <input
              id="flt-search"
              type="search"
              placeholder="Description…"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={filters.search}
              onChange={(e) => onChange('search', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="flt-cat" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Category
            </label>
            <select
              id="flt-cat"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={filters.category}
              onChange={(e) => onChange('category', e.target.value)}
            >
              <option value="">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="flt-type" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Type
            </label>
            <select
              id="flt-type"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={filters.type}
              onChange={(e) => onChange('type', e.target.value)}
            >
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label htmlFor="flt-tag" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Tag
            </label>
            <select
              id="flt-tag"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={filters.tag}
              onChange={(e) => onChange('tag', e.target.value)}
            >
              <option value="">All tags</option>
              {tagOptions.map((t) => (
                <option key={t} value={t.toLowerCase()}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="flt-range" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Date range
            </label>
            <select
              id="flt-range"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={filters.dateRange}
              onChange={(e) => onChange('dateRange', e.target.value)}
            >
              <option value="1">This month</option>
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={onReset}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}

TransactionFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    dateRange: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  tagOptions: PropTypes.arrayOf(PropTypes.string),
};
