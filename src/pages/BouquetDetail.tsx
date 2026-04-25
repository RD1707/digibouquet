import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { BouquetRender } from "@/components/BouquetRender";
import { FavoriteButton } from "@/components/FavoriteButton";
import { downloadBouquetPng } from "@/lib/downloadBouquet";
import {
  isSupabaseConfigured,
  supabase,
  type BouquetRow,
} from "@/lib/supabase";

const BouquetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [bouquet, setBouquet] = useState<BouquetRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !id) {
      setError("Buquê não encontrado.");
      return;
    }
    supabase
      .from("bouquets")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (!data) setError("Buquê não encontrado.");
        else setBouquet(data as BouquetRow);
      });
  }, [id]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Florzinhas pra você", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado");
      }
    } catch {
      // usuário cancelou
    }
  };

  const handleDownload = async () => {
    if (!ref.current) return;
    const t = toast.loading("Preparando imagem...");
    try {
      await downloadBouquetPng(ref.current);
      toast.success("Buquê baixado", { id: t });
    } catch (e) {
      toast.error("Erro ao gerar imagem", { id: t });
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen px-4 pb-16 sm:pb-20">
      <SiteHeader />

      <section className="mx-auto max-w-2xl">
        {error && (
          <p className="mb-6 text-center font-mono text-xs text-destructive">
            {error}
          </p>
        )}

        {bouquet && (
          <>
            {bouquet.title && (
              <h2
                className="mb-6 text-center text-3xl text-foreground sm:text-4xl md:text-5xl"
                style={{ fontFamily: '"Lobster", cursive' }}
              >
                {bouquet.title}
              </h2>
            )}

            <div className="bg-background p-2 sm:p-4">
              <BouquetRender
                ref={ref}
                flowers={bouquet.flowers}
                bush={bouquet.bush}
                mode={bouquet.mode}
                seed={bouquet.id}
                showDate={new Date(bouquet.created_at).toLocaleDateString("pt-BR")}
                title={bouquet.title}
              />
            </div>

            <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
              <FavoriteButton id={bouquet.id} />
              <button type="button" className="db-btn-outline" onClick={share}>
                Compartilhar
              </button>
              <button
                type="button"
                className="db-btn-outline"
                onClick={handleDownload}
              >
                Baixar
              </button>
            </div>
          </>
        )}

        <div className="mt-12 text-center">
          <Link to="/jardim" className="db-link">
            ← voltar pro jardim
          </Link>
        </div>
      </section>
    </main>
  );
};

export default BouquetDetail;
