/* ============================================================
   #Sorria — landing page JS
   reads shirt code from URL, animates the counters
   ============================================================ */

(function () {
  // ----- read shirt code from URL -----
  // matches /7K9X2, /SMILE-7K9X2, ?code=7K9X2, or #7K9X2
  function getShirtCode() {
    var path = window.location.pathname.replace(/^\//, '').replace(/^SMILE-/i, '');
    if (path && /^[A-Z0-9]{3,12}$/i.test(path)) return path.toUpperCase();
    var params = new URLSearchParams(window.location.search);
    if (params.get('code')) return params.get('code').toUpperCase();
    if (window.location.hash) {
      var h = window.location.hash.replace(/^#/, '');
      if (/^[A-Z0-9]{3,12}$/i.test(h)) return h.toUpperCase();
    }
    return '7K9X2'; // demo fallback
  }

  var code = getShirtCode();
  ['nav-code', 'hero-code', 'story-code', 'cta-code'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = code;
  });

  // wire the "scan this shirt" CTA to the scan flow with the current code
  var scanLink = document.getElementById('scan-this-shirt');
  if (scanLink) scanLink.href = 'scan.html?code=' + encodeURIComponent(code);

  // ----- count-up for the live numbers -----
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateNumber(el) {
    var target = parseInt(el.dataset.target, 10);
    var prefix = el.dataset.prefix || '';
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutCubic(progress);
      var current = Math.round(target * eased);
      el.textContent = prefix + current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // trigger when the band scrolls into view
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var nums = entry.target.querySelectorAll('.stat__num');
          nums.forEach(animateNumber);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  var band = document.querySelector('.band');
  if (band) observer.observe(band);
})();
