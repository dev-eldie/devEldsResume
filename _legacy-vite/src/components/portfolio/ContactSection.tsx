import { useState } from "react";
import { Copy, Check, Mail, MapPin, Phone, Globe } from "lucide-react";
import { profile } from "@/data/resume";
import { useInView } from "@/lib/useInView";

type Item = {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  copy?: string;
  tone: string;
};

export function ContactSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [copied, setCopied] = useState<string | null>(null);

  const items: Item[] = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      copy: profile.email,
      tone: "text-cyan",
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^+\d]/g, "")}`,
      copy: profile.phone,
      tone: "text-lime",
    },
    {
      icon: Globe,
      label: "Page",
      value: profile.page,
      href: profile.pageUrl,
      copy: profile.pageUrl,
      tone: "text-violet",
    },
    {
      icon: MapPin,
      label: "Address",
      value: profile.location,
      href: `https://www.openstreetmap.org/search?query=${encodeURIComponent(profile.location)}`,
      tone: "text-magenta",
    },
  ];

  const onCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {}
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-5">
        <div className="rounded-[36px] p-[1.5px] bg-gradient-to-br from-cyan/40 via-violet/40 to-magenta/40">
          <div className="rounded-[34px] glass-strong p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.35),transparent_60%)] blur-2xl" />
            <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.35),transparent_60%)] blur-2xl" />

            <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6 reveal" data-inview={inView}>
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-lime mb-5">
                  ⌘ 06 · Talk
                </p>
                <h2 className="font-display font-light text-[clamp(40px,5vw,72px)] leading-[1.1] tracking-[-0.03em] pb-2">
                  Got a brief?{" "}
                  <span className="italic font-black text-gradient-cv">
                    Let’s
                  </span>{" "}
                  build it.
                </h2>
                <p className="mt-5 max-w-md text-fg-muted text-[16px] leading-relaxed">
                  Open to senior front-end, design-engineering, and UX consulting roles. Async-friendly. Manila hours, but I keep weird ones too.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 bg-gradient-to-r from-cyan to-violet text-ink font-mono text-[12px] tracking-[0.2em] uppercase font-bold lift hover:shadow-glow"
                  >
                    <Mail className="h-4 w-4" />
                    Send a brief
                  </a>
                  <a
                    href={profile.pageUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 neo lift"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="font-mono text-[12px] tracking-[0.2em] uppercase">
                      Behance
                    </span>
                  </a>
                </div>
              </div>

              <ul
                className="lg:col-span-6 grid sm:grid-cols-2 gap-3 reveal-stagger"
                data-inview={inView}
              >
                {items.map((it) => (
                  <li
                    key={it.label}
                    className="rounded-2xl neo p-5 lift relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.24em] uppercase ${it.tone}`}>
                        <it.icon className="h-3.5 w-3.5" />
                        {it.label}
                      </span>
                      {it.copy && (
                        <button
                          type="button"
                          onClick={() => onCopy(it.copy!, it.label)}
                          aria-label={`Copy ${it.label}`}
                          className="grid h-7 w-7 place-items-center rounded-lg hairline text-fg-muted hover:text-cyan hover:border-cyan/40 transition-colors"
                        >
                          {copied === it.label ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <a
                      href={it.href}
                      target={it.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer noopener"
                      className="mt-4 block font-bold text-[16px] tracking-tight break-all hover:text-shimmer"
                    >
                      {it.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
