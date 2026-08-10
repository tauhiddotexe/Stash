<div align="center">

![Stash](docs/pics/ui-basic.jpeg)

### **Stash** — A local-first personal expense tracker

Record spending in seconds. Understand your habits.
No accounts. No cloud. Your data stays on your device.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-007AFF?style=for-the-badge)](LICENSE.md)

[Live Demo](https://tauhiddotexe.github.io/Stash/) · [Report Bug](https://github.com/tauhiddotexe/Stash/issues) · [Request Feature](https://github.com/tauhiddotexe/Stash/issues)

</div>

---

<div align="center">

![UI Light & Dark](docs/pics/ui-2(light%26dark_mode%2C%20illustration%2Cdelete-btn).jpeg)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Screens](#key-screens)
- [Architecture](#architecture)
- [Data & Privacy](#data--privacy)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Stash** is a mobile-first, local-first personal expense tracking web application. It lets you record an expense in a few seconds — amount, optional description, optional category, date — and instantly reflects it across a dashboard of spending totals, trends, and category breakdowns.

There is no backend, no authentication, no accounts, and no network dependency for core functionality. Your expense data lives in your browser's IndexedDB and never leaves your device.

> Recording an expense should take only a few seconds. Analytics should help you understand your spending without overwhelming you.

### Who is this for?

Individuals who want a lightweight, private way to track personal spending — without the overhead of a full financial dashboard, a sign-up flow, or a subscription.

---

## Features

### Core

- **Add Expense** — amount, description, category, and date in a fast bottom-sheet form
- **Edit & Delete** — modify or remove any expense with confirmation safeguards
- **Expense History** — chronological, date-grouped list with search and category filtering
- **Dashboard** — period total, quick Today/Week/Month summaries, spending-trend chart, category donut breakdown, and recent expenses

### Analytics

- **Spending Trend** — adaptive area chart (daily for short ranges, weekly up to ~8 months, monthly beyond)
- **Category Breakdown** — donut chart + legend with amounts and percentages
- **Period Comparison** — delta indicator showing % change vs. the previous period
- **Biggest Day Insight** — highlights the highest-spending day in the selected period

### Experience

- **Light, Dark & System themes** — smooth crossfade toggle, persisted preference
- **Mobile-first responsive design** — optimized for phones, adapts gracefully to tablets and desktop
- **Bottom sheet** — native-feeling Add/Edit form with drag-to-dismiss
- **Empty states** — friendly illustrations with clear calls to action
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation, 44×44pt touch targets, ≥ 4.5:1 contrast, reduced-motion support
- **Offline-ready** — works without an internet connection after first load

---

## Tech Stack

| Concern | Choice |
| :--- | :--- |
| Framework | React 19 + TypeScript 7 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Charts | Recharts (area trend + donut breakdown) |
| Storage | IndexedDB behind a typed repository layer |
| State | React Context + hooks (no external state library) |
| Routing | Client-side tabs synced to `#hash` |
| Icons | Phosphor Icons (SVG, theme-adaptive) |
| Motion | CSS transitions + keyframe animations, respects `prefers-reduced-motion` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [npm](https://www.npmjs.com/) ≥ 9 (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/tauhiddotexe/Stash.git
cd Stash

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build      # TypeScript check + production build to /dist
npm run preview    # Preview the production build locally
```

---

## Project Structure

```
Stash/
├── docs/                       # Project documentation & screenshots
│   ├── pics/                   # UI screenshots for README
│   ├── prd.md                  # Product Requirements Document
│   ├── architecture&security.md
│   ├── PROJECT_CONTEXT.md
│   └── plan.md
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                 # Shared primitives (Button, Card, Sheet, Alert, Toast, ...)
│   │   ├── dashboard/          # DashboardPage, TrendChart, CategoryBreakdown, RecentExpenses
│   │   ├── expense/            # ExpenseForm, ExpenseListItem, CalendarPicker, CategoryPicker
│   │   └── expenses/           # ExpensesPage
│   ├── hooks/                  # useResolvedColors, useStagger
│   ├── lib/
│   │   ├── db/                 # IndexedDB repository layer
│   │   ├── dates.ts            # Date utilities (timezone-safe)
│   │   ├── calc.ts             # Pure domain calculations
│   │   ├── format.ts           # INR formatting
│   │   ├── validation.ts       # Form validation rules
│   │   ├── motion.ts           # Animation config
│   │   └── categories.ts       # Category definitions
│   ├── state/                  # React Context providers (expenses, theme, ui)
│   ├── types/                  # TypeScript type definitions
│   ├── AppShell.tsx            # Root layout, header, tab bar, sheets
│   ├── App.tsx                 # App entry composition
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Design tokens, base styles, animations
├── CONTRIBUTING.md
├── LICENSE.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Key Screens

### Dashboard

The main analytical screen. Shows the total for the selected period (Day / Week / Month / Custom), quick Today/Week/Month summary cards, an adaptive spending-trend area chart, a category donut breakdown with legend, and recent expenses with a "View all" link.

### Expenses

Full chronological history grouped by date with per-day subtotals. Includes a search field and category filter chips. Tap any row to edit; delete with confirmation.

### Add / Edit Sheet

A bottom sheet with a large amount input, optional description, category grid, and date picker. Drag down to dismiss. Validates on save and shows a toast on success.

---

## Architecture

Stash is a client-side, local-first application. There is no backend.

```
┌──────────────────────────────────┐
│           User Interface         │
│        React + TypeScript        │
├──────────────────────────────────┤
│         Application Layer        │
│   State + Business Logic         │
│   Validation + Calculations      │
├──────────────────────────────────┤
│           Data Layer             │
│        IndexedDB Storage         │
└──────────────────────────────────┘
```

### Principles

- **Local First** — expense data lives on the device; the app works without a network
- **Single Source of Truth** — expense records are authoritative; all dashboard metrics are derived from them (never stored independently)
- **Separation of Concerns** — UI → application logic → domain calculations → storage
- **Deterministic Calculations** — pure functions produce the same output for the same inputs

### Data Flow

```
User → Form → Validation → Repository → IndexedDB
                                              ↓
User ← UI ← Derived State ← Application State ←
```

### State Management

Three React Context providers:

| Provider | Responsibility |
| :--- | :--- |
| `ThemeProvider` | Light / dark / system theme, persisted, respects system preference |
| `ExpensesProvider` | Expense records + CRUD operations + memoized derived selectors |
| `UIProvider` | Sheet, alert, toast, haptics |

Derived values are recomputed with `useMemo` keyed on `expenses` — fast even as history grows to thousands of records.

---

## Data & Privacy

- **No backend** — expense records never leave the device
- **No tracking** — no analytics, ads, or external requests
- **No secrets** — no API keys in client-side code
- **Input validation** — all user input validated before storage
- **XSS prevention** — descriptions render as plain text; no `dangerouslySetInnerHTML`
- **Safe deletion** — destructive actions require confirmation and target by unique ID

---

## Future Scope

Planned enhancements for future versions:

| Feature | Description |
| :--- | :--- |
| **Budgets** | Set monthly/category budgets with progress indicators |
| **Recurring Expenses** | Auto-log repeating expenses (rent, subscriptions) |
| **Export / Import** | CSV export and import for data portability |
| **PWA Installation** | Installable app with offline reliability |
| **Cloud Backup** | Optional encrypted backup with authentication |
| **Multi-Currency** | Support for currencies beyond INR |
| **Receipt Capture** | Photo attachment / OCR for receipts |
| **Cross-Device Sync** | Synchronization across multiple devices |

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get involved.

---

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

---

<div align="center">

Built with attention to detail — because personal finance should feel personal.

</div>
