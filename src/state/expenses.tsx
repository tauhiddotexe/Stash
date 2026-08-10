import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { expenseRepository } from "../lib/db/expense-repository";
import type { Expense, ExpenseDraft } from "../types/expense";

export type ExpensesStatus = "loading" | "ready" | "error";

interface ExpensesValue {
  expenses: Expense[];
  status: ExpensesStatus;
  errorMessage?: string;
  addExpense: (draft: ExpenseDraft) => Promise<void>;
  updateExpense: (id: string, draft: ExpenseDraft) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  retry: () => void;
}

const ExpensesContext = createContext<ExpensesValue | null>(null);

const GENERIC_ERROR =
  "We couldn't load your saved expenses. Please try again.";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const byNewest = (a: Expense, b: Expense) =>
  b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [status, setStatus] = useState<ExpensesStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [tick, setTick] = useState(0);
  const expensesRef = useRef<Expense[]>([]);
  expensesRef.current = expenses;

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    expenseRepository
      .getAll()
      .then((rows) => {
        if (cancelled) return;
        setExpenses([...rows].sort(byNewest));
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMessage(GENERIC_ERROR);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const addExpense = useCallback(async (draft: ExpenseDraft) => {
    const now = new Date().toISOString();
    const expense: Expense = {
      id: newId(),
      ...draft,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await expenseRepository.create(expense);
    } catch {
      throw new Error("We couldn't save that expense. Please try again.");
    }
    setExpenses((prev) => [...prev, expense].sort(byNewest));
  }, []);

  const updateExpense = useCallback(async (id: string, draft: ExpenseDraft) => {
    const next = expensesRef.current.find((e) => e.id === id);
    if (!next) throw new Error("That expense no longer exists.");
    const updated: Expense = { ...next, ...draft, updatedAt: new Date().toISOString() };
    try {
      await expenseRepository.update(updated);
    } catch {
      throw new Error("Could not save your changes. Please try again.");
    }
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? updated : e)).sort(byNewest),
    );
  }, []);

  const removeExpense = useCallback(async (id: string) => {
    try {
      await expenseRepository.delete(id);
    } catch {
      throw new Error("We couldn't delete that expense. Please try again.");
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const retry = useCallback(() => setTick((t) => t + 1), []);

  const value = useMemo(
    () => ({ expenses, status, errorMessage, addExpense, updateExpense, removeExpense, retry }),
    [expenses, status, errorMessage, addExpense, updateExpense, removeExpense, retry],
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses(): ExpensesValue {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpensesProvider");
  return ctx;
}