import { useEffect, useRef } from "react";
import { setTouch, setTouchBrake } from "../systems/input";
import { COPY } from "../data/i18n";
import { useDrive } from "../store";

export function TouchControls() {
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const idRef = useRef<number | null>(null);
  const lang = useDrive((s) => s.lang);
  const c = COPY[lang];

  useEffect(() => () => {
    setTouch(0, 0, false);
    setTouchBrake(false);
  }, []);

  const moveTo = (clientX: number, clientY: number) => {
    const el = base.current;
    const k = knob.current;
    if (!el || !k) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const max = r.width * 0.38;
    const len = Math.hypot(dx, dy) || 1;
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    k.style.transform = `translate(${dx}px, ${dy}px)`;
    setTouch(dx / max, -dy / max, true);
  };

  const end = () => {
    idRef.current = null;
    if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
    setTouch(0, 0, false);
  };

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-5 pb-5 sm:hidden"
      style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
    >
      <div
        ref={base}
        role="group"
        aria-label={c.joystick}
        className="pointer-events-auto relative"
        style={{
          width: 112,
          height: 112,
          borderRadius: "50%",
          border: "1px solid color-mix(in oklab, var(--color-fg) 16%, transparent)",
          background: "color-mix(in oklab, var(--color-surface) 70%, transparent)",
          touchAction: "none",
        }}
        onPointerDown={(e) => {
          if (idRef.current !== null) return;
          idRef.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (idRef.current !== e.pointerId) return;
          moveTo(e.clientX, e.clientY);
        }}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
      >
        <div
          ref={knob}
          className="absolute"
          style={{
            width: 48,
            height: 48,
            left: 32,
            top: 32,
            borderRadius: "50%",
            background: "var(--color-accent)",
          }}
        />
      </div>
      <button
        type="button"
        className="pointer-events-auto ghost-btn"
        style={{ minWidth: 88, minHeight: 52, touchAction: "none" }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          setTouchBrake(true);
        }}
        onPointerUp={() => setTouchBrake(false)}
        onPointerCancel={() => setTouchBrake(false)}
        onLostPointerCapture={() => setTouchBrake(false)}
        onKeyDown={(e) => { if (e.code === "Space" || e.code === "Enter") setTouchBrake(true); }}
        onKeyUp={() => setTouchBrake(false)}
        onBlur={() => setTouchBrake(false)}
      >
        {c.brake}
      </button>
    </div>
  );
}
