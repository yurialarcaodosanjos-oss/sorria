/* ============================================================
   #Smile — db.js
   Database wrapper for shirts and smiles.
   Routes to Supabase when configured, localStorage otherwise.
   ============================================================ */

(function () {
  var cfg = window.SMILE_CONFIG || {};
  var hasSupabase = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);

  function getVisitorId() {
    try {
      var id = localStorage.getItem("smile.visitor_id");
      if (!id) {
        id = "v_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem("smile.visitor_id", id);
      }
      return id;
    } catch (e) {
      return "v_anon";
    }
  }

  // ---------- LOCAL fallback ----------
  var local = (function () {
    var KEY = "sorria.v1";

    function loadAll() {
      try {
        var raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) { return {}; }
    }

    function saveAll(data) {
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    }

    return {
      getShirt: function (code) {
        var all = loadAll();
        var shirt = all[code];
        if (!shirt) return Promise.resolve(null);
        return Promise.resolve({
          code: code,
          claimed: !!shirt.claimed,
          email: shirt.email || null,
          smiles: shirt.smiles || []
        });
      },

      addSmile: function (code, smile) {
        var all = loadAll();
        if (!all[code]) all[code] = { claimed: false, email: null, smiles: [] };
        all[code].smiles.push({
          city: smile.city || null,
          story: smile.story || null,
          ts: smile.ts || Date.now(),
          visitor_id: getVisitorId()
        });
        saveAll(all);
        return Promise.resolve({ ok: true });
      },

      claimShirt: function (code, email) {
        var all = loadAll();
        if (!all[code]) all[code] = { claimed: false, email: null, smiles: [] };
        all[code].claimed = true;
        all[code].email = email;
        saveAll(all);
        return Promise.resolve({ ok: true });
      },

      getAllSmiles: function () {
        var all = loadAll();
        var out = [];
        Object.keys(all).forEach(function (code) {
          (all[code].smiles || []).forEach(function (s) {
            out.push({
              code: code,
              city: s.city,
              story: s.story,
              ts: s.ts,
              isYours: true
            });
          });
        });
        return Promise.resolve(out);
      },

      resetShirt: function (code) {
        var all = loadAll();
        delete all[code];
        saveAll(all);
        return Promise.resolve({ ok: true });
      }
    };
  })();

  // ---------- CLOUD (Supabase) ----------
  var cloud = null;

  function initCloud() {
    if (!hasSupabase || typeof window.supabase === "undefined") return null;
    var client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

    return {
      getShirt: function (code) {
        return Promise.all([
          client.from("shirts").select("*").eq("code", code).maybeSingle(),
          client.from("smiles").select("*").eq("shirt_code", code).order("created_at", { ascending: false })
        ]).then(function (results) {
          var shirtRes = results[0];
          var smilesRes = results[1];

          if (smilesRes.error) {
            console.error("getShirt smiles error:", smilesRes.error);
            return null;
          }

          var shirt = shirtRes.data;
          var smiles = (smilesRes.data || []).map(function (s) {
            return {
              city: s.city,
              story: s.story,
              ts: new Date(s.created_at).getTime(),
              visitor_id: s.visitor_id
            };
          });

          return {
            code: code,
            claimed: shirt ? !!shirt.claimed_email : false,
            email: shirt ? shirt.claimed_email : null,
            smiles: smiles
          };
        }).catch(function (err) {
          console.error("getShirt failed:", err);
          return null;
        });
      },

      addSmile: function (code, smile) {
        return client.from("shirts")
          .upsert({ code: code }, { onConflict: "code" })
          .then(function () {
            return client.from("smiles").insert({
              shirt_code: code,
              city: smile.city || null,
              story: smile.story || null,
              visitor_id: getVisitorId()
            });
          })
          .then(function (res) {
            if (res.error) {
              console.error("addSmile error:", res.error);
              return { ok: false, error: res.error.message };
            }
            return { ok: true };
          });
      },

      claimShirt: function (code, email) {
        return client.from("shirts")
          .upsert({ code: code, claimed_email: email, claimed_at: new Date().toISOString() }, { onConflict: "code" })
          .then(function (res) {
            if (res.error) {
              console.error("claimShirt error:", res.error);
              return { ok: false, error: res.error.message };
            }
            return { ok: true };
          });
      },

      getAllSmiles: function () {
        return client.from("smiles")
          .select("shirt_code, city, story, created_at, visitor_id")
          .order("created_at", { ascending: false })
          .limit(500)
          .then(function (res) {
            if (res.error) {
              console.error("getAllSmiles error:", res.error);
              return [];
            }
            var visitor = getVisitorId();
            return (res.data || []).map(function (s) {
              return {
                code: s.shirt_code,
                city: s.city,
                story: s.story,
                ts: new Date(s.created_at).getTime(),
                isYours: s.visitor_id === visitor
              };
            });
          });
      },

      resetShirt: function () {
        return Promise.resolve({ ok: true, note: "cloud data preserved; reload to re-fetch" });
      }
    };
  }

  cloud = initCloud();
  var impl = cloud || local;

  window.db = {
    isCloud: !!cloud,
    getShirt: impl.getShirt,
    addSmile: impl.addSmile,
    claimShirt: impl.claimShirt,
    getAllSmiles: impl.getAllSmiles,
    resetShirt: impl.resetShirt,
    visitorId: getVisitorId()
  };

  if (cloud) {
    console.log("%c#Smile · cloud DB connected", "color: #C77E10; font-weight: 500;");
  } else {
    console.log("%c#Smile · using local storage (Supabase not configured)", "color: #8A857D;");
  }
})();
