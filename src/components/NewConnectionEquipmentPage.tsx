import { useMemo, useState } from "react";
import { AppHeader } from "./AppHeader";
import type { Customer } from "../data/customers";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { CheckCircle2, Circle, Home } from "lucide-react";

export type NewConnectionEquipmentData = {
  totalW: number;
  installedKW: number;
  demandKVA: number;
  resLevel: 0 | 1 | 2 | 3;
  hasTechnicalDoc?: boolean;
};

type NewConnectionEquipmentPageProps = {
  onBack: () => void;
  onNext: (data: NewConnectionEquipmentData) => void;
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

type EquipmentItem = { id: number; name: string; powerW: number; qty: number; selected: boolean };

export function NewConnectionEquipmentPage({ onBack, onNext, onCancel, customer }: NewConnectionEquipmentPageProps) {
  const currentStep = 4;
  const [hasTechnicalDoc, setHasTechnicalDoc] = useState<boolean | undefined>(undefined);
  const [segment, setSegment] = useState<"all" | "combos" | "lighting" | "appliances" | "motors">("all");
  const [resLevel, setResLevel] = useState<0 | 1 | 2 | 3>(0);
  const limits: Record<0 | 1 | 2 | 3, number> = { 0: 5000, 1: 10000, 2: 18000, 3: 25000 };
  const [items, setItems] = useState<EquipmentItem[]>([
    { id: 1, name: "Ferro de passar roupas automático", powerW: 1000, qty: 1, selected: true },
    { id: 2, name: "Forno de microondas", powerW: 1200, qty: 1, selected: true },
    { id: 3, name: "Liquidificador residencial", powerW: 320, qty: 1, selected: true },
    { id: 4, name: "Micro computador", powerW: 150, qty: 1, selected: true },
    { id: 5, name: "Multiprocessador", powerW: 420, qty: 1, selected: true },
    { id: 6, name: "Carregador de telefone celular", powerW: 5, qty: 4, selected: true },
    { id: 7, name: "Geladeira comum 310L", powerW: 190, qty: 1, selected: true },
    { id: 8, name: "Sanduicheira", powerW: 640, qty: 1, selected: true },
    { id: 9, name: "Telefone sem fio", powerW: 10, qty: 1, selected: true },
    { id: 10, name: "Televisor acima de 30 polegadas", powerW: 200, qty: 2, selected: true },
    { id: 11, name: "Ventilador grande 50 cm", powerW: 250, qty: 1, selected: true },
  ]);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())), [items, search]);

  const totalW = filtered.filter(i => i.selected).reduce((sum, i) => sum + i.powerW * i.qty, 0);
  const installedKW = totalW / 1000;
  const demandKVA = installedKW / 0.92;
  const progress = Math.min(100, Math.round((filtered.filter(i => i.selected).length / Math.max(1, items.length)) * 100));

  const setQty = (id: number, qty: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  const toggleItem = (id: number, sel: boolean) => setItems(prev => prev.map(i => i.id === id ? { ...i, selected: sel } : i));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Seleção de Equipamentos Elétricos" actions={<Button variant="destructive" onClick={onCancel}>Cancelar</Button>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-6xl grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Documento de responsabilidade técnica</CardTitle>
                    <p className="text-sm text-muted-foreground">Selecione o nível residencial e os equipamentos</p>
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
                      <div className="text-sm text-foreground">{customer?.lastProtocol ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Cliente</div>
                      <div className="text-sm text-foreground">{customer?.name}</div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm">Cliente possui documento de responsabilidade técnica?</div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2"><input type="radio" name="techDoc" checked={hasTechnicalDoc === true} onChange={() => setHasTechnicalDoc(true)} /><span>Sim</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="techDoc" checked={hasTechnicalDoc === false} onChange={() => setHasTechnicalDoc(false)} /><span>Não</span></label>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[0,1,2,3].map((n) => (
                    <button key={n} type="button" className={`rounded-lg border p-4 flex flex-col items-center gap-2 ${resLevel === n ? "ring-2 ring-primary border-primary bg-primary/10" : "hover:bg-muted"}`} onClick={() => setResLevel(n as 0|1|2|3)}>
                      <Home className={`w-6 h-6 ${resLevel === n ? "text-primary" : "text-secondary"}`} />
                      <span className={resLevel === n ? "text-primary font-medium" : undefined}>{`Residencial ${n}`}</span>
                      <span className="text-xs text-muted-foreground">Limite de carga</span>
                      <span className="text-sm text-foreground">{limits[n as 0|1|2|3]}W</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    {key: "combos", label: "Combos"},
                    {key: "lighting", label: "Iluminação e Tomadas"},
                    {key: "appliances", label: "Eletrodomésticos"},
                    {key: "motors", label: "Motores e equipamentos especiais"},
                    {key: "all", label: "Todos"},
                  ].map(o => (
                    <Button key={o.key} variant={segment === o.key ? "default" : "outline"} size="sm" onClick={() => setSegment(o.key as any)}>{o.label}</Button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Input placeholder="Buscar equipamento..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2 w-10"></th>
                          <th className="text-left p-2">Equipamento</th>
                          <th className="text-left p-2">Potência</th>
                          <th className="text-left p-2">Quantidade</th>
                          <th className="text-left p-2">Potência Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(i => (
                          <tr key={i.id} className="border-t">
                            <td className="p-2"><input type="checkbox" checked={i.selected} onChange={(e) => toggleItem(i.id, e.target.checked)} /></td>
                            <td className="p-2">{i.name}</td>
                            <td className="p-2">{i.powerW} W</td>
                            <td className="p-2"><Input className="w-24" type="number" min={0} value={i.qty} onChange={(e) => setQty(i.id, Number(e.target.value))} /></td>
                            <td className="p-2">{i.powerW * i.qty} W</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Total selecionado: {totalW} W</div>
                    <Button>Calcular</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Carga instalada Total (kW)</Label><Input value={installedKW.toFixed(2)} readOnly /></div>
                      <div className="space-y-1"><Label>Demanda calculada (kVA)</Label><Input value={demandKVA.toFixed(2)} readOnly /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Tensão de Fornecimento (V)</Label>
                        <Select defaultValue="220/380">
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent><SelectItem value="127/220">127/220</SelectItem><SelectItem value="220/380">220/380</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1"><Label>Faixa (kW/kVA)</Label><Input placeholder="" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Fase Calculada</Label><Input placeholder="" /></div>
                      <div className="space-y-1"><Label>Fase Declarada</Label><Input placeholder="" /></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-foreground">Diferença de custos de Medidor</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Fase declarada</Label><Input value="R$ 0,00" readOnly /></div>
                      <div className="space-y-1"><Label>Qualimetria</Label><Input value="R$ 0,00" readOnly /></div>
                    </div>
                    <div className="space-y-1"><Label>Total</Label><Input value="R$ 0,00" readOnly /></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="text-green-700">Motor (CV)</div>
                    <div className="grid grid-cols-3 gap-3"><Input placeholder="FN" /><Input placeholder="2F" /><Input placeholder="3F" /></div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-green-700">Condutor (mm2)</div>
                    <div className="grid grid-cols-3 gap-3"><Input placeholder="Aéreo" /><Input placeholder="Subterrâneo" /><Input placeholder="Embutido" /></div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-green-700">Duto (mm)</div>
                    <div className="grid grid-cols-3 gap-3"><Input placeholder="PVC" /><Input placeholder="Aço" /><Input placeholder="Aterramento (MM2)" /></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2"><Label>Disjuntor (A)</Label><Input /></div>
                  <div className="space-y-2"><Label>Medidor</Label><Input /></div>
                  <div className="space-y-2"><Label>Tipo da Caixa</Label><Input /></div>
                </div>

              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Anterior</Button>
                <Button onClick={() => onNext({ totalW, installedKW, demandKVA, resLevel, hasTechnicalDoc })}>Avançar</Button>
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