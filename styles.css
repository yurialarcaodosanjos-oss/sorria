/* ============================================================
   #Sorria — scan.js
   per-shirt logic: read code from URL, route to correct view,
   persist smiles to localStorage, run the onboarding flow.

   Storage shape (in localStorage under "sorria.v1"):
   {
     "ABC123": {
       claimed: false,
       email: null,
       smiles: [
         { city: "Austin, TX", story: "kid waved", ts: 1234567890 }
       ]
     },
     ...
   }
   ============================================================ */

(function () {
  // -------------------- constants --------------------
  var STORAGE_KEY = "sorria.v1";
  var VALID_CODE = /^[A-Z0-9]{3,12}$/i;

  // -------------------- read code from URL --------------------
  function getCode() {
    // try pretty path first: /ABC123 or /SMILE-ABC123
    var path = window.location.pathname.split("/").pop().replace(/\.html$/, "").replace(/^SMILE-/i, "");
    if (path && VALID_CODE.test(path) && path !== "scan" && path !== "index") {
      return path.toUpperCase();
    }
    // then query string: ?code=ABC123
    var params = new URLSearchParams(window.location.search);
    var qp = params.get("code");
    if (qp && VALID_CODE.test(qp)) return qp.toUpperCase();
    // then hash: #ABC123
    var hash = window.location.hash.replace(/^#/, "");
    if (hash && VALID_CODE.test(hash)) return hash.toUpperCase();
    // fallback demo code
    return "7K9X2";
  }

  // -------------------- storage helpers --------------------
  function loadAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function saveAll(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function getShirt(code) {
    var all = loadAll();
    return all[code] || null;
  }

  function setShirt(code, shirt) {
    var all = loadAll();
    all[code] = shirt;
    saveAll(all);
  }

  function newShirt() {
    return { claimed: false, email: null, smiles: [] };
  }

  // -------------------- state --------------------
  var CODE = getCode();
  var shirt = getShirt(CODE);
  var isFirstTime = !shirt || shirt.smiles.length === 0;

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
    // scroll to top on each step
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // initial route
  if (isFirstTime) {
    showView("onboard");
    showStep("greet");
  } else {
    showView("dashboard");
    renderDashboard();
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

    if (!shirt) shirt = newShirt();
    shirt.smiles.push({
      city: city || null,
      story: story || null,
      ts: Date.now()
    });
    setShirt(CODE, shirt);

    showStep("confirm");
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
      if (!shirt) shirt = newShirt();
      shirt.claimed = true;
      shirt.email = email;
      setShirt(CODE, shirt);
      claimBtn.textContent = "✓ check your email";
      claimBtn.style.background = "var(--smile)";
      claimBtn.style.color = "var(--ink)";
      setTimeout(function () {
        showView("dashboard");
        renderDashboard();
      }, 1200);
    });
  }

  // -------------------- dashboard rendering --------------------
  function renderDashboard() {
    if (!shirt) { shirt = newShirt(); setShirt(CODE, shirt); }

    // big number
    document.getElementById("dash-total").textContent = shirt.smiles.length;

    // since
    var oldest = shirt.smiles.length ? shirt.smiles[0].ts : Date.now();
    document.getElementById("dash-since").textContent = formatSinceDate(oldest);

    // history
    var ul = document.getElementById("dash-history");
    ul.innerHTML = "";
    if (shirt.smiles.length === 0) {
      ul.innerHTML = '<li class="history__empty">no smiles yet — wear the shirt.</li>';
      return;
    }
    // newest first
    shirt.smiles.slice().reverse().forEach(function (s) {
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
      shirt.smiles.push({
        city: city || null,
        story: story || null,
        ts: Date.now()
      });
      setShirt(CODE, shirt);
      closeModal();
      toast("smile #" + shirt.smiles.length + " logged ✓");
      renderDashboard();
    });
  }

  // -------------------- reset --------------------
  var resetBtn = document.getElementById("dash-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      var ok = confirm("Reset this shirt's data? All logged smiles for № " + CODE + " will be erased on this device.");
      if (!ok) return;
      var all = loadAll();
      delete all[CODE];
      saveAll(all);
      shirt = null;
      isFirstTime = true;
      showView("onboard");
      showStep("greet");
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
})();
