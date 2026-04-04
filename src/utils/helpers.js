import {
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';

/**
 * @param {number} value
 * @param {string} [currency='USD']
 * @returns {string}
 */
export function formatCurrency(value, currency = 'USD') {
  const n = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * @param {string} isoDate
 * @param {string} [pattern='MMM d, yyyy']
 * @returns {string}
 */
export function formatDisplayDate(isoDate, pattern = 'MMM d, yyyy') {
  try {
    return format(parseISO(isoDate), pattern);
  } catch {
    return isoDate;
  }
}

/**
 * @param {string} isoDate
 * @returns {string} yyyy-MM for grouping
 */
export function monthKeyFromIso(isoDate) {
  try {
    return format(parseISO(isoDate), 'yyyy-MM');
  } catch {
    return '';
  }
}

/**
 * @param {string} yyyyMm
 * @returns {string} Short label e.g. "Apr '26"
 */
export function shortMonthLabel(yyyyMm) {
  try {
    const d = parseISO(`${yyyyMm}-01`);
    return format(d, "MMM ''yy");
  } catch {
    return yyyyMm;
  }
}

/**
 * @param {import('../data/mockData.js').mockTransactions[number]} tx
 * @param {{ search: string, category: string, type: string, dateRange: string }} filters
 * @returns {boolean}
 */
export function transactionMatchesFilters(tx, filters) {
  const q = (filters.search || '').trim().toLowerCase();
  if (q && !tx.description.toLowerCase().includes(q)) return false;
  if (filters.category && tx.category !== filters.category) return false;
  if (filters.type && tx.type !== filters.type) return false;

  const range = filters.dateRange || 'all';
  if (range === 'all') return true;

  const txDate = parseISO(tx.date);
  const now = new Date();
  let start;
  if (range === '1') {
    start = startOfMonth(now);
  } else if (range === '3') {
    start = startOfMonth(subMonths(now, 2));
  } else if (range === '6') {
    start = startOfMonth(subMonths(now, 5));
  } else {
    return true;
  }
  const end = endOfMonth(now);
  return !isBefore(txDate, start) && !isAfter(txDate, end);
}

/**
 * @param {import('../data/mockData.js').mockTransactions[number][]} list
 * @param {{ search: string, category: string, type: string, dateRange: string }} filters
 * @returns {import('../data/mockData.js').mockTransactions[number][]}
 */
export function applyTransactionFilters(list, filters) {
  return list.filter((tx) => transactionMatchesFilters(tx, filters));
}

/**
 * @param {import('../data/mockData.js').mockTransactions[number][]} list
 * @param {{ key: 'date' | 'amount' | 'category', dir: 'asc' | 'desc' }} sort
 * @returns {import('../data/mockData.js').mockTransactions[number][]}
 */
export function sortTransactions(list, sort) {
  const dir = sort.dir === 'desc' ? -1 : 1;
  const copy = [...list];
  copy.sort((a, b) => {
    if (sort.key === 'amount') return (a.amount - b.amount) * dir;
    if (sort.key === 'category') return a.category.localeCompare(b.category) * dir;
    return (parseISO(a.date).getTime() - parseISO(b.date).getTime()) * dir;
  });
  return copy;
}

/**
 * @param {import('../data/mockData.js').mockTransactions[number][]} rows
 * @returns {string} CSV text with header
 */
export function transactionsToCsv(rows) {
  const header = ['id', 'date', 'description', 'amount', 'category', 'type'];
  const escape = (v) => {
    const s = String(v ?? '');
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [r.id, r.date, r.description, r.amount, r.category, r.type].map(escape).join(',')
    );
  }
  return lines.join('\n');
}

/**
 * Trigger browser download of CSV.
 * @param {string} csv
 * @param {string} filename
 */
export function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Last N calendar months as yyyy-MM ending at `anchor` month.
 * @param {Date} anchor
 * @param {number} count
 * @returns {string[]}
 */
export function lastNMonthKeys(anchor, count) {
  const keys = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    keys.push(format(startOfMonth(subMonths(anchor, i)), 'yyyy-MM'));
  }
  return keys;
}

/**
 * Linear count-up for display.
 * @param {number} target
 * @param {number} durationMs
 * @param {(v: number) => void} onUpdate
 * @returns {() => void} cancel
 */
export function animateNumber(target, durationMs, onUpdate) {
  const end = Number.isFinite(target) ? target : 0;
  const start = performance.now();
  let raf = 0;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / durationMs);
    const eased = 1 - (1 - t) ** 3;
    onUpdate(end * eased);
    if (t < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
