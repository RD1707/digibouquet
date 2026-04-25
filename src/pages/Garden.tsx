import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { BouquetRender } from "@/components/BouquetRender";
import { FavoriteButton, useFavorites } from "@/components/FavoriteButton";
import {
  isSupabaseConfigured,
  supabase,
  type BouquetRow,
} from "@/lib/supabase";

const Garden = () => {
  const [bouquets, setBouquets] = useState<BouquetRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const favs = useFavorites();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError(
        "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env para ver o jardim.",
      );
      setBouquets([]);
      return;
    }
    supabase
      .from("bouquets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setBouquets([]);
        } else {
          setBouquets((data ?? []) as BouquetRow[]);
        }
      });
  }, []);

  const visible = useMemo(() => {
    if (!bouquets) return null;
    if (!onlyFavs) return bouquets;
    return bouquets.filter((b) => favs.includes(b.id));
  }, [bouquets, onlyFavs, favs]);

  return (
    <main className="min-h-screen px-4 pb-16 sm:pb-20">
      <SiteHeader />

      <section className="mx-auto max-w-6xl">
        <h2 className="mb-2 text-center font-mono text-xs uppercase tracking-wider sm:text-sm">
          Nosso jardim
        </h2>
        <p className="mb-6 text-center font-mono text-[10px] text-foreground/60 sm:mb-8 sm:text-xs">
          Os buquês que você já fez
        </p>

        {bouquets && bouquets.length > 0 && (
          <div className="mb-8 flex justify-center gap-4 sm:mb-12 sm:gap-6">
            <button
              type="button"
              onClick={() => setOnlyFavs(false)}
              className={
                "font-mono text-[10px] uppercase tracking-wider underline-offset-4 sm:text-xs " +
                (!onlyFavs ? "text-foreground underline" : "text-foreground/50")
              }
            >
              todos
            </button>
            <button
              type="button"
              onClick={() => setOnlyFavs(true)}
              className={
                "font-mono text-[10px] uppercase tracking-wider underline-offset-4 sm:text-xs " +
                (onlyFavs ? "text-foreground underline" : "text-foreground/50")
              }
            >
              ♥ favoritos
            </button>
          </div>
        )}

        {error && (
          <p className="mb-8 text-center font-mono text-[10px] text-destructive sm:text-xs">
            {error}
          </p>
        )}

        {bouquets === null && (
          <p className="text-center font-mono text-[10px] text-foreground/50 sm:text-xs">
            carregando...
          </p>
        )}

        {visible && visible.length === 0 && !error && (
          <div className="text-center">
            <p className="mb-6 font-mono text-[10px] text-foreground/60 sm:text-xs">
              {onlyFavs
                ? "ainda não tem favoritos"
                : "ainda não tem buquês — plante o primeiro"}
            </p>
            {!onlyFavs && (
              <Link to="/buque?mode=color" className="db-btn-solid">
                Montar um buquê
              </Link>
            )}
          </div>
        )}

        {visible && visible.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
            {visible.map((b) => (
              <div key={b.id} className="flex flex-col items-center gap-3">
                <Link to={`/jardim/${b.id}`} className="block w-full">
                  <BouquetRender
                    flowers={b.flowers}
                    bush={b.bush}
                    mode={b.mode}
                    seed={b.id}
                    title={b.title}
                    showDate={new Date(b.created_at).toLocaleDateString("pt-BR")}
                  />
                </Link>
                <FavoriteButton id={b.id} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center sm:mt-16">
          <Link to="/" className="db-link">
            ← voltar pro início
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Garden;
