import { Link, useLocation } from "react-router-dom";
import { Flower2, Sprout, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavHud() {
  const { pathname } = useLocation();

  const items = [
    { to: "/", label: "Início", icon: Home, match: (p: string) => p === "/" },
    {
      to: "/buque?mode=color",
      label: "Montar buquê",
      icon: Flower2,
      match: (p: string) => p.startsWith("/buque") || p.startsWith("/bouquet"),
    },
    {
      to: "/jardim",
      label: "Jardim",
      icon: Sprout,
      match: (p: string) => p.startsWith("/jardim") || p.startsWith("/garden"),
    },
  ];

  return (
    <nav
      className="fixed left-1/2 top-3 z-50 -translate-x-1/2 sm:top-5"
      aria-label="Navegação principal"
    >
      <ul className="flex items-center gap-1 rounded-full border border-foreground/15 bg-background/80 px-1.5 py-1.5 shadow-[0_4px_20px_-8px_hsl(var(--foreground)/0.25)] backdrop-blur-md sm:gap-2 sm:px-2 sm:py-2">
        {items.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-all sm:px-4 sm:text-xs",
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
