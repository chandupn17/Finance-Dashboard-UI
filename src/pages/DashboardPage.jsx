import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Orbit, Target, Wallet } from 'lucide-react';
import { AdvancedMetrics } from '../components/dashboard/AdvancedMetrics';
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
        <nav
          className="mt-4 flex flex-wrap gap-2"
          aria-label="Quick navigation"
        >
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40"
          >
            <Wallet className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" aria-hidden />
            Ledger
            <ArrowRight className="h-3 w-3 opacity-50" aria-hidden />
          </Link>
          <Link
            to="/planning"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40"
          >
            <Target className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden />
            Planning
            <ArrowRight className="h-3 w-3 opacity-50" aria-hidden />
          </Link>
          <Link
            to="/pulse"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40"
          >
            <Orbit className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" aria-hidden />
            Pulse
            <ArrowRight className="h-3 w-3 opacity-50" aria-hidden />
          </Link>
        </nav>
      </div>
      <SummaryCards loading={loading} />
      <AdvancedMetrics loading={loading} />
      <div className="grid gap-8 xl:grid-cols-2">
        <BalanceTrendChart loading={loading} />
        <SpendingBreakdownChart loading={loading} />
      </div>
    </div>
  );
}
