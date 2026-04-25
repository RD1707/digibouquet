import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-center pb-6 pt-20 sm:pb-8 sm:pt-24">
      <Link to="/" aria-label="Início" className="text-center">
        <span
          className="block text-2xl sm:text-3xl md:text-4xl"
          style={{ fontFamily: '"Lobster", cursive' }}
        >
          Florzinhas pra você
        </span>
      </Link>
    </header>
  );
}
