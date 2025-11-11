import type { Customer } from './customers';

const KEY = 'db.customers';

function read(): Customer[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(customers: Customer[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(customers));
  } catch {}
}

export function getAllPersistedCustomers(): Customer[] {
  return read();
}

export function addPersistedCustomer(customer: Omit<Customer, 'id'>): Customer {
  const all = read();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const newCustomer: Customer = { id, ...customer };
  write([newCustomer, ...all]);
  return newCustomer;
}

export function updatePersistedCustomer(id: string, patch: Partial<Customer>): Customer | null {
  const all = read();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch } as Customer;
  all[idx] = updated;
  write(all);
  return updated;
}

export function deletePersistedCustomer(id: string): boolean {
  const all = read();
  const next = all.filter((c) => c.id !== id);
  write(next);
  return next.length !== all.length;
}