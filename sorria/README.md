# #Smile — a t-shirt that plays a game

Spread smiles, log them on a map, fund kids' causes.

## What changed in this update

- **"shop" and "get a shirt" buttons hidden** everywhere (nav, hero CTA, map CTA, scan explain step). Nothing to buy during the test phase.
- **City field is now a free-text input** — your friends can type any city, not just the 10 I had hardcoded.
- **Map geocodes arbitrary cities** on-demand using OpenStreetMap's free Nominatim service, with per-browser caching so repeat lookups are instant.
- **Fixed `netlify.toml` rewrite rule** — pretty URLs like `smileshirt.store/SMILE1` now work.

## What's here

```
sorria/
├── index.html          ← landing page
├── scan.html           ← per-shirt page (onboarding + dashboard)
├── map.html            ← live atlas of smiles
├── styles.css          ← shared styles
├── scan.css            ← scan-page styles
├── map.css             ← map-page styles
├── script.js           ← landing page logic
├── scan.js             ← scan page logic
├── map.js              ← map page logic
├── db.js               ← Supabase/localStorage wrapper
├── config.js           ← paste your Supabase keys here
├── supabase_setup.sql  ← SQL to create tables (run once)
├── netlify.toml        ← Netlify deploy + redirects config
├── assets/smiley.png   ← hand-drawn smiley
└── vendor/              ← bundled Leaflet + Gochi Hand font
```

## Deploy

Push to GitHub → Netlify auto-deploys.

Make sure `netlify.toml` is at the **root** of your repo (not in a subfolder). After pushing it, `smileshirt.store/SMILE1` should route correctly.

## URLs to test

- `smileshirt.store/` — landing
- `smileshirt.store/SMILE1` — scan page for SMILE1 (short URL via Netlify)
- `smileshirt.store/scan.html?code=SMILE1` — same, longer URL
- `smileshirt.store/map.html` — the atlas

## Database

With `config.js` filled in with your Supabase keys, the site uses the real database and all shirts/smiles are shared across devices. Without those keys, it falls back to local storage per-device (good for development).
