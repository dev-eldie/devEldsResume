import { useEffect, useState } from "react";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { profile } from "@/data/resume";

const phrases = [
  "Front-End Developer.",
  "UI/UX Designer.",
  "Process Expert.",
  "Pixel surgeon.",
  "Interface poet.",
];

export function HeroSection() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"type" | "hold" | "erase">("type");

  useEffect(() => {
    const word = phrases[i];
    let timer: number;
    if (phase === "type") {
      if (typed.length < word.length) {
        timer = window.setTimeout(
          () => setTyped(word.slice(0, typed.length + 1)),
          60 + Math.random() * 50,
        );
      } else {
        timer = window.setTimeout(() => setPhase("hold"), 1300);
      }
    } else if (phase === "hold") {
      timer = window.setTimeout(() => setPhase("erase"), 600);
    } else if (phase === "erase") {
      if (typed.length > 0) {
        timer = window.setTimeout(
          () => setTyped(word.slice(0, typed.length - 1)),
          25,
        );
      } else {
        setI((v) => (v + 1) % phrases.length);
        setPhase("type");
      }
    }
    return () => window.clearTimeout(timer);
  }, [typed, phase, i]);

  return (
    <section
      id="top"
      className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-14 lg:grid-cols-12 items-center">
          {/* Left — name + headline */}
          <div className="lg:col-span-8 reveal-stagger" data-inview="true">
            <div className="inline-flex items-center gap-2 chip mb-6">
              <Sparkles className="h-3 w-3 text-lime" />
              <span>Portfolio · v2026</span>
              <span className="text-fg-dim">/</span>
              <span className="text-fg-muted">Quezon City, PH</span>
            </div>

            <h1 className="font-display font-light leading-[1.02] tracking-[-0.045em] text-[clamp(48px,8.4vw,128px)] pb-2">
              <span className="block text-fg-muted/80">{profile.firstName}</span>
              <span className="block text-gradient-cv font-black">
                {profile.lastName}
                <span className="text-magenta">.</span>
              </span>
            </h1>

            <div className="mt-8 flex flex-col gap-2 max-w-2xl">
              <p className="font-mono text-[12px] tracking-[0.22em] uppercase text-fg-muted">
                — {profile.role} since 2011
              </p>
              <p className="font-sans text-[clamp(22px,2.6vw,34px)] font-bold leading-[1.15] pb-1">
                I build{" "}
                <span className="text-shimmer">{typed}</span>
                <span className="inline-block w-[3px] h-[0.9em] translate-y-[2px] bg-cyan ml-1 animate-blink-caret" />
              </p>
              <p className="italic text-fg-muted text-[clamp(17px,1.5vw,21px)] mt-2 leading-relaxed">
                Fifteen years of typing curly braces so that other people don't have to.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#portfolio"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-6 py-3.5 neo lift"
              >
                <span className="absolute inset-0 -z-0 bg-gradient-to-r from-cyan/0 via-cyan/15 to-violet/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="font-mono text-[12px] tracking-[0.22em] uppercase">
                  Drop a project
                </span>
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#experience"
                className="inline-flex items-center gap-3 rounded-2xl glass px-6 py-3.5 lift hover:shadow-glow-violet"
              >
                <span className="font-mono text-[12px] tracking-[0.22em] uppercase text-fg">
                  See the run
                </span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-3 rounded-2xl px-6 py-3.5 hairline lift"
              >
                <span className="font-mono text-[12px] tracking-[0.22em] uppercase text-fg-muted">
                  {profile.email}
                </span>
              </a>
            </div>
          </div>

          {/* Right — neumorphic ID card */}
          <div className="lg:col-span-4">
            <div
              className="relative reveal"
              data-inview="true"
              style={{ transitionDelay: "300ms" }}
            >
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-cyan/25 via-violet/25 to-magenta/25 blur-2xl opacity-60 animate-pulse-soft" />

              <div className="relative rounded-[28px] neo p-1.5">
                <div className="rounded-[22px] glass-strong p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-fg-muted">
                      ID · 0001
                    </span>
                    <span className="grid h-2 w-2 place-items-center">
                      <span className="h-2 w-2 rounded-full bg-lime animate-pulse-soft" />
                    </span>
                  </div>

                  {/* Avatar slot — letter monogram on neo plate */}
                  <div className="mt-5 grid place-items-center rounded-2xl neo-inset h-44 relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 30% 20%, rgba(0,229,255,0.55), transparent 50%), radial-gradient(circle at 75% 75%, rgba(167,139,250,0.55), transparent 50%)",
                      }}
                    />
                    <span className="relative font-display font-black text-[96px] leading-none text-gradient-cv">
                      EA
                    </span>
                    <span className="absolute bottom-2 right-3 font-mono text-[10px] tracking-[0.22em] text-fg-muted">
                      // PH-MNL
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-[12px]">
                    <div className="rounded-xl hairline p-3">
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-dim">
                        Born
                      </p>
                      <p className="font-bold text-fg mt-1">
                        Mar 26 ’87
                      </p>
                    </div>
                    <div className="rounded-xl hairline p-3">
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-dim">
                        Phone
                      </p>
                      <p className="font-mono text-[11px] text-fg mt-1">
                        +63 9.15.888.3807
                      </p>
                    </div>
                    <div className="col-span-2 rounded-xl hairline p-3">
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-dim">
                        Page
                      </p>
                      <p className="font-mono text-[11px] text-cyan mt-1">
                        behance.net/earubang
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {profile.stats.map((s, idx) => (
            <div
              key={s.label}
              className="rounded-2xl glass p-5 sm:p-6 lift hover:shadow-glow"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <p className="font-display font-black text-[clamp(36px,4vw,56px)] leading-none text-gradient-ll tabular-nums">
                {s.value}
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-fg-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
