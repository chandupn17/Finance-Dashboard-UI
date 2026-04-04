import PropTypes from 'prop-types';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

/**
 * @param {Object} props
 * @param {{ id: string, message: string, variant?: 'success' | 'error' | 'info' }[]} props.toasts
 * @param {(id: string) => void} props.onDismiss
 */
export function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2 sm:bottom-8 sm:right-8"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon =
          t.variant === 'success' ? CheckCircle2 : t.variant === 'error' ? XCircle : Info;
        const border =
          t.variant === 'success'
            ? 'border-emerald-200 dark:border-emerald-800'
            : t.variant === 'error'
              ? 'border-rose-200 dark:border-rose-900'
              : 'border-sky-200 dark:border-sky-900';
        const iconColor =
          t.variant === 'success'
            ? 'text-emerald-600 dark:text-emerald-400'
            : t.variant === 'error'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-sky-600 dark:text-sky-300';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-3 shadow-lg dark:bg-slate-800 ${border}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden />
            <p className="flex-1 text-sm text-slate-800 dark:text-slate-100">{t.message}</p>
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => onDismiss(t.id)}
            >
              Dismiss
            </button>
          </div>
        );
      })}
    </div>
  );
}

ToastStack.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['success', 'error', 'info']),
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};
