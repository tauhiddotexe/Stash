import { useEffect } from "react";
import type { ReactNode } from "react";

interface AlertProps {
  open: boolean;
  title?: string;
  message?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

/** iOS-style centered alert with stacked actions. */
export function Alert({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onCancel,
}: AlertProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-8">
      <button
        aria-label="Dismiss"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-fade-in"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title ?? "Confirm"}
        className="relative w-full max-w-[270px] animate-scale-in rounded-[20px] bg-card shadow-elevated overflow-hidden"
      >
        {title ? (
          <div className="px-4 pt-5 pb-1">
            <h2 className="text-center text-headline font-semibold">{title}</h2>
          </div>
        ) : null}
        {message ? (
          <div className="px-5 pt-2 pb-3">
            <div className="text-center text-footnote leading-relaxed text-label-secondary">{message}</div>
          </div>
        ) : null}
        <div className="flex flex-col border-t border-separator">
          <button
            type="button"
            onClick={onConfirm}
            className={`h-12 text-headline font-semibold active:bg-bg-secondary transition-colors ${
              destructive ? "text-danger" : "text-accent"
            }`}
          >
            {confirmLabel}
          </button>
          <div className="h-px bg-separator" />
          <button
            type="button"
            onClick={onCancel}
            className="h-12 text-headline font-medium text-accent active:bg-bg-secondary transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}