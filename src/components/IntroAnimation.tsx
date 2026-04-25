import { useEffect, useState } from "react";
import { RECIPIENT_NAME } from "@/lib/config";

const STORAGE_KEY = "florzinhas-intro-seen";

export function IntroAnimation() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
    sessionStorage.setItem(STORAGE_KEY, "1");

    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => setVisible(false), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className="fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center bg-background transition-opacity duration-700"
      style={{ opacity: phase === 2 ? 0 : 1 }}
    >
      <div className="px-6 text-center">
        <p
          className="text-3xl text-foreground transition-all duration-700 sm:text-5xl md:text-6xl"
          style={{
            fontFamily: '"Lobster", cursive',
            opacity: phase >= 0 ? 1 : 0,
            transform: phase >= 1 ? "translateY(-8px)" : "translateY(0)",
          }}
        >
          Para {RECIPIENT_NAME}
        </p>
        <p
          className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-foreground/60 transition-opacity duration-700 sm:text-sm"
          style={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          com todo o carinho
        </p>
      </div>
    </div>
  );
}
