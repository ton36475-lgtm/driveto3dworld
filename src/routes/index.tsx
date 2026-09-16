import { useEffect, useState, type ComponentType } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Boot() {
  return (
    <main className="drive-root flex items-end p-5 sm:items-center sm:justify-center">
      <div
        className="overlay-panel w-full max-w-lg px-6 py-7 sm:px-9 sm:py-9"
        style={{ borderRadius: "var(--radius-sheet)" }}
      >
        <p className="text-muted mb-3 text-[11px] font-medium tracking-[0.28em] uppercase">
          Godzfath3r · Phitsanulok
        </p>
        <h1
          className="text-fg mb-2 text-5xl leading-[0.95] tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Atelier Drive
        </h1>
        <p className="text-muted mb-6 max-w-sm text-sm leading-relaxed">
          A 3D design grounds you can drive. Four zones, twelve hidden crystals. Collect a piece to open it — or browse the archive.
        </p>
        <p className="text-faint text-xs tracking-wide">Loading the grounds…</p>
      </div>
    </main>
  );
}

function Home() {
  const [App, setApp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    void import("@/drive/DriveApp").then((mod) => {
      if (alive) setApp(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!App) return <Boot />;
  return <App />;
}
