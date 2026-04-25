import { Link } from "react-router-dom";
import { HERO_PEONY } from "@/lib/digibouquet";

const Index = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <img
        src={HERO_PEONY}
        alt="peônia"
        className="mb-4 h-32 w-32 object-contain"
      />

      <h1 className="mb-2 text-center text-5xl text-foreground md:text-6xl"
          style={{ fontFamily: '"Lobster", cursive' }}>
        Florzinhas pra você
      </h1>
      <p className="mb-10 mt-4 text-center font-mono text-sm uppercase tracking-wider text-foreground/80">
        flores lindas
        <br />
        feitas com amor
      </p>

      <div className="flex flex-col items-center gap-4">
        <Link to="/buque?modo=cor" className="db-btn-solid">
          Montar um buquê
        </Link>
        <Link to="/buque?modo=mono" className="db-btn-outline">
          Em preto e branco
        </Link>
        <Link to="/jardim" className="db-link mt-2">
          Ver o jardim
        </Link>
      </div>

      <p className="mt-16 text-center font-mono text-xs uppercase tracking-wider text-foreground/40">
        feito com carinho
      </p>
    </main>
  );
};

export default Index;
