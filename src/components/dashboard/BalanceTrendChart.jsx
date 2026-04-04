import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { parseISO } from 'date-fns';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency, lastNMonthKeys, shortMonthLabel } from '../../utils/helpers';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function BalanceTrendChart({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);

  const data = useMemo(() => {
    const anchor = new Date();
    const keys = lastNMonthKeys(anchor, 6);
    const netByKey = Object.fromEntries(keys.map((k) => [k, 0]));
    for (const t of transactions) {
      const d = parseISO(t.date);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!(k in netByKey)) continue;
      netByKey[k] += t.type === 'income' ? t.amount : -t.amount;
    }
    return keys.map((k) => ({
      key: k,
      label: shortMonthLabel(k),
      balance: netByKey[k],
    }));
  }, [transactions]);

  if (loading) {
    return (
      <div className="h-80 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Balance trend</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Net cash flow per month (last 6 months)
      </p>
      <div className="mt-4 h-72 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800">
                    <p className="font-medium text-slate-900 dark:text-white">{row.label}</p>
                    <p className="text-sky-600 dark:text-sky-300">
                      Net: {formatCurrency(row.balance)}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#0284c7"
              strokeWidth={2}
              fill="url(#balanceFill)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

BalanceTrendChart.propTypes = {
  loading: PropTypes.bool.isRequired,
};
