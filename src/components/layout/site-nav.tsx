import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/copy";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/work", key: "work" as const },
  { to: "/gallery", key: "gallery" as const },
  { to: "/drive", key: "drive" as const },
  { to: "/studio", key: "studio" as const },
  { to: "/contact", key: "contact" as const },
];

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const copy = useCopy();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, lang]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-200",
        transparent
          ? "bg-background/20"
          : "border-b border-line/80 bg-background/85",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="font-display text-sm tracking-[0.18em] text-foreground"
        >
          SIRAWAT × BALL
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active =
              link.to === "/work"
                ? pathname.startsWith("/work")
                : pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "inline-flex h-11 items-center px-3 text-sm transition-colors duration-150",
                  active ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {copy.nav[link.key]}
              </Link>
            );
          })}
          <LangToggle lang={lang} setLang={setLang} />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <LangToggle lang={lang} setLang={setLang} />
          <Button
            variant="ghost"
            size="sm"
            className="size-11 px-0"
            aria-label={open ? copy.nav.close : copy.nav.open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-b border-line bg-background transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[100svh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-4 py-4">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex min-h-12 items-center font-display text-2xl text-foreground"
            >
              {copy.nav[link.key]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function LangToggle({
  lang,
  setLang,
}: {
  lang: "en" | "th";
  setLang: (lang: "en" | "th") => void;
}) {
  return (
    <div className="ml-2 flex h-11 items-center gap-1 text-xs tracking-widest text-muted">
      <button
        type="button"
        className={cn(
          "inline-flex h-11 min-w-11 items-center justify-center px-2",
          lang === "en" ? "text-foreground" : "hover:text-foreground",
        )}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span aria-hidden className="text-line">
        /
      </span>
      <button
        type="button"
        className={cn(
          "inline-flex h-11 min-w-11 items-center justify-center px-2",
          lang === "th" ? "text-foreground" : "hover:text-foreground",
        )}
        onClick={() => setLang("th")}
        aria-pressed={lang === "th"}
      >
        TH
      </button>
    </div>
  );
}
