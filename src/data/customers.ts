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
    addresses: [
      {
        id: '1',
        ucNumber: '007027028416',
        address: 'RUA DAS ORQUÍDEAS, 270, TABORDA',
        city: 'SÃO GONÇALO DO AMARANTE',
        cep: '59162-000',
        status: 'active',
        lastBill: 'R$ 145,30',
        dueDate: '15/11/2024',
        consumption: '320 kWh'
      },
      {
        id: '2',
        ucNumber: '007027555001',
        address: 'AV. BRASIL, 150, CENTRO',
        city: 'NATAL',
        cep: '59000-000',
        status: 'active',
        lastBill: 'R$ 210,40',
        dueDate: '20/11/2024',
        consumption: '410 kWh'
      },
      {
        id: '3',
        ucNumber: '007027999888',
        address: 'RUA DOS PINHEIROS, 45, LAGOA NOVA',
        city: 'NATAL',
        cep: '59076-001',
        status: 'inactive',
        lastBill: '-',
        dueDate: '-',
        consumption: '-'
      }
    ]
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
    addresses: [
      {
        id: '1',
        ucNumber: '007028897760',
        address: 'RUA DA TAINHA, 40 SL. 1, VIDA NOVA',
        city: 'PARNAMIRIM',
        cep: '59147-535',
        status: 'active',
        lastBill: 'R$ 89,50',
        dueDate: '18/11/2024',
        consumption: '180 kWh'
      },
      {
        id: '2',
        ucNumber: '007028123456',
        address: 'RUA DOS JASMINS, 12, EMAÚS',
        city: 'PARNAMIRIM',
        cep: '59148-000',
        status: 'inactive',
        lastBill: '-',
        dueDate: '-',
        consumption: '-'
      },
      {
        id: '3',
        ucNumber: '007028654321',
        address: 'AV. AYRTON SENNA, 300, NOVA PARNAMIRIM',
        city: 'PARNAMIRIM',
        cep: '59122-200',
        status: 'active',
        lastBill: 'R$ 126,70',
        dueDate: '22/11/2024',
        consumption: '250 kWh'
      }
    ]
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
    addresses: [
      {
        id: '1',
        ucNumber: '007024004478',
        address: 'RUA DEZESSETE DE DEZEMBRO, 35 TO - D AP. 103',
        city: 'BOA VIAGEM',
        cep: '59155-020',
        status: 'inactive',
        lastBill: '-',
        dueDate: '-',
        consumption: '-'
      },
      {
        id: '2',
        ucNumber: '007024111222',
        address: 'RUA DOS LÍRIOS, 88, CAPIM MACIO',
        city: 'NATAL',
        cep: '59078-500',
        status: 'active',
        lastBill: 'R$ 174,90',
        dueDate: '25/11/2024',
        consumption: '300 kWh'
      },
      {
        id: '3',
        ucNumber: '007024333444',
        address: 'AV. ROBERTO FREIRE, 950, PONTA NEGRA',
        city: 'NATAL',
        cep: '59090-145',
        status: 'inactive',
        lastBill: '-',
        dueDate: '-',
        consumption: '-'
      }
    ]
  }
];

import { getAllPersistedCustomers, addPersistedCustomer } from './db';

export const getAllCustomers = (): Customer[] => {
  const persisted = getAllPersistedCustomers();
  // Merge static and persisted, dedupe by id
  const byId = new Map<string, Customer>();
  [...persisted, ...customers].forEach((c) => byId.set(c.id, c));
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

