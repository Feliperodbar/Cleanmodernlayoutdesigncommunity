import { useState, useEffect, useRef } from "react";

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
  Check,
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

  // missing states and helpers used by the JSX
  const [cep, setCep] = useState("");
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [homePhone, setHomePhone] = useState("");
  const [email, setEmail] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedUpload, setParsedUpload] = useState<any | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);

  const [company, setCompany] = useState<string | null>(null);
  const companyLabels: Record<string, string> = {
    "Neoenergia Elektro": "Elektro",
    "Neoenergia Coelba": "Coelba",
    "Neoenergia Cosern": "Cosern",
    "Neoenergia Pernambuco": "Pernambuco",
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatDocument = (raw: string, type: "cpf" | "cnpj") => {
    const d = String(raw || "").replace(/\D/g, "");
    if (type === "cpf") {
      return d
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        .slice(0, 14);
    }
    return d
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
      .slice(0, 18);
  };

  const formatPhone = (raw: string) => {
    const d = String(raw || "").replace(/\D/g, "");
    if (d.length <= 10) {
      return d
        .replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
        .replace(/-$/, "");
    }
    return d.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const validateCPF = (raw: string) => {
    const cpf = String(raw || "").replace(/\D/g, "");
    if (!cpf || cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    const toDigit = (t: number) => {
      let sum = 0;
      for (let i = 0; i < t - 1; i++) sum += Number(cpf[i]) * (t - i);
      const d = (sum * 10) % 11;
      return d === 10 ? 0 : d;
    };
    return toDigit(10) === Number(cpf[9]) && toDigit(11) === Number(cpf[10]);
  };

  const validateEmail = (value: string) => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Prevent the autofill effect from overwriting fields when we programmatically
  // set `document` during an import operation.
  const skipAutofillRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateCNPJ = (cnpjRaw: string) => {
    const cnpj = cnpjRaw.replace(/\D/g, "");
    if (!cnpj || cnpj.length !== 14) return false;

    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    const calc = (t: number) => {
      const weights =
        t === 12
          ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
          : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = 0; i < weights.length; i++)
        sum += Number(cnpj[i]) * weights[i];
      const d = sum % 11;
      return d < 2 ? 0 : 11 - d;
    };
    return calc(12) === Number(cnpj[12]) && calc(13) === Number(cnpj[13]);
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
    if (skipAutofillRef.current) {
      // skip a single autofill run triggered by programmatic document set
      skipAutofillRef.current = false;
      return;
    }
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
    const base = (import.meta as any)?.env?.VITE_CPF_API_URL as
      | string
      | undefined;
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
          setAddressData({
            street: logradouro,
            neighborhood: bairro,
            city: municipio,
            state: uf,
          });
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
            setAddressData({
              street: logradouro,
              neighborhood: bairro,
              city: municipio,
              state: uf,
            });
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

  // --- File upload handling ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setUploadError("Apenas arquivos .txt são aceitos");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      // try to detect fields even if order varies
      let detectedName: string | null = null;
      let detectedBirth: string | null = null;
      let detectedDoc: string | null = null;
      let detectedPhone: string | null = null;
      let detectedCep: string | null = null;
      let detectedEmail: string | null = null;

      const remaining: string[] = [];

      for (const line of lines) {
        // normalize common labels like "Data:" or "Nascimento:"
        let l = line
          .replace(/^\s*(data|nascimento|nasc)\s*[:\-\s]+/i, "")
          .trim();
        // email
        if (!detectedEmail && /@/.test(l)) {
          detectedEmail = l;
          continue;
        }

        // birth date: accept multiple separators and 1-2 digit day/month
        if (!detectedBirth) {
          const dateLike1 = /^\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{4}$/.test(l); // e.g. 1/1/1980 01-01-1980 01.01.1980
          const dateLike2 = /^\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}$/.test(l); // e.g. 1980-01-01
          if (dateLike1 || dateLike2) {
            detectedBirth = l;
            continue;
          }
        }

        // cep (8 digits, optionally with -)
        const digitsOnly = l.replace(/\D/g, "");
        if (!detectedCep && digitsOnly.length === 8) {
          detectedCep = l;
          continue;
        }

        // document (cpf/cnpj)
        if (
          !detectedDoc &&
          (digitsOnly.length === 11 || digitsOnly.length === 14)
        ) {
          // basic sanity: accept it as doc
          detectedDoc = l;
          continue;
        }

        // phone (10 or 11 digits)
        if (
          !detectedPhone &&
          (digitsOnly.length === 10 || digitsOnly.length === 11)
        ) {
          detectedPhone = l;
          continue;
        }

        // otherwise keep as candidate for name
        remaining.push(l);
      }

      if (!detectedName) {
        if (remaining.length > 0) detectedName = remaining.join(" ");
      }

      // Validate we found all required fields
      const missing: string[] = [];
      if (!detectedName) missing.push("nome");
      if (!detectedBirth) missing.push("data");
      if (!detectedDoc) missing.push("documento (CPF/CNPJ)");
      if (!detectedPhone) missing.push("telefone");
      if (!detectedCep) missing.push("cep");
      if (!detectedEmail) missing.push("email");

      if (missing.length > 0) {
        setUploadError(
          `Arquivo inválido: não foi possível detectar os campos: ${missing.join(
            ", "
          )}`
        );
        setParsedUpload(null);
        return;
      }

      setParsedUpload({
        fullName: detectedName || "",
        birthRaw: detectedBirth || "",
        docRaw: detectedDoc || "",
        phoneRaw: detectedPhone || "",
        cepRaw: detectedCep || "",
        emailRaw: detectedEmail || "",
      });
    };
    reader.readAsText(file, "UTF-8");
  };

  const cancelParsedImport = () => {
    setParsedUpload(null);
    setUploadedFileName(null);
    setUploadError(null);
  };

  const importParsedData = async () => {
    if (!parsedUpload) return;
    setUploadError(null);
    const normalize = (s?: string) =>
      (s || "")
        .replace(
          /^\s*(email|e-?mail|telefone|tel|cpf|cnpj|cep|data)\s*[:\-\s]+/i,
          ""
        )
        .trim();

    const {
      fullName: fNameRaw = "",
      birthRaw: birthRawRaw = "",
      docRaw: docRawRaw = "",
      phoneRaw: phoneRawRaw = "",
      cepRaw: cepRawRaw = "",
      emailRaw: emailRawRaw = "",
    } = parsedUpload;

    const birthRaw = normalize(birthRawRaw);
    const docRaw = normalize(docRawRaw);
    const phoneRaw = normalize(phoneRawRaw);
    const cepRaw = normalize(cepRawRaw);
    const emailRaw = normalize(emailRawRaw);
    const fName = normalize(fNameRaw);

    // validate document and email
    const docDigits = String(docRaw || "").replace(/\D/g, "");
    if (docDigits.length === 11) {
      if (!validateCPF(docRaw)) {
        setUploadError("CPF inválido");
        return;
      }
      setDocumentType("cpf");
      // prevent autofill effect from triggering while we import
      skipAutofillRef.current = true;
      setDocument(formatDocument(docRaw, "cpf"));
    } else if (docDigits.length === 14) {
      if (!validateCNPJ(docRaw)) {
        setUploadError("CNPJ inválido");
        return;
      }
      setDocumentType("cnpj");
      // prevent autofill effect from triggering while we import
      skipAutofillRef.current = true;
      setDocument(formatDocument(docRaw, "cnpj"));
    } else {
      setUploadError("Documento inválido (deve ser CPF ou CNPJ)");
      return;
    }

    if (!validateEmail(emailRaw)) {
      setUploadError("E-mail com formato inválido");
      return;
    }

    // birth: convert DD/MM/YYYY -> YYYY-MM-DD for input type=date
    let birthInput = "";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthRaw)) {
      const m = birthRaw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m) birthInput = `${m[3]}-${m[2]}-${m[1]}`;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(birthRaw)) {
      birthInput = birthRaw;
    }

    setFullName(fName);
    if (birthInput) setBirthDate(birthInput);
    setCellPhone(formatPhone(phoneRaw));
    setEmail(emailRaw);
    setCep(formatCep(cepRaw));
    if (cepRaw) await handleCepChange(cepRaw);

    // foco no campo Nome Completo para o usuário continuar a edição
    try {
      // delay curto para garantir que o input esteja atualizado/renderizado
      setTimeout(() => {
        const el = document.getElementById(
          "fullName"
        ) as HTMLInputElement | null;
        if (el && typeof el.focus === "function") el.focus();
      }, 50);
    } catch (e) {
      /* ignore */
    }

    // clear parsed buffer
    setParsedUpload(null);
    // ensure future autofill works
    skipAutofillRef.current = false;
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
                  <CardTitle className="text-foreground">
                    Novo Cliente
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados para cadastrar um novo cliente
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Distributors at top */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-foreground" />
                    <h3 className="text-foreground">Distribuidoras</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-white">
                    {Object.entries(companyLabels).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className={`text-white relative rounded-lg p-4 text-center transition-colors duration-150 cursor-pointer ${
                          company === key
                            ? "ring-2 ring-green-600 border-4 border-green-600 bg-green-100"
                            : "border border-border hover:bg-green-50 hover:border-green-400"
                        }`}
                        aria-pressed={company === key}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setCompany(key);
                          }
                        }}
                        style={{
                          backgroundColor:
                            company === key ? "#00A859" : "transparent",
                        }}
                        tabIndex={0}
                        onClick={() => {
                          setCompany(key);
                        }}
                      >
                        <div
                          className={`flex items-center justify-center gap-2 ${
                            company === key ? "text-white" : ""
                          }`}
                        >
                          {company === key && (
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
                              company === key ? "text-white" : "text-secondary"
                            }`}
                          />
                          <span
                            className={`text-lg font-medium ${
                              company === key ? "text-white" : "text-foreground"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Document Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-secondary" />
                    <h3 className="text-foreground">Identificação</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 p-3">
                      <div className="my-2 ">
                        <label className="w-full block cursor-pointer ">
                          <input
                            ref={(el) => (fileInputRef.current = el)}
                            type="file"
                            accept=".txt"
                            onChange={handleFileUpload}
                            style={{ display: "none" }}
                          />

                          <div
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                fileInputRef.current?.click();
                              }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full p-4 flex items-center justify-between gap-4 rounded-md p-3 border border-border bg-card transition-colors cursor-pointer hover:bg-muted"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                  uploadedFileName
                                    ? "bg-white/20"
                                    : "bg-secondary/10"
                                }`}
                              >
                                <Zap
                                  className={`w-5 h-5 ${
                                    uploadedFileName
                                      ? "text-white"
                                      : "text-secondary"
                                  }`}
                                />
                              </div>
                              <div>
                                <div
                                  className={`text-sm ${
                                    uploadedFileName
                                      ? "text-white"
                                      : "text-foreground"
                                  }`}
                                >
                                  Clique ou arraste para importar um arquivo{" "}
                                  <strong>.txt</strong>
                                </div>
                              </div>
                            </div>

                            <div className="text-sm text-right">
                              {uploadedFileName ? (
                                <div className="flex flex-col items-end">
                                  <span className="px-3 py-1 bg-white/10 rounded-md text-sm">
                                    {uploadedFileName}
                                  </span>
                                  <span className="text-xs text-white/80">
                                    Clique novamente para substituir
                                  </span>
                                </div>
                              ) : (
                                <div className="px-3 py-1 rounded-md bg-green-600 text-white">
                                  Selecionar arquivo
                                </div>
                              )}
                            </div>
                          </div>
                        </label>

                        {uploadError && (
                          <p className="text-sm text-destructive mt-2">
                            {uploadError}
                          </p>
                        )}

                        {parsedUpload && (
                          <div className="mt-3 p-4 bg-muted/5 border border-border rounded-md">
                            <div className="text-sm mb-2 font-medium">
                              Pré-visualização
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <strong>Nome:</strong> {parsedUpload.fullName}
                              </div>
                              <div>
                                <strong>Data:</strong> {parsedUpload.birthRaw}
                              </div>
                              <div>
                                <strong>Documento:</strong>{" "}
                                {parsedUpload.docRaw}
                              </div>
                              <div>
                                <strong>Telefone:</strong>{" "}
                                {parsedUpload.phoneRaw}
                              </div>
                              <div>
                                <strong>CEP:</strong> {parsedUpload.cepRaw}
                              </div>
                              <div>
                                <strong>Email:</strong> {parsedUpload.emailRaw}
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end mt-3">
                              <Button
                                variant="outline"
                                onClick={cancelParsedImport}
                              >
                                Cancelar
                              </Button>
                              <Button onClick={importParsedData}>
                                Importar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
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
                          onChange={(e: { target: { value: string } }) =>
                            handleDocumentChange(e.target.value)
                          }
                          placeholder={
                            documentType === "cpf"
                              ? "000.000.000-00"
                              : "00.000.000/0000-00"
                          }
                          inputMode="numeric"
                          maxLength={documentType === "cpf" ? 14 : 18}
                          pattern={
                            documentType === "cpf"
                              ? "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}"
                              : undefined
                          }
                          title={
                            documentType === "cpf"
                              ? "CPF no formato 000.000.000-00"
                              : undefined
                          }
                          className="flex-1"
                          required
                        />
                        {loadingDocument && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary animate-spin" />
                        )}
                      </div>

                      <div className="space-y-2 mt-2">
                        <Label htmlFor="birthDate">Data de Nascimento *</Label>
                        <Input
                          className="w-44"
                          id="birthDate"
                          type="date"
                          value={birthDate}
                          onChange={(e) => {
                            const v = e.target.value;
                            setBirthDate(v);
                            if (isFutureDate(v)) {
                              setBirthDateError(
                                "Data de nascimento não pode ser no futuro"
                              );
                            } else if (!isAtLeastAge(v, 18)) {
                              setBirthDateError(
                                "É necessário ter 18 anos ou mais"
                              );
                            } else {
                              setBirthDateError(null);
                            }
                          }}
                          placeholder="dd/mm/aaaa"
                          aria-invalid={birthDateError ? true : undefined}
                          aria-describedby={
                            birthDateError ? "birthDate-error" : undefined
                          }
                          required
                        />
                        {birthDateError && (
                          <p
                            id="birthDate-error"
                            className="text-sm text-destructive mt-1"
                          >
                            {birthDateError}
                          </p>
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
                              <SelectItem value="prefer_not">
                                Prefiro não dizer
                              </SelectItem>
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
