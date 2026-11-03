/* ============================================================
   #Smile — citypicker.js
   Autocomplete for the "where" field.

   Why this exists: free-text city entry produced duplicates
   ("Chicago" vs "Chicago, IL" counted as two cities). Picking from
   a canonical list means everyone logging the same place writes
   the same string — and we capture its coordinates at the same
   time, so the map never has to guess.

   The city list (assets/cities.js) is ~300 KB, so it is loaded
   lazily the first time someone focuses a city field. Until it
   arrives, the field behaves as plain text — nothing breaks.

   Usage:
     var picker = CityPicker.attach(inputEl);
     picker.getSelection();  // {label, lat, lng} or null
     picker.reset();
   ============================================================ */

window.CityPicker = (function () {
  var CITIES_URL = "assets/cities.js";
  var MIN_CHARS = 2;
  var MAX_RESULTS = 6;

  var loadState = "idle";   // idle | loading | ready | failed
  var loadWaiters = [];

  // -------------------- lazy load the city list --------------------
  function ensureCities() {
    if (loadState === "ready") return Promise.resolve(true);
    if (loadState === "failed") return Promise.resolve(false);
    if (loadState === "loading") {
      return new Promise(function (resolve) { loadWaiters.push(resolve); });
    }

    loadState = "loading";
    return new Promise(function (resolve) {
      loadWaiters.push(resolve);

      var s = document.createElement("script");
      s.src = CITIES_URL;
      s.async = true;

      function settle(ok) {
        loadState = ok ? "ready" : "failed";
        loadWaiters.forEach(function (fn) { fn(ok); });
        loadWaiters = [];
      }

      s.onload = function () {
        settle(Array.isArray(window.SMILE_CITIES) && window.SMILE_CITIES.length > 0);
      };
      s.onerror = function () {
        console.warn("#Smile · city list failed to load; city field stays free-text");
        settle(false);
      };
      document.head.appendChild(s);
    });
  }

  // -------------------- search --------------------
  // cities.js is pre-sorted by population, so within an equal score
  // the bigger city naturally wins.
  function search(query) {
    var list = window.SMILE_CITIES;
    if (!list) return [];

    var q = query.trim().toLowerCase();
    if (q.length < MIN_CHARS) return [];

    var strong = [];   // label starts with query
    var nameHit = [];  // city name starts with query
    var loose = [];    // label contains query anywhere

    for (var i = 0; i < list.length; i++) {
      var label = list[i][0];
      var lower = label.toLowerCase();

      if (lower.indexOf(q) === 0) {
        strong.push(list[i]);
      } else {
        var comma = lower.indexOf(",");
        var namePart = comma === -1 ? lower : lower.slice(0, comma);
        if (namePart.indexOf(q) === 0) {
          nameHit.push(list[i]);
        } else if (lower.indexOf(q) !== -1) {
          loose.push(list[i]);
        }
      }
      // plenty of strong matches already — stop scanning
      if (strong.length >= MAX_RESULTS) break;
    }

    return strong.concat(nameHit).concat(loose).slice(0, MAX_RESULTS);
  }

  // Exact match on the city-name portion, e.g. "chicago" -> "Chicago, IL".
  // Used to snap casual typing to the canonical label on blur.
  function exactNameMatch(query) {
    var list = window.SMILE_CITIES;
    if (!list) return null;
    var q = query.trim().toLowerCase();
    if (!q) return null;

    for (var i = 0; i < list.length; i++) {
      var lower = list[i][0].toLowerCase();
      if (lower === q) return list[i];
      var comma = lower.indexOf(",");
      if (comma !== -1 && lower.slice(0, comma) === q) return list[i];
    }
    return null;
  }

  function escapeHtml(s) {
    return String(s).replace(/[<>&"']/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // -------------------- attach to an input --------------------
  function attach(input) {
    if (!input) return null;

    var wrap = input.parentNode;
    if (getComputedStyle(wrap).position === "static") {
      wrap.style.position = "relative";
    }

    var menu = document.createElement("ul");
    menu.className = "citypicker__menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    wrap.appendChild(menu);

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("autocomplete", "off");

    var results = [];
    var activeIndex = -1;
    var selection = null;   // {label, lat, lng} once chosen from the list

    function close() {
      menu.hidden = true;
      menu.innerHTML = "";
      input.setAttribute("aria-expanded", "false");
      results = [];
      activeIndex = -1;
    }

    function render() {
      if (results.length === 0) { close(); return; }

      menu.innerHTML = results.map(function (row, i) {
        return '<li class="citypicker__item' + (i === activeIndex ? " is-active" : "") +
               '" role="option" data-index="' + i + '"' +
               (i === activeIndex ? ' aria-selected="true"' : '') + '>' +
               escapeHtml(row[0]) + '</li>';
      }).join("");

      menu.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    function choose(i) {
      var row = results[i];
      if (!row) return;
      input.value = row[0];
      selection = { label: row[0], lat: row[1], lng: row[2] };
      close();
      input.dispatchEvent(new Event("citypicker:select"));
    }

    function refresh() {
      results = search(input.value);
      activeIndex = results.length ? 0 : -1;
      render();
    }

    input.addEventListener("focus", function () {
      ensureCities().then(function (ok) {
        if (ok && document.activeElement === input) refresh();
      });
    });

    input.addEventListener("input", function () {
      // typing invalidates any prior pick
      selection = null;
      if (loadState === "ready") {
        refresh();
      } else {
        ensureCities().then(function (ok) {
          if (ok && document.activeElement === input) refresh();
        });
      }
    });

    input.addEventListener("keydown", function (e) {
      if (menu.hidden) {
        if (e.key === "ArrowDown" && loadState === "ready") { refresh(); e.preventDefault(); }
        return;
      }
      if (e.key === "ArrowDown") {
        activeIndex = (activeIndex + 1) % results.length;
        render(); e.preventDefault();
      } else if (e.key === "ArrowUp") {
        activeIndex = (activeIndex - 1 + results.length) % results.length;
        render(); e.preventDefault();
      } else if (e.key === "Enter") {
        if (activeIndex >= 0) { choose(activeIndex); e.preventDefault(); }
      } else if (e.key === "Escape") {
        close();
      }
    });

    // mousedown (not click) so it fires before blur closes the menu
    menu.addEventListener("mousedown", function (e) {
      var li = e.target.closest(".citypicker__item");
      if (!li) return;
      e.preventDefault();
      choose(parseInt(li.dataset.index, 10));
    });

    input.addEventListener("blur", function () {
      setTimeout(function () {
        close();
        // Snap casual typing to the canonical label: "chicago" -> "Chicago, IL".
        // Only on an exact city-name match, so partial words are left alone.
        if (!selection && loadState === "ready" && input.value.trim()) {
          var row = exactNameMatch(input.value);
          if (row) {
            input.value = row[0];
            selection = { label: row[0], lat: row[1], lng: row[2] };
          }
        }
      }, 120);
    });

    return {
      getSelection: function () { return selection; },
      reset: function () { selection = null; input.value = ""; close(); }
    };
  }

  return { attach: attach, ensureCities: ensureCities };
})();
