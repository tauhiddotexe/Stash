import type { CategoryId } from "../types/expense";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  /** CSS variable name used as the category's identity color. */
  colorVar: string;
  /** Icon key resolved by the <Icon> component. */
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "food", label: "Food", colorVar: "--cat-food", icon: "food" },
  { id: "travel", label: "Travel", colorVar: "--cat-travel", icon: "travel" },
  { id: "shopping", label: "Shopping", colorVar: "--cat-shopping", icon: "shopping" },
  { id: "bills", label: "Bills", colorVar: "--cat-bills", icon: "bills" },
  { id: "health", label: "Health", colorVar: "--cat-health", icon: "health" },
  { id: "entertainment", label: "Entertainment", colorVar: "--cat-entertainment", icon: "entertainment" },
  { id: "education", label: "Education", colorVar: "--cat-education", icon: "education" },
  { id: "work", label: "Work", colorVar: "--cat-work", icon: "work" },
  { id: "other", label: "Other", colorVar: "--cat-other", icon: "other" },
];

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id?: CategoryId): CategoryMeta {
  return (id && byId.get(id)) || byId.get("other")!;
}

export function isCategoryId(value: string): value is CategoryId {
  return byId.has(value as CategoryId);
}