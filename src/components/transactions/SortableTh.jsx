import PropTypes from 'prop-types';
import { ArrowDown, ArrowUp } from 'lucide-react';

/**
 * @param {Object} props
 * @param {'date' | 'amount' | 'category'} props.columnKey
 * @param {string} props.label
 * @param {{ key: string, dir: 'asc' | 'desc' }} props.sort
 * @param {(k: string) => void} props.onSort
 * @param {boolean} [props.alignRight]
 */
export function SortableTh({ columnKey, label, sort, onSort, alignRight }) {
  const active = sort.key === columnKey;
  const align = alignRight ? 'text-right' : 'text-left';
  const btnAlign = alignRight ? 'justify-end w-full' : '';
  return (
    <th
      scope="col"
      className={`px-3 py-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 sm:px-4 ${align}`}
    >
      <button
        type="button"
        className={`inline-flex items-center gap-1 rounded-lg px-1 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 ${btnAlign}`}
        onClick={() => onSort(columnKey)}
      >
        {label}
        {active ? (
          sort.dir === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
          )
        ) : null}
      </button>
    </th>
  );
}

SortableTh.propTypes = {
  columnKey: PropTypes.oneOf(['date', 'amount', 'category']).isRequired,
  label: PropTypes.string.isRequired,
  sort: PropTypes.shape({
    key: PropTypes.string.isRequired,
    dir: PropTypes.oneOf(['asc', 'desc']).isRequired,
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  alignRight: PropTypes.bool,
};
