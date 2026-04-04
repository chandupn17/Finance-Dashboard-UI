import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/helpers';

const COLORS = [
  '#0284c7',
  '#06b6d4',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
];

const LEGEND_DOT_CLASS = [
  'bg-sky-600',
  'bg-cyan-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-emerald-500',
  'bg-teal-500',
];

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function SpendingBreakdownChart({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);

  const { rows, total } = useMemo(() => {
    const map = new Map();
    let sum = 0;
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
      sum += t.amount;
    }
    const list = [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    return { rows: list, total: sum };
  }, [transactions]);

  const withPct = useMemo(
    () =>
      total <= 0
        ? []
        : rows.map((r) => ({
            ...r,
            pct: (r.value / total) * 100,
          })),
    [rows, total]
  );

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Spending breakdown
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Expenses by category (all time)
      </p>
      {total <= 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No expense data to chart yet.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="h-64 w-full min-w-0 lg:h-72 lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={withPct}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {withPct.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800">
                        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-rose-600 dark:text-rose-400">
                          {formatCurrency(p.value)} ({p.pct.toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-1 flex-col gap-2 text-sm">
            {withPct.map((r, i) => (
              <li
                key={r.name}
                className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-700"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${LEGEND_DOT_CLASS[i % LEGEND_DOT_CLASS.length]}`}
                  />
                  <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                    {r.name}
                  </span>
                </span>
                <span className="shrink-0 text-slate-600 dark:text-slate-300">
                  {r.pct.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

SpendingBreakdownChart.propTypes = {
  loading: PropTypes.bool.isRequired,
};
