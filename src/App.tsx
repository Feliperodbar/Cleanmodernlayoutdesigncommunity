import { useState } from 'react';
import { SearchPage } from './components/SearchPage';
import { CustomerServiceLayout } from './components/CustomerServiceLayout';
import { RegisterCustomerPage } from './components/RegisterCustomerPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'search' | 'service' | 'register'>('search');

  if (currentPage === 'search') {
    return (
      <SearchPage 
        onSearchComplete={() => setCurrentPage('service')}
        onRegisterNew={() => setCurrentPage('register')}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <RegisterCustomerPage 
        onBack={() => setCurrentPage('search')}
        onRegisterComplete={() => setCurrentPage('service')}
      />
    );
  }

  return <CustomerServiceLayout onNewService={() => setCurrentPage('search')} />;
}
