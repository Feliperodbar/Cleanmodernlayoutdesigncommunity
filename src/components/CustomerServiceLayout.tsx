import { useEffect, useMemo, useRef, useState } from "react";
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
  Building2,
  ChevronRight,
  Loader2,
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
import { getHighlightedParts } from "./ui/utils";
import type { Customer } from "../data/customers";
import { AppHeader } from "./AppHeader";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface CustomerServiceLayoutProps {
  onNewService?: () => void;
  onNewConnection?: (distributor: string) => void;
  customer?: Customer | null;
  onSelectCustomer?: (customer: Customer) => void;
}

export function CustomerServiceLayout({
  onNewService,
  onNewConnection,
  customer,
  onSelectCustomer,
}: CustomerServiceLayoutProps) {
  const [expandedUC, setExpandedUC] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressFilter, setAddressFilter] = useState<"all" | "active" | "inactive">("all");
  const debounceRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
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

  const addresses = selectedCustomer.addresses
    .filter((addr) => !addr.distributor || addr.distributor === selectedDistributor)
    .map((addr) => ({
      ...addr,
      ucNumber: addr.distributor ? addr.ucNumber : computeUCForDistributor(addr.ucNumber, selectedDistributor),
    }));

  const filteredAddresses = addresses.filter((a) => {
    if (addressFilter === "active") return a.status === "active";
    if (addressFilter === "inactive") return a.status !== "active";
    return true;
  });

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
    if (hasLetters && !hasDigits) {
      const parts = q.split(/\s+/).filter(Boolean);
      if (parts.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    debounceRef.current = window.setTimeout(() => {
      const filtered = findCustomers(q);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveIndex(filtered.length > 0 ? 0 : -1);
      setLoading(false);
    }, 400);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const handleSelectSuggestion = (c: Customer) => {
    setSearchTerm("");
    setShowSuggestions(false);
    onSelectCustomer?.(c);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchTerm("");
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setActiveIndex((i) => (i + 1) % suggestions.length);
      setShowSuggestions(true);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      setShowSuggestions(true);
      return;
    }
    if (e.key === "Enter" && suggestions.length > 0) {
      const idx = activeIndex >= 0 ? activeIndex : 0;
      handleSelectSuggestion(suggestions[idx]);
    }
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
    <div className="min-h-screen bg-background">
      <AppHeader
        title=""
        onLogoClick={onNewService}
        center={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            )}

            <Input
              placeholder="Buscar UC, CPF, Protocolo..."
              className="pl-10 bg-input-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-auto z-50">
                {suggestions.map((c, idx) => (
                  <div
                    key={c.id}
                    className={`p-3 cursor-pointer border-b border-border last:border-b-0 transition-colors ${
                      idx === activeIndex ? "bg-muted" : "hover:bg-muted"
                    }`}
                    onClick={() => handleSelectSuggestion(c)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground">
                            {getHighlightedParts(c.name, searchTerm).map(
                              (part, i) => (
                                <span
                                  key={i}
                                  className={
                                    part.highlight
                                      ? "bg-primary/20 rounded"
                                      : undefined
                                  }
                                >
                                  {part.text}
                                </span>
                              )
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getHighlightedParts(c.cpf, searchTerm).map(
                              (part, i) => (
                                <span
                                  key={i}
                                  className={
                                    part.highlight
                                      ? "bg-primary/20 rounded"
                                      : undefined
                                  }
                                >
                                  {part.text}
                                </span>
                              )
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground ml-11 mt-1">
                      <span className="flex items-center gap-1">
                        UC:{" "}
                        {getHighlightedParts(
                          c.addresses[0]?.ucNumber ?? "",
                          searchTerm
                        ).map((part, i) => (
                          <span
                            key={i}
                            className={
                              part.highlight
                                ? "bg-primary/20 rounded"
                                : undefined
                            }
                          >
                            {part.text}
                          </span>
                        ))}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {getHighlightedParts(c.phone ?? "", searchTerm).map(
                          (part, i) => (
                            <span
                              key={i}
                              className={
                                part.highlight
                                  ? "bg-primary/20 rounded"
                                  : undefined
                              }
                            >
                              {part.text}
                            </span>
                          )
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-secondary/5"
            >
              <Settings className="w-5 h-5 text-secondary" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </>
        }
      />

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-80 bg-card border-r border-border min-h-[calc(100vh-73px)]">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xl">
                  {selectedCustomer.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-foreground">{selectedCustomer.name}</h3>
                <p className="text-xs text-primary">Pessoa Física</p>
              </div>
            </div>

            <div className="mt-2">
              <Button
                className="bg-primary hover:bg-primary/90 gap-2 w-full"
                onClick={onNewService}
              >
                <Plus className="w-4 h-4" />
                Atualização Cadastral
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">CPF</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">
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
                        <Check className="w-3 h-3 text-primary" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Nascimento</p>
                  <p className="text-sm text-foreground">
                    {selectedCustomer.birthDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">
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
                        <Check className="w-3 h-3 text-primary" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground break-all">
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
                        <Check className="w-3 h-3 text-primary" />
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Protocolo Atendimento
                </p>
                <h2 className="text-2xl text-foreground">
                  {selectedCustomer.lastProtocol ?? "—"}
                </h2>
              </div>
            </div>

            

            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Distribuidora</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {distributors.map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`relative rounded-lg p-4 text-center transition-colors duration-150 cursor-pointer ${
                          selectedDistributor === d
                            ? "ring-2 ring-green-600 border-2 border-green-600"
                            : "border border-border hover:bg-green-50 hover:border-green-400"
                        }`}
                        aria-pressed={selectedDistributor === d}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedDistributor(d);
                          }
                        }}
                        onClick={() => setSelectedDistributor(d)}
                        style={{
                          backgroundColor:
                            selectedDistributor === d
                              ? "#00A859"
                              : "transparent",
                        }}
                      >
                        <div
                          className={`flex items-center justify-center gap-2 ${
                            selectedDistributor === d ? "text-white" : ""
                          }`}
                        >
                          {selectedDistributor === d && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-4 h-4 text-white"
                            >
                              <path
                                d="M20 6L9 17l-5-5"
                                stroke="currentColor"
                                strokeWidth="5"
                              />
                            </svg>
                          )}
                          <Building2
                            className={`w-4 h-4 ${
                              selectedDistributor === d
                                ? "text-white"
                                : "text-secondary"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              selectedDistributor === d
                                ? "text-white"
                                : "text-foreground"
                            }`}
                          >
                            {d}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
            </div>
            </div>
            </div>

            <div className="mb-6">
              <Button className="h-12 bg-primary hover:bg-primary/90 gap-2" onClick={() => onNewConnection?.(selectedDistributor)}>
                <Power className="w-4 h-4" />
                Ligação Nova
              </Button>
            </div>

            {/* UC Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button type="button" className="flex items-center gap-2 text-foreground hover:text-primary">
                      <span>Unidades Consumidoras ({filteredAddresses.length})</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="bg-card border border-border rounded-md p-1 shadow-lg">
                    <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-muted" onClick={() => setAddressFilter("all")}>Todas</DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-muted" onClick={() => setAddressFilter("active")}>Ativas</DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-2 text-sm hover:bg-muted" onClick={() => setAddressFilter("inactive")}>Inativas</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
                <div className="relative w-[28rem]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60" />
                  <Input
                    placeholder="Filtrar UC por número, endereço ou cidade"
                    className="pl-10 bg-input-background ring-2 ring-secondary/20 focus-visible:ring-secondary w-full"
                  />
                </div>
              </div>

              {filteredAddresses.map((address) => (
                <Card key={address.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => toggleUC(address.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-foreground">
                              {address.ucNumber}
                            </p>
                            <Button
                              size="sm"
                              variant={address.status === "active" ? "default" : "destructive"}
                              className="h-7 px-3 rounded-md"
                              type="button"
                            >
                              {address.status === "active" ? "Ativo" : "Inativo"}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {address.status === "active" && (
                          <div className="flex items-center gap-4 mr-4">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Última Fatura
                              </p>
                              <p className="text-sm text-foreground">
                                {address.lastBill}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Vencimento
                              </p>
                              <p className="text-sm text-foreground">
                                {address.dueDate}
                              </p>
                            </div>
                          </div>
                        )}
                        <Button variant="ghost" size="icon">
                          {expandedUC === address.id ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {expandedUC === address.id && (
                      <div className="border-t border-border bg-muted">
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-4 gap-6">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-secondary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Endereço Completo
                                </p>
                                <p className="text-sm text-foreground">
                                  {address.address}
                                </p>
                                <p className="text-sm text-foreground">
                                  {address.city} - {address.cep}
                                </p>
                              </div>
                            </div>

                            {address.status === "active" && (
                              <>
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Última Fatura
                                    </p>
                                    <p className="text-sm text-foreground">
                                      {address.lastBill}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-secondary" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Vencimento
                                    </p>
                                    <p className="text-sm text-foreground">
                                      {address.dueDate}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"></div>
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
            <div className="sticky bottom-0 bg-card border-t border-border mt-6 z-30">
              <div className="max-w-6xl p-4 flex justify-end">
                <Button
                  className="bg-primary hover:bg-primary/90"
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
