"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="orb o1" />
        <span className="orb o2" />
        <span className="orb o3" />
      </div>
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 28,
        }}
      >
        <form onSubmit={onSubmit} className="neu" style={{ padding: 36, width: "100%", maxWidth: 420 }}>
          <span className="eyebrow">CMS · Admin</span>
          <h1 style={{ fontSize: 28, marginTop: 14, marginBottom: 6 }}>
            <span className="grad-text">Sign in</span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
            Enter your admin password to edit the portfolio content.
          </p>

          <div className="form-group">
            <label htmlFor="pw">Password</label>
            <input
              id="pw"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              autoFocus
            />
          </div>

          {err && (
            <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{err}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 18, fontFamily: '"JetBrains Mono", monospace' }}>
            Default in dev: <code>changeme123</code> — change in <code>.env.local</code>
          </p>
        </form>
      </main>
    </>
  );
}
