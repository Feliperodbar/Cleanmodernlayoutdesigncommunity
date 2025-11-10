import { useState } from 'react';
import { Search, Phone, Mail, User, FileText, Zap, Plus, Settings, ChevronDown, ChevronUp, Power, DollarSign, Clock, MapPin, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';

interface CustomerServiceLayoutProps {
  onNewService?: () => void;
}

export function CustomerServiceLayout({ onNewService }: CustomerServiceLayoutProps) {
  const [expandedUC, setExpandedUC] = useState<string | null>('1');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const customerData = {
    name: 'THIAGO GOMES DO NASCIMENTO',
    cpf: '072.190.104-27',
    rg: '00.262.439-8',
    birthDate: '28/08/1986',
    email: 'thiagogomesnascimento280886@gmail.com',
    phone: '+5584994043923'
  };

  const addresses = [
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
    },
    {
      id: '2',
      ucNumber: '007028897760',
      address: 'RUA DA TAINHA, 40 SL. 1, VIDA NOVA',
      city: 'PARNAMIRIM',
      cep: '59147-535',
      status: 'active',
      lastBill: 'R$ 89,50',
      dueDate: '18/11/2024',
      consumption: '180 kWh'
    },
    {
      id: '3',
      ucNumber: '007024004478',
      address: 'RUA DEZESSETE DE DEZEMBRO, 35 TO - D AP. 103',
      city: 'BOA VIAGEM',
      cep: '59155-020',
      status: 'inactive',
      lastBill: '-',
      dueDate: '-',
      consumption: '-'
    }
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleUC = (id: string) => {
    setExpandedUC(expandedUC === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#003A70] rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">Atendimento</h1>
                <p className="text-xs text-[#00A859]">NEOENERGIA COSERN</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#003A70]/40" />
              <Input 
                placeholder="Buscar UC, CPF, Protocolo..." 
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              className="bg-[#00A859] hover:bg-[#008F4A] gap-2"
              onClick={onNewService}
            >
              <Plus className="w-4 h-4" />
              Novo Atendimento
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-[#003A70]/5">
              <Settings className="w-5 h-5 text-[#003A70]" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-[#003A70] text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-[#003A70] text-white text-xl">
                  TG
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-slate-900">{customerData.name}</h3>
                <p className="text-xs text-[#00A859]">Pessoa Física</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#003A70]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-[#003A70]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">CPF</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-900">{customerData.cpf}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(customerData.cpf, 'cpf')}
                    >
                      {copiedField === 'cpf' ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#003A70]/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#003A70]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Nascimento</p>
                  <p className="text-sm text-slate-900">{customerData.birthDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#003A70]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#003A70]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Telefone</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-900">{customerData.phone}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(customerData.phone, 'phone')}
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#003A70]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#003A70]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Email</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-900 break-all">{customerData.email}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={() => copyToClipboard(customerData.email, 'email')}
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-2">Ações Rápidas</p>
              <Button variant="outline" className="w-full justify-start gap-2 text-[#003A70] border-[#003A70]/20 hover:bg-[#003A70]/5" size="sm">
                <Settings className="w-4 h-4" />
                Alterar Cadastro
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-[#003A70] border-[#003A70]/20 hover:bg-[#003A70]/5" size="sm">
                <FileText className="w-4 h-4" />
                Ver Histórico
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl">
            {/* Protocol Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Protocolo Atendimento</p>
                <h2 className="text-2xl text-slate-900">202511052102925525</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  Call Center Cosern
                </Badge>
                <Button className="bg-[#00A859] hover:bg-[#008F4A]">
                  Finalizar Protocolo
                </Button>
              </div>
            </div>

            {/* UC Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900">Unidades Consumidoras ({addresses.length})</h3>
                <Input 
                  placeholder="Filtrar UC..." 
                  className="w-64 bg-white border-slate-200"
                />
              </div>

              {addresses.map((address) => (
                <Card key={address.id} className="border-slate-200 overflow-hidden">
                  <CardContent className="p-0">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => toggleUC(address.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-[#003A70] flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-slate-900">{address.ucNumber}</p>
                            <Badge 
                              variant={address.status === 'active' ? 'default' : 'secondary'}
                              className={address.status === 'active' 
                                ? 'bg-[#00A859]/10 text-[#00A859] hover:bg-[#00A859]/10' 
                                : 'bg-red-100 text-red-700 hover:bg-red-100'
                              }
                            >
                              {address.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">{address.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {address.status === 'active' && (
                          <div className="flex items-center gap-4 mr-4">
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Última Fatura</p>
                              <p className="text-sm text-slate-900">{address.lastBill}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Vencimento</p>
                              <p className="text-sm text-slate-900">{address.dueDate}</p>
                            </div>
                          </div>
                        )}
                        <Button variant="ghost" size="icon">
                          {expandedUC === address.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {expandedUC === address.id && (
                      <div className="border-t border-slate-200 bg-slate-50">
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#003A70]/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-[#003A70]" />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Endereço Completo</p>
                                <p className="text-sm text-slate-900">{address.address}</p>
                                <p className="text-sm text-slate-900">{address.city} - {address.cep}</p>
                              </div>
                            </div>

                            {address.status === 'active' && (
                              <>
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-[#00A859]/10 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-[#00A859]" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">Última Fatura</p>
                                    <p className="text-sm text-slate-900">{address.lastBill}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">Vencimento</p>
                                    <p className="text-sm text-slate-900">{address.dueDate}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">Consumo</p>
                                    <p className="text-sm text-slate-900">{address.consumption}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <Separator />

                          <div className="flex items-center gap-2">
                            <Button className="bg-[#00A859] hover:bg-[#008F4A] gap-2" size="sm">
                              <FileText className="w-4 h-4" />
                              2ª Via de Fatura
                            </Button>
                            <Button variant="outline" className="gap-2 text-[#003A70] border-[#003A70]/20 hover:bg-[#003A70]/5" size="sm">
                              <Power className="w-4 h-4" />
                              Falta de Energia
                            </Button>
                            <Button variant="outline" className="gap-2 text-[#003A70] border-[#003A70]/20 hover:bg-[#003A70]/5" size="sm">
                              <Settings className="w-4 h-4" />
                              Serviços UC
                            </Button>
                            <Button variant="outline" className="gap-2 text-[#003A70] border-[#003A70]/20 hover:bg-[#003A70]/5" size="sm">
                              <FileText className="w-4 h-4" />
                              Histórico
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
