/* ============================================================
   #Smile — admin.js
   Password-gated dashboard showing all shirts and smiles.
   ============================================================ */

(function () {
  // -------------------- password gate --------------------
  var SESSION_KEY = "smile.admin_session";
  var cfg = window.SMILE_CONFIG || {};
  var ADMIN_PASSWORD = cfg.ADMIN_PASSWORD || "changeme";

  function isUnlocked() {
    try { return sessionStorage.getItem(SESSION_KEY) === "ok"; } catch (e) { return false; }
  }
  function setUnlocked() {
    try { sessionStorage.setItem(SESSION_KEY, "ok"); } catch (e) {}
  }
  function lock() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  var gate = document.getElementById("gate");
  var dashboard = document.getElementById("dashboard");
  var gateInput = document.getElementById("gate-input");
  var gateSubmit = document.getElementById("gate-submit");
  var gateHint = document.getElementById("gate-hint");

  function showDashboard() {
    gate.hidden = true;
    dashboard.hidden = false;
    loadAll();
  }
  function showGate() {
    gate.hidden = false;
    dashboard.hidden = true;
    setTimeout(function () { gateInput && gateInput.focus(); }, 50);
  }

  function tryUnlock() {
    var val = gateInput.value;
    if (val === ADMIN_PASSWORD) {
      setUnlocked();
      showDashboard();
    } else {
      gateHint.hidden = false;
      gateInput.value = "";
      gateInput.focus();
    }
  }

  gateSubmit.addEventListener("click", tryUnlock);
  gateInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") tryUnlock();
  });

  document.getElementById("lock-btn").addEventListener("click", function () {
    lock();
    showGate();
  });

  if (isUnlocked()) showDashboard(); else showGate();

  // -------------------- data loading --------------------
  var allShirts = []; // [{code, claimed_email, claimed_at, created_at, smiles: [...]}]
  var allSmiles = []; // flat list of all smiles with shirt_code

  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.hidden = false;
    setTimeout(function () { el.hidden = true; }, 2400);
  }

  function timeAgo(ts) {
    var mins = Math.round((Date.now() - ts) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    var days = Math.round(hrs / 24);
    if (days < 30) return days + "d ago";
    return Math.round(days / 30) + "mo ago";
  }

  function formatDate(ts) {
    if (!ts) return "—";
    var d = new Date(ts);
    var now = new Date();
    var sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return "today " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function escapeHtml(s) {
    return String(s).replace(/[<>&"']/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function loadAll() {
    document.getElementById("admin-source").textContent = window.db.isCloud
      ? "source: supabase · live"
      : "source: local storage (supabase not configured)";

    if (window.db.isCloud) {
      loadFromCloud();
    } else {
      loadFromLocal();
    }
  }

  function loadFromCloud() {
    var client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

    Promise.all([
      client.from("shirts").select("*").order("created_at", { ascending: false }),
      client.from("smiles").select("*").order("created_at", { ascending: false }).limit(1000)
    ]).then(function (results) {
      if (results[0].error || results[1].error) {
        toast("couldn't load data — check your supabase connection");
        return;
      }

      var shirtsRaw = results[0].data || [];
      var smilesRaw = results[1].data || [];

      // normalize smiles
      allSmiles = smilesRaw.map(function (s) {
        return {
          id: s.id,
          code: s.shirt_code,
          city: s.city,
          story: s.story,
          ts: new Date(s.created_at).getTime()
        };
      });

      // group smiles by shirt
      var byCode = {};
      allSmiles.forEach(function (s) {
        if (!byCode[s.code]) byCode[s.code] = [];
        byCode[s.code].push(s);
      });

      // build shirts list: pre-registered + any code that has smiles
      var shirtSet = {};
      shirtsRaw.forEach(function (s) { shirtSet[s.code] = s; });
      Object.keys(byCode).forEach(function (code) {
        if (!shirtSet[code]) shirtSet[code] = { code: code, claimed_email: null, claimed_at: null, created_at: null };
      });

      allShirts = Object.keys(shirtSet).map(function (code) {
        var s = shirtSet[code];
        var smiles = byCode[code] || [];
        return {
          code: code,
          claimed_email: s.claimed_email,
          created_at: s.created_at,
          smiles_count: smiles.length,
          first_ts: smiles.length ? smiles[smiles.length - 1].ts : null,
          last_ts: smiles.length ? smiles[0].ts : null
        };
      });

      // sort shirts: most recent activity first, then by code
      allShirts.sort(function (a, b) {
        if (a.last_ts && b.last_ts) return b.last_ts - a.last_ts;
        if (a.last_ts) return -1;
        if (b.last_ts) return 1;
        return a.code.localeCompare(b.code);
      });

      renderStats();
      renderShirts();
      renderSmiles();
      populateShirtFilter();
    });
  }

  function loadFromLocal() {
    window.db.getAllSmiles().then(function (rows) {
      allSmiles = rows.map(function (s) {
        return {
          id: null, // can't delete individual local smiles by id
          code: s.code,
          city: s.city,
          story: s.story,
          ts: s.ts
        };
      });

      var byCode = {};
      allSmiles.forEach(function (s) {
        if (!byCode[s.code]) byCode[s.code] = [];
        byCode[s.code].push(s);
      });

      allShirts = Object.keys(byCode).map(function (code) {
        var smiles = byCode[code];
        smiles.sort(function (a, b) { return b.ts - a.ts; });
        return {
          code: code,
          claimed_email: null,
          created_at: null,
          smiles_count: smiles.length,
          first_ts: smiles[smiles.length - 1].ts,
          last_ts: smiles[0].ts
        };
      });

      allShirts.sort(function (a, b) { return b.last_ts - a.last_ts; });

      renderStats();
      renderShirts();
      renderSmiles();
      populateShirtFilter();
    });
  }

  function renderStats() {
    document.getElementById("s-shirts").textContent = allShirts.length.toLocaleString();
    document.getElementById("s-smiles").textContent = allSmiles.length.toLocaleString();
    var citySet = {};
    allSmiles.forEach(function (s) { if (s.city) citySet[s.city] = true; });
    document.getElementById("s-cities").textContent = Object.keys(citySet).length.toLocaleString();

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var todayCount = allSmiles.filter(function (s) { return s.ts >= today.getTime(); }).length;
    document.getElementById("s-today").textContent = todayCount.toLocaleString();
  }

  function renderShirts() {
    var tbody = document.getElementById("shirts-body");
    if (allShirts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-dash">no shirts yet — mint one below, or wait for your first scan.</td></tr>';
      return;
    }
    tbody.innerHTML = "";
    allShirts.forEach(function (shirt) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td class="code-cell">№ ' + escapeHtml(shirt.code) + '</td>' +
        '<td class="num num-cell">' + shirt.smiles_count + '</td>' +
        '<td class="date-cell">' + (shirt.first_ts ? formatDate(shirt.first_ts) : '<span class="empty-dash">—</span>') + '</td>' +
        '<td class="date-cell">' + (shirt.last_ts ? timeAgo(shirt.last_ts) : '<span class="empty-dash">—</span>') + '</td>' +
        '<td class="claimed-cell">' + (shirt.claimed_email ? escapeHtml(shirt.claimed_email) : '<span class="empty-dash">unclaimed</span>') + '</td>' +
        '<td><a href="scan.html?code=' + encodeURIComponent(shirt.code) + '" target="_blank" style="font-size: 12px; color: var(--ink-soft); text-decoration: underline;">view →</a></td>';
      tbody.appendChild(tr);
    });
  }

  function renderSmiles() {
    var list = document.getElementById("smiles-list");
    var filter = (document.getElementById("filter-input").value || "").toLowerCase();
    var shirtFilter = document.getElementById("shirt-filter").value;

    var filtered = allSmiles.filter(function (s) {
      if (shirtFilter && s.code !== shirtFilter) return false;
      if (!filter) return true;
      var hay = (s.code + " " + (s.city || "") + " " + (s.story || "")).toLowerCase();
      return hay.indexOf(filter) >= 0;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<li class="loading">no smiles match.</li>';
      return;
    }

    list.innerHTML = "";
    filtered.slice(0, 100).forEach(function (s) {
      var li = document.createElement("li");
      li.className = "smile-row";
      li.innerHTML =
        '<div class="smile-row__dot"></div>' +
        '<div class="smile-row__body">' +
          '<div class="smile-row__header">' +
            '<span class="smile-row__code">№ ' + escapeHtml(s.code) + '</span>' +
            '<span class="smile-row__where">' + escapeHtml(s.city || "somewhere") + '</span>' +
          '</div>' +
          (s.story ? '<div class="smile-row__story">"' + escapeHtml(s.story) + '"</div>' : '') +
          '<div class="smile-row__meta">' + timeAgo(s.ts) + ' · ' + formatDate(s.ts) + '</div>' +
        '</div>' +
        (s.id !== null && window.db.isCloud
          ? '<button class="smile-row__delete" data-id="' + s.id + '">delete</button>'
          : '');
      list.appendChild(li);
    });

    // wire delete buttons
    list.querySelectorAll(".smile-row__delete").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = parseInt(btn.dataset.id, 10);
        if (!confirm("Delete this smile? This can't be undone.")) return;
        deleteSmile(id);
      });
    });

    if (filtered.length > 100) {
      var li = document.createElement("li");
      li.className = "loading";
      li.textContent = "showing first 100 of " + filtered.length + " matches";
      list.appendChild(li);
    }
  }

  function populateShirtFilter() {
    var sel = document.getElementById("shirt-filter");
    sel.innerHTML = '<option value="">all shirts</option>';
    allShirts.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.code;
      opt.textContent = "№ " + s.code + " (" + s.smiles_count + ")";
      sel.appendChild(opt);
    });
  }

  function deleteSmile(id) {
    if (!window.db.isCloud) {
      toast("delete only works with supabase");
      return;
    }
    var client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    client.from("smiles").delete().eq("id", id).then(function (res) {
      if (res.error) {
        toast("couldn't delete — " + res.error.message);
        return;
      }
      toast("smile deleted");
      loadAll();
    });
  }

  // -------------------- filter wiring --------------------
  var filterInput = document.getElementById("filter-input");
  var shirtFilterSel = document.getElementById("shirt-filter");
  var filterTimer;
  if (filterInput) {
    filterInput.addEventListener("input", function () {
      clearTimeout(filterTimer);
      filterTimer = setTimeout(renderSmiles, 150);
    });
  }
  if (shirtFilterSel) {
    shirtFilterSel.addEventListener("change", renderSmiles);
  }

  // -------------------- refresh --------------------
  document.getElementById("refresh-btn").addEventListener("click", function () {
    loadAll();
    toast("refreshing…");
  });

  // -------------------- mint new shirt --------------------
  var mintCode = document.getElementById("mint-code");
  var mintSubmit = document.getElementById("mint-submit");
  var mintFeedback = document.getElementById("mint-feedback");

  function showMintFeedback(msg, type) {
    mintFeedback.textContent = msg;
    mintFeedback.className = "mint-feedback " + (type || "");
    mintFeedback.hidden = false;
  }

  mintSubmit.addEventListener("click", function () {
    var code = (mintCode.value || "").trim().toUpperCase();
    if (!/^[A-Z0-9]{3,12}$/.test(code)) {
      showMintFeedback("code must be 3–12 letters or numbers (no spaces or symbols)", "error");
      return;
    }
    if (!window.db.isCloud) {
      showMintFeedback("mint only works with supabase — configure config.js first", "error");
      return;
    }
    var client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    mintSubmit.disabled = true;
    mintSubmit.textContent = "adding…";
    client.from("shirts").upsert({ code: code }, { onConflict: "code" }).then(function (res) {
      mintSubmit.disabled = false;
      mintSubmit.textContent = "add shirt";
      if (res.error) {
        showMintFeedback("couldn't add: " + res.error.message, "error");
        return;
      }
      showMintFeedback("✓ shirt № " + code + " added. QR link: /" + code, "success");
      mintCode.value = "";
      loadAll();
    });
  });
})();
