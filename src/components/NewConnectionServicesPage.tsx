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
import { CheckCircle2, Circle, CalendarDays, Receipt, CreditCard } from "lucide-react";

type NewConnectionServicesPageProps = {
  onBack: () => void;
  onConfirm: () => void;
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

export function NewConnectionServicesPage({ onBack, onConfirm, onCancel, customer }: NewConnectionServicesPageProps) {
  const currentStep = 6;
  const [service, setService] = useState<"data_certa" | "fatura_digital" | "debito_automatico" | null>(null);
  const [dueDay, setDueDay] = useState("11");
  const [digitalYes, setDigitalYes] = useState<boolean | undefined>(undefined);
  const [digitalEmail, setDigitalEmail] = useState("");
  const [debitYes, setDebitYes] = useState<boolean | undefined>(undefined);
  const [bank, setBank] = useState("");
  const progress = 100;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Cadastrar Serviços Adicionais" actions={<Button variant="destructive" onClick={onCancel}>Cancelar</Button>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-8">
        <div className="w-full max-w-6xl grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Selecione o tipo de serviço</CardTitle>
                    <p className="text-sm text-muted-foreground">Escolha e preencha as informações</p>
                  </div>
                  <div className="w-64">
                    <Progress value={progress} />
                    <div className="mt-1 text-xs text-muted-foreground">{progress}%</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {customer && (
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Número do Protocolo</div>
                      <div className="text-sm text-foreground">{customer?.lastProtocol ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Cliente</div>
                      <div className="text-sm text-foreground">{customer?.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Documento do Cliente</div>
                      <div className="text-sm text-foreground">{customer?.cpf}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Solicitante</div>
                      <div className="text-sm text-foreground">{customer?.name}</div>
                    </div>
                  </div>
                )}

                <Alert>
                  <AlertDescription>Solicitação gerada com sucesso. Prazo de atendimento 19/02/2025</AlertDescription>
                </Alert>

                <div className="grid grid-cols-3 gap-4">
                  <button type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${service === "data_certa" ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => setService("data_certa")}>
                    <CalendarDays className={`w-6 h-6 ${service === "data_certa" ? "text-primary" : "text-secondary"}`} />
                    <span className={service === "data_certa" ? "text-primary font-medium" : undefined}>Data Certa</span>
                  </button>
                  <button type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${service === "fatura_digital" ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => setService("fatura_digital")}>
                    <Receipt className={`w-6 h-6 ${service === "fatura_digital" ? "text-primary" : "text-secondary"}`} />
                    <span className={service === "fatura_digital" ? "text-primary font-medium" : undefined}>Fatura Digital</span>
                  </button>
                  <button type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${service === "debito_automatico" ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => setService("debito_automatico")}>
                    <CreditCard className={`w-6 h-6 ${service === "debito_automatico" ? "text-primary" : "text-secondary"}`} />
                    <span className={service === "debito_automatico" ? "text-primary font-medium" : undefined}>Débito Automático</span>
                  </button>
                </div>

                {service === "data_certa" && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Data Certa</div>
                    <div className="space-y-2">
                      <Label>Data Vencimento</Label>
                      <Select value={dueDay} onValueChange={(v) => setDueDay(v)}>
                        <SelectTrigger><SelectValue placeholder="Dia" /></SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {service === "fatura_digital" && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Fatura Digital</div>
                    <div className="space-y-2">
                      <div className="text-sm">Deseja Cadastrar Fatura Digital?</div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2"><input type="radio" name="digitalYes" checked={digitalYes === true} onChange={() => setDigitalYes(true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="digitalYes" checked={digitalYes === false} onChange={() => setDigitalYes(false)} /><span>Não</span></label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <Input type="email" value={digitalEmail} onChange={(e) => setDigitalEmail(e.target.value)} />
                    </div>
                  </div>
                )}

                {service === "debito_automatico" && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Débito Automático</div>
                    <div className="space-y-2">
                      <div className="text-sm">Deseja Cadastrar Débito Automático?</div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2"><input type="radio" name="debitYes" checked={debitYes === true} onChange={() => setDebitYes(true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="debitYes" checked={debitYes === false} onChange={() => setDebitYes(false)} /><span>Não</span></label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Banco</Label>
                      <Select value={bank} onValueChange={(v) => setBank(v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {["Itaú", "Bradesco", "Caixa", "Banco do Brasil", "Santander"].map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Anterior</Button>
                <Button onClick={onConfirm}>Confirmar</Button>
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