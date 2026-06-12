/* ============================================================
   #Smile — scan.js
   per-shirt logic: read code from URL, route to correct view,
   persist smiles via db.js (which uses Supabase or localStorage),
   run the onboarding flow.

   All storage now goes through window.db (see db.js):
     await db.getShirt(code)         → shirt object or null
     await db.addSmile(code, smile)  → { ok: true }
     await db.claimShirt(code, email) → { ok: true }

   db.isCloud tells you whether Supabase is on (true) or local-only (false).
   ============================================================ */

(function () {
  // -------------------- constants --------------------
  var VALID_CODE = /^[A-Z0-9]{3,12}$/i;

  // -------------------- read code from URL --------------------
  function getCode() {
    var path = window.location.pathname.split("/").pop().replace(/\.html$/, "").replace(/^SMILE-/i, "");
    if (path && VALID_CODE.test(path) && path !== "scan" && path !== "index") {
      return path.toUpperCase();
    }
    var params = new URLSearchParams(window.location.search);
    var qp = params.get("code");
    if (qp && VALID_CODE.test(qp)) return qp.toUpperCase();
    var hash = window.location.hash.replace(/^#/, "");
    if (hash && VALID_CODE.test(hash)) return hash.toUpperCase();
    return "DEMO1";
  }

  // -------------------- state --------------------
  var CODE = getCode();
  var shirt = null; // populated by initialFetch()

  // populate code displays everywhere
  document.querySelectorAll("#nav-code, #greet-code, #confirm-code, #dash-code, #story-code").forEach(function (el) {
    if (el) el.textContent = CODE;
  });

  // -------------------- routing --------------------
  function showView(name) {
    document.getElementById("view-onboard").hidden = (name !== "onboard");
    document.getElementById("view-dashboard").hidden = (name !== "dashboard");
  }

  function showStep(stepName) {
    document.querySelectorAll(".step").forEach(function (el) {
      el.classList.toggle("step--active", el.dataset.step === stepName);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // -------------------- initial load: fetch shirt, route accordingly --------------------
  function initialFetch() {
    return window.db.getShirt(CODE).then(function (s) {
      shirt = s || { code: CODE, claimed: false, email: null, smiles: [] };
      var isFirstTime = !shirt.smiles || shirt.smiles.length === 0;
      if (isFirstTime) {
        showView("onboard");
        showStep("greet");
      } else {
        showView("dashboard");
        renderDashboard();
      }
    });
  }

  // -------------------- step navigation --------------------
  document.querySelectorAll("[data-go]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.dataset.go;
      if (target === "log") {
        showStep("log");
      } else if (target === "confirm") {
        commitFirstSmile();
      } else if (target === "claim") {
        showStep("claim");
      } else if (target === "dashboard") {
        showView("dashboard");
        renderDashboard();
      } else if (target === "greet") {
        showStep("greet");
      } else if (target === "explain") {
        showStep("explain");
      }
    });
  });

  // -------------------- char counter --------------------
  var logStory = document.getElementById("log-story");
  var logChar = document.getElementById("log-char");
  if (logStory && logChar) {
    logStory.addEventListener("input", function () {
      logChar.textContent = logStory.value.length;
    });
  }

  // -------------------- commit first smile --------------------
  function commitFirstSmile() {
    var city = document.getElementById("log-city").value;
    var story = document.getElementById("log-story").value.trim();
    var btn = document.querySelector('.step--active button[data-go="confirm"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = "saving…";
    }

    var smile = { city: city || null, story: story || null, ts: Date.now() };
    window.db.addSmile(CODE, smile).then(function (res) {
      if (!res.ok && res.error) {
        toast("couldn't save — " + res.error);
        if (btn) { btn.disabled = false; btn.textContent = "add to the map"; }
        return;
      }
      shirt.smiles.push(smile);
      showStep("confirm");
    }).catch(function (err) {
      console.error("addSmile failed:", err);
      toast("couldn't save right now — try again");
      if (btn) { btn.disabled = false; btn.textContent = "add to the map"; }
    });
  }

  // -------------------- claim email --------------------
  var claimBtn = document.getElementById("claim-submit");
  if (claimBtn) {
    claimBtn.addEventListener("click", function () {
      var email = document.getElementById("claim-email").value.trim();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        toast("please enter a valid email");
        return;
      }
      claimBtn.disabled = true;
      claimBtn.textContent = "saving…";

      window.db.claimShirt(CODE, email).then(function (res) {
        if (!res.ok) {
          toast("couldn't save — try again");
          claimBtn.disabled = false;
          claimBtn.textContent = "send the link";
          return;
        }
        shirt.claimed = true;
        shirt.email = email;
        claimBtn.textContent = "✓ saved";
        claimBtn.style.background = "var(--smile)";
        claimBtn.style.color = "var(--ink)";
        setTimeout(function () {
          showView("dashboard");
          renderDashboard();
        }, 1100);
      });
    });
  }

  // -------------------- dashboard rendering --------------------
  function renderDashboard() {
    if (!shirt) return;

    document.getElementById("dash-total").textContent = shirt.smiles.length;

    // figure out "since" date — oldest smile is the start
    var sorted = shirt.smiles.slice().sort(function (a, b) { return a.ts - b.ts; });
    var oldest = sorted.length ? sorted[0].ts : Date.now();
    document.getElementById("dash-since").textContent = formatSinceDate(oldest);

    var ul = document.getElementById("dash-history");
    ul.innerHTML = "";
    if (shirt.smiles.length === 0) {
      ul.innerHTML = '<li class="history__empty">no smiles yet — wear the shirt.</li>';
      return;
    }
    // newest first
    var newestFirst = shirt.smiles.slice().sort(function (a, b) { return b.ts - a.ts; });
    newestFirst.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "history__item";
      li.innerHTML =
        '<div class="history__dot"></div>' +
        '<div class="history__body">' +
          '<div class="history__where">' + escapeHtml(s.city || "somewhere") + '</div>' +
          (s.story ? '<div class="history__story">"' + escapeHtml(s.story) + '"</div>' : '') +
          '<div class="history__meta">' + timeAgo(s.ts) + '</div>' +
        '</div>';
      ul.appendChild(li);
    });
  }

  // -------------------- quick-log modal --------------------
  var modal = document.getElementById("quick-modal");
  var dashLogBtn = document.getElementById("dash-log");
  var quickClose = document.getElementById("quick-close");
  var quickBackdrop = document.getElementById("quick-backdrop");
  var quickSubmit = document.getElementById("quick-submit");

  function openModal() {
    modal.hidden = false;
    document.getElementById("quick-story").value = "";
    document.getElementById("quick-city").value = "";
  }
  function closeModal() { modal.hidden = true; }

  if (dashLogBtn) dashLogBtn.addEventListener("click", openModal);
  if (quickClose) quickClose.addEventListener("click", closeModal);
  if (quickBackdrop) quickBackdrop.addEventListener("click", closeModal);

  if (quickSubmit) {
    quickSubmit.addEventListener("click", function () {
      var city = document.getElementById("quick-city").value;
      var story = document.getElementById("quick-story").value.trim();
      var smile = { city: city || null, story: story || null, ts: Date.now() };
      quickSubmit.disabled = true;
      quickSubmit.textContent = "saving…";
      window.db.addSmile(CODE, smile).then(function (res) {
        if (!res.ok && res.error) {
          toast("couldn't save — " + res.error);
        } else {
          shirt.smiles.push(smile);
          toast("smile #" + shirt.smiles.length + " logged ✓");
          renderDashboard();
          closeModal();
        }
        quickSubmit.disabled = false;
        quickSubmit.textContent = "add to the map";
      });
    });
  }

  // -------------------- reset --------------------
  var resetBtn = document.getElementById("dash-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      var msg = window.db.isCloud
        ? "Reset this view? Smiles will stay in the database; this just clears local view."
        : "Reset this shirt's data? All logged smiles for № " + CODE + " will be erased on this device.";
      var ok = confirm(msg);
      if (!ok) return;
      window.db.resetShirt(CODE).then(function () {
        shirt = { code: CODE, claimed: false, email: null, smiles: [] };
        showView("onboard");
        showStep("greet");
      });
    });
  }

  // -------------------- helpers --------------------
  function timeAgo(ts) {
    var mins = Math.round((Date.now() - ts) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    var days = Math.round(hrs / 24);
    if (days < 30) return days + "d ago";
    var months = Math.round(days / 30);
    return months + "mo ago";
  }

  function formatSinceDate(ts) {
    var d = new Date(ts);
    var now = new Date();
    var sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return "today";
    var opts = { month: "short", day: "numeric" };
    if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
    return d.toLocaleDateString(undefined, opts);
  }

  function escapeHtml(s) {
    return String(s).replace(/[<>&"']/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2400);
  }

  // -------------------- kick off --------------------
  initialFetch();
})();
