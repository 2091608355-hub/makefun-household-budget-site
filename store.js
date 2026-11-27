// Keeps the household ledger in the browser and derives every total
// the pages show, so a new entry changes the overview at once.
import { SEED_TRANSACTIONS, CATEGORIES, BILLS } from './data.js';

const LEDGER_KEY = 'hearth-ledger-v1';
const BUDGET_KEY = 'hearth-budgets-v1';
const BILLS_KEY = 'hearth-bills-v1';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadLedger() {
  const saved = readJson(LEDGER_KEY, null);
  if (Array.isArray(saved) && saved.length) return saved;
  return SEED_TRANSACTIONS.map((row) => ({ ...row }));
}

export function saveLedger(rows) {
  writeJson(LEDGER_KEY, rows);
}

export function resetLedger() {
  localStorage.removeItem(LEDGER_KEY);
  return loadLedger();
}

export function addEntry(rows, entry) {
  const next = [{ ...entry, id: 'u' + Date.now() }, ...rows];
  saveLedger(next);
  return next;
}

export function removeEntry(rows, id) {
  const next = rows.filter((row) => row.id !== id);
  saveLedger(next);
  return next;
}

export function loadBudgets() {
  const saved = readJson(BUDGET_KEY, null);
  const base = {};
  for (const cat of CATEGORIES) base[cat.id] = cat.budget;
  if (!saved) return base;
  return { ...base, ...saved };
}

export function saveBudget(id, amount) {
  const budgets = loadBudgets();
  budgets[id] = Math.max(0, Math.round(amount) || 0);
  writeJson(BUDGET_KEY, budgets);
  return budgets;
}

export function loadBills() {
  const saved = readJson(BILLS_KEY, null);
  if (Array.isArray(saved) && saved.length) return saved;
  return BILLS.map((row) => ({ ...row }));
}

export function toggleBill(id) {
  const bills = loadBills().map((bill) =>
    bill.id === id ? { ...bill, paid: !bill.paid } : bill,
  );
  writeJson(BILLS_KEY, bills);
  return bills;
}

export function monthTotals(rows) {
  let income = 0;
  let spent = 0;
  const byCategory = {};
  for (const cat of CATEGORIES) byCategory[cat.id] = 0;
  for (const row of rows) {
    if (row.kind === 'income') {
      income += row.amount;
    } else {
      spent += row.amount;
      if (byCategory[row.category] !== undefined) byCategory[row.category] += row.amount;
    }
  }
  return { income, spent, left: income - spent, byCategory };
}

export function money(amount) {
  return '¥' + Math.round(amount).toLocaleString('en-US');
}

export function toCsv(rows) {
  const lines = ['date,kind,category,amount,note'];
  for (const row of [...rows].sort((a, b) => a.date.localeCompare(b.date))) {
    const safeNote = '"' + String(row.note).replaceAll('"', '""') + '"';
    lines.push([row.date, row.kind, row.category, row.amount, safeNote].join(','));
  }
  return lines.join('\n');
}

export function downloadFile(name, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
