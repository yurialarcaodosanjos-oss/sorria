/* ============================================================
   #Smile — map.js
   loads the world map, plots all smiles via db wrapper,
   geocodes arbitrary city names on-demand with caching.
   ============================================================ */

(function () {
  // -------------------- known cities (instant, no network call) --------------------
  var CITY_COORDS = {
    "Austin, TX":         { lat: 30.2672, lng: -97.7431 },
    "New York, NY":       { lat: 40.7128, lng: -74.0060 },
    "Los Angeles, CA":    { lat: 34.0522, lng: -118.2437 },
    "Chicago, IL":        { lat: 41.8781, lng: -87.6298 },
    "Miami, FL":          { lat: 25.7617, lng: -80.1918 },
    "Seattle, WA":        { lat: 47.6062, lng: -122.3321 },
    "Denver, CO":         { lat: 39.7392, lng: -104.9903 },
    "Boston, MA":         { lat: 42.3601, lng: -71.0589 },
    "San Francisco, CA":  { lat: 37.7749, lng: -122.4194 },
    "San Jose, CA":       { lat: 37.3382, lng: -121.8863 },
    "Portland, OR":       { lat: 45.5152, lng: -122.6784 }
  };

  // tiny coordinate jitter so multiple smiles in the same city don't stack
  function jitter(coord) {
    return coord + (Math.random() - 0.5) * 0.08;
  }

  // -------------------- geocoding (Nominatim with localStorage cache) --------------------
  function getCachedCoord(cityName) {
    try {
      var cache = JSON.parse(localStorage.getItem("smile.geocache") || "{}");
      return cache[cityName] || null;
    } catch (e) { return null; }
  }

  function setCachedCoord(cityName, coord) {
    try {
      var cache = JSON.parse(localStorage.getItem("smile.geocache") || "{}");
      cache[cityName] = coord;
      localStorage.setItem("smile.geocache", JSON.stringify(cache));
    } catch (e) {}
  }

  function geocodeCity(cityName) {
    if (CITY_COORDS[cityName]) return Promise.resolve(CITY_COORDS[cityName]);
    var cached = getCachedCoord(cityName);
    if (cached) return Promise.resolve(cached);
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(cityName);
    return fetch(url, { headers: { "Accept": "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (results) {
        if (!results || !results.length) return null;
        var coord = { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
        setCachedCoord(cityName, coord);
        return coord;
      })
      .catch(function () { return null; });
  }

  // -------------------- user smiles via db API --------------------
  function buildUserSmilesAsync() {
    if (!window.db) return Promise.resolve([]);
    return window.db.getAllSmiles().then(function (rows) {
      var cities = {};
      rows.forEach(function (s) { if (s.city) cities[s.city] = true; });
      var cityNames = Object.keys(cities);

      return Promise.all(cityNames.map(function (name) {
        return geocodeCity(name).then(function (coord) {
          return { name: name, coord: coord };
        });
      })).then(function (resolved) {
        var lookup = {};
        resolved.forEach(function (r) { if (r.coord) lookup[r.name] = r.coord; });

        var out = [];
        rows.forEach(function (s) {
          if (!s.city) return;
          var coord = lookup[s.city];
          if (!coord) return;
          out.push({
            city: s.city,
            story: s.story,
            shirtCode: s.code,
            ts: s.ts,
            lat: jitter(coord.lat),
            lng: jitter(coord.lng),
            isYours: !!s.isYours
          });
        });
        return out;
      });
    }).catch(function (err) {
      console.error("buildUserSmilesAsync failed:", err);
      return [];
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
    return days + "d ago";
  }

  function escapeHtml(s) {
    return String(s).replace(/[<>&"']/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function animateNumber(el, target, prefix) {
    prefix = prefix || "";
    var start = null;
    var duration = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // -------------------- assemble and render --------------------
  buildUserSmilesAsync().then(function (userSmiles) {
    var allSmiles = userSmiles.slice();
    allSmiles.sort(function (a, b) { return b.ts - a.ts; });

    var totalCount = allSmiles.length;
    var citySet = {};
    allSmiles.forEach(function (s) { citySet[s.city] = true; });
    var cityCount = Object.keys(citySet).length;
    var yoursCount = userSmiles.filter(function (s) { return s.isYours; }).length;

    animateNumber(document.getElementById("stat-total"), totalCount);
    animateNumber(document.getElementById("stat-cities"), cityCount);
    animateNumber(document.getElementById("stat-yours"), yoursCount);

    try {
      if (typeof L === "undefined") throw new Error("Leaflet (L) is not defined");

      var map = L.map("map", {
        center: [38.5, -96],
        zoom: 4,
        minZoom: 2,
        maxZoom: 12,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      var RECENT_THRESHOLD_MS = 6 * 3600 * 1000;

      allSmiles.forEach(function (s) {
        var classes = ["smile-dot"];
        if (s.isYours) classes.push("smile-dot--yours");
        if (Date.now() - s.ts < RECENT_THRESHOLD_MS) classes.push("smile-dot--recent");

        var icon = L.divIcon({
          className: "smile-marker",
          html: '<div class="' + classes.join(" ") + '"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        var marker = L.marker([s.lat, s.lng], { icon: icon, riseOnHover: true }).addTo(map);

        var popupHtml =
          '<div class="popup__where">' + escapeHtml(s.city) + '</div>' +
          (s.story ? '<div class="popup__story">"' + escapeHtml(s.story) + '"</div>' : '') +
          '<div class="popup__meta' + (s.isYours ? ' popup__meta--yours' : '') + '">' +
          '№ ' + escapeHtml(s.shirtCode) + ' · ' + timeAgo(s.ts) +
          (s.isYours ? ' · you' : '') +
          '</div>';

        marker.bindPopup(popupHtml, {
          offset: [0, -4],
          closeButton: true,
          autoPan: true
        });
      });
    } catch (err) {
      var mapEl = document.getElementById("map");
      if (mapEl) {
        mapEl.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:24px;color:var(--ink-quiet);font-family:var(--display);font-style:italic;font-size:16px;">' +
          'the map could not load right now —<br>but the smiles below are real.' +
          '</div>';
      }
      console.warn("Leaflet failed to initialize:", err);
    }

    var feed = document.getElementById("stories-list");
    var recent = allSmiles.slice(0, 12);

    if (recent.length === 0) {
      feed.innerHTML = '<li class="stories__empty">no smiles yet. wear the shirt.</li>';
    } else {
      recent.forEach(function (s) {
        var li = document.createElement("li");
        li.className = "story-item";
        li.innerHTML =
          '<div class="story-item__dot' + (s.isYours ? ' story-item__dot--yours' : '') + '"></div>' +
          '<div class="story-item__body">' +
            '<div class="story-item__where' + (s.isYours ? ' story-item__where--yours' : '') + '">' +
              escapeHtml(s.city) +
            '</div>' +
            (s.story ? '<div class="story-item__story">"' + escapeHtml(s.story) + '"</div>' : '') +
            '<div class="story-item__meta">№ ' + escapeHtml(s.shirtCode) + ' · ' + timeAgo(s.ts) + '</div>' +
          '</div>';
        feed.appendChild(li);
      });
    }
  });
})();
