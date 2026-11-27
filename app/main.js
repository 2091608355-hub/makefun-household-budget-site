// Hearth & Ledger: hash router and every page of the household budget.
// State lives in store.js (localStorage); data.js holds the November sample.
import { HOUSEHOLD, CATEGORIES, MONTHS, SAVINGS_GOAL } from './data.js';
import { trendChart, shareDonut } from './charts.js';
import {
  loadLedger, addEntry, removeEntry, loadBudgets, saveBudget,
  loadBills, toggleBill, monthTotals, money, toCsv, downloadFile, resetLedger,
} from './store.js';

const view = document.getElementById('view');
const nav = document.getElementById('nav');
let rows = loadLedger();
let flash = '';

function esc(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function categoryLabel(id) {
  const found = CATEGORIES.find((cat) => cat.id === id);
  return found ? found.label : 'Income';
}

function route() {
  const hash = location.hash.replace(/^#\/?/, '') || 'overview';
  const name = hash.split('/')[0];
  const known = ['overview', 'add', 'budget', 'bills', 'charts', 'settings'];
  const page = known.includes(name) ? name : 'overview';
  for (const link of nav.querySelectorAll('a')) {
    link.classList.toggle('active', link.dataset.route === page);
  }
  const pages = { overview: showOverview, add: showAdd, budget: showBudget, bills: showBills, charts: showCharts, settings: showSettings };
  view.innerHTML = pages[page]();
  wirePage(page);
  window.scrollTo(0, 0);
}

function statCards(totals) {
  const saved = SAVINGS_GOAL.monthly;
  return `<section class="cards">
    <div class="card good"><div class="label">Income in Nov</div><div class="big">${money(totals.income)}</div><div class="sub">Salaries, freelance &amp; a refund</div></div>
    <div class="card warn"><div class="label">Spent in Nov</div><div class="big">${money(totals.spent)}</div><div class="sub">${rows.filter((r) => r.kind === 'expense').length} expense entries</div></div>
    <div class="card good"><div class="label">Left over</div><div class="big">${money(totals.left)}</div><div class="sub">${Math.round((totals.left / totals.income) * 100)}% of income unspent</div></div>
    <div class="card"><div class="label">To savings</div><div class="big">${money(saved)}</div><div class="sub">Holiday &amp; emergency fund</div></div>
  </section>`;
}

function recentTable(limit) {
  const sorted = [...rows].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, limit);
  const lines = sorted.map((row) => `<tr>
    <td>${esc(row.date.slice(5))}</td><td>${esc(row.note)}</td><td>${row.kind === 'income' ? 'Income' : esc(categoryLabel(row.category))}</td>
    <td class="num ${row.kind}">${row.kind === 'income' ? '+' : '−'}${money(row.amount)}</td>
    <td class="num"><button class="small secondary" data-delete="${esc(row.id)}">Delete</button></td>
  </tr>`).join('');
  return `<table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead><tbody>${lines}</tbody></table>`;
}

function showOverview() {
  const totals = monthTotals(rows);
  const top = Object.entries(totals.byCategory)
    .map(([id, value]) => ({ id, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);
  const topLines = top.map((item) => {
    const cat = CATEGORIES.find((c) => c.id === item.id);
    const pct = Math.round((item.value / totals.spent) * 100);
    return `<div class="budget-row"><span class="name">${esc(cat.label)}</span><span><span class="bar"><span style="width:${pct}%"></span></span><span class="meta">${pct}% of spending</span></span><span class="num" style="text-align:right;font-weight:700">${money(item.value)}</span></div>`;
  }).join('');
  const bills = loadBills();
  const unpaid = bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((sum, b) => sum + b.amount, 0);
  const flashHtml = flash ? `<p class="notice">${esc(flash)}</p>` : '';
  flash = '';
  return `${flashHtml}
  <h1>November at a glance</h1>
  <p class="lede">The ${esc(HOUSEHOLD.name)} — ${esc(HOUSEHOLD.members.join(', '))}. Income ${money(totals.income)}, spending ${money(totals.spent)}, and ${money(totals.left)} still in the pot with four days of the month left.</p>
  ${statCards(totals)}
  <div class="grid2">
    <section class="card"><h2>Biggest spending so far</h2>${topLines}
      <p style="margin:14px 0 0"><a href="#/budget">See every category budget →</a></p></section>
    <section class="card"><h2>Savings goal</h2>
      <p><b>${esc(SAVINGS_GOAL.label)}</b><br>${money(SAVINGS_GOAL.saved)} saved of ${money(SAVINGS_GOAL.target)} — ${Math.round((SAVINGS_GOAL.saved / SAVINGS_GOAL.target) * 100)}% there.</p>
      <div class="bar"><span style="width:${Math.round((SAVINGS_GOAL.saved / SAVINGS_GOAL.target) * 100)}%"></span></div>
      <p class="sub">At ${money(SAVINGS_GOAL.monthly)} a month, the goal lands in about five months.</p>
      <p><a href="#/bills">Bills still to pay: ${unpaid.length} totalling ${money(unpaidTotal)} →</a></p></section>
  </div>
  <section class="panel"><h2>Latest entries</h2>${recentTable(10)}
    <p style="margin:12px 0 0"><a href="#/add">Add an entry →</a> · <a href="#/charts">See the charts →</a></p></section>
  <p class="tip" style="margin-top:14px"><b>Household tip:</b> groceries are ¥120 under budget with a week to go — that covers the water bill due Nov 15 without touching savings.</p>`;
}

function showAdd() {
  const options = CATEGORIES.map((cat) => `<option value="${cat.id}">${esc(cat.label)}</option>`).join('');
  const flashHtml = flash ? `<p class="notice">${esc(flash)}</p>` : '';
  flash = '';
  return `${flashHtml}
  <h1>Add an entry</h1>
  <p class="lede">Money in or money out — it lands in the ledger straight away and every total on the site updates.</p>
  <section class="panel"><form class="add" id="add-form">
    <div><label for="f-kind">Kind</label><select id="f-kind"><option value="expense">Spending</option><option value="income">Income</option></select></div>
    <div><label for="f-cat">Category</label><select id="f-cat">${options}</select></div>
    <div><label for="f-amount">Amount (¥)</label><input id="f-amount" type="number" min="1" step="1" placeholder="e.g. 240" required></div>
    <div><label for="f-date">Date</label><input id="f-date" type="date" value="2026-11-27" required></div>
    <div class="full"><label for="f-note">What was it?</label><input id="f-note" type="text" maxlength="80" placeholder="e.g. Weekly shop, Green Mart" required></div>
    <div class="full"><button type="submit">Save entry</button> <button type="button" class="secondary" id="clear-form">Clear</button></div>
  </form></section>
  <section class="panel"><h2>Latest entries</h2>${recentTable(8)}</section>`;
}

function showBudget() {
  const totals = monthTotals(rows);
  const budgets = loadBudgets();
  const lines = CATEGORIES.map((cat) => {
    const spent = totals.byCategory[cat.id] || 0;
    const limit = budgets[cat.id];
    const pct = limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
    const left = limit - spent;
    return `<div class="budget-row" data-cat="${cat.id}">
      <span class="name"><span class="dot" style="display:inline-block;width:11px;height:11px;border-radius:3px;background:${cat.color};margin-right:7px"></span>${esc(cat.label)}</span>
      <span><span class="bar"><span class="${spent > limit ? 'over' : ''}" style="width:${pct}%"></span></span>
      <span class="meta">${money(spent)} of ${money(limit)} · ${pct}% used · ${left >= 0 ? money(left) + ' left' : money(-left) + ' over'}</span></span>
      <span class="edit"><input type="number" min="0" step="10" value="${limit}" aria-label="Budget for ${esc(cat.label)}" style="width:110px"> <button class="small" data-save-budget="${cat.id}">Save</button></span>
    </div>`;
  }).join('');
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const flashHtml = flash ? `<p class="notice">${esc(flash)}</p>` : '';
  flash = '';
  return `${flashHtml}
  <h1>Budgets for November</h1>
  <p class="lede">Planned spending ${money(totalBudget)} across nine categories; actual spending so far ${money(totals.spent)}. Change any budget and it saves in this browser.</p>
  <section class="panel">${lines}</section>
  <p class="tip" style="margin-top:14px"><b>Watch:</b> eating out is at ${Math.round(((totals.byCategory.eating || 0) / budgets.eating) * 100)}% of its ¥700 budget — one more family dinner and it tips over. Groceries and transport still have room.</p>`;
}

function showBills() {
  const bills = loadBills();
  const paidTotal = bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const dueTotal = bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
  const lines = bills.map((bill) => `<div class="bill-row">
    <span><b>${esc(bill.label)}</b> — ${money(bill.amount)}<br><span class="note">Due ${esc(bill.due)} · ${esc(bill.note)}</span></span>
    <span style="text-align:right"><span class="pill ${bill.paid ? '' : 'due'}">${bill.paid ? 'Paid' : 'Due soon'}</span><br>
    <button class="small ${bill.paid ? 'secondary' : ''}" data-bill="${bill.id}" style="margin-top:6px">${bill.paid ? 'Mark unpaid' : 'Mark paid'}</button></span>
  </div>`).join('');
  const flashHtml = flash ? `<p class="notice">${esc(flash)}</p>` : '';
  flash = '';
  return `${flashHtml}
  <h1>Fixed bills</h1>
  <p class="lede">Eight bills this month totalling ${money(paidTotal + dueTotal)}. Paid ${money(paidTotal)}; still to pay ${money(dueTotal)}.</p>
  <section class="panel">${lines}</section>
  <p class="tip" style="margin-top:14px"><b>Next up:</b> water ¥95 on Nov 15, then internet ¥129 on Nov 18. Both are covered by the ¥${(monthTotals(rows).left).toLocaleString('en-US')} left over this month.</p>`;
}

function showCharts() {
  const totals = monthTotals(rows);
  const parts = CATEGORIES.map((cat) => ({ label: cat.label, value: totals.byCategory[cat.id] || 0, color: cat.color })).filter((p) => p.value > 0);
  const monthRows = MONTHS.map((m) => `<tr><td>${m.month}</td><td class="num">${money(m.income)}</td><td class="num">${money(m.spent)}</td><td class="num">${money(m.income - m.spent)}</td></tr>`).join('');
  return `<h1>Charts: six months of money</h1>
  <p class="lede">Income has held above spending every month since June. November is the strongest month yet for income, and spending is running just under the six-month average.</p>
  <section class="panel"><h2>Where November's money went</h2>${shareDonut(parts)}
    <p>Housing is the biggest slice at ${Math.round(((totals.byCategory.housing || 0) / totals.spent) * 100)}%, then groceries at ${Math.round(((totals.byCategory.groceries || 0) / totals.spent) * 100)}%. The three smallest — clothing, health and eating out — together are about an eighth of spending.</p></section>
  <section class="panel"><h2>Income vs spending, Jun – Nov</h2>${trendChart(MONTHS)}
    <table style="margin-top:10px"><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Left over</th></tr></thead><tbody>${monthRows}</tbody></table></section>`;
}

function showSettings() {
  const totals = monthTotals(rows);
  const flashHtml = flash ? `<p class="notice">${esc(flash)}</p>` : '';
  flash = '';
  return `${flashHtml}
  <h1>Settings &amp; export</h1>
  <p class="lede">Your ledger lives only in this browser (localStorage). Export it any time, or start again from the November sample.</p>
  <section class="panel"><h2>Household</h2>
    <p><b>${esc(HOUSEHOLD.name)}</b> · ${esc(HOUSEHOLD.month)}<br>Members: ${esc(HOUSEHOLD.members.join(', '))}<br>
    Entries in the ledger: ${rows.length} (${rows.filter((r) => r.kind === 'income').length} income, ${rows.filter((r) => r.kind === 'expense').length} spending)<br>
    Totals: income ${money(totals.income)} · spent ${money(totals.spent)} · left ${money(totals.left)}</p></section>
  <section class="panel"><h2>Export the ledger</h2>
    <p>Download everything as a spreadsheet file or as JSON, to keep or to share with the family.</p>
    <p><button id="export-csv">Download CSV</button> <button class="secondary" id="export-json">Download JSON</button></p></section>
  <section class="panel"><h2>Start again</h2>
    <p>Restores the original November sample — all entries you added are removed.</p>
    <p><button class="secondary" id="reset-data">Reset to the November sample</button></p></section>`;
}

function wirePage(page) {
  for (const btn of view.querySelectorAll('[data-delete]')) {
    btn.addEventListener('click', () => {
      rows = removeEntry(rows, btn.dataset.delete);
      flash = 'Entry deleted.';
      route();
    });
  }
  if (page === 'add') {
    const form = document.getElementById('add-form');
    const kind = document.getElementById('f-kind');
    const cat = document.getElementById('f-cat');
    kind.addEventListener('change', () => {
      cat.disabled = kind.value === 'income';
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const amount = Number(document.getElementById('f-amount').value);
      const note = document.getElementById('f-note').value.trim();
      const date = document.getElementById('f-date').value;
      if (!amount || amount <= 0 || !note || !date) return;
      rows = addEntry(rows, {
        date,
        kind: kind.value,
        category: kind.value === 'income' ? 'income' : cat.value,
        amount: Math.round(amount),
        note,
      });
      flash = `Saved: ${note} — ${money(amount)}.`;
      location.hash = '#/overview';
      route();
    });
    document.getElementById('clear-form').addEventListener('click', () => form.reset());
  }
  if (page === 'budget') {
    for (const btn of view.querySelectorAll('[data-save-budget]')) {
      btn.addEventListener('click', () => {
        const rowEl = btn.closest('.budget-row');
        const input = rowEl.querySelector('input');
        saveBudget(btn.dataset.saveBudget, Number(input.value));
        flash = `${categoryLabel(btn.dataset.saveBudget)} budget saved as ${money(Number(input.value))}.`;
        route();
      });
    }
  }
  if (page === 'bills') {
    for (const btn of view.querySelectorAll('[data-bill]')) {
      btn.addEventListener('click', () => {
        const bills = toggleBill(btn.dataset.bill);
        const bill = bills.find((b) => b.id === btn.dataset.bill);
        flash = `${bill.label} marked ${bill.paid ? 'paid' : 'unpaid'}.`;
        route();
      });
    }
  }
  if (page === 'settings') {
    document.getElementById('export-csv').addEventListener('click', () => {
      downloadFile('rivera-ledger-november-2026.csv', toCsv(rows), 'text/csv');
    });
    document.getElementById('export-json').addEventListener('click', () => {
      downloadFile('rivera-ledger-november-2026.json', JSON.stringify(rows, null, 2), 'application/json');
    });
    document.getElementById('reset-data').addEventListener('click', () => {
      rows = resetLedger();
      flash = 'Ledger reset to the November sample.';
      route();
    });
  }
}

window.addEventListener('hashchange', route);
route();
