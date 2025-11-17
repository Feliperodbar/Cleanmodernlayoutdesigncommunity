import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

type NewConnectionAddressPageProps = {
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
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

export function NewConnectionAddressPage({ onBack, onNext, onCancel }: NewConnectionAddressPageProps) {
  const [form, setForm] = useState({
    cep: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    number: "",
    reference: "",
    contactName: "",
    contactPhone: "",
    applicant: "",
    voltage: "",
    neighborMeter: "",
    nearestPole: "",
    confirmMunicipalVoltage: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) => setForm({ ...form, [k]: v } as any);
  const currentStep = 1;
  const requiredKeys: (keyof typeof form)[] = [
    "cep",
    "address",
    "neighborhood",
    "city",
    "state",
    "number",
    "reference",
    "applicant",
    "contactName",
    "contactPhone",
    "voltage",
  ];
  const answered = requiredKeys.filter((k) => String(form[k]).length > 0).length + (form.confirmMunicipalVoltage ? 1 : 0);
  const progress = Math.min(100, Math.round((answered / (requiredKeys.length + 1)) * 100));

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
  };

  const fetchViaCep = async (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data?.erro) {
        setForm((prev) => ({
          ...prev,
          address: data.logradouro || prev.address,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {}
  };

  const clearAddress = () => {
    setForm({
      cep: "",
      address: "",
      neighborhood: "",
      city: "",
      state: "",
      number: "",
      reference: "",
      contactName: "",
      contactPhone: "",
      applicant: "",
      voltage: "",
      neighborMeter: "",
      nearestPole: "",
      confirmMunicipalVoltage: false,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Dados de Endereço e Local de Consumo" actions={<div className="flex items-center gap-2"><Button variant="destructive" onClick={onCancel}>Cancelar</Button><Button variant="secondary" onClick={clearAddress}>Limpar Endereço</Button></div>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-8">
        <div className="w-full max-w-6xl grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Endereço e Local de Consumo</CardTitle>
                    <p className="text-sm text-muted-foreground">Preencha os dados do local e contato</p>
                  </div>
                  <div className="w-64">
                    <Progress value={progress} />
                    <div className="mt-1 text-xs text-muted-foreground">{progress}%</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2"><Label htmlFor="cep">CEP</Label><Input id="cep" className="h-10" value={form.cep} onChange={async (e) => { const v = formatCep(e.target.value); set("cep", v); await fetchViaCep(v); }} placeholder="00000-000" /></div>
                  <div className="col-span-3 space-y-2"><Label htmlFor="address">Endereço</Label><Input id="address" className="h-10" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Rua, Avenida..." /></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2"><Label htmlFor="neighborhood">Bairro</Label><Input id="neighborhood" className="h-10" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="city">Município</Label><Input id="city" className="h-10" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="state">Estado</Label>
                    <Select value={form.state} onValueChange={(v) => set("state", v)}>
                      <SelectTrigger id="state"><SelectValue placeholder="UF" /></SelectTrigger>
                      <SelectContent>{["RN","PE","BA","SP","RJ"].map((uf) => (<SelectItem key={uf} value={uf}>{uf}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label htmlFor="number">Nº</Label><Input id="number" className="h-10" value={form.number} onChange={(e) => set("number", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="reference">Ponto de referência</Label><Input id="reference" className="h-10" value={form.reference} onChange={(e) => set("reference", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="applicant">Solicitante</Label><Input id="applicant" className="h-10" value={form.applicant} onChange={(e) => set("applicant", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="contactName">Nome da pessoa de contato</Label><Input id="contactName" className="h-10" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="contactPhone">Telefone da pessoa de contato</Label><Input id="contactPhone" className="h-10" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="(00) 00000-0000" /></div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-green-700">Tensão de fornecimento (V)</div>
                    <div className="flex items-center gap-3"><label className="flex items-center gap-2"><input type="radio" name="voltage" checked={form.voltage === "220"} onChange={() => set("voltage", "220")} /><span>220 V</span></label><label className="flex items-center gap-2"><input type="radio" name="voltage" checked={form.voltage === "380"} onChange={() => set("voltage", "380")} /><span>380 V</span></label></div>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={form.confirmMunicipalVoltage} onChange={(e) => set("confirmMunicipalVoltage", e.target.checked)} /><span>Confirma a tensão de fornecimento do município</span></label>
                    <Button variant="outline" className="mt-2">Consultar Sistema Técnico</Button>
                  </div>
                  <div className="space-y-3">
                    <div className="text-green-700">Informações KAFFA</div>
                    <Button className="bg-secondary hover:bg-secondary/90 w-48 mt-1">Buscar Medidor</Button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="neighborMeter">Medidor Vizinho</Label>
                        <Input id="neighborMeter" className="h-10" value={form.neighborMeter} onChange={(e) => set("neighborMeter", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nearestPole">Poste Mais Próximo</Label>
                        <Input id="nearestPole" className="h-10" value={form.nearestPole} onChange={(e) => set("nearestPole", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Voltar</Button>
                <Button onClick={onNext} disabled={!form.address || !form.city || !form.state || !form.number || !form.cep}>Avançar</Button>
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
                          {i <= currentStep ? (
                            <CheckCircle2 className="mt-0.5 w-4 h-4 text-primary" />
                          ) : (
                            <Circle className="mt-0.5 w-4 h-4 text-muted-foreground" />
                          )}
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