import { useRef } from "react";
import type { Expense } from "../../types/expense";
import { useStagger } from "../../hooks/useStagger";
import { Icon } from "../ui/Icon";
import { ExpenseListItem } from "../expense/ExpenseListItem";

interface RecentExpensesProps {
  expenses: Expense[];
  onPress: (expense: Expense) => void;
  onViewAll: () => void;
}

export function RecentExpenses({ expenses, onPress, onViewAll }: RecentExpensesProps) {
  const recent = expenses.slice(0, 5);
  const listRef = useRef<HTMLDivElement>(null);
  useStagger(listRef, [recent.map((e) => e.id).join("|")], { y: 8 });

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-title-3 font-semibold">Recent</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-0.5 rounded-full px-2 py-1 text-footnote font-medium text-accent active:bg-accent-soft transition-colors"
        >
          View all
          <Icon name="chevronRight" size={13} />
        </button>
      </div>
      <div
        ref={listRef}
        className="overflow-hidden rounded-ioscard bg-card border border-card-stroke divide-y divide-separator/60"
      >
        {recent.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-8 text-footnote text-label-secondary">
            <Icon name="info" size={16} />
            Nothing recorded yet.
          </div>
        ) : (
          recent.map((e) => (
            <ExpenseListItem key={e.id} expense={e} onPress={onPress} showDate staggerItem />
          ))
        )}
      </div>
    </section>
  );
}