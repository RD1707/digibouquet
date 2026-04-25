import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { downloadBouquetPng } from "@/lib/downloadBouquet";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { BouquetRender } from "@/components/BouquetRender";
import {
  FLOWERS,
  FLOWER_LABELS,
  bushUrl,
  bushesFor,
  flowerUrl,
  randomBouquet,
  type Flower,
  type Mode,
} from "@/lib/digibouquet";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Step = "flowers" | "bush" | "preview";

const MIN_FLOWERS = 6;
const MAX_FLOWERS = 10;

const Bouquet = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode: Mode = params.get("mode") === "mono" ? "mono" : "color";
  const bushOptions = bushesFor(mode);
  const surprise = params.get("surprise") === "1";

  const [step, setStep] = useState<Step>("flowers");
  const [flowers, setFlowers] = useState<string[]>([]);
  const [bush, setBush] = useState<string>(bushOptions[0]);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Modo surpresa: gera buquê aleatório e pula direto pro preview
  useEffect(() => {
    if (!surprise) return;
    const r = randomBouquet(mode);
    setFlowers(r.flowers);
    setBush(r.bush);
    setStep("preview");
    // limpa o param sem reload
    const url = new URL(window.location.href);
    url.searchParams.delete("surprise");
    window.history.replaceState({}, "", url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seed = useMemo(
    () => `${mode}-${flowers.join(",")}-${bush}`,
    [mode, flowers, bush],
  );

  const today = new Date().toLocaleDateString("pt-BR");

  const addFlower = (f: string) => {
    if (flowers.length >= MAX_FLOWERS) return;
    setFlowers((arr) => [...arr, f]);
  };
  const removeLastOf = (f: string) => {
    setFlowers((arr) => {
      const idx = arr.lastIndexOf(f);
      if (idx === -1) return arr;
      const next = [...arr];
      next.splice(idx, 1);
      return next;
    });
  };

  const canNextFromFlowers = flowers.length >= MIN_FLOWERS;

  const reroll = () => {
    const r = randomBouquet(mode);
    setFlowers(r.flowers);
    setBush(r.bush);
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
      toast.error(
        "Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env",
      );
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("bouquets").insert({
      mode,
      flowers,
      greens: [],
      bush,
      title: title.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Buquê plantado no jardim");
    navigate("/jardim");
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const t = toast.loading("Preparando imagem...");
    try {
      await downloadBouquetPng(previewRef.current);
      toast.success("Buquê baixado", { id: t });
    } catch (e) {
      toast.error("Erro ao gerar imagem", { id: t });
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen px-4 pb-16 sm:pb-20">
      <SiteHeader />

      {step === "flowers" && (
        <section className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center font-mono text-xs uppercase tracking-wider sm:text-sm">
            Escolha de {MIN_FLOWERS} a {MAX_FLOWERS} flores
          </h2>
          <p className="mb-6 text-center font-mono text-[10px] text-foreground/60 sm:mb-8 sm:text-xs">
            toque pra adicionar · toque longo/clique direito remove · {flowers.length}/
            {MAX_FLOWERS}
          </p>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6">
            {FLOWERS.map((f) => {
              const count = flowers.filter((x) => x === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => addFlower(f)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    removeLastOf(f);
                  }}
                  disabled={flowers.length >= MAX_FLOWERS && count === 0}
                  className="group relative aspect-square touch-manipulation transition-transform active:scale-95 hover:scale-110 disabled:opacity-40 disabled:hover:scale-100"
                  aria-label={`Adicionar ${FLOWER_LABELS[f as Flower]}`}
                  title={FLOWER_LABELS[f as Flower]}
                >
                  <img
                    src={flowerUrl(f, mode)}
                    alt={FLOWER_LABELS[f as Flower]}
                    className="h-full w-full object-contain"
                  />
                  {count > 0 && (
                    <span className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-foreground font-mono text-xs text-background">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 sm:mt-6 sm:flex-row sm:justify-center sm:gap-6">
            {flowers.length > 0 && (
              <button
                type="button"
                onClick={() => setFlowers([])}
                className="font-mono text-[10px] uppercase text-foreground/50 underline underline-offset-4 sm:text-xs"
              >
                limpar tudo
              </button>
            )}
            <button
              type="button"
              onClick={reroll}
              className="font-mono text-[10px] uppercase text-foreground/50 underline underline-offset-4 sm:text-xs"
            >
              modo surpresa
            </button>
          </div>

          <div className="mt-10 flex justify-center sm:mt-12">
            <button
              type="button"
              className="db-btn-solid w-full max-w-xs sm:w-auto"
              disabled={!canNextFromFlowers}
              onClick={() => setStep("bush")}
            >
              Próximo
            </button>
          </div>
        </section>
      )}

      {step === "bush" && (
        <section className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center font-mono text-xs uppercase tracking-wider sm:text-sm">
            Escolha a folhagem
          </h2>
          <p className="mb-6 text-center font-mono text-[10px] text-foreground/60 sm:mb-8 sm:text-xs">
            a base verde do seu buquê
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {bushOptions.map((b, i) => {
              const active = bush === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBush(b)}
                  className={
                    "border p-3 transition-all sm:p-4 " +
                    (active
                      ? "border-foreground bg-foreground/5"
                      : "border-transparent hover:border-foreground/40")
                  }
                >
                  <img
                    src={bushUrl(b, mode)}
                    alt={`folhagem ${i + 1}`}
                    className="aspect-square w-full object-contain"
                  />
                  <span className="mt-2 block text-center font-mono text-[10px] uppercase sm:text-xs">
                    folhagem {i + 1}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col-reverse justify-center gap-3 sm:mt-12 sm:flex-row">
            <button
              type="button"
              className="db-btn-outline"
              onClick={() => setStep("flowers")}
            >
              Voltar
            </button>
            <button
              type="button"
              className="db-btn-solid"
              onClick={() => setStep("preview")}
            >
              Próximo
            </button>
          </div>
        </section>
      )}

      {step === "preview" && (
        <section className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center font-mono text-xs uppercase tracking-wider sm:mb-8 sm:text-sm">
            Seu buquê
          </h2>

          <div className="bg-background p-2 sm:p-4">
            <BouquetRender
              ref={previewRef}
              flowers={flowers}
              bush={bush}
              mode={mode}
              seed={seed}
              showDate={today}
              title={title.trim() || null}
            />
          </div>

          <div className="mx-auto mt-6 max-w-sm">
            <label className="mb-2 block text-center font-mono text-[10px] uppercase tracking-wider text-foreground/60 sm:text-xs">
              Título (opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 40))}
              placeholder="ex: 1 ano juntos"
              maxLength={40}
              className="w-full border border-foreground/20 bg-transparent px-3 py-2 text-center font-mono text-xs uppercase tracking-wider focus:border-foreground focus:outline-none"
            />
          </div>

          <div className="mt-10 flex flex-col flex-wrap justify-center gap-3 sm:mt-12 sm:flex-row">
            <button
              type="button"
              className="db-btn-outline"
              onClick={() => setStep("bush")}
            >
              Voltar
            </button>
            <button
              type="button"
              className="db-btn-outline"
              onClick={reroll}
            >
              Surpresa
            </button>
            <button
              type="button"
              className="db-btn-outline"
              onClick={handleDownload}
            >
              Baixar
            </button>
            <button
              type="button"
              className="db-btn-solid"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Plantando..." : "Plantar no jardim"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="db-link">
              Recomeçar
            </Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default Bouquet;
