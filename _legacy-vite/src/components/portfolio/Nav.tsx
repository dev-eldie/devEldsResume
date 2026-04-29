import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { threshold: 0.45 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5">
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label="Eldie Arubang — home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl glass-strong shadow-neo-sm">
            <span className="font-display text-[15px] font-bold tracking-tight text-gradient-cv">
              EA
            </span>
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-[11px] font-semibold tracking-[0.18em] text-fg">
              ELDIE.ARUBANG
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] text-fg-muted">
              FE.ENGINEER /UI.UX
            </span>
          </span>
        </a>

        <nav
          className={[
            "hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-300",
            scrolled ? "glass-strong shadow-neo-sm" : "glass",
          ].join(" ")}
        >
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                className={[
                  "relative px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase transition-colors",
                  isActive
                    ? "text-ink"
                    : "text-fg-muted hover:text-fg",
                ].join(" ")}
              >
                {isActive && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan to-violet shadow-glow" />
                )}
                {l.label}
              </a>
            );
          })}
        </nav>

        <a
          href="#contact"
          className="group hidden sm:inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase text-fg lift hover:shadow-glow"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse-soft" />
          Available
        </a>
      </div>
    </header>
  );
}
