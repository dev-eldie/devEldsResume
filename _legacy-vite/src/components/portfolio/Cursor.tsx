import { useEffect, useRef, useState } from "react";

/**
 * Soft custom cursor — a glow dot with a trailing ring.
 * Uses requestAnimationFrame + lerp for a buttery follow.
 * Hidden on touch / coarse pointers.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest(
        "a, button, input, textarea, label[for], [data-cursor='hover']",
      );
      setHovering(interactive);
    };

    const tick = () => {
      dx += (mx - dx) * 0.4;
      dy += (my - dy) * 0.4;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className={[
          "pointer-events-none fixed top-0 left-0 z-[60] rounded-full mix-blend-difference",
          "transition-[width,height,border-color,opacity] duration-200",
          hovering
            ? "h-12 w-12 border border-lime opacity-90"
            : "h-8 w-8 border border-cyan/80 opacity-70",
        ].join(" ")}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[61] h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_rgba(217,255,91,0.9)]"
      />
    </>
  );
}
