import { useMemo, useState } from "react";
import { monthStart, parseDateKey, todayKey } from "../../lib/dates";
import { Icon } from "../ui/Icon";

interface CalendarPickerProps {
  value: string;
  onChange: (key: string) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/** iOS Calendar-style inline month picker. Future months/days disabled. */
export function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const today = todayKey();
  const anchor = parseDateKey(monthStart(value));
  const [view, setView] = useState(() => ({
    y: anchor.getFullYear(),
    m: anchor.getMonth(),
  }));

  const days = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const count = new Date(view.y, view.m + 1, 0).getDate();
    const startDow = first.getDay();
    return { startDow, count };
  }, [view]);

  const viewKey = `${view.y}-${String(view.m + 1).padStart(2, "0")}`;
  const todayMonth = today.slice(0, 7);
  const atTodayMonth = viewKey === todayMonth;
  const canGoPrev = view.y > 2000 || view.m > 0;
  const canGoNext = !atTodayMonth;

  const move = (delta: number) => {
    const next = new Date(view.y, view.m + delta, 1);
    const now = new Date();
    if (next.getFullYear() > now.getFullYear() || (next.getFullYear() === now.getFullYear() && next.getMonth() > now.getMonth())) {
      return;
    }
    setView({ y: next.getFullYear(), m: next.getMonth() });
  };

  const cells: (string | null)[] = [...Array(days.startDow).fill(null)] as (string | null)[];
  for (let d = 1; d <= days.count; d++) {
    cells.push(`${viewKey}-${String(d).padStart(2, "0")}`);
  }

  const select = (key: string) => {
    if (key > today) return;
    onChange(key);
  };

  return (
    <div className="select-none">
      <div className="flex items-center justify-between px-1 pb-2">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="flex h-10 w-10 items-center justify-center rounded-full text-accent disabled:opacity-30 active:bg-accent-soft transition-colors"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
        <span className="text-headline font-semibold">{formatMonthLabel(viewKey)}</span>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={!canGoNext}
          aria-label="Next month"
          className="flex h-10 w-10 items-center justify-center rounded-full text-accent disabled:opacity-30 active:bg-accent-soft transition-colors"
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="pb-1 text-caption font-semibold text-label-tertiary">
            {w}
          </div>
        ))}
        {cells.map((key, i) => {
          if (!key) return <div key={`b-${i}`} />;
          const selected = key === value;
          const isToday = key === today;
          const disabled = key > today;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => select(key)}
              aria-label={key}
              aria-pressed={selected}
              className={[
                "relative mx-auto flex h-10 w-10 items-center justify-center text-headline transition-colors duration-150",
                selected ? "bg-accent font-semibold text-white rounded-full shadow-card" : "",
                !selected && isToday ? "rounded-full bg-accent-soft text-accent font-semibold" : "",
                !selected && !isToday ? "text-label" : "",
                disabled ? "text-label-tertiary/60" : "",
              ].join(" ")}
            >
              {key.slice(8, 10)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatMonthLabel(viewKey: string): string {
  return parseDateKey(`${viewKey}-01`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}