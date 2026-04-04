import PropTypes from 'prop-types';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

/**
 * Month-over-month percent change.
 * @param {Object} props
 * @param {number} props.current
 * @param {number} props.previous
 * @param {boolean} [props.invert] When true, down is "good" (e.g. expenses)
 */
export function TrendBadge({ current, previous, invert }) {
  if (previous === 0 && current === 0) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  const pct =
    previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / Math.abs(previous)) * 100;
  const up = pct >= 0;
  const good = invert ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const cls = good
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400';
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${cls}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {`${up ? '+' : ''}${pct.toFixed(1)}%`} vs last month
    </span>
  );
}

TrendBadge.propTypes = {
  current: PropTypes.number.isRequired,
  previous: PropTypes.number.isRequired,
  invert: PropTypes.bool,
};
