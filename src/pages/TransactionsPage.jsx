import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckSquare, Download, FileJson, Plus, Square } from 'lucide-react';
import { AutoTagRulesPanel } from '../components/transactions/AutoTagRulesPanel';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { useFinanceStore } from '../store/useFinanceStore';
import {
  applyTransactionFilters,
  collectAllTags,
  downloadCsv,
  downloadJson,
  sortTransactions,
  transactionsToCsv,
  transactionsToJson,
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
  const bulkDeleteTransactions = useFinanceStore((s) => s.bulkDeleteTransactions);
  const bulkAppendTag = useFinanceStore((s) => s.bulkAppendTag);

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
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(/** @type {string[]} */ ([]));
  const [bulkTag, setBulkTag] = useState('');

  const filtered = useMemo(() => applyTransactionFilters(transactions, filters), [transactions, filters]);
  const rows = useMemo(() => sortTransactions(filtered, sort), [filtered, sort]);
  const tagOptions = useMemo(() => collectAllTags(transactions), [transactions]);
  const visibleIds = useMemo(() => rows.map((r) => r.id), [rows]);

  const isAdmin = role === 'admin';

  useEffect(() => {
    if (!isAdmin) setBulkMode(false);
  }, [isAdmin]);

  useEffect(() => {
    if (!bulkMode) setSelectedIds([]);
  }, [bulkMode]);

  const allVisibleSelected =
    bulkMode && visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

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
    else
      addTransaction({
        ...payload,
        type: /** @type {'income'|'expense'} */ (payload.type),
      });
  };

  const onDelete = (tx) => {
    if (window.confirm(`Delete “${tx.description}”?`)) deleteTransaction(tx.id);
  };

  const exportCsv = () => {
    const csv = transactionsToCsv(rows);
    downloadCsv(csv, 'transactions-export.csv');
    useFinanceStore.getState().pushToast('CSV exported', 'success');
  };

  const exportJson = () => {
    const json = transactionsToJson(rows);
    downloadJson(json, 'transactions-export.json');
    useFinanceStore.getState().pushToast('JSON exported (portable data)', 'success');
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      if (visibleIds.length > 0 && visibleIds.every((id) => prev.includes(id))) {
        return prev.filter((id) => !visibleIds.includes(id));
      }
      return [...new Set([...prev, ...visibleIds])];
    });
  };

  const runBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Delete ${selectedIds.length} transaction(s)? This cannot be undone in the demo.`
      )
    ) {
      bulkDeleteTransactions(selectedIds);
      setSelectedIds([]);
    }
  };

  const runBulkTag = () => {
    if (selectedIds.length === 0 || !bulkTag.trim()) return;
    bulkAppendTag(selectedIds, bulkTag.trim());
    setBulkTag('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Ledger with tags, notes, portable export, and bulk tools for admins (demo).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-sky-500/40"
          >
            <Download className="h-4 w-4" aria-hidden />
            CSV
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-violet-500/40"
          >
            <FileJson className="h-4 w-4" aria-hidden />
            JSON
          </button>
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => setBulkMode((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition ${
                  bulkMode
                    ? 'border-sky-400 bg-sky-50 text-sky-900 dark:border-sky-500/50 dark:bg-sky-500/15 dark:text-sky-100'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-sky-200 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                }`}
                aria-pressed={bulkMode}
              >
                {bulkMode ? (
                  <CheckSquare className="h-4 w-4" aria-hidden />
                ) : (
                  <Square className="h-4 w-4" aria-hidden />
                )}
                Bulk select
              </button>
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-sky-500 hover:to-cyan-500"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add transaction
              </button>
            </>
          ) : null}
        </div>
      </div>

      <TransactionFilters
        filters={filters}
        onChange={setFilter}
        onReset={resetFilters}
        tagOptions={tagOptions}
      />

      {isAdmin && bulkMode && selectedIds.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border border-sky-200 bg-sky-50/90 p-4 dark:border-sky-500/30 dark:bg-sky-500/10 sm:flex-row sm:items-center sm:flex-wrap">
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">
            {selectedIds.length} selected
          </p>
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={bulkTag}
              onChange={(e) => setBulkTag(e.target.value)}
              placeholder="Tag to add…"
              className="min-w-0 flex-1 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm dark:border-sky-500/40 dark:bg-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={runBulkTag}
              className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              Add tag
            </button>
            <button
              type="button"
              onClick={runBulkDelete}
              className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-500/40 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              Delete selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-sm font-medium text-sky-800 underline decoration-sky-300/60 underline-offset-2 dark:text-sky-200"
            >
              Clear selection
            </button>
          </div>
        </div>
      ) : null}

      <TransactionList
        loading={loading}
        rows={rows}
        isAdmin={isAdmin}
        sort={sort}
        onSort={onSort}
        onEdit={openEdit}
        onDelete={onDelete}
        selectionEnabled={isAdmin && bulkMode}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onSelectAllVisible={toggleSelectAllVisible}
        allVisibleSelected={allVisibleSelected}
      />

      {isAdmin ? (
        <>
          <AutoTagRulesPanel enabled />
          <TransactionForm
            open={formOpen}
            initial={editing || undefined}
            onClose={closeForm}
            onSubmit={onSubmitForm}
          />
        </>
      ) : null}
    </div>
  );
}
