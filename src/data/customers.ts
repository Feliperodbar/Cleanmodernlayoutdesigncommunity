export type ServiceStatus = 'active' | 'inactive';

export interface Address {
  id: string;
  ucNumber: string;
  address: string;
  city: string;
  cep: string;
  status: ServiceStatus;
  lastBill: string;
  dueDate: string;
  consumption: string;
  distributor?: string;
}

export interface Customer {
  id: string;
  name: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  sex?: string;
  email?: string;
  phone: string;
  addresses: Address[];
  lastProtocol?: string;
  lastService?: string;
  timestamp?: string;
}

export const customers: Customer[] = [
  {
    id: '1',
    name: 'THIAGO GOMES DO NASCIMENTO',
    cpf: '072.190.104-27',
    rg: '00.262.439-8',
    birthDate: '28/08/1986',
    email: 'thiagogomesnascimento280886@gmail.com',
    phone: '+5584994043923',
    lastProtocol: '202511052102925525',
    lastService: '2ª Via de Fatura',
    timestamp: 'Hoje às 14:30',
    addresses: []
  },
  {
    id: '2',
    name: 'MARIA SILVA SANTOS',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    birthDate: '05/03/1990',
    email: 'maria.silva@example.com',
    phone: '+5584988887777',
    lastProtocol: '202511052102925524',
    lastService: 'Falta de Energia',
    timestamp: 'Hoje às 10:15',
    addresses: []
  },
  {
    id: '3',
    name: 'JOÃO PEDRO OLIVEIRA',
    cpf: '987.654.321-00',
    rg: '98.765.432-1',
    birthDate: '12/11/1982',
    email: 'joao.oliveira@example.com',
    phone: '+5584977776666',
    lastProtocol: '202511052102925523',
    lastService: 'Informação',
    timestamp: 'Ontem às 16:45',
    addresses: []
  }
];

import { getAllPersistedCustomers, addPersistedCustomer } from './db';

export const getAllCustomers = (): Customer[] => {
  const persisted = getAllPersistedCustomers();
  // Merge static and persisted, dedupe by id
  const byId = new Map<string, Customer>();
  // Sanitize persisted customers: keep only addresses that have a distributor
  const sanitized = persisted.map((c) => ({
    ...c,
    addresses: Array.isArray(c.addresses) ? c.addresses.filter((a) => !!a.distributor) : [],
  }));
  [...sanitized, ...customers].forEach((c) => byId.set(c.id, c));
  return Array.from(byId.values());
};

export const findCustomers = (term: string): Customer[] => {
  const raw = term.trim();
  const t = raw.toLowerCase();
  if (t.length < 2) return [];
  const digitsOnly = raw.replace(/\D/g, "");
  const hasDigits = /\d/.test(raw);
  const hasLetters = /[a-zA-Z]/.test(raw);
  const all = getAllCustomers();

  const norm = {
    cpf: (s: string) => s.replace(/\D/g, ""),
    phone: (s: string) => s.replace(/\D/g, ""),
    uc: (s: string) => s.replace(/\D/g, ""),
    protocol: (s: string) => s.replace(/\D/g, ""),
  };

  if (hasDigits && digitsOnly.length >= 6 && !hasLetters) {
    return all.filter((c) =>
      norm.cpf(c.cpf).includes(digitsOnly) ||
      norm.phone(c.phone ?? "").includes(digitsOnly) ||
      norm.protocol(c.lastProtocol ?? "").includes(digitsOnly) ||
      c.addresses.some((a) => norm.uc(a.ucNumber).includes(digitsOnly))
    );
  }

  return all.filter((c) =>
    c.name.toLowerCase().includes(t) ||
    c.cpf.includes(raw) ||
    c.phone.includes(raw) ||
    c.lastProtocol?.includes(raw) ||
    c.addresses.some((a) => a.ucNumber.includes(raw))
  );
};

export const addCustomer = (customer: Omit<Customer, 'id'>): Customer => {
  return addPersistedCustomer(customer);
};

