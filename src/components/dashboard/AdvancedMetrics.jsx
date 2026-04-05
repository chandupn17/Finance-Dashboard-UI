import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Gauge, Hourglass, Percent, Wallet } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { computeCashFlowForecast, expenseByCategoryInMonth, formatCurrency } from '../../utils/helpers';
import { SensitiveText } from '../ui/SensitiveText';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function AdvancedMetrics({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);
  const budgets = useFinanceStore((s) => s.budgets);

  const data = useMemo(() => {
    const f = computeCashFlowForecast(transactions, 1);
    const avgExp = f.avgMonthlyExpense;
    const avgInc = f.avgMonthlyIncome;
    const bal = f.currentBalance;
    const runway = avgExp > 0 && bal > 0 ? bal / avgExp : null;
    const savingsRate = avgInc > 0 ? ((avgInc - avgExp) / avgInc) * 100 : null;
    const mk = format(new Date(), 'yyyy-MM');
    const spent = expenseByCategoryInMonth(transactions, mk);
    const over = budgets.filter((b) => (spent.get(b.category) || 0) > b.monthlyLimit).length;
    return {
      runway,
      savingsRate,
      over,
      totalCaps: budgets.length,
      net: f.monthlyNet,
    };
  }, [transactions, budgets]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Runway vs spend',
      icon: Hourglass,
      accent: 'from-amber-500 to-orange-600',
      value:
        data.runway == null
          ? '—'
          : `${data.runway >= 99 ? '99+' : data.runway.toFixed(1)} mo`,
      subtitle: 'Balance ÷ trailing 3-mo avg expenses',
    },
    {
      title: 'Savings rate',
      icon: Percent,
      accent: 'from-emerald-500 to-teal-600',
      value: data.savingsRate == null ? '—' : `${data.savingsRate.toFixed(1)}%`,
      subtitle: 'Share of avg income left after avg spend',
    },
    {
      title: 'Avg monthly net',
      icon: Wallet,
      accent: 'from-sky-500 to-indigo-600',
      value: formatCurrency(data.net),
      subtitle: 'Income minus expenses (recent pattern)',
    },
    {
      title: 'Budget pressure',
      icon: Gauge,
      accent: 'from-fuchsia-500 to-violet-600',
      value: data.totalCaps ? `${data.over}/${data.totalCaps}` : '—',
      subtitle: 'Categories over cap this month',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Advanced signals</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Heuristic KPIs for runway, savings rate, and how many budget lines are stressed right now.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {c.title}
                </p>
                <SensitiveText as="p" className="mt-2 truncate text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {c.value}
                </SensitiveText>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{c.subtitle}</p>
              </div>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-inner ${c.accent}`}
              >
                <c.icon className="h-5 w-5" aria-hidden />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

AdvancedMetrics.propTypes = {
  loading: PropTypes.bool.isRequired,
};
