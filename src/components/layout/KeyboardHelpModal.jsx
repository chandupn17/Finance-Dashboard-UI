import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const rows = [
  { keys: '?', desc: 'Open this help (when not typing in a field)' },
  { keys: 'Esc', desc: 'Close this panel or the transaction form' },
  { keys: 'Tab', desc: 'Move focus — visible focus ring is intentional for keyboard users' },
];

const tips = [
  'Use Privacy (eye) in the header to blur amounts before screen sharing.',
  'Switch to Admin to edit the ledger, run bulk actions, and manage auto-tag rules.',
  'JSON export on Transactions is for portable backups in this local demo.',
];

/**
 * @param {Object} props
 * @param {() => void} props.onClose
 */
export function KeyboardHelpModal({ onClose }) {
  const closeRef = useRef(/** @type {HTMLButtonElement | null} */ (null));

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kbd-help-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 id="kbd-help-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Shortcuts & tips
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Close help"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[min(70vh,28rem)] overflow-y-auto px-5 py-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Small quality-of-life affordances for this demo console.
          </p>
          <dl className="mt-4 space-y-3">
            {rows.map((r) => (
              <div key={r.keys} className="flex gap-3 text-sm">
                <dt className="shrink-0">
                  <kbd className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    {r.keys}
                  </kbd>
                </dt>
                <dd className="text-slate-600 dark:text-slate-300">{r.desc}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
            {tips.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-sky-500 dark:text-sky-400" aria-hidden>
                  ·
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

KeyboardHelpModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
