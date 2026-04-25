import { Link } from "react-router-dom";
import { HERO_PEONY, LOGO_URL } from "@/lib/digibouquet";

const Index = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <img
        src={HERO_PEONY}
        alt="peony flower"
        className="mb-2 h-32 w-32 object-contain"
      />
      <img
        src={LOGO_URL}
        alt="digibouquet"
        className="mb-6 h-24 w-auto object-contain md:h-32"
      />

      <p className="mb-10 text-center font-mono text-sm uppercase tracking-wider text-foreground/80">
        beautiful flowers
        <br />
        delivered digitally
      </p>

      <div className="flex flex-col items-center gap-4">
        <Link to="/bouquet?mode=color" className="db-btn-solid">
          Build a bouquet
        </Link>
        <Link to="/bouquet?mode=mono" className="db-btn-outline">
          Build it in black and white
        </Link>
        <Link to="/garden" className="db-link mt-2">
          View garden
        </Link>
      </div>

      <p className="mt-16 font-mono text-xs uppercase tracking-wider text-foreground/40">
        made with love · inspired by{" "}
        <a
          href="https://digibouquet.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          digibouquet
        </a>
      </p>
    </main>
  );
};

export default Index;
