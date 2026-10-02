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

  // -------------------- seed data (fake smiles for the "alive" look) --------------------
  var SEED_SMILES = [
    { city: "New York, NY",       story: "kid on the subway pointed and waved",       shirtCode: "3B8K1", hoursAgo: 0.3 },
    { city: "Austin, TX",         story: "barista drew a smiley on my cup",            shirtCode: "9M2P4", hoursAgo: 1.2 },
    { city: "Los Angeles, CA",    story: "someone said 'i needed this today'",         shirtCode: "4F7Q3", hoursAgo: 2.1 },
    { city: "Chicago, IL",        story: null,                                         shirtCode: "8L1X9", hoursAgo: 3.5 },
    { city: "Seattle, WA",        story: "old man tipped his hat at me",               shirtCode: "2N5W8", hoursAgo: 5 },
    { city: "Miami, FL",          story: "whole table at brunch smiled back",          shirtCode: "6T3J5", hoursAgo: 6.4 },
    { city: "Denver, CO",         story: null,                                         shirtCode: "1V9H2", hoursAgo: 8 },
    { city: "Boston, MA",         story: "girl on the bus said 'love your shirt'",     shirtCode: "5C4R7", hoursAgo: 10 },
    { city: "San Francisco, CA",  story: "stranger laughed and showed me hers",        shirtCode: "7G8Y6", hoursAgo: 14 },
    { city: "Portland, OR",       story: "kid in line at the bakery pointed",          shirtCode: "3Z1U4", hoursAgo: 18 }
  ];

  function jitter(coord) {
    return coord + (Math.random() - 0.5) * 0.08;
  }

  function buildSeedSmiles() {
    var now = Date.now();
    return SEED_SMILES.map(function (s) {
      var coords = CITY_COORDS[s.city];
      if (!coords) return null;
      return {
        city: s.city,
        story: s.story,
        shirtCode: s.shirtCode,
        ts: now - (s.hoursAgo * 3600 * 1000),
        lat: jitter(coords.lat),
        lng: jitter(coords.lng),
        isYours: false
      };
    }).filter(Boolean);
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
  var seedSmiles = buildSeedSmiles();

  buildUserSmilesAsync().then(function (userSmiles) {
    var allSmiles = seedSmiles.concat(userSmiles);
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
