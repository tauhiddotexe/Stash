import { CATEGORIES } from "../../lib/categories";
import type { CategoryId } from "../../types/expense";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";

interface CategoryPickerProps {
  value?: CategoryId;
  onChange: (category?: CategoryId) => void;
}

/** Selectable grid of Apple-style category tiles with labels. */
export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3 pt-2">
      {CATEGORIES.map((cat) => {
        const selected = value === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(selected ? undefined : cat.id)}
            aria-pressed={selected}
            className="flex flex-col items-center gap-1.5 px-2 py-1 min-w-0"
          >
            <span
              className={[
                "relative flex h-14 w-full max-w-[84px] items-center justify-center rounded-[18px] transition-all duration-200",
                selected ? "ring-2 ring-accent ring-offset-2 ring-offset-sheet" : "",
              ].join(" ")}
              style={{ backgroundColor: `var(${cat.colorVar})` }}
            >
              <Icon name={cat.icon as IconName} size={26} weight="fill" className="text-white" />
              {selected ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-label text-bg-primary shadow-card">
                  <Icon name="checkmark" size={12} strokeWidth={3} />
                </span>
              ) : null}
            </span>
            <span
              className={`text-caption font-medium transition-colors ${
                selected ? "text-accent" : "text-label-secondary"
              }`}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}