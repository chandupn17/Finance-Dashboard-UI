import { useOutletContext } from 'react-router-dom';
import { InsightsPanel } from '../components/insights/InsightsPanel';

/**
 * Insights route: derived stats and comparison chart.
 */
export function InsightsPage() {
  const { dataReady } = useOutletContext();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insights</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Intelligent-style summaries: category extremes, peak months, ratios, and monthly comparisons
          (mock data only).
        </p>
      </div>
      <InsightsPanel loading={!dataReady} />
    </div>
  );
}
