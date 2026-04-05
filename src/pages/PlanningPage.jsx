import { useOutletContext } from 'react-router-dom';
import { BudgetTracker } from '../components/planning/BudgetTracker';
import { CashFlowForecast } from '../components/planning/CashFlowForecast';
import { SavingsGoalsPanel } from '../components/planning/SavingsGoalsPanel';

/**
 * Planning: budgets, goals, and forward-looking cash flow (demo).
 */
export function PlanningPage() {
  const { dataReady } = useOutletContext();
  const loading = !dataReady;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Planning studio</h1>
        <p className="mt-1 max-w-2xl text-slate-600 dark:text-slate-400">
          Set guardrails, watch burn against caps, and stress-test the next few months with a simple
          projection — everything stays on-device in this demo.
        </p>
      </div>
      <div className="grid gap-8 xl:grid-cols-2">
        <BudgetTracker loading={loading} />
        <SavingsGoalsPanel loading={loading} />
      </div>
      <CashFlowForecast loading={loading} />
    </div>
  );
}
