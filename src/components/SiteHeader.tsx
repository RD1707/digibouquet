import { Link } from "react-router-dom";
import { LOGO_URL } from "@/lib/digibouquet";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-center py-8">
      <Link to="/" aria-label="Home">
        <img
          src={LOGO_URL}
          alt="digibouquet"
          className="h-12 w-auto object-contain md:h-16"
        />
      </Link>
    </header>
  );
}
