# #Smile — a t-shirt that plays a game

Spread smiles, log them on a map, fund kids' causes.

## What's here

Four pages plus shared assets:

```
sorria/
├── index.html          ← landing page (curious-stranger flow)
├── scan.html           ← per-shirt page: onboarding + wearer dashboard
├── map.html            ← live atlas of all smiles
├── shop.html           ← placeholder for the shop (next build)
├── styles.css          ← shared styles
├── scan.css            ← scan-page-only styles
├── map.css             ← map-page-only styles
├── script.js           ← landing page logic
├── scan.js             ← scan page logic
├── map.js              ← map page logic
├── db.js               ← database wrapper (Supabase or localStorage)
├── config.js           ← your Supabase credentials (fill these in!)
├── supabase_setup.sql  ← run this once in Supabase to create tables
├── netlify.toml        ← deploy config for Netlify
├── assets/
│   └── smiley.png      ← the hand-drawn smiley
├── vendor/
│   ├── leaflet/        ← bundled map library
│   └── fonts/          ← bundled Gochi Hand font
├── SETUP.md            ← step-by-step setup guide (read this!)
└── README.md
```

## First time setup

**Read `SETUP.md` for the step-by-step.** Two short tasks:

1. Create a free Supabase account, run the SQL script, paste two keys into `config.js`
2. Switch to Netlify hosting (one-time, then it auto-deploys from GitHub)

The site works in **local-only mode** until Supabase is configured — useful for development. Once configured, it switches to the real database automatically.

## How smile data flows

```
[user logs a smile on scan.html]
            ↓
       window.db.addSmile()
            ↓
  [Supabase configured?]
    ↓ yes              ↓ no
  PostgreSQL      localStorage
  (shared)         (per-device)
            ↓
   [appears on map.html for everyone]
```

The `db.js` wrapper makes this completely transparent — your code calls `db.addSmile()`, `db.getShirt()`, etc., and it routes to whichever backend is available.

## How shirt codes work

Each shirt has a unique code. URLs:

- `scan.html?code=ABC123` — the shirt's own page (this is what the QR label encodes)
- `/ABC123` — same thing, shorter (Netlify rewrites it to `scan.html?code=ABC123`)
- `index.html?code=ABC123` — landing page personalized for that shirt
- `map.html` — the live atlas; user's own dots are highlighted

## Local preview

```bash
cd sorria
python3 -m http.server 8000
# then visit http://localhost:8000
```

## URLs to test

- `/` — main landing page
- `/?code=ABC` — landing personalized for code ABC
- `/scan.html?code=NEW` — first-scan flow for a fresh code
- `/scan.html?code=NEW` again — should now show dashboard with your logs
- `/map.html` — see all the dots; log a smile and refresh the map

## What's next

In priority order:

1. ~~Real backend~~ ✅ done (Supabase)
2. ~~Auto-deploy from GitHub~~ ✅ done (Netlify)
3. **Print and distribute 3 test shirts** ← you are here
4. Share-this-moment feature (Instagram-ready image after each log)
5. Admin page to mint codes and view dashboards
6. Real shop with checkout
7. Magic-link email for the claim flow

## Notes for whoever picks this up

- All visual styling lives in CSS variables at the top of `styles.css`
- City coordinates are in `map.js` (`CITY_COORDS`) — add new cities by extending it
- Seed data (the demo smiles on the map) is at the top of `map.js`
- Database schema is in `supabase_setup.sql`
- The `db.js` wrapper is the single seam between UI and storage — replace its `local` or `cloud` implementations to swap backends
- Mobile-first; tested down to 360px wide
