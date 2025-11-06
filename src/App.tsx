import { useState } from 'react';
import { CustomerServiceLayout } from './components/CustomerServiceLayout';
import { HomePage } from './components/HomePage';

export default function App() {
  const [view, setView] = useState<'home' | 'service'>('home');

  if (view === 'home') {
    return <HomePage onIdentifyClick={() => setView('service')} />;
  }

  return <CustomerServiceLayout />;
}
