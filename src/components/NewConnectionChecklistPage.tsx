import { useMemo, useState } from "react";
import type { Customer } from "../data/customers";
import { AppHeader } from "./AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Info, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

type NewConnectionChecklistPageProps = {
  onBack: () => void;
  onNext: () => void;
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

export function NewConnectionChecklistPage({ onBack, onNext, customer }: NewConnectionChecklistPageProps) {
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>({});
  const setAnswer = (key: string, value: boolean) => setAnswers((a) => ({ ...a, [key]: value }));

  const requiredKeys = useMemo(
    () => [
      "padrao_entrada_existente",
      "distancia_poste",
      "poste_proprio",
      "fixacao_parafusos",
      "cabo_manutencao",
      "caixa_especificacao",
      "instalacao_altura",
      "condutor_suficiente",
      "eletrodo_trama",
      "tamanho_curvas",
      "material_adequado",
    ],
    [],
  );

  const incomplete = requiredKeys.some((k) => answers[k] === undefined);
  const progress = Math.round(((requiredKeys.filter((k) => answers[k] !== undefined).length) / requiredKeys.length) * 100);
  const currentStep = 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Checklist" actions={<Button variant="outline" onClick={onBack}>Voltar</Button>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-6xl grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Info className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">Checklist</CardTitle>
                      <p className="text-sm text-muted-foreground">Valide o padrão de entrada e condições para a primeira ligação</p>
                    </div>
                  </div>
                  <div className="w-64">
                    <Progress value={progress} />
                    <div className="mt-1 text-xs text-muted-foreground">{progress}% concluído</div>
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
                <Alert>
                  <AlertDescription>Necessário acesso livre para inspeção do padrão e finalização da ligação nova</AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Padrão de Entrada</Badge>
                    <span className="text-xs text-muted-foreground">Verifique as condições iniciais</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm">Já existe padrão de entrada?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.padrao_entrada_existente === true ? "default" : "outline"} onClick={() => setAnswer("padrao_entrada_existente", true)}>Sim</Button>
                        <Button size="sm" variant={answers.padrao_entrada_existente === false ? "destructive" : "outline"} onClick={() => setAnswer("padrao_entrada_existente", false)}>Não</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">Está situado a menos de 40m de um poste da concessionária?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.distancia_poste === true ? "default" : "outline"} onClick={() => setAnswer("distancia_poste", true)}>Sim</Button>
                        <Button size="sm" variant={answers.distancia_poste === false ? "destructive" : "outline"} onClick={() => setAnswer("distancia_poste", false)}>Não</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">Tem poste, portinhola bem engastada e na dimensão adequada?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.poste_proprio === true ? "default" : "outline"} onClick={() => setAnswer("poste_proprio", true)}>Sim</Button>
                        <Button size="sm" variant={answers.poste_proprio === false ? "destructive" : "outline"} onClick={() => setAnswer("poste_proprio", false)}>Não</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Aeração Secundária</Badge>
                    <span className="text-xs text-muted-foreground">Fixação e altura</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm">Está fixado com parafusos, ou abraçadeiras e isoladores roldana?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.fixacao_parafusos === true ? "default" : "outline"} onClick={() => setAnswer("fixacao_parafusos", true)}>Sim</Button>
                        <Button size="sm" variant={answers.fixacao_parafusos === false ? "destructive" : "outline"} onClick={() => setAnswer("fixacao_parafusos", false)}>Não</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">Está na altura correta? (3,5 ou 5,0m para travessias de rua)</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.cabo_manutencao === true ? "default" : "outline"} onClick={() => setAnswer("cabo_manutencao", true)}>Sim</Button>
                        <Button size="sm" variant={answers.cabo_manutencao === false ? "destructive" : "outline"} onClick={() => setAnswer("cabo_manutencao", false)}>Não</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Caixa de Medição</Badge>
                    <span className="text-xs text-muted-foreground">Normas e posição</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm">A caixa está dentro das normas de especificações técnicas?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.caixa_especificacao === true ? "default" : "outline"} onClick={() => setAnswer("caixa_especificacao", true)}>Sim</Button>
                        <Button size="sm" variant={answers.caixa_especificacao === false ? "destructive" : "outline"} onClick={() => setAnswer("caixa_especificacao", false)}>Não</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">Está instalada na posição correta (entre 1,6 e 1,7m)?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.instalacao_altura === true ? "default" : "outline"} onClick={() => setAnswer("instalacao_altura", true)}>Sim</Button>
                        <Button size="sm" variant={answers.instalacao_altura === false ? "destructive" : "outline"} onClick={() => setAnswer("instalacao_altura", false)}>Não</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Condutor de Enlace e Entrada</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm">Há sobra de cabo o suficiente para a instalação dos medidores?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.condutor_suficiente === true ? "default" : "outline"} onClick={() => setAnswer("condutor_suficiente", true)}>Sim</Button>
                        <Button size="sm" variant={answers.condutor_suficiente === false ? "destructive" : "outline"} onClick={() => setAnswer("condutor_suficiente", false)}>Não</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Eletrodo de Entrada</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm">Tem no mínimo 3 curvas?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.eletrodo_trama === true ? "default" : "outline"} onClick={() => setAnswer("eletrodo_trama", true)}>Sim</Button>
                        <Button size="sm" variant={answers.eletrodo_trama === false ? "destructive" : "outline"} onClick={() => setAnswer("eletrodo_trama", false)}>Não</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">De material adequado? (PVC ou Aço)</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.tamanho_curvas === true ? "default" : "outline"} onClick={() => setAnswer("tamanho_curvas", true)}>Sim</Button>
                        <Button size="sm" variant={answers.tamanho_curvas === false ? "destructive" : "outline"} onClick={() => setAnswer("tamanho_curvas", false)}>Não</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">O aterramento está adequado?</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={answers.material_adequado === true ? "default" : "outline"} onClick={() => setAnswer("material_adequado", true)}>Sim</Button>
                        <Button size="sm" variant={answers.material_adequado === false ? "destructive" : "outline"} onClick={() => setAnswer("material_adequado", false)}>Não</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {incomplete && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <Alert>
                      <AlertDescription>Algumas perguntas não foram selecionadas</AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertDescription>Requer análise técnica</AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Voltar</Button>
                <Button onClick={onNext} disabled={incomplete}>Avançar</Button>
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
                  <div className="flex items-center gap-3">
                    <Progress value={progress} />
                    <span className="text-xs text-muted-foreground">{progress}%</span>
                  </div>
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