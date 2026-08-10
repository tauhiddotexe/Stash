import type { HTMLAttributes } from "react";

export function Card({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-ioscard bg-card shadow-card border border-card-stroke ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}