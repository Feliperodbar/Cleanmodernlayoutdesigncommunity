import { useMemo, useState } from "react";
import type { Customer } from "../data/customers";
import { AppHeader } from "./AppHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

type NewConnectionChecklistPageProps = {
  onBack: () => void;
  onNext: () => void;
  customer?: Customer | null;
};

export function NewConnectionChecklistPage({
  onBack,
  onNext,
  customer,
}: NewConnectionChecklistPageProps) {
  const initialAnswers: Record<string, boolean | null> = {
    padrao_entrada_existente: null,
    distancia_poste: null,
    poste_proprio: null,
    fixacao_parafusos: null,
    cabo_manutencao: null,
    caixa_especificacao: null,
    instalacao_altura: null,
    condutor_suficiente: null,
    eletrodo_trama: null,
    tamanho_curvas: null,
    material_adequado: null,
  };

  const [answers, setAnswers] = useState(initialAnswers);
  const setAnswer = (key: keyof typeof initialAnswers, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const [currentStep, setCurrentStep] = useState(0);

  const stepLabels = ["Padrão", "Poste & Fixação", "Caixa & Condutor"];

  const totalQuestions = Object.keys(initialAnswers).length;
  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const incomplete = answeredCount < totalQuestions;

  const stepPanels = useMemo(() => {
    return [
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-card/50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">Padrão</Badge>
              <span className="text-xs text-muted-foreground">Entrada</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Já existe padrão de entrada?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.padrao_entrada_existente === true
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setAnswer("padrao_entrada_existente", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.padrao_entrada_existente === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("padrao_entrada_existente", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Distância &lt; 40m do poste?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.distancia_poste === true ? "default" : "outline"
                    }
                    onClick={() => setAnswer("distancia_poste", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.distancia_poste === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("distancia_poste", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-card/50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">Poste</Badge>
              <span className="text-xs text-muted-foreground">Condição</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Poste e portinhola adequados?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.poste_proprio === true ? "default" : "outline"
                    }
                    onClick={() => setAnswer("poste_proprio", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.poste_proprio === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("poste_proprio", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">Fixação</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Fixação com parafusos/abraçadeiras?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.fixacao_parafusos === true ? "default" : "outline"
                    }
                    onClick={() => setAnswer("fixacao_parafusos", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.fixacao_parafusos === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("fixacao_parafusos", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Altura correta (3,5 / 5,0m)?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.cabo_manutencao === true ? "default" : "outline"
                    }
                    onClick={() => setAnswer("cabo_manutencao", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.cabo_manutencao === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("cabo_manutencao", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-card/50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">Caixa</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Dentro das normas técnicas?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.caixa_especificacao === true
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setAnswer("caixa_especificacao", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.caixa_especificacao === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("caixa_especificacao", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Posição 1,6 - 1,7m?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.instalacao_altura === true ? "default" : "outline"
                    }
                    onClick={() => setAnswer("instalacao_altura", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.instalacao_altura === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("instalacao_altura", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">Condutor / Eletrodo</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Sobra de cabo suficiente?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.condutor_suficiente === true
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setAnswer("condutor_suficiente", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.condutor_suficiente === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("condutor_suficiente", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Tem no mínimo 3 curvas?</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      answers.eletrodo_trama === true ? "default" : "outline"
                    }
                    onClick={() => setAnswer("eletrodo_trama", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      answers.eletrodo_trama === false
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => setAnswer("eletrodo_trama", false)}
                  >
                    Não
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
    ];
  }, [answers]);

  return (
    <div>
      <AppHeader />
      <main className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b border-border bg-transparent px-4 py-3">
                <CardTitle className="text-sm">
                  Checklist de Nova Conexão
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {customer && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Protocolo
                      </div>
                      <div className="text-sm text-foreground">
                        {customer.lastProtocol ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Cliente
                      </div>
                      <div className="text-sm text-foreground truncate">
                        {customer.name}
                      </div>
                    </div>
                  </div>
                )}

                <Alert className="bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    Necessário acesso livre para inspeção do padrão e
                    finalização da ligação nova
                  </AlertDescription>
                </Alert>

                {stepPanels[currentStep]}

                {currentStep === stepPanels.length - 1 && incomplete && (
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    <Alert>
                      <AlertDescription>
                        Algumas perguntas não foram selecionadas
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-t border-border justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    currentStep > 0 ? setCurrentStep((s) => s - 1) : onBack()
                  }
                >
                  {currentStep > 0 ? "Anterior" : "Voltar"}
                </Button>
                <Button
                  onClick={() => {
                    const last = stepPanels.length - 1;
                    if (currentStep === last) {
                      if (!incomplete) onNext();
                    } else {
                      setCurrentStep((s) => Math.min(s + 1, last));
                    }
                  }}
                  disabled={
                    currentStep === stepPanels.length - 1 ? incomplete : false
                  }
                >
                  {currentStep === stepPanels.length - 1
                    ? "Concluir"
                    : "Próximo"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <aside>
            <Card>
              <CardHeader className="border-b border-border bg-transparent px-4 py-3">
                <CardTitle className="text-sm">Etapas</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-full" />
                    <span className="text-xs text-muted-foreground">
                      {progress}%
                    </span>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                    <ul className="space-y-3 text-sm">
                      {stepLabels.map((label, i) => (
                        <li key={label} className="flex items-start gap-2">
                          {i <= currentStep ? (
                            <CheckCircle2 className="mt-0.5 w-4 h-4 text-primary" />
                          ) : (
                            <Circle className="mt-0.5 w-4 h-4 text-muted-foreground" />
                          )}
                          <span
                            className={
                              i <= currentStep
                                ? i === currentStep
                                  ? "text-primary font-medium"
                                  : "text-primary"
                                : "text-muted-foreground"
                            }
                          >
                            {label}
                          </span>
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

export default NewConnectionChecklistPage;
