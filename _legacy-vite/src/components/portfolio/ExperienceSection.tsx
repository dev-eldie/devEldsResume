import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { jobs } from "@/data/resume";
import { useInView } from "@/lib/useInView";

export function ExperienceSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max <= 0 ? 0 : (el.scrollLeft / max) * 100);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = (delta: number) => {
    trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section id="experience" className="relative py-24 sm:py-32 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-5">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="reveal" data-inview={inView}>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-lime mb-5">
              ⌘ 03 · Run · Horizontal scroll →
            </p>
            <h2 className="font-display font-light text-[clamp(40px,5vw,68px)] leading-[1.1] tracking-[-0.03em] pb-2">
              The{" "}
              <span className="italic font-extrabold text-gradient-cv">
                receipts
              </span>
              .
            </h2>
            <p className="mt-4 max-w-xl text-fg-muted text-[16px] leading-relaxed">
              Five chapters, fifteen years. Drag, scroll-wheel, or use the arrows — the timeline runs sideways.
            </p>
          </div>

          <div
            className="flex items-center gap-2 reveal"
            data-inview={inView}
            style={{ transitionDelay: "120ms" }}
          >
            <button
              type="button"
              onClick={() => scrollBy(-440)}
              aria-label="Scroll experience left"
              className="grid h-11 w-11 place-items-center rounded-xl neo lift hover:shadow-glow"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(440)}
              aria-label="Scroll experience right"
              className="grid h-11 w-11 place-items-center rounded-xl neo lift hover:shadow-glow"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress rail */}
        <div
          className="mt-10 h-[3px] rounded-full neo-inset overflow-hidden reveal"
          data-inview={inView}
        >
          <div
            className="h-full bg-gradient-to-r from-cyan via-violet to-magenta"
            style={{
              width: `${Math.max(8, progress)}%`,
              transition: "width 250ms ease",
            }}
          />
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex gap-5 overflow-x-auto px-5 pb-8 snap-x snap-mandatory scroll-x"
        style={{ scrollPaddingLeft: "max(20px, calc((100vw - 1280px)/2 + 20px))" }}
      >
        {/* Spacer for centering on wide screens */}
        <div className="shrink-0 w-[max(0px,calc((100vw-1280px)/2))]" />

        {jobs.map((j, idx) => (
          <article
            key={j.company}
            className="snap-start shrink-0 w-[88vw] sm:w-[520px] rounded-3xl neo p-7 lift relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-cyan/15 to-violet/15 blur-3xl" />

            <div className="flex items-center justify-between">
              <span className="chip">
                <span className="text-lime">●</span>
                {`Chapter 0${jobs.length - idx}`}
              </span>
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-fg-muted">
                {j.range}
              </span>
            </div>

            <h3 className="mt-7 font-bold text-[22px] sm:text-[26px] leading-[1.2] tracking-tight pb-1">
              {j.title}
            </h3>

            <p className="mt-2 inline-flex items-center gap-1.5 text-fg-muted">
              <MapPin className="h-3.5 w-3.5 text-cyan" />
              <span className="font-display font-normal tracking-[0.02em] text-fg text-[14px]">
                {j.company}
              </span>
            </p>

            <p className="mt-5 text-[15px] leading-relaxed text-fg-muted">
              {j.blurb}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {j.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-7 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-fg-dim">
                  Index
                </span>
                <span className="font-display font-black text-[40px] leading-none text-gradient-cv tabular-nums">
                  {String(jobs.length - idx).padStart(2, "0")}
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-fg-dim">
                /{String(jobs.length).padStart(2, "0")}
              </span>
            </div>
          </article>
        ))}

        <div className="shrink-0 w-[max(20px,calc((100vw-1280px)/2))]" />
      </div>
    </section>
  );
}
