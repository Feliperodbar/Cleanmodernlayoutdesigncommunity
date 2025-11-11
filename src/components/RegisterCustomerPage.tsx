import { useState } from 'react';
import { ArrowLeft, Zap, User as UserIcon, CreditCard, MapPin, Phone, Mail, Building2, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface RegisterCustomerPageProps {
  onBack: () => void;
  onRegisterComplete: () => void;
}

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export function RegisterCustomerPage({ onBack, onRegisterComplete }: RegisterCustomerPageProps) {
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
  const [document, setDocument] = useState('');
  const [fullName, setFullName] = useState('');
  const [cep, setCep] = useState('');
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const formatDocument = (value: string, type: 'cpf' | 'cnpj') => {
    const numbers = value.replace(/\D/g, '');
    
    if (type === 'cpf') {
      return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return numbers
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numbers
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleCepChange = async (value: string) => {
    const formattedCep = formatCep(value);
    setCep(formattedCep);

    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddressData({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setLoadingCep(false);
      }
    } else {
      setAddressData(null);
    }
  };

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value, documentType);
    setDocument(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular cadastro e ir para página de atendimento
    onRegisterComplete();
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
              <h1 className="text-slate-900">Cadastro de Cliente</h1>
              <p className="text-xs text-[#00A859]">NEOENERGIA COSERN</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2 text-[#003A70] border-[#003A70]/20 hover:bg-[#003A70]/5"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
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
        <div className="w-full max-w-4xl">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#003A70]/10 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-[#003A70]" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Novo Cliente</CardTitle>
                  <p className="text-sm text-slate-500">Preencha os dados para cadastrar um novo cliente</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Document Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-[#003A70]" />
                    <h3 className="text-slate-900">Identificação</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="document">CPF/CNPJ *</Label>
                      <div className="flex gap-2">
                        <Select
                          value={documentType}
                          onValueChange={(value: 'cpf' | 'cnpj') => {
                            setDocumentType(value);
                            setDocument('');
                          }}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="cnpj">CNPJ</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="document"
                          value={document}
                          onChange={(e) => handleDocumentChange(e.target.value)}
                          placeholder={documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                          className="flex-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Digite o nome completo"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-[#003A70]" />
                    <h3 className="text-slate-900">Endereço</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <div className="relative">
                        <Input
                          id="cep"
                          value={cep}
                          onChange={(e) => handleCepChange(e.target.value)}
                          placeholder="00000-000"
                          required
                        />
                        {loadingCep && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#003A70] animate-spin" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="street">Logradouro *</Label>
                      <Input
                        id="street"
                        value={addressData?.street || ''}
                        readOnly
                        placeholder="Será preenchido automaticamente"
                        className="bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="number">Número *</Label>
                      <Input
                        id="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Apto 101"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro *</Label>
                      <Input
                        id="neighborhood"
                        value={addressData?.neighborhood || ''}
                        readOnly
                        placeholder="Auto-preenchido"
                        className="bg-slate-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade/UF *</Label>
                      <Input
                        id="city"
                        value={addressData ? `${addressData.city}/${addressData.state}` : ''}
                        readOnly
                        placeholder="Auto-preenchido"
                        className="bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-[#003A70]" />
                    <h3 className="text-slate-900">Contato</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cellPhone">Telefone Celular *</Label>
                      <Input
                        id="cellPhone"
                        value={cellPhone}
                        onChange={(e) => setCellPhone(formatPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="homePhone">Telefone Residencial</Label>
                      <Input
                        id="homePhone"
                        value={homePhone}
                        onChange={(e) => setHomePhone(formatPhone(e.target.value))}
                        placeholder="(00) 0000-0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Company Section */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-[#003A70]" />
                    <h3 className="text-slate-900">Distribuidora</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Selecione a Distribuidora *</Label>
                    <Select value={company} onValueChange={setCompany} required>
                      <SelectTrigger id="company">
                        <SelectValue placeholder="Selecione uma distribuidora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coelba">Neoenergia Coelba</SelectItem>
                        <SelectItem value="cosern">Neoenergia Cosern</SelectItem>
                        <SelectItem value="elektro">Neoenergia Elektro</SelectItem>
                        <SelectItem value="pernambuco">Neoenergia Pernambuco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-[#003A70] border-[#003A70]/20 hover:bg-[#003A70]/5"
                    onClick={onBack}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#00A859] hover:bg-[#008F4A] gap-2"
                  >
                    <UserIcon className="w-4 h-4" />
                    Cadastrar Cliente
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
