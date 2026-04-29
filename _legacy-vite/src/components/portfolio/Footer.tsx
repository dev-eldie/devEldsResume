import { profile } from "@/data/resume";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative pt-16 pb-10 mt-12 border-t border-hairline">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display font-black text-[clamp(56px,9vw,128px)] leading-[0.9] tracking-[-0.04em] text-gradient-cv">
              ELDIE.
            </p>
            <p className="mt-3 font-serif italic text-fg-muted text-[15px] max-w-md">
              Hand-built in Quezon City. Coffee-fueled, IDE-tested, ready for Next.js.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 font-mono text-[11px] tracking-[0.18em] uppercase">
            <a href="#about" className="text-fg-muted hover:text-cyan">// about</a>
            <a href="#skills" className="text-fg-muted hover:text-cyan">// stack</a>
            <a href="#experience" className="text-fg-muted hover:text-cyan">// run</a>
            <a href="#education" className="text-fg-muted hover:text-cyan">// school</a>
            <a href="#portfolio" className="text-fg-muted hover:text-cyan">// drop</a>
            <a href="#contact" className="text-fg-muted hover:text-cyan">// talk</a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-fg-dim">
          <span>© {year} {profile.name}. Pixels, the long way.</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse-soft" />
            v2026 · built with React + Tailwind · Next.js-ready
          </span>
        </div>
      </div>
    </footer>
  );
}
