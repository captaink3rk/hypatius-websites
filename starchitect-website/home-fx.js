/* ============================================================
   STARCHITECT — site evolution · shared instruments
   Cinematic, live-readout behaviours shared by all three home
   directions. Each instrument boots only if its DOM exists, so
   one script serves every page. Honors prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GOLD = '#D4A03B', CYAN = '#2EB5C9', BONE = '#EFE9DD', ALERT = '#C8442E', GO = '#4F8F6F', SLATE = '#6B7588';

  /* ---- Nav: scrolled state + mobile toggle ---------------- */
  function initNav() {
    var nav = document.getElementById('nav');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
      onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    }
    window.toggleNav = function () {
      var l = document.getElementById('navLinks');
      if (l) l.classList.toggle('open');
    };
    var tog = document.querySelector('.nav-toggle');
    if (tog && !tog.getAttribute('onclick')) tog.addEventListener('click', window.toggleNav);
  }

  /* ---- Scroll reveal (resting state visible-safe) --------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---- Count-up stat figures ------------------------------ */
  function initCounts() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    var run = function (el) {
      var end = parseFloat(el.getAttribute('data-count'));
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      var dur = 1100, t0 = null;
      if (REDUCED) { el.textContent = pre + end + suf; return; }
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(end * e).toLocaleString() + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---- Live telemetry strip (clock + jittering readouts) -- */
  function initTelemetry() {
    var clock = document.querySelectorAll('[data-utc]');
    var lat = document.querySelectorAll('[data-latency]');
    var trk = document.querySelectorAll('[data-tracked]');
    if (!clock.length && !lat.length && !trk.length) return;
    var base = 4471;
    var tick = function () {
      var d = new Date();
      var hh = String(d.getUTCHours()).padStart(2, '0');
      var mm = String(d.getUTCMinutes()).padStart(2, '0');
      var ss = String(d.getUTCSeconds()).padStart(2, '0');
      clock.forEach(function (c) { c.textContent = hh + ':' + mm + ':' + ss + ' UTC'; });
      if (!REDUCED) {
        lat.forEach(function (l) { l.textContent = (340 + Math.floor(Math.random() * 120)) + ' ms'; });
        base += (Math.random() > 0.5 ? 1 : -1);
        trk.forEach(function (t) { t.textContent = base.toLocaleString(); });
      } else {
        lat.forEach(function (l) { l.textContent = '< 500 ms'; });
        trk.forEach(function (t) { t.textContent = base.toLocaleString(); });
      }
    };
    tick();
    if (!REDUCED) setInterval(tick, 1000);
  }

  /* ===========================================================
     INSTRUMENT 1 — AI BATTLESPACE CORRELATOR (Direction A)
     Multi-domain contacts stream in, a correlation sweep fires,
     they collapse into one verified COA. Latency resets, replays.
     =========================================================== */
  function initCorrelator() {
    var root = document.getElementById('correlator');
    if (!root) return;
    var feed = root.querySelector('[data-cor-feed]');
    var coa = root.querySelector('[data-cor-coa]');
    var stateEl = root.querySelector('[data-cor-state]');
    var latEl = root.querySelector('[data-cor-latency]');
    var bar = root.querySelector('[data-cor-bar]');
    if (!feed) return;

    var CONTACTS = [
      ['SBIRS GEO-4', 'IR PLUME · 2,140 K', ALERT],
      ['SDA-T1 TRK-118', 'ΔV 0.4 m/s · CROSS', GOLD],
      ['RF/ELINT 7C', 'X-BAND BURST', CYAN],
      ['OPIR STARE', 'BOOST PHASE', ALERT],
      ['GROUND RADAR', 'AZ 214 · EL 31', SLATE],
      ['ALLIED NODE 09', 'CORROBORATES', CYAN],
      ['SSA CATALOG', 'NO TLE MATCH', GOLD]
    ];

    function reset() {
      feed.innerHTML = '';
      coa.classList.remove('show');
      if (bar) bar.style.width = '0%';
      stateEl.textContent = 'STANDBY';
      stateEl.style.color = SLATE;
      latEl.textContent = '— ms';
    }

    function rowEl(c) {
      var d = document.createElement('div');
      d.className = 'cor-row';
      d.innerHTML = '<span class="cor-dot" style="background:' + c[2] + '"></span>' +
        '<span class="cor-src">' + c[0] + '</span>' +
        '<span class="cor-val">' + c[1] + '</span>';
      return d;
    }

    function play() {
      reset();
      if (REDUCED) {
        CONTACTS.forEach(function (c) { feed.appendChild(rowEl(c)); });
        stateEl.textContent = 'COA VERIFIED'; stateEl.style.color = GO;
        latEl.textContent = '418 ms'; if (bar) bar.style.width = '100%';
        coa.classList.add('show');
        return;
      }
      stateEl.textContent = 'INGESTING'; stateEl.style.color = CYAN;
      var i = 0, t0 = performance.now();
      var addNext = function () {
        if (i < CONTACTS.length) {
          var r = rowEl(CONTACTS[i]);
          feed.appendChild(r);
          requestAnimationFrame(function () { r.classList.add('in'); });
          if (bar) bar.style.width = Math.round((i + 1) / CONTACTS.length * 62) + '%';
          var ms = Math.round(performance.now() - t0);
          latEl.textContent = ms + ' ms';
          i++;
          setTimeout(addNext, 230);
        } else {
          stateEl.textContent = 'CORRELATING'; stateEl.style.color = GOLD;
          root.classList.add('sweep');
          if (bar) bar.style.width = '84%';
          setTimeout(function () {
            root.classList.remove('sweep');
            stateEl.textContent = 'COA VERIFIED'; stateEl.style.color = GO;
            latEl.textContent = (390 + Math.floor(Math.random() * 90)) + ' ms';
            if (bar) bar.style.width = '100%';
            coa.classList.add('show');
            setTimeout(play, 4200);
          }, 1050);
        }
      };
      addNext();
    }

    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { play(); io.disconnect(); } });
    }, { threshold: 0.12 });
    io.observe(root);
  }

  /* ===========================================================
     INSTRUMENT 2 — ORBITAL THREAT SCOPE (Direction B)
     A radar scope of real unclassified close-approach scenarios.
     Two tracks converge; closing distance ticks down live.
     Scenario tabs switch the engagement (minimal input).
     =========================================================== */
  function initThreatScope() {
    var canvas = document.getElementById('scopeCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var readEl = document.querySelector('[data-scope-range]');
    var rateEl = document.querySelector('[data-scope-rate]');
    var nameEl = document.querySelector('[data-scope-name]');
    var statusEl = document.querySelector('[data-scope-status]');
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-scope-tab]'));

    var SCEN = [
      { id: 'tjs', label: 'TJS-3 / TJS-10', blue: 'TJS-3', red: 'TJS-10', start: 18.0, min: 0.8, unit: 'km', rate: 'CONVERGING', col: ALERT, note: 'GEO · cross-track close approach' },
      { id: 'sj29', label: 'SJ-29 / USA-325', blue: 'USA-325', red: 'SJ-29A/B', start: 22.0, min: 11.0, unit: 'km', rate: '12-HR CYCLE', col: GOLD, note: 'GSSAP custody · proximity ops' },
      { id: 'cosmos', label: 'Cosmos 2589', blue: 'GEO BELT', red: 'COSMOS 2589', start: 9.0, min: 0.2, unit: 'km', rate: 'CIRCULARIZING', col: CYAN, note: 'Sub-satellite deployment watch' }
    ];
    var cur = SCEN[0], W, H, DPR, t = 0, raf, phase = 0;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function setScen(s) {
      cur = s; phase = 0;
      if (nameEl) nameEl.textContent = s.note;
      if (rateEl) { rateEl.textContent = s.rate; rateEl.style.color = s.col; }
      if (statusEl) statusEl.textContent = s.label;
      tabs.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-scope-tab') === s.id); });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2, maxR = Math.min(W, H) * 0.44;
      // range rings
      ctx.strokeStyle = 'rgba(46,181,201,0.16)'; ctx.lineWidth = 1;
      for (var k = 1; k <= 4; k++) { ctx.beginPath(); ctx.arc(cx, cy, maxR * k / 4, 0, 7); ctx.stroke(); }
      // crosshair
      ctx.strokeStyle = 'rgba(67,75,92,0.5)';
      ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();
      // sweep
      if (!REDUCED) {
        var ang = t * 1.1 % (Math.PI * 2);
        var g = ctx.createConicGradient ? null : null;
        ctx.save();
        ctx.translate(cx, cy);
        for (var i = 0; i < 28; i++) {
          ctx.globalAlpha = 0.05 * (1 - i / 28);
          ctx.strokeStyle = CYAN; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ang - i * 0.04) * maxR, Math.sin(ang - i * 0.04) * maxR); ctx.stroke();
        }
        ctx.restore(); ctx.globalAlpha = 1;
      }
      // engagement geometry — progress 0..1 ping-pong
      var prog = REDUCED ? 0.6 : (Math.sin(t * 0.5) * 0.5 + 0.5);
      var range = cur.start - (cur.start - cur.min) * prog;
      var spread = maxR * 0.74 * (range / cur.start) + maxR * 0.06;
      // blue (you/asset) left, red (threat) right, converging on center
      var bx = cx - spread, by = cy + Math.sin(t * 0.4) * 8;
      var rx = cx + spread, ry = cy - Math.sin(t * 0.4) * 8;
      // track trails
      ctx.strokeStyle = 'rgba(46,181,201,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(cx, cy); ctx.stroke();
      ctx.strokeStyle = 'rgba(200,68,46,0.5)';
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(cx, cy); ctx.stroke();
      // blue marker
      drawMark(bx, by, CYAN, cur.blue);
      drawMark(rx, ry, cur.col === CYAN ? GOLD : cur.col, cur.red);
      // center asset
      ctx.fillStyle = BONE; ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, 7); ctx.fill();
      // readout
      if (readEl) readEl.textContent = range.toFixed(range < 1 ? 2 : 1) + ' ' + cur.unit;
      t += 0.016;
      raf = requestAnimationFrame(draw);
    }

    function drawMark(x, y, col, label) {
      ctx.save();
      ctx.strokeStyle = col; ctx.lineWidth = 1.2;
      ctx.strokeRect(x - 7, y - 7, 14, 14);
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = '9px "IBM Plex Mono", monospace';
      ctx.fillStyle = col; ctx.textAlign = x < W / 2 ? 'left' : 'right';
      ctx.fillText(label, x < W / 2 ? x - 7 : x + 7, y - 12);
      ctx.restore();
    }

    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        var s = SCEN.filter(function (x) { return x.id === b.getAttribute('data-scope-tab'); })[0];
        if (s) setScen(s);
      });
    });

    resize(); window.addEventListener('resize', resize);
    setScen(SCEN[0]);
    if (REDUCED) { draw(); cancelAnimationFrame(raf); } else draw();
  }

  /* ===========================================================
     INSTRUMENT 3 — PACE SEVER SIMULATOR (Directions A & C)
     Click "simulate strike" — a node drops, mesh re-routes,
     tier degrades, then reconciles on reconnection.
     =========================================================== */
  function initPace() {
    var root = document.getElementById('pacesim');
    if (!root) return;
    var btn = root.querySelector('[data-pace-fire]');
    var tierEl = root.querySelector('[data-pace-tier]');
    var descEl = root.querySelector('[data-pace-desc]');
    var nodes = Array.prototype.slice.call(root.querySelectorAll('[data-pace-node]'));
    var STEPS = [
      ['T0', 'FULL MESH', 'All nodes nominal. Primary path active across the constellation.', GO],
      ['T1', 'NODE SEVERED', 'Ground node lost to kinetic strike. Traffic re-routes to alternate tier.', GOLD],
      ['T2', 'ISLAND MODE', 'Surviving nodes operate autonomously. No cloud tether required.', GOLD],
      ['T3', 'SINGLE NODE', 'One node carries the mission. Local-first stack stays operational.', ALERT],
      ['T0', 'RECONCILED', 'Link restored. CRDT merge reconciles divergent state — zero data loss.', GO]
    ];
    var i = 0, busy = false;
    function apply(step) {
      tierEl.textContent = step[0] + ' · ' + step[1];
      tierEl.style.color = step[3];
      descEl.textContent = step[2];
    }
    function severNodes(n) {
      nodes.forEach(function (nd, idx) {
        nd.classList.toggle('down', idx >= nodes.length - n && n > 0 && n < nodes.length);
      });
    }
    if (btn) btn.addEventListener('click', function () {
      if (busy) return; busy = true;
      var seq = [1, 2, 3, 4, 0], s = 0;
      var run = function () {
        var idx = seq[s];
        apply(STEPS[idx]);
        severNodes(idx === 4 ? 0 : idx);
        s++;
        if (s < seq.length) setTimeout(run, 1200);
        else busy = false;
      };
      run();
    });
    apply(STEPS[0]);
  }

  /* ---- Injected shared chrome (nav + telebar + footer) ----
     Pages opt in with <body data-chrome="on" data-route="platform">.
     Keeps every route's IA and proof scaffold identical & lean.   */
  function initChrome() {
    var body = document.body;
    if (!body || body.getAttribute('data-chrome') !== 'on') return;
    var route = body.getAttribute('data-route') || '';
    var WM = (window.__resources && window.__resources.wordmark) || 'assets/wordmark.png';
    var NAV = [
      ['platform.html', 'Platform', 'platform'],
      ['capabilities.html', 'Capabilities', 'capabilities'],
      ['use-cases.html', 'Use Cases', 'use-cases'],
      ['resilience.html', 'Resilience', 'resilience'],
      ['security.html', 'Security', 'security'],
      ['acquisition.html', 'Acquisition', 'acquisition'],
      ['company.html', 'Company', 'company']
    ];
    var links = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[2] === route ? ' class="active"' : '') + '>' + n[1] + '</a>';
    }).join('');

    var classy = document.createElement('div');
    classy.className = 'classification';
    classy.textContent = 'UNCLASSIFIED // DUAL-USE // ITAR 22 C.F.R. 120.10';

    var nav = document.createElement('nav');
    nav.className = 'nav'; nav.id = 'nav';
    nav.innerHTML =
      '<div class="nav-inner">' +
        '<a class="nav-logo" href="home.html"><img src="' + WM + '" alt="STARCHITECT">' +
        '<span class="pill"><b>A HYPATIUS</b>PLATFORM</span></a>' +
        '<div class="nav-links" id="navLinks">' + links +
        '<a href="resources.html"' + (route === 'resources' ? ' class="active"' : '') + '>Resources</a>' +
        '<a href="home.html#briefing" class="btn btn-primary">Request briefing</a></div>' +
        '<button class="nav-toggle" aria-label="Menu">\u2630</button>' +
      '</div>';

    var tele = document.createElement('div');
    tele.className = 'telebar'; tele.setAttribute('aria-hidden', 'true');
    tele.innerHTML =
      '<div class="telebar-inner">' +
        '<span class="tb"><span class="live"></span><b>MESH NOMINAL</b> \u00b7 5-TIER PACE</span>' +
        '<span class="tb-sep"></span>' +
        '<span class="tb">CORRELATOR <span class="g" data-latency>418 ms</span></span>' +
        '<span class="tb-sep"></span>' +
        '<span class="tb">TRACKED <span class="c" data-tracked>4,471</span> \u00b7 GEO/CISLUNAR</span>' +
        '<span class="tb-sep"></span>' +
        '<span class="tb">BACKBONE <b>100% FOSS</b></span>' +
        '<span class="tb-sep"></span>' +
        '<span class="tb"><span data-utc>00:00:00 UTC</span></span>' +
      '</div>';

    body.insertBefore(classy, body.firstChild);
    body.insertBefore(nav, classy.nextSibling);
    body.insertBefore(tele, nav.nextSibling);

    var foot = document.createElement('footer');
    foot.className = 'footer';
    foot.innerHTML =
      '<div class="footer-grid">' +
        '<div class="footer-brand"><img src="' + WM + '" alt="STARCHITECT">' +
          '<p>The operating system for space warfare and CJADC2.</p>' +
          '<div class="contact">leadership@hypati.us<br>253.230.4166<br>Charleston, SC</div></div>' +
        '<div class="footer-col"><h4>Platform</h4><a href="platform.html">Operator console</a><a href="capabilities.html">Capabilities</a><a href="use-cases.html">Use cases</a><a href="resilience.html">PACE resilience</a></div>' +
        '<div class="footer-col"><h4>Engage</h4><a href="security.html">Security</a><a href="acquisition.html">Acquisition</a><a href="resources.html">Resources</a></div>' +
        '<div class="footer-col"><h4>Company</h4><a href="company.html">About</a><a href="resources.html">Glossary</a><a href="https://hypati.us" target="_blank" rel="noopener">hypati.us \u2197</a></div>' +
      '</div>' +
      '<div class="footer-bottom"><div>\u00a9 2026 HYPATIUS LLC \u00b7 STARCHITECT is a HYPATIUS platform.</div><div>UEI UKELB3UV76V6 \u00b7 CAGE 19S89</div></div>' +
      '<div class="itar">This site contains technical data as defined under the International Traffic in Arms Regulations (ITAR) (22 C.F.R. 120.10) and may not be exported or disclosed to any foreign person without prior U.S. Government authorization.</div>';
    body.appendChild(foot);
  }

  function boot() {
    initChrome();
    initNav(); initReveal(); initCounts(); initTelemetry();
    initCorrelator(); initThreatScope(); initPace();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
