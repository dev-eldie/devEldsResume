"use client";

import { useEffect, useRef } from "react";

export function HorizontalScrollWrapper({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;

    const init = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const stage = stageRef.current;
      if (!stage) return;

      ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".h-panel");
        if (!panels.length) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          const n = panels.length;
          const ids = ["skills", "experience", "education"];

          const tween = gsap.to(panels, {
            xPercent: -100 * (n - 1),
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => "+=" + window.innerWidth * (n - 1),
              invalidateOnRefresh: true,
              onUpdate(self) {
                const p = self.progress;
                let bestIdx = 0;
                let bestOverlap = -1;
                for (let i = 0; i < n; i++) {
                  const left = i - (n - 1) * p;
                  const overlap = Math.max(0, Math.min(1, left + 1) - Math.max(0, left));
                  if (overlap > bestOverlap) {
                    bestOverlap = overlap;
                    bestIdx = i;
                  }
                }
                document.querySelectorAll<HTMLElement>(".nav-link").forEach((l) => {
                  l.classList.toggle("active", l.getAttribute("href") === "#" + ids[bestIdx]);
                });
              },
            },
          });

          if (barRef.current) {
            gsap.to(barRef.current, {
              height: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => "+=" + window.innerWidth * (n - 1),
                scrub: true,
              },
            });
          }

          panels.forEach((panel) => {
            const items = panel.querySelectorAll(".h-reveal");
            if (!items.length) return;
            gsap.fromTo(
              items,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.07,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: tween,
                  start: "left 80%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          });

          ScrollTrigger.refresh();
        });
      }, stageRef);
    };

    init();

    return () => ctx?.revert();
  }, []);

  return (
    <div id="horizontal-stage" ref={stageRef} className="h-stage">
      <div className="h-progress-rail" aria-hidden="true">
        <div className="h-progress-bar" ref={barRef} />
      </div>
      <div className="h-track">{children}</div>
    </div>
  );
}
