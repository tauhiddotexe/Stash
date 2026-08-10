import { Suspense, lazy, useMemo, useState } from "react";
import type { Period, Range } from "../../lib/dates";
import {
  addDays,
  endOfWeek,
  formatDayOfMonth,
  formatFullDate,
  formatMonth,
  formatWeekRange,
  monthEnd,
  monthStart,
  startOfWeek,
  todayKey,
  toDateKey,
} from "../../lib/dates";
import { buildTrend, filterByRange, groupByCategory, groupByDay, sum } from "../../lib/calc";
import type { TrendBucket } from "../../lib/calc";
import { formatINR } from "../../lib/format";
import { useExpenses } from "../../state/expenses";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { EmptyState } from "../ui/EmptyState";
import { RecentExpenses } from "./RecentExpenses";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import type { TabId } from "../ui/TabBar";
import type { Expense } from "../../types/expense";

interface DashboardPageProps {
  onNavigate: (tab: TabId) => void;
  onEditExpense: (expense: Expense) => void;
  onAdd: () => void;
}

const PERIOD_OPTIONS = [
  { value: "day" as const, label: "Day" },
  { value: "week" as const, label: "Week" },
  { value: "month" as const, label: "Month" },
  { value: "custom" as const, label: "Custom" },
];

/* Charts pull in Recharts (~180KB gz) — load them on demand so the shell
   reaches first paint without a heavy chart bundle on the main thread. */
const TrendChart = lazy(() => import("./TrendChart").then((m) => ({ default: m.TrendChart })));
const CategoryBreakdown = lazy(() =>
  import("./CategoryBreakdown").then((m) => ({ default: m.CategoryBreakdown })),
);

function TrendSkeleton() {
  return (
    <div className="flex h-32 items-end gap-2 px-1">
      {[45, 70, 38, 85, 55, 95, 62, 40, 75, 50].map((h, i) => (
        <div key={i} className="skeleton-block w-full rounded-[6px]" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function DonutSkeleton() {
  return (
    <div className="flex items-center gap-5">
      <div className="skeleton-block h-32 w-32 shrink-0 rounded-full" />
      <div className="flex-1 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton-block h-4 w-full rounded-[6px]" />
        ))}
      </div>
    </div>
  );
}

export function DashboardPage({ onNavigate, onEditExpense, onAdd }: DashboardPageProps) {
  const { expenses } = useExpenses();
  const today = todayKey();
  const [period, setPeriod] = useState<Period>("month");
  const [anchor, setAnchor] = useState(today);
  const [custom, setCustom] = useState<Range>({ start: monthStart(today), end: today });

  const range: Range = useMemo(() => {
    if (period === "custom") return custom;
    return rangeForPeriod(period, anchor);
  }, [period, anchor, custom]);

  const rangeExpenses = useMemo(() => filterByRange(expenses, range.start, range.end), [expenses, range]);
  const total = useMemo(() => sum(rangeExpenses), [rangeExpenses]);
  const slices = useMemo(() => groupByCategory(rangeExpenses), [rangeExpenses]);
  const trend = useMemo(() => buildTrend(expenses, range.start, range.end), [expenses, range]);

  const summary = useMemo(() => {
    const day = sum(filterByRange(expenses, today, today));
    const w = rangeForPeriod("week", today);
    const week = sum(filterByRange(expenses, w.start, w.end));
    const m = rangeForPeriod("month", today);
    const month = sum(filterByRange(expenses, m.start, m.end));
    return { day, week, month };
  }, [expenses, today]);

  const biggestDay = useMemo(() => {
    if (trend.bucket !== "day") return null;
    const days = groupByDay(rangeExpenses, range.start, range.end).filter((d) => d.total > 0);
    if (days.length < 2) return null;
    return days.reduce((a, b) => (b.total > a.total ? b : a));
  }, [rangeExpenses, range, trend.bucket]);

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon="chart"
        title="No expenses yet"
        subtitle="Start tracking your spending by adding your first expense. It takes a few seconds."
        actionLabel="Add Expense"
        onAction={onAdd}
      />
    );
  }

  const periodLabel =
    period === "day"
      ? formatFullDate(range.start)
      : period === "week"
        ? formatWeekRange(range.start, range.end)
        : period === "month"
          ? formatMonth(range.start)
          : "Custom range";

  const canPrev = range.start > "2000-01-15";
  const canNext = period === "custom" ? false : hasNextRange(period, anchor, today);

  const shift = (dir: -1 | 1) => setAnchor(shiftAnchor(period, anchor, dir));

  return (
    <div className="px-5 pt-4 pb-32">
      <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canPrev}
          aria-label="Previous period"
          className="flex h-10 w-10 items-center justify-center rounded-full text-accent hover:bg-accent-soft disabled:opacity-25 active:bg-accent-soft transition-colors"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
        <div className="min-w-0 px-1 text-center">
          <div className="truncate text-headline font-semibold">{periodLabel}</div>
          <button
            type="button"
            onClick={() => setAnchor(today)}
            disabled={anchor === today}
            className="mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-footnote font-medium text-accent disabled:opacity-0 active:bg-accent-soft transition-all"
          >
            <Icon name="calendar" size={13} />
            Today
          </button>
        </div>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canNext}
          aria-label="Next period"
          className="flex h-10 w-10 items-center justify-center rounded-full text-accent hover:bg-accent-soft disabled:opacity-30 active:bg-accent-soft transition-colors"
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>

      {period === "custom" ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <CustomDateInput
            label="From"
            value={custom.start}
            max={custom.end}
            onChange={(v) => setCustom((c) => ({ ...c, start: v }))}
          />
          <CustomDateInput
            label="To"
            value={custom.end}
            max={today}
            onChange={(v) => setCustom((c) => ({ ...c, end: v }))}
          />
        </div>
      ) : null}

      {/* Hero */}
      <div className="mt-6 text-center">
        <div className="text-[20px] font-semibold text-label-secondary">{PERIOD_HEADERS[period]}</div>
        <div className="mt-1 text-[44px] font-bold leading-none tracking-tight tabular-nums">
          <AnimatedNumber value={total} format={formatINR} />
        </div>
        <div className="mt-1.5 text-footnote text-label-tertiary">
          {rangeExpenses.length} {rangeExpenses.length === 1 ? "entry" : "entries"} this period
        </div>
      </div>

      {/* Quick summary */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <SummaryCard label="Today" value={summary.day} />
        <SummaryCard label="This week" value={summary.week} />
        <SummaryCard label="This month" value={summary.month} />
      </div>

      {/* Trend */}
      <Card className="mt-5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-title-3 font-semibold">Spending</h2>
          <span className="text-footnote text-label-secondary">{TREND_SUBTITLES[trend.bucket]}</span>
        </div>
        <Suspense fallback={<TrendSkeleton />}>
          <TrendChart points={trend.points} bucket={trend.bucket} empty={total === 0} />
        </Suspense>
        {biggestDay ? (
          <div className="mt-2 flex items-center gap-2 rounded-iosgroup bg-bg-secondary px-3 py-2.5 text-footnote">
            <Icon name="chartLine" size={15} className="text-accent" />
            <span className="text-label-secondary">Biggest day</span>
            <span className="ml-auto font-semibold tabular-nums">
              {formatDayOfMonth(biggestDay.date)} · {formatINR(biggestDay.total)}
            </span>
          </div>
        ) : null}
      </Card>

      {/* Categories */}
      <Card className="mt-5 p-4">
        <h2 className="mb-3 text-title-3 font-semibold">Categories</h2>
        <Suspense fallback={<DonutSkeleton />}>
          <CategoryBreakdown slices={slices} total={total} />
        </Suspense>
      </Card>

      <RecentExpenses expenses={expenses} onPress={onEditExpense} onViewAll={() => onNavigate("expenses")} />
    </div>
  );
}

