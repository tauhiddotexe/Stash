export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

/** iOS-style segmented control with a sliding thumb. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: SegmentedControlProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div
      role="tablist"
      aria-label="Period"
      className={`relative grid rounded-iospill bg-bg-secondary p-1 ${disabled ? "opacity-60" : ""}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-iospill bg-card shadow-card transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          left: "4px",
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`relative z-10 h-9 rounded-iospill text-footnote font-semibold transition-colors duration-200 min-w-0 truncate ${
              selected ? "text-label" : "text-label-secondary hover:text-label active:text-label"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}