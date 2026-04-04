import { useOutletContext } from 'react-router-dom';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { BalanceTrendChart } from '../components/dashboard/BalanceTrendChart';
import { SpendingBreakdownChart } from '../components/dashboard/SpendingBreakdownChart';

/**
 * Dashboard route: summary KPIs and charts.
 */
export function DashboardPage() {
  const { dataReady } = useOutletContext();
  const loading = !dataReady;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Operations overview</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Balances, cash-flow trend, and spend mix — the kind of unified view Zorvyn describes for SMEs
          (this build is a local demo).
        </p>
      </div>
      <SummaryCards loading={loading} />
      <div className="grid gap-8 xl:grid-cols-2">
        <BalanceTrendChart loading={loading} />
        <SpendingBreakdownChart loading={loading} />
      </div>
    </div>
  );
}
