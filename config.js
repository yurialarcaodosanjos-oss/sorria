/* ============================================================
   #Smile — Supabase config
   ============================================================
   
   You need to fill in these two values from your Supabase project:
   
   1. Go to https://supabase.com and create a free account
   2. Create a new project (pick US West region)
   3. Once it's ready, go to Project Settings → API
   4. Copy "Project URL" → paste below as SUPABASE_URL
   5. Copy "anon public" key (NOT service_role!) → paste below as SUPABASE_ANON_KEY
   
   The anon key is safe to expose in client-side code — that's what it's
   designed for. Just never paste the "service_role" key here.
   
   Until you fill these in, the site falls back to local-only storage
   (the old behavior) so it still works for testing.
   ============================================================ */

window.SMILE_CONFIG = {
  SUPABASE_URL: "",      // e.g. "https://abcdefghijklmnop.supabase.co"
  SUPABASE_ANON_KEY: ""  // e.g. "eyJhbGciOi..." (long string)
};
