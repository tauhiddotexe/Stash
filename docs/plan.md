# Build Plan — Stash (Expense Tracker)

> Local-first, mobile-first personal expense tracker with an Apple-inspired UI/UX.
> Written from `/docs/PROJECT_CONTEXT.md`, `/docs/prd.md`, and `/docs/architecture&security.md`.

## 1. Product Summary

Stash lets a user record an expense (amount, optional description, optional category, date) in a few
seconds, stores it locally in the browser (IndexedDB), and instantly reflects it in:

- A **Dashboard** tab: total for the selected period, quick Today/Week/Month summaries, a spending-trend
  chart, a category breakdown (donut + list), and recent expenses.
- An **Expenses** tab: grouped, chronological history with search + category filter.
- **Add / Edit / Delete** via a native-feeling iOS bottom sheet.

No backend, no auth, no accounts, no network dependency. Currency: INR (₹).

## 2. Technology Stack (from architecture doc)

| Concern     | Choice                                          |
| ----------- | ----------------------------------------------- |
| Framework   | React 18 + TypeScript                           |
| Build       | Vite                                            |
| Styling     | Tailwind CSS v4 (`@tailwindcss/vite` plugin)    |
| Charts      | Recharts (area trend + donut breakdown)         |
| Storage     | IndexedDB behind a small typed repository layer |
| State       | React Context + hooks (no Redux/backend)        |
| Routing     | Client-side tabs synced to `#hash` (2 tabs)     |
| Icons       | Native SVGs matching SF Symbols style            |
| Motion      | CSS transitions + tiny keyframe animations, respecting `prefers-reduced-motion` |

Sources consulted for design/app behavior:

- `~/.agents/skills/mobile-ios-design`
- `~/.agents/skills/ios-hig-design`
- `~/.agents/skills/frontend-design`
- `~/.agents/skills/gstack` (browser QA/dogfooding)

## 2. Apple Design System

Faithful to Apple HIG without copying proprietary assets. Three pillars: **Clarity, Deference, Depth**.

### 2.1 Typography (San Francisco system stack)

Semantic text styles, no hardcoded sizes authored loosely:

| Token      | Size / Weight                       | Usage                              |
| ---------- | ----------------------------------- | ---------------------------------- |
| `largeTitle` | 34 / Bold                        | Screen titles (collapses on scroll)|
| `title`    | 22 / SemiBold / Bold                | Sheet titles, hero number          |
| `headline` | 17 / SemiBold                       | Card titles, primary actions       |
| `body`     | 17 / Regular                       | List rows, descriptions            |
| `subheadline` | 15 / Regular                     | Secondary text                     |
| `footnote` | 13 / Regular                        | Timestamps, captions               |
| `caption`  | 12 / Regular                          | Micro-labels                       |

Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", sans-serif` — renders as SF on Apple devices, native-looking everywhere, no CDN font download (privacy + offline).

### 2.2 Color tokens (semantic, adapt to light/dark)

| Token                  | Light            | Dark             |
| ---------------------- | ---------------- | ---------------- |
| `--bg-primary`         | `#FFFFFF`        | `#000000`        |
| `--bg-secondary`       | `#F2F2F7`        | `#1C1C1E`        |
| `--bg-tertiary`        | `#FFFFFF`        | `#2C2C2E`        |
| `--label-primary`      | `#000000`        | `#FFFFFF`        |
| `--label-secondary`    | `rgba(60,60,67,.6)` | `rgba(235,235,245,.6)` |
| `--label-tertiary`     | `rgba(60,60,67,.35)` | `rgba(235,235,245,.3)` |
| `--separator`          | `rgba(60,60,67,.29)` | `rgba(84,84,88,.6)` |
| `--accent` (tint)      | `#007AFF` (dark: `#0A84FF`) | same via media |
| `--destructive`        | `#FF3B30` / `#FF453A`         |                     |

iOS-style system colors reused as **category identity colors** (light/dark variants):

