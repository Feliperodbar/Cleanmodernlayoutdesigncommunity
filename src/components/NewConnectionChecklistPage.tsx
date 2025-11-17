import { useMemo, useState } from "react";
import { AppHeader } from "./AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Info } from "lucide-react";

type NewConnectionChecklistPageProps = {
  onBack: () => void;
  onNext: () => void;
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

export function NewConnectionChecklistPage({ onBack, onNext }: NewConnectionChecklistPageProps) {
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Checklist" actions={<Button variant="outline" onClick={onBack}>Voltar</Button>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-6xl grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Checklist</CardTitle>
                    <p className="text-sm text-muted-foreground">Valide o padrão de entrada e condições para a primeira ligação</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Alert>
                  <AlertDescription>Necessário acesso livre para inspeção do padrão e finalização da ligação nova</AlertDescription>
                </Alert>

                {incomplete && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Alert>
                      <AlertDescription>Algumas perguntas não foram selecionadas</AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertDescription>Requer análise técnica</AlertDescription>
                    </Alert>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-green-700">Padrão de Entrada</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-sm">Já existe padrão de entrada?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="padrao_entrada_existente" checked={answers.padrao_entrada_existente === true} onChange={() => setAnswer("padrao_entrada_existente", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="padrao_entrada_existente" checked={answers.padrao_entrada_existente === false} onChange={() => setAnswer("padrao_entrada_existente", false)} /><span>Não</span></label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">Está situado a menos de 40m de um poste da concessionária?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="distancia_poste" checked={answers.distancia_poste === true} onChange={() => setAnswer("distancia_poste", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="distancia_poste" checked={answers.distancia_poste === false} onChange={() => setAnswer("distancia_poste", false)} /><span>Não</span></label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">Tem poste, portinhola bem engastada e na dimensão adequada?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="poste_proprio" checked={answers.poste_proprio === true} onChange={() => setAnswer("poste_proprio", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="poste_proprio" checked={answers.poste_proprio === false} onChange={() => setAnswer("poste_proprio", false)} /><span>Não</span></label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-green-700">Aeração Secundária</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-sm">Está fixado com parafusos, ou abraçadeiras e isoladores roldana?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="fixacao_parafusos" checked={answers.fixacao_parafusos === true} onChange={() => setAnswer("fixacao_parafusos", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="fixacao_parafusos" checked={answers.fixacao_parafusos === false} onChange={() => setAnswer("fixacao_parafusos", false)} /><span>Não</span></label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">Está na altura correta? (3,5 ou 5,0m para travessias de rua)</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="cabo_manutencao" checked={answers.cabo_manutencao === true} onChange={() => setAnswer("cabo_manutencao", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="cabo_manutencao" checked={answers.cabo_manutencao === false} onChange={() => setAnswer("cabo_manutencao", false)} /><span>Não</span></label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-green-700">Caixa de Medição</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-sm">A caixa está dentro das normas de especificações técnicas?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="caixa_especificacao" checked={answers.caixa_especificacao === true} onChange={() => setAnswer("caixa_especificacao", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="caixa_especificacao" checked={answers.caixa_especificacao === false} onChange={() => setAnswer("caixa_especificacao", false)} /><span>Não</span></label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">Está instalada na posição correta (entre 1,6 e 1,7m)?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="instalacao_altura" checked={answers.instalacao_altura === true} onChange={() => setAnswer("instalacao_altura", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="instalacao_altura" checked={answers.instalacao_altura === false} onChange={() => setAnswer("instalacao_altura", false)} /><span>Não</span></label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-green-700">Condutor de Enlace e Entrada</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-sm">Há sobra de cabo o suficiente para a instalação dos medidores?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="condutor_suficiente" checked={answers.condutor_suficiente === true} onChange={() => setAnswer("condutor_suficiente", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="condutor_suficiente" checked={answers.condutor_suficiente === false} onChange={() => setAnswer("condutor_suficiente", false)} /><span>Não</span></label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-green-700">Eletrodo de Entrada</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-sm">Tem no mínimo 3 curvas?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="eletrodo_trama" checked={answers.eletrodo_trama === true} onChange={() => setAnswer("eletrodo_trama", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="eletrodo_trama" checked={answers.eletrodo_trama === false} onChange={() => setAnswer("eletrodo_trama", false)} /><span>Não</span></label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">De material adequado? (PVC ou Aço)</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="tamanho_curvas" checked={answers.tamanho_curvas === true} onChange={() => setAnswer("tamanho_curvas", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="tamanho_curvas" checked={answers.tamanho_curvas === false} onChange={() => setAnswer("tamanho_curvas", false)} /><span>Não</span></label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">O aterramento está adequado?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="material_adequado" checked={answers.material_adequado === true} onChange={() => setAnswer("material_adequado", true)} /><span>Sim</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="material_adequado" checked={answers.material_adequado === false} onChange={() => setAnswer("material_adequado", false)} /><span>Não</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Voltar</Button>
                <Button onClick={onNext} disabled={incomplete}>Avançar</Button>
              </CardFooter>
            </Card>
          </div>

          <aside className="col-span-1">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle>Etapas</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                  <ul className="space-y-4">
                    {stepLabels.map((label, i) => (
                      <li key={label} className="flex items-start gap-3">
                        <div className={`mt-1 w-3 h-3 rounded-full ${i === 0 ? "bg-primary" : "bg-muted"}`} />
                        <span className={i === 0 ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}