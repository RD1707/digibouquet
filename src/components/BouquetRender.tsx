import { useMemo } from "react";
import {
  bushUrl,
  bushTopUrl,
  computePlacements,
  flowerUrl,
  greenUrl,
  type Mode,
} from "@/lib/digibouquet";

interface Props {
  flowers: string[];
  greens: string[];
  bush: string;
  mode: Mode;
  seed: string;
  className?: string;
  showDate?: string | null;
}

export function BouquetRender({
  flowers,
  greens,
  bush,
  mode,
  seed,
  className,
  showDate,
}: Props) {
  const placements = useMemo(
    () => computePlacements(flowers, seed),
    [flowers, seed],
  );

  return (
    <div
      className={
        "relative mx-auto aspect-square w-full max-w-[420px] " + (className ?? "")
      }
    >
      {/* Bush base */}
      <img
        src={bushUrl(bush, mode)}
        alt=""
        crossOrigin="anonymous"
        className="absolute inset-x-0 bottom-0 mx-auto w-full select-none"
        draggable={false}
      />

      {/* Greens espalhados */}
      {greens.map((g, i) => (
        <img
          key={`${g}-${i}`}
          src={greenUrl(g, mode)}
          alt=""
          crossOrigin="anonymous"
          draggable={false}
          className="pointer-events-none absolute select-none"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 2) * 8}%`,
            width: "55%",
            transform: `rotate(${(i - greens.length / 2) * 12}deg)`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Flores */}
      {flowers.map((f, i) => {
        const p = placements[i];
        return (
          <img
            key={`${f}-${i}`}
            src={flowerUrl(f, mode)}
            alt={f}
            crossOrigin="anonymous"
            draggable={false}
            className="pointer-events-none absolute select-none"
            style={{
              left: `${p.leftPct}%`,
              top: `${p.topPct}%`,
              width: `${p.size}px`,
              transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
              zIndex: 10 + p.z,
            }}
          />
        );
      })}

      {/* Bush topo (folhas que ficam por cima) */}
      <img
        src={bushTopUrl(bush, mode)}
        alt=""
        crossOrigin="anonymous"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-full select-none"
        style={{ zIndex: 100 }}
        draggable={false}
      />

      {showDate && (
        <div className="absolute bottom-2 right-2 font-mono text-xs text-foreground/60">
          {showDate}
        </div>
      )}
    </div>
  );
}
