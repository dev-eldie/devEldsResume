import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  File as FileIcon,
  FileImage,
  FileText,
  Link2,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useInView } from "@/lib/useInView";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  kind: string;
  previewUrl?: string;
};

type LinkEntry = {
  id: string;
  label: string;
  url: string;
};

const STORAGE_KEY = "ea_portfolio_links_v1";

const sampleLinks: LinkEntry[] = [
  { id: "s1", label: "Behance", url: "https://behance.net/earubang" },
  { id: "s2", label: "Henkel — internal calculator suite (case study)", url: "" },
];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function iconFor(kind: string) {
  if (kind.startsWith("image/")) return FileImage;
  if (kind.includes("pdf") || kind.includes("text")) return FileText;
  return FileIcon;
}

export function PortfolioUploadSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [links, setLinks] = useState<LinkEntry[]>(sampleLinks);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  // Persist link list locally (non-Next-specific, but lazy-safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLinks(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch {}
  }, [links]);

  // Revoke object URLs on unmount / removal
  useEffect(() => {
    return () => {
      files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ingest = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list);
    const next: UploadedFile[] = arr.map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      kind: f.type || "application/octet-stream",
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setFiles((prev) => [...next, ...prev].slice(0, 24));
  }, []);

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files?.length) ingest(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const addLink = () => {
    const label = draftLabel.trim();
    const url = draftUrl.trim();
    if (!label && !url) return;
    setLinks((p) => [
      { id: Math.random().toString(36).slice(2, 9), label: label || url, url },
      ...p,
    ]);
    setDraftLabel("");
    setDraftUrl("");
  };

  const removeLink = (id: string) => setLinks((p) => p.filter((l) => l.id !== id));

  return (
    <section id="portfolio" className="relative py-24 sm:py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-5">
        <div className="reveal" data-inview={inView}>
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-cyan mb-5">
            ⌘ 05 · Drop zone
          </p>
          <h2 className="font-display font-light text-[clamp(40px,5vw,68px)] leading-[1.1] tracking-[-0.03em] pb-2">
            Show me what you’ve <span className="italic font-extrabold text-gradient-cv">got</span>.
          </h2>
          <p className="mt-4 max-w-2xl text-fg-muted text-[16px] leading-relaxed">
            Drop case-study PDFs, mockups, screenshots — or paste a link to your live work. Files stay in your browser only; links save locally so you can come back to this list.
          </p>
        </div>

        <div
          className="mt-12 grid lg:grid-cols-12 gap-6 reveal-stagger"
          data-inview={inView}
        >
          {/* Drop zone */}
          <div className="lg:col-span-7">
            <label
              htmlFor="ea-upload"
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              className={[
                "block rounded-3xl p-1 cursor-pointer transition-all",
                drag
                  ? "bg-gradient-to-br from-cyan/40 via-violet/40 to-magenta/40 shadow-glow"
                  : "bg-gradient-to-br from-hairline via-hairline to-hairline",
              ].join(" ")}
            >
              <div
                className={[
                  "rounded-[22px] glass-strong px-6 sm:px-10 py-12 text-center transition-all",
                  drag ? "scale-[1.01]" : "",
                ].join(" ")}
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl neo">
                  <UploadCloud
                    className={[
                      "h-7 w-7 transition-colors",
                      drag ? "text-cyan" : "text-fg-muted",
                    ].join(" ")}
                  />
                </div>
                <p className="mt-5 font-bold text-[22px] tracking-tight">
                  Drag & drop your portfolio here
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase text-fg-muted">
                  PDF · IMG · MP4 · ZIP — or click to browse
                </p>
                <input
                  ref={inputRef}
                  id="ea-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(e) => e.target.files && ingest(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-6 inline-flex items-center gap-2 rounded-full neo px-5 py-2.5 lift hover:shadow-glow"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                    Choose files
                  </span>
                </button>
              </div>
            </label>

            {files.length > 0 && (
              <ul className="mt-5 grid sm:grid-cols-2 gap-3">
                {files.map((f) => {
                  const Icon = iconFor(f.kind);
                  return (
                    <li
                      key={f.id}
                      className="group relative rounded-2xl glass p-3 flex items-center gap-3 lift"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-xl neo overflow-hidden shrink-0">
                        {f.previewUrl ? (
                          <img
                            src={f.previewUrl}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Icon className="h-5 w-5 text-fg-muted" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-[15px]">
                          {f.name}
                        </p>
                        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted">
                          {f.kind || "binary"} · {formatBytes(f.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        aria-label={`Remove ${f.name}`}
                        className="grid h-8 w-8 place-items-center rounded-lg hairline text-fg-muted hover:text-magenta hover:border-magenta/40 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Links panel */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl neo p-6 sm:p-7">
              <div className="flex items-center gap-2 text-violet">
                <Link2 className="h-4 w-4" />
                <h3 className="font-mono text-[11px] tracking-[0.24em] uppercase">
                  Links · saved in your browser
                </h3>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2.5">
                <input
                  value={draftLabel}
                  onChange={(e) => setDraftLabel(e.target.value)}
                  placeholder="Label · e.g. Henkel calc suite"
                  className="rounded-xl neo-inset px-4 py-3 font-medium text-[15px] placeholder:text-fg-dim outline-none focus:shadow-glow"
                />
                <div className="flex gap-2">
                  <input
                    value={draftUrl}
                    onChange={(e) => setDraftUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLink()}
                    placeholder="https://"
                    className="flex-1 rounded-xl neo-inset px-4 py-3 font-mono text-[12px] placeholder:text-fg-dim outline-none focus:shadow-glow"
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="grid place-items-center rounded-xl px-4 bg-gradient-to-br from-cyan to-violet text-ink font-mono text-[11px] tracking-[0.2em] uppercase font-bold lift hover:shadow-glow"
                  >
                    Add
                  </button>
                </div>
              </div>

              <ul className="mt-6 space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {links.length === 0 && (
                  <li className="text-center italic text-fg-muted text-[14px] py-6">
                    No links yet — drop your first one above.
                  </li>
                )}
                {links.map((l) => {
                  const safeUrl = l.url && /^(https?:|mailto:|\/)/.test(l.url) ? l.url : undefined;
                  return (
                    <li
                      key={l.id}
                      className="group flex items-center gap-3 rounded-xl glass px-3 py-2.5 lift"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg hairline text-cyan">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-[14px]">
                          {l.label}
                        </p>
                        {l.url && (
                          <p className="truncate font-mono text-[10px] tracking-[0.12em] text-fg-muted">
                            {l.url}
                          </p>
                        )}
                      </div>
                      {safeUrl && (
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`Open ${l.label}`}
                          className="grid h-8 w-8 place-items-center rounded-lg hairline text-fg-muted hover:text-cyan hover:border-cyan/40 transition-colors"
                        >
                          ↗
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => removeLink(l.id)}
                        aria-label={`Remove ${l.label}`}
                        className="grid h-8 w-8 place-items-center rounded-lg hairline text-fg-muted hover:text-magenta hover:border-magenta/40 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-4 italic text-fg-muted text-[14px] leading-relaxed">
              Files never leave your browser. Hook this up to a real backend (Next.js API route + S3 / R2) when you’re ready to ship.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
