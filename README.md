# makefun-household-budget-site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/2091608355-hub/makefun-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/2091608355-hub/makefun-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth & Ledger is a working household budget site for one fictional family, the Riveras, in November 2026. It runs entirely from static files — no build step, no network requests, nothing leaves the browser.

What it does:

- **Overview** — November income (¥18,160), spending (¥12,150) and what is left (¥6,010), the biggest spending categories, the savings goal and the latest entries.
- **Add entry** — record income or spending with a category, amount, date and note; totals update at once and entries can be deleted. Everything is kept in localStorage.
- **Budgets** — nine categories with a budget each, a progress bar, how much is used and how much is left; any budget can be edited and saved.
- **Bills** — the eight fixed bills of the month with due dates, paid / due-soon states and a button to mark each one paid.
- **Charts** — a donut of where November's money went and a six-month income-vs-spending bar chart with the monthly figures.
- **Settings & export** — household details, download the ledger as CSV or JSON, and reset to the November sample.

The figures are a consistent sample ledger: 48 entries across nine categories, with category totals, budget bars and charts all computed from the same data, so the numbers always agree. The layout works on a desktop and on a phone.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the overview is the front page, and every other page is one click away in the top navigation.

---

<sub>Entered on [make.fun](https://make.fun/?ref=dm27hy8w&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
