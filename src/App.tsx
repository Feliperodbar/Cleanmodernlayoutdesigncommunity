import { useState } from 'react';
import { SearchPage } from './components/SearchPage';
import { CustomerServiceLayout } from './components/CustomerServiceLayout';
import { RegisterCustomerPage } from './components/RegisterCustomerPage';
import { NewConnectionChecklistPage } from './components/NewConnectionChecklistPage';
import { NewConnectionAddressPage } from './components/NewConnectionAddressPage';
import { NewConnectionInstallationPage } from './components/NewConnectionInstallationPage';
import { NewConnectionEquipmentPage } from './components/NewConnectionEquipmentPage';
import { NewConnectionSummaryPage } from './components/NewConnectionSummaryPage';
import type { Customer } from './data/customers';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'search' | 'service' | 'register' | 'new_connection_checklist' | 'new_connection_address' | 'new_connection_installation' | 'new_connection_equipment' | 'new_connection_summary'>('search');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [registerInitialDocument, setRegisterInitialDocument] = useState<string | undefined>(undefined);

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
        onNext={() => setCurrentPage('new_connection_installation')}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
      />
    );
  }
  if (currentPage === 'new_connection_installation') {
    return (
      <NewConnectionInstallationPage
        onBack={() => setCurrentPage('new_connection_address')}
        onNext={() => setCurrentPage('new_connection_equipment')}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
      />
    );
  }
  if (currentPage === 'new_connection_equipment') {
    return (
      <NewConnectionEquipmentPage
        onBack={() => setCurrentPage('new_connection_installation')}
        onNext={() => setCurrentPage('new_connection_summary')}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
      />
    );
  }
  if (currentPage === 'new_connection_summary') {
    return (
      <NewConnectionSummaryPage
        onBack={() => setCurrentPage('new_connection_equipment')}
        onFinish={() => setCurrentPage('service')}
        onCancel={() => setCurrentPage('service')}
        customer={selectedCustomer}
      />
    );
  }
  return (
    <CustomerServiceLayout 
      customer={selectedCustomer}
      onNewService={() => setCurrentPage('search')}
      onNewConnection={() => setCurrentPage('new_connection_checklist')}
      onSelectCustomer={(customer) => setSelectedCustomer(customer)}
    />
  );
}
