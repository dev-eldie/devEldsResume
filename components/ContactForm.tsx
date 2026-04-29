"use client";

import { useState } from "react";
import { SendIcon } from "./Icons";

export function ContactForm() {
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      setStatus({ msg: "Please complete all fields before sending.", ok: false });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus({ msg: "✓ Message sent! I'll get back to you within 24 hours.", ok: true });
        form.reset();
      } else {
        setStatus({ msg: "Something went wrong. Try emailing me directly.", ok: false });
      }
    } catch {
      setStatus({ msg: "Network error. Try emailing me directly.", ok: false });
    }
    setSubmitting(false);
  }

  return (
    <form className="contact-card neu reveal" onSubmit={onSubmit} noValidate>
      <h3 style={{ fontSize: 22, marginBottom: 6 }}>Send a message</h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
        I respond within 24 hours · Mon–Fri
      </p>

      <div className="form-group">
        <label htmlFor="name">Your name</label>
        <input className="form-input" id="name" name="name" type="text" placeholder="Juan Dela Cruz" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input className="form-input" id="email" name="email" type="email" placeholder="hello@you.com" required />
      </div>
      <div className="form-group">
        <label htmlFor="message">Tell me about the project</label>
        <textarea
          className="form-textarea"
          id="message"
          name="message"
          placeholder="A short brief — goals, timeline, anything I should know."
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={submitting}>
        <span>{submitting ? "Sending…" : "Send message"}</span>
        <SendIcon />
      </button>

      <p
        style={{
          fontSize: 12,
          color: status?.ok === false ? "#ef4444" : "var(--accent)",
          marginTop: 14,
          minHeight: 16,
        }}
        aria-live="polite"
      >
        {status?.msg ?? ""}
      </p>
    </form>
  );
}
