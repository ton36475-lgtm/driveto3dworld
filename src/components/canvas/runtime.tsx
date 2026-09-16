import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

/** Commit readiness only after the renderer completes its first mounted frame. */
export function FirstFrameReady({ onReady }: { onReady: () => void }) {
  const queued = useRef(false);
  const mounted = useRef(true);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useFrame(() => {
    if (queued.current) return;
    queued.current = true;
    // R3F calls frame subscribers immediately before its synchronous render.
    queueMicrotask(() => { if (mounted.current) onReady(); });
  });
  return null;
}

/** Context loss does not throw into a React error boundary. */
export function ContextLossGuard({ onLost }: { onLost: () => void }) {
  const gl = useThree((state) => state.gl);
  useLayoutEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onLost(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);
  return null;
}
