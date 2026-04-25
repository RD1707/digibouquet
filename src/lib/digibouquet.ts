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

// Distribui as flores em "cabeça" de buquê arredondada acima do bush
export function computePlacements(flowers: string[], seed: string): Placement[] {
  const rand = seededRandom(seed);
  const n = flowers.length;
  return flowers.map((_, i) => {
    const t = (i + 0.5) / n;
    const angle = t * Math.PI - Math.PI / 2; // -90° a +90°
    const rx = 32 + rand() * 6; // raio horizontal %
    const ry = 18 + rand() * 4; // raio vertical %
    const cx = 50 + Math.cos(angle) * rx;
    const cy = 38 + Math.sin(angle) * ry;
    return {
      leftPct: cx + (rand() - 0.5) * 6,
      topPct: cy + (rand() - 0.5) * 6,
      size: 80 + rand() * 50,
      rotate: (rand() - 0.5) * 30,
      z: i,
    };
  });
}
