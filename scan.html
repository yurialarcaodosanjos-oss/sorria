/* ============================================================
   #Sorria — map.js
   loads the world map, plots all smiles (seeded + user-logged),
   renders the recent-stories feed.
   ============================================================ */

(function () {
  // -------------------- storage --------------------
  var STORAGE_KEY = "sorria.v1";

  function loadAllShirts() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  // -------------------- city coordinates --------------------
  // these match the cities offered in the log form on scan.html
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
    "Portland, OR":       { lat: 45.5152, lng: -122.6784 }
  };

  // -------------------- seed data --------------------
  // realistic-looking smiles from "other wearers" so the map feels alive
  // every visitor sees the same seed data so it feels like a real shared world
  var SEED_SMILES = [
    { city: "New York, NY",       story: "kid on the subway pointed and waved",                     shirtCode: "3B8K1", hoursAgo: 0.3 },
    { city: "Austin, TX",         story: "barista drew a smiley on my cup",                          shirtCode: "9M2P4", hoursAgo: 1.2 },
    { city: "Los Angeles, CA",    story: "someone said 'i needed this today'",                       shirtCode: "4F7Q3", hoursAgo: 2.1 },
    { city: "Chicago, IL",        story: null,                                                       shirtCode: "8L1X9", hoursAgo: 3.5 },
    { city: "Seattle, WA",        story: "old man tipped his hat at me",                             shirtCode: "2N5W8", hoursAgo: 5 },
    { city: "Miami, FL",          story: "whole table at brunch smiled back",                        shirtCode: "6T3J5", hoursAgo: 6.4 },
    { city: "Denver, CO",         story: null,                                                       shirtCode: "1V9H2", hoursAgo: 8 },
    { city: "Boston, MA",         story: "girl on the bus said 'love your shirt'",                   shirtCode: "5C4R7", hoursAgo: 10 },
    { city: "San Francisco, CA",  story: "stranger laughed and showed me hers — same shirt",         shirtCode: "7G8Y6", hoursAgo: 14 },
    { city: "Portland, OR",       story: "kid in line at the bakery pointed and grinned",            shirtCode: "3Z1U4", hoursAgo: 18 },
    { city: "New York, NY",       story: "dog walker waved across the street",                       shirtCode: "8K2L5", hoursAgo: 22 },
    { city: "Austin, TX",         story: null,                                                       shirtCode: "4P9N1", hoursAgo: 26 },
    { city: "Los Angeles, CA",    story: "barista wrote 'keep smiling' on my cup",                   shirtCode: "1Q6W3", hoursAgo: 30 },
    { city: "Chicago, IL",        story: "woman on the train told me about her day",                 shirtCode: "9R4T7", hoursAgo: 36 },
    { city: "Miami, FL",          story: null,                                                       shirtCode: "2X8B6", hoursAgo: 44 },
    { city: "Seattle, WA",        story: "kid yelled 'cool shirt!' from a scooter",                  shirtCode: "5V7M4", hoursAgo: 52 },
    { city: "San Francisco, CA",  story: null,                                                       shirtCode: "7C3D8", hoursAgo: 68 },
    { city: "Denver, CO",         story: "couple at the next table smiled together",                 shirtCode: "6F1G9", hoursAgo: 84 },
    { city: "Boston, MA",         story: null,                                                       shirtCode: "0H5J2", hoursAgo: 102 },
    { city: "Portland, OR",       story: "barista said 'this just made my morning'",                 shirtCode: "4A6S8", hoursAgo: 120 }
  ];

  function jitter(coord) {
    // tiny random offset so multiple smiles in same city don't stack
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

  // -------------------- merge with user data --------------------
  function buildUserSmiles() {
    var all = loadAllShirts();
    var result = [];
    Object.keys(all).forEach(function (code) {
      var shirt = all[code];
      (shirt.smiles || []).forEach(function (s) {
        if (!s.city) return;
        var coords = CITY_COORDS[s.city];
        if (!coords) return;
        result.push({
          city: s.city,
          story: s.story,
          shirtCode: code,
          ts: s.ts,
          lat: jitter(coords.lat),
          lng: jitter(coords.lng),
          isYours: true
        });
      });
    });
    return result;
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

  // -------------------- assemble data --------------------
  var seedSmiles = buildSeedSmiles();
  var userSmiles = buildUserSmiles();
  var allSmiles = seedSmiles.concat(userSmiles);
  // sort newest first
  allSmiles.sort(function (a, b) { return b.ts - a.ts; });

  // -------------------- render stats --------------------
  var totalCount = allSmiles.length;
  var citySet = {};
  allSmiles.forEach(function (s) { citySet[s.city] = true; });
  var cityCount = Object.keys(citySet).length;
  var yoursCount = userSmiles.length;

  animateNumber(document.getElementById("stat-total"), totalCount);
  animateNumber(document.getElementById("stat-cities"), cityCount);
  animateNumber(document.getElementById("stat-yours"), yoursCount);

  // -------------------- build map --------------------
  // wrap in try/catch so if Leaflet ever fails to load, the rest of the page still works
  try {
    if (typeof L === "undefined") throw new Error("Leaflet (L) is not defined");

    var map = L.map("map", {
      center: [38.5, -96],         // continental US center for US-only launch
      zoom: 4,
      minZoom: 2,
      maxZoom: 12,
      scrollWheelZoom: false,      // avoid hijacking page scroll
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // -------------------- plot dots --------------------
    var RECENT_THRESHOLD_MS = 6 * 3600 * 1000; // 6 hours

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
    // graceful fallback if the map fails — show a friendly note in the container
    var mapEl = document.getElementById("map");
    if (mapEl) {
      mapEl.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:24px;color:var(--ink-quiet);font-family:var(--display);font-style:italic;font-size:16px;">' +
        'the map could not load right now —<br>but the smiles below are real.' +
        '</div>';
    }
    console.warn("Leaflet failed to initialize:", err);
  }

  // -------------------- render stories feed --------------------
  var feed = document.getElementById("stories-list");
  var recent = allSmiles.slice(0, 12); // newest 12

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
})();
