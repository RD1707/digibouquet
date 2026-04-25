import { Link } from "react-router-dom";
import { IntroAnimation } from "@/components/IntroAnimation";
import { DaysCounter } from "@/components/DaysCounter";
import { HERO_PEONY } from "@/lib/digibouquet";
import { SHOW_INTRO } from "@/lib/config";

const Index = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 pb-10 pt-24 sm:pb-12 sm:pt-28">
      {SHOW_INTRO && <IntroAnimation />}

      <img
        src={HERO_PEONY}
        alt="peônia"
        className="mb-2 h-24 w-24 object-contain sm:mb-4 sm:h-32 sm:w-32"
      />

      <h1
        className="mb-2 text-center text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        style={{ fontFamily: '"Lobster", cursive' }}
      >
        Florzinhas pra você
      </h1>
      <p className="mb-8 mt-3 text-center font-mono text-xs uppercase tracking-wider text-foreground/80 sm:mb-10 sm:mt-4 sm:text-sm">
        flores lindas
        <br />
        feitas com amor
      </p>

      <div className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
        <Link to="/buque?mode=color" className="db-btn-solid w-full sm:w-auto">
          Montar um buquê
        </Link>
        <Link to="/buque?mode=mono" className="db-btn-outline w-full sm:w-auto">
          Em preto e branco
        </Link>
      </div>
      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
        <Link to="/buque?mode=color&surprise=1" className="db-link">
          Modo surpresa
        </Link>
        <Link to="/jardim" className="db-link">
          Ver o jardim
        </Link>
      </div>

      <div className="mt-12 sm:mt-16">
        <DaysCounter />
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-foreground/40 sm:text-xs">
          feito com carinho
        </p>
      </div>
    </main>
  );
};

export default Index;
