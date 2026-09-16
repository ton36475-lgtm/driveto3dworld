import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang";
import type { Work } from "@/lib/works";

export function CanvasFallback({
  className,
  label,
  works,
}: {
  className?: string;
  label?: string;
  works?: Work[];
}) {
  const lang = useLang((state) => state.lang);
  return (
    <div className={cn("absolute inset-0 overflow-auto bg-background", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-elevated),transparent_68%)]" />
      <div className="relative mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-5 px-6 py-24">
        {label && (
          <p role="status" className="text-center text-sm text-muted">
            {label}
          </p>
        )}
        {works && works.length > 0 && (
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {works.map((work) => (
              <li key={work.slug}>
                <a
                  href={`/work/${work.slug}`}
                  className="block rounded border border-white/15 p-2 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <img
                    src={work.image}
                    alt=""
                    className="aspect-[1.44] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="mt-2 block text-xs">{work.title[lang]}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <a
          href="/work"
          className="relative z-10 rounded border border-white/30 px-4 py-3 text-sm underline underline-offset-4"
        >
          {lang === "zh" ? "浏览全部作品" : lang === "th" ? "ดูผลงานทั้งหมด" : "Browse all work"}
        </a>
      </div>
    </div>
  );
}
