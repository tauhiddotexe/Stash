import type { ReactNode } from "react";

export interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  leading?: ReactNode;
}

export function Chip({ label, active, onClick, leading }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 h-9 text-footnote font-medium",
        "border transition-colors duration-200 select-none active:scale-[0.97]",
        active
          ? "bg-accent border-accent text-white"
          : "bg-bg-tertiary border-card-stroke text-label-secondary",
      ].join(" ")}
    >
      {leading}
      {label}
    </button>
  );
}