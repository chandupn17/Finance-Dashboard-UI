import PropTypes from 'prop-types';
import { useState } from 'react';
import { Sparkles, Trash2, Wand2 } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';

/**
 * Admin: substring rules that append tags when description matches.
 */
export function AutoTagRulesPanel({ enabled }) {
  const rules = useFinanceStore((s) => s.autoTagRules);
  const addAutoTagRule = useFinanceStore((s) => s.addAutoTagRule);
  const removeAutoTagRule = useFinanceStore((s) => s.removeAutoTagRule);
  const applyAutoTagsToAllTransactions = useFinanceStore((s) => s.applyAutoTagsToAllTransactions);
  const [pattern, setPattern] = useState('');
  const [tag, setTag] = useState('');

  if (!enabled) return null;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark-muted sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" aria-hidden />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Auto-tag rules</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Apply all rules to every transaction? Existing tags are kept; new matches are added.')) {
              applyAutoTagsToAllTransactions();
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100 dark:hover:bg-amber-500/20"
        >
          <Wand2 className="h-4 w-4" aria-hidden />
          Apply rules to ledger
        </button>
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        If the description contains the pattern (case-insensitive), the tag is added. New transactions run rules
        automatically.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          addAutoTagRule(pattern, tag);
          setPattern('');
          setTag('');
        }}
      >
        <div className="flex-1">
          <label htmlFor="rule-pattern" className="text-xs font-semibold uppercase text-slate-500">
            Contains text
          </label>
          <input
            id="rule-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. afterpay"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="rule-tag" className="text-xs font-semibold uppercase text-slate-500">
            Add tag
          </label>
          <input
            id="rule-tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. bnpl"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-sky-600"
        >
          Add rule
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {rules.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-700"
          >
            <span className="text-slate-700 dark:text-slate-200">
              <span className="font-medium text-slate-900 dark:text-white">“{r.pattern}”</span>
              <span className="text-slate-400"> → </span>
              <span className="rounded-md bg-violet-100 px-1.5 py-0.5 text-xs font-semibold text-violet-900 dark:bg-violet-500/20 dark:text-violet-100">
                {r.tag}
              </span>
            </span>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
              aria-label={`Remove rule ${r.pattern}`}
              onClick={() => removeAutoTagRule(r.id)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

AutoTagRulesPanel.propTypes = {
  enabled: PropTypes.bool.isRequired,
};
