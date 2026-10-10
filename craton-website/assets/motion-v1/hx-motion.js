/* HYPATIUS in-page motion · v1 · shared by hypati.us, starchitect.us, alidade.us, craton-erp.us
   ------------------------------------------------------------------------------------------
   <script src="…/hx-motion.js" data-brand="st|al|cr|hy" data-reveal="CSS selector (optional)" defer></script>

   Everything is readable without this file: the markup ships in its finished state, and this
   script only adds motion once it is running. Under prefers-reduced-motion nothing moves; every
   component renders its final state at once.

   Brand motion (from each tier's standard):
     st  cubic-bezier(.16,1,.3,1) · 0.4 s max · 1–2 px moves
     al  cubic-bezier(.22,.61,.36,1) · 120–320 ms · fades and soft slides
     cr  cubic-bezier(.2,.8,.2,1) · restrained, no bounce, no decorative loops
     hy  cubic-bezier(.2,.8,.2,1) · corporate

   Components (attribute on the container):
     data-mx="count"   number counts up when seen. data-to, optional data-from, data-dec, data-pad
     data-mx="bars"    children carry style="--v:0.6"; widths grow from 0 in sequence
     data-mx="rows"    children appear one at a time (data-gap ms between rows)
     data-mx="steps"   walkthrough: children [data-mx-step] advance on a timer while in view,
                       pause on hover or focus, and any step can be chosen with click or keys.
                       data-interval ms. Optional [data-mx-progress] inside receives --p (0–1).
   Each component gets the class mx-in once it has been seen. */
