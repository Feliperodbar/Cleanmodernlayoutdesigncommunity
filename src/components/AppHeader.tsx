import { ReactNode } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  center?: ReactNode;
  actions?: ReactNode;
  onLogoClick?: () => void;
};

export function AppHeader({ title, subtitle, center, actions, onLogoClick }: AppHeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-md hover:bg-secondary/10" onClick={onLogoClick}>
            <ImageWithFallback src="/build/assets/neologo.png" alt="Neoenergia" className="h-10 w-auto p-1" style={{ objectFit: "contain" }} />
          </button>
          <div>
            {title && <h1 className="text-foreground">{title}</h1>}
          </div>
        </div>
        {center && <div className="flex-1 max-w-xl mx-8">{center}</div>}
        <div className="flex items-center gap-3">{actions}</div>
      </div>
    </header>
  );
}
