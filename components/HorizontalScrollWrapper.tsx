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

      ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".h-panel");
        if (!panels.length) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          const tween = gsap.to(panels, {
            xPercent: -100 * (panels.length - 1),
            ease: "none",
            scrollTrigger: {
              trigger: "#horizontal-stage",
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => "+=" + window.innerWidth * (panels.length - 1),
              invalidateOnRefresh: true,
              onUpdate(self) {
                const idx = Math.round(self.progress * (panels.length - 1));
                const ids = ["skills", "experience", "education"];
                document.querySelectorAll<HTMLElement>(".nav-link").forEach((l) => {
                  l.classList.toggle("active", l.getAttribute("href") === "#" + ids[idx]);
                });
              },
            },
          });

          if (barRef.current) {
            gsap.to(barRef.current, {
              height: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: "#horizontal-stage",
                start: "top top",
                end: () => "+=" + window.innerWidth * (panels.length - 1),
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
                  start: "left 70%",
                  toggleActions: "play none none none",
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
