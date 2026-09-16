/* STARCHITECT redesign — orbital simulation canvas
   A lightweight, brand-correct orbital display: starfield, Earth limb,
   concentric orbit rings, satellites tracing them, and a couple of
   "tracked" objects with mono labels. Honors prefers-reduced-motion.
   Usage: new OrbitSim(canvas, { earth: 'right'|'left'|'center', density })  */
(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GOLD = '#D4A03B', CYAN = '#2EB5C9', BONE = '#EFE9DD', SLATE = '#6B7588';

  function OrbitSim(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext('2d');
    let W, H, DPR, cx, cy, R, stars = [], orbits = [], t = 0, raf;

    const earthSide = opts.earth || 'right';
    const tracked = opts.tracked !== false;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // Earth center positioned off-canvas to show a limb
      if (earthSide === 'right') { cx = W * 1.02; cy = H * 0.52; R = Math.min(W, H) * 0.62; }
      else if (earthSide === 'left') { cx = W * -0.02; cy = H * 0.52; R = Math.min(W, H) * 0.62; }
      else { cx = W * 0.5; cy = H * 1.05; R = Math.min(W, H) * 0.72; }
      buildStars(); buildOrbits();
    }

    function buildStars() {
      stars = [];
      const n = Math.round((W * H) / 7000) * (opts.density || 1);
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.3 + 0.2,
          a: Math.random() * 0.5 + 0.15,
          tw: Math.random() * Math.PI * 2,
          c: Math.random() > 0.85 ? (Math.random() > 0.5 ? GOLD : CYAN) : BONE
        });
      }
    }

    function buildOrbits() {
      orbits = [];
      const ringCount = opts.rings || 3;
      for (let i = 0; i < ringCount; i++) {
        const rad = R + 40 + i * (Math.min(W, H) * 0.16);
        const sats = i === 0 ? 2 : 1;
        const ring = { rad, tilt: 0.30 + i * 0.05, color: i === 1 ? GOLD : CYAN, sats: [] };
        for (let s = 0; s < sats; s++) {
          ring.sats.push({ a: Math.random() * Math.PI * 2, spd: (0.06 + Math.random() * 0.05) / (i + 1), c: i === 1 ? GOLD : (s % 2 ? BONE : CYAN) });
        }
        orbits.push(ring);
      }
    }

    function orbitPoint(ring, ang) {
      // ellipse around earth center, tilted
      const ex = Math.cos(ang) * ring.rad;
      const ey = Math.sin(ang) * ring.rad * ring.tilt;
      return { x: cx + ex, y: cy + ey };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // starfield
      for (const s of stars) {
        const tw = REDUCED ? s.a : s.a * (0.6 + 0.4 * Math.sin(t * 1.5 + s.tw));
        ctx.globalAlpha = tw;
        ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // earth limb — dark disc with gold rim + atmosphere
      const grad = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.06);
      grad.addColorStop(0, 'rgba(10,19,34,0)');
      grad.addColorStop(0.82, 'rgba(10,19,34,0)');
      grad.addColorStop(0.93, 'rgba(46,181,201,0.10)');
      grad.addColorStop(1, 'rgba(46,181,201,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.06, 0, 7); ctx.fill();

      ctx.fillStyle = '#070D18';
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      // gold terminator rim
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(212,160,59,0.55)';
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      // faint inner latitude arcs
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(46,181,201,0.14)';
      for (let k = 1; k <= 3; k++) {
        ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.98, R * (0.3 * k / 3), 0, 0, 7); ctx.stroke();
      }

      // orbit rings + sats
      for (const ring of orbits) {
        ctx.lineWidth = 1; ctx.strokeStyle = ring.color === GOLD ? 'rgba(212,160,59,0.30)' : 'rgba(46,181,201,0.22)';
        ctx.beginPath(); ctx.ellipse(cx, cy, ring.rad, ring.rad * ring.tilt, 0, 0, 7); ctx.stroke();
        for (const sat of ring.sats) {
          if (!REDUCED) sat.a += sat.spd * 0.016;
          const p = orbitPoint(ring, sat.a);
          if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) continue;
          ctx.fillStyle = sat.c;
          ctx.shadowColor = sat.c; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 7); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // tracked object reticle (first ring, first sat)
      if (tracked && orbits[0]) {
        const ring = orbits[0], sat = ring.sats[0];
        const p = orbitPoint(ring, sat.a);
        if (p.x > 40 && p.x < W - 120 && p.y > 30 && p.y < H - 40) {
          ctx.strokeStyle = 'rgba(212,160,59,0.7)'; ctx.lineWidth = 1;
          ctx.strokeRect(p.x - 11, p.y - 11, 22, 22);
          ctx.beginPath(); ctx.moveTo(p.x + 11, p.y); ctx.lineTo(p.x + 34, p.y); ctx.stroke();
          ctx.font = '10px "IBM Plex Mono", monospace';
          ctx.fillStyle = GOLD; ctx.textBaseline = 'middle';
          ctx.fillText('TRK · SC-4471', p.x + 40, p.y - 5);
          ctx.fillStyle = SLATE;
          ctx.fillText('GEO · NOMINAL', p.x + 40, p.y + 8);
        }
      }

      t += 0.016;
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    if (REDUCED) { draw(); cancelAnimationFrame(raf); }
    else draw();

    this.destroy = function () { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }

  window.OrbitSim = OrbitSim;
})();
