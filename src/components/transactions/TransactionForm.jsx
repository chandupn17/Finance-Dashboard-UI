import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { TransactionFormFields } from './TransactionFormFields';

const empty = {
  date: '',
  description: '',
  amount: '',
  category: 'Food',
  type: 'expense',
};

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {import('../../data/mockData.js').mockTransactions[number] | null | undefined} props.initial
 * @param {() => void} props.onClose
 * @param {(payload: { date: string, description: string, amount: number, category: string, type: string }) => void} props.onSubmit
 */
export function TransactionForm({ open, initial, onClose, onSubmit }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        date: initial.date,
        description: initial.description,
        amount: String(initial.amount),
        category: initial.category,
        type: initial.type,
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
    onSubmit({
      date: form.date,
      description: form.description.trim(),
      amount: amt,
      category: form.category,
      type: form.type,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-form-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-900">
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
