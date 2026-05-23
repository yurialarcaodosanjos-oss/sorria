# #Sorria — landing page

A t-shirt that plays a game: spread smiles, log them on a map, fund kids' causes.

This is the **landing page** for curious strangers who scan a shirt label and want to know what they just found.

## What's here

```
sorria/
├── index.html      ← main landing page (the curious-stranger flow)
├── map.html        ← placeholder for the live smile map
├── shop.html       ← placeholder for the shop
├── styles.css      ← shared styles for all pages
├── script.js       ← reads shirt code from URL, animates live counters
└── README.md
```

## How the shirt code works

The page picks up the shirt code from the URL in three possible ways:

- **Pretty path:** `sorria.com/7K9X2` — best for QR codes printed on labels
- **Query string:** `sorria.com/?code=7K9X2`
- **Hash:** `sorria.com/#7K9X2`

If no code is found, it falls back to the demo code `7K9X2` so you can preview the page anywhere.

> Note: pretty paths (`/7K9X2`) require GitHub Pages to be configured to fall back to `index.html`, or you can use the query-string version (`?code=7K9X2`) which works out of the box.

## Deploy to GitHub Pages (5 minutes)

1. **Create a new GitHub repository** named whatever you want — e.g. `sorria-landing`.
2. **Upload all files** from this folder (`index.html`, `map.html`, `shop.html`, `styles.css`, `script.js`).
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment," set Source to `Deploy from a branch`, select `main` (or `master`), folder `/ (root)`, and click Save.
5. Wait 1–2 minutes. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

To test the shirt-code routing, visit:
- `https://<your-site>/?code=ABC123` — works on GitHub Pages out of the box.

## Local preview

Just open `index.html` in a browser. Or run a tiny local server:

```bash
# Python
python3 -m http.server 8000

# Node (if you have npx)
npx serve .
```

Then visit `http://localhost:8000`.

## What to test

- Open the page on your phone, scroll through, time how long it takes to "get" the brand
- Try different codes: `?code=AAA111`, `?code=BBB222` — the page personalizes for each
- Show it to 5 people who've never heard of #Sorria and ask: "what is this?"
- The answer they give back is your real brand pitch

## What's next (not built yet)

- The map (live world map of logged smiles)
- The shop (real product pages, checkout)
- The first-scan flow (when an owner scans their own shirt)
- The returning-visitor experience
- Real backend (database for smile logs, codes, accounts)

This landing page is the front door. Everything else gets built once people walk through it.
