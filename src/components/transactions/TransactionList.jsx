import PropTypes from 'prop-types';
import { Inbox } from 'lucide-react';
import { TransactionRow } from './TransactionRow';
import { SortableTh } from './SortableTh';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 * @param {import('../../data/mockData.js').mockTransactions[number][]} props.rows
 * @param {boolean} props.isAdmin
 * @param {{ key: 'date' | 'amount' | 'category', dir: 'asc' | 'desc' }} props.sort
 * @param {(k: string) => void} props.onSort
 * @param {(tx: import('../../data/mockData.js').mockTransactions[number]) => void} props.onEdit
 * @param {(tx: import('../../data/mockData.js').mockTransactions[number]) => void} props.onDelete
 * @param {boolean} [props.selectionEnabled]
 * @param {string[]} [props.selectedIds]
 * @param {(id: string) => void} [props.onToggleSelect]
 * @param {() => void} [props.onSelectAllVisible]
 * @param {boolean} [props.allVisibleSelected]
 */
export function TransactionList({
  loading,
  rows,
  isAdmin,
  sort,
  onSort,
  onEdit,
  onDelete,
  selectionEnabled = false,
  selectedIds = [],
  onToggleSelect,
  onSelectAllVisible,
  allVisibleSelected = false,
}) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-700 dark:bg-surface-dark-muted">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-700/80" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/80 py-16 text-center dark:border-slate-600 dark:bg-slate-800/40">
        <Inbox className="h-14 w-14 text-slate-300 dark:text-slate-600" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          No transactions match
        </p>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Try clearing filters or widening the date range. You can also add a transaction as an admin.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50/80 dark:bg-slate-800/50">
          <tr>
            {selectionEnabled ? (
              <th scope="col" className="w-10 px-2 py-3 sm:px-3">
                <span className="sr-only">Select</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800"
                  checked={allVisibleSelected}
                  onChange={onSelectAllVisible}
                  aria-label="Select all visible rows"
                />
              </th>
            ) : null}
            <SortableTh columnKey="date" label="Date" sort={sort} onSort={onSort} />
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 sm:px-4"
            >
              Description
            </th>
            <SortableTh columnKey="category" label="Category" sort={sort} onSort={onSort} />
            <th
              scope="col"
              className="hidden px-3 py-3 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 sm:table-cell sm:px-4"
            >
              Tags
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 sm:px-4"
            >
              Type
            </th>
            <SortableTh
              columnKey="amount"
              label="Amount"
              sort={sort}
              onSort={onSort}
              alignRight
            />
            {isAdmin ? (
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 sm:px-4"
              >
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              isAdmin={isAdmin}
              onEdit={() => onEdit(tx)}
              onDelete={() => onDelete(tx)}
              selectionEnabled={selectionEnabled}
              selected={selectedIds.includes(tx.id)}
              onToggleSelect={() => onToggleSelect?.(tx.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

TransactionList.propTypes = {
  loading: PropTypes.bool.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  sort: PropTypes.shape({
    key: PropTypes.oneOf(['date', 'amount', 'category']).isRequired,
    dir: PropTypes.oneOf(['asc', 'desc']).isRequired,
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectionEnabled: PropTypes.bool,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  onToggleSelect: PropTypes.func,
  onSelectAllVisible: PropTypes.func,
  allVisibleSelected: PropTypes.bool,
};
