import {
  addMonths,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';

/** Expense categories treated as baseline living costs */
const NEEDS_EXPENSE_CATEGORIES = new Set(['Rent', 'Utilities', 'Health', 'Transport', 'Food']);
/** Expense categories treated as discretionary / lifestyle */
const WANTS_EXPENSE_CATEGORIES = new Set(['Shopping', 'Entertainment', 'Other']);

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
 * @param {string} raw
 * @returns {string[]}
 */
export function parseTagsInput(raw) {
  if (!raw || typeof raw !== 'string') return [];
  return [
    ...new Set(
      raw
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ];
}

/**
 * @param {import('../data/mockData.js').mockTransactions[number][]} list
 * @returns {string[]}
 */
export function collectAllTags(list) {
  const set = new Set();
  for (const tx of list) {
    const tags = tx.tags;
    if (!tags?.length) continue;
    for (const t of tags) set.add(t);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * @param {import('../data/mockData.js').mockTransactions[number][]} list
 * @param {string} yyyyMm
 * @returns {Map<string, number>} expense totals by category for that calendar month
 */
export function expenseByCategoryInMonth(list, yyyyMm) {
  const map = new Map();
  for (const tx of list) {
    if (tx.type !== 'expense') continue;
    if (monthKeyFromIso(tx.date) !== yyyyMm) continue;
    map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
  }
  return map;
}

/**
 * Simple forward projection from trailing-month averages (demo heuristic).
 * @param {import('../data/mockData.js').mockTransactions[number][]} transactions
 * @param {number} [horizonMonths=4]
 */
export function computeCashFlowForecast(transactions, horizonMonths = 4) {
  const byMonth = new Map();
  for (const t of transactions) {
    const mk = monthKeyFromIso(t.date);
    if (!mk) continue;
    if (!byMonth.has(mk)) byMonth.set(mk, { income: 0, expense: 0 });
    const b = byMonth.get(mk);
    if (t.type === 'income') b.income += t.amount;
    else b.expense += t.amount;
  }
  const keys = [...byMonth.keys()].sort();
  const tail = keys.slice(-3);
  let avgInc = 0;
  let avgExp = 0;
  if (tail.length > 0) {
    for (const k of tail) {
      const b = byMonth.get(k);
      avgInc += b.income;
      avgExp += b.expense;
    }
    avgInc /= tail.length;
    avgExp /= tail.length;
  }
  let balance = 0;
  for (const t of transactions) {
    balance += t.type === 'income' ? t.amount : -t.amount;
  }
  const net = avgInc - avgExp;
  const projected = [];
  const startKey = keys.length ? keys[keys.length - 1] : format(new Date(), 'yyyy-MM');
  let running = balance;
  for (let i = 1; i <= horizonMonths; i += 1) {
    const d = addMonths(parseISO(`${startKey}-01`), i);
    const k = format(d, 'yyyy-MM');
    running += net;
    projected.push({
      key: k,
      label: shortMonthLabel(k),
      projectedBalance: running,
      avgIncome: avgInc,
      avgExpense: avgExp,
    });
  }
  return {
    projected,
    avgMonthlyIncome: avgInc,
    avgMonthlyExpense: avgExp,
    currentBalance: balance,
    monthlyNet: net,
  };
}

/**
 * Groups by normalized description to surface likely recurring items.
 * @param {import('../data/mockData.js').mockTransactions[number][]} txs
 */
/**
 * @typedef {{ id: string, pattern: string, tag: string }} AutoTagRule
 */

/**
 * Merges auto-tag rule matches into `tx.tags` (case-insensitive substring on description).
 * @param {import('../data/mockData.js').mockTransactions[number]} tx
 * @param {AutoTagRule[]} rules
 */
export function mergeTagsWithAutoRules(tx, rules) {
  const set = new Set(tx.tags || []);
  const desc = (tx.description || '').toLowerCase();
  for (const r of rules) {
    const p = (r.pattern || '').trim().toLowerCase();
    const tag = (r.tag || '').trim();
    if (!p || !tag) continue;
    if (desc.includes(p)) set.add(tag);
  }
  return { ...tx, tags: [...set] };
}

/**
 * Needs vs wants split for expenses (heuristic buckets for modern budgeting narratives).
 * @param {import('../data/mockData.js').mockTransactions[number][]} transactions
 */
export function computeNeedsVsWants(transactions) {
  let needs = 0;
  let wants = 0;
  let otherExpense = 0;
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    if (NEEDS_EXPENSE_CATEGORIES.has(t.category)) needs += t.amount;
    else if (WANTS_EXPENSE_CATEGORIES.has(t.category)) wants += t.amount;
    else otherExpense += t.amount;
  }
  const expenseTotal = needs + wants + otherExpense;
  return {
    needs,
    wants,
    otherExpense,
    expenseTotal,
    wantsSharePct: expenseTotal > 0 ? (wants / expenseTotal) * 100 : 0,
  };
}

/**
 * Flags categories in the latest month that spiked vs the prior 3 months (expenses only).
 * @param {import('../data/mockData.js').mockTransactions[number][]} transactions
 * @param {number} [spikePct=38]
 * @param {number} [minDelta=60]
 */
export function computeSpendAnomalies(transactions, spikePct = 38, minDelta = 60) {
  const byMonthCat = new Map();
  const months = new Set();
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    const mk = monthKeyFromIso(t.date);
    if (!mk) continue;
    months.add(mk);
    const k = `${mk}::${t.category}`;
    byMonthCat.set(k, (byMonthCat.get(k) || 0) + t.amount);
  }
  const sortedMonths = [...months].sort();
  if (sortedMonths.length < 2) return [];
  const latest = sortedMonths[sortedMonths.length - 1];
  const prior = sortedMonths.slice(-4, -1);
  if (prior.length === 0) return [];

  const cats = new Set();
  for (const t of transactions) {
    if (t.type === 'expense') cats.add(t.category);
  }

  /** @type {{ category: string, month: string, current: number, baseline: number, pctAbove: number }[]} */
  const out = [];
  for (const cat of cats) {
    const cur = byMonthCat.get(`${latest}::${cat}`) || 0;
    if (cur <= 0) continue;
    let sum = 0;
    for (const pm of prior) {
      sum += byMonthCat.get(`${pm}::${cat}`) || 0;
    }
    const baseline = sum / prior.length;
    if (baseline <= 0) {
      if (cur >= minDelta) {
        out.push({ category: cat, month: latest, current: cur, baseline: 0, pctAbove: 100 });
      }
      continue;
    }
    const pctAbove = ((cur - baseline) / baseline) * 100;
    if (pctAbove >= spikePct && cur - baseline >= minDelta) {
      out.push({ category: cat, month: latest, current: cur, baseline, pctAbove });
    }
  }
  return out.sort((a, b) => b.pctAbove - a.pctAbove);
}

/**
 * Weekend vs weekday expense split over the trailing window (social / impulse signal).
 * @param {import('../data/mockData.js').mockTransactions[number][]} transactions
 * @param {number} [trailingMonths=4]
 */
export function computeWeekendExpenseSplit(transactions, trailingMonths = 4) {
  const anchor = new Date();
  const start = startOfMonth(subMonths(anchor, trailingMonths - 1));
  let weekend = 0;
  let weekday = 0;
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    const d = parseISO(t.date);
    if (d < start) continue;
    const day = d.getDay();
    const isWeekend = day === 0 || day === 6;
    if (isWeekend) weekend += t.amount;
    else weekday += t.amount;
  }
  const total = weekend + weekday;
  return {
    weekend,
    weekday,
    total,
    weekendPct: total > 0 ? (weekend / total) * 100 : 0,
  };
}

export function computeRecurringHints(txs) {
  const map = new Map();
  for (const t of txs) {
    const norm = t.description.toLowerCase().replace(/\s+/g, ' ').trim();
    const key = `${norm}::${t.category}::${t.type}`;
    if (!map.has(key)) {
      map.set(key, {
        description: t.description,
        category: t.category,
        type: t.type,
        count: 0,
        totalAmount: 0,
        lastDate: t.date,
      });
    }
    const e = map.get(key);
    e.count += 1;
    e.totalAmount += t.amount;
    if (t.date > e.lastDate) e.lastDate = t.date;
  }
  return [...map.values()]
    .filter((x) => x.count >= 2)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);
}

