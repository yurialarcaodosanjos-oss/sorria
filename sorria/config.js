/* ============================================================
   #Smile — Supabase + admin config

   1. Supabase credentials
      Go to https://supabase.com → your project → Settings → API
      Copy "Project URL" → SUPABASE_URL
      Copy "anon public" key → SUPABASE_ANON_KEY

   2. Admin password
      Set a password for the /admin page.
      ⚠️ This is a soft gate — the password is visible in the browser's
      JavaScript source. It keeps casual visitors out but is NOT a real
      security boundary. Don't put anything truly sensitive behind it.
      Change it from "changeme" before deploying.

   Until SUPABASE_URL + SUPABASE_ANON_KEY are filled in, the site uses
   local-only storage.
   ============================================================ */

window.SMILE_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  ADMIN_PASSWORD: "changeme"
};
