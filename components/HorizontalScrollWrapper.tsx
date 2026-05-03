"use client";

import { useEffect, useRef } from "react";

export function HorizontalScrollWrapper({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let mm: { revert: () => void } | undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const init = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const stage = stageRef.current;
      if (!stage) return;

      // Store natural top before GSAP pin changes offsetTop
      (window as any).__stageNaturalTop = stage.getBoundingClientRect().top + window.scrollY;

      ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".h-panel");
        if (!panels.length) return;

        mm = gsap.matchMedia();

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
              onEnter()      { (window as any).__horizActive = true; },
              onEnterBack()  { (window as any).__horizActive = true; },
              onLeave()      { (window as any).__horizActive = false; },
              onLeaveBack()  { (window as any).__horizActive = false; },
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
                ((window as any).__setActiveNav as ((id: string) => void) | undefined)?.(ids[bestIdx]);
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
                invalidateOnRefresh: true,
              },
            });
          }

          panels.forEach((panel) => {
            const header = panel.querySelector<HTMLElement>(".section-head.h-reveal");
            const isExperience = !!panel.querySelector(".h-timeline");
            const cards = gsap.utils.toArray<HTMLElement>(
              panel.querySelectorAll(".h-reveal:not(.section-head)")
            );

            const triggerBase = {
              trigger: panel,
              containerAnimation: tween,
              toggleActions: "play none none reverse" as const,
            };

            if (prefersReduced) {
              if (header) gsap.set(header, { opacity: 1, x: 0, y: 0 });
              if (cards.length) gsap.set(cards, { opacity: 1, x: 0, y: 0 });
              return;
            }

            // Section header: diagonal sweep from top-left
            if (header) {
              gsap.fromTo(
                header,
                { opacity: 0, x: -80, y: -24, scale: 0.97 },
                {
                  opacity: 1, x: 0, y: 0, scale: 1,
                  duration: 1.1, ease: "expo.out",
                  clearProps: "scale,will-change",
                  scrollTrigger: { ...triggerBase, start: "left 90%" },
                }
              );
            }

            if (!cards.length) return;

            if (isExperience) {
              // 2-col grid: left column slides from left, right column from right,
              // same stagger delay per row so both sides enter together — no rotation
              const leftCards  = cards.filter((_, i) => i % 2 === 0);
              const rightCards = cards.filter((_, i) => i % 2 === 1);
              const shared = {
                opacity: 1, x: 0, y: 0, scale: 1,
                stagger: { each: 0.14 },
                duration: 1, ease: "expo.out",
                clearProps: "scale,will-change",
                scrollTrigger: { ...triggerBase, start: "left 75%" },
              };
              if (leftCards.length)
                gsap.fromTo(leftCards,  { opacity: 0, x: -60, y: 48, scale: 0.94 }, shared);
              if (rightCards.length)
                gsap.fromTo(rightCards, { opacity: 0, x:  60, y: 48, scale: 0.94 }, shared);
            } else {
              // Skills / Education: alternating diagonal with subtle rotation
              gsap.fromTo(
                cards,
                {
                  opacity: 0,
                  x: (i: number) => (i % 2 === 0 ? -56 : 56),
                  y: 72, scale: 0.93,
                  rotation: (i: number) => (i % 2 === 0 ? -2.5 : 2.5),
                },
                {
                  opacity: 1, x: 0, y: 0, scale: 1, rotation: 0,
                  stagger: { each: 0.09, ease: "power2.out" },
                  duration: 1, ease: "expo.out",
                  clearProps: "scale,rotation,will-change",
                  scrollTrigger: { ...triggerBase, start: "left 75%" },
                }
              );
            }
          });

          ScrollTrigger.refresh();
        });
      }, stageRef);
    };

    init();

    return () => {
      mm?.revert();
      ctx?.revert();
      delete (window as any).__stageNaturalTop;
      delete (window as any).__horizActive;
    };
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
