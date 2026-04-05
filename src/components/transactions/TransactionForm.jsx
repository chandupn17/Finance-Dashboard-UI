import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { parseTagsInput } from '../../utils/helpers';
import { TransactionFormFields } from './TransactionFormFields';

const empty = {
  date: '',
  description: '',
  amount: '',
  category: 'Food',
  type: 'expense',
  tags: '',
  notes: '',
};

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {import('../../data/mockData.js').mockTransactions[number] | null | undefined} props.initial
 * @param {() => void} props.onClose
 * @param {(payload: { date: string, description: string, amount: number, category: string, type: string, tags?: string[], notes?: string }) => void} props.onSubmit
 */
export function TransactionForm({ open, initial, onClose, onSubmit }) {
  const [form, setForm] = useState(empty);
  const overlayRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      document.getElementById('tx-date')?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        date: initial.date,
        description: initial.description,
        amount: String(initial.amount),
        category: initial.category,
        type: initial.type,
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : '',
        notes: initial.notes ?? '',
      });
    } else {
      setForm({
        ...empty,
        date: new Date().toISOString().slice(0, 10),
      });
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.date || !form.description.trim() || !Number.isFinite(amt) || amt <= 0) return;
    const tags = parseTagsInput(form.tags);
    onSubmit({
      date: form.date,
      description: form.description.trim(),
      amount: amt,
      category: form.category,
      type: form.type,
      tags,
      notes: form.notes.trim(),
    });
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-form-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 id="tx-form-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            {initial ? 'Edit transaction' : 'Add transaction'}
          </h2>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4 px-5 py-5">
          <TransactionFormFields form={form} setForm={setForm} />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-sky-500 hover:to-cyan-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

TransactionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  initial: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['income', 'expense']).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
