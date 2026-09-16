import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import type { SceneLayout } from "@/components/canvas/atelier-world";
import { CanvasFallback } from "@/components/canvas/canvas-fallback";
import { ClientOnly } from "@/components/canvas/client-only";
import { LoadingVeil } from "@/components/canvas/loading-veil";
import { getQuality } from "@/components/canvas/quality";
import { WebGLBoundary } from "@/components/canvas/webgl-boundary";
import type { Work } from "@/lib/works";

const HeroScene = lazy(() => import("@/components/canvas/hero-scene"));

type Props = {
  works: Work[];
  selected: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
  autoRotate?: boolean;
  enableZoom?: boolean;
  cameraZ?: number;
  label?: string;
  layout?: SceneLayout;
  focus?: boolean;
};

export function SceneStage({
  works,
  selected,
  onHover,
  onSelect,
  autoRotate,
  enableZoom,
  cameraZ,
  label,
  layout = "ring",
  focus = false,
}: Props) {
  const quality = useMemo(() => getQuality(), []);
  const wrap = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <ClientOnly fallback={<CanvasFallback label={label} />}>
        <WebGLBoundary fallback={<CanvasFallback label={label} />}>
          <Suspense fallback={<CanvasFallback label={label} />}>
            <HeroScene
              works={works}
              quality={quality}
              selected={selected}
              onHover={onHover}
              onSelect={onSelect}
              autoRotate={autoRotate}
              enableZoom={enableZoom}
              cameraZ={cameraZ}
              layout={layout}
              focus={focus}
              frameloop={live ? "always" : "never"}
            />
          </Suspense>
          <LoadingVeil label={label} />
        </WebGLBoundary>
      </ClientOnly>
    </div>
  );
}
