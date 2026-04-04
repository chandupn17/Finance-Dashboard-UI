import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';

/** @typedef {'admin' | 'viewer'} Role */

const defaultFilters = {
  search: '',
  category: '',
  type: '',
  dateRange: '6',
};

/**
 * @typedef {Object} ToastItem
 * @property {string} id
 * @property {string} message
 * @property {'success' | 'error' | 'info'} variant
 */

/**
 * @typedef {import('../data/mockData.js').mockTransactions[number]} Transaction
 */

/**
 * @param {Transaction} tx
 * @returns {string}
 */
function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      /** @type {Role} */
      role: 'viewer',
      filters: { ...defaultFilters },
      darkMode: false,
      /** @type {ToastItem[]} */
      toasts: [],

      /**
       * @param {Omit<Transaction, 'id'> & { id?: string }} tx
       */
      addTransaction(tx) {
        const row = { ...tx, id: tx.id || newId() };
        set((s) => ({ transactions: [row, ...s.transactions] }));
        get().pushToast('Transaction added', 'success');
      },

      /**
       * @param {string} id
       * @param {Partial<Transaction>} updated
       */
      editTransaction(id, updated) {
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        }));
        get().pushToast('Transaction updated', 'success');
      },

      /** @param {string} id */
      deleteTransaction(id) {
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        }));
        get().pushToast('Transaction deleted', 'success');
      },

      /** @param {Role} role */
      setRole(role) {
        set({ role });
      },

      /**
       * @param {keyof typeof defaultFilters} key
       * @param {string} value
       */
      setFilter(key, value) {
        set((s) => ({ filters: { ...s.filters, [key]: value } }));
      },

      resetFilters() {
        set({ filters: { ...defaultFilters } });
      },

      toggleDarkMode() {
        set((s) => ({ darkMode: !s.darkMode }));
      },

      /**
       * @param {string} message
       * @param {ToastItem['variant']} [variant='info']
       */
      pushToast(message, variant = 'info') {
        const id = newId();
        set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
        window.setTimeout(() => {
          get().removeToast(id);
        }, 3200);
      },

      /** @param {string} id */
      removeToast(id) {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },
    }),
    {
      name: 'finance-dashboard-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        darkMode: state.darkMode,
        role: state.role,
      }),
    }
  )
);
