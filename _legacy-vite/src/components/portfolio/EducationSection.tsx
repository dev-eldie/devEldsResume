import { GraduationCap, BookOpen } from "lucide-react";
import { education } from "@/data/resume";
import { useInView } from "@/lib/useInView";

export function EducationSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="education" className="relative py-24 sm:py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-5">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4 reveal" data-inview={inView}>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-magenta mb-5">
              ⌘ 04 · School
            </p>
            <h2 className="font-display font-light text-[clamp(40px,5vw,68px)] leading-[1.1] tracking-[-0.03em] pb-2">
              Where the <span className="italic font-extrabold">basics</span> were burned in.
            </h2>
            <p className="mt-5 text-fg-muted text-[16px] leading-relaxed">
              The fundamentals that everything later was built on top of — algorithms, software craft, and the deep magic of databases.
            </p>
          </div>

          <ol
            className="lg:col-span-8 relative reveal-stagger"
            data-inview={inView}
          >
            {/* Vertical rail */}
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-cyan/40 via-violet/40 to-magenta/40 hidden sm:block" />

            {education.map((e, idx) => {
              const Icon = e.type === "degree" ? GraduationCap : BookOpen;
              return (
                <li key={e.school} className="relative pl-0 sm:pl-16 mb-6 last:mb-0">
                  {/* Node */}
                  <span className="absolute left-2 top-7 hidden sm:grid h-7 w-7 place-items-center rounded-full glass-strong shadow-glow">
                    <Icon className="h-3.5 w-3.5 text-cyan" />
                  </span>

                  <div className="rounded-3xl neo p-6 sm:p-7 lift hover:shadow-glow-violet relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-fg-muted">
                        {e.range}
                      </span>
                      <span className="chip">
                        <Icon className="h-3 w-3 text-lime" />
                        {e.type === "degree" ? "Degree" : "Short course"}
                      </span>
                    </div>

                    <h3 className="mt-4 font-bold text-[22px] sm:text-[24px] leading-[1.2] tracking-tight pb-1">
                      {e.course}
                    </h3>
                    <p className="mt-2 font-display font-normal tracking-[0.02em] text-fg text-[15px]">
                      {e.school}
                    </p>
                    <p className="mt-1 italic text-fg-muted text-[15px]">
                      {e.place}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-fg-dim">
                        Entry
                      </span>
                      <span className="font-display font-black text-[28px] leading-none text-gradient-cv">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
