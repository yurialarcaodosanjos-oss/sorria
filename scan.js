# #Sorria — landing + scan + map

A t-shirt that plays a game: spread smiles, log them on a map, fund kids' causes.

This release contains three working pages plus shared assets:

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
├── scan.js             ← scan page logic (per-shirt state, localStorage)
├── map.js              ← map page logic (Leaflet, seed data, user merge)
├── vendor/leaflet/     ← bundled Leaflet 1.9.4 (no CDN needed)
└── README.md
```

## What each page does

**`index.html`** — the public landing page. The first thing a curious stranger sees when they scan a friend's shirt. Headline, live stats, the shirt's own story, how-it-works, CTA. Reads the shirt code from the URL so the page personalizes itself.

**`scan.html`** — each shirt's own page. Routes to one of two views depending on whether smiles have been logged for that code:
- *First scan*: 5-step onboarding (greet → log → confirm → claim → done)
- *Returning*: dashboard with big counter, history of all smiles, "log another" button

**`map.html`** — the live atlas. Real world map (Leaflet + OpenStreetMap) showing all logged smiles as dots. Orange dots are yours; muted brown are everyone else's. Click any dot to see the story behind it. Stories feed below the map shows the most recent 12.

## How smile data flows

Every smile logged on `scan.html` is stored in browser `localStorage` under the key `sorria.v1`. The map page reads from the same store and merges those user-logged smiles with hardcoded **seed data** (20 fake smiles from "other wearers") so the map looks alive from day one.

This means:
- A wearer logs a smile on their phone → they immediately see it on the map page (orange dot)
- The seed data is the same for everyone, so the map never looks empty
- Each device has its own user data — for "real" multi-device sync you'll add a backend (see below)

## How shirt codes work

Each shirt has a unique code. URLs:
- `scan.html?code=ABC123` — the shirt's own page (this is what the QR label encodes)
- `index.html?code=ABC123` — landing page personalized for that shirt
- `map.html` — same for everyone; user's own dots are highlighted

## Deploy to GitHub Pages

1. Push all files (including the `vendor/` folder) to a public GitHub repo
2. Settings → Pages → Source: Deploy from a branch → main / root → Save
3. Wait 1–2 minutes
4. Live at `https://<your-username>.github.io/<repo-name>/`

Leaflet is bundled locally so the map works even if a CDN fails. The map tiles themselves are loaded from OpenStreetMap (free, no API key) — they'll load fine from any normal browser with internet access.

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
- `/map.html` — see all the dots; log a smile on scan.html and refresh the map to see it appear

## What's next

In priority order:

1. **Real backend** (Supabase recommended) — swap localStorage for hosted DB so all devices share data. Most of the code is already organized for this — `loadAllShirts()` in `map.js` and the storage helpers in `scan.js` are the swap points.
2. **Code generation** — admin page to mint new shirt codes as orders come in (with QR codes for printing onto labels).
3. **A "share this moment" feature** after each log — generates an Instagram-ready image.
4. **Shop with real checkout** — Stripe + your print-on-demand provider.
5. **Magic-link email** for the claim flow.

## Notes for whoever picks this up

- All visual styling lives in CSS variables at the top of `styles.css` — easy to rebrand
- City coordinates are hardcoded in `map.js` — add new cities by extending `CITY_COORDS`
- Seed data is at the top of `map.js` (look for `SEED_SMILES`) — edit the list to change what visitors see by default
- Storage shape is documented at the top of `scan.js`
- Map is mobile-first; scroll-wheel zoom is disabled to avoid hijacking page scroll on the way to the stories feed
