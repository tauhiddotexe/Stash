import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Expense } from "../types/expense";

/** Bottom-sheet stack. `expense-form` handles both add (no id) and edit. */
export type SheetState =
  | { type: "expense-form"; editing?: Expense }
  | { type: "confirm-delete"; expense: Expense };

export type ToastTone = "success" | "danger" | "info";

export interface ToastState {
  message: string;
  tone: ToastTone;
}

interface UIValue {
  sheet: SheetState | null;
  openSheet: (sheet: SheetState) => void;
  closeSheet: () => void;
  toast: ToastState | null;
  showToast: (message: string, tone?: ToastTone) => void;
  haptic: (ms?: number) => void;
}

const UIContext = createContext<UIValue | null>(null);

/** Gentle vibration on capable devices; no-op elsewhere. */
function vibrate(ms = 8): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const openSheet = useCallback((next: SheetState) => {
    vibrate(8);
    setSheet(next);
  }, []);

  const closeSheet = useCallback(() => setSheet(null), []);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    setToast({ message, tone });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
    vibrate(12);
  }, []);

  const haptic = useCallback((ms?: number) => vibrate(ms), []);

  const value = useMemo(
    () => ({ sheet, openSheet, closeSheet, toast, showToast, haptic }),
    [sheet, openSheet, closeSheet, toast, showToast, haptic],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}