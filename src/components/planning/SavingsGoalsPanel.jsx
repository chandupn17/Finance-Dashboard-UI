import PropTypes from 'prop-types';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { PiggyBank, Plus, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency, formatDisplayDate } from '../../utils/helpers';
import { SensitiveText } from '../ui/SensitiveText';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function SavingsGoalsPanel({ loading }) {
  const goals = useFinanceStore((s) => s.savingsGoals);
  const role = useFinanceStore((s) => s.role);
  const addSavingsGoal = useFinanceStore((s) => s.addSavingsGoal);
  const removeSavingsGoal = useFinanceStore((s) => s.removeSavingsGoal);
  const contributeToGoal = useFinanceStore((s) => s.contributeToGoal);
  const [contrib, setContrib] = useState(/** @type {Record<string, string>} */ ({}));

  const isAdmin = role === 'admin';

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md">
          <PiggyBank className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Savings goals</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track targets and log contributions (demo balances — not tied to bank sync).
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {goals.map((g) => {
          const pct = g.targetAmount > 0 ? Math.min(100, (g.savedAmount / g.targetAmount) * 100) : 0;
          let daysLeft = null;
          try {
            const end = parseISO(g.deadline);
            const diff = Math.ceil((end.getTime() - Date.now()) / 86400000);
            daysLeft = diff;
          } catch {
            daysLeft = null;
          }
          return (
            <li
              key={g.id}
              className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-600 dark:bg-slate-800/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{g.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Due {formatDisplayDate(g.deadline)}
                    {daysLeft !== null && daysLeft >= 0 ? (
                      <span className="text-slate-400"> · {daysLeft}d left</span>
                    ) : null}
                  </p>
                </div>
                {isAdmin ? (
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700"
                    aria-label={`Remove ${g.name}`}
                    onClick={() => removeSavingsGoal(g.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                <SensitiveText>
                  <span>
                    {formatCurrency(g.savedAmount)} of {formatCurrency(g.targetAmount)}
                  </span>
                </SensitiveText>
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white dark:bg-slate-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {isAdmin ? (
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Add amount"
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
                    value={contrib[g.id] ?? ''}
                    onChange={(e) => setContrib((c) => ({ ...c, [g.id]: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-violet-600"
                    onClick={() => {
                      const n = parseFloat(contrib[g.id] || '');
                      if (Number.isFinite(n) && n > 0) {
                        contributeToGoal(g.id, n);
                        setContrib((c) => ({ ...c, [g.id]: '' }));
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {isAdmin ? (
        <form
          className="mt-6 flex flex-col gap-3 rounded-xl border border-dashed border-slate-200 p-3 dark:border-slate-600 lg:flex-row lg:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get('name') || '');
            const target = parseFloat(String(fd.get('target') || ''));
            const deadline = String(fd.get('deadline') || '');
            addSavingsGoal(name, target, deadline);
            e.currentTarget.reset();
          }}
        >
          <div className="flex-1 lg:max-w-xs">
            <label htmlFor="goal-name" className="text-xs font-semibold uppercase text-slate-500">
              Goal name
            </label>
            <input
              id="goal-name"
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div className="w-full lg:w-36">
            <label htmlFor="goal-target" className="text-xs font-semibold uppercase text-slate-500">
              Target
            </label>
            <input
              id="goal-target"
              name="target"
              type="number"
              min="1"
              step="1"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div className="w-full lg:w-44">
            <label htmlFor="goal-deadline" className="text-xs font-semibold uppercase text-slate-500">
              Deadline
            </label>
            <input
              id="goal-deadline"
              name="deadline"
              type="date"
              required
              min={format(new Date(), 'yyyy-MM-dd')}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New goal
          </button>
        </form>
      ) : (
        <p className="mt-4 text-xs text-slate-500">Admins can create goals and log contributions.</p>
      )}
    </div>
  );
}

SavingsGoalsPanel.propTypes = {
  loading: PropTypes.bool.isRequired,
};
