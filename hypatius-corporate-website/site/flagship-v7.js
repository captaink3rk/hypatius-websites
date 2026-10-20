/* ============================================================
   HYPATIUS — Flagship homepage behavior
   Nav state · mobile drawer · scroll reveals · count-up ·
   hero starfield · ticker · briefing form · subnav scrollspy
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

  /* ---------------- Hero starfield ----------------
     The loop runs only while it can be seen: it stops when the tab is
     hidden, when the canvas is scrolled off screen, and whenever the
     viewer prefers reduced motion (a single static frame is drawn). */
  var canvas = document.getElementById('stars');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d'), stars = [], W = 0, H = 0, raf = 0, onScreen = true;
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    function paint(advance) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (advance) {
          s.a += s.tw * s.dir;
          if (s.a > 0.8 || s.a < 0.12) s.dir *= -1;
          s.x += s.vx; if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fillStyle = 'rgba(180,210,235,' + s.a + ')'; ctx.fill();
      }
    }
    function frame() { paint(true); raf = requestAnimationFrame(frame); }
    function canRun() { return !rm.matches && onScreen && document.visibilityState === 'visible'; }
    function update() {
      if (canRun()) { if (!raf) raf = requestAnimationFrame(frame); }
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    size(); paint(false); update();
    document.addEventListener('visibilitychange', update);
    if (rm.addEventListener) rm.addEventListener('change', update); else if (rm.addListener) rm.addListener(update);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting; update();
      }).observe(canvas);
    }
    var rt; window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(function () { size(); if (!raf) paint(false); }, 200);
    });
  }

  /* ---------------- Ticker: seamless loop + pause/play (WCAG 2.2.2) ---------------- */
  var ticker = document.querySelector('.ticker');
  var track = document.querySelector('.ticker__track');
  if (track) {
    [].slice.call(track.children).forEach(function (item) {
      var copy = item.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); track.appendChild(copy);
    });
  }
  var tickBtn = document.querySelector('.ticker__toggle');
  if (ticker && tickBtn) tickBtn.addEventListener('click', function () {
    var paused = ticker.classList.toggle('ticker--paused');
    tickBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    tickBtn.textContent = paused ? 'Play' : 'Pause';
    tickBtn.setAttribute('aria-label', paused ? 'Play ticker' : 'Pause ticker');
  });

  /* ---------------- Briefing request form ----------------
     No third-party service: submit composes a pre-filled email to
     leadership@hypati.us in the visitor's own mail client, then shows
     the confirmation (with the same link, in case nothing opened). */
  var form = document.getElementById('briefingForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    function val(n) { var f = form.elements[n]; return f ? String(f.value || '').trim() : ''; }
    var name = val('name'), org = val('organization');
    var subject = 'Briefing request \u2014 ' + (org ? name + ' / ' + org : name);
    var fields = [
      ['Name', name],
      ['Organization', org],
      ['Work email', val('email')],
      ['Mission', val('mission')],
      ['How can we help?', val('message')]
    ];
    var body = fields.map(function (f) { return f[0] + ': ' + (f[1] || '-'); }).join('\r\n');
    var href = 'mailto:leadership@hypati.us?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    var ok = document.getElementById('formOk');
    var link = document.getElementById('formMailto');
    var btn = form.querySelector('button[type="submit"]');
    if (link) link.setAttribute('href', href);
    function show(sent) {
      if (ok) {
        var t = ok.querySelector('[data-sent]'), f = ok.querySelector('[data-fallback]');
        if (t) t.hidden = !sent; if (f) f.hidden = sent;
      }
      form.style.display = 'none';
      if (ok) { ok.style.display = 'block'; ok.focus(); }
    }
    if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }
    /* Send through /api/contact (Resend -> leadership@hypati.us). If the
       server can't be reached, fall back to a pre-filled email. */
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site: 'hypatius', name: name, email: val('email'), subject: subject, fields: fields, website: val('website') })
    }).then(function (r) { return r.ok; }, function () { return false; }).then(function (sent) {
      if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); }
      if (!sent) window.location.href = href;
      show(sent);
    });
  });

  /* ---------------- Subnav scrollspy (inner pages) ---------------- */
  var root = document.documentElement;
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

// MDO v2 figures: scale the 1280x720 boards to the container
(function(){var f=document.querySelectorAll('.mdofig__frame');if(!f.length)return;function fit(){f.forEach(function(el){var w=el.clientWidth,s=Math.max(w/1280,0.5),inner=el.firstElementChild;inner.style.transform='scale('+s+')';el.style.height=(720*s)+'px';el.style.overflowX=(1280*s>w+1)?'auto':'hidden';});}fit();window.addEventListener('resize',fit);})();
