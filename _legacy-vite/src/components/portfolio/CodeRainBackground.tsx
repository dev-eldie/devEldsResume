import { useEffect, useRef } from "react";

/**
 * Animated coding background — drifting glyph rain on a canvas, plus a
 * faint moving gradient. Rendered behind everything; pointer-events: none.
 *
 * It uses requestAnimationFrame, throttles to ~30fps, and pauses when the
 * tab is hidden or `prefers-reduced-motion` is enabled.
 */
export function CodeRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let columns = 0;
    const fontSize = 14;
    let drops: number[] = [];
    let speeds: number[] = [];

    const glyphs =
      "01{}[]()<>=+-*/&|;:.\u00B5\u03BB\u03A3\u03A9\u2206\u2207\u00A7";

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);
      columns = Math.ceil(w / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -40);
      speeds = new Array(columns)
        .fill(0)
        .map(() => 0.35 + Math.random() * 0.55);
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    let raf = 0;
    const interval = 1000 / 30; // ~30fps
    let visible = !document.hidden;

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const loop = (t: number) => {
      if (!visible) return;
      if (t - last < interval) {
        raf = requestAnimationFrame(loop);
        return;
      }
      last = t;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Trail fade — rgb(7,7,13) at low alpha for the comet-tail effect
      ctx.fillStyle = "rgba(7,7,13,0.12)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `500 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const tone = i % 17 === 0 ? "#D9FF5B" : i % 9 === 0 ? "#A78BFA" : "#00E5FF";
        const isHead = Math.random() < 0.025;

        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];

        if (isHead) {
          ctx.fillStyle = "rgba(236,236,242,0.95)";
        } else {
          // dim the rest — alpha varies down the trail
          ctx.fillStyle = tone + "55";
        }
        ctx.fillText(ch, x, y);

        if (y > h && Math.random() > 0.975) {
          drops[i] = Math.random() * -10;
        }
        drops[i] += speeds[i];
      }

      raf = requestAnimationFrame(loop);
    };

    if (!reduced) {
      raf = requestAnimationFrame(loop);
    } else {
      // Static seed paint so background is not totally empty
      ctx.fillStyle = "rgba(7,7,13,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Drifting code rain */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-[0.42]" />

      {/* Gradient orbs */}
      <div className="absolute -top-40 left-[8%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.28),transparent_60%)] blur-3xl animate-float" />
      <div
        className="absolute bottom-[-200px] right-[-120px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.22),transparent_60%)] blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute top-[40%] left-[40%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,61,166,0.16),transparent_65%)] blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      {/* Faint scanlines */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 3px)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(7,7,13,0.85) 100%)",
        }}
      />
    </div>
  );
}
