# Finance Dashboard (Zorvyn-style demo)

A single-page **financial console** for tracking mock income and expenses, visualizing trends and category mix, and managing transactions with **role-based controls** (Admin vs Viewer). There is **no backend** — all data lives in the browser via Zustand, with optional persistence to `localStorage`.

**Zorvyn alignment (UI copy & positioning only):** The layout echoes themes from [Zorvyn’s About page](https://www.zorvyn.io/about) — *secure, compliant, and intelligent* operations and **unified visibility** into financial activity. This repository is an **independent local demo**, not a Zorvyn product, and **does not** imply SOC 2, ISO 27001, or other certifications. For Zorvyn’s real platform and compliance story, see [zorvyn.io](https://www.zorvyn.io/).

## Tech stack

- **React 18** (functional components + hooks)
- **Vite** (dev server & production build)
- **Tailwind CSS** (utility-first styling, `dark` class strategy)
- **Recharts** (responsive charts via `ResponsiveContainer`)
- **Zustand** (+ `persist` middleware for transactions, theme, and role)
- **date-fns** (parsing and formatting dates)
- **React Router v6** (client-side routing)
- **lucide-react** (icons)
- **prop-types** (runtime prop checks on presentational components)

## Features

- **Dashboard (`/`)** — Four summary cards (all-time balance, income, expenses, transaction count) with month-over-month trend badges, animated count-up on load, balance trend area chart (last six months), and expense donut with legend and custom tooltip.
- **Transactions (`/transactions`)** — Search, category filter, type filter, date range presets, sortable columns, row badges, CSV export of the **currently filtered** set, empty state, and skeleton rows during the initial simulated load.
- **Insights (`/insights`)** — Derived metrics (highest/lowest spending categories, peak expense/income months, average monthly expense, income-to-expense ratio, top categories by frequency) plus a grouped bar chart comparing income vs expense per month.
- **Role-based UI** — Header role switcher (`viewer` default). **Viewer** is read-only (no add / edit / delete). **Admin** can add transactions in a modal, edit via the same form, and delete with confirmation. Role is stored in Zustand and persisted.
- **Dark mode** — Toggle in the header; persists with the store. Page background uses light `#f8fafc` / `#ffffff` and dark `#0f172a` / `#1e293b` as specified.
- **Layout** — Collapsible sidebar on small screens, sticky header, responsive breakpoints (~375 / 768 / 1280+).
- **Optional enhancements (included)** — `persist` for transactions + `darkMode` + `role`; CSV export; animated summary numbers; toasts for add/edit/delete and export; ~800ms skeleton “load” on first mount.

## Setup & installation

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build   # production build to dist/
npm run preview # serve dist locally
```

## Folder structure

```
src/
├── components/
│   ├── layout/           # Sidebar, Header, TrustStrip, Layout shell, ToastStack
│   ├── dashboard/        # SummaryCards, charts, TrendBadge, summaryMetrics helper
│   ├── transactions/     # List, filters, form (+ fields), row, sortable header cell
│   └── insights/         # InsightsPanel, cards, monthly bar chart, computations
├── data/
│   └── mockData.js       # 30+ sample transactions
├── pages/                # Route-level screens
├── store/
│   └── useFinanceStore.js
├── utils/
│   └── helpers.js        # formatting, filters, sort, CSV, animation helper
├── App.jsx
├── main.jsx
└── index.css
```

Supporting files were added where needed to keep **each React component file under ~150 lines** while preserving the requested feature set (for example `TransactionFormFields.jsx`, `ToastStack.jsx`, `insightsComputations.js`).

## Screenshots

_Add screenshots here after running the app (dashboard, transactions with filters, insights chart, dark mode)._

Example filenames you might drop into a `docs/` folder:

- `docs/dashboard-light.png`
- `docs/transactions-admin.png`
- `docs/insights-dark.png`

## Design decisions

- **Zustand** — Minimal boilerplate for global UI state (role, filters, transactions, toasts) with a tiny API surface. The `persist` middleware gives durability without a custom `localStorage` layer.
- **Recharts** — Composes well with React, supports `ResponsiveContainer` for fluid charts, and covers line/area, pie/donut, and grouped bars without a separate charting DSL.
- **Tailwind + `dark` class** — Keeps styling colocated with markup, matches the indigo/violet primary and emerald/rose semantic colors, and toggles consistently with persisted state.
- **Mock-first** — No network layer keeps the app easy to run offline and makes charts deterministic; persistence lets you treat it like a lightweight local prototype.
- **Simulated latency** — A one-time 800ms delay before `dataReady` unifies skeleton UX across pages without mocking async APIs.

## Known limitations & future improvements

- **No authentication** — Role switching is a UI toggle only, not security.
- **Single-user** — No multi-profile or shared workspaces.
- **No import** — CSV is export-only; reversing the pipeline would need parsing and validation.
- **Charts aggregate local data** — Very large ledgers may warrant virtualization on the transactions table and downsampling for charts.
- **Bundle size** — Recharts contributes most of the JS payload; route-based code splitting could trim the initial download.

## License

This sample project is provided as-is for demonstration purposes.
