// Catálogo de assets do Digibouquet (hospedados em assets.pauwee.com)

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

export const GREENS = ["fern", "eucalyptus", "leaves", "grass"] as const;
export type Green = (typeof GREENS)[number];

export const BUSHES = ["bush-1", "bush-2", "bush-3"] as const;
export type Bush = (typeof BUSHES)[number];

const BASE = "https://assets.pauwee.com";

export const flowerUrl = (name: string, mode: Mode) =>
  `${BASE}/${mode}/flowers/${name}.webp`;

export const greenUrl = (name: string, mode: Mode) =>
  `${BASE}/${mode}/greens/${name}.png`;

export const bushUrl = (name: string, mode: Mode) =>
  `${BASE}/${mode}/bush/${name}.png`;

export const bushTopUrl = (name: string, mode: Mode) =>
  `${BASE}/${mode}/bush/${name}-top.png`;

export const LOGO_URL = `${BASE}/other/digibouquet.png`;
export const HERO_PEONY = `${BASE}/color/flowers/peony.webp`;

// Posições determinísticas para layout do buquê
// Geramos com seed baseado no id pra ficar igual sempre que renderizar
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

export function computePlacements(flowers: string[], seed: string): Placement[] {
  const rand = seededRandom(seed);
  return flowers.map((_, i) => {
    // Distribui em uma "cabeça" de buquê arredondada
    const angle = (i / flowers.length) * Math.PI * 2;
    const radius = 70 + rand() * 40;
    const cx = 50 + Math.cos(angle) * (radius / 6);
    const cy = 38 + Math.sin(angle) * (radius / 8) - rand() * 6;
    return {
      leftPct: cx + (rand() - 0.5) * 8,
      topPct: cy + (rand() - 0.5) * 8,
      size: 90 + rand() * 50,
      rotate: (rand() - 0.5) * 30,
      z: i,
    };
  });
}
