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

1. `/` — Server component reads content via `lib/content.ts` → renders `components/Portfolio.tsx`; marked `force-dynamic` so it's never cached
2. `/admin` — Auth-gated editor; fetches/saves content through `/api/content` (GET/PUT)
3. `/api/login` (POST) — Validates password, sets `SESSION_COOKIE` httpOnly cookie; `force-dynamic`
4. `/api/logout` (POST) — Deletes session cookie; `force-dynamic`
5. `/api/contact` — Forwards contact form submissions to an email via Resend

### Key files

| Path | Role |
|------|------|
| `lib/schema.ts` | Zod schemas for all content types (source of truth for shape) |
| `lib/content.ts` | Read/write helpers — tries Redis, falls back to `data/content.json` |
| `lib/auth.ts` | HMAC-SHA256 session tokens; password comparison uses `timingSafeEqual` |
| `data/content.json` | Portfolio content (hero, about, skills, experience, education, tools, contact, meta) |
| `app/globals.css` | Entire design system — CSS custom properties for glass/neumorphism tokens, dark/light themes, animated ambient orbs |
| `app/layout.tsx` | Root layout — next/font (Space Grotesk, Inter, JetBrains Mono), SEO metadata, OG/Twitter tags |
| `app/sitemap.ts` | Generates `/sitemap.xml` |
| `app/robots.ts` | Generates `/robots.txt` |
| `components/ClientEffects.tsx` | Client-side: cursor glow, magnetic buttons, scroll-reveal, theme toggle; excludes horizontal panel sections from navIO |
| `components/HorizontalScrollWrapper.tsx` | GSAP ScrollTrigger horizontal scroll — pins Skills/Experience/Education panels and slides them; progress rail + per-panel reveal animations |
| `components/ProfileSlider.tsx` | Auto-rotating multi-image carousel for the About profile photo; pixelated CSS transition |
| `components/admin/AdminEditor.tsx` | Admin form UI — mirrors the Zod schema sections; multi-image avatar uploader |
| `components/ContactForm.tsx` | Client-side form; validates name/email/message, posts to `/api/contact`, shows aria-live status |
| `components/Logo.tsx` | Two exports: `DefaultLogoTag` (JSX-tag `⟨ EA /⟩` pill) and `DefaultLogoBare` (SVG, optional `size` prop, default 56px) |
| `components/Icons.tsx` | SVG icon set (ArrowRight, FileIcon, SendIcon, PhoneIcon, MailIcon, GlobeIcon, PinIcon, SunIcon, …) |

### Authentication

Password from `ADMIN_PASSWORD` env var → compared with `timingSafeEqual` → HMAC-SHA256 session token stored in an httpOnly cookie (7-day TTL). `SESSION_SECRET` must be ≥ 32 chars in production.

### Environment variables

```
ADMIN_PASSWORD              # Admin login password
SESSION_SECRET              # HMAC secret (≥ 32 chars in prod)
RESEND_API_KEY              # Resend email API key
KV_REST_API_URL             # Upstash Redis REST URL
KV_REST_API_TOKEN           # Upstash Redis REST token
KV_REST_API_READ_ONLY_TOKEN # Upstash read-only token (optional)
KV_URL                      # Upstash Redis connection string (alias REDIS_URL)
NEXT_PUBLIC_SITE_URL        # Public site URL for OG tags and sitemap
```

When `KV_REST_API_URL` is absent, `lib/content.ts` reads/writes `data/content.json` directly — this is the local dev path.

### Design system

Theme is stored in `localStorage` key `ea-theme` and set via `data-theme` attribute on `<html>`. All visual tokens (glass surfaces, neumorphic shadows, ambient orbs, gradients) are CSS custom properties defined in `app/globals.css` under `:root`, `:root[data-theme="dark"]`, and `[data-theme="light"]`. Tailwind is used mainly for utilities; the design vocabulary comes from these custom properties.

### Path alias

`@/*` maps to the project root (`./`). Use it for all internal imports.

### GSAP horizontal scroll

Skills → Experience → Education panels scroll horizontally after the About section; Contact + Footer return to vertical. Key rules:

- `HorizontalScrollWrapper` uses **dynamic import** of `gsap`/`gsap/ScrollTrigger` inside `useEffect` (not at module level) to avoid SSR errors.
- Panel reveal animations **must** use `gsap.fromTo()`, not `gsap.from()`. The CSS rule `.h-reveal { opacity: 0 }` means `gsap.from({ opacity: 0 })` reads the current CSS value as the "to" target and animates 0→0, leaving content permanently invisible.
- `gsap.matchMedia("(min-width: 768px)")` gates the horizontal scroll; on mobile, panels stack vertically via CSS and `.h-reveal` elements are made visible with `opacity: 1; transform: none`.
- `ClientEffects.tsx` excludes `#skills`, `#experience`, `#education` from its IntersectionObserver nav tracker — GSAP's `onUpdate` handles active-link state for those sections.

### Profile photo slider

`ProfileSlider` renders inside the existing `.profile-avatar` container. It uses a three-phase state machine (`idle → leaving → entering → idle`) to drive CSS class changes. The `bgSrc` blurred background is updated on index change. For local paths (starting with `/`) it uses `<Image fill>` from next/image; external URLs use a plain `<img>`.

### Image upload

`/api/upload` handles photo uploads (kind: `"avatar"` | `"logo"`). Accepts multipart FormData with `file` and `kind` fields; validates MIME type (jpeg, png, webp, gif, svg+xml) and enforces 5 MB max. Files are saved to `public/uploads/` with timestamp-prefixed names and returned as `/uploads/{kind}-{timestamp}.{ext}`. Avatar URLs are stored as `about.profile.avatarUrls: string[]` in the schema; the legacy single `avatarUrl` is kept as fallback. The slider combines both: `[...avatarUrls, avatarUrl].filter(Boolean)`.

### Image optimization

`next.config.mjs` enables AVIF + WebP formats and allows **all** HTTPS remote hostnames (`hostname: "**"`). This means any external URL can be used with `<Image>` — intentional for user-supplied content but worth keeping in mind.

### Deployment

`vercel.json` sets region `sin1` (Singapore). `NEXT_PUBLIC_SITE_URL` must be set as a Vercel environment variable for correct OG/sitemap URLs. Git push to the connected branch auto-deploys.

### Legacy

`_legacy-vite/` is an old Vite prototype — not part of the active build.
