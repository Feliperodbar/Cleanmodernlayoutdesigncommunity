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
}

export interface Customer {
  id: string;
  name: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
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
      }
    ]
  }
];

export const findCustomers = (term: string): Customer[] => {
  const t = term.trim().toLowerCase();
  if (t.length < 2) return [];
  return customers.filter((c) =>
    c.name.toLowerCase().includes(t) ||
    c.cpf.includes(term) ||
    c.phone.includes(term) ||
    c.lastProtocol?.includes(term) ||
    c.addresses.some((a) => a.ucNumber.includes(term))
  );
};

