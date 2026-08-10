import { useEffect, useState } from "react";
import { useExpenses } from "./state/expenses";
import { useUI } from "./state/ui";
import { useTheme } from "./state/theme";
import type { ThemePref } from "./state/theme";
import { TabBar } from "./components/ui/TabBar";
import type { TabId } from "./components/ui/TabBar";
import { Sheet } from "./components/ui/Sheet";
import { Alert } from "./components/ui/Alert";
import { Icon } from "./components/ui/Icon";
import { Spinner } from "./components/ui/Spinner";
import { ToastView } from "./components/ui/ToastView";
import { ExpenseForm } from "./components/expense/ExpenseForm";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ExpensesPage } from "./components/expenses/ExpensesPage";
import { Button } from "./components/ui/Button";

function parseHash(): TabId {
  return window.location.hash.startsWith("#/expenses") ? "expenses" : "insights";
}

export function AppShell() {
  const { status, errorMessage, removeExpense, retry } = useExpenses();
  const { sheet, closeSheet, showToast, toast, openSheet } = useUI();
  const { pref, setPref } = useTheme();

  const [tab, setTabState] = useState<TabId>(() => parseHash());
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setTabState(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (next: TabId) => {
    setTabState(next);
    window.history.replaceState(null, "", next === "expenses" ? "#/expenses" : "#/insights");
  };

  const deleting = sheet?.type === "confirm-delete" ? sheet.expense : undefined;
  const deletingOpen = deleting !== undefined;

  const themeMenuItems: { value: ThemePref; label: string }[] = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  const selectTheme = (value: ThemePref) => {
    setPref(value);
    setThemeMenuOpen(false);
  };

  return (
    <div className="min-h-dvh w-full bg-bg-secondary">
      <div className="relative mx-auto flex h-dvh w-full max-w-lg flex-col bg-bg-primary sm:border-x sm:border-card-stroke">
        {/* Header */}
        <header
          className="z-20 flex shrink-0 items-center justify-between px-5"
          style={{ paddingTop: "max(env(safe-area-inset-top), 12px)" }}
        >
          <div className="flex items-center gap-2.5 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent-gradient text-white shadow-card-hover">
              <Icon name="chartLine" size={18} weight="fill" />
            </span>
            <h1 className="text-title-2 font-bold tracking-tight">Stash</h1>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setThemeMenuOpen((v) => !v)}
              aria-label="Theme settings"
              aria-haspopup="menu"
              aria-expanded={themeMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-label-secondary active:bg-bg-secondary transition-colors"
            >
              <Icon name="info" size={22} />
            </button>
            {themeMenuOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-11 w-44 animate-scale-in overflow-hidden rounded-ioscard bg-card shadow-elevated border border-card-stroke py-1"
              >
                {themeMenuItems.map((item) => (
                  <button
                    key={item.value}
                    role="menuitemradio"
                    aria-checked={item.value === pref}
                    onClick={() => selectTheme(item.value)}
                    className="flex h-11 w-full items-center justify-between px-4 text-headline active:bg-bg-secondary transition-colors"
                  >
                    <span className={item.value === pref ? "text-accent" : ""}>{item.label}</span>
                    {item.value === pref ? (
                      <Icon name="checkmark" size={16} strokeWidth={2.5} className="text-accent" />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        {/* Overlay to close theme menu */}
        {themeMenuOpen ? (
          <button aria-label="Close menu" onClick={() => setThemeMenuOpen(false)} className="absolute inset-0 z-10" />
        ) : null}

        <main className="relative z-0 flex-1 overflow-y-auto">
          {status === "loading" ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-label-secondary">
              <Spinner size={30} />
              <span className="text-footnote">Loading your expenses…</span>
            </div>
          ) : status === "error" ? (
            <div className="flex h-full items-center justify-center px-8">
              <div className="w-full max-w-sm text-center">
                <Icon name="info" size={34} weight="fill" className="mx-auto text-label-tertiary" />
                <h2 className="mt-4 text-title-2 font-semibold">Something went wrong</h2>
                <p className="mt-2 text-footnote leading-relaxed text-label-secondary">{errorMessage ?? "Please try again."}</p>
                <Button variant="primary" onClick={retry} className="mt-6">
                  Try again
                </Button>
              </div>
            </div>
          ) : tab === "insights" ? (
            <div key="insights" className="animate-page-in h-full">
              <DashboardPage
                onNavigate={navigate}
                onEditExpense={(e) => openSheet({ type: "expense-form", editing: e })}
                onAdd={() => openSheet({ type: "expense-form" })}
              />
            </div>
          ) : (
            <div key="expenses" className="animate-page-in h-full">
              <ExpensesPage
                onEditExpense={(e) => openSheet({ type: "expense-form", editing: e })}
                onAdd={() => openSheet({ type: "expense-form" })}
              />
            </div>
          )}
        </main>

        <TabBar active={tab} onChange={navigate} onAdd={() => openSheet({ type: "expense-form" })} />

        {/* Toast */}
        {toast ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-24 z-40 flex justify-center px-6">
            <ToastView message={toast?.message ?? ""} tone={toast?.tone ?? "success"} />
          </div>
        ) : null}

        {/* Add / Edit sheet */}
        <Sheet
          open={sheet?.type === "expense-form"}
          onClose={closeSheet}
          title={sheet?.type === "expense-form" && sheet.editing ? "Edit Expense" : "New Expense"}
        >
          {sheet?.type === "expense-form" ? (
            <ExpenseForm
              key={sheet.editing?.id ?? "new"}
              editing={sheet.editing}
              onSubmitDone={closeSheet}
            />
          ) : null}
        </Sheet>

        {/* Delete confirmation */}
        <Alert
          open={deletingOpen}
          title="Delete this expense?"
          message={
            deleting ? (
              <>
                This will permanently remove it from your history on this device.
              </>
            ) : undefined
          }
          confirmLabel="Delete"
          destructive
          onConfirm={() => {
            if (!deleting) return;
            void removeExpense(deleting.id)
              .then(() => {
                showToast("Expense deleted");
                closeSheet();
              })
              .catch((err) => {
                showToast(err instanceof Error ? err.message : "Could not delete. Please try again.", "danger");
              });
          }}
          onCancel={closeSheet}
        />
      </div>
    </div>
  );
}