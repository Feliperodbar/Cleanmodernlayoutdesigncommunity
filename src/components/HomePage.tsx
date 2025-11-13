import { User, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AppHeader } from './AppHeader';

type HomePageProps = {
  onIdentifyClick?: () => void;
};

export function HomePage({ onIdentifyClick }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title=""
        actions={<Button className="bg-primary hover:bg-primary/90">Nova Ligação</Button>}
      />

      {/* Conteúdo principal */}
      <main className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xl text-foreground mb-8">Painel de Atendimento</h2>

          <div className="flex items-center justify-center">
            <Card className="w-56 cursor-pointer hover:shadow-md transition-shadow" onClick={onIdentifyClick}>
              <CardContent className="p-6 flex flex-col items-center gap-3">

                <ImageWithFallback src="/build/assets/atend.png" alt="Painel de Atendimento" className="w-24 h-24" style={{ objectFit: 'contain' }} />
                <p className="text-sm text-muted-foreground">Identificar cliente</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