(function () {
  'use strict';
  var me = document.currentScript, brand = (me && me.dataset.brand) || 'hy';
  var B = {
    st: { e: 'cubic-bezier(.16,1,.3,1)', d: 400, y: 2 },
    al: { e: 'cubic-bezier(.22,.61,.36,1)', d: 320, y: 8 },
    cr: { e: 'cubic-bezier(.2,.8,.2,1)', d: 420, y: 6 },
    hy: { e: 'cubic-bezier(.2,.8,.2,1)', d: 600, y: 10 }
  }[brand] || { e: 'ease', d: 400, y: 4 };
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.style.setProperty('--mx-ease', B.e);
  root.style.setProperty('--mx-dur', B.d + 'ms');
  root.style.setProperty('--mx-y', B.y + 'px');
  root.classList.add('mx-on');
  if (still) root.classList.add('mx-still');

  function seen(el, fn, th) {
    if (still || !('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: th || 0.25, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
  }
  function tween(ms, step, done) {
    if (still) { step(1); if (done) done(); return; }
    var t0 = performance.now();
    (function f(now) { var u = Math.min(1, (now - t0) / ms); step(1 - Math.pow(1 - u, 3)); if (u < 1) requestAnimationFrame(f); else if (done) done(); })(t0);
  }

  // 1 · Reveal: opt-in by selector (sites that already run their own reveal skip this).
  //     One shared observer, plus a scroll check as a fallback so nothing can stay hidden.
  var sel = me && me.dataset.reveal;
  if (sel && !still) {
    var pend = [];
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.closest('[data-hx-hero],.hx,[data-mx-noreveal]')) return;
      el.classList.add('mx-reveal'); pend.push(el);
    });
    var open = function (el) { el.classList.add('mx-in'); var k = pend.indexOf(el); if (k > -1) pend.splice(k, 1); };
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); open(e.target); } });
    }, { threshold: 0.01, rootMargin: '0px 0px -6% 0px' }) : null;
    pend.slice().forEach(function (el) { if (io) io.observe(el); });
    var chk = 0, sweep = function () {
      chk = 0; var lim = innerHeight * 0.96;
      pend.slice().forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < lim) { if (io) io.unobserve(el); open(el); } });
    };
    addEventListener('scroll', function () { if (!chk) chk = setTimeout(sweep, 120); }, { passive: true });
    addEventListener('load', function () { setTimeout(sweep, 300); });
    if (!io) pend.slice().forEach(open);
  }

  // 2 · Count-up
  document.querySelectorAll('[data-mx="count"]').forEach(function (el) {
    var to = parseFloat(el.dataset.to || el.textContent), from = parseFloat(el.dataset.from || 0), dec = +(el.dataset.dec || 0), pad = +(el.dataset.pad || 0);
    var fmt = function (v) { var s = v.toFixed(dec); while (s.length < pad) s = '0' + s; return s; };
    if (!still) el.textContent = fmt(from);
    seen(el, function () { el.classList.add('mx-in'); tween(+(el.dataset.ms || 1100), function (u) { el.textContent = fmt(from + (to - from) * u); }); });
  });

  // 3 · Bars and rows: CSS does the motion; JS staggers and flags.
  document.querySelectorAll('[data-mx="bars"],[data-mx="rows"]').forEach(function (el) {
    var gap = +(el.dataset.gap || (el.dataset.mx === 'bars' ? 90 : 260));
    Array.prototype.forEach.call(el.children, function (c, i) { c.style.setProperty('--mx-i', i); c.style.transitionDelay = (still ? 0 : i * gap) + 'ms'; });
    seen(el, function () { el.classList.add('mx-in'); });
  });

  // 4 · Steps (walkthroughs)
  document.querySelectorAll('[data-mx="steps"]').forEach(function (el) {
    var steps = el.querySelectorAll('[data-mx-step]'), prog = el.querySelector('[data-mx-progress]');
    if (!steps.length) return;
    var iv = +(el.dataset.interval || 3600), cur = -1, timer = 0, held = false, live = false, t0 = 0, raf = 0;
    function show(i, user) {
      cur = (i + steps.length) % steps.length;
      steps.forEach(function (s, k) {
        s.classList.toggle('mx-cur', k === cur); s.classList.toggle('mx-done', k < cur);
        s.setAttribute('aria-current', k === cur ? 'step' : 'false');
      });
      el.style.setProperty('--mx-cur', cur);
      el.dataset.mxCur = cur;
      if (user) { held = true; stopTimer(); }
      else if (live) { t0 = performance.now(); }
    }
    function tick(now) {
      raf = 0; if (!live || held || still) return;
      var u = Math.min(1, (now - t0) / iv);
      if (prog) prog.style.setProperty('--p', ((cur + u) / steps.length).toFixed(4));
      if (u >= 1) { if (cur === steps.length - 1) { held = true; el.classList.add('mx-end'); if (prog) prog.style.setProperty('--p', 1); return; } show(cur + 1); }
      raf = requestAnimationFrame(tick);
    }
    function startTimer() { if (!raf && !held && !still) { t0 = performance.now(); raf = requestAnimationFrame(tick); } }
    function stopTimer() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    steps.forEach(function (s, k) {
      if (!s.hasAttribute('tabindex')) s.tabIndex = 0;
      s.addEventListener('click', function () { show(k, true); if (prog) prog.style.setProperty('--p', ((k + 1) / steps.length).toFixed(4)); });
      s.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); var n = steps[(k + 1) % steps.length]; n.focus(); n.click(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); var p = steps[(k - 1 + steps.length) % steps.length]; p.focus(); p.click(); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.click(); }
      });
    });
    el.addEventListener('mouseenter', function () { if (!held) stopTimer(); });
    el.addEventListener('mouseleave', function () { if (!held && live) startTimer(); });
    if (still) { el.classList.add('mx-in', 'mx-all', 'mx-end'); show(steps.length - 1); if (prog) prog.style.setProperty('--p', 1); return; }
    show(0);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      live = es[0].isIntersecting; if (live) { el.classList.add('mx-in'); startTimer(); } else stopTimer();
    }, { threshold: 0.35 }).observe(el);
  });
})();
