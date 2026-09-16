type ProbeContext = {
  isContextLost: () => boolean;
  getExtension: (name: string) => { loseContext?: () => void } | null;
};

type ProbeCanvas = {
  width: number;
  height: number;
  getContext: (type: "webgl2", options: WebGLContextAttributes) => ProbeContext | null;
};

/** Check Three's required WebGL2 capability before R3F's async renderer setup. */
export function supportsWebGL2(createCanvas: () => ProbeCanvas = () => document.createElement("canvas")): boolean {
  let canvas: ProbeCanvas | undefined;
  let context: ProbeContext | null = null;
  try {
    canvas = createCanvas();
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext("webgl2", { antialias: false, depth: false, stencil: false });
    return context !== null && !context.isContextLost();
  } catch {
    return false;
  } finally {
    // A probe must not hold a scarce GPU context after the real scene mounts.
    try { context?.getExtension("WEBGL_lose_context")?.loseContext?.(); } catch { /* optional extension */ }
    if (canvas) { canvas.width = 0; canvas.height = 0; }
  }
}
