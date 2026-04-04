import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/helpers';
import { computeInsights } from './insightsComputations';
import { InsightCard } from './InsightCard';
import { MonthlyComparisonBar } from './MonthlyComparisonBar';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function InsightsPanel({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);
  const data = useMemo(() => computeInsights(transactions), [transactions]);

  const top3Text =
    data.top3Freq.length === 0
      ? '—'
      : data.top3Freq.map((t) => `${t.name} (${t.count})`).join(', ');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />
          ))}
        </div>
        <MonthlyComparisonBar data={[]} loading />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InsightCard
          title="Highest spending category"
          value={formatCurrency(data.highestSpend.amount)}
          subtitle={data.highestSpend.name}
        />
        <InsightCard
          title="Lowest spending category"
          value={formatCurrency(data.lowestSpend.amount)}
          subtitle={data.lowestSpend.name}
        />
        <InsightCard
          title="Month with highest expenses"
          value={formatCurrency(data.maxExpMonth.amount)}
          subtitle={data.maxExpMonth.label}
        />
        <InsightCard
          title="Month with highest income"
          value={formatCurrency(data.maxIncMonth.amount)}
          subtitle={data.maxIncMonth.label}
        />
        <InsightCard
          title="Average monthly expense"
          value={formatCurrency(data.avgMonthlyExpense)}
          subtitle="Across months that appear in your data"
        />
        <InsightCard
          title="Income vs expense ratio"
          value={data.ratioLabel}
          subtitle="Total income divided by total expenses"
        />
      </div>
      <InsightCard
        title="Top 3 categories by transaction count"
        value={top3Text}
        subtitle="Most frequent category labels in your ledger"
      />
      <MonthlyComparisonBar data={data.barData} loading={false} />
    </div>
  );
}

InsightsPanel.propTypes = {
  loading: PropTypes.bool.isRequired,
};
