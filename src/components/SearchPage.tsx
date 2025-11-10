import { useState, useEffect } from 'react';
import { Search, Zap, User as UserIcon, FileText, Phone, CreditCard, Clock, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface SearchPageProps {
  onSearchComplete: () => void;
  onRegisterNew: () => void;
}

interface Customer {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  uc: string;
  lastProtocol?: string;
  lastService?: string;
  timestamp?: string;
}

export function SearchPage({ onSearchComplete, onRegisterNew }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Clientes cadastrados (mockado)
  const registeredCustomers: Customer[] = [
    {
      id: '1',
      name: 'THIAGO GOMES DO NASCIMENTO',
      cpf: '072.190.104-27',
      phone: '+5584994043923',
      uc: '007027028416',
      lastProtocol: '202511052102925525',
      lastService: '2ª Via de Fatura',
      timestamp: 'Hoje às 14:30'
    },
    {
      id: '2',
      name: 'MARIA SILVA SANTOS',
      cpf: '123.456.789-00',
      phone: '+5584988887777',
      uc: '007028897760',
      lastProtocol: '202511052102925524',
      lastService: 'Falta de Energia',
      timestamp: 'Hoje às 10:15'
    },
    {
      id: '3',
      name: 'JOÃO PEDRO OLIVEIRA',
      cpf: '987.654.321-00',
      phone: '+5584977776666',
      uc: '007024004478',
      lastProtocol: '202511052102925523',
      lastService: 'Informação',
      timestamp: 'Ontem às 16:45'
    }
  ];

  // Atualizar sugestões conforme digita
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const filtered = registeredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.cpf.includes(searchTerm) ||
        customer.uc.includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        customer.lastProtocol?.includes(searchTerm)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSelectCustomer = (customer: Customer) => {
    setSearchTerm('');
    setShowSuggestions(false);
    onSearchComplete();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelectCustomer(suggestions[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003A70] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">Atendimento</h1>
              <p className="text-xs text-[#00A859]">NEOENERGIA COSERN</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-[#003A70] text-white">
                <UserIcon className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-2xl">
          <Card className="border-slate-200 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="w-32 h-32 bg-[#003A70]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon className="w-16 h-16 text-[#003A70]" />
                </div>
                <h2 className="text-2xl text-slate-900 mb-2">Painel de Atendimento</h2>
                <p className="text-slate-500">Identificar cliente</p>
              </div>

              <div className="space-y-4">
                {/* Search Input with Autocomplete */}
                <div className="relative">
                  <Search className="absolute left-4 top-[18px] w-5 h-5 text-[#003A70]/40 z-10" />
                  <Input 
                    placeholder="Digite UC, CPF, Nome ou Protocolo..." 
                    className="pl-12 h-14 text-base border-slate-300 focus:border-[#003A70] focus:ring-[#003A70]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-auto z-50">
                      {suggestions.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#003A70] rounded-lg flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-900">{customer.name}</p>
                                <p className="text-xs text-slate-500">{customer.cpf}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500 ml-13">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              UC: {customer.uc}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {searchTerm.length < 2 && (
                  <p className="text-xs text-slate-500 text-center">
                    Digite pelo menos 2 caracteres para buscar
                  </p>
                )}
              </div>

              {/* New Customer Button */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-3">Cliente não encontrado?</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-center gap-2 h-12 text-[#00A859] border-[#00A859] hover:bg-[#00A859] hover:text-white transition-colors"
                  onClick={onRegisterNew}
                >
                  <UserIcon className="w-5 h-5" />
                  Cadastrar Novo Cliente
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-slate-500">
              Digite para buscar por UC, CPF, Nome ou Protocolo
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {registeredCustomers.length} clientes cadastrados
              </span>
              <span className="flex items-center gap-1">
                <Search className="w-3 h-3" />
                Busca em tempo real
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
