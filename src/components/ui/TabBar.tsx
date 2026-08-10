import { Icon } from "./Icon";
import type { IconName } from "./Icon";

export type TabId = "insights" | "expenses";

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
  onAdd: () => void;
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: IconName;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className="relative flex min-h-[44px] min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5"
    >
      {active ? (
        <span
          aria-hidden
          className="animate-pill-in absolute inset-x-1 top-0 -z-10 h-7 rounded-full bg-accent-soft"
        />
      ) : null}
      <span className={`transition-colors duration-200 ${active ? "text-accent" : "text-label-tertiary"}`}>
        <Icon name={icon} size={24} strokeWidth={active ? 2.2 : 1.6} />
      </span>
      <span
        className={`text-[10px] font-medium transition-colors duration-200 ${
          active ? "text-accent" : "text-label-tertiary"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/** iOS-style translucent tab bar with the Add action raised in the center. */
export function TabBar({ active, onChange, onAdd }: TabBarProps) {
  return (
    <nav
      aria-label="Primary"
      className="pointer-events-auto relative border-t border-separator bg-bg-primary/80 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-[52px] w-full max-w-lg items-stretch px-3">
        <TabButton icon="chart" label="Insights" active={active === "insights"} onClick={() => onChange("insights")} />

        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={onAdd}
            aria-label="Add expense"
            className="animate-fab-in group relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-gradient text-white shadow-fab transition-transform duration-200 active:scale-90 hover:scale-105"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-active:opacity-100 bg-white/20"
            />
            <Icon name="plus" size={26} weight="bold" />
          </button>
        </div>

        <TabButton
          icon="house"
          label="Expenses"
          active={active === "expenses"}
          onClick={() => onChange("expenses")}
        />
      </div>
    </nav>
  );
}