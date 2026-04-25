import { RELATIONSHIP_START } from "@/lib/config";

export function DaysCounter() {
  if (!RELATIONSHIP_START) return null;
  const start = new Date(RELATIONSHIP_START);
  if (Number.isNaN(start.getTime())) return null;
  const days = Math.floor((Date.now() - start.getTime()) / 86400000);
  if (days < 0) return null;

  return (
    <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 sm:text-xs">
      {days} dias juntos
    </p>
  );
}
