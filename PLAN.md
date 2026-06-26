# brazy.it — Build Roadmap

## What's done (phase 1 — working, builds + runs)

- Next.js 16 + React 19 + TypeScript + Tailwind v4 scaffolded
- `output: "standalone"` so it deploys anywhere (Render, Railway, Fly, Docker, Vercel)
- **ProfileConfig schema** (`src/lib/profile/schema.ts`) — the single source of truth. Covers identity, theme, background, effects, splash, audio, social, badges, custom CSS/HTML, SEO, analytics. This is what makes it more customizable than guns.lol / haunt.gg / e-z.bio — every visual knob is data.
- **Default brazy profile** (`src/lib/profile/defaults.ts`) — neon glassmorphism, particles bg, sparkle cursor, click burst, audio player, splash intro, social links, badges.
- **Effects engine** (all client components):
  - `CanvasBackground` — particles, matrix, starfield, rain, snow, bubbles (canvas) + aurora, gradient, grid, image, video, color (CSS)
  - `BackgroundLayer` — switches on type
  - `CursorEffect` — trail, sparkles, dots, rings
  - `ClickEffect` — burst, ripple, hearts, confetti, emojis
  - `AudioPlayer` — pill player + visualizer bars
  - `SplashIntro` — blur/black/glitch/gradient intro with framer-motion
  - `ProfileRenderer` — orchestrates all layers, applies theme tokens, renders card/avatar/bio/social/badges/custom-HTML
- **Brand icons** — inline SVGs for 15 platforms (no font dependency)
- **Pages**:
  - `/` → renders brazy's profile (static)
  - `/[username]` → dynamic server-rendered profile (force-dynamic)
- **Data store** (`src/lib/profile/store.ts`) — abstracted; falls back to seed profiles when Supabase isn't configured, so it runs immediately. Switches to Supabase when env vars are present.
- **Supabase clients** — browser + server SSR clients ready (`@supabase/ssr`)
- **next.config** — `images.remotePatterns` for avatar hosts, `qualities: [75]`

## Verified

- `npm run build` → compiles + type-checks clean, static `/`, dynamic `/[username]`
- `npm run dev` → server returns 200 with correct title, all canvases, audio element present

## What's next (phase 2 — auth + dashboard)

1. **Supabase project** — create free project, run the `profiles` table migration:
   ```sql
   create table profiles (
     id uuid primary key default gen_random_uuid(),
     username text unique not null,
     config jsonb not null default '{}'::jsonb,
     views bigint not null default 0,
     created_at timestamptz not null default now()
   );
   alter table profiles enable row level security;
   ```
2. **Auth** — Supabase Auth with Discord/Google OAuth + email magic link. Add `proxy.ts` (Next 16 renamed middleware.ts → proxy.ts) for session refresh.
3. **Dashboard** (`/dashboard`) — live profile editor that writes `config` JSON to Supabase. Real-time preview.
4. **Claim flow** — reserve a username, signup, start editing.
5. **Stripe** (phase 3) — premium tiers (custom domains, advanced effects, analytics, remove brazy branding).

## Deploy to Render (when ready)

1. Push to GitHub
2. New Web Service on Render → connect repo
3. Build command: `npm install && npm run build`
4. Start command: `node .next/standalone/server.js`
5. Add env vars from `.env.example` (Supabase URL + keys)
6. Custom domain → point `brazy.it` DNS to Render

## Project structure

```
src/
  app/
    layout.tsx, page.tsx, globals.css
    [username]/page.tsx
  components/profile/
    ProfileRenderer.tsx, BackgroundLayer.tsx, CanvasBackground.tsx
    CursorEffect.tsx, ClickEffect.tsx, AudioPlayer.tsx
    SplashIntro.tsx, icons.tsx
  lib/
    utils.ts
    profile/schema.ts, defaults.ts, store.ts
    supabase/client.ts, server.ts
```
