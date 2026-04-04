import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDisplayDate } from '../../utils/helpers';

/**
 * @param {Object} props
 * @param {import('../../data/mockData.js').mockTransactions[number]} props.transaction
 * @param {boolean} props.isAdmin
 * @param {() => void} [props.onEdit]
 * @param {() => void} [props.onDelete]
 */
export function TransactionRow({ transaction, isAdmin, onEdit, onDelete }) {
  const { date, description, category, type, amount } = transaction;
  const income = type === 'income';

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/50">
      <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-600 dark:text-slate-300 sm:px-4">
        {formatDisplayDate(date)}
      </td>
      <td className="max-w-[200px] px-3 py-3 text-sm font-medium text-slate-900 dark:text-white sm:max-w-xs sm:px-4">
        <span className="line-clamp-2">{description}</span>
      </td>
      <td className="px-3 py-3 sm:px-4">
        <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800 dark:bg-sky-500/20 dark:text-sky-100">
          {category}
        </span>
      </td>
      <td className="px-3 py-3 sm:px-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            income
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300'
          }`}
        >
          {income ? 'Income' : 'Expense'}
        </span>
      </td>
      <td
        className={`whitespace-nowrap px-3 py-3 text-right text-sm font-semibold sm:px-4 ${
          income ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        }`}
      >
        {income ? '+' : '−'}
        {formatCurrency(amount)}
      </td>
      {isAdmin ? (
        <td className="whitespace-nowrap px-3 py-3 text-right sm:px-4">
          <div className="inline-flex gap-1">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-slate-700 dark:hover:text-sky-300"
              aria-label={`Edit ${description}`}
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700 dark:hover:text-rose-400"
              aria-label={`Delete ${description}`}
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      ) : null}
    </tr>
  );
}

TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['income', 'expense']).isRequired,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
