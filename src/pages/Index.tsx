import { Link } from "react-router-dom";
import { IntroAnimation } from "@/components/IntroAnimation";
import { DaysCounter } from "@/components/DaysCounter";
import { flowerUrl } from "@/lib/digibouquet";
import { SHOW_INTRO } from "@/lib/config";

const HERO_FLOWERS = [
  "rose",
  "peony",
  "tulip",
  "ranunculus",
  "daisy",
  "anemone",
  "dahlia",
] as const;

const Index = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:py-12">
      {SHOW_INTRO && <IntroAnimation />}

      <div className="mb-4 flex items-end justify-center gap-1 sm:mb-6 sm:gap-2">
        {HERO_FLOWERS.map((f, i) => {
          // tamanhos alternados pra dar movimento, peônia central maior
          const isCenter = i === Math.floor(HERO_FLOWERS.length / 2);
          const size = isCenter
            ? "h-20 w-20 sm:h-28 sm:w-28"
            : i % 2 === 0
              ? "h-14 w-14 sm:h-20 sm:w-20"
              : "h-16 w-16 sm:h-24 sm:w-24";
          // leve rotação radial pra parecer um buquezinho
          const center = (HERO_FLOWERS.length - 1) / 2;
          const rot = (i - center) * 8;
          const translateY = isCenter ? 0 : Math.abs(i - center) * 4;
          return (
            <img
              key={f}
              src={flowerUrl(f, "color")}
              alt={f}
              className={`${size} object-contain transition-transform duration-500`}
              style={{
                transform: `rotate(${rot}deg) translateY(${translateY}px)`,
              }}
            />
          );
        })}
      </div>

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
          feito com carinho por RD707
        </p>
      </div>
    </main>
  );
};

export default Index;
