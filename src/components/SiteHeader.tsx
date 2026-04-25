import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-center py-8">
      <Link to="/" aria-label="Início" className="text-center">
        <span
          className="block text-3xl italic md:text-4xl"
          style={{ fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive' }}
        >
          Florzinhas pra você
        </span>
      </Link>
    </header>
  );
}
