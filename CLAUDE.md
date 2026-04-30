# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint check
npm start        # Run production server
```

No test suite is configured.

## Architecture

**Next.js 15 portfolio site** with an in-app admin CMS. Uses the App Router with TypeScript. Content lives in `data/content.json` and is cached in Upstash Redis for production reads.

### Data flow

1. `/` — Server component reads content via `lib/content.ts` → renders `components/Portfolio.tsx`
2. `/admin` — Auth-gated editor; fetches/saves content through `/api/content` (GET/PUT)
3. `/api/contact` — Forwards contact form submissions to an email via Resend

### Key files

| Path | Role |
|------|------|
| `lib/schema.ts` | Zod schemas for all content types (source of truth for shape) |
| `lib/content.ts` | Read/write helpers — tries Redis, falls back to `data/content.json` |
| `lib/auth.ts` | HMAC-SHA256 session tokens; password comparison uses `timingSafeEqual` |
| `data/content.json` | Portfolio content (hero, about, skills, experience, education, tools, contact, meta) |
| `app/globals.css` | Entire design system — CSS custom properties for glass/neumorphism tokens, dark/light themes, animated ambient orbs |
| `components/ClientEffects.tsx` | Client-side: cursor glow, magnetic buttons, scroll-reveal, theme toggle |
| `components/admin/AdminEditor.tsx` | Admin form UI — mirrors the Zod schema sections |

### Authentication

Password from `ADMIN_PASSWORD` env var → compared with `timingSafeEqual` → HMAC-SHA256 session token stored in an httpOnly cookie (7-day TTL). `SESSION_SECRET` must be ≥ 32 chars in production.

### Environment variables

```
ADMIN_PASSWORD          # Admin login password
SESSION_SECRET          # HMAC secret (≥ 32 chars in prod)
RESEND_API_KEY          # Resend email API key
KV_REST_API_URL         # Upstash Redis REST URL
KV_REST_API_TOKEN       # Upstash Redis REST token
```

When `KV_REST_API_URL` is absent, `lib/content.ts` reads/writes `data/content.json` directly — this is the local dev path.

### Design system

Theme is stored in `localStorage` key `ea-theme` and set via `data-theme` attribute on `<html>`. All visual tokens (glass surfaces, neumorphic shadows, ambient orbs, gradients) are CSS custom properties defined in `app/globals.css` under `:root`, `:root[data-theme="dark"]`, and `[data-theme="light"]`. Tailwind is used mainly for utilities; the design vocabulary comes from these custom properties.

### Path alias

`@/*` maps to the project root (`./`). Use it for all internal imports.

### Legacy

`_legacy-vite/` is an old Vite prototype — not part of the active build.
