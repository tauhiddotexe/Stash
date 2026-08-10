import type { CategoryId, ExpenseDraft } from "../types/expense";
import { isCategoryId } from "./categories";
import { isNotFuture, isValidDateKey } from "./dates";

const MAX_AMOUNT = 100_000_000; // ₹10 crore — sanity ceiling
const MAX_DESCRIPTION = 120;

/** Parse a raw amount input ("250.50") → positive finite number, else null. */
export function parseAmount(raw: string): number | null {
  const trimmed = raw.trim().replace(",", "");
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return null;
  if (n > MAX_AMOUNT) return null;
  return Math.round(n * 100) / 100;
}

export interface ExpenseFormState {
  amountText: string;
  descriptionText: string;
  category?: CategoryId;
  date: string;
}

export type FormErrors = {
  amount?: string;
  description?: string;
  date?: string;
  category?: string;
};

export type ValidationResult =
  | { ok: true; value: ExpenseDraft }
  | { ok: false; errors: FormErrors };

/** Validate the editable fields and return a clean draft when valid. */
export function validateExpenseForm(state: ExpenseFormState, today: string): ValidationResult {
  const errors: FormErrors = {};

  const amount = parseAmount(state.amountText);
  if (amount === null) {
    errors.amount =
      state.amountText.trim() === ""
        ? "Enter an amount."
        : "Use a positive number, like 250 or 99.50.";
  }

  let description: string | undefined;
  if (state.descriptionText.trim().length > MAX_DESCRIPTION) {
    errors.description = `Keep it under ${MAX_DESCRIPTION} characters.`;
  } else if (state.descriptionText.trim()) {
    description = state.descriptionText.trim();
  }

  let date = state.date;
  if (!isValidDateKey(date)) {
    errors.date = "Pick a valid date.";
    date = today;
  } else if (!isNotFuture(date)) {
    errors.date = "Future dates aren't supported yet.";
    date = today;
  }

  if (state.category !== undefined && !isCategoryId(state.category)) {
    errors.category = "Pick a category from the list.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      amount: amount!,
      description,
      category: state.category,
      date,
    },
  };
}