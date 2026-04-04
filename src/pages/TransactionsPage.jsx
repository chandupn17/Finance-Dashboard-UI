import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { useFinanceStore } from '../store/useFinanceStore';
import {
  applyTransactionFilters,
  downloadCsv,
  sortTransactions,
  transactionsToCsv,
} from '../utils/helpers';

/**
 * Transactions route: filterable list and admin CRUD.
 */
export function TransactionsPage() {
  const { dataReady } = useOutletContext();
  const loading = !dataReady;

  const role = useFinanceStore((s) => s.role);
  const transactions = useFinanceStore((s) => s.transactions);
  const filters = useFinanceStore((s) => s.filters);
  const setFilter = useFinanceStore((s) => s.setFilter);
  const resetFilters = useFinanceStore((s) => s.resetFilters);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const editTransaction = useFinanceStore((s) => s.editTransaction);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  const [sort, setSort] = useState(
    /** @type {{ key: 'date' | 'amount' | 'category', dir: 'asc' | 'desc' }} */ ({
      key: 'date',
      dir: 'desc',
    })
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(
    /** @type {import('../data/mockData.js').mockTransactions[number] | null} */ (null)
  );

  const filtered = useMemo(() => applyTransactionFilters(transactions, filters), [transactions, filters]);
  const rows = useMemo(() => sortTransactions(filtered, sort), [filtered, sort]);

  const isAdmin = role === 'admin';

  const onSort = (key) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }
    );
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (tx) => {
    setEditing(tx);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const onSubmitForm = (payload) => {
    if (editing) editTransaction(editing.id, payload);
    else addTransaction({ ...payload, type: /** @type {'income'|'expense'} */ (payload.type) });
  };

  const onDelete = (tx) => {
    if (window.confirm(`Delete “${tx.description}”?`)) deleteTransaction(tx.id);
  };

  const exportCsv = () => {
    const csv = transactionsToCsv(rows);
    downloadCsv(csv, 'transactions-export.csv');
    useFinanceStore.getState().pushToast('CSV exported', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Audit-style ledger: search, filter, and sort. Admins can add or correct entries (demo).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-sky-500/40"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </button>
          {isAdmin ? (
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-sky-500 hover:to-cyan-500"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add transaction
            </button>
          ) : null}
        </div>
      </div>

      <TransactionFilters
        filters={filters}
        onChange={setFilter}
        onReset={resetFilters}
      />

      <TransactionList
        loading={loading}
        rows={rows}
        isAdmin={isAdmin}
        sort={sort}
        onSort={onSort}
        onEdit={openEdit}
        onDelete={onDelete}
      />

      {isAdmin ? (
        <TransactionForm
          open={formOpen}
          initial={editing || undefined}
          onClose={closeForm}
          onSubmit={onSubmitForm}
        />
      ) : null}
    </div>
  );
}
