import PropTypes from 'prop-types';
import { CATEGORIES } from '../../data/mockData';

const inputCls =
  'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white';
const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

/**
 * @param {Object} props
 * @param {{ date: string, description: string, amount: string, category: string, type: string, tags: string, notes: string }} props.form
 * @param {(f: typeof props.form | ((p: typeof props.form) => typeof props.form)) => void} props.setForm
 */
export function TransactionFormFields({ form, setForm }) {
  return (
    <>
      <div>
        <label htmlFor="tx-date" className={labelCls}>
          Date
        </label>
        <input
          id="tx-date"
          type="date"
          required
          className={inputCls}
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        />
      </div>
      <div>
        <label htmlFor="tx-desc" className={labelCls}>
          Description
        </label>
        <input
          id="tx-desc"
          type="text"
          required
          className={inputCls}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div>
        <label htmlFor="tx-amt" className={labelCls}>
          Amount (positive)
        </label>
        <input
          id="tx-amt"
          type="number"
          min="0.01"
          step="0.01"
          required
          className={inputCls}
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tx-cat" className={labelCls}>
            Category
          </label>
          <select
            id="tx-cat"
            className={inputCls}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tx-type" className={labelCls}>
            Type
          </label>
          <select
            id="tx-type"
            className={inputCls}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="tx-tags" className={labelCls}>
          Tags (comma-separated)
        </label>
        <input
          id="tx-tags"
          type="text"
          placeholder="e.g. recurring, travel"
          className={inputCls}
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
        />
      </div>
      <div>
        <label htmlFor="tx-notes" className={labelCls}>
          Context notes (optional)
        </label>
        <textarea
          id="tx-notes"
          rows={3}
          placeholder="BNPL schedule, split with roommate, receipt link, etc."
          className={`${inputCls} resize-y min-h-[4.5rem]`}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>
    </>
  );
}

TransactionFormFields.propTypes = {
  form: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  setForm: PropTypes.func.isRequired,
};
