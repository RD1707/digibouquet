import { useEffect, useState } from "react";

const STORAGE_KEY = "florzinhas-favorites";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function getFavorites(): string[] {
  return readFavorites();
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    setFavs(readFavorites());
  }, []);
  return favs;
}

export function FavoriteButton({ id }: { id: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readFavorites().includes(id));
  }, [id]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const list = readFavorites();
    const next = list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setActive(next.includes(id));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={active ? "remover dos favoritos" : "Favoritar"}
      className="font-mono text-xs uppercase tracking-wider text-foreground/60 transition-colors hover:text-foreground"
    >
      {active ? "♥ favorito" : "♡ favoritar"}
    </button>
  );
}
