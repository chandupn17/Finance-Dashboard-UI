import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';
import { mergeTagsWithAutoRules } from '../utils/helpers';

/** @typedef {'admin' | 'viewer'} Role */

const defaultFilters = {
  search: '',
  category: '',
  type: '',
  dateRange: '6',
  tag: '',
};

/** @type {{ id: string, category: string, monthlyLimit: number }[]} */
const seedBudgets = [
  { id: 'bud-food', category: 'Food', monthlyLimit: 500 },
  { id: 'bud-transport', category: 'Transport', monthlyLimit: 350 },
  { id: 'bud-shopping', category: 'Shopping', monthlyLimit: 450 },
  { id: 'bud-entertainment', category: 'Entertainment', monthlyLimit: 220 },
  { id: 'bud-health', category: 'Health', monthlyLimit: 400 },
  { id: 'bud-utilities', category: 'Utilities', monthlyLimit: 220 },
  { id: 'bud-rent', category: 'Rent', monthlyLimit: 2000 },
  { id: 'bud-other', category: 'Other', monthlyLimit: 350 },
];

/** @type {{ id: string, name: string, targetAmount: number, savedAmount: number, deadline: string }[]} */
/** @type {{ id: string, pattern: string, tag: string }[]} */
const seedAutoTagRules = [
  { id: 'rule-salary', pattern: 'salary', tag: 'payroll' },
  { id: 'rule-rent', pattern: 'rent', tag: 'housing' },
  { id: 'rule-streaming', pattern: 'streaming', tag: 'subscription' },
  { id: 'rule-metro', pattern: 'metro', tag: 'commute' },
];

const seedGoals = [
  {
    id: 'goal-emergency',
    name: 'Emergency fund',
    targetAmount: 18000,
    savedAmount: 5200,
    deadline: '2026-12-31',
  },
  {
    id: 'goal-travel',
    name: 'Summer travel',
    targetAmount: 4200,
    savedAmount: 1100,
    deadline: '2026-07-15',
  },
];

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
 * @returns {string}
 */
