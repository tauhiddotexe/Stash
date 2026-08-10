import { useMemo, useRef, useState } from "react";
import type { CategoryId } from "../../types/expense";
import { formatSmartDate, formatFullDate } from "../../lib/dates";
import { sum } from "../../lib/calc";
import { formatINR } from "../../lib/format";
import { CATEGORIES } from "../../lib/categories";
import { useExpenses } from "../../state/expenses";
import { useStagger } from "../../hooks/useStagger";
import { Icon } from "../ui/Icon";
import { EmptyState } from "../ui/EmptyState";
import { ExpenseListItem } from "../expense/ExpenseListItem";
import type { Expense } from "../../types/expense";

export function ExpensesPage({
  onEditExpense,
  onAdd,
}: {
  onEditExpense: (expense: Expense) => void;
  onAdd: () => void;
}) {
  const { expenses } = useExpenses();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const categoryLabel = (id?: CategoryId) =>
      id ? CATEGORIES.find((c) => c.id === id)?.label.toLowerCase() ?? "" : "";
    return expenses.filter((e) => {
      if (category !== "all" && (e.category ?? "other") !== category) return false;
      if (!q) return true;
      const desc = (e.description ?? "").toLowerCase();
      return desc.includes(q) || categoryLabel(e.category).includes(q);
    });
  }, [expenses, query, category]);

  const groups = useMemo(() => {
    const map = new Map<string, Expense[]>();
    for (const e of filtered) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return [...map.entries()];
  }, [filtered]);

  const staggerKey = filtered.map((e) => e.id).join("|");
  useStagger(listRef, [staggerKey, category], { y: 8, limit: 16 });

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon="shopping"
        title="No expenses yet"
        subtitle="Once you add expenses, they'll show up here neatly grouped by day."
        actionLabel="Add Expense"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="px-5 pt-4 pb-32">
      {/* Search */}
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-label-tertiary">
          <Icon name="mag" size={18} />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search expenses"
          aria-label="Search expenses"
          className="h-11 w-full rounded-iosgroup bg-bg-secondary pl-11 pr-4 text-headline outline-none placeholder:text-label-tertiary focus:ring-2 focus:ring-accent transition-shadow"
        />
      </div>

      {/* Category filter chips */}
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
        <FilterChip label="All" active={category === "all"} onClick={() => setCategory("all")} />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.id}
            label={c.label}
            active={category === c.id}
            onClick={() => setCategory(category === c.id ? "all" : c.id)}
            dot={`--cat-${c.id}`}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="mag"
          title="Nothing found"
          subtitle="Try a different search or clear the category filter."
        />
      ) : (
        <div ref={listRef} className="mt-4 space-y-5">
          {groups.map(([date, items]) => {
            const total = sum(items);
            return (
              <section key={date} aria-label={formatFullDate(date)}>
                <div className="mb-1.5 flex items-baseline justify-between px-1">
                  <h2 className="text-footnote font-semibold uppercase tracking-wide text-label-secondary">
                    {formatSmartDate(date)}
                    <span className="ml-1.5 font-normal normal-case text-label-tertiary">
                      {formatFullDate(date)}
                    </span>
                  </h2>
                  <span className="text-footnote font-semibold text-label-secondary tabular-nums">
                    {formatINR(total)}
                  </span>
                </div>
                <div className="overflow-hidden rounded-ioscard bg-card border border-card-stroke divide-y divide-separator/60">
                  {items.map((e) => (
                    <ExpenseListItem key={e.id} expense={e} onPress={onEditExpense} staggerItem />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  dot,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dot?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-footnote font-medium transition-colors active:scale-[0.97] min-w-0",
        active
          ? "border-accent bg-accent text-white"
          : "border-card-stroke bg-bg-tertiary text-label-secondary hover:bg-bg-quaternary",
      ].join(" ")}
    >
      {dot ? <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: `var(${dot})` }} /> : null}
      {label}
    </button>
  );
}