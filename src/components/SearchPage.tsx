import { useState, useEffect, useRef } from 'react';
import { Search, Zap, User as UserIcon, FileText, Phone, CreditCard, Clock, ChevronRight, Loader2, Power, Receipt, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { getHighlightedParts } from './ui/utils';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { customers, findCustomers, Customer } from '../data/customers';
import { AppHeader } from './AppHeader';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface SearchPageProps {
  onSearchComplete: (customer: Customer) => void;
  onRegisterNew: (initialDocument: string) => void;
  onQuickNewConnection: (distributor: string) => void;
  onQuickSecondBill: () => void;
  onQuickOutage: () => void;
  onQuickUpdate: () => void;
}

// Using shared Customer type from data module

export function SearchPage({ onSearchComplete, onRegisterNew, onQuickNewConnection, onQuickSecondBill, onQuickOutage, onQuickUpdate }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const distributors = [
    'Neoenergia Elektro',
    'Neoenergia Coelba',
    'Neoenergia Cosern',
    'Neoenergia Pernambuco',
  ];
  const [showDistDialog, setShowDistDialog] = useState(false);

  // Dados compartilhados importados de src/data/customers

  // Atualizar sugestões conforme digita
  useEffect(() => {
    const q = searchTerm.trim();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }
    const hasLetters = /[a-zA-Z]/.test(q);
    const hasDigits = /\d/.test(q);
    setLoading(true);
    debounceRef.current = window.setTimeout(() => {
      const filtered = findCustomers(q);
      setSuggestions(filtered);
      setShowSuggestions(true);
      setActiveIndex(filtered.length > 0 ? 0 : -1);
      setLoading(false);
    }, 400);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const handleSelectCustomer = (customer: Customer) => {
    setSearchTerm('');
    setShowSuggestions(false);
    onSearchComplete(customer);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
      setShowSuggestions(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setActiveIndex((i) => (i + 1) % suggestions.length);
      setShowSuggestions(true);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      setShowSuggestions(true);
      return;
    }
    if (e.key === 'Enter' && suggestions.length > 0) {
      const idx = activeIndex >= 0 ? activeIndex : 0;
      handleSelectCustomer(suggestions[idx]);
    }
  };

  const onlyDigits = (v: string) => v.replace(/\D/g, '');
  const formatCPF = (digits: string) => {
    const v = digits.slice(0, 11);
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0,3)}.${v.slice(3)}`;
    if (v.length <= 9) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9,11)}`;
  };
  const formatCNPJ = (digits: string) => {
    const v = digits.slice(0, 14);
    if (v.length <= 2) return v;
    if (v.length <= 5) return `${v.slice(0,2)}.${v.slice(2)}`;
    if (v.length <= 8) return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5)}`;
    if (v.length <= 12) return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8)}`;
    return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8,12)}-${v.slice(12,14)}`;
  };
  const formatInput = (value: string) => {
    const hasLetters = /[a-zA-Z]/.test(value);
    if (hasLetters) return value;
    const digits = onlyDigits(value).slice(0, 14);
    if (digits.length === 0) return '';
    if (digits.length <= 11) return formatCPF(digits);
    return formatCNPJ(digits);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title=""
        actions={
          <Avatar>
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        }
      />

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-2xl">
          <Card className="shadow-lg">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <ImageWithFallback src="/build/assets/atend.png" alt="Painel de Atendimento" className="w-32 h-32 mx-auto mb-6" style={{ objectFit: 'contain' }} />
                <h2 className="text-2xl text-foreground mb-2">Painel de Atendimento</h2>
                <p className="text-muted-foreground">Identificar cliente</p>
              </div>

              <div className="space-y-4">
                {/* Search Input with Autocomplete */}
                <div className="relative">
                  <Search className="absolute left-4 top-[18px] w-5 h-5 text-secondary/40 z-10" />
                  {loading && (
                    <Loader2 className="absolute right-3 top-[18px] w-5 h-5 text-muted-foreground animate-spin" />
                  )}

                  <Input 
                    placeholder="Digite UC, CPF, Nome ou Protocolo..." 
                    className="pl-12 h-14 text-base border-border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(formatInput(e.target.value))}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-auto z-50">
                      {suggestions.map((customer, idx) => (
                        <div
                          key={customer.id}
                          className={`p-4 cursor-pointer border-b border-border last:border-b-0 transition-colors ${idx === activeIndex ? 'bg-muted' : 'hover:bg-muted'}`}
                          onClick={() => handleSelectCustomer(customer)}
                          onMouseEnter={() => setActiveIndex(idx)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm text-foreground">
                                  {getHighlightedParts(customer.name, searchTerm).map((part, i) => (
                                    <span key={i} className={part.highlight ? 'bg-primary/20 rounded' : undefined}>{part.text}</span>
                                  ))}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getHighlightedParts(customer.cpf, searchTerm).map((part, i) => (
                                    <span key={i} className={part.highlight ? 'bg-primary/20 rounded' : undefined}>{part.text}</span>
                                  ))}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground ml-13">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              UC: {getHighlightedParts(customer.addresses[0]?.ucNumber ?? '', searchTerm).map((part, i) => (
                                <span key={i} className={part.highlight ? 'bg-primary/20 rounded' : undefined}>{part.text}</span>
                              ))}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {getHighlightedParts(customer.phone ?? '', searchTerm).map((part, i) => (
                                <span key={i} className={part.highlight ? 'bg-primary/20 rounded' : undefined}>{part.text}</span>
                              ))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showSuggestions && searchTerm.trim().length >= 2 && suggestions.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
                      <div
                        className="p-4 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 transition-colors"
                        onClick={() => onRegisterNew(searchTerm)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-foreground">Cadastrar novo cliente</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {searchTerm.length < 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Digite pelo menos 2 caracteres para buscar
                  </p>
                )}
                {searchTerm.trim().length >= 2 && /[a-zA-Z]/.test(searchTerm) && !/\d/.test(searchTerm) && searchTerm.trim().split(/\s+/).filter(Boolean).length < 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Digite nome e sobrenome para mostrar opções
                  </p>
                )}
              </div>

              <div className="mt-10 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button className="h-12 w-full justify-start gap-2" onClick={() => setShowDistDialog(true)}>
                    <Power className="w-4 h-4" />
                    <span>Ligação Nova</span>
                  </Button>
                  <Button className="h-12 w-full justify-start gap-2" variant="outline" onClick={onQuickSecondBill}>
                    <Receipt className="w-4 h-4" />
                    <span>Segunda Via de Boleto</span>
                  </Button>
                  <Button className="h-12 w-full justify-start gap-2" variant="outline" onClick={onQuickOutage}>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Falta de Energia</span>
                  </Button>
                  <Button className="h-12 w-full justify-start gap-2" variant="outline" onClick={onQuickUpdate}>
                    <UserIcon className="w-4 h-4" />
                    <span>Atualização Cadastral</span>
                  </Button>
                </div>
                <AlertDialog open={showDistDialog} onOpenChange={setShowDistDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Selecione a distribuidora</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {distributors.map((d) => (
                        <Button key={d} variant="outline" className="justify-start" onClick={() => { onQuickNewConnection(d); setShowDistDialog(false); }}>
                          {d}
                        </Button>
                      ))}
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          
        </div>
      </main>
    </div>
  );
}
