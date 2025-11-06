import { User, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

type HomePageProps = {
  onIdentifyClick?: () => void;
};

export function HomePage({ onIdentifyClick }: HomePageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header reutilizando estilo */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003A70] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">Atendimento</h1>
              <p className="text-xs text-[#00A859]">NEOENERGIA COSERN</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-[#00A859] hover:bg-[#008F4A]">Nova Ligação</Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xl text-slate-900 mb-8">Painel de Atendimento</h2>

          <div className="flex items-center justify-center">
            <Card className="w-56 cursor-pointer hover:shadow-md transition-shadow" onClick={onIdentifyClick}>
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <User className="w-24 h-24 text-[#003A70]/40" />
                <p className="text-sm text-slate-600">Identificar cliente</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

