import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../utils/helpers';

/**
 * @param {Object} props
 * @param {{ label: string, income: number, expense: number }[]} props.data
 * @param {boolean} props.loading
 */
export function MonthlyComparisonBar({ data, loading }) {
  if (loading) {
    return (
      <div className="h-80 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Monthly comparison
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Income vs expense by calendar month
      </p>
      {data.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500">Not enough data for a chart.</p>
      ) : (
        <div className="mt-4 h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800">
                      <p className="font-medium text-slate-900 dark:text-white">{label}</p>
                      {payload.map((p) => (
                        <p
                          key={p.dataKey}
                          className={
                            p.dataKey === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {p.name}: {formatCurrency(Number(p.value))}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

MonthlyComparisonBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      income: PropTypes.number.isRequired,
      expense: PropTypes.number.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};
