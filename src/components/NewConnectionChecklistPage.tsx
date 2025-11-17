import { useMemo, useState } from "react";
import { AppHeader } from "./AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
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
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setAnswers((a) => ({ ...a, [key]: !a[key] }));

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

  const incomplete = requiredKeys.some((k) => !answers[k]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle="Checklist" actions={<Button variant="outline" onClick={onBack}>Voltar</Button>} />
      <main className="flex items-start justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.padrao_entrada_existente} onCheckedChange={() => toggle("padrao_entrada_existente")} /><span>Já existe padrão de entrada?</span></label>
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.distancia_poste} onCheckedChange={() => toggle("distancia_poste")} /><span>Está situado a menos de 40m de um poste da concessionária?</span></label>
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.poste_proprio} onCheckedChange={() => toggle("poste_proprio")} /><span>Tem poste, portinhola bem engastada e na dimensão adequada?</span></label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-green-700">Aeração Secundária</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.fixacao_parafusos} onCheckedChange={() => toggle("fixacao_parafusos")} /><span>Está fixado com parafusos, ou abraçadeiras e isoladores roldana?</span></label>
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.cabo_manutencao} onCheckedChange={() => toggle("cabo_manutencao")} /><span>Está na altura correta? (3,5 ou 5,0m para travessias de rua)</span></label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-green-700">Caixa de Medição</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.caixa_especificacao} onCheckedChange={() => toggle("caixa_especificacao")} /><span>A caixa está dentro das normas de especificações técnicas?</span></label>
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.instalacao_altura} onCheckedChange={() => toggle("instalacao_altura")} /><span>Está instalada na posição correta (entre 1,6 e 1,7m)?</span></label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-green-700">Condutor de Enlace e Entrada</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.condutor_suficiente} onCheckedChange={() => toggle("condutor_suficiente")} /><span>Há sobra de cabo o suficiente para a instalação dos medidores?</span></label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-green-700">Eletrodo de Entrada</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.eletrodo_trama} onCheckedChange={() => toggle("eletrodo_trama")} /><span>Tem no mínimo 3 curvas?</span></label>
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.tamanho_curvas} onCheckedChange={() => toggle("tamanho_curvas")} /><span>De material adequado? (PVC ou Aço)</span></label>
                    <label className="flex items-start gap-2"><Checkbox checked={!!answers.material_adequado} onCheckedChange={() => toggle("material_adequado")} /><span>O aterramento está adequado?</span></label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border justify-between">
                <Button variant="outline" onClick={onBack}>Voltar</Button>
                <Button onClick={onNext} disabled={incomplete}>Avançar</Button>
              </CardFooter>
            </Card>
          </div>

          <aside className="lg:col-span-1">
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