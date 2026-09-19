/* tools/render-sting.mjs · deterministic frame renderer for a time-driven
   HTML animation
   ─────────────────────────────────────────────────────────────────────────────
   Why this exists.

   The first cut of the ALIDADE sting was made with Playwright's video recorder.
   Its container timestamps are a perfect 40 ms apart, which looks correct and
   is not: the recorder writes a frame every 40 ms whether or not the page has
   repainted, so whenever the page missed a beat the previous frame is written
   again. Measured on that recording:

       644 frames · 13 exact duplicates of the previous frame (2.0%)
       one run of EIGHT identical frames — a 320 ms freeze
       123 near-identical frames (19.1%)

   That is the stutter. It is in the capture, not in the source animation and
   not in the encoder.

   The fix is to stop sampling a clock I do not control and become the clock.
   Before any page script runs, this replaces performance.now, Date.now,
   requestAnimationFrame, setTimeout and setInterval with a virtual clock. The
   animation then advances by exactly one frame interval per step, no matter how
   long the screenshot takes, so every frame is rendered and none is repeated.

   During load the clock is pumped by the real rAF, because the bundle unpacks
   itself on timers and needs wall time to do it. Once it is up, the pump is
   switched off and Node steps the clock by hand.

   Note this works because the sting has no CSS animations or transitions —
   document.getAnimations() returns 0 — so the virtual clock is the only clock
   driving it. A page with CSS animation would also need
   Animation.currentTime driven per frame.

   Run: PW_CHROME=/path/to/chrome node tools/render-sting.mjs <source.html> <outdir>
        [--fps 30] [--seconds 14] [--warm 3000]
*/
import { chromium } from 'playwright';
import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const SRC = resolve(args[0] || 'source.html');
const OUT = resolve(args[1] || 'frames');
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : Number(args[i + 1]); };

const FPS   = opt('fps', 30);
const SECS  = opt('seconds', 14);
const WARM  = opt('warm', 3000);
const STEP  = 1000 / FPS;
const N     = Math.round(FPS * SECS);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();

await p.addInitScript(() => {
  const RAF = window.requestAnimationFrame.bind(window);
  let t = 0, id = 1, auto = true, last = null;
  const rafs = new Map(), timers = new Map();

  performance.now = () => t;
  const ORIGIN = 1758240000000;
  Date.now = () => ORIGIN + t;

  window.requestAnimationFrame = cb => { const i = id++; rafs.set(i, cb); return i; };
  window.cancelAnimationFrame  = i => rafs.delete(i);
  window.setTimeout  = (cb, ms, ...a) => { const i = id++; timers.set(i, { cb, due: t + (+ms || 0), args: a }); return i; };
  window.clearTimeout = i => timers.delete(i);
  window.setInterval = (cb, ms, ...a) => { const i = id++; timers.set(i, { cb, due: t + (+ms || 0), every: Math.max(1, +ms || 1), args: a }); return i; };
  window.clearInterval = i => timers.delete(i);

  function step(dt) {
    t += dt;
    /* Timers first, then the rAFs they may have queued — bounded, because a
       setTimeout(fn, 0) loop would otherwise never settle. */
    for (let pass = 0; pass < 64; pass++) {
      const due = [...timers.entries()].filter(([, x]) => x.due <= t).sort((a, z) => a[1].due - z[1].due);
      if (!due.length) break;
      for (const [i, x] of due) {
        if (x.every) x.due = t + x.every; else timers.delete(i);
        try { x.cb.apply(null, x.args); } catch (e) {}
      }
    }
    const cbs = [...rafs.values()];
    rafs.clear();
    for (const cb of cbs) { try { cb(t); } catch (e) {} }
  }

  window.__clk = {
    step,
    get t() { return t; },
    stopAuto() { auto = false; },
  };

  (function pump(ts) {
    if (!auto) return;
    if (last === null) last = ts;
    step(Math.min(50, ts - last));   // clamp so a slow first paint is not a jump
    last = ts;
    RAF(pump);
  })(0);
});

await p.goto('file://' + SRC, { waitUntil: 'load' });
await p.waitForTimeout(WARM);                       // unpack, on the real clock
await p.evaluate(() => window.__clk.stopAuto());
await p.waitForTimeout(150);

const t0 = Date.now();
for (let i = 0; i < N; i++) {
  await p.screenshot({ path: OUT + '/' + String(i).padStart(5, '0') + '.png' });
  await p.evaluate(s => window.__clk.step(s), STEP);
  if (i % 60 === 0) process.stdout.write(`  ${i}/${N}\r`);
}

const vt = await p.evaluate(() => window.__clk.t);
console.log(`\nrendered ${N} frames at ${FPS}fps (${(N / FPS).toFixed(2)}s of animation)`);
console.log(`virtual clock now ${(vt / 1000).toFixed(2)}s · wall time ${((Date.now() - t0) / 1000).toFixed(0)}s`);
await b.close();
