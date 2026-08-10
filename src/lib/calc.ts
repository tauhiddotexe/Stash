import type { CategoryId, Expense } from "../types/expense";
import { addDays, diffDays, isInRange, parseDateKey, startOfWeek, toDateKey } from "./dates";

export function sum(expenses: Expense[]): number {
  return expenses.reduce((acc, e) => acc + e.amount, 0);
}

export function filterByRange(expenses: Expense[], start: string, end: string): Expense[] {
  return expenses.filter((e) => isInRange(e.date, start, end));
}

export interface CategorySlice {
  category: CategoryId;
  colorVar: string;
  total: number;
  count: number;
}

export function groupByCategory(expenses: Expense[]): CategorySlice[] {
  const map = new Map<CategoryId, CategorySlice>();
  for (const e of expenses) {
    const id = e.category ?? "other";
    const existing = map.get(id);
    if (existing) {
      existing.total += e.amount;
      existing.count += 1;
    } else {
      map.set(id, { category: id, colorVar: `--cat-${id}`, total: e.amount, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export interface DayPoint {
  date: string;
  total: number;
}

/** Zero-filled daily series from start → end inclusive. */
export function groupByDay(expenses: Expense[], start: string, end: string): DayPoint[] {
  const totals = new Map<string, number>();
  for (const e of filterByRange(expenses, start, end)) {
    totals.set(e.date, (totals.get(e.date) ?? 0) + e.amount);
  }
  const points: DayPoint[] = [];
  const days = diffDays(start, end) + 1;
  for (let i = 0; i < days; i++) {
    const date = addDays(start, i);
    points.push({ date, total: totals.get(date) ?? 0 });
  }
  return points;
}

export interface TrendPoint {
  key: string;
  label: string;
  total: number;
}

export type TrendBucket = "day" | "week" | "month";

const CUTOFF_WEEK_DAYS = 62;
const CUTOFF_MONTH_WEEKS = 245;

/** Adaptive trend: daily candles ≤62 days, weekly up to ~8 months, monthly beyond. */
export function buildTrend(
  expenses: Expense[],
  start: string,
  end: string,
): { points: TrendPoint[]; bucket: TrendBucket } {
  const spanDays = diffDays(start, end) + 1;

  if (spanDays <= CUTOFF_WEEK_DAYS) {
    return {
      points: groupByDay(expenses, start, end).map((p) => ({
        key: p.date,
        label: shortDayLabel(p.date),
        total: p.total,
      })),
      bucket: "day",
    };
  }

  if (spanDays <= CUTOFF_MONTH_WEEKS) {
    return bucketize(expenses, start, end, "week");
  }
  return bucketize(expenses, start, end, "month");
}

function shortDayLabel(date: string): string {
  const d = parseDateKey(date);
  return `${d.getDate()} ${d.toLocaleDateString("en-IN", { month: "short" })}`;
}

function bucketOf(key: string, bucket: TrendBucket): string {
  if (bucket === "week") return startOfWeek(key);
  return `${key.slice(0, 7)}-01`;
}

function bucketize(
  expenses: Expense[],
  start: string,
  end: string,
  bucket: TrendBucket,
): { points: TrendPoint[]; bucket: TrendBucket } {
  const totals = new Map<string, number>();
  const labelOf = new Map<string, string>();
  let cursor = start;
  const last = end;
  do {
    const b = bucketOf(cursor, bucket);
    totals.set(b, 0);
    if (!labelOf.has(b)) {
      const d = parseDateKey(b);
      labelOf.set(b, bucket === "week"
        ? weekLabel(d)
        : d.toLocaleDateString("en-IN", { month: "short" }));
    }
    cursor = bucket === "week" ? addDays(b, 7) : monthAfterKeys(b);
  } while (cursor <= last);

  const sorted = [...totals.keys()].sort();
  for (const e of expenses) {
    if (!isInRange(e.date, start, end)) continue;
    const b = bucketOf(e.date, bucket);
    totals.set(b, (totals.get(b) ?? 0) + e.amount);
  }

  return {
    points: sorted.map((b) => ({ key: b, label: labelOf.get(b) ?? b, total: totals.get(b) ?? 0 })),
    bucket,
  };
}

function monthAfterKeys(key: string): string {
  const d = parseDateKey(key);
  const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return toDateKey(next);
}

function weekLabel(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}