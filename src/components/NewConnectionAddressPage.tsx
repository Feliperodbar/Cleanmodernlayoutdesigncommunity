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
    street: "",
    neighborhood: "",
    locality: "",
    city: "",
    state: "",
    number: "",
    block: "",
    quadra: "",
    lote: "",
    complement: "",
    reference: "",
    contactName: "",
    contactPhone: "",
    applicant: "",
    voltage: "",
    confirmMunicipalVoltage: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) => setForm({ ...form, [k]: v } as any);
  const currentStep = 1;
  const answered = Object.values(form).filter((v) => String(v).length > 0 || v === true).length;
  const progress = Math.min(100, Math.round((answered / 16) * 100));

  const clearAddress = () => {
    setForm({
      street: "",
      neighborhood: "",
      locality: "",
      city: "",
      state: "",
      number: "",
      block: "",
      quadra: "",
      lote: "",
      complement: "",
      reference: "",
      contactName: "",
      contactPhone: "",
      applicant: "",
      voltage: "",
      confirmMunicipalVoltage: false,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Dados de Endereço e Local de Consumo" actions={<div className="flex items-center gap-2"><Button variant="destructive" onClick={onCancel}>Cancelar</Button><Button variant="secondary" onClick={clearAddress}>Limpar Endereço</Button></div>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-6">
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
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2 space-y-2"><Label htmlFor="street">Rua</Label><Input id="street" value={form.street} onChange={(e) => set("street", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="neighborhood">Bairro</Label><Input id="neighborhood" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="locality">Localidade</Label><Input id="locality" value={form.locality} onChange={(e) => set("locality", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2"><Label htmlFor="city">Município</Label><Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="state">Estado</Label>
                    <Select value={form.state} onValueChange={(v) => set("state", v)}>
                      <SelectTrigger id="state"><SelectValue placeholder="UF" /></SelectTrigger>
                      <SelectContent>{["RN","PE","BA","SP","RJ"].map((uf) => (<SelectItem key={uf} value={uf}>{uf}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label htmlFor="number">Nº</Label><Input id="number" value={form.number} onChange={(e) => set("number", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="block">Bloco</Label><Input id="block" value={form.block} onChange={(e) => set("block", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2"><Label htmlFor="quadra">Quadra</Label><Input id="quadra" value={form.quadra} onChange={(e) => set("quadra", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="lote">Lote</Label><Input id="lote" value={form.lote} onChange={(e) => set("lote", e.target.value)} /></div>
                  <div className="col-span-2 space-y-2"><Label htmlFor="complement">Suplemento</Label><Input id="complement" value={form.complement} onChange={(e) => set("complement", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="reference">Ponto de referência</Label><Input id="reference" value={form.reference} onChange={(e) => set("reference", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="applicant">Solicitante</Label><Input id="applicant" value={form.applicant} onChange={(e) => set("applicant", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="contactName">Nome da pessoa de contato</Label><Input id="contactName" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="contactPhone">Telefone da pessoa de contato</Label><Input id="contactPhone" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="(00) 00000-0000" /></div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-green-700">Tensão de fornecimento (V)</div>
                    <div className="flex items-center gap-3"><label className="flex items-center gap-2"><input type="radio" name="voltage" checked={form.voltage === "220"} onChange={() => set("voltage", "220")} /><span>220 V</span></label><label className="flex items-center gap-2"><input type="radio" name="voltage" checked={form.voltage === "380"} onChange={() => set("voltage", "380")} /><span>380 V</span></label></div>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={form.confirmMunicipalVoltage} onChange={(e) => set("confirmMunicipalVoltage", e.target.checked)} /><span>Confirma a tensão de fornecimento do município</span></label>
                    <a href="#" className="text-secondary underline text-sm">Consultar Sistema Técnico</a>
                  </div>
                  <div className="space-y-3">
                    <div className="text-green-700">Informações KAFFA</div>
                    <Button className="bg-secondary hover:bg-secondary/90">Buscar Medidor</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Voltar</Button>
                <Button onClick={onNext} disabled={!form.street || !form.city || !form.state || !form.number}>Avançar</Button>
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
                          {i === currentStep ? <CheckCircle2 className="mt-0.5 w-4 h-4 text-primary" /> : <Circle className="mt-0.5 w-4 h-4 text-muted-foreground" />}
                          <span className={i === currentStep ? "text-primary font-semibold" : "text-muted-foreground"}>{label}</span>
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