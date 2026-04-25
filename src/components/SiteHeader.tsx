import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="relative flex items-center justify-center py-6 sm:py-8">
      <Link
        to="/"
        aria-label="Voltar para o início"
        className="group absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full border border-foreground/20 bg-background/70 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground/70 backdrop-blur-sm transition-all hover:border-foreground hover:bg-foreground hover:text-background sm:px-4 sm:text-xs"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
        <span className="hidden sm:inline">Voltar</span>
      </Link>

      <Link to="/" aria-label="Início" className="text-center">
        <span
          className="block text-2xl sm:text-3xl md:text-4xl"
          style={{ fontFamily: '"Lobster", cursive' }}
        >
          Florzinhas pra você
        </span>
      </Link>
    </header>
  );
}
