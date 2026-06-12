# #Smile — Setup Guide

You're connecting two free services to make the site real:

1. **Supabase** — the database that stores shirts and smiles
2. **Netlify** — the host that auto-deploys from GitHub

Total time: about 30 minutes. You only do this once.

---

## Part 1: Set up Supabase (15 min)

### 1a. Create your account

Go to https://supabase.com and click **"Start your project"**. Sign in with your GitHub account — it's the fastest way and Supabase uses GitHub for SSO.

### 1b. Create a new project

After signing in, click **"New project"**. You'll see a form:

- **Organization**: leave as default (your personal org)
- **Project name**: `smile` (or whatever you like)
- **Database password**: click "Generate a password" — Supabase will create a strong one. **Save it somewhere safe** (a password manager). You won't need it for the basic test setup but you'll want it if you ever do advanced things.
- **Region**: pick **West US (North California)** since you're in San Jose — closest to your users
- **Pricing plan**: **Free** is fine — generous limits

Click **"Create new project"**. Wait 1–2 minutes for Supabase to provision the database.

### 1c. Create the tables

When the project's ready, you'll land on the dashboard.

1. In the left sidebar, click **"SQL Editor"** (the icon looks like `>_`)
2. Click **"New query"** in the top right
3. Open the file `supabase_setup.sql` from your project folder
4. Copy its entire contents and paste into the SQL editor
5. Click **"Run"** (or press `Cmd/Ctrl + Enter`)

You should see a green "Success" message. If it errors, paste the error in our chat and I'll help.

### 1d. Copy your two keys

1. In the left sidebar, click the **gear icon** (⚙️ Settings) at the bottom
2. Click **"API"** in the settings menu
3. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefghijklmnop.supabase.co`
   - **Project API keys → anon public** — a long string starting with `eyJ...`

   ⚠️ **Important**: copy the `anon public` key, NOT the `service_role` key. The anon key is safe to put in client-side code; the service_role key is a master key you should never expose.

### 1e. Paste them into config.js

In your local project folder, open `config.js` and fill in the two values:

```javascript
window.SMILE_CONFIG = {
  SUPABASE_URL: "https://abcdefghijklmnop.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi...your-long-key..."
};
```

Save the file.

### 1f. Quick local test

Open `scan.html` in your browser locally (or test on your live site once deployed). Open the browser console (right-click → Inspect → Console). You should see:

```
#Smile · cloud DB connected
```

If you see `#Smile · using local storage (Supabase not configured)`, double-check your URL and key in config.js — there's probably a typo.

### 1g. Verify data is going in

Log a test smile through the scan page. Then go back to Supabase:

1. Left sidebar → **"Table Editor"**
2. Click **`smiles`** in the table list
3. You should see your test smile sitting there as a row

If yes — your database is working. Congratulations.

---

## Part 2: Switch from GitHub Pages to Netlify (10 min)

This step replaces the current GitHub Pages hosting. Netlify auto-deploys when you push to GitHub, supports pretty URLs, and is just nicer to use. Your existing repo doesn't need to change.

### 2a. Create your Netlify account

Go to https://netlify.com and click **"Sign up"**. Choose **"Sign up with GitHub"** — this lets Netlify see your repos.

### 2b. Import your existing repo

1. After signing in, click **"Add new site"** → **"Import an existing project"**
2. Click **"GitHub"**
3. Authorize Netlify to access your repos (you can limit it to just your sorria repo if you prefer)
4. Find your sorria repo in the list and click it
5. On the deploy settings screen:
   - **Branch to deploy**: `main`
   - **Build command**: leave empty
   - **Publish directory**: leave as `.` (or empty)
6. Click **"Deploy"**

Wait about 30 seconds. Netlify will give you a temporary URL like `https://amazing-curie-abc123.netlify.app`.

### 2c. (Optional) Get a friendlier subdomain

1. In your site's Netlify dashboard, click **"Domain settings"**
2. Click **"Options" → "Edit site name"**
3. Change it to something memorable like `smile-test` → your site becomes `https://smile-test.netlify.app`

### 2d. Test the pretty URLs

Netlify's config (the `netlify.toml` in your project) makes short codes work as URLs. Try:

- `https://your-site.netlify.app/SMILE1` → should load the scan page for SMILE1
- `https://your-site.netlify.app/scan.html?code=SMILE1` → also works (the original way)

Both go to the same place. This means **your QR codes can use the shorter, cleaner URL format** going forward.

---

## Part 3: Future deploys are automatic

From now on, when you make any change:

1. Commit and push to GitHub (web interface or git)
2. Netlify sees the push and deploys within 30 seconds
3. Done

No more dragging files. No more clicking "Save" in 4 places.

---

## What about your old GitHub Pages site?

It still exists at `username.github.io/sorria/` but won't get new updates. You can:

- Leave it as-is (it'll still work for now)
- Disable it: GitHub repo → Settings → Pages → set Source to "None"

Most people just leave it. It doesn't hurt anything.

---

## Common issues

**"My config.js is in the repo but should it be?"**
Yes — for the test phase, it's fine. The anon key is designed to be public. When you scale up, you'd add Row-Level Security rules in Supabase to restrict what it can do, but for now it's appropriate to commit it.

**"My friend logged a smile but I don't see it on the map"**
First, check the Supabase Table Editor — is the smile in the `smiles` table? If yes, the issue is browser cache; reload the map page. If no, check the friend's browser console for errors.

**"I changed config.js but the site still shows local-only"**
Browser is caching the old config.js. Hard-reload (Cmd+Shift+R / Ctrl+Shift+R) or wait a minute for Netlify to push the update.

**"Can I see all my data in one place?"**
Supabase Table Editor — left sidebar in your Supabase dashboard. You can sort, filter, edit, even export to CSV.

---

## What's next once this is working

- Print your three test shirts with QR codes pointing at SMILE1, SMILE2, SMILE3
- Hand them out (see test plan we discussed earlier)
- Watch real smiles appear in the Supabase dashboard
- Once you have data, we'll build the next features:
  - Share-to-Instagram feature
  - Admin page to mint codes
  - A real shop / checkout
