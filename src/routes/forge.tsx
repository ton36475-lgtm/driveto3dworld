import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Download, SlidersHorizontal } from "lucide-react";
import { SceneStage } from "@/components/scene-stage";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/copy";
import { forgeCopy } from "@/lib/forge/copy";
import { WORKS } from "@/lib/works";
import {
  defaultConfig,
  validateConfig,
  PRESETS,
  SECTIONS,
  type ForgeConfig,
} from "@/lib/forge/config.mjs";

export const Route = createFileRoute("/forge")({ component: ForgePage });
function ForgePage() {
  const pageRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (pageRef.current) pageRef.current.dataset.pageReady = "true";
  }, []);
  const lang = useLocale();
  const t = forgeCopy[lang];
  const [config, setConfig] = useState<ForgeConfig>(defaultConfig);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const c = { ...config, locale: lang };
  const update = <K extends keyof ForgeConfig>(key: K, value: ForgeConfig[K]) => {
    setConfig((s) => ({ ...s, [key]: value }));
    setNotice("");
  };
  const exportConfig = () => {
    const errors = validateConfig(c);
    if (errors.length) {
      setNotice(`${t.invalid}: ${errors.join(", ")}`);
      return;
    }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(c, null, 2) + "\n"], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `sxb-${c.preset}.v1.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(t.exported);
  };
  const field =
    "mt-2 min-h-11 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm";
  const surface =
    c.theme === "slate"
      ? ({
          "--color-background": "#17212b",
          "--color-surface": "#202c38",
          "--color-muted": "#b8c2cb",
        } as CSSProperties)
      : undefined;
  return (
    <main ref={pageRef} className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <p className="flex items-center gap-2 text-xs tracking-[0.22em] text-muted uppercase">
        <SlidersHorizontal size={16} /> {t.kicker}
      </p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">{t.title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{t.lede}</p>
      <div className="mt-10 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <section
          aria-label={t.configuration}
          className="rounded-xl border border-line bg-surface p-5 space-y-5"
        >
          <label className="block text-sm">
            {t.preset}
            <select
              aria-label={t.preset}
              className={field}
              value={c.preset}
              onChange={(e) => update("preset", e.target.value as ForgeConfig["preset"])}
            >
              {PRESETS.map((p) => (
                <option key={p} value={p}>
                  {t.presets[p]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            {t.theme}
            <select
              aria-label={t.theme}
              className={field}
              value={c.theme}
              onChange={(e) => update("theme", e.target.value as ForgeConfig["theme"])}
            >
              <option value="ink">{t.themes.ink}</option>
              <option value="slate">{t.themes.slate}</option>
            </select>
          </label>
          <label className="block text-sm">
            {t.scene}
            <select
              aria-label={t.scene}
              className={field}
              value={c.scene}
              onChange={(e) => update("scene", e.target.value as ForgeConfig["scene"])}
            >
              <option value="salon">{t.salon}</option>
              <option value="static">{t.static}</option>
            </select>
          </label>
          <label className="block text-sm">
            {t.count}
            <select
              aria-label={t.count}
              className={field}
              value={c.density}
              onChange={(e) => {
                update("density", Number(e.target.value) as ForgeConfig["density"]);
                setSelected(null);
              }}
            >
              {[2, 4, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="min-h-11 w-full rounded-lg border border-line px-3 text-sm"
            aria-pressed={c.motion === "paused"}
            onClick={() => update("motion", c.motion === "paused" ? "calm" : "paused")}
          >
            {c.motion === "paused" ? t.resume : t.pause}
          </button>
          <fieldset>
            <legend className="text-sm">{t.sections}</legend>
            {SECTIONS.map((s) => (
              <label key={s} className="flex min-h-11 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={c.sections.includes(s)}
                  disabled={c.sections.length === 1 && c.sections.includes(s)}
                  onChange={() =>
                    update(
                      "sections",
                      c.sections.includes(s)
                        ? c.sections.filter((x) => x !== s)
                        : [...c.sections, s],
                    )
                  }
                />
                {t.sectionLabels[s]}
              </label>
            ))}
          </fieldset>
          <p className="text-xs text-muted">{t.format}</p>
          <Button className="w-full" onClick={exportConfig}>
            <Download size={16} />
            {t.export}
          </Button>
          <p role="status" className="text-sm text-muted">
            {notice}
          </p>
        </section>
        <section
          aria-label={t.preview}
          style={surface}
          className="min-w-0 overflow-hidden rounded-xl border border-line bg-background"
        >
          <div className="border-b border-line px-5 py-3 text-xs text-muted">
            {t.previewLabel} / {t.themes[c.theme]}
          </div>
          {c.sections.includes("profile") && (
            <div className="p-6">
              <p className="text-xs tracking-widest text-muted uppercase">SIRAWAT × BALL</p>
              <h2 className="mt-3 font-display text-3xl">{t.titles[c.preset]}</h2>
              <p className="mt-3 text-sm text-muted">{t.evidence}</p>
            </div>
          )}
          {c.sections.includes("work") &&
            (c.scene === "salon" ? (
              <div className="relative h-[400px] border-y border-line">
                <SceneStage
                  works={WORKS.slice(0, c.density)}
                  selected={selected}
                  onHover={() => undefined}
                  onSelect={setSelected}
                  autoRotate={c.motion === "calm"}
                  paused={c.motion === "paused"}
                  label={t.studies}
                  focus={c.motion !== "paused"}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-5">
                {WORKS.slice(0, c.density).map((w) => (
                  <figure key={w.slug}>
                    <img
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                      src={w.image}
                      alt={w.title[lang]}
                      loading="lazy"
                    />
                    <figcaption className="mt-2 text-xs text-muted">{w.title[lang]}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          {c.sections.includes("contact") && (
            <div className="p-6">
              <Button asChild variant="outline">
                <Link to="/contact">{t.brief}</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        {t.metrics.map((label) => (
          <div key={label} className="rounded-xl bg-surface p-4">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-2 font-display text-2xl">{t.unavailable}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted">{t.analytics}</p>
    </main>
  );
}
