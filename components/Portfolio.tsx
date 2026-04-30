import Image from "next/image";
import type { Content } from "@/lib/schema";
import { ClientEffects, ThemeToggle } from "./ClientEffects";
import { ContactForm } from "./ContactForm";
import { DefaultLogoTag } from "./Logo";
import { HorizontalScrollWrapper } from "./HorizontalScrollWrapper";
import { ProfileSlider } from "./ProfileSlider";
import {
  ArrowRight,
  FileIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  SkillIcons,
  ToolIcons,
  SocialBehance,
  SocialGitHub,
  SocialLinkedIn,
} from "./Icons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export function Portfolio({ content }: { content: Content }) {
  const c = content;
  const initials = c.meta.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const firstName = c.meta.name.split(" ")[0];

  const sliderImages = [
    ...(c.about.profile.avatarUrls ?? []),
    c.about.profile.avatarUrl,
  ].filter(Boolean) as string[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: c.meta.name,
            jobTitle: c.about.profile.role,
            description: c.meta.description,
            url: SITE_URL,
          }),
        }}
      />

      <a href="#top" className="skip-link">Skip to content</a>

      <div className="ambient" aria-hidden="true">
        <span className="orb o1" />
        <span className="orb o2" />
        <span className="orb o3" />
      </div>

      <ClientEffects />

      <nav className="nav glass" aria-label="Primary">
        <a href="#top" className="nav-logo">
          {c.meta.logoUrl ? (
            c.meta.logoUrl.startsWith("/") ? (
              <Image
                src={c.meta.logoUrl}
                alt={c.meta.name}
                width={120}
                height={40}
                className="logo-uploaded"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.meta.logoUrl} alt={c.meta.name} className="logo-uploaded" />
            )
          ) : (
            <DefaultLogoTag />
          )}
        </a>
        <div className="nav-links">
          <a className="nav-link active" href="#about">About</a>
          <a className="nav-link" href="#skills">Skills</a>
          <a className="nav-link" href="#experience">Experience</a>
          <a className="nav-link" href="#education">Education</a>
          <a className="nav-link" href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <a href="#contact" className="nav-cta">Let&apos;s talk</a>
        </div>
      </nav>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="shell">
            <span className="hero-status reveal">
              <span className="pulse-dot" />
              {c.hero.statusText}
            </span>

            <h1 className="hero-title reveal">
              {c.hero.title.l1}
              <br />
              <span className="grad-text">{c.hero.title.l2grad}</span> &amp;
              <br />
              <span className="stroke">{c.hero.title.l3stroke}</span>{" "}
              <span className="italic">{c.hero.title.l3italic}</span>
            </h1>

            <div className="hero-row">
              <div>
                <p
                  className="hero-blurb reveal"
                  dangerouslySetInnerHTML={{ __html: c.hero.blurb }}
                />
                <div className="hero-actions reveal">
                  <a href="#contact" className="btn btn-primary" data-magnetic>
                    <span>Start a project</span>
                    <ArrowRight />
                  </a>
                  <a href="#experience" className="btn btn-ghost" data-magnetic>
                    <FileIcon />
                    <span>View résumé</span>
                  </a>
                </div>
              </div>

              <div className="hero-meta reveal">
                {c.hero.stats.map((s, i) => (
                  <div key={i} className="stat-card neu-soft">
                    <div className="num">
                      <span data-counter={s.value}>0</span>
                      {s.suffix}
                    </div>
                    <div className="lbl">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="scroll-cue reveal">
              <span className="line" /> Scroll to explore
            </div>
          </div>

          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[...c.marquee, ...c.marquee].map((m, i) => (
                <span key={i} className="marquee-item">
                  {m}
                  <span className="dot" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section">
          <div className="shell">
            <header className="section-head reveal">
              <span className="eyebrow">{c.about.eyebrow}</span>
              <h2 className="section-title">
                {c.about.headingLead}
                <br />
                <em className="grad-text">{c.about.headingGrad}</em>
              </h2>
              <p className="section-sub">{c.about.sub}</p>
            </header>

            <div className="about-grid">
              <div className="profile-card glass reveal">
                <div className="profile-avatar">
                  {sliderImages.length > 0 ? (
                    <ProfileSlider images={sliderImages} alt={c.meta.name} />
                  ) : (
                    <span className="initials">{initials}</span>
                  )}
                </div>
                <h3 className="profile-name">{c.meta.name}</h3>
                <p className="profile-role">{c.about.profile.role}</p>
                <div className="profile-meta">
                  {c.about.profile.meta.map((m, i) => (
                    <div key={i} className="meta-item">
                      <span className="k">{m.k}</span>
                      <span className="v">{m.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="objective-card neu reveal">
                <span className="eyebrow">Career objective</span>
                <p className="objective-text" style={{ marginTop: 18 }}>
                  {c.about.objective}
                </p>
                <p
                  className="objective-text"
                  style={{
                    marginTop: 14,
                    fontSize: "clamp(16px, 1.6vw, 19px)",
                    color: "var(--text-soft)",
                  }}
                >
                  {c.about.objectiveSecondary}
                </p>
                <div className="signature">
                  <span className="sig-mark">{initials}</span>
                  <span className="meta-text">— {firstName} · 2011 – present</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HORIZONTAL SCROLL: Skills → Experience → Education */}
        <HorizontalScrollWrapper>
          {/* SKILLS */}
          <section id="skills" className="h-panel">
            <div className="h-number" aria-hidden="true">02</div>
            <div className="shell h-panel-inner">
              <header className="section-head h-reveal">
                <span className="eyebrow">02 · Toolkit</span>
                <h2 className="section-title">
                  Skills, sharpened by <em className="grad-text">15 years of shipping</em>.
                </h2>
                <p className="section-sub">
                  Production-grade tools I reach for daily — and the deeper expertise that surrounds the code.
                </p>
              </header>

              <div className="skills-grid">
                {c.skills.map((s, i) => {
                  const Icon = SkillIcons[s.iconKey] ?? SkillIcons.code;
                  return (
                    <article key={i} className="skill-card glass h-reveal">
                      <div className="skill-icon">
                        <Icon />
                      </div>
                      <h3 className="skill-title">{s.title}</h3>
                      <p style={{ color: "var(--text-soft)", fontSize: 14 }}>{s.description}</p>
                      <div className="skill-tags">
                        {s.tags.map((t, j) => (
                          <span key={j} className="tag">{t}</span>
                        ))}
                      </div>
                      <div className="skill-bar" data-w={`${s.proficiency}%`}>
                        <span className="fill" />
                      </div>
                      <div className="skill-pct">PROFICIENCY · {s.proficiency}%</div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section id="experience" className="h-panel">
            <div className="h-number" aria-hidden="true">03</div>
            <div className="shell h-panel-inner">
              <header className="section-head h-reveal">
                <span className="eyebrow">03 · Experience</span>
                <h2 className="section-title">
                  {c.experience.length}+ companies. <em className="grad-text">One discipline.</em>
                  <br />
                  Always shipping.
                </h2>
                <p className="section-sub">
                  A timeline of teams I&apos;ve contributed to — from my first PHP role at Brokerhouse Inc. to Henkel APSC&apos;s process expertise.
                </p>
              </header>

              <div className="timeline h-timeline">
                {c.experience.map((exp, i) => (
                  <div key={i} className="tl-item h-reveal">
                    <article className="tl-card glass-strong">
                      <div className="tl-head">
                        <div>
                          <h3 className="tl-role">{exp.role}</h3>
                          <div className="tl-company">{exp.company}</div>
                        </div>
                        <span className="tl-period">{exp.period}</span>
                      </div>
                      <p className="tl-body">{exp.body}</p>
                      <div className="tl-stack">
                        {exp.stack.map((t, j) => (
                          <span key={j} className="tag">{t}</span>
                        ))}
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* EDUCATION + TOOLS */}
          <section id="education" className="h-panel">
            <div className="h-number" aria-hidden="true">04</div>
            <div className="shell h-panel-inner">
              <header className="section-head h-reveal">
                <span className="eyebrow">04 · Education &amp; Toolkit</span>
                <h2 className="section-title">
                  Formal training, <em className="grad-text">forever sharpening</em>.
                </h2>
              </header>

              <div className="two-col">
                <div className="panel glass h-reveal">
                  <h3 className="panel-title">
                    <span>Education</span>
                    <span className="num-tag">{String(c.education.length).padStart(2, "0")} entries</span>
                  </h3>
                  {c.education.map((e, i) => (
                    <div key={i} className="edu-item">
                      <span className="edu-period">{e.period}</span>
                      <h4 className="edu-degree">{e.degree}</h4>
                      <p className="edu-school">{e.school}</p>
                    </div>
                  ))}
                </div>

                <div className="panel neu h-reveal">
                  <h3 className="panel-title">
                    <span>Daily toolkit</span>
                    <span className="num-tag">{String(c.tools.length).padStart(2, "0")} tools</span>
                  </h3>
                  <div className="tool-grid">
                    {c.tools.map((t, i) => {
                      const Icon = ToolIcons[t.iconKey] ?? ToolIcons.git;
                      return (
                        <div key={i} className="tool" title={t.name}>
                          <Icon />
                          <span>{t.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </HorizontalScrollWrapper>

        {/* CONTACT */}
        <section id="contact" className="section">
          <div className="shell">
            <header className="section-head reveal">
              <span className="eyebrow">{c.contact.eyebrow}</span>
              <h2 className="section-title">
                {c.contact.headingLead}
                <br />
                <em className="grad-text">{c.contact.headingGrad}</em>
              </h2>
              <p className="section-sub">{c.contact.sub}</p>
            </header>

            <div className="contact-grid">
              <aside className="reveal">
                <a href={`tel:${c.contact.phone.replace(/[^\d+]/g, "")}`} className="contact-row" data-magnetic>
                  <div className="contact-icon"><PhoneIcon /></div>
                  <div>
                    <div className="label">Phone</div>
                    <div className="value">{c.contact.phone}</div>
                  </div>
                </a>
                <a href={`mailto:${c.contact.email}`} className="contact-row" data-magnetic>
                  <div className="contact-icon"><MailIcon /></div>
                  <div>
                    <div className="label">Email</div>
                    <div className="value">{c.contact.email}</div>
                  </div>
                </a>
                <a href={c.contact.portfolioUrl} target="_blank" rel="noopener" className="contact-row" data-magnetic>
                  <div className="contact-icon"><GlobeIcon /></div>
                  <div>
                    <div className="label">Portfolio</div>
                    <div className="value">{c.contact.portfolio}</div>
                  </div>
                </a>
                <a href="#" className="contact-row" data-magnetic>
                  <div className="contact-icon"><PinIcon /></div>
                  <div>
                    <div className="label">Location</div>
                    <div className="value">{c.contact.location}</div>
                  </div>
                </a>
              </aside>

              <ContactForm />
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="shell">
            <div className="footer-row">
              <div>
                <div className="nav-logo" style={{ marginBottom: 8 }}>
                  <span className="mark">{initials}</span>
                  <span>{c.meta.name}</span>
                </div>
                <p className="footer-meta">© 2026 — Crafted with care in Quezon City.</p>
              </div>
              <div className="footer-socials">
                <a href={c.contact.portfolioUrl} target="_blank" rel="noopener" aria-label="Behance"><SocialBehance /></a>
                <a href="#" aria-label="LinkedIn"><SocialLinkedIn /></a>
                <a href="#" aria-label="GitHub"><SocialGitHub /></a>
                <a href={`mailto:${c.contact.email}`} aria-label="Email"><MailIcon /></a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