| Category    | Light hex  | Dark hex  |
| ----------- | ---------- | --------- |
| Food        | `#FF9500`  | `#FF9F0A` |
| Travel      | `#007AFF`  | `#0A84FF` |
| Shopping    | `#FF2D55`  | `#FF375F` |
| Bills       | `#5856D6`  | `#5E5CE6` |
| Health      | `#34C759`  | `#30D158` |
| Entertainment | `#AF52DE` | `#BF5AF2` |
| Education   | `#FFCC00`  | `#FFD60A` |
| Work        | `#5AC8FA`  | `#64D2FF` |
| Other       | `#8E8E93`  | `#98989D` |

### 2.3 Radii, shadows, motion

- Radius scale: `10/12` surfaces, `14` grouped-list insets, `20` sheet top, pill for buttons/chips, `squircle` feel via 60% continuous style.
- Shadows: restrained — `0 1px 2px rgba(0,0,0,.04)`, elevated: `0 8px 24px rgba(0,0,0,.08)`.
- Motion: 250–350 ms spring-ish ease; bottom sheet slides up with drag-to-dismiss; simple fade/scale for modal.
- Respect `prefers-reduced-motion`.

### 2.4 iOS idioms to follow

- **Tab bar** (49pt, 2–3 tabs, translucent with blur) — never a hamburger menu.
- **Large title** that collapses on scroll.
- **Bottom sheet** for Add/Edit Expense (drag-down dismiss, swipe gestures respected).
- Destroy actions in **red with confirmation**.
- **44×44 pt** minimum touch targets.
- **Safe areas** (`env(safe-area-inset-*)`) all around.
- Semantic colors + Dark Mode parity.
- Clear focus states, keyboard nav, ARIA labels, contrast ≥ 4.5:1.

## 3. Information Architecture

```
/            → Dashboard tab (default)
/expenses    → Expenses history tab
+ Add button → Always-visible center "Add" capsule → bottom sheet
Tab bar: [Insights] [Add] [Expenses]
```

- The **Add action is prominent and persistent** (iOS-style bottom action row), not buried.
- Dashboard answers: today/week/month? where's money going? trend? recent?

## 4. Data Layer

### 4.1 Expense entity (`src/types/expense.ts`)

```ts
interface Expense {
  id: string; // crypto.randomUUID()
  amount: number; // positive, decimal, INR. NEVER stored formatted
  description?: string; // plain text, optional
  category?: CategoryId; // from predefined set or undefined = "Other"
  date: string; // "YYYY-MM-DD" local calendar date
  createdAt: string; // ISO timestamp
  updatedAt: string;
}
```

### 4.2 IndexedDB repository (`src/lib/db/`)

Thin, private abstraction; UI never touches IndexedDB directly.

```
ExpenseRepository
├── init()            // open DB, create object store + index on date
├── getAll()
├── getById(id)
├── create(expense)
├── update(expense)
└── delete(id)
```

- Table `expenses`, keyPath `id`, index `by_date` on `date`.
- Errors mapped to user-friendly messages at the app boundary.

### 4.3 Domain calculations (`src/lib/calc/`)

Pure, deterministic functions computed from `Expense[]` (single source of truth is the records — totals are always derived, never stored):

```
sum(expenses)
filterByRange(expenses, start, end)       // inclusive
totalInRange(...)
groupByCategory(rangeExpenses)            // → [{category, total, count}]
groupByDay(rangeExpenses, start, end)     // → [{date, total}] zero-filled
groupByWeek(expenses, year)               // weekly buckets for trend
cumulativeDelta(rangeExpenses)             // best/worst day for insight
```

### 4.4 Dates (`src/lib/dates/`)

- Store expense date as **local calendar date string `YYYY-MM-DD`** — never shift on UTC conversion.
- `toDateKey(date)`, `parseDateKey(key)`, `isInRange`, `rangeFor(period, anchorDate)`, `weekRange(date)`, `monthRange(date)`.
- Inclusive ranges everywhere.

### 4.5 Formatting (`src/lib/format.ts`)

