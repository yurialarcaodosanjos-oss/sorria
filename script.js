/* ============================================================
   #Smile — landing page JS
   Pulls live stats from the database. Personalizes if ?code=XXX
   is in the URL (someone just scanned a shirt).
   ============================================================ */

(function () {
  var VALID_CODE = /^[A-Z0-9]{3,12}$/i;

  // Try to find a shirt code in the URL. Returns null if none.
  function getShirtCode() {
    var path = window.location.pathname.replace(/^\//, '').replace(/^SMILE-/i, '');
    if (path && VALID_CODE.test(path) && path !== "index" && path !== "map" && path !== "scan" && path !== "admin") {
      return path.toUpperCase();
    }
    var params = new URLSearchParams(window.location.search);
    var qp = params.get('code');
    if (qp && VALID_CODE.test(qp)) return qp.toUpperCase();
    if (window.location.hash) {
      var h = window.location.hash.replace(/^#/, '');
      if (VALID_CODE.test(h)) return h.toUpperCase();
    }
    return null;
  }

  var code = getShirtCode();

  // ---------- personalize for scanning visitors ----------
  if (code) {
    // show the "you just scanned shirt №…" chip
    var eyebrow = document.getElementById('hero-eyebrow');
    if (eyebrow) eyebrow.hidden = false;

    // show the shirt code in the top nav
    var via = document.getElementById('nav-via');
    if (via) via.hidden = false;

    // populate the code in all the slots
    ['nav-code', 'hero-code', 'story-code', 'cta-code'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = code;
    });

    // swap in the "someone smiled at you" headline
    var headline = document.getElementById('hero-headline');
    if (headline) {
      headline.innerHTML = 'someone smiled<br /><em>at you,</em><br />and now you\'re here.';
    }

    // show the "that's how it spreads" sub-paragraph (only makes sense after scanning)
    var sub = document.getElementById('hero-sub');
    if (sub) sub.hidden = false;

    // show the scan-this-shirt CTA
    var scanLink = document.getElementById('scan-this-shirt');
    if (scanLink) {
      scanLink.href = 'scan.html?code=' + encodeURIComponent(code);
      scanLink.hidden = false;
    }

    // show and populate the shirt's own story card (if there's data)
    loadShirtStory(code);
  }

  // ---------- live stats from the database ----------
  loadLiveStats();

  // ============================================================

  function loadLiveStats() {
    if (!window.db) return;
    window.db.getAllSmiles().then(function (rows) {
      var totalSmiles = rows.length;

      var shirtSet = {};
      var citySet = {};
      rows.forEach(function (s) {
        if (s.code) shirtSet[s.code] = true;
        if (s.city) citySet[s.city] = true;
      });

      animateNumber(document.getElementById('stat-smiles'), totalSmiles);
      animateNumber(document.getElementById('stat-shirts'), Object.keys(shirtSet).length);
      animateNumber(document.getElementById('stat-cities'), Object.keys(citySet).length);
    }).catch(function () {
      // on failure, leave the 0s — honest default
    });
  }

  function loadShirtStory(code) {
    if (!window.db) return;
    window.db.getShirt(code).then(function (shirt) {
      var section = document.getElementById('story-section');
      if (!section) return;

      // always reveal the card once we know whether to populate it
      section.hidden = false;

      var line = document.getElementById('story-line');
      var quote = document.getElementById('story-quote');

      if (!shirt || !shirt.smiles || shirt.smiles.length === 0) {
        if (line) line.innerHTML = 'this shirt is just getting started — be the first to log a smile.';
        return;
      }

      var smiles = shirt.smiles;
      var count = smiles.length;
      var cities = {};
      smiles.forEach(function (s) { if (s.city) cities[s.city] = true; });
      var cityCount = Object.keys(cities).length;

      // most recent smile with a story
      var mostRecent = smiles.slice().sort(function (a, b) { return b.ts - a.ts; });
      var withStory = mostRecent.filter(function (s) { return s.story; })[0];

      if (line) {
        var smilesWord = count === 1 ? 'smile' : 'smiles';
        var cityPart = cityCount > 0
          ? (' across <em>' + cityCount + ' ' + (cityCount === 1 ? 'city' : 'cities') + '</em>')
          : '';
        line.innerHTML = 'this shirt has spread <em>' + count + ' ' + smilesWord + '</em>' + cityPart + '.';
      }

      if (quote && withStory) {
        var where = withStory.city ? ('in ' + escapeHtml(withStory.city) + ': ') : '';
        quote.innerHTML = 'most recent — ' + where + '"' + escapeHtml(withStory.story) + '"';
        quote.hidden = false;
      }
    }).catch(function () {
      // leave the card hidden on error
    });
  }

  // ---------- animation helpers ----------
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateNumber(el) {
    if (!el) return;
    var target = parseInt(el.dataset.target || el.textContent, 10);
    // if element has an animated-target as data, use it; otherwise read from argument
    if (arguments.length > 1 && typeof arguments[1] === 'number') {
      target = arguments[1];
    }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = easeOutCubic(p);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // override: this version takes an explicit target
  animateNumber = function (el, target) {
    if (!el) return;
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  function escapeHtml(s) {
    return String(s).replace(/[<>&"']/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
