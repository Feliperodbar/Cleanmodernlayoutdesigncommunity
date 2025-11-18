import { useState } from 'react';
import { SearchPage } from './components/SearchPage';
import { CustomerServiceLayout } from './components/CustomerServiceLayout';
import { RegisterCustomerPage } from './components/RegisterCustomerPage';
import { NewConnectionChecklistPage } from './components/NewConnectionChecklistPage';
import { NewConnectionAddressPage } from './components/NewConnectionAddressPage';
import { NewConnectionInstallationPage } from './components/NewConnectionInstallationPage';
import { NewConnectionEquipmentPage } from './components/NewConnectionEquipmentPage';
import { NewConnectionSummaryPage } from './components/NewConnectionSummaryPage';
import { NewConnectionServicesPage } from './components/NewConnectionServicesPage';
import type { Customer, Address } from './data/customers';
import type { NewConnectionAddressData } from './components/NewConnectionAddressPage';
import type { NewConnectionInstallationData } from './components/NewConnectionInstallationPage';
import type { NewConnectionEquipmentData } from './components/NewConnectionEquipmentPage';
import { getAllPersistedCustomers, updatePersistedCustomer, addPersistedCustomer } from './data/db';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'search' | 'service' | 'register' | 'new_connection_checklist' | 'new_connection_address' | 'new_connection_installation' | 'new_connection_equipment' | 'new_connection_summary' | 'new_connection_services'>('search');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [registerInitialDocument, setRegisterInitialDocument] = useState<string | undefined>(undefined);
  const [newConnectionAddressData, setNewConnectionAddressData] = useState<NewConnectionAddressData | null>(null);
  const [newConnectionInstallationData, setNewConnectionInstallationData] = useState<NewConnectionInstallationData | null>(null);
  const [newConnectionEquipmentData, setNewConnectionEquipmentData] = useState<NewConnectionEquipmentData | null>(null);
  const [newConnectionSelectedDistributor, setNewConnectionSelectedDistributor] = useState<string | null>(null);

  const generateUCNumber = (distributor: string | null): string => {
    const map: Record<string, string> = {
      'Neoenergia Elektro': '101',
      'Neoenergia Coelba': '102',
      'Neoenergia Cosern': '103',
      'Neoenergia Pernambuco': '104',
    };
    const prefix = distributor && map[distributor] ? map[distributor] : '105';
    let tail = '';
    while (tail.length < 9) {
      tail += Math.floor(Math.random() * 10).toString();
    }
    return prefix + tail;
  };

  const createNewUCAddress = (): Address | null => {
    if (!newConnectionAddressData) return null;
    const ucNumber = generateUCNumber(newConnectionSelectedDistributor);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const line = `${newConnectionAddressData.address}${newConnectionAddressData.number ? ", " + newConnectionAddressData.number : ""}${newConnectionAddressData.neighborhood ? ", " + newConnectionAddressData.neighborhood : ""}`;
    return {
      id,
      ucNumber,
      address: line,
      city: newConnectionAddressData.city,
      cep: newConnectionAddressData.cep,
      status: 'inactive',
      lastBill: '-',
      dueDate: '-',
      consumption: '-',
      distributor: newConnectionSelectedDistributor ?? undefined,
    };
  };

  if (currentPage === 'search') {
    return (
      <SearchPage 
        onSearchComplete={(customer) => {
          setSelectedCustomer(customer);
          setCurrentPage('service');
        }}
        onRegisterNew={(initialDocument) => {
          setRegisterInitialDocument(initialDocument);
          setCurrentPage('register');
        }}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <RegisterCustomerPage 
        onBack={() => setCurrentPage('search')}
        onRegisterComplete={() => setCurrentPage('service')}
        initialDocument={registerInitialDocument}
      />
    );
  }
  if (currentPage === 'new_connection_checklist') {
    return (
      <NewConnectionChecklistPage
        onBack={() => setCurrentPage('service')}
        onNext={() => setCurrentPage('new_connection_address')}
        customer={selectedCustomer}
      />
    );
  }
  if (currentPage === 'new_connection_address') {
    return (
      <NewConnectionAddressPage
        onBack={() => setCurrentPage('new_connection_checklist')}
        onNext={(data) => { setNewConnectionAddressData(data); setCurrentPage('new_connection_installation'); }}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
      />
    );
  }
  if (currentPage === 'new_connection_installation') {
    return (
      <NewConnectionInstallationPage
        onBack={() => setCurrentPage('new_connection_address')}
        onNext={(data) => { setNewConnectionInstallationData(data); setCurrentPage('new_connection_equipment'); }}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
      />
    );
  }
  if (currentPage === 'new_connection_equipment') {
    return (
      <NewConnectionEquipmentPage
        onBack={() => setCurrentPage('new_connection_installation')}
        onNext={(data) => { setNewConnectionEquipmentData(data); setCurrentPage('new_connection_summary'); }}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
      />
    );
  }
  if (currentPage === 'new_connection_summary') {
    return (
      <NewConnectionSummaryPage
        onBack={() => setCurrentPage('new_connection_equipment')}
        onFinish={() => setCurrentPage('new_connection_services')}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
        address={newConnectionAddressData}
        installation={newConnectionInstallationData}
        equipment={newConnectionEquipmentData}
      />
    );
  }
  if (currentPage === 'new_connection_services') {
    return (
      <NewConnectionServicesPage
        onBack={() => setCurrentPage('new_connection_summary')}
        onConfirm={() => {
          const addr = createNewUCAddress();
          if (addr && selectedCustomer) {
            const persisted = getAllPersistedCustomers();
            const exists = persisted.find((c) => c.id === selectedCustomer.id);
            if (exists) {
              const updated = updatePersistedCustomer(selectedCustomer.id, { addresses: [addr, ...exists.addresses] });
              if (updated) {
                setSelectedCustomer(updated);
              }
            } else {
              const clone: Omit<Customer, 'id'> = {
                name: selectedCustomer.name,
                cpf: selectedCustomer.cpf,
                rg: selectedCustomer.rg,
                birthDate: selectedCustomer.birthDate,
                sex: selectedCustomer.sex,
                email: selectedCustomer.email,
                phone: selectedCustomer.phone,
                addresses: [addr, ...selectedCustomer.addresses],
                lastProtocol: selectedCustomer.lastProtocol,
                lastService: selectedCustomer.lastService,
                timestamp: new Date().toLocaleString(),
              };
              const persistedNew = addPersistedCustomer(clone);
              setSelectedCustomer(persistedNew);
            }
          }
          setCurrentPage('service');
        }}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
      />
    );
  }
  return (
    <CustomerServiceLayout 
      customer={selectedCustomer}
      onNewService={() => setCurrentPage('search')}
      onNewConnection={(dist) => { setNewConnectionSelectedDistributor(dist); setCurrentPage('new_connection_checklist'); }}
      onSelectCustomer={(customer) => setSelectedCustomer(customer)}
    />
  );
}
