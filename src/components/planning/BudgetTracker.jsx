import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { useFinanceStore } from '../../store/useFinanceStore';
import { expenseByCategoryInMonth, formatCurrency } from '../../utils/helpers';
import { SensitiveText } from '../ui/SensitiveText';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function BudgetTracker({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);
  const budgets = useFinanceStore((s) => s.budgets);
  const role = useFinanceStore((s) => s.role);
  const upsertBudget = useFinanceStore((s) => s.upsertBudget);
  const removeBudget = useFinanceStore((s) => s.removeBudget);

  const monthKey = format(new Date(), 'yyyy-MM');
  const spentMap = useMemo(
    () => expenseByCategoryInMonth(transactions, monthKey),
    [transactions, monthKey]
  );

  const isAdmin = role === 'admin';

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />
        ))}
      </div>
    );
  }

  const overCount = budgets.filter((b) => (spentMap.get(b.category) || 0) > b.monthlyLimit).length;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Category budgets</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Spend vs monthly cap for <span className="font-medium text-slate-700 dark:text-slate-300">{monthKey}</span>
          </p>
        </div>
        {overCount > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            {overCount} over cap
          </span>
        ) : (
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">On track</span>
        )}
      </div>

      <ul className="mt-5 space-y-4">
        {budgets.map((b) => {
          const spent = spentMap.get(b.category) || 0;
          const pct = b.monthlyLimit > 0 ? Math.min(100, (spent / b.monthlyLimit) * 100) : 0;
          const over = spent > b.monthlyLimit;
          return (
            <li key={b.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{b.category}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  <SensitiveText>
                    <span className={over ? 'font-semibold text-rose-600 dark:text-rose-400' : ''}>
                      {formatCurrency(spent)} / {formatCurrency(b.monthlyLimit)}
                    </span>
                  </SensitiveText>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    over
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500'
                      : 'bg-gradient-to-r from-sky-500 to-cyan-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {isAdmin ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`cap-${b.id}`}>
                    Adjust cap for {b.category}
                  </label>
                  <input
                    id={`cap-${b.id}`}
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={Math.round(b.monthlyLimit)}
                    className="w-28 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
                    onBlur={(e) => {
                      const n = parseFloat(e.target.value);
                      if (Number.isFinite(n) && n > 0) upsertBudget(b.category, n);
                    }}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                    onClick={() => removeBudget(b.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Remove
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {isAdmin ? (
        <form
          className="mt-6 flex flex-col gap-2 rounded-xl border border-dashed border-slate-200 p-3 dark:border-slate-600 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const cat = String(fd.get('category') || '');
            const cap = parseFloat(String(fd.get('cap') || ''));
            if (cat && Number.isFinite(cap) && cap > 0) {
              upsertBudget(cat, cap);
              e.currentTarget.reset();
            }
          }}
        >
          <div className="flex-1">
            <label htmlFor="new-bud-cat" className="text-xs font-semibold uppercase text-slate-500">
              Category
            </label>
            <select
              id="new-bud-cat"
              name="category"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Choose…
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-32">
            <label htmlFor="new-bud-cap" className="text-xs font-semibold uppercase text-slate-500">
              Monthly cap
            </label>
            <input
              id="new-bud-cap"
              name="cap"
              type="number"
              min="1"
              step="1"
              placeholder="500"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            Add / update
          </button>
        </form>
      ) : (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
          Switch to admin role in the header to edit budgets.
        </p>
      )}
    </div>
  );
}

BudgetTracker.propTypes = {
  loading: PropTypes.bool.isRequired,
};
