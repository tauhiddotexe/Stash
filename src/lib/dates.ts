export type Period = "day" | "week" | "month" | "custom";

export const DAY_MS = 86_400_000;

/** Local calendar date → "YYYY-MM-DD". Immune to UTC serialization drift. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(key: string, days: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function diffDays(a: string, b: string): number {
  return Math.round((parseDateKey(b).getTime() - parseDateKey(a).getTime()) / DAY_MS);
}

/** Inclusive. ISO date keys are string-comparable. */
export function isInRange(key: string, start: string, end: string): boolean {
  return key >= start && key <= end;
}

/** Monday-start week (Apple's week starts Monday in many locales). */
export function startOfWeek(key: string): string {
  const d = parseDateKey(key);
  const dow = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dow);
  return toDateKey(d);
}

export function endOfWeek(key: string): string {
  return addDays(startOfWeek(key), 6);
}

export function monthStart(key: string): string {
  const d = parseDateKey(key);
  return toDateKey(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function monthEnd(key: string): string {
  const d = parseDateKey(key);
  return toDateKey(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

export interface Range {
  start: string;
  end: string;
}

export function rangeFor(period: Period, anchor: string, custom?: Range): Range {
  switch (period) {
    case "day":
      return { start: anchor, end: anchor };
    case "week":
      return { start: startOfWeek(anchor), end: endOfWeek(anchor) };
    case "month":
      return { start: monthStart(anchor), end: monthEnd(anchor) };
    case "custom":
      if (custom) return { start: custom.start, end: custom.end };
      return { start: anchor, end: anchor };
  }
}

const dayShort = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
const dayNum = new Intl.DateTimeFormat("en-IN", { day: "numeric" });
const monthShort = new Intl.DateTimeFormat("en-IN", { month: "short" });

/** "Mon 4" — compact axis label. */
export function formatDayKey(key: string): string {
  const d = parseDateKey(key);
  return `${dayShort.format(d)} ${dayNum.format(d)}`;
}

/** "4 Aug" compact. */
export function formatDayOfMonth(key: string): string {
  const d = parseDateKey(key);
  return `${dayNum.format(d)} ${monthShort.format(d)}`;
}

/** "Aug 4, 2026" — full friendly date. */
export function formatFullDate(key: string): string {
  return (
    parseDateKey(key).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );
}

/** "Aug 4" + relative "Today / Yesterday" when applicable. */
export function formatSmartDate(key: string): string {
  const today = todayKey();
  if (key === today) return "Today";
  if (key === addDays(today, -1)) return "Yesterday";
  return formatDayOfMonth(key);
}

/** Week label "4–10 Aug". */
export function formatWeekRange(start: string, end: string): string {
  const s = formatDayOfMonth(start);
  const e = parseDateKey(end).getFullYear() === parseDateKey(start).getFullYear()
    ? formatDayOfMonth(end)
    : formatFullDate(end);
  return `${s} – ${e}`;
}

/** Month label "August 2026". */
export function formatMonth(anchor: string): string {
  const d = parseDateKey(anchor);
  const label = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  return label;
}

export function isValidDateKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const d = parseDateKey(key);
  return toDateKey(d) === key && !Number.isNaN(d.getTime());
}

/** Validate a key is a real calendar date and not in the future. */
export function isNotFuture(key: string): boolean {
  return key <= todayKey();
}