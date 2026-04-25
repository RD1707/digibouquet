// Catálogo de assets do MeuJardim (hospedados em assets.pauwee.com)
// As folhagens (greens) já fazem parte das imagens de bush + bush-top.

export type Mode = "color" | "mono";

export const FLOWERS = [
  "orchid",
  "tulip",
  "dahlia",
  "anemone",
  "carnation",
  "zinnia",
  "ranunculus",
  "sunflower",
  "lily",
  "daisy",
  "peony",
  "rose",
] as const;

export type Flower = (typeof FLOWERS)[number];

// Nomes em português para a UI
export const FLOWER_LABELS: Record<Flower, string> = {
  orchid: "orquídea",
  tulip: "tulipa",
  dahlia: "dália",
  anemone: "anêmona",
  carnation: "cravo",
  zinnia: "zínia",
  ranunculus: "ranúnculo",
  sunflower: "girassol",
  lily: "lírio",
  daisy: "margarida",
  peony: "peônia",
  rose: "rosa",
};

// Modo cor tem 3 bases, mono tem 1 disponível
export const BUSHES_COLOR = ["bush-1", "bush-2", "bush-3"] as const;
export const BUSHES_MONO = ["bush-3"] as const;
export type Bush = (typeof BUSHES_COLOR)[number];

const BASE = "https://assets.pauwee.com";

export const flowerUrl = (name: string, mode: Mode) =>
  `${BASE}/${mode}/flowers/${name}.webp`;

export const bushUrl = (name: string, mode: Mode) =>
  `${BASE}/${mode}/bush/${name}.png`;

export const bushTopUrl = (name: string, mode: Mode) =>
  `${BASE}/${mode}/bush/${name}-top.png`;

export const LOGO_URL = `${BASE}/other/digibouquet.png`;
export const HERO_PEONY = `${BASE}/color/flowers/peony.webp`;

export function bushesFor(mode: Mode): readonly string[] {
  return mode === "mono" ? BUSHES_MONO : BUSHES_COLOR;
}

// Posições determinísticas para layout do buquê (seed por id/conteúdo)
export function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Placement = {
  leftPct: number;
  topPct: number;
  size: number; // px
  rotate: number; // deg
  z: number;
};

// Distribui as flores em formato de cabeça de buquê arredondada acima do bush.
// Usamos múltiplas camadas (anéis) para criar densidade e profundidade,
// alternando flores grandes ao centro/baixo e menores nas bordas/cima.
export function computePlacements(flowers: string[], seed: string): Placement[] {
  const rand = seededRandom(seed);
  const n = flowers.length;

  // Centro do buquê (em % do container) — um pouco acima do meio
  const cx = 50;
  const cy = 36;

  // Distribuição em camadas concêntricas: 1 flor central + anéis
  // Definimos quantas flores cabem por camada
  const layers: number[] = [];
  let remaining = n;
  // Camada 0 (centro): 1 flor (se houver pelo menos 4 no total)
  if (n >= 4) {
    layers.push(1);
    remaining -= 1;
  }
  // Camada 1 (interna): até 5
  const inner = Math.min(remaining, Math.max(3, Math.ceil(n * 0.4)));
  layers.push(inner);
  remaining -= inner;
  // Camada 2 (externa): o restante
  if (remaining > 0) layers.push(remaining);

  const placements: Placement[] = [];
  let idx = 0;

  layers.forEach((count, layer) => {
    // Raios crescentes por camada (em % do container)
    const baseRx = layer === 0 ? 0 : layer === 1 ? 18 : 32;
    const baseRy = layer === 0 ? 0 : layer === 1 ? 12 : 20;
    // Tamanho: centro maior, externos menores para dar perspectiva
    const baseSize = layer === 0 ? 150 : layer === 1 ? 130 : 110;

    for (let k = 0; k < count; k++) {
      let leftPct: number;
      let topPct: number;
      if (layer === 0) {
        leftPct = cx + (rand() - 0.5) * 4;
        topPct = cy + (rand() - 0.5) * 4;
      } else {
        // Ângulo em arco superior (-110° a +110°) para formato de cúpula
        const t = count === 1 ? 0.5 : k / (count - 1);
        const angle = (t - 0.5) * Math.PI * 1.22 - Math.PI / 2;
        const rx = baseRx + rand() * 4;
        const ry = baseRy + rand() * 3;
        leftPct = cx + Math.cos(angle) * rx + (rand() - 0.5) * 3;
        topPct = cy + Math.sin(angle) * ry + (rand() - 0.5) * 3;
      }

      placements.push({
        leftPct,
        topPct,
        size: baseSize + (rand() - 0.5) * 20,
        rotate: (rand() - 0.5) * 36,
        // Camadas mais externas atrás, centro na frente
        z: (2 - layer) * 10 + idx,
      });
      idx++;
    }
  });

  return placements;
}
