import { useState } from "react";
import { AppHeader } from "./AppHeader";
import type { Customer } from "../data/customers";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, Circle, Home, Building2, Tractor } from "lucide-react";

type NewConnectionInstallationPageProps = {
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  customer?: Customer | null;
};

const stepLabels = [
  "Checklist",
  "Dados de Endereço e Local de Consumo",
  "Validar Endereço",
  "Características da Instalação",
  "Seleção de Equipamentos Elétricos",
  "Resumo da Solicitação",
  "Cadastrar Serviços Adicionais",
];

export function NewConnectionInstallationPage({ onBack, onNext, onCancel, customer }: NewConnectionInstallationPageProps) {
  const [form, setForm] = useState({
    category: "",
    residenceType: "",
    description: "",
    whiteTariff: undefined as undefined | boolean,
    declaredPhase: "",
    entryType: "",
    supplyVoltage: "",
    installationType: "",
    sector: "",
    sectorDescription: "",
    sectorSystem: "",
    tariffCategory: "",
  });
  const set = (k: keyof typeof form, v: string | boolean | undefined) => setForm({ ...form, [k]: v } as any);

  const currentStep = 3;
  const requiredKeys: (keyof typeof form)[] = [
    "category",
    ...(form.category === "residencial" ? ["residenceType"] : []),
    "whiteTariff",
    "entryType",
    "supplyVoltage",
    "installationType",
  ];
  const answered = requiredKeys.filter((k) => form[k] !== "" && form[k] !== undefined).length;
  const progress = Math.min(100, Math.round(((answered + (form.description ? 1 : 0)) / (requiredKeys.length + 1)) * 100));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Características da Instalação" actions={<Button variant="destructive" onClick={onCancel}>Cancelar</Button>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-6xl grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Características da Instalação</CardTitle>
                    <p className="text-sm text-muted-foreground">Selecione a categoria e preencha os dados técnicos</p>
                  </div>
                  <div className="w-64">
                    <Progress value={progress} />
                    <div className="mt-1 text-xs text-muted-foreground">{progress}%</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {customer && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Número do Protocolo</div>
                      <div className="text-sm text-foreground">{customer.lastProtocol ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Cliente</div>
                      <div className="text-sm text-foreground">{customer.name}</div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <button type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${form.category === "residencial" ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => set("category", "residencial")}>
                    <Home className={`w-6 h-6 ${form.category === "residencial" ? "text-primary" : "text-secondary"}`} />
                    <span className={form.category === "residencial" ? "text-primary font-medium" : undefined}>Residencial</span>
                  </button>
                  <button type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${form.category === "comercial" ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => set("category", "comercial")}>
                    <Building2 className={`w-6 h-6 ${form.category === "comercial" ? "text-primary" : "text-secondary"}`} />
                    <span className={form.category === "comercial" ? "text-primary font-medium" : undefined}>Comercial</span>
                  </button>
                  <button type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${form.category === "rural" ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => set("category", "rural")}>
                    <Tractor className={`w-6 h-6 ${form.category === "rural" ? "text-primary" : "text-secondary"}`} />
                    <span className={form.category === "rural" ? "text-primary font-medium" : undefined}>Rural</span>
                  </button>
                </div>

                {form.category === "residencial" && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Selecione o tipo de residência</div>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${form.residenceType === "casa" ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => set("residenceType", "casa")}>
                        <Home className={`w-6 h-6 ${form.residenceType === "casa" ? "text-primary" : "text-secondary"}`} />
                        <span className={form.residenceType === "casa" ? "text-primary font-medium" : undefined}>Casa</span>
                      </button>
                      <button type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${form.residenceType === "apartamento" ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => set("residenceType", "apartamento")}>
                        <Building2 className={`w-6 h-6 ${form.residenceType === "apartamento" ? "text-primary" : "text-secondary"}`} />
                        <span className={form.residenceType === "apartamento" ? "text-primary font-medium" : undefined}>Apartamento</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detalhes da instalação" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detalhes da instalação" />
                </div>

                <div className="space-y-2">
                  <div className="text-sm">Tarifa Branca</div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2"><input type="radio" name="whiteTariff" checked={form.whiteTariff === true} onChange={() => set("whiteTariff", true)} /><span>Sim</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="whiteTariff" checked={form.whiteTariff === false} onChange={() => set("whiteTariff", false)} /><span>Não</span></label>
                  </div>
                  {form.whiteTariff === true && (
                    <div className="mt-2 space-y-2">
                      <Alert>
                        <AlertDescription>
                          Ao optar pela tarifa branca o cliente fica ciente que terá preços diferentes de acordo com horários (horário de ponta, fora de ponta e intermediário), sendo que o consumo nestes horários pode afetar o valor da fatura de energia elétrica.
                        </AlertDescription>
                      </Alert>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li><span className="font-medium">Ponta</span> (das 17:30:00 às 20:29:59)</li>
                        <li><span className="font-medium">Intermediário</span> (das 15:30:00 às 17:29:59)</li>
                        <li><span className="font-medium">Fora de ponta</span> (das 20:30:00 às 15:29:59)</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="declaredPhase">Fase Declarada</Label>
                    <Select value={form.declaredPhase} onValueChange={(v) => set("declaredPhase", v)}>
                      <SelectTrigger id="declaredPhase"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mono">Monofásico</SelectItem>
                        <SelectItem value="bi">Bifásico</SelectItem>
                        <SelectItem value="tri">Trifásico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryType">Tipo de Entrada</Label>
                    <Select value={form.entryType} onValueChange={(v) => set("entryType", v)}>
                      <SelectTrigger id="entryType"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aerea">Aérea</SelectItem>
                        <SelectItem value="subterranea">Subterrânea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplyVoltage">Tensão de Fornecimento (V)</Label>
                    <Select value={form.supplyVoltage} onValueChange={(v) => set("supplyVoltage", v)}>
                      <SelectTrigger id="supplyVoltage"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="127/220">127/220</SelectItem>
                        <SelectItem value="220/380">220/380</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="installationType">Tipo Instalação</Label>
                    <Select value={form.installationType} onValueChange={(v) => set("installationType", v)}>
                      <SelectTrigger id="installationType"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="padrão">Padrão</SelectItem>
                        <SelectItem value="provisoria">Provisória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tariffCategory">Categoria Tarifa</Label>
                    <Input id="tariffCategory" value={form.tariffCategory} onChange={(e) => set("tariffCategory", e.target.value)} placeholder="Categoria" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Setor Industrial</Label>
                    <Input id="sector" value={form.sector} onChange={(e) => set("sector", e.target.value)} placeholder="Setor" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sectorDescription">Descrição do Setor Industrial</Label>
                    <Input id="sectorDescription" value={form.sectorDescription} onChange={(e) => set("sectorDescription", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sectorSystem">Sistema Setorial</Label>
                    <Input id="sectorSystem" value={form.sectorSystem} onChange={(e) => set("sectorSystem", e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Voltar</Button>
                <Button onClick={onNext} disabled={!requiredKeys.every((k) => form[k] !== "" && form[k] !== undefined)}>Avançar</Button>
              </CardFooter>
            </Card>
          </div>
          <aside className="col-span-1">
            <Card>
              <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
                <CardTitle>Etapas</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><Progress value={progress} /><span className="text-xs text-muted-foreground">{progress}%</span></div>
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                    <ul className="space-y-4">
                      {stepLabels.map((label, i) => (
                        <li key={label} className="flex items-start gap-2">
                          {i <= currentStep ? <CheckCircle2 className="mt-0.5 w-4 h-4 text-primary" /> : <Circle className="mt-0.5 w-4 h-4 text-muted-foreground" />}
                          <span className={i <= currentStep ? (i === currentStep ? "text-primary font-semibold" : "text-primary") : "text-muted-foreground"}>{label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}