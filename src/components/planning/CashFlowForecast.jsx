import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';
import { computeCashFlowForecast, formatCurrency } from '../../utils/helpers';
import { SensitiveText } from '../ui/SensitiveText';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function CashFlowForecast({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);
  const privacy = useFinanceStore((s) => s.privacyMode);

  const { chartData, note } = useMemo(() => {
    const f = computeCashFlowForecast(transactions, 5);
    const cur = {
      key: 'now',
      label: 'Today',
      projectedBalance: f.currentBalance,
      kind: 'actual',
    };
    const pts = [cur, ...f.projected.map((p) => ({ ...p, kind: 'projected' }))];
    return {
      chartData: pts,
      note: `Trailing 3-month average: ${formatCurrency(f.avgMonthlyIncome)} in · ${formatCurrency(f.avgMonthlyExpense)} out (${formatCurrency(f.monthlyNet)} net / mo).`,
    };
  }, [transactions]);

  if (loading) {
    return <div className="h-80 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />;
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cash flow outlook</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Projected balance if recent income and spending patterns continue (illustrative only).
      </p>
      <SensitiveText as="p" className="mt-2 text-xs text-slate-500 dark:text-slate-500">
        {note}
      </SensitiveText>
      <div className="mt-4 h-72 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload;
                const v = row.projectedBalance;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800">
                    <p className="font-medium text-slate-900 dark:text-white">{row.label}</p>
                    <p className="text-sky-600 dark:text-sky-300">
                      {privacy ? '••••' : `Balance: ${formatCurrency(v)}`}
                    </p>
                    {row.kind === 'projected' ? (
                      <p className="text-xs text-slate-500">Projected</p>
                    ) : (
                      <p className="text-xs text-slate-500">Current ledger balance</p>
                    )}
                  </div>
                );
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="projectedBalance"
              name="Balance"
              stroke="#0d9488"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

CashFlowForecast.propTypes = {
  loading: PropTypes.bool.isRequired,
};
