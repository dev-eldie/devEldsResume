"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

/**
 * Mounts all client-side enhancements:
 *  - custom cursor + magnetic buttons + tilt + reveal + counters + skill bars + active nav
 * Uses useEffect so SSR stays clean.
 */
export function ClientEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ---------- CUSTOM CURSOR ----------
    const dot = document.querySelector<HTMLDivElement>(".cursor-dot");
    const ring = document.querySelector<HTMLDivElement>(".cursor-ring");
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    const hoverables = document.querySelectorAll<HTMLElement>(
      "a, button, .skill-card, .tl-card, .tool, .stat-card, input, textarea"
    );
    const onEnter = () => ring?.classList.add("hover");
    const onLeave = () => ring?.classList.remove("hover");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // ---------- MAGNETIC BUTTONS ----------
    const magnetics = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    const magMove = (el: HTMLElement) => (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    };
    const magLeave = (el: HTMLElement) => () => {
      el.style.transform = "";
    };
    const magCleanups: Array<() => void> = [];
    magnetics.forEach((el) => {
      const m = magMove(el);
      const l = magLeave(el);
      el.addEventListener("mousemove", m);
      el.addEventListener("mouseleave", l);
      magCleanups.push(() => {
        el.removeEventListener("mousemove", m);
        el.removeEventListener("mouseleave", l);
      });
    });

    // ---------- REVEAL ON SCROLL ----------
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => io.observe(el));

    // ---------- COUNTERS ----------
    const cIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = +(el.dataset.counter ?? "0");
            const dur = 1600;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - t, 3);
              el.textContent = Math.round(eased * target).toString();
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            cIO.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => cIO.observe(el));

    // ---------- SKILL BARS ----------
    const sIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.setProperty("--w", el.dataset.w ?? "80%");
            el.classList.add("in-view");
            sIO.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll<HTMLElement>(".skill-bar").forEach((el) => sIO.observe(el));

    // ---------- ACTIVE NAV LINK ----------
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
          }
        });
      },
      { threshold: 0.35, rootMargin: "-20% 0px -50% 0px" }
    );
    const horizIds = new Set(["about", "skills", "experience", "education"]);
    sections.filter((s) => !horizIds.has(s.id)).forEach((s) => navIO.observe(s));

    // ---------- TILT ----------
    const tilts = document.querySelectorAll<HTMLElement>(".stat-card, .skill-card, .tl-card");
    const tiltCleanups: Array<() => void> = [];
    tilts.forEach((card) => {
      const onTiltMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rXdeg = (py - 0.5) * -6;
        const rYdeg = (px - 0.5) * 8;
        card.style.transform = `perspective(900px) rotateX(${rXdeg}deg) rotateY(${rYdeg}deg) translateY(-3px)`;
      };
      const onTiltLeave = () => {
        card.style.transform = "";
      };
      card.addEventListener("mousemove", onTiltMove);
      card.addEventListener("mouseleave", onTiltLeave);
      tiltCleanups.push(() => {
        card.removeEventListener("mousemove", onTiltMove);
        card.removeEventListener("mouseleave", onTiltLeave);
      });
    });

    // ---------- IN-PAGE NAV: smooth scroll + strip hash from URL ----------
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // keep address bar clean — strip the #section
      try {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch {
        /* ignore */
      }
    };
    document.addEventListener("click", onAnchorClick);

    // strip any pre-existing hash on first load
    if (window.location.hash) {
      try {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch {
        /* ignore */
      }
    }

    // ---------- KEYBOARD: T to toggle theme ----------
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toUpperCase();
      if (e.key.toLowerCase() === "t" && !["INPUT", "TEXTAREA"].includes(tag)) {
        document.getElementById("themeToggle")?.click();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onAnchorClick);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      magCleanups.forEach((c) => c());
      tiltCleanups.forEach((c) => c());
      io.disconnect();
      cIO.disconnect();
      sIO.disconnect();
      navIO.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
    </>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const t = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(t);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", next);
    try {
      localStorage.setItem("ea-theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  return (
    <button id="themeToggle" className="theme-toggle" onClick={toggle} aria-label="Toggle theme" type="button">
      <span className="knob" aria-hidden="true">
        {theme === "light" ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
