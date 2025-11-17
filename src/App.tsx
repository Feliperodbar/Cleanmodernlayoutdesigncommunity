import { useState } from 'react';
import { SearchPage } from './components/SearchPage';
import { CustomerServiceLayout } from './components/CustomerServiceLayout';
import { RegisterCustomerPage } from './components/RegisterCustomerPage';
import { NewConnectionChecklistPage } from './components/NewConnectionChecklistPage';
import type { Customer } from './data/customers';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'search' | 'service' | 'register' | 'new_connection_checklist'>('search');
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
        onNext={() => setCurrentPage('service')}
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
