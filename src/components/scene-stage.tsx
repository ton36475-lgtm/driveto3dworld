import { Suspense, lazy, useCallback, useMemo, useRef, useState } from "react";
import type { SceneLayout } from "@/components/canvas/atelier-world";
import { CanvasFallback } from "@/components/canvas/canvas-fallback";
import { ClientOnly } from "@/components/canvas/client-only";
import { LoadingVeil } from "@/components/canvas/loading-veil";
import { getQuality } from "@/components/canvas/quality";
import { WebGLBoundary } from "@/components/canvas/webgl-boundary";
import type { Work } from "@/lib/works";
import { useReducedMotion, useSceneVisibility } from "@/components/canvas/runtime-hooks";

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
  paused?: boolean;
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
  paused = false,
}: Props) {
  const quality = useMemo(() => getQuality(), []);
  const wrap = useRef<HTMLDivElement>(null);
  const live = useSceneVisibility(wrap);
  const reducedMotion = useReducedMotion();
  const [unavailable, setUnavailable] = useState(false);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  const fallback = <CanvasFallback label={label} works={works} />;

  return (
    <div ref={wrap} className="absolute inset-0">
      <ClientOnly fallback={fallback}>
        <WebGLBoundary fallback={fallback}>
          {unavailable ? fallback : <Suspense fallback={fallback}>
            <HeroScene
              works={works}
              quality={quality}
              reducedMotion={reducedMotion || paused}
              onUnavailable={onUnavailable}
              selected={selected}
              onHover={onHover}
              onSelect={onSelect}
              autoRotate={autoRotate}
              enableZoom={enableZoom}
              cameraZ={cameraZ}
              layout={layout}
              focus={focus}
              frameloop={!live ? "never" : reducedMotion || paused ? "demand" : "always"}
            />
          </Suspense>}
          {!unavailable && <LoadingVeil label={label} />}
        </WebGLBoundary>
      </ClientOnly>
    </div>
  );
}
