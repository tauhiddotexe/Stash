import type { Expense } from "../../types/expense";

const DB_NAME = "stash";
const DB_VERSION = 1;
const STORE = "expenses";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("indexedDB unavailable"));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("by_date", "date");
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error ?? new Error("Could not open storage"));
    });
  }
  return dbPromise;
}

function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        const req = fn(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("storage request failed"));
        tx.onabort = () => reject(tx.error ?? new Error("storage transaction aborted"));
        tx.onerror = () => reject(tx.error ?? new Error("storage transaction failed"));
      }),
  );
}

export const expenseRepository = {
  async getAll(): Promise<Expense[]> {
    return run("readonly", (s) => s.getAll());
  },

  async getById(id: string): Promise<Expense | undefined> {
    const value = await run<Expense | undefined>("readonly", (s) => s.get(id));
    return value;
  },

  async create(expense: Expense): Promise<Expense> {
    await run("readwrite", (s) => s.add(expense));
    return expense;
  },

  async update(expense: Expense): Promise<Expense> {
    await run("readwrite", (s) => s.put(expense));
    return expense;
  },

  async delete(id: string): Promise<void> {
    await run("readwrite", (s) => s.delete(id));
  },
};