function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const initialState = {
  transactions: mockTransactions,
  /** @type {Role} */
  role: 'viewer',
  filters: { ...defaultFilters },
  darkMode: false,
  privacyMode: false,
  budgets: seedBudgets,
  savingsGoals: seedGoals,
  autoTagRules: seedAutoTagRules,
  /** @type {ToastItem[]} */
  toasts: [],
};

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * @param {Omit<Transaction, 'id'> & { id?: string }} tx
       */
      addTransaction(tx) {
        const rules = get().autoTagRules;
        const merged = mergeTagsWithAutoRules(
          { ...tx, tags: tx.tags ? [...tx.tags] : [] },
          rules
        );
        const row = { ...merged, id: tx.id || newId() };
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

      togglePrivacyMode() {
        set((s) => ({ privacyMode: !s.privacyMode }));
      },

      /**
       * @param {string} category
       * @param {number} monthlyLimit
       */
      upsertBudget(category, monthlyLimit) {
        const lim = Number(monthlyLimit);
        if (!category || !Number.isFinite(lim) || lim <= 0) return;
        set((s) => {
          const existing = s.budgets.find((b) => b.category === category);
          if (existing) {
            return {
              budgets: s.budgets.map((b) =>
                b.id === existing.id ? { ...b, monthlyLimit: lim } : b
              ),
            };
          }
          return {
            budgets: [...s.budgets, { id: newId(), category, monthlyLimit: lim }],
          };
        });
        get().pushToast('Budget saved', 'success');
      },

      /** @param {string} id */
      removeBudget(id) {
        set((s) => ({ budgets: s.budgets.filter((b) => b.id !== id) }));
        get().pushToast('Budget removed', 'info');
      },

      /**
       * @param {string} name
       * @param {number} targetAmount
       * @param {string} deadline yyyy-mm-dd
       */
      addSavingsGoal(name, targetAmount, deadline) {
        const t = Number(targetAmount);
        if (!name.trim() || !deadline || !Number.isFinite(t) || t <= 0) return;
        const row = {
          id: newId(),
          name: name.trim(),
          targetAmount: t,
          savedAmount: 0,
          deadline,
        };
        set((s) => ({ savingsGoals: [...s.savingsGoals, row] }));
        get().pushToast('Goal created', 'success');
      },

      /** @param {string} id */
      removeSavingsGoal(id) {
        set((s) => ({ savingsGoals: s.savingsGoals.filter((g) => g.id !== id) }));
        get().pushToast('Goal removed', 'info');
      },

      /**
       * @param {string} id
       * @param {number} amount
       */
      contributeToGoal(id, amount) {
        const a = Number(amount);
        if (!Number.isFinite(a) || a <= 0) return;
        set((s) => ({
          savingsGoals: s.savingsGoals.map((g) =>
            g.id === id ? { ...g, savedAmount: Math.min(g.targetAmount, g.savedAmount + a) } : g
          ),
        }));
        get().pushToast('Contribution recorded', 'success');
      },

      /**
       * @param {string} pattern
       * @param {string} tag
       */
      addAutoTagRule(pattern, tag) {
        const p = pattern.trim();
        const tg = tag.trim();
        if (!p || !tg) return;
        set((s) => ({
          autoTagRules: [...s.autoTagRules, { id: newId(), pattern: p, tag: tg }],
        }));
        get().pushToast('Auto-tag rule added', 'success');
      },

      /** @param {string} id */
      removeAutoTagRule(id) {
        set((s) => ({ autoTagRules: s.autoTagRules.filter((r) => r.id !== id) }));
        get().pushToast('Rule removed', 'info');
      },

      applyAutoTagsToAllTransactions() {
        const rules = get().autoTagRules;
        set((s) => ({
          transactions: s.transactions.map((tx) =>
            mergeTagsWithAutoRules({ ...tx, tags: tx.tags ? [...tx.tags] : [] }, rules)
          ),
        }));
        get().pushToast('Auto-tags applied to all rows', 'success');
      },

      /** @param {string[]} ids */
      bulkDeleteTransactions(ids) {
        const drop = new Set(ids);
        if (drop.size === 0) return;
        set((s) => ({
          transactions: s.transactions.filter((t) => !drop.has(t.id)),
        }));
        get().pushToast(`${drop.size} transaction(s) deleted`, 'success');
      },

      /**
       * @param {string[]} ids
       * @param {string} tag
       */
      bulkAppendTag(ids, tag) {
        const tg = tag.trim();
        if (!tg || ids.length === 0) return;
        const add = new Set(ids);
        set((s) => ({
          transactions: s.transactions.map((tx) => {
            if (!add.has(tx.id)) return tx;
            const setTags = new Set(tx.tags || []);
            setTags.add(tg);
            return { ...tx, tags: [...setTags] };
          }),
        }));
        get().pushToast(`Tag “${tg}” applied`, 'success');
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
        privacyMode: state.privacyMode,
        budgets: state.budgets,
        savingsGoals: state.savingsGoals,
        autoTagRules: state.autoTagRules,
      }),
      merge: (persisted, current) => {
        const p = persisted ?? {};
        return {
          ...current,
          transactions: Array.isArray(p.transactions) ? p.transactions : current.transactions,
          darkMode: typeof p.darkMode === 'boolean' ? p.darkMode : current.darkMode,
          role: p.role === 'admin' || p.role === 'viewer' ? p.role : current.role,
          privacyMode: typeof p.privacyMode === 'boolean' ? p.privacyMode : current.privacyMode,
          budgets:
            Array.isArray(p.budgets) && p.budgets.length > 0 ? p.budgets : current.budgets,
          savingsGoals:
            Array.isArray(p.savingsGoals) && p.savingsGoals.length > 0
              ? p.savingsGoals
              : current.savingsGoals,
          autoTagRules: Array.isArray(p.autoTagRules) ? p.autoTagRules : current.autoTagRules,
        };
      },
    }
  )
);
