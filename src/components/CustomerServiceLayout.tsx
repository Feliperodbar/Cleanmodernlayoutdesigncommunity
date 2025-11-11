import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Phone,
  Mail,
  User,
  FileText,
  Zap,
  Plus,
  Settings,
  ChevronDown,
  ChevronUp,
  Power,
  DollarSign,
  Clock,
  MapPin,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
// Removido ThemeToggle (dark mode desativado)
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// Removidos componentes de AlertDialog (confirmação não será usada)
// Switch removido conforme nova especificação
import { customers, findCustomers } from "../data/customers";
import type { Customer } from "../data/customers";

interface CustomerServiceLayoutProps {
  onNewService?: () => void;
  customer?: Customer | null;
  onSelectCustomer?: (customer: Customer) => void;
}

export function CustomerServiceLayout({
  onNewService,
  customer,
  onSelectCustomer,
}: CustomerServiceLayoutProps) {
  const [expandedUC, setExpandedUC] = useState<string | null>("1");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Removidos estados de serviços e diálogo de confirmação
  const distributors = [
    "Neoenergia Elektro",
    "Neoenergia Coelba",
    "Neoenergia Cosern",
    "Neoenergia Pernambuco",
  ];
  const [selectedDistributor, setSelectedDistributor] =
    useState<string>("Neoenergia Cosern");
  const selectedCustomer: Customer = useMemo(
    () => customer ?? customers[0],
    [customer]
  );

  const baseAddress = selectedCustomer.addresses[0];

  const computeUCForDistributor = (uc: string, dist: string) => {
    const prefixes: Record<string, string> = {
      "Neoenergia Elektro": "101",
      "Neoenergia Coelba": "102",
      "Neoenergia Cosern": uc.slice(0, 3) || "103",
      "Neoenergia Pernambuco": "104",
    };
    const prefix = prefixes[dist] ?? "105";
    return uc.length >= 3 ? prefix + uc.slice(3) : prefix + uc;
  };

  const addresses = selectedCustomer.addresses.map((addr) => ({
    ...addr,
    ucNumber: computeUCForDistributor(addr.ucNumber, selectedDistributor),
  }));

  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const filtered = findCustomers(searchTerm);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSelectSuggestion = (c: Customer) => {
    setSearchTerm("");
    setShowSuggestions(false);
    onSelectCustomer?.(c);
  };

  // Função de favoritos removida

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleUC = (id: string) => {
    setExpandedUC(expandedUC === id ? null : id);
  };

  const handleServiceClick = (service: string) => {
    console.log("[ServiceClick]", service);
    // Não navegar ao clicar em serviço
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
                <p className="text-xs text-[#00A859]">
                  {selectedDistributor.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#003A70]/40" />
              <Input
                placeholder="Buscar UC, CPF, Protocolo..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() =>
                  searchTerm.length >= 2 && setShowSuggestions(true)
                }
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-auto z-50">
                  {suggestions.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
                      onClick={() => handleSelectSuggestion(c)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#003A70] rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-900">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.cpf}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 ml-11 mt-1">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          UC: {c.addresses[0]?.ucNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-[#003A70]/5"
            >
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

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-[#003A70] text-white text-xl">
                  {selectedCustomer.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-[#00A859]">Pessoa Física</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#003A70]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-[#003A70]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">CPF</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-900">
                      {selectedCustomer.cpf}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        copyToClipboard(selectedCustomer.cpf, "cpf")
                      }
                    >
                      {copiedField === "cpf" ? (
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
                  <p className="text-sm text-slate-900">
                    {selectedCustomer.birthDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#003A70]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#003A70]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Telefone</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-900">
                      {selectedCustomer.phone}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        copyToClipboard(selectedCustomer.phone, "phone")
                      }
                    >
                      {copiedField === "phone" ? (
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
                    <p className="text-sm text-slate-900 break-all">
                      {selectedCustomer.email}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={() =>
                        copyToClipboard(selectedCustomer.email ?? "", "email")
                      }
                    >
                      {copiedField === "email" ? (
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

            {/* Distribuidora seletor movido para o conteúdo principal */}

            {/* Favoritos removidos conforme nova especificação */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl">
            {/* Cabeçalho do protocolo (botão de finalizar movido para rodapé fixo) */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Protocolo Atendimento
                </p>
                <h2 className="text-2xl text-slate-900">
                  {selectedCustomer.lastProtocol ?? "—"}
                </h2>
              </div>
            </div>

            {/* Nova Ligação CTA */}
            <div className="mb-6">
              <Button className="bg-[#00A859] hover:bg-[#008F4A] gap-2">
                <Power className="w-4 h-4" />
                Ligação Nova
              </Button>
            </div>

            {/* Seletor de distribuidora acima das UCs */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#003A70]/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-[#003A70]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Distribuidora</p>
                  <Select
                    value={selectedDistributor}
                    onValueChange={(v: string) => setSelectedDistributor(v)}
                  >
                    <SelectTrigger className="w-64 bg-white border border-[#003A70]/40 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {distributors.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* UC Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900">
                  Unidades Consumidoras ({addresses.length})
                </h3>
                <Input
                  placeholder="Filtrar UC..."
                  className="w-64 bg-white border-slate-200"
                />
              </div>

              {addresses.map((address) => (
                <Card
                  key={address.id}
                  className="border-slate-200 overflow-hidden"
                >
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
                              variant={
                                address.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                address.status === "active"
                                  ? "bg-[#00A859]/10 text-[#00A859] hover:bg-[#00A859]/10"
                                  : "bg-red-100 text-red-700 hover:bg-red-100"
                              }
                            >
                              {address.status === "active"
                                ? "Ativo"
                                : "Inativo"}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            {address.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {address.status === "active" && (
                          <div className="flex items-center gap-4 mr-4">
                            <div className="text-right">
                              <p className="text-xs text-slate-500">
                                Última Fatura
                              </p>
                              <p className="text-sm text-slate-900">
                                {address.lastBill}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">
                                Vencimento
                              </p>
                              <p className="text-sm text-slate-900">
                                {address.dueDate}
                              </p>
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
                          <div className="grid grid-cols-4 gap-6">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#003A70]/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-[#003A70]" />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">
                                  Endereço Completo
                                </p>
                                <p className="text-sm text-slate-900">
                                  {address.address}
                                </p>
                                <p className="text-sm text-slate-900">
                                  {address.city} - {address.cep}
                                </p>
                              </div>
                            </div>

                            {address.status === "active" && (
                              <>
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-[#00A859]/10 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-[#00A859]" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">
                                      Última Fatura
                                    </p>
                                    <p className="text-sm text-slate-900">
                                      {address.lastBill}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">
                                      Vencimento
                                    </p>
                                    <p className="text-sm text-slate-900">
                                      {address.dueDate}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Consumo
                                    </p>
                                    <p className="text-sm text-foreground">
                                      {address.consumption}
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">
                              Serviços da UC
                            </p>
                            {/* Grid em duas colunas com botões uniformes */}
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                "Fatura Digital",
                                "Débito Automático",
                                "Data Certa",
                                "Atendimento Emergencial",
                                "Alteração Cadastral",
                                "2ª Via de Quitação de Débito",
                                "2ª Via de Fatura",
                                "2ª Via de Contrato de Parcelamento",
                              ].map((service) => (
                                <Button
                                  key={service}
                                  variant="outline"
                                  className="h-12 w-full justify-start gap-2"
                                  size="sm"
                                  type="button"
                                  onClick={() => handleServiceClick(service)}
                                >
                                  <FileText className="w-4 h-4" />
                                  <span>{service}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Rodapé fixo com ação principal (melhor visibilidade para o usuário) */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 mt-6 z-30">
              <div className="max-w-6xl p-4 flex justify-end">
                <Button
                  className="bg-[#00A859] hover:bg-[#008F4A]"
                  type="button"
                >
                  Finalizar Protocolo
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
