import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(notify: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => true,
  );
}

/** Stop GPU work when the scene is outside the viewport or its tab is hidden. */
export function useSceneVisibility(ref: RefObject<HTMLElement | null>) {
  const [live, setLive] = useState(true);
  useEffect(() => {
    let intersecting = true;
    const update = () => setLive(intersecting && document.visibilityState === "visible");
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      ([entry]) => { intersecting = entry.isIntersecting; update(); },
      { threshold: 0 },
    );
    if (ref.current) observer?.observe(ref.current);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref]);
  return live;
}
