# Finance Dashboard UI

Local-first **financial console** demo: dashboards, ledger, planning, and analytics. **No backend** — React + Zustand; data persists in the browser (`localStorage`).

**Zorvyn-style positioning** (copy only): UI language nods to [Zorvyn](https://www.zorvyn.io/about) themes. This repo is **not** a Zorvyn product and **does not** claim certifications (SOC 2, ISO 27001, etc.).

## Stack

React 18 · Vite 5 · Tailwind · React Router 6 · Zustand (`persist`) · Recharts · date-fns · lucide-react

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve dist
```

## Features (by area)

| Area | Route | What it does |
|------|--------|----------------|
| **Dashboard** | `/` | KPI cards (balance, income, expense, count) with MoM badges; **Advanced signals** (runway, savings rate, avg net, budget pressure); balance trend + expense breakdown charts; quick links to Ledger / Planning / Pulse. |
| **Transactions** | `/transactions` | Search, category, type, **tag**, date range; sortable table; **tags** + optional **notes** per row; **CSV** + **JSON** export of the filtered set; **Admin**: add/edit/delete modal, **bulk select** (tag many / delete many), **auto-tag rules** (substring → tag; applied on new rows + optional “apply to ledger”). |
| **Planning** | `/planning` | **Budgets** vs current-month spend by category; **savings goals** + contributions; **cash flow outlook** chart (projection from trailing 3-month averages). |
| **Pulse** | `/pulse` | **Needs vs discretionary** split (heuristic categories); **weekend vs weekday** spend; **category spikes** (latest month vs prior 3-mo avg); **subscription radar** (tagged subs + recurring descriptions). |
| **Insights** | `/insights` | Classic aggregates (extremes, ratios, top categories by frequency); **recurring hints**; monthly income vs expense bars. |

**Cross-cutting**

- **Roles** — Header switcher: **Viewer** (read-only ledger) vs **Admin** (CRUD, bulk, rules, budgets/goals edits where shown). Not real auth.
- **Privacy** — Blur amounts in many surfaces + chart tooltips.
- **Dark mode** — Header toggle; persisted.
- **UX** — Toasts; ~800ms initial skeleton; **?** / help button for shortcuts; **Esc** + backdrop close on modals; skip link + focus styles; **404** page; dynamic **document** titles.

## Persistence (`localStorage`)

Persisted: transactions, dark mode, role, privacy mode, budgets, savings goals, auto-tag rules. Filters stay **session-only** (reset on reload).

## `src/` layout

```
src/
├── components/
│   ├── dashboard/   # Summary, charts, advanced metrics
│   ├── insights/    # Panel, recurring hints, charts
│   ├── layout/      # Shell, header, sidebar, toasts, keyboard help
│   ├── planning/    # Budgets, goals, forecast chart
│   ├── pulse/       # Modern analytics panel
│   ├── transactions/# Table, filters, form, auto-tag rules
│   └── ui/          # Shared e.g. SensitiveText
├── data/mockData.js
├── pages/           # Route screens (+ NotFoundPage)
├── store/useFinanceStore.js
├── utils/helpers.js # Format, filters, CSV/JSON, analytics helpers
└── App.jsx, main.jsx, index.css
```

## Limits (intentional demo)

No login, import, multi-user, or bank sync. Large ledgers may need table virtualization and chart downsampling.

## code by

chandu pn - chandupn.05@gmail.com
