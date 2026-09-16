import { Suspense, lazy, useCallback, useMemo, useRef, useState } from "react";
import type { SceneLayout } from "@/components/canvas/atelier-world";
import { CanvasFallback } from "@/components/canvas/canvas-fallback";
import { ClientOnly } from "@/components/canvas/client-only";
import { LoadingVeil } from "@/components/canvas/loading-veil";
import { getQuality } from "@/components/canvas/quality";
import { WebGLBoundary } from "@/components/canvas/webgl-boundary";
import type { Work } from "@/lib/works";
import { useCopy } from "@/lib/copy";
import { useReducedMotion, useSceneVisibility, useWebGLSupport } from "@/components/canvas/runtime-hooks";

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
  const copy = useCopy();
  const quality = useMemo(() => getQuality(), []);
  const wrap = useRef<HTMLDivElement>(null);
  const live = useSceneVisibility(wrap);
  const reducedMotion = useReducedMotion();
  const webgl = useWebGLSupport();
  const [failed, setUnavailable] = useState(false);
  const unavailable = failed || webgl === "unsupported";
  const [rendered, setRendered] = useState(false);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  const onReady = useCallback(() => setRendered(true), []);
  const fallback = <CanvasFallback label={label} works={works} />;
  const permanentFallback = <CanvasFallback label={copy.fallback.webgl} works={works} />;

  return (
    <div
      ref={wrap}
      className="absolute inset-0"
      data-scene-stage="atelier"
      data-scene-state={unavailable ? "fallback" : rendered ? "ready" : "loading"}
      data-scene-active={live ? "true" : "false"}
    >
      <ClientOnly fallback={fallback}>
        <WebGLBoundary fallback={permanentFallback} onFailure={onUnavailable}>
          {unavailable ? permanentFallback : webgl === "checking" ? fallback : <Suspense fallback={fallback}>
            <HeroScene
              works={works}
              quality={quality}
              reducedMotion={reducedMotion || paused}
              onUnavailable={onUnavailable}
              onReady={onReady}
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
          {!unavailable && webgl === "supported" && !rendered && <LoadingVeil label={label} />}
        </WebGLBoundary>
      </ClientOnly>
    </div>
  );
}
