import { monthKeyFromIso, shortMonthLabel } from '../../utils/helpers';

/**
 * @param {import('../../data/mockData.js').mockTransactions[number][]} txs
 */
export function computeInsights(txs) {
  const expenseByCat = new Map();
  const countByCat = new Map();
  const expenseByMonth = new Map();
  const incomeByMonth = new Map();

  let totalInc = 0;
  let totalExp = 0;

  for (const t of txs) {
    const mk = monthKeyFromIso(t.date);
    if (!mk) continue;

    countByCat.set(t.category, (countByCat.get(t.category) || 0) + 1);

    if (t.type === 'expense') {
      totalExp += t.amount;
      expenseByCat.set(t.category, (expenseByCat.get(t.category) || 0) + t.amount);
      expenseByMonth.set(mk, (expenseByMonth.get(mk) || 0) + t.amount);
    } else {
      totalInc += t.amount;
      incomeByMonth.set(mk, (incomeByMonth.get(mk) || 0) + t.amount);
    }
  }

  const expenseCats = [...expenseByCat.entries()];
  let highestSpend = { name: '—', amount: 0 };
  let lowestSpend = { name: '—', amount: 0 };
  if (expenseCats.length > 0) {
    const sorted = [...expenseCats].sort((a, b) => b[1] - a[1]);
    highestSpend = { name: sorted[0][0], amount: sorted[0][1] };
    lowestSpend = { name: sorted[sorted.length - 1][0], amount: sorted[sorted.length - 1][1] };
  }

  let maxExpMonth = { label: '—', amount: 0 };
  for (const [k, v] of expenseByMonth) {
    if (v > maxExpMonth.amount) maxExpMonth = { label: shortMonthLabel(k), amount: v };
  }

  let maxIncMonth = { label: '—', amount: 0 };
  for (const [k, v] of incomeByMonth) {
    if (v > maxIncMonth.amount) maxIncMonth = { label: shortMonthLabel(k), amount: v };
  }

  const monthKeys = [...new Set([...expenseByMonth.keys(), ...incomeByMonth.keys()])].sort();
  const totalExpAllMonths = [...expenseByMonth.values()].reduce((a, b) => a + b, 0);
  const avgMonthlyExpense =
    monthKeys.length === 0 ? 0 : totalExpAllMonths / monthKeys.length;

  let ratioLabel = '—';
  if (totalExp > 0) {
    ratioLabel = `${(totalInc / totalExp).toFixed(2)} : 1`;
  } else if (totalInc > 0) {
    ratioLabel = '∞ (no expenses)';
  }

  const top3Freq = [...countByCat.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

  const barData = monthKeys.map((k) => ({
    key: k,
    label: shortMonthLabel(k),
    income: incomeByMonth.get(k) || 0,
    expense: expenseByMonth.get(k) || 0,
  }));

  return {
    highestSpend,
    lowestSpend,
    maxExpMonth,
    maxIncMonth,
    avgMonthlyExpense,
    ratioLabel,
    top3Freq,
    barData,
  };
}
