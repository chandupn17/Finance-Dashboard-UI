import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ListChecks, Wallet } from 'lucide-react';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { useFinanceStore } from '../../store/useFinanceStore';
import { animateNumber, formatCurrency } from '../../utils/helpers';
import { SensitiveText } from '../ui/SensitiveText';
import { TrendBadge } from './TrendBadge';
import { sumWindow } from './summaryMetrics';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function SummaryCards({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);
  const now = useMemo(() => new Date(), []);
  const curStart = startOfMonth(now);
  const curEnd = endOfMonth(now);
  const prevStart = startOfMonth(subMonths(now, 1));
  const prevEnd = endOfMonth(subMonths(now, 1));

  const cur = useMemo(
    () => sumWindow(transactions, curStart, curEnd),
    [transactions, curStart, curEnd]
  );
  const prev = useMemo(
    () => sumWindow(transactions, prevStart, prevEnd),
    [transactions, prevStart, prevEnd]
  );

  const all = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return {
      income,
      expense,
      balance: income - expense,
      count: transactions.length,
    };
  }, [transactions]);

  const [balDisp, setBalDisp] = useState(0);
  const [incDisp, setIncDisp] = useState(0);
  const [expDisp, setExpDisp] = useState(0);
  const [cntDisp, setCntDisp] = useState(0);

  useEffect(() => {
    if (loading) return undefined;
    const c1 = animateNumber(all.balance, 900, setBalDisp);
    const c2 = animateNumber(all.income, 900, setIncDisp);
    const c3 = animateNumber(all.expense, 900, setExpDisp);
    const c4 = animateNumber(all.count, 700, setCntDisp);
    return () => {
      c1();
      c2();
      c3();
      c4();
    };
  }, [loading, all.balance, all.income, all.expense, all.count]);

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(balDisp),
      icon: Wallet,
      accent: 'from-sky-600 to-cyan-600',
      trend: <TrendBadge current={cur.balance} previous={prev.balance} />,
    },
    {
      title: 'Total Income',
      value: formatCurrency(incDisp),
      icon: ArrowUpRight,
      accent: 'from-emerald-500 to-teal-600',
      trend: <TrendBadge current={cur.income} previous={prev.income} />,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(expDisp),
      icon: ArrowDownRight,
      accent: 'from-rose-500 to-orange-500',
      trend: <TrendBadge current={cur.expense} previous={prev.expense} invert />,
    },
    {
      title: 'Transaction Count',
      value: Math.round(cntDisp).toString(),
      icon: ListChecks,
      accent: 'from-cyan-500 to-teal-600',
      trend: <TrendBadge current={cur.count} previous={prev.count} />,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="group rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-surface-dark-muted"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{c.title}</p>
              <SensitiveText as="p" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {c.value}
              </SensitiveText>
              <div className="mt-2">{c.trend}</div>
            </div>
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-inner ${c.accent}`}
            >
              <c.icon className="h-6 w-6" aria-hidden />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

SummaryCards.propTypes = {
  loading: PropTypes.bool.isRequired,
};
