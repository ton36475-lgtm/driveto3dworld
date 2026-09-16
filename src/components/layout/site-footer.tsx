import { Link } from "@tanstack/react-router";
import { useCopy } from "@/lib/copy";

export function SiteFooter() {
  const copy = useCopy();

  return (
    <footer className="border-t border-line bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm tracking-[0.18em]">{copy.footer.wordmark}</p>
          <p className="mt-2 text-sm text-muted">{copy.footer.line}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <Link to="/work" className="hover:text-foreground">
            {copy.footer.work}
          </Link>
          <Link to="/gallery" className="hover:text-foreground">
            {copy.footer.gallery}
          </Link>
          <Link to="/drive" className="hover:text-foreground">
            {copy.footer.drive}
          </Link>
          <Link to="/foodtruck" className="hover:text-foreground">
            {copy.footer.foodtruck}
          </Link>
          <Link to="/studio" className="hover:text-foreground">
            {copy.footer.studio}
          </Link>
          <Link to="/contact" className="hover:text-foreground">
            {copy.footer.contact}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
