/* HYPATIUS hero runtime · shared by hypati.us, starchitect.us, alidade.us, craton-erp.us
   ------------------------------------------------------------------------------------
   Markup:  <div class="hx" data-scene="./scene-st.js" data-ease="starchitect">
              <img class="hx-poster hx-poster--end" ...>    settled frame: phones, reduced motion, no WebGL
              <img class="hx-poster hx-poster--start" ...>  first frame of the live scene: crossfades into it
              <canvas class="hx-canvas" aria-hidden="true"></canvas>
            </div>
   A one-line head script adds html.hx-motion before first paint when motion is allowed,
   so the right poster shows from the first frame (see hero.css).
   Behaviour:
   - Nothing heavy loads before first paint: the scene module (and three.js) is imported
     when the browser is idle after `load`.
   - The live scene fades in over the poster with the brand curve, then the poster fades out.
   - Phones (< 760 px), reduced motion, Save-Data and missing WebGL keep the poster.
   - Rendering pauses when the hero is off screen or the tab is hidden.
   The scene module default-exports create(canvas, {root}) -> {renderAt(t), resize()}. A scene that
   settles returns true from renderAt once its last frame is drawn; the loop then stops for good. */
(function () {
  'use strict';
  var EASES = {
    corporate: 'cubic-bezier(.2,.8,.2,1)',
    starchitect: 'cubic-bezier(.16,1,.3,1)',
    alidade: 'cubic-bezier(.22,.61,.36,1)'
  };
  function webgl() {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch (e) { return false; }
  }
  function staticOnly() {
    var mq = window.matchMedia;
    if (mq && mq('(prefers-reduced-motion: reduce)').matches) return true;
    if (window.innerWidth < 760) return true;
    var con = navigator.connection; if (con && con.saveData) return true;
    return !webgl();
  }
  function boot(root) {
    if (root.dataset.hxBooted) return; root.dataset.hxBooted = '1';
    var canvas = root.querySelector('.hx-canvas'), poster = root.querySelector('.hx-poster--start') || root.querySelector('.hx-poster');
    var fadeMs = +(root.dataset.fade || 900), ease = EASES[root.dataset.ease] || EASES.corporate;
    root.classList.add('hx-static');
    if (!canvas || staticOnly()) { document.documentElement.classList.remove('hx-motion'); return; }
    import(new URL(root.dataset.scene, document.baseURI).href).then(function (mod) {
      return mod.default(canvas, { root: root });
    }).then(function (scene) {
      var t0 = null, visible = true, running = true, raf = 0, shown = false, paused = 0, pausedAt = 0, settled = false, lastT = 0;
      function frame(now) {
        raf = 0;
        if (!running || !visible) return;
        if (t0 === null) t0 = now;
        lastT = (now - t0 - paused) / 1000;
        if (scene.renderAt(lastT) === true) settled = true;
        if (!shown) {
          shown = true;
          canvas.style.transition = 'opacity ' + fadeMs + 'ms ' + ease;
          if (poster) poster.style.transition = 'opacity ' + fadeMs + 'ms ' + ease + ' ' + Math.round(fadeMs * .35) + 'ms';
          root.classList.remove('hx-static'); root.classList.add('hx-live');
        }
        if (!settled) raf = requestAnimationFrame(frame);
      }
      function start() { if (!raf && running && visible && !settled) { if (pausedAt) { if (t0 !== null) paused += performance.now() - pausedAt; pausedAt = 0; } raf = requestAnimationFrame(frame); } }
      function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } if (!pausedAt) pausedAt = performance.now(); }
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0.01 }).observe(root);
      document.addEventListener('visibilitychange', function () { running = !document.hidden; running ? start() : stop(); });
      var rz = 0; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { scene.resize(); if (settled) scene.renderAt(lastT); }, 120); });
      scene.resize(); start();
    }).catch(function (e) { root.classList.add('hx-static'); root.classList.remove('hx-live'); document.documentElement.classList.remove('hx-motion'); if (window.console) console.warn('hero scene unavailable:', e); });
  }
  function all() { document.querySelectorAll('.hx[data-scene]').forEach(boot); }
  function idle(fn) { (window.requestIdleCallback || function (f) { return setTimeout(f, 200); })(fn, { timeout: 1500 }); }
  if (document.readyState === 'complete') idle(all); else window.addEventListener('load', function () { idle(all); });
})();
