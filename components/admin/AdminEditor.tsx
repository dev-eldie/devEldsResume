"use client";

import { useRef, useState } from "react";
import type { Content } from "@/lib/schema";

type Status = { kind: "idle" | "saving" | "ok" | "err"; msg?: string };

const ICON_KEYS = ["code", "design", "cms", "creative", "commerce"] as const;
const TOOL_KEYS = ["figma", "react", "vue", "ts", "shopify", "wp", "xd", "ps", "ai", "git"] as const;

export function AdminEditor({ initial }: { initial: Content }) {
  const [c, setC] = useState<Content>(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingKind, setUploadingKind] = useState<null | "avatar" | "logo">(null);

  async function uploadFile(file: File, kind: "logo") {
    setUploadingKind(kind);
    setStatus({ kind: "idle" });
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setC((prev) => ({
        ...prev,
        meta: { ...prev.meta, logoUrl: data.url as string },
      }));
      setStatus({ kind: "ok", msg: `Uploaded · click "Save changes" para mai-persist sa content.json` });
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setUploadingKind(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  }

  async function uploadAvatarImage(file: File) {
    setUploadingKind("avatar");
    setStatus({ kind: "idle" });
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "avatar");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setC((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          profile: {
            ...prev.about.profile,
            avatarUrls: [...(prev.about.profile.avatarUrls ?? []), data.url as string],
          },
        },
      }));
      setStatus({ kind: "ok", msg: `Photo added · click "Save changes" para mai-persist.` });
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setUploadingKind(null);
    }
  }

  function removeAvatarImage(idx: number) {
    setC((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        profile: {
          ...prev.about.profile,
          avatarUrls: (prev.about.profile.avatarUrls ?? []).filter((_, i) => i !== idx),
        },
      },
    }));
  }

  function clearAvatar() {
    setC({
      ...c,
      about: { ...c.about, profile: { ...c.about.profile, avatarUrl: "" } },
    });
  }
  function clearLogo() {
    setC({ ...c, meta: { ...c.meta, logoUrl: "" } });
  }

  async function save() {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setStatus({ kind: "ok", msg: "Saved · refresh the home page to see changes" });
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Save failed" });
    }
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  // Helpers (immutable updates)
  const setMeta = (k: keyof Content["meta"], v: string) =>
    setC({ ...c, meta: { ...c.meta, [k]: v } });
  const setHero = (patch: Partial<Content["hero"]>) =>
    setC({ ...c, hero: { ...c.hero, ...patch } });
  const setHeroTitle = (k: keyof Content["hero"]["title"], v: string) =>
    setHero({ title: { ...c.hero.title, [k]: v } });
  const setHeroStat = (i: number, patch: Partial<Content["hero"]["stats"][number]>) => {
    const stats = c.hero.stats.map((s, j) => (j === i ? { ...s, ...patch } : s));
    setHero({ stats });
  };

  const setAbout = (patch: Partial<Content["about"]>) =>
    setC({ ...c, about: { ...c.about, ...patch } });
  const setAboutMeta = (i: number, patch: Partial<Content["about"]["profile"]["meta"][number]>) => {
    const meta = c.about.profile.meta.map((m, j) => (j === i ? { ...m, ...patch } : m)) as Content["about"]["profile"]["meta"];
    setAbout({ profile: { ...c.about.profile, meta } });
  };

  const setSkill = (i: number, patch: Partial<Content["skills"][number]>) =>
    setC({ ...c, skills: c.skills.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  const addSkill = () =>
    setC({
      ...c,
      skills: [
        ...c.skills,
        { iconKey: "code", title: "New skill", description: "Description", tags: [], proficiency: 80 },
      ],
    });
  const delSkill = (i: number) =>
    setC({ ...c, skills: c.skills.filter((_, j) => j !== i) });

  const setExp = (i: number, patch: Partial<Content["experience"][number]>) =>
    setC({ ...c, experience: c.experience.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
  const addExp = () =>
    setC({
      ...c,
      experience: [
        ...c.experience,
        { role: "New role", company: "COMPANY", period: "Year — Year", body: "", stack: [] },
      ],
    });
  const delExp = (i: number) =>
    setC({ ...c, experience: c.experience.filter((_, j) => j !== i) });

  const setEdu = (i: number, patch: Partial<Content["education"][number]>) =>
    setC({ ...c, education: c.education.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
  const addEdu = () =>
    setC({ ...c, education: [...c.education, { period: "", degree: "", school: "" }] });
  const delEdu = (i: number) =>
    setC({ ...c, education: c.education.filter((_, j) => j !== i) });

  const setTool = (i: number, patch: Partial<Content["tools"][number]>) =>
    setC({ ...c, tools: c.tools.map((t, j) => (j === i ? { ...t, ...patch } : t)) });
  const addTool = () =>
    setC({ ...c, tools: [...c.tools, { name: "Tool", iconKey: "git" }] });
  const delTool = (i: number) =>
    setC({ ...c, tools: c.tools.filter((_, j) => j !== i) });

  const setContact = (k: keyof Content["contact"], v: string) =>
    setC({ ...c, contact: { ...c.contact, [k]: v } });

  const tagsToString = (a: string[]) => a.join(", ");
  const stringToTags = (s: string) =>
    s.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="admin-shell">
      <div className="admin-bar glass">
        <div>
          <span className="eyebrow">CMS</span>
          <h1 style={{ fontSize: 18, marginTop: 4 }}>Content editor</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/" target="_blank" rel="noopener" className="btn-tiny">View site ↗</a>
          <button onClick={logout} className="btn-tiny">Sign out</button>
          <button onClick={save} className="btn btn-primary" disabled={status.kind === "saving"}>
            {status.kind === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {status.msg && (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            marginBottom: 16,
            background: status.kind === "err" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
            color: status.kind === "err" ? "#ef4444" : "var(--accent)",
            fontSize: 13,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {status.msg}
        </div>
      )}

      {/* META */}
      <details className="admin-section" open>
        <summary>Site meta</summary>
        <div className="body">
          <div className="row-2">
            <div className="field">
              <label>Name</label>
              <input value={c.meta.name} onChange={(e) => setMeta("name", e.target.value)} />
            </div>
            <div className="field">
              <label>Title (browser tab)</label>
              <input value={c.meta.title} onChange={(e) => setMeta("title", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={c.meta.description} onChange={(e) => setMeta("description", e.target.value)} />
          </div>

          <div className="list-card-head">Logo</div>
          <div className="list-card" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                minHeight: 56,
                padding: 10,
                borderRadius: 14,
                background: "rgba(0,0,0,0.18)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              {c.meta.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={c.meta.logoUrl}
                  alt="logo preview"
                  style={{ display: "block", height: 36, width: "auto", maxWidth: 180, objectFit: "contain" }}
                />
              ) : (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    height: 34,
                    borderRadius: 12,
                    background: "var(--accent-grad)",
                    color: "#fff",
                    boxShadow: "0 8px 22px -8px var(--accent)",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                  }}
                >
                  <svg viewBox="0 0 10 16" height="14" width="9" fill="none" aria-hidden="true">
                    <path d="M7.5 2 L2.5 8 L7.5 14" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>EA</span>
                  <svg viewBox="0 0 14 16" height="14" width="13" fill="none" aria-hidden="true">
                    <path d="M3 14 L8 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M7.5 2 L12.5 8 L7.5 14" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/svg+xml,image/png,image/webp,image/jpeg,image/gif"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadFile(f, "logo");
                }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn-tiny"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingKind === "logo"}
                >
                  {uploadingKind === "logo" ? "Uploading…" : c.meta.logoUrl ? "Replace logo" : "Upload custom logo"}
                </button>
                {c.meta.logoUrl && (
                  <button type="button" className="btn-tiny danger" onClick={clearLogo}>
                    Use default abstract logo
                  </button>
                )}
              </div>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, fontFamily: '"JetBrains Mono", monospace' }}>
                SVG (recommended) · PNG · WebP — max 5 MB. Square works best. Default = built-in abstract EA.Dev mark.
              </p>
              {c.meta.logoUrl && (
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontFamily: '"JetBrains Mono", monospace', wordBreak: "break-all" }}>
                  → {c.meta.logoUrl}
                </p>
              )}
            </div>
          </div>
        </div>
      </details>

      {/* HERO */}
      <details className="admin-section" open>
        <summary>Hero</summary>
        <div className="body">
          <div className="field">
            <label>Status text</label>
            <input value={c.hero.statusText} onChange={(e) => setHero({ statusText: e.target.value })} />
          </div>
          <div className="row-2">
            <div className="field">
              <label>Title line 1</label>
              <input value={c.hero.title.l1} onChange={(e) => setHeroTitle("l1", e.target.value)} />
            </div>
            <div className="field">
              <label>Title (gradient)</label>
              <input value={c.hero.title.l2grad} onChange={(e) => setHeroTitle("l2grad", e.target.value)} />
            </div>
            <div className="field">
              <label>Title (stroke)</label>
              <input value={c.hero.title.l3stroke} onChange={(e) => setHeroTitle("l3stroke", e.target.value)} />
            </div>
            <div className="field">
              <label>Title (italic)</label>
              <input value={c.hero.title.l3italic} onChange={(e) => setHeroTitle("l3italic", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Blurb (HTML allowed: &lt;strong&gt;)</label>
            <textarea value={c.hero.blurb} onChange={(e) => setHero({ blurb: e.target.value })} rows={3} />
          </div>
          <div className="list-card-head">Stats (4)</div>
          {c.hero.stats.map((s, i) => (
            <div key={i} className="list-card">
              <div className="row-3">
                <div className="field">
                  <label>Value</label>
                  <input
                    type="number"
                    value={s.value}
                    onChange={(e) => setHeroStat(i, { value: Number(e.target.value) })}
                  />
                </div>
                <div className="field">
                  <label>Label</label>
                  <input value={s.label} onChange={(e) => setHeroStat(i, { label: e.target.value })} />
                </div>
                <div className="field">
                  <label>Suffix (e.g. %)</label>
                  <input value={s.suffix ?? ""} onChange={(e) => setHeroStat(i, { suffix: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </details>

      {/* ABOUT */}
      <details className="admin-section">
        <summary>About</summary>
        <div className="body">
          <div className="row-2">
            <div className="field">
              <label>Eyebrow</label>
              <input value={c.about.eyebrow} onChange={(e) => setAbout({ eyebrow: e.target.value })} />
            </div>
            <div className="field">
              <label>Profile role tag</label>
              <input
                value={c.about.profile.role}
                onChange={(e) => setAbout({ profile: { ...c.about.profile, role: e.target.value } })}
              />
            </div>
            <div className="field">
              <label>Heading (lead)</label>
              <input value={c.about.headingLead} onChange={(e) => setAbout({ headingLead: e.target.value })} />
            </div>
            <div className="field">
              <label>Heading (gradient)</label>
              <input value={c.about.headingGrad} onChange={(e) => setAbout({ headingGrad: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Sub headline</label>
            <textarea value={c.about.sub} onChange={(e) => setAbout({ sub: e.target.value })} />
          </div>
          <div className="field">
            <label>Career objective</label>
            <textarea value={c.about.objective} onChange={(e) => setAbout({ objective: e.target.value })} />
          </div>
          <div className="field">
            <label>Objective (secondary line)</label>
            <textarea value={c.about.objectiveSecondary} onChange={(e) => setAbout({ objectiveSecondary: e.target.value })} />
          </div>
          <div className="list-card-head">Profile photos (slider)</div>
          <div className="list-card">
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14, fontFamily: '"JetBrains Mono", monospace' }}>
              Upload multiple photos — they auto-rotate in the About section with a pixelated transition.
            </p>
            <div className="avatar-grid">
              {(c.about.profile.avatarUrls ?? []).map((url, i) => (
                <div key={i} className="avatar-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Photo ${i + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeAvatarImage(i)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="avatar-add">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hidden
                  disabled={uploadingKind === "avatar"}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadAvatarImage(f);
                    e.target.value = "";
                  }}
                />
                {uploadingKind === "avatar" ? "Uploading…" : "+ Add photo"}
              </label>
            </div>
            {c.about.profile.avatarUrl && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "rgba(255,200,0,0.06)", border: "1px solid rgba(255,200,0,0.14)" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: '"JetBrains Mono", monospace', margin: 0, wordBreak: "break-all" }}>
                  Legacy single photo: {c.about.profile.avatarUrl}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn-tiny"
                    onClick={() => {
                      const url = c.about.profile.avatarUrl;
                      if (url) {
                        setC((prev) => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            profile: {
                              ...prev.about.profile,
                              avatarUrls: [...(prev.about.profile.avatarUrls ?? []), url],
                              avatarUrl: "",
                            },
                          },
                        }));
                      }
                    }}
                  >
                    Migrate to slider
                  </button>
                  <button type="button" className="btn-tiny danger" onClick={clearAvatar}>
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="list-card-head">Profile meta (4)</div>
          {c.about.profile.meta.map((m, i) => (
            <div key={i} className="list-card">
              <div className="row-2">
                <div className="field">
                  <label>Key</label>
                  <input value={m.k} onChange={(e) => setAboutMeta(i, { k: e.target.value })} />
                </div>
                <div className="field">
                  <label>Value</label>
                  <input value={m.v} onChange={(e) => setAboutMeta(i, { v: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </details>

      {/* SKILLS */}
      <details className="admin-section">
        <summary>Skills ({c.skills.length})</summary>
        <div className="body">
          {c.skills.map((s, i) => (
            <div key={i} className="list-card">
              <div className="list-card-head">
                <span>Skill #{i + 1}</span>
                <button className="btn-tiny danger" onClick={() => delSkill(i)} type="button">Remove</button>
              </div>
              <div className="row-2">
                <div className="field">
                  <label>Title</label>
                  <input value={s.title} onChange={(e) => setSkill(i, { title: e.target.value })} />
                </div>
                <div className="field">
                  <label>Icon</label>
                  <select
                    value={s.iconKey}
                    onChange={(e) => setSkill(i, { iconKey: e.target.value as Content["skills"][number]["iconKey"] })}
                  >
                    {ICON_KEYS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea value={s.description} onChange={(e) => setSkill(i, { description: e.target.value })} />
              </div>
              <div className="row-2">
                <div className="field">
                  <label>Tags (comma-separated)</label>
                  <input
                    value={tagsToString(s.tags)}
                    onChange={(e) => setSkill(i, { tags: stringToTags(e.target.value) })}
                  />
                </div>
                <div className="field">
                  <label>Proficiency (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={s.proficiency}
                    onChange={(e) => setSkill(i, { proficiency: Math.max(0, Math.min(100, Number(e.target.value))) })}
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="btn-tiny" onClick={addSkill} type="button">+ Add skill</button>
        </div>
      </details>

      {/* EXPERIENCE */}
      <details className="admin-section">
        <summary>Experience ({c.experience.length})</summary>
        <div className="body">
          {c.experience.map((e, i) => (
            <div key={i} className="list-card">
              <div className="list-card-head">
                <span>Role #{i + 1}</span>
                <button className="btn-tiny danger" onClick={() => delExp(i)} type="button">Remove</button>
              </div>
              <div className="row-2">
                <div className="field">
                  <label>Role</label>
                  <input value={e.role} onChange={(ev) => setExp(i, { role: ev.target.value })} />
                </div>
                <div className="field">
                  <label>Company</label>
                  <input value={e.company} onChange={(ev) => setExp(i, { company: ev.target.value })} />
                </div>
              </div>
              <div className="field">
                <label>Period</label>
                <input value={e.period} onChange={(ev) => setExp(i, { period: ev.target.value })} />
              </div>
              <div className="field">
                <label>Body</label>
                <textarea value={e.body} onChange={(ev) => setExp(i, { body: ev.target.value })} rows={4} />
              </div>
              <div className="field">
                <label>Stack tags (comma-separated)</label>
                <input
                  value={tagsToString(e.stack)}
                  onChange={(ev) => setExp(i, { stack: stringToTags(ev.target.value) })}
                />
              </div>
            </div>
          ))}
          <button className="btn-tiny" onClick={addExp} type="button">+ Add experience</button>
        </div>
      </details>

      {/* EDUCATION */}
      <details className="admin-section">
        <summary>Education ({c.education.length})</summary>
        <div className="body">
          {c.education.map((e, i) => (
            <div key={i} className="list-card">
              <div className="list-card-head">
                <span>Entry #{i + 1}</span>
                <button className="btn-tiny danger" onClick={() => delEdu(i)} type="button">Remove</button>
              </div>
              <div className="field">
                <label>Period</label>
                <input value={e.period} onChange={(ev) => setEdu(i, { period: ev.target.value })} />
              </div>
              <div className="field">
                <label>Degree</label>
                <input value={e.degree} onChange={(ev) => setEdu(i, { degree: ev.target.value })} />
              </div>
              <div className="field">
                <label>School / details</label>
                <input value={e.school} onChange={(ev) => setEdu(i, { school: ev.target.value })} />
              </div>
            </div>
          ))}
          <button className="btn-tiny" onClick={addEdu} type="button">+ Add education</button>
        </div>
      </details>

      {/* TOOLS */}
      <details className="admin-section">
        <summary>Tools ({c.tools.length})</summary>
        <div className="body">
          {c.tools.map((t, i) => (
            <div key={i} className="list-card">
              <div className="list-card-head">
                <span>Tool #{i + 1}</span>
                <button className="btn-tiny danger" onClick={() => delTool(i)} type="button">Remove</button>
              </div>
              <div className="row-2">
                <div className="field">
                  <label>Name</label>
                  <input value={t.name} onChange={(e) => setTool(i, { name: e.target.value })} />
                </div>
                <div className="field">
                  <label>Icon key</label>
                  <select value={t.iconKey} onChange={(e) => setTool(i, { iconKey: e.target.value })}>
                    {TOOL_KEYS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button className="btn-tiny" onClick={addTool} type="button">+ Add tool</button>
        </div>
      </details>

      {/* MARQUEE */}
      <details className="admin-section">
        <summary>Marquee strip</summary>
        <div className="body">
          <div className="field">
            <label>Items (comma-separated)</label>
            <input
              value={tagsToString(c.marquee)}
              onChange={(e) => setC({ ...c, marquee: stringToTags(e.target.value) })}
            />
          </div>
        </div>
      </details>

      {/* CONTACT */}
      <details className="admin-section">
        <summary>Contact</summary>
        <div className="body">
          <div className="row-2">
            <div className="field">
              <label>Eyebrow</label>
              <input value={c.contact.eyebrow} onChange={(e) => setContact("eyebrow", e.target.value)} />
            </div>
            <div className="field">
              <label>Heading (lead)</label>
              <input value={c.contact.headingLead} onChange={(e) => setContact("headingLead", e.target.value)} />
            </div>
            <div className="field">
              <label>Heading (gradient)</label>
              <input value={c.contact.headingGrad} onChange={(e) => setContact("headingGrad", e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={c.contact.phone} onChange={(e) => setContact("phone", e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={c.contact.email} onChange={(e) => setContact("email", e.target.value)} />
            </div>
            <div className="field">
              <label>Portfolio label</label>
              <input value={c.contact.portfolio} onChange={(e) => setContact("portfolio", e.target.value)} />
            </div>
            <div className="field">
              <label>Portfolio URL</label>
              <input value={c.contact.portfolioUrl} onChange={(e) => setContact("portfolioUrl", e.target.value)} />
            </div>
            <div className="field">
              <label>Location</label>
              <input value={c.contact.location} onChange={(e) => setContact("location", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Sub headline</label>
            <textarea value={c.contact.sub} onChange={(e) => setContact("sub", e.target.value)} />
          </div>
        </div>
      </details>

      <div style={{ marginTop: 28, textAlign: "center" }}>
        <button onClick={save} className="btn btn-primary" disabled={status.kind === "saving"}>
          {status.kind === "saving" ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
