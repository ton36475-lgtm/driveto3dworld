import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/copy";
import { LANGUAGE_OPTIONS, useLang, type Lang } from "@/lib/lang";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/work", key: "work" as const },
  { to: "/gallery", key: "gallery" as const },
  { to: "/drive", key: "drive" as const },
  { to: "/foodtruck", key: "foodtruck" as const },
  { to: "/studio", key: "studio" as const },
  { to: "/contact", key: "contact" as const },
];

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const copy = useCopy();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const extraLinks = [
    {
      to: "/forge",
      label: lang === "zh" ? "定制网站" : lang === "th" ? "ปรับเว็บไซต์" : "Customize",
    },
    { to: "/desk", label: copy.ops.desk },
  ] as const;
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
        transparent ? "bg-background/20" : "border-b border-line/80 bg-background/85",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="font-display text-xs tracking-[0.08em] text-foreground sm:text-sm sm:tracking-[0.18em]"
        >
          SIRAWAT × BALL
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {LINKS.map((link) => {
            const active =
              link.to === "/work" ? pathname.startsWith("/work") : pathname === link.to;
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
          {extraLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex min-h-11 items-center px-3 text-sm text-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <LangToggle lang={lang} setLang={setLang} />
        </nav>

        <div className="flex items-center gap-1 xl:hidden">
          <LangToggle lang={lang} setLang={setLang} />
          <Button
            variant="ghost"
            size="sm"
            className="size-11 px-0"
            aria-label={open ? copy.nav.close : copy.nav.open}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        id="mobile-nav"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "xl:hidden overflow-hidden border-b border-line bg-background transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[100svh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav
          className="flex flex-col px-4 py-4"
          aria-label={lang === "zh" ? "移动菜单" : lang === "th" ? "เมนูมือถือ" : "Mobile menu"}
        >
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex min-h-12 items-center font-display text-2xl text-foreground"
            >
              {copy.nav[link.key]}
            </Link>
          ))}
          {extraLinks.map((link) => (
            <Link key={link.to} to={link.to} className="flex min-h-12 items-center text-xl">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex h-11 shrink-0 items-center text-xs text-muted"
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          data-language={option.code}
          aria-label={option.name}
          lang={option.html}
          className={cn(
            "inline-flex h-11 min-w-11 items-center justify-center px-1",
            lang === option.code ? "text-foreground" : "hover:text-foreground",
          )}
          onClick={() => setLang(option.code)}
          aria-pressed={lang === option.code}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
