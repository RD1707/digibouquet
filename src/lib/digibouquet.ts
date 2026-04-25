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
  sizePct: number; 
  rotate: number;  
  z: number;
};

export function computePlacements(flowers: string[], seed: string, bush?: string): Placement[] {
  const rand = seededRandom(seed);
  const n = flowers.length;

  const cx = 50;
  let cy = 38;

  if (bush === "bush-1" || bush === "bush-3") {
    cy = 66;
  }

  type Layer = { count: number; rPct: number; size: number; z: number };
  const layers: Layer[] = [];

  if (n <= 6) {
    layers.push({ count: 1, rPct: 0,  size: 36, z: 30 });
    const mid = Math.min(n - 1, 5);
    if (mid > 0) layers.push({ count: mid, rPct: 17, size: 30, z: 20 });
    const out = n - 1 - mid;
    if (out > 0) layers.push({ count: out, rPct: 28, size: 24, z: 10 });
  } else if (n <= 8) {
    layers.push({ count: 1, rPct: 0,  size: 34, z: 30 });
    layers.push({ count: 4, rPct: 16, size: 29, z: 20 });
    layers.push({ count: n - 5, rPct: 27, size: 23, z: 10 });
  } else {
    // 9 ou 10
    layers.push({ count: 1, rPct: 0,  size: 32, z: 30 });
    layers.push({ count: 5, rPct: 16, size: 28, z: 20 });
    layers.push({ count: n - 6, rPct: 27, size: 22, z: 10 });
  }

  const placements: Placement[] = [];
  let idx = 0;

  layers.forEach((layer) => {
    const { count, rPct, size, z } = layer;

    for (let k = 0; k < count; k++) {
      let leftPct: number;
      let topPct: number;
      let radialAngle = 0;

      if (rPct === 0) {
        // Centro
        leftPct = cx + (rand() - 0.5) * 2;
        topPct = cy + (rand() - 0.5) * 2;
      } else {
        const t = count === 1 ? 0.5 : k / (count - 1);
        const tj = t + (rand() - 0.5) * 0.04;
        const angle = (tj - 0.5) * Math.PI * 1.15 - Math.PI / 2;
        radialAngle = angle;

        const rxPct = rPct * 1.05 + (rand() - 0.5) * 2;
        const ryPct = rPct * 0.78 + (rand() - 0.5) * 1.5;

        leftPct = cx + Math.cos(angle) * rxPct;
        topPct = cy + Math.sin(angle) * ryPct;

        const dome = Math.abs(Math.cos(angle)) * 3;
        topPct += dome;
      }

      const radialTilt =
        rPct === 0 ? 0 : (radialAngle + Math.PI / 2) * (180 / Math.PI) * 0.35;
      const rotate = radialTilt + (rand() - 0.5) * 14;

      placements.push({
        leftPct,
        topPct,
        sizePct: size + (rand() - 0.5) * 3,
        rotate,
        z: z + idx,
      });
      idx++;
    }
  });

  return placements;
}

export function randomBouquet(mode: Mode): { flowers: string[]; bush: string } {
  const bushes = bushesFor(mode);
  const count = 6 + Math.floor(Math.random() * 5); 
  const flowers: string[] = [];
  for (let i = 0; i < count; i++) {
    flowers.push(FLOWERS[Math.floor(Math.random() * FLOWERS.length)]);
  }
  const bush = bushes[Math.floor(Math.random() * bushes.length)];
  return { flowers, bush };
}
