import { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">F</span>
          </div>
          <span className="text-2xl font-bold text-foreground">Flunx</span>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Flunx. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
