import { Code2, Compass, PenTool } from "lucide-react";
import { profile } from "@/data/resume";
import { useInView } from "@/lib/useInView";

const pillars = [
  {
    icon: Code2,
    title: "Engineer",
    body: "React, Vue, TypeScript. WordPress when the brief says CMS. Pixel-perfect when the brief says pixel-perfect.",
    accent: "from-cyan/30 to-cyan/0",
    stroke: "border-cyan/30",
  },
  {
    icon: PenTool,
    title: "Designer",
    body: "Figma, XD, Photoshop, Illustrator. Interfaces that get out of the way and stay out of it.",
    accent: "from-violet/30 to-violet/0",
    stroke: "border-violet/30",
  },
  {
    icon: Compass,
    title: "Process expert",
    body: "Five years inside Henkel APAC turning fuzzy stakeholder asks into shipped, internal-grade tools.",
    accent: "from-lime/30 to-lime/0",
    stroke: "border-lime/30",
  },
];

export function AboutSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-5">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 reveal" data-inview={inView}>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-cyan mb-5">
              ⌘ 01 · About
            </p>
            <h2 className="font-display font-light text-[clamp(40px,5vw,68px)] leading-[1.1] tracking-[-0.03em] pb-2">
              A decade and a half of{" "}
              <span className="italic font-extrabold text-gradient-cv">
                shipping
              </span>
              ,
              <br />
              not just{" "}
              <span className="italic text-fg-muted">slidewares</span>.
            </h2>
            <p className="mt-6 text-fg-muted leading-relaxed text-[16px] max-w-md">
              {profile.objective}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "TypeScript",
                "React",
                "Vue",
                "WordPress",
                "Figma",
                "PSD→HTML",
                "SEO",
                "E-commerce",
              ].map((t) => (
                <span key={t} className="chip">
                  <span className="text-cyan">›</span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            className="lg:col-span-7 reveal-stagger grid sm:grid-cols-3 gap-4"
            data-inview={inView}
          >
            {pillars.map(({ icon: Icon, title, body, accent, stroke }) => (
              <article
                key={title}
                className={[
                  "group relative rounded-3xl neo p-6 lift hover:-translate-y-1 transition-all overflow-hidden",
                  "border",
                  stroke,
                ].join(" ")}
              >
                <div
                  className={`pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`}
                />
                <span className="grid h-11 w-11 place-items-center rounded-xl glass-strong">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[22px] font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">
                  {body}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-fg-dim uppercase">
                    Stack ready
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.22em] text-fg-muted uppercase">
                    {`0${pillars.indexOf(pillars.find((p) => p.title === title)!) + 1}`}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