/* ---------- helpers ---------- */

function rangeForPeriod(period: Period, anchor: string): Range {
  if (period === "day") return { start: anchor, end: anchor };
  if (period === "week") return { start: startOfWeek(anchor), end: endOfWeek(anchor) };
  return { start: monthStart(anchor), end: monthEnd(anchor) };
}

function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function shiftAnchor(period: Period, anchor: string, dir: -1 | 1): string {
  if (period === "day") return addDays(anchor, dir);
  if (period === "week") return addDays(anchor, dir * 7);
  const d = parseKey(anchor);
  return toDateKey(new Date(d.getFullYear(), d.getMonth() + dir, 1));
}

function hasNextRange(period: Period, anchor: string, today: string): boolean {
  if (period === "day") return addDays(anchor, 1) <= today;
  if (period === "week") return addDays(anchor, 7) <= today;
  const d = parseKey(anchor);
  const nextMonthStart = toDateKey(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  return nextMonthStart <= monthStart(today);
}

const PERIOD_HEADERS: Record<Period, string> = {
  day: "Spent today",
  week: "Spent this week",
  month: "Spent this month",
  custom: "Total spent",
};

const TREND_SUBTITLES: Record<TrendBucket, string> = {
  day: "Daily totals",
  week: "Weekly totals",
  month: "Monthly totals",
};

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-ioscard bg-card border border-card-stroke px-2.5 py-3 text-center shadow-card">
      <div className="text-caption-2 font-semibold uppercase tracking-wide text-label-tertiary">{label}</div>
      <div className="mt-0.5 truncate text-headline font-bold tabular-nums leading-snug tracking-tight">
        {formatINR(value)}
      </div>
    </div>
  );
}

function CustomDateInput({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: string;
  max: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-caption font-medium text-label-secondary">{label}</span>
      <input
        type="date"
        value={value}
        min="2000-01-01"
        max={max}
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value);
        }}
        className="mt-1 h-12 w-full rounded-iosgroup border border-card-stroke bg-bg-tertiary px-3 text-headline font-medium outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}