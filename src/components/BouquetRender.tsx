import { forwardRef, useMemo } from "react";
import {
  bushUrl,
  bushTopUrl,
  computePlacements,
  flowerUrl,
  type Mode,
} from "@/lib/digibouquet";

interface Props {
  flowers: string[];
  bush: string;
  mode: Mode;
  seed: string;
  className?: string;
  showDate?: string | null;
  title?: string | null;
}

export const BouquetRender = forwardRef<HTMLDivElement, Props>(
  function BouquetRender(
    { flowers, bush, mode, seed, className, showDate, title },
    ref,
  ) {
    const placements = useMemo(
      () => computePlacements(flowers, seed, bush),
      [flowers, seed, bush],
    );

    return (
      <div
        ref={ref}
        className={
          "relative mx-auto aspect-square w-full max-w-[460px] " +
          (className ?? "")
        }
      >
        {/* Bush base (já contém as folhagens) */}
        <img
          src={bushUrl(bush, mode)}
          alt=""
          data-bouquet-img="bush"
          className="absolute inset-0 h-full w-full select-none object-contain"
          draggable={false}
        />

        {/* Flores */}
        {flowers.map((f, i) => {
          const p = placements[i];
          return (
            <img
              key={`${f}-${i}`}
              src={flowerUrl(f, mode)}
              alt={f}
              data-bouquet-img="flower"
              draggable={false}
              className="pointer-events-none absolute select-none"
              style={{
                left: `${p.leftPct}%`,
                top: `${p.topPct}%`,
                width: `${p.sizePct}%`,
                transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
                zIndex: 10 + p.z,
              }}
            />
          );
        })}

        {/* Bush topo (folhas que ficam por cima das flores) */}
        <img
          src={bushTopUrl(bush, mode)}
          alt=""
          data-bouquet-img="bush-top"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
          style={{ zIndex: 100 }}
          draggable={false}
        />

        {title && (
          <div
            className="absolute bottom-2 left-2 max-w-[60%] truncate font-mono text-[10px] uppercase tracking-wider text-foreground/70 sm:text-xs"
            style={{ zIndex: 200 }}
          >
            {title}
          </div>
        )}

        {showDate && (
          <div
            className="absolute bottom-2 right-2 font-mono text-[10px] text-foreground/60 sm:text-xs"
            style={{ zIndex: 200 }}
          >
            {showDate}
          </div>
        )}
      </div>
    );
  },
);
