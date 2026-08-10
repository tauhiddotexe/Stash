import { getCategory } from "../../lib/categories";
import { formatSmartDate } from "../../lib/dates";
import { formatINR } from "../../lib/format";
import type { Expense } from "../../types/expense";
import { CategoryTile } from "../ui/CategoryTile";
import { Icon } from "../ui/Icon";

interface ExpenseListItemProps {
  expense: Expense;
  onPress: (expense: Expense) => void;
  showDate?: boolean;
  staggerItem?: boolean;
}

export function ExpenseListItem({ expense, onPress, showDate = false, staggerItem }: ExpenseListItemProps) {
  const cat = getCategory(expense.category);
  const title = expense.description?.trim() || cat.label;
  const subtitle = showDate ? formatSmartDate(expense.date) : cat.label;

  return (
    <button
      type="button"
      data-stagger-item={staggerItem ? "" : undefined}
      onClick={() => onPress(expense)}
      className="group flex w-full items-center gap-3 rounded-iosgroup px-3 py-2.5 text-left transition-colors duration-150 hover:bg-bg-secondary active:bg-bg-secondary"
      aria-label={`${title}, ${formatINR(expense.amount)}`}
    >
      <CategoryTile category={expense.category} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-headline font-medium">{title}</span>
        <span className="block text-subheadline text-label-secondary">{subtitle}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <span className="text-headline font-semibold tabular-nums">{formatINR(expense.amount)}</span>
        <Icon
          name="chevronRight"
          size={14}
          className="text-label-tertiary opacity-0 transition-opacity group-hover:opacity-100"
        />
      </span>
    </button>
  );
}