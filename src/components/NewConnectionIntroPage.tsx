import { ArrowLeft, FileText, Home, Plug, ShieldCheck, Building2 } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

interface NewConnectionIntroPageProps {
  onBack: () => void;
  onContinue: () => void;
}

export function NewConnectionIntroPage({ onBack, onContinue }: NewConnectionIntroPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Ligação nova"
        subtitle="Confira os requisitos antes de iniciar"
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        }
      />

      <main className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Plug className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Um serviço Neoenergia para sua primeira ligação</CardTitle>
                  <p className="text-sm text-muted-foreground">Saiba quais documentos e informações serão solicitadas nas próximas etapas</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-green-700 mb-4">Pessoa Física</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">Dados do titular</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>Nome completo</li>
                        <li>Documento oficial com foto</li>
                        <li><span className="font-semibold">CPF válido</span> (certifique-se de que não esteja cancelado ou suspenso)</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <Home className="w-4 h-4" />
                        <span className="font-medium">Endereço</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>Endereço completo</li>
                        <li>Ponto de referência da unidade consumidora</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="font-medium">Relação de equipamentos elétricos</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Será importante informar quais equipamentos elétricos existirão na unidade consumidora.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">CEP não localizado</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Caso o CEP fornecido não esteja cadastrado, será necessário anexar um comprovante de residência.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-green-700 mb-4">Pessoa Jurídica</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">Dados do CNPJ</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>CNPJ</li>
                        <li>Razão social</li>
                        <li>Atividade principal</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <Home className="w-4 h-4" />
                        <span className="font-medium">Endereço</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>Endereço completo</li>
                        <li>Ponto de referência unidade consumidora</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="font-medium">Relação equipamentos elétricos</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Será importante informar quais equipamentos elétricos existirão na unidade consumidora.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">CEP não localizado</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Caso o CEP fornecido não esteja cadastrado, será necessário anexar um comprovante de residência.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border justify-between">
              <Button variant="outline" onClick={onBack}>Voltar</Button>
              <Button onClick={onContinue}>Continuar</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}