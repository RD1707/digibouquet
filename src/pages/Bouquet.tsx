import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { BouquetRender } from "@/components/BouquetRender";
import {
  BUSHES,
  FLOWERS,
  GREENS,
  bushUrl,
  flowerUrl,
  greenUrl,
  type Mode,
} from "@/lib/digibouquet";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Step = "flowers" | "greens" | "bush" | "preview";

const MIN_FLOWERS = 6;
const MAX_FLOWERS = 10;

const Bouquet = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode: Mode = params.get("mode") === "mono" ? "mono" : "color";

  const [step, setStep] = useState<Step>("flowers");
  const [flowers, setFlowers] = useState<string[]>([]);
  const [greens, setGreens] = useState<string[]>([]);
  const [bush, setBush] = useState<string>(BUSHES[0]);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const seed = useMemo(
    () => `${mode}-${flowers.join(",")}-${bush}`,
    [mode, flowers, bush],
  );

  const today = new Date().toLocaleDateString("en-US");

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
  const toggleGreen = (g: string) =>
    setGreens((arr) =>
      arr.includes(g) ? arr.filter((x) => x !== g) : [...arr, g],
    );

  const canNextFromFlowers = flowers.length >= MIN_FLOWERS;

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
      greens,
      bush,
    });
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Buquê salvo no jardim 🌸");
    navigate("/garden");
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: "#fcfbf8",
        useCORS: true,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `digibouquet-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      toast.error("Erro ao gerar imagem");
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen px-4 pb-20">
      <SiteHeader />

      {step === "flowers" && (
        <section className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center font-mono text-sm uppercase tracking-wider">
            Pick {MIN_FLOWERS} to {MAX_FLOWERS} blooms
          </h2>
          <p className="mb-8 text-center font-mono text-xs text-foreground/60">
            click to add · click again to add more · {flowers.length}/{MAX_FLOWERS}
          </p>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
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
                  disabled={flowers.length >= MAX_FLOWERS}
                  className="group relative aspect-square transition-transform hover:scale-110 disabled:opacity-40 disabled:hover:scale-100"
                  aria-label={`Add ${f}`}
                >
                  <img
                    src={flowerUrl(f, mode)}
                    alt={f}
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

          {flowers.length > 0 && (
            <button
              type="button"
              onClick={() => setFlowers([])}
              className="mx-auto mt-6 block font-mono text-xs uppercase text-foreground/50 underline underline-offset-4"
            >
              clear all
            </button>
          )}

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              className="db-btn-solid"
              disabled={!canNextFromFlowers}
              onClick={() => setStep("greens")}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === "greens" && (
        <section className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center font-mono text-sm uppercase tracking-wider">
            Pick your greens
          </h2>
          <p className="mb-8 text-center font-mono text-xs text-foreground/60">
            optional · select any
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GREENS.map((g) => {
              const active = greens.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGreen(g)}
                  className={
                    "aspect-square border p-4 transition-all " +
                    (active
                      ? "border-foreground bg-foreground/5 scale-105"
                      : "border-transparent hover:border-foreground/40")
                  }
                >
                  <img
                    src={greenUrl(g, mode)}
                    alt={g}
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")
                    }
                    className="h-full w-full object-contain"
                  />
                  <span className="mt-1 block text-center font-mono text-[10px] uppercase">
                    {g}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center gap-3">
            <button
              type="button"
              className="db-btn-outline"
              onClick={() => setStep("flowers")}
            >
              Back
            </button>
            <button
              type="button"
              className="db-btn-solid"
              onClick={() => setStep("bush")}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === "bush" && (
        <section className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-mono text-sm uppercase tracking-wider">
            Pick a base
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BUSHES.map((b) => {
              const active = bush === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBush(b)}
                  className={
                    "border p-4 transition-all " +
                    (active
                      ? "border-foreground bg-foreground/5"
                      : "border-transparent hover:border-foreground/40")
                  }
                >
                  <img
                    src={bushUrl(b, mode)}
                    alt={b}
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")
                    }
                    className="aspect-square w-full object-contain"
                  />
                  <span className="mt-2 block text-center font-mono text-xs uppercase">
                    {b}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center gap-3">
            <button
              type="button"
              className="db-btn-outline"
              onClick={() => setStep("greens")}
            >
              Back
            </button>
            <button
              type="button"
              className="db-btn-solid"
              onClick={() => setStep("preview")}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === "preview" && (
        <section className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center font-mono text-sm uppercase tracking-wider">
            Your bouquet
          </h2>

          <div ref={previewRef} className="bg-background p-4">
            <BouquetRender
              flowers={flowers}
              greens={greens}
              bush={bush}
              mode={mode}
              seed={seed}
              showDate={today}
            />
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="db-btn-outline"
              onClick={() => setStep("bush")}
            >
              Back
            </button>
            <button
              type="button"
              className="db-btn-outline"
              onClick={handleDownload}
            >
              Download
            </button>
            <button
              type="button"
              className="db-btn-solid"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add to garden"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="db-link">
              Start over
            </Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default Bouquet;
