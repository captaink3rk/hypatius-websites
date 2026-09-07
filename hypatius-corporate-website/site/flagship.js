/* ============================================================
   HYPATIUS — Flagship homepage behavior
   Nav state · mobile drawer · scroll reveals · count-up ·
   hero starfield · ticker · contact form · Tweaks protocol
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- NAV scroll state ---------------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('nav--scrolled');
    else nav.classList.remove('nav--scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile drawer ---------------- */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () { drawer.classList.add('drawer--open'); });
    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' || e.target.classList.contains('drawer__close') || e.target === drawer)
        drawer.classList.remove('drawer--open');
    });
  }

  /* ---------------- Scroll reveals ---------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('reveal--visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  reveals.forEach(function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.transitionDelay = d + 'ms';
    io.observe(el);
  });
  // Fallback: IntersectionObserver can fail to fire on initial paint inside
  // some iframe contexts — reveal anything within the viewport on scroll/load.
  function revealInView() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(function (el) {
      if (el.classList.contains('reveal--visible')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add('reveal--visible'); io.unobserve(el);
      }
    });
  }
  window.addEventListener('scroll', revealInView, { passive: true });
  window.addEventListener('load', revealInView);
  requestAnimationFrame(revealInView);
  setTimeout(revealInView, 200);

  // Bulletproofing: CSS opacity transitions are paused while a tab/iframe is
  // backgrounded, which can leave reveal content stuck hidden. Force the final
  // visible state (no transition) when we're not actively able to animate.
  function forceShowAll() { document.documentElement.classList.add('reveal-off'); }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.visibilityState !== 'visible') forceShowAll();
  document.addEventListener('visibilitychange', function () { if (document.visibilityState !== 'visible') forceShowAll(); });
  setTimeout(forceShowAll, 2200);

  /* ---------------- Count-up stats ---------------- */
  var counted = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, target = parseFloat(el.getAttribute('data-count')),
          suffix = el.getAttribute('data-suffix') || '', dec = (target % 1 !== 0) ? 1 : 0,
          dur = 1400, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * e).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec) + suffix;
      }
      requestAnimationFrame(step);
      counted.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { counted.observe(el); });

  /* ---------------- Hero starfield ---------------- */
  var canvas = document.getElementById('stars');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ctx = canvas.getContext('2d'), stars = [], W, H, raf;
    function size() {
      W = canvas.width = canvas.offsetWidth * devicePixelRatio;
      H = canvas.height = canvas.offsetHeight * devicePixelRatio;
      var n = Math.min(150, Math.floor((W * H) / 26000));
      stars = [];
      for (var i = 0; i < n; i++) stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.3 * devicePixelRatio + 0.2,
        a: Math.random() * 0.6 + 0.15, tw: Math.random() * 0.02 + 0.004,
        dir: Math.random() > 0.5 ? 1 : -1, vx: (Math.random() - 0.5) * 0.06 * devicePixelRatio
      });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.a += s.tw * s.dir;
        if (s.a > 0.8 || s.a < 0.12) s.dir *= -1;
        s.x += s.vx; if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fillStyle = 'rgba(180,210,235,' + s.a + ')'; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    size(); draw();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 200); });
  }

  /* ---------------- Ticker duplicate (seamless loop) ---------------- */
  var track = document.querySelector('.ticker__track');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------------- Contact form ---------------- */
  var form = document.getElementById('briefingForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = document.getElementById('formOk');
    form.style.display = 'none';
    if (ok) ok.style.display = 'block';
  });

  /* ============================================================
     TWEAKS
     ============================================================ */
  var defaults = window.TWEAK_DEFAULTS || {};
  var state = Object.assign({ hero: 'battlespace', portfolio: 'showcase', accent: 'aqua', headline: 'clarity' }, defaults);
  var root = document.documentElement;

  var HEADLINES = {
    clarity: {
      title: 'Clarity for contested <span class="sig">environments.</span>',
      sub: 'HYPATIUS builds the <b>software operating layer for contested-domain defense</b> \u2014 space wargaming and BMC3I, federal capture intelligence, and program execution. Three platforms. One operating philosophy.'
    },
    superiority: {
      title: 'We engineer <span class="sig">decision superiority.</span>',
      sub: 'Not features. Outcomes. HYPATIUS turns contested space, spectrum, and procurement into <b>a single operating picture</b> \u2014 so good people make the right call faster than the threat.'
    },
    shield: {
      title: 'The software <span class="sig">shield.</span>',
      sub: 'A software operating layer for contested domains \u2014 <b>orbital, maritime, and federal</b>. We give the mission a decisive edge where the environment fights back.'
    }
  };

  function applyHeadline() {
    var h = HEADLINES[state.headline] || HEADLINES.clarity;
    var t = document.querySelector('.hero__title'), s = document.querySelector('.hero__sub');
    if (t) t.innerHTML = h.title;
    if (s) s.innerHTML = h.sub;
  }
  function apply() {
    root.setAttribute('data-hero', state.hero);
    root.setAttribute('data-portfolio', state.portfolio);
    root.setAttribute('data-accent', state.accent);
    applyHeadline();
    document.querySelectorAll('.tw__seg').forEach(function (seg) {
      var key = seg.getAttribute('data-key');
      seg.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('sel', b.getAttribute('data-val') === state[key]);
      });
    });
  }
  apply();

  function setKey(key, val) {
    state[key] = val; apply();
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: (function () { var o = {}; o[key] = val; return o; })() }, '*'); } catch (e) {}
  }

  document.querySelectorAll('.tw__seg').forEach(function (seg) {
    var key = seg.getAttribute('data-key');
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      setKey(key, b.getAttribute('data-val'));
    });
  });

  var panel = document.getElementById('tweaks');
  var closeBtn = document.getElementById('twClose');
  if (panel) {
    window.addEventListener('message', function (e) {
      var d = e.data || {};
      if (d.type === '__activate_edit_mode') panel.classList.add('on');
      else if (d.type === '__deactivate_edit_mode') panel.classList.remove('on');
    });
    if (closeBtn) closeBtn.addEventListener('click', function () {
      panel.classList.remove('on');
      try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
    });
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
  }

  /* ---------------- Subnav scrollspy (inner pages) ---------------- */
  var subnavLinks = [].slice.call(document.querySelectorAll('.subnav a[href^="#"]'));
  if (subnavLinks.length) {
    var sections = subnavLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var spy = function () {
      var y = window.scrollY + (parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 76) + 120;
      var idx = 0;
      sections.forEach(function (sec, i) { if (sec && sec.offsetTop <= y) idx = i; });
      subnavLinks.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }
})();
