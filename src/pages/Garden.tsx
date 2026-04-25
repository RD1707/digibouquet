import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { BouquetRender } from "@/components/BouquetRender";
import {
  isSupabaseConfigured,
  supabase,
  type BouquetRow,
} from "@/lib/supabase";

const Garden = () => {
  const [bouquets, setBouquets] = useState<BouquetRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="min-h-screen px-4 pb-20">
      <SiteHeader />

      <section className="mx-auto max-w-6xl">
        <h2 className="mb-2 text-center font-mono text-sm uppercase tracking-wider">
          Our garden
        </h2>
        <p className="mb-12 text-center font-mono text-xs text-foreground/60">
          A peek at the bouquets you've made
        </p>

        {error && (
          <p className="mb-8 text-center font-mono text-xs text-destructive">
            {error}
          </p>
        )}

        {bouquets === null && (
          <p className="text-center font-mono text-xs text-foreground/50">
            loading...
          </p>
        )}

        {bouquets && bouquets.length === 0 && !error && (
          <div className="text-center">
            <p className="mb-6 font-mono text-xs text-foreground/60">
              no bouquets yet — be the first to plant one
            </p>
            <Link to="/bouquet?mode=color" className="db-btn-solid">
              Build a bouquet
            </Link>
          </div>
        )}

        {bouquets && bouquets.length > 0 && (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {bouquets.map((b) => (
              <div key={b.id} className="flex flex-col items-center">
                <BouquetRender
                  flowers={b.flowers}
                  greens={b.greens}
                  bush={b.bush}
                  mode={b.mode}
                  seed={b.id}
                  showDate={new Date(b.created_at).toLocaleDateString("en-US")}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/" className="db-link">
            ← back home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Garden;