- Money: `formatINR(n)` → `₹1,250` using `Intl.NumberFormat('en-IN')`.
- Dates: `Intl.DateTimeFormat` for human labels ("Aug 9, Tuesday Today", "This week").

### 4.6 Validation (`src/lib/validation.ts`)

- Amount: required, numeric string, > 0, reject NaN/Infinity/negative/absurd (e.g. `> 100_000_000`).
- Description: optional, trimmed, max ~120 chars, rendered as escaped text (no `dangerouslySetInnerHTML`).
- Category: must be one of the predefined ids (type-checked at runtime).
- Date: valid calendar date, not in the future.

## 5. Screens & Components

### 5.1 Dashboard tab

1. **Hero metric** — big total + "Spent this {Day/Week/Month}".
2. **Segmented control** (Day / Week / Month / Custom). Custom opens a date-range picker surface (two date inputs).
3. **Quick summary row** — Today / This week / This month compact figures.
4. **Trend chart** — Recharts `AreaChart` (sparkline-style, no gridlines, gradient fill matching accent/category), ticks adapt: daily for day range, daily for week, daily for month, aggregated for custom range.
5. **Category breakdown** — donut (`PieChart`) + legend list with amounts & %.
6. **Recent expenses** — last ~5 with "View all" → Expenses tab.
7. Insight chip (Apple-brand subtle): strongest/weakest spending day.

### 5.2 Expenses tab

- Search field (iOS-style rounded, magnifier).
- Category filter chips row.
- History grouped by date with per-day subtotal headers.
- Row: category-colored icon tile → description (or category label), subheadline date, amount `₹` semibold.
- Tap row → opens Edit sheet; swipe-to-delete handled via a confirm sheet.
- Empty state: friendly illustration + "Add your first expense" CTA.

### 5.3 Add / Edit sheet

- `Amount` field: large (title 28) with `₹` prefix, numeric keypad, floating label.
- Description: optional, placeholder "Optional".
- Category grid (2–5 columns of colored Apple-style app-icon tiles).
- Date: inline iOS-style picker (spinner feel via scrollable columns or chip presets) defaulting Today, no future dates.
- Primary button fill accent, disabled until valid; Haptic-like success check + toast, sheet slides back down.

### 5.4 Shared UI primitives

`Button`, `IconButton`, `Card`, `Sheet` (drag/dismiss), `Alert` (delete confirm), `SegmentedControl`, `Chip`, `EmptyState`, `Spinner`, `SkeletonBlock`, `Toast`, `TabBar`, `ScrollCollapseHeader`.

## 6. App Shell & State

```
App
├── ThemeProvider (light / dark / system, persisted, respects system)
├── ExpensesProvider (records + CRUD + derived selectors, memoized)
├── UIProvider (sheet, alert, toast, haptics)
└── Tabs (Dashboard ↔ Expenses) via hash router
```

- Idea: derived values recomputed with `useMemo` keyed on `expenses` — cheap up to tens of thousands of rows.
- Startup lifecycle: init db → load → derive → render; on failure show friendly error with retry.

## 7. Build Phases

1. Scaffold Vite + React + TS + Tailwind v4.
2. Design tokens & base primitives (Sheet, Alert, SegmentedControl, TabBar).
3. Data layer: types → repository (IndexedDB) → calculations → validation.
4. Expense sheet (add/edit) + delete flow.
5. Dashboard (hero, summary, trend, category donut, recent).
6. Expenses history (grouping, search/filter).
7. Shell polish: empty/error states, dark mode, responsive desktop page.
8. QA: `npm run build` + gstack browser walkthrough at mobile & desktop widths, then fix issues.

## 7. Acceptance Mapping (from PRD)

- Add/Edit/Delete persist after refresh (IndexedDB) ✓
- Daily / Weekly / Monthly / Custom filters all recompute: total, chart, categories, lists ✓
- MOBILE responsive as primary; desktop breathes into a centered app frame ✓
- Light + dark + system theme ✓
- Empty states for new users & empty periods ✓
- Friendly error copy; no stack traces ✓