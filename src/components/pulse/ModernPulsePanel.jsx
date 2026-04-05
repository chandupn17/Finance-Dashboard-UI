import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Activity, CalendarHeart, Radar, Scale, TrendingUp } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';
import {
  computeNeedsVsWants,
  computeSpendAnomalies,
  computeSubscriptionExposure,
  computeWeekendExpenseSplit,
  formatCurrency,
  shortMonthLabel,
} from '../../utils/helpers';
import { SensitiveText } from '../ui/SensitiveText';

const WANT_COLOR = '#d946ef';
const NEED_COLOR = '#0ea5e9';
const OTHER_COLOR = '#94a3b8';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 */
export function ModernPulsePanel({ loading }) {
  const transactions = useFinanceStore((s) => s.transactions);
  const privacy = useFinanceStore((s) => s.privacyMode);

  const nv = useMemo(() => computeNeedsVsWants(transactions), [transactions]);
  const anomalies = useMemo(() => computeSpendAnomalies(transactions), [transactions]);
  const weekend = useMemo(() => computeWeekendExpenseSplit(transactions, 4), [transactions]);
  const subs = useMemo(() => computeSubscriptionExposure(transactions), [transactions]);

  const pieData = useMemo(() => {
    const rows = [
      { name: 'Baseline needs', value: nv.needs, fill: NEED_COLOR },
      { name: 'Discretionary', value: nv.wants, fill: WANT_COLOR },
    ];
    if (nv.otherExpense > 0) {
      rows.push({ name: 'Other expense', value: nv.otherExpense, fill: OTHER_COLOR });
    }
    return rows.filter((r) => r.value > 0);
  }, [nv.needs, nv.wants, nv.otherExpense]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Needs vs discretionary</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A modern split: housing-style staples vs lifestyle spend (heuristic category map — tune rules in your
            own product).
          </p>
          {pieData.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No expense data.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="mx-auto h-52 w-52 shrink-0 sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={78}
                      paddingAngle={2}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => (privacy ? '••••' : formatCurrency(Number(value)))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex-1 space-y-2 text-sm">
                {pieData.map((r) => (
                  <li key={r.name} className="flex justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <span className="h-2 w-2 rounded-full" style={{ background: r.fill }} />
                      {r.name}
                    </span>
                    <SensitiveText as="span" className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(r.value)}
                    </SensitiveText>
                  </li>
                ))}
                <li className="flex justify-between border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-700">
                  <span>Discretionary share of spend</span>
                  <SensitiveText as="span" className="font-semibold text-slate-700 dark:text-slate-300">
                    {nv.expenseTotal > 0 ? `${nv.wantsSharePct.toFixed(1)}%` : '—'}
                  </SensitiveText>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
          <div className="flex items-center gap-2">
            <CalendarHeart className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Weekend rhythm</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Share of expenses on Sat–Sun over the last four months — a lightweight “social / impulse” pulse (not
            judgment, just signal).
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500">Weekend</p>
              <SensitiveText as="p" className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(weekend.weekend)}
              </SensitiveText>
              <p className="mt-1 text-xs text-slate-500">
                {weekend.total > 0 ? `${weekend.weekendPct.toFixed(1)}% of window` : '—'}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500">Weekday</p>
              <SensitiveText as="p" className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(weekend.weekday)}
              </SensitiveText>
              <p className="mt-1 text-xs text-slate-500">Mon–Fri in same window</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Category spikes</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Latest month vs your prior 3-month average for that category — catches “something changed” before the
            story hardens.
          </p>
          {anomalies.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No sharp spikes detected with current thresholds.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
              {anomalies.slice(0, 6).map((a) => (
                <li key={a.category} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{a.category}</p>
                    <p className="text-xs text-slate-500">
                      {shortMonthLabel(a.month)} · +{a.pctAbove.toFixed(0)}% vs baseline
                    </p>
                  </div>
                  <SensitiveText as="p" className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                    {formatCurrency(a.current)} <span className="font-normal text-slate-500">vs</span>{' '}
                    {formatCurrency(a.baseline)}
                  </SensitiveText>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-6">
          <div className="flex items-center gap-2">
            <Radar className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Subscription radar</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Combines tagged “subscription” spend (last 6 months) with recurring-description detection — the messy
            reality of BNPL + apps + bundles.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-violet-100 bg-violet-50/80 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
              <p className="text-xs font-semibold uppercase text-violet-800 dark:text-violet-200">Tagged items</p>
              <p className="mt-1 text-2xl font-bold text-violet-950 dark:text-white">{subs.taggedSubscriptionItems}</p>
              <SensitiveText as="p" className="mt-1 text-xs text-violet-900/80 dark:text-violet-100/90">
                ~{formatCurrency(subs.estimatedMonthlyFromTagged)} / mo est.
              </SensitiveText>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500">Recurring descriptions</p>
              <SensitiveText as="p" className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                ~{formatCurrency(subs.estimatedMonthlyFromRecurring)} / mo implied
              </SensitiveText>
              <p className="mt-1 text-xs text-slate-500">Sum of avg per repeating line (may overlap with tags)</p>
            </div>
          </div>
          {subs.recurringRows.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {subs.recurringRows.slice(0, 4).map((r) => (
                <li key={r.description} className="flex justify-between gap-2">
                  <span className="truncate">{r.description}</span>
                  <SensitiveText as="span" className="shrink-0 font-medium">
                    {formatCurrency(r.totalAmount / r.count)}/mo
                  </SensitiveText>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500">
        <Activity className="h-4 w-4" aria-hidden />
        Pulse is exploratory analytics for this demo — not tax, legal, or investment advice.
      </p>
    </div>
  );
}

ModernPulsePanel.propTypes = {
  loading: PropTypes.bool.isRequired,
};