/**
 * Subscription-style exposure: recurring rows + explicit subscription tags (last 6 months).
 * @param {import('../data/mockData.js').mockTransactions[number][]} transactions
 */
export function computeSubscriptionExposure(transactions) {
  const hints = computeRecurringHints(transactions);
  const sixAgo = startOfMonth(subMonths(new Date(), 5));
  let taggedSubMonthlyEst = 0;
  let taggedCount = 0;
  const byKey = new Map();

  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    const d = parseISO(t.date);
    if (d < sixAgo) continue;
    const tags = (t.tags || []).map((x) => x.toLowerCase());
    if (tags.some((x) => x.includes('subscription') || x.includes('sub'))) {
      taggedCount += 1;
      const norm = t.description.toLowerCase().replace(/\s+/g, ' ').trim();
      const key = `${norm}::${t.category}`;
      if (!byKey.has(key)) byKey.set(key, { amount: 0, months: new Set() });
      const e = byKey.get(key);
      e.amount += t.amount;
      e.months.add(monthKeyFromIso(t.date));
    }
  }

  for (const e of byKey.values()) {
    const m = Math.max(1, e.months.size);
    taggedSubMonthlyEst += e.amount / m;
  }

  const recurringExpense = hints.filter((h) => h.type === 'expense');
  let recurringMonthlyEst = 0;
  for (const h of recurringExpense) {
    recurringMonthlyEst += h.totalAmount / Math.max(1, h.count);
  }

  return {
    recurringRows: recurringExpense.slice(0, 6),
    taggedSubscriptionItems: taggedCount,
    estimatedMonthlyFromTagged: taggedSubMonthlyEst,
    estimatedMonthlyFromRecurring: recurringMonthlyEst,
  };
}

