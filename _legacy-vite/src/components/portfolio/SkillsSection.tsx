import { skills } from "@/data/resume";
import { useInView } from "@/lib/useInView";

const groupMeta: Record<
  "code" | "tools" | "soft",
  { label: string; tone: string; bar: string }
> = {
  code: {
    label: "// Code",
    tone: "text-cyan",
    bar: "from-cyan to-cyan/30",
  },
  tools: {
    label: "// Tools",
    tone: "text-violet",
    bar: "from-violet to-violet/30",
  },
  soft: {
    label: "// Practice",
    tone: "text-lime",
    bar: "from-lime to-lime/30",
  },
};

const marqueeItems = [
  "REACT",
  "TYPESCRIPT",
  "VUE",
  "FIGMA",
  "WORDPRESS",
  "PHP",
  "MYSQL",
  "ADOBE XD",
  "PHOTOSHOP",
  "ILLUSTRATOR",
  "UI/UX",
  "PIXEL-PERFECT",
  "SEO",
  "E-COMMERCE",
  "NEXT.JS",
  "TAILWIND",
];

export function SkillsSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="skills" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Top marquee */}
      <div className="absolute inset-x-0 top-0 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3 border-y border-hairline bg-ink-2/40 backdrop-blur-md">
          {[...marqueeItems, ...marqueeItems].map((m, i) => (
            <span
              key={i}
              className="mx-6 font-display font-black tracking-[0.04em] text-[clamp(28px,3vw,52px)] text-fg-dim hover:text-cyan transition-colors"
            >
              {m}
              <span className="mx-6 text-fg-dim/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-5 pt-32">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="reveal" data-inview={inView}>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-violet mb-5">
              ⌘ 02 · Stack
            </p>
            <h2 className="font-display font-light text-[clamp(40px,5vw,68px)] leading-[1.1] tracking-[-0.03em] pb-2">
              Tools that stay <span className="text-shimmer font-black">sharp</span>{" "}
              <br className="hidden sm:block" />
              after fifteen years.
            </h2>
          </div>
          <p
            className="reveal max-w-sm text-[16px] text-fg-muted italic leading-relaxed"
            data-inview={inView}
            style={{ transitionDelay: "120ms" }}
          >
            Bars are vibes, not gospel. Numbers feel honest after a decade and a half of shipping.
          </p>
        </div>

        <div
          className="mt-12 grid gap-4 lg:grid-cols-3 reveal-stagger"
          data-inview={inView}
        >
          {(["code", "tools", "soft"] as const).map((group) => {
            const items = skills.filter((s) => s.group === group);
            const meta = groupMeta[group];
            return (
              <div
                key={group}
                className="rounded-3xl glass p-6 sm:p-7 lift hover:shadow-glow-violet"
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-mono text-[12px] tracking-[0.24em] ${meta.tone}`}>
                    {meta.label}
                  </h3>
                  <span className="font-mono text-[10px] tracking-[0.22em] text-fg-dim uppercase">
                    {items.length} entries
                  </span>
                </div>

                <ul className="mt-6 space-y-5">
                  {items.map((s) => (
                    <li key={s.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-bold text-[15px] tracking-tight">
                          {s.name}
                        </span>
                        <span className="font-mono text-[11px] tabular-nums text-fg-muted">
                          {s.level}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full neo-inset overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${meta.bar}`}
                          style={{
                            width: inView ? `${s.level}%` : "0%",
                            transition: "width 1.4s cubic-bezier(0.16,1,0.3,1)",
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom reverse marquee */}
      <div className="mt-24 overflow-hidden">
        <div className="flex animate-marquee-rev whitespace-nowrap py-3 border-y border-hairline bg-ink-2/40 backdrop-blur-md">
          {[...marqueeItems.slice().reverse(), ...marqueeItems.slice().reverse()].map(
            (m, i) => (
              <span
                key={i}
                className="mx-6 font-display font-black tracking-[0.04em] text-[clamp(28px,3vw,52px)] text-fg-dim hover:text-violet transition-colors"
              >
                {m}
                <span className="mx-6 text-fg-dim/40">✦</span>
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
