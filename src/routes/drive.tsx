import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { ClientOnly } from "@/components/canvas/client-only";
import { CanvasFallback } from "@/components/canvas/canvas-fallback";
import { WebGLBoundary } from "@/components/canvas/webgl-boundary";
import { useCopy } from "@/lib/copy";

const DriveApp = lazy(() => import("@/drive/DriveApp"));

export const Route = createFileRoute("/drive")({ component: DrivePage });

function DrivePage() {
  const copy = useCopy();

  return (
    <main className="relative h-[100svh] min-h-[560px] overflow-hidden bg-background">
      <ClientOnly fallback={<CanvasFallback label={copy.drive.loading} />}>
        <WebGLBoundary fallback={<CanvasFallback label={copy.fallback.webgl} />}>
          <Suspense fallback={<CanvasFallback label={copy.drive.loading} />}>
            <DriveApp />
          </Suspense>
        </WebGLBoundary>
      </ClientOnly>
    </main>
  );
}
