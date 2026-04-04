import { parseISO } from 'date-fns';

/**
 * @param {import('../../data/mockData.js').mockTransactions[number][]} txs
 * @param {Date} monthStart
 * @param {Date} monthEnd
 */
export function sumWindow(txs, monthStart, monthEnd) {
  let income = 0;
  let expense = 0;
  const inRange = [];
  for (const t of txs) {
    const d = parseISO(t.date);
    if (d < monthStart || d > monthEnd) continue;
    inRange.push(t);
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense, count: inRange.length };
}
