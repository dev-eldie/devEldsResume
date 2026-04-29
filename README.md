# Eldie Arubang · Portfolio + JSON CMS

A Next.js 15 (App Router) personal portfolio with an in-app admin to edit
content via a JSON file. No external CMS, no database — just code, JSON,
and Tailwind.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **React 19**
- **Tailwind CSS 3.4** + custom CSS tokens for the glass + neumorphism design
- **Zod** for content schema validation

## Local dev

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Admin / CMS

The admin lives at **`/admin`**. On first visit you'll be redirected to
`/admin/login`. The default password is set in `.env.local`:

```
ADMIN_PASSWORD=changeme123
SESSION_SECRET=local-dev-secret-replace-me-with-32-chars
```

> **Change both before deploying anywhere beyond your own machine.**

### How content is stored

All editable content lives in `data/content.json`. The admin form reads it,
lets you edit each section (hero, about, skills, experience, education,
tools, marquee, contact), and writes it back via `PUT /api/content`. The
home page reads the same JSON server-side (`force-dynamic`) so changes
appear immediately on refresh.

### Schema

`lib/schema.ts` defines the Zod schema for `content.json`. Both the read
and write paths validate against it — saves with malformed data are
rejected with a 400.

## Project layout

```
app/
  layout.tsx          # root layout, fonts, theme init script
  page.tsx            # portfolio home (server component)
  globals.css         # design system (tokens + classes)
  admin/
    page.tsx          # admin dashboard (auth-gated)
    login/page.tsx    # login form
  api/
    content/route.ts  # GET/PUT JSON content
    login/route.ts    # POST password → session cookie
    logout/route.ts   # POST clear cookie
components/
  Portfolio.tsx       # main portfolio (server component)
  ClientEffects.tsx   # cursor + magnetic + reveal + counters + tilt + theme toggle
  ContactForm.tsx     # client-side form
  Icons.tsx           # all SVGs
  admin/
    AdminEditor.tsx   # sectioned form
data/
  content.json        # the actual content
lib/
  schema.ts           # Zod schemas
  content.ts          # read/write helpers (server-only)
  auth.ts             # password + session token (HMAC)
```

## Customization tips

- **Colors / theme:** edit the CSS variables at the top of `app/globals.css`
  inside `:root[data-theme="dark"]` and `:root[data-theme="light"]`.
- **Add a skill icon:** drop a new entry into `SkillIcons` in
  `components/Icons.tsx`, then add the matching key to the `iconKey` enum
  in `lib/schema.ts`.
- **Reset content:** edit `data/content.json` directly — it's JSON.

## Notes

- `_legacy-vite/` contains the previous Vite + React setup, untouched.
- This setup is intentionally local-only. No image uploads, no database,
  no remote auth.
