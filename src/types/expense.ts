export const CATEGORY_IDS = [
  "food",
  "travel",
  "shopping",
  "bills",
  "health",
  "entertainment",
  "education",
  "work",
  "other",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  category?: CategoryId;
  /** Local calendar date, "YYYY-MM-DD". Never a timestamp. */
  date: string;
  createdAt: string;
  updatedAt: string;
}

/** Values a user can edit in the form. */
export interface ExpenseDraft {
  amount: number;
  description?: string;
  category?: CategoryId;
  date: string;
}