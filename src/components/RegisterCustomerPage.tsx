import { useState, useEffect } from "react";

import {
  ArrowLeft,
  Zap,
  User as UserIcon,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Building2,
  Loader2,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { addCustomer, Customer, getAllCustomers } from "../data/customers";
import { AppHeader } from "./AppHeader";

interface RegisterCustomerPageProps {
  onBack: () => void;
  onRegisterComplete: () => void;
  initialDocument?: string;
}

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export function RegisterCustomerPage({
  onBack,
  onRegisterComplete,
  initialDocument,
}: RegisterCustomerPageProps) {
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");
  const [document, setDocument] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [sex, setSex] = useState("");
  const [cep, setCep] = useState("");
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [homePhone, setHomePhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [uc, setUc] = useState("");
  const [loadingDocument, setLoadingDocument] = useState(false);

  // UCs por distribuidora — alguns arrays podem estar vazios (sem UC)
  const ucOptions: Record<string, string[]> = {
    coelba: ["UC-1001", "UC-1002"],
    cosern: ["UC-2001"],
    elektro: [], // sem UC por padrão
    pernambuco: ["UC-4001", "UC-4002", "UC-4003"],
  };

  // Mapeamento que força UC apenas para determinada distribuidora com base no nome do cliente
  const nameToCompany: Record<string, string> = {
    maria: "elektro",
    thiago: "coelba",
    "joao pedro": "cosern",
    "joão pedro": "cosern",
  };

  const companyLabels: Record<string, string> = {
    coelba: "Neoenergia Coelba",
    cosern: "Neoenergia Cosern",
    elektro: "Neoenergia Elektro",
    pernambuco: "Neoenergia Pernambuco",
  };

  const normalize = (s: string) =>
    s
      .normalize?.("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const formatDocument = (value: string, type: "cpf" | "cnpj") => {
    const numbers = value.replace(/\D/g, "");

    if (type === "cpf") {
      return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return numbers
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return numbers
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleCepChange = async (value: string) => {
    const formattedCep = formatCep(value);
    setCep(formattedCep);

    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${numbers}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setAddressData({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
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

  useEffect(() => {
    (async () => {
      await handleDocumentAutofill();
    })();
  }, [documentType, document]);

  useEffect(() => {
    if (!initialDocument) return;
    const digits = initialDocument.replace(/\D/g, "");
    if (digits.length === 11) {
      setDocumentType("cpf");
      setDocument(formatDocument(digits, "cpf"));
    } else if (digits.length === 14) {
      setDocumentType("cnpj");
      setDocument(formatDocument(digits, "cnpj"));
    }
  }, [initialDocument]);

  const formatBirthDate = (value: string) => {
    // input type=date gives YYYY-MM-DD, convert to DD/MM/YYYY to match existing data
    if (!value) return undefined;
    const parts = value.split("-");
    if (parts.length !== 3) return value;
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  };

  const toInputDateFromBR = (value: string | undefined) => {
    if (!value) return "";
    const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return "";
    return `${m[3]}-${m[2]}-${m[1]}`;
  };

  const isFutureDate = (value: string) => {
    if (!value) return false;
    const parts = value.split("-");
    if (parts.length !== 3) return false;
    const [y, m, d] = parts;
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    const today = new Date();
    // zero out time for comparison
    today.setHours(0, 0, 0, 0);
    return dt.getTime() > today.getTime();
  };

  const isAtLeastAge = (value: string, minAge: number) => {
    if (!value) return false;
    const parts = value.split("-");
    if (parts.length !== 3) return false;
    const [y, m, d] = parts;
    const birth = new Date(Number(y), Number(m) - 1, Number(d));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const mDiff = today.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= minAge;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure birthDate present and valid (>18 and not future)
    if (!birthDate) {
      setBirthDateError("Data de nascimento é obrigatória");
      return;
    }
    if (isFutureDate(birthDate)) {
      setBirthDateError("Data de nascimento não pode ser no futuro");
      return;
    }
    if (!isAtLeastAge(birthDate, 18)) {
      setBirthDateError("É necessário ter 18 anos ou mais");
      return;
    }
    // Monta objeto Customer mínimo e persiste no pequeno banco (localStorage)
    const primaryPhone = cellPhone || homePhone;
    const addrLine = addressData
      ? `${addressData.street}${number ? ", " + number : ""}${
          complement ? ", " + complement : ""
        }, ${addressData.neighborhood}`
      : "";

    const newCustomer: Omit<Customer, "id"> = {
      name: fullName || "Cliente Sem Nome",
      cpf: document,
      email: email || undefined,
      birthDate: formatBirthDate(birthDate) || undefined,
      sex: sex || undefined,
      phone: primaryPhone || "",
      lastProtocol: undefined,
      lastService: undefined,
      timestamp: new Date().toLocaleString(),
      addresses: [],
    };

    addCustomer(newCustomer);
    onRegisterComplete();
  };

  const tryAutofillFromCPF = async (digits: string) => {
    const all = getAllCustomers();
    const found = all.find((c) => c.cpf.replace(/\D/g, "") === digits);
    if (found) {
      setFullName(found.name || "");
      setEmail(found.email || "");
      setCellPhone(found.phone ? formatPhone(found.phone) : "");
      setBirthDate(toInputDateFromBR(found.birthDate));
      const cepCandidate = found.addresses[0]?.cep || "";
      if (cepCandidate) await handleCepChange(cepCandidate);
      return true;
    }
    return false;
  };

  const tryAutofillFromCPFRemote = async (digits: string) => {
    const base = (import.meta as any)?.env?.VITE_CPF_API_URL as string | undefined;
    if (!base) return;
    setLoadingDocument(true);
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}/${digits}`);
      if (res.ok) {
        const data = await res.json();
        const nome = data?.name || data?.nome || "";
        const emailApi = data?.email || "";
        const telApi = data?.phone || data?.telefone || "";
        const cepApi = data?.cep || "";
        const logradouro = data?.logradouro || "";
        const bairro = data?.bairro || "";
        const municipio = data?.cidade || data?.municipio || "";
        const uf = data?.uf || "";
        if (nome) setFullName(nome);
        if (emailApi) setEmail(emailApi);
        if (telApi) setCellPhone(formatPhone(telApi));
        if (cepApi) {
          await handleCepChange(cepApi);
        } else if (logradouro || bairro || municipio || uf) {
          setAddressData({ street: logradouro, neighborhood: bairro, city: municipio, state: uf });
        }
      }
    } catch {}
    setLoadingDocument(false);
  };

  const tryAutofillFromCNPJ = async (digits: string) => {
    setLoadingDocument(true);
    try {
      const res = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const nome = data.razao_social || data.nome_fantasia || "";
          const emailApi = data.email || "";
          const telApi = data.telefone || "";
          const cepApi = data.cep || "";
          const logradouro = data.logradouro || "";
          const bairro = data.bairro || "";
          const municipio = data.municipio || "";
          const uf = data.uf || "";
          setFullName(nome);
          setEmail(emailApi);
          setCellPhone(telApi ? formatPhone(telApi) : "");
          if (cepApi) {
            await handleCepChange(cepApi);
          } else {
            setAddressData({ street: logradouro, neighborhood: bairro, city: municipio, state: uf });
          }
        }
      }
    } catch {}
    setLoadingDocument(false);
  };

  const handleDocumentAutofill = async () => {
    const digits = document.replace(/\D/g, "");
    if (documentType === "cpf" && digits.length === 11) {
      const foundLocal = await tryAutofillFromCPF(digits);
      if (!foundLocal) {
        await tryAutofillFromCPFRemote(digits);
      }
    }
    if (documentType === "cnpj" && digits.length === 14) {
      await tryAutofillFromCNPJ(digits);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Cadastro de Cliente"
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2 text-secondary border-secondary/20 hover:bg-secondary/5"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Avatar>
              <AvatarFallback className="bg-secondary text-white">
                <UserIcon className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </>
        }
      />

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Novo Cliente</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados para cadastrar um novo cliente
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Document Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-secondary" />
                    <h3 className="text-foreground">Identificação</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="document">CPF/CNPJ *</Label>
                      <div className="flex gap-2 relative">
                        <Select
                          value={documentType}
                          onValueChange={(value: "cpf" | "cnpj") => {
                            setDocumentType(value);
                            setDocument("");
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
                          onChange={(e: { target: { value: string; }; }) => handleDocumentChange(e.target.value)}
                          placeholder={
                            documentType === "cpf"
                              ? "000.000.000-00"
                              : "00.000.000/0000-00"
                          }
                          inputMode="numeric"
                          maxLength={documentType === "cpf" ? 14 : 18}
                          pattern={documentType === "cpf" ? "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" : undefined}
                          title={documentType === "cpf" ? "CPF no formato 000.000.000-00" : undefined}
                          className="flex-1"
                          required
                        />
                        {loadingDocument && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary animate-spin" />
                        )}
                      </div>

                      <div className="space-y-2 mt-2">
                        <Label htmlFor="birthDate">Data de Nascimento *</Label>
                        <Input className="w-44"
                          id="birthDate"
                          type="date"
                          value={birthDate}
                          onChange={(e) => {
                            const v = e.target.value;
                            setBirthDate(v);
                            if (isFutureDate(v)) {
                              setBirthDateError("Data de nascimento não pode ser no futuro");
                            } else if (!isAtLeastAge(v, 18)) {
                              setBirthDateError("É necessário ter 18 anos ou mais");
                            } else {
                              setBirthDateError(null);
                            }
                          }}
                          placeholder="dd/mm/aaaa"
                          aria-invalid={birthDateError ? true : undefined}
                          aria-describedby={birthDateError ? "birthDate-error" : undefined}
                          required
                        />
                        {birthDateError && (
                          <p id="birthDate-error" className="text-sm text-destructive mt-1">{birthDateError}</p>
                        )}
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
                      <div className="space-y-2">
                        {/* Campo Sexo movido para cá */}
                        <div className="space-y-2 w-44">
                          <Label htmlFor="sex">Sexo</Label>
                          <Select
                            value={sex}
                            onValueChange={(v: string) => setSex(v)}
                          >
                            <SelectTrigger id="sex" className="w-44">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Masculino</SelectItem>
                              <SelectItem value="female">Feminino</SelectItem>
                              <SelectItem value="other">Outro</SelectItem>
                              <SelectItem value="prefer_not">Prefiro não dizer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <h3 className="text-foreground">Endereço</h3>
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
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary animate-spin" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="street">Logradouro *</Label>
                      <Input
                        id="street"
                        value={addressData?.street || ""}
                        readOnly
                        placeholder="Será preenchido automaticamente"
                        className="bg-input-background"
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
                        value={addressData?.neighborhood || ""}
                        readOnly
                        placeholder="Auto-preenchido"
                        className="bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade/UF *</Label>
                      <Input
                        id="city"
                        value={
                          addressData
                            ? `${addressData.city}/${addressData.state}`
                            : ""
                        }
                        readOnly
                        placeholder="Auto-preenchido"
                        className="bg-input-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-secondary" />
                    <h3 className="text-foreground">Contato</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cellPhone">Telefone Celular *</Label>
                      <Input
                        id="cellPhone"
                        value={cellPhone}
                        onChange={(e) =>
                          setCellPhone(formatPhone(e.target.value))
                        }
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="homePhone">Telefone Residencial</Label>
                      <Input
                        id="homePhone"
                        value={homePhone}
                        onChange={(e) =>
                          setHomePhone(formatPhone(e.target.value))
                        }
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
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-secondary" />
                    <h3 className="text-foreground">Distribuidora</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Selecione a Distribuidora *</Label>
                    <Select
                      value={company}
                      onValueChange={(v: string) => {
                        setCompany(v);
                        setUc(""); // reset UC ao trocar distribuidora
                      }}
                      required
                    >
                      <SelectTrigger id="company">
                        <SelectValue placeholder="Selecione uma distribuidora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coelba">
                          Neoenergia Coelba
                        </SelectItem>
                        <SelectItem value="cosern">
                          Neoenergia Cosern
                        </SelectItem>
                        <SelectItem value="elektro">
                          Neoenergia Elektro
                        </SelectItem>
                        <SelectItem value="pernambuco">
                          Neoenergia Pernambuco
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Campo UC — mostra select quando houver UCs para a distribuidora, caso contrário exibe mensagem */}
                    <div className="space-y-2 mt-3">
                      <Label htmlFor="uc">UC</Label>
                      {company ? (
                        // verifica se o nome do cliente exige uma distribuidora específica
                        (() => {
                          const required = nameToCompany[normalize(fullName || "")];
                          const hasUcs = ucOptions[company] && ucOptions[company].length > 0;

                          if (required && company !== required) {
                            return (
                              <p className="text-sm text-red-600 italic">
                                UC disponível apenas para {companyLabels[required]} para este cliente.
                              </p>
                            );
                          }

                          if (hasUcs) {
                            return (
                              <Select value={uc} onValueChange={setUc}>
                                <SelectTrigger id="uc">
                                  <SelectValue placeholder="Selecione a UC" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ucOptions[company].map((u) => (
                                    <SelectItem key={u} value={u}>
                                      {u}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            );
                          }

                          return (
                            <p className="text-sm text-muted-foreground italic">
                              Sem UC disponível para esta distribuidora
                            </p>
                          );
                        })()
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Selecione uma distribuidora para ver as UCs
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-secondary border-secondary/20 hover:bg-secondary/5"
                    onClick={onBack}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 gap-2"
                    disabled={!!birthDateError}
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