/**
 * @param {import('../data/mockData.js').mockTransactions[number]} tx
 * @param {{ search: string, category: string, type: string, dateRange: string, tag: string }} filters
 * @returns {boolean}
 */
export function transactionMatchesFilters(tx, filters) {
  const q = (filters.search || '').trim().toLowerCase();
  if (q && !tx.description.toLowerCase().includes(q)) return false;
  if (filters.category && tx.category !== filters.category) return false;
  if (filters.type && tx.type !== filters.type) return false;
  const tagFilter = (filters.tag || '').trim().toLowerCase();
  if (tagFilter) {
    const tags = (tx.tags || []).map((t) => t.toLowerCase());
    if (!tags.includes(tagFilter)) return false;
  }

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
 * @param {{ search: string, category: string, type: string, dateRange: string, tag: string }} filters
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
  const header = ['id', 'date', 'description', 'amount', 'category', 'type', 'tags', 'notes'];
  const escape = (v) => {
    const s = String(v ?? '');
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [header.join(',')];
  for (const r of rows) {
    const tagStr = Array.isArray(r.tags) ? r.tags.join(';') : '';
    const notes = r.notes ?? '';
    lines.push(
      [r.id, r.date, r.description, r.amount, r.category, r.type, tagStr, notes]
        .map(escape)
        .join(',')
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
 * @param {import('../data/mockData.js').mockTransactions[number][]} rows
 * @returns {string}
 */
export function transactionsToJson(rows) {
  return `${JSON.stringify(rows, null, 2)}\n`;
}

/**
 * @param {string} json
 * @param {string} filename
 */
export function downloadJson(json, filename) {
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
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
