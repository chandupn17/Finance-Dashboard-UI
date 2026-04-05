import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { computeRecurringHints, formatCurrency, formatDisplayDate } from '../../utils/helpers';
import { SensitiveText } from '../ui/SensitiveText';

/**
 * Surfaces repeating descriptions as “likely recurring” items.
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function RecurringHints({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);
  const rows = useMemo(() => computeRecurringHints(transactions), [transactions]);

  if (loading) {
    return <div className="h-36 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />;
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Likely recurring items</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Grouped by matching description and category — useful for subscriptions, payroll, and rent patterns.
      </p>
      <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
        {rows.map((r) => (
          <li key={`${r.description}-${r.category}-${r.type}`} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white">{r.description}</p>
              <p className="text-xs text-slate-500">
                {r.category} · {r.type} · {r.count}× · last {formatDisplayDate(r.lastDate)}
              </p>
            </div>
            <SensitiveText as="p" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {formatCurrency(r.totalAmount)} total
            </SensitiveText>
          </li>
        ))}
      </ul>
    </div>
  );
}

RecurringHints.propTypes = {
  loading: PropTypes.bool.isRequired,
};
