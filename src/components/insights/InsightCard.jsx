import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.value
 * @param {string} [props.subtitle]
 */
export function InsightCard({ title, value, subtitle }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-surface-dark-muted sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{value}</p>
      {subtitle ? (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      ) : null}
    </div>
  );
}

InsightCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};
