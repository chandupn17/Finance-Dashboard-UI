import { useOutletContext } from 'react-router-dom';
import { ModernPulsePanel } from '../components/pulse/ModernPulsePanel';

/**
 * Pulse: contemporary behavioral + subscription-aware analytics.
 */
export function PulsePage() {
  const { dataReady } = useOutletContext();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pulse</h1>
        <p className="mt-1 max-w-2xl text-slate-600 dark:text-slate-400">
          Signals tuned for how people actually spend now: discretionary mix, weekend cadence, category shocks, and
          subscription-shaped leakage — still 100% local in this build.
        </p>
      </div>
      <ModernPulsePanel loading={!dataReady} />
    </div>
  );
}
