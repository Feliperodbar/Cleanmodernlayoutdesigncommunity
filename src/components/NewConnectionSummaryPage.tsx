import { useState } from "react";
import { AppHeader } from "./AppHeader";
import type { Customer } from "../data/customers";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

type NewConnectionSummaryPageProps = {
  onBack: () => void;
  onFinish: () => void;
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

export function NewConnectionSummaryPage({ onBack, onFinish, onCancel, customer }: NewConnectionSummaryPageProps) {
  const currentStep = 5;
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Resumo da Solicitação" actions={<Button variant="destructive" onClick={onCancel}>Cancelar</Button>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-6xl grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Revisão dos dados</CardTitle>
                    <p className="text-sm text-muted-foreground">Confira o resumo antes de finalizar</p>
                  </div>
                  <div className="w-64">
                    <Progress value={100} />
                    <div className="mt-1 text-xs text-muted-foreground">100%</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {customer && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Número do Protocolo</div>
                      <div className="text-sm text-foreground">{customer?.lastProtocol ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Cliente</div>
                      <div className="text-sm text-foreground">{customer?.name}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Endereço</div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>CEP</Label><Input placeholder="00000-000" /></div>
                        <div className="space-y-1"><Label>Nº</Label><Input placeholder="" /></div>
                      </div>
                      <div className="space-y-1"><Label>Endereço</Label><Input placeholder="Rua, Avenida..." /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Bairro</Label><Input /></div>
                        <div className="space-y-1"><Label>Município/UF</Label><Input /></div>
                      </div>
                      <div className="space-y-1"><Label>Ponto de referência</Label><Input /></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Contato</div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Solicitante</Label><Input /></div>
                        <div className="space-y-1"><Label>Telefone</Label><Input placeholder="(00) 00000-0000" /></div>
                      </div>
                      <div className="space-y-1"><Label>Nome da pessoa de contato</Label><Input /></div>
                      <div className="space-y-1"><Label>Email</Label><Input type="email" /></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Instalação</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Categoria</Label><Input placeholder="Residencial / Comercial / Rural" /></div>
                      <div className="space-y-1"><Label>Tipo de residência</Label><Input placeholder="Casa / Apartamento" /></div>
                      <div className="space-y-1"><Label>Fase declarada</Label><Input /></div>
                      <div className="space-y-1"><Label>Tipo de entrada</Label><Input /></div>
                      <div className="space-y-1"><Label>Tensão de fornecimento (V)</Label><Input /></div>
                      <div className="space-y-1"><Label>Tipo instalação</Label><Input /></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Equipamentos</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Total selecionado (W)</Label><Input readOnly value={"0"} /></div>
                      <div className="space-y-1"><Label>Carga instalada (kW)</Label><Input readOnly value={"0"} /></div>
                      <div className="space-y-1"><Label>Demanda calculada (kVA)</Label><Input readOnly value={"0"} /></div>
                      <div className="space-y-1"><Label>Medidor recomendado</Label><Input placeholder="" /></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Input placeholder="Detalhes adicionais" />
                </div>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                  <span className="text-sm text-muted-foreground">Confirmo que revisei os dados e desejo finalizar a solicitação.</span>
                </label>

              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Anterior</Button>
                <Button onClick={onFinish} disabled={!confirmed}>Finalizar</Button>
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
                  <div className="flex items-center gap-3"><Progress value={100} /><span className="text-xs text-muted-foreground">100%</span></div>
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