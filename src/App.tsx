import { useState } from 'react';
import { SearchPage } from './components/SearchPage';
import { CustomerServiceLayout } from './components/CustomerServiceLayout';
import { RegisterCustomerPage } from './components/RegisterCustomerPage';
import type { Customer } from './data/customers';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'search' | 'service' | 'register'>('search');
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
  return (
    <CustomerServiceLayout 
      customer={selectedCustomer}
      onNewService={() => setCurrentPage('search')}
      onSelectCustomer={(customer) => setSelectedCustomer(customer)}
    />
  );
}
