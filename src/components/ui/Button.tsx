import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "subtle" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ComponentProps<typeof Icon>["name"];
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent-gradient text-white shadow-fab hover:brightness-[1.08] active:brightness-95 focus-visible:ring-accent",
  subtle: "bg-bg-tertiary text-label hover:bg-bg-quaternary",
  danger: "bg-danger text-white shadow-card hover:brightness-[1.06] active:brightness-95",
  ghost: "text-accent bg-transparent hover:bg-accent-soft",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-footnote",
  md: "h-11 px-5 text-headline",
  lg: "h-14 px-6 text-headline",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  icon,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center gap-2 rounded-iospill font-semibold select-none",
        "transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none",
        "min-h-[44px]",
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {icon ? <Icon name={icon} size={18} strokeWidth={2} /> : null}
      {children}
    </button>
  );
}