import { useState, useEffect } from "react";
import { AppHeader } from "./AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { User, MapPin, Info, Star } from "lucide-react";

type NewConnectionWizardPageProps = {
  onBack: () => void;
  onFinish: () => void;
};

type HolderData = {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
};

type AddressData = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  reference: string;
};

type ConsumerUnitData = {
  category: string;
  installationType: string;
  propertyType: string;
  temporary: boolean;
  previousUC?: string;
  notes?: string;
  nearPole?: boolean;
};

type DimensioningData = {
  powerKW: number;
  voltage: number;
  pf: number;
  tariff: string;
  heavyAppliances: number;
  confirmed: boolean;
  specialLoads?: boolean;
};

type TariffOptionsData = {
  profile: string;
  tariffType: string;
};

type BillingData = {
  dueDate: string;
  termsAccepted: boolean;
};

const steps = [
  "Dados do titular",
  "Endereço da ligação",
  "Unidade consumidora",
  "Dimensionamento de energia",
  "Resumo",
  "Personalização",
];

export function NewConnectionWizardPage({ onBack, onFinish }: NewConnectionWizardPageProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [holder, setHolder] = useState<HolderData>({ name: "", birthDate: "", phone: "", email: "" });
  const [address, setAddress] = useState<AddressData>({ cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", reference: "" });
  const [consumer, setConsumer] = useState<ConsumerUnitData>({ category: "", installationType: "", propertyType: "", temporary: false });
  const [dimension, setDimension] = useState<DimensioningData>({ powerKW: 5, voltage: 127, pf: 0.92, tariff: "", heavyAppliances: 0, confirmed: false });
  const [tariffOptions, setTariffOptions] = useState<TariffOptionsData>({ profile: "", tariffType: "" });
  const [billing, setBilling] = useState<BillingData>({ dueDate: "", termsAccepted: false });
  const [infoOpen, setInfoOpen] = useState(false);
  const [digitalEmail, setDigitalEmail] = useState("");
  const [allowEditEmail, setAllowEditEmail] = useState(false);
  const [digitalAccepted, setDigitalAccepted] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [autoDebitBank, setAutoDebitBank] = useState("");
  const [autoDebitAccepted, setAutoDebitAccepted] = useState(false);
  const DIMENSION_INFO_IMG = "https://tos-maliva-i-8h5vqs2gkl-us/us/7567086017926349880/image/1763384637270_gbyvms2rms90_png_1081x682";
  const NEAR_POLE_INFO_IMG = "https://tos-maliva-i-8h5vqs2gkl-us/us/7567086017926349880/image/1763384710513_3a5nqk5qr9b0_png_818x362";
  const SPECIAL_LOADS_YES_IMG = NEAR_POLE_INFO_IMG;
  const SPECIAL_LOADS_NO_IMG = DIMENSION_INFO_IMG;
  const STEP8_IMG = "https://tos-maliva-i-8h5vqs2gkl-us/us/7567086017926349880/image/1763384938222_vq631cx5g1b0_png_1207x592";

  useEffect(() => {
    setDigitalEmail(holder.email || "");
  }, [holder.email]);

  const generateProtocol = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${y}${m}${d}${hh}${mm}${ss}${rand}`;
  };

  useEffect(() => {
    if (stepIndex === steps.length - 1 && !protocol) setProtocol(generateProtocol());
  }, [stepIndex]);

  const canContinue = () => {
    if (stepIndex === 0) return holder.name && holder.birthDate && holder.phone && holder.email;
    if (stepIndex === 1) return address.cep && address.street && address.number && address.neighborhood && address.city && address.state;
    if (stepIndex === 2) return consumer.category && consumer.installationType && consumer.propertyType;
    if (stepIndex === 3) return dimension.confirmed;
    if (stepIndex === 5) return true;
    return true;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.slice(0, 10).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return numbers.slice(0, 11).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  };

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
        setAddress((prev) => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }));
      }
    } catch {}
  };

  const goNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1); else onFinish();
  };

  const goPrev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1); else onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ligação nova" subtitle={`Etapa atual: ${steps[stepIndex]}`} actions={
        <Button variant="outline" className="gap-2" onClick={onBack}>Voltar</Button>
      } />
      <main className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i <= stepIndex ? "bg-secondary text-white" : "bg-border text-muted-foreground"}`}>{i + 1}</div>
                  {i < steps.length - 1 && <div className={`w-10 h-[2px] mx-2 ${i < stepIndex ? "bg-secondary" : "bg-border"}`} />}
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">Passo {stepIndex + 1} de {steps.length} — {steps[stepIndex]}</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-center gap-3 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  {stepIndex === 0 ? <User className="w-6 h-6 text-secondary" /> : <MapPin className="w-6 h-6 text-secondary" />}
                </div>
                <div>
                  <CardTitle className="text-foreground">{steps[stepIndex]}</CardTitle>
                  <p className="text-sm text-muted-foreground">Preencha os campos abaixo</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {stepIndex === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="holder-name">Nome</Label>
                    <Input id="holder-name" value={holder.name} onChange={(e) => setHolder({ ...holder, name: e.target.value })} placeholder="Digite o nome" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holder-birth">Data de nascimento</Label>
                      <Input id="holder-birth" type="date" value={holder.birthDate} onChange={(e) => setHolder({ ...holder, birthDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holder-phone">Telefone com DDD</Label>
                      <Input id="holder-phone" value={holder.phone} onChange={(e) => setHolder({ ...holder, phone: formatPhone(e.target.value) })} placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="holder-email">Email</Label>
                    <Input id="holder-email" type="email" value={holder.email} onChange={(e) => setHolder({ ...holder, email: e.target.value })} placeholder="email@exemplo.com" />
                  </div>
                </div>
              )}

              {stepIndex === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" value={address.cep} onChange={async (e) => { const v = formatCep(e.target.value); setAddress({ ...address, cep: v }); await fetchViaCep(v); }} placeholder="00000-000" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="street">Logradouro</Label>
                      <Input id="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Rua" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="number">Número</Label>
                      <Input id="number" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input id="complement" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input id="neighborhood" value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade/UF</Label>
                      <Input id="city" value={address.city && address.state ? `${address.city}/${address.state}` : address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Ponto de referência</Label>
                    <Input id="reference" value={address.reference} onChange={(e) => setAddress({ ...address, reference: e.target.value })} />
                  </div>
                </div>
              )}

              {stepIndex > 1 && (
                stepIndex === 2 ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Sua Unidade Consumidora está localizada em até 40 metros do poste de energia mais próximo?</p>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="nearPole" checked={consumer.nearPole === true} onChange={() => setConsumer({ ...consumer, nearPole: true })} />
                          <span>Sim</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="nearPole" checked={consumer.nearPole === false} onChange={() => setConsumer({ ...consumer, nearPole: false })} />
                          <span>Não</span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria da unidade *</Label>
                        <Select value={consumer.category} onValueChange={(v) => setConsumer({ ...consumer, category: v })}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residencial">Residencial</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="rural">Rural</SelectItem>
                            <SelectItem value="poder_publico">Poder Público</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="installationType">Tipo de instalação *</Label>
                        <Select value={consumer.installationType} onValueChange={(v) => setConsumer({ ...consumer, installationType: v })}>
                          <SelectTrigger id="installationType">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monofasico">Monofásico</SelectItem>
                            <SelectItem value="bifasico">Bifásico</SelectItem>
                            <SelectItem value="trifasico">Trifásico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Tipo de imóvel *</Label>
                        <Select value={consumer.propertyType} onValueChange={(v) => setConsumer({ ...consumer, propertyType: v })}>
                          <SelectTrigger id="propertyType">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="casa">Casa</SelectItem>
                            <SelectItem value="apartamento">Apartamento</SelectItem>
                            <SelectItem value="comercio">Comércio</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="previousUC">Número da UC anterior</Label>
                        <Input id="previousUC" value={consumer.previousUC || ""} onChange={(e) => setConsumer({ ...consumer, previousUC: e.target.value })} placeholder="Opcional" />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={consumer.temporary}
                            onChange={(e) => setConsumer({ ...consumer, temporary: e.target.checked })}
                          />
                          <span>Ligação temporária</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea id="notes" value={consumer.notes || ""} onChange={(e) => setConsumer({ ...consumer, notes: e.target.value })} placeholder="Detalhes adicionais" />
                    </div>
                  </div>
                ) : (
                  stepIndex === 3 ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>A Unidade Consumidora possui equipamentos com cargas especiais?</Label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="specialLoads" checked={dimension.specialLoads === true} onChange={() => setDimension({ ...dimension, specialLoads: true })} />
                            <span>Sim</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="specialLoads" checked={dimension.specialLoads === false} onChange={() => setDimension({ ...dimension, specialLoads: false })} />
                            <span>Não</span>
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label>Potência total estimada (kW)</Label>
                            <div className="flex items-center gap-4">
                              <div className="w-full">
                                <Slider value={[dimension.powerKW]} min={1} max={100} onValueChange={(v) => setDimension({ ...dimension, powerKW: v[0] })} />
                              </div>
                              <Input className="w-24" type="number" min={1} max={100} step={1} value={dimension.powerKW} onChange={(e) => setDimension({ ...dimension, powerKW: Number(e.target.value) })} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Tensão nominal (V)</Label>
                              <Select value={String(dimension.voltage)} onValueChange={(v) => setDimension({ ...dimension, voltage: Number(v) })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="127">127</SelectItem>
                                  <SelectItem value="220">220</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Fator de potência</Label>
                              <Input type="number" min={0.7} max={1} step={0.01} value={dimension.pf} onChange={(e) => setDimension({ ...dimension, pf: Number(e.target.value) })} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Tarifa / Grupo</Label>
                              <Select value={dimension.tariff} onValueChange={(v) => setDimension({ ...dimension, tariff: v })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="b1">B1 Residencial</SelectItem>
                                  <SelectItem value="b3">B3 Comercial</SelectItem>
                                  <SelectItem value="rural">Rural</SelectItem>
                                  <SelectItem value="poder_publico">Poder Público</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Equipamentos de alto consumo</Label>
                              <Input type="number" min={0} max={20} step={1} value={dimension.heavyAppliances} onChange={(e) => setDimension({ ...dimension, heavyAppliances: Number(e.target.value) })} />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {(() => {
                            const P = dimension.powerKW * 1000;
                            const V = dimension.voltage || 127;
                            const pf = dimension.pf || 0.92;
                            const phases = consumer.installationType === "trifasico" ? Math.sqrt(3) : 1;
                            const I = P / (V * pf * phases);
                            const safetyI = I * 1.25;
                            const options = [25, 32, 40, 50, 63, 80, 100];
                            const breaker = options.find((a) => a >= safetyI) || 100;
                            return (
                              <div className="space-y-4">
                                <div className="rounded-lg border border-border p-4">
                                  <div className="text-sm text-muted-foreground">Resultado estimado</div>
                                  <div className="mt-2 grid grid-cols-2 gap-3">
                                    <div>
                                      <div className="text-xs text-muted-foreground">Corrente nominal</div>
                                      <div className="text-foreground font-medium">{I.toFixed(1)} A</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-muted-foreground">Disjuntor recomendado</div>
                                      <div className="text-foreground font-medium">{breaker} A</div>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground">Instalação: {consumer.installationType || "—"}</div>
                                </div>
                                <Alert>
                                  <AlertDescription>
                                    Os valores são estimativas. A confirmação garante que entende e concorda com o dimensionamento para a ligação.
                                  </AlertDescription>
                                </Alert>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={dimension.confirmed}
                                    onChange={(e) => setDimension({ ...dimension, confirmed: e.target.checked })}
                                    onClick={() => setInfoOpen(true)}
                                  />
                                  <span>Confirmo que o dimensionamento está adequado para a Unidade Consumidora.</span>
                                </label>
                                <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Saiba mais sobre o dimensionamento</DialogTitle>
                                      <DialogDescription>
                                        Verifique o padrão de entrada, caixa de medição e aterramento antes de confirmar.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="rounded-lg overflow-hidden border border-border">
                                      <ImageWithFallback src={DIMENSION_INFO_IMG} alt="Padrão de entrada" className="w-full h-auto" />
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setInfoOpen(false)}>Fechar</Button>
                                      <Button onClick={() => { setDimension({ ...dimension, confirmed: true }); setInfoOpen(false); }}>Concordar e confirmar</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    stepIndex === 4 ? (
                      <div className="space-y-6">
                        {consumer.nearPole ? (
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Informação importante para instalações próximas ao poste</div>
                            <div className="rounded-lg overflow-hidden border border-border">
                              <ImageWithFallback src={NEAR_POLE_INFO_IMG} alt="Informação de proximidade ao poste" className="w-full h-auto" />
                            </div>
                          </div>
                        ) : (
                          <Alert>
                            <AlertDescription>
                              Nenhuma exigência adicional identificada para a distância até o poste.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ) : (
                      stepIndex === 5 ? (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground">Fatura digital</div>
                            <div className="text-muted-foreground">Receba a 2ª via da sua fatura por e-mail</div>
                            <p className="text-sm text-muted-foreground">Ao cadastrar a fatura digital, você deixará de receber sua fatura em papel e receberá por e-mail. Suas faturas também poderão ser consultadas através da agência virtual ou APP Neoenergia.</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="digital-email">Seu e-mail da área logada</Label>
                            <div className="flex items-center gap-3">
                              <Input id="digital-email" type="email" value={digitalEmail} onChange={(e) => setDigitalEmail(e.target.value)} disabled={!allowEditEmail} className="max-w-md" />
                              <Button variant="outline" onClick={() => setAllowEditEmail(!allowEditEmail)}>Alterar</Button>
                            </div>
                          </div>
                          <label className="flex items-start gap-2">
                            <input type="checkbox" checked={digitalAccepted} onChange={(e) => setDigitalAccepted(e.target.checked)} />
                            <span className="text-sm text-muted-foreground">Declaro que desejo prosseguir com o descadastramento da entrega de fatura impressa, o cadastro do recebimento da fatura digital e que li e aceito o <a href="#" className="text-secondary underline">Termo de Adesão</a>.</span>
                          </label>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Conteúdo da etapa em desenvolvimento.</div>
                      )
                    )
                  )
                )
              )}
            </CardContent>
            <CardFooter className="border-t border-border justify-between">
              <Button variant="outline" onClick={goPrev}>Voltar</Button>
              <Button onClick={goNext} disabled={!canContinue()}>{stepIndex === 5 ? "Pular" : stepIndex === steps.length - 1 ? "Sair" : "Continuar"}</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
