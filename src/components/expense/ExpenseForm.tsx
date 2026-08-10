import { useState } from "react";
import type { FormEvent } from "react";
import { addDays, formatFullDate, parseDateKey, todayKey } from "../../lib/dates";
import type { ExpenseFormState, FormErrors } from "../../lib/validation";
import { validateExpenseForm } from "../../lib/validation";
import type { Expense } from "../../types/expense";
import { useExpenses } from "../../state/expenses";
import { useUI } from "../../state/ui";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { CalendarPicker } from "./CalendarPicker";
import { CategoryPicker } from "./CategoryPicker";

interface ExpenseFormProps {
  editing?: Expense;
  onSubmitDone: () => void;
}

function initialForm(editing?: Expense): ExpenseFormState {
  return {
    amountText: editing ? String(editing.amount) : "",
    descriptionText: editing?.description ?? "",
    category: editing?.category,
    date: editing?.date ?? todayKey(),
  };
}

export function ExpenseForm({ editing, onSubmitDone }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();
  const { showToast, haptic, openSheet } = useUI();
  const [form, setForm] = useState<ExpenseFormState>(() => initialForm(editing));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const today = todayKey();
  const amountValid = form.amountText.trim().length > 1;
  const title = editing ? "Edit Expense" : "New Expense";

  const set = (patch: Partial<ExpenseFormState>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    haptic();
    const result = validateExpenseForm(form, today);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      if (editing) {
        await updateExpense(editing.id, result.value);
        showToast("Expense updated");
      } else {
        await addExpense(result.value);
        showToast("Expense added");
      }
      onSubmitDone();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Something went wrong. Please try again.", "danger");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <div className="pt-1 text-center">
        <h2 className="text-title-2 font-bold">{title}</h2>
        {editing ? (
          <p className="mt-0.5 text-footnote text-label-secondary">{formatFullDate(editing.date)}</p>
        ) : null}
      </div>

      {/* Amount */}
      <section aria-label="Amount">
        <div
          className={[
            "flex items-baseline justify-center gap-1 rounded-iosgroup py-6 transition-colors",
            errors.amount ? "bg-danger-soft" : "bg-bg-secondary",
          ].join(" ")}
        >
          <span
            className={`text-title-1 font-semibold ${errors.amount ? "text-danger" : "text-label-secondary"}`}
          >
            ₹
          </span>
          <input
            inputMode="decimal"
            autoComplete="off"
            autoFocus={!editing}
            placeholder="0"
            value={form.amountText}
            onChange={(e) => {
              set({ amountText: sanitizeAmount(e.target.value) });
              if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            aria-label="Amount in rupees"
            aria-invalid={!!errors.amount}
            className={[
              "w-48 bg-transparent text-center text-title-1 font-bold outline-none tabular-nums placeholder:text-label-tertiary",
              errors.amount ? "text-danger" : "text-label",
            ].join(" ")}
          />
        </div>
        {errors.amount ? (
          <p role="alert" className="mt-1.5 text-center text-footnote text-danger">{errors.amount}</p>
        ) : null}
      </section>

      {/* Description */}
      <label className="block">
        <span className="text-footnote font-medium text-label-secondary">Description</span>
        <input
          type="text"
          maxLength={140}
          placeholder="What was this for? (optional)"
          value={form.descriptionText}
          onChange={(e) => {
            set({ descriptionText: e.target.value });
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          className="mt-1.5 h-12 w-full rounded-iosgroup bg-bg-secondary px-4 text-headline outline-none placeholder:text-label-tertiary focus:ring-2 focus:ring-accent transition-shadow"
          aria-label="Description (optional)"
          aria-invalid={!!errors.description}
        />
        {errors.description ? (
          <p role="alert" className="mt-1 text-footnote text-danger">{errors.description}</p>
        ) : null}
      </label>

      {/* Category */}
      <section aria-label="Category">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-footnote font-medium text-label-secondary">Category</h3>
          <span className="text-footnote text-label-tertiary">Optional</span>
        </div>
        <CategoryPicker value={form.category} onChange={(c) => set({ category: c })} />
      </section>

      {/* Date */}
      <section aria-label="Date">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-footnote font-medium text-label-secondary">Date</h3>
          <button
            type="button"
            onClick={() => {
              haptic();
              setShowCalendar((v) => !v);
            }}
            aria-expanded={showCalendar}
            className="flex items-center gap-1.5 rounded-full px-2 py-1 text-footnote font-medium text-accent active:bg-accent-soft transition-colors"
          >
            <Icon name="calendar" size={15} />
            {form.date === today ? "Today" : friendlyDate(form.date)}
          </button>
        </div>

        {showCalendar ? (
          <div className="animate-fade-in rounded-iosgroup bg-bg-secondary p-3">
            <CalendarPicker
              value={form.date}
              onChange={(d) => {
                set({ date: d });
                setShowCalendar(false);
              }}
            />
          </div>
        ) : (
          <div className="flex gap-2">
            {quickDates.map((q) => {
              const key = q.value(today);
              const active = form.date === key;
              return (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => set({ date: key })}
                  aria-pressed={active}
                  className={[
                    "inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-3.5 text-footnote font-medium transition-colors active:scale-[0.97]",
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-card-stroke bg-bg-tertiary text-label-secondary hover:bg-bg-quaternary",
                  ].join(" ")}
                >
                  {q.key === "thisWeek" ? <Icon name="calendar" size={13} /> : null}
                  {q.label}
                </button>
              );
            })}
          </div>
        )}
        {errors.date ? <p role="alert" className="mt-1 text-footnote text-danger">{errors.date}</p> : null}
      </section>

      <div className="pt-2">
        <Button type="submit" size="lg" fullWidth disabled={!amountValid || saving}>
          {saving ? "Saving…" : editing ? "Save Changes" : "Add Expense"}
        </Button>
      </div>

      {editing ? (
        <button
          type="button"
          onClick={() => openSheet({ type: "confirm-delete", expense: editing })}
          className="flex h-11 items-center justify-center gap-2 rounded-iosgroup text-footnote font-medium text-danger active:bg-danger-soft transition-colors"
        >
          <Icon name="trash" size={15} />
          Delete this expense
        </button>
      ) : null}
    </form>
  );
}

const quickDates = [
  { key: "today", label: "Today", value: (t: string) => t },
  { key: "yesterday", label: "Yesterday", value: (t: string) => addDays(t, -1) },
  { key: "thisWeek", label: "This week", value: (t: string) => startOfWeekLocal(t) },
];

function startOfWeekLocal(key: string): string {
  const d = parseDateKey(key);
  const dow = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dow);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sanitizeAmount(raw: string): string {
  return raw.replace(/[^\d.]/g, "").replace(/\.(?=.*\.)/g, "");
}

function friendlyDate(key: string): string {
  return parseDateKey(key).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}