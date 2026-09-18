/* verification/verify-site-imagery.mjs · craton-erp.us v2 · photographic contrast
   ─────────────────────────────────────────────────────────────────────────────
   Why this exists separately from verify-site.mjs.

   verify-site.mjs measures contrast by compositing the *computed* CSS
   backgrounds up the ancestor chain. That is right for type on a panel and
   completely blind to type over an image: the computed background of the hero
   headline is rgba(0,0,0,0) all the way up to a background-image, which has no
   colour to read. craton-erp.us puts type over an image in five places, so the
   144 checks in the other harness say nothing at all about whether those five
   are legible.

   This one renders the page, screenshots it a second time with the text set to
   visibility:hidden — the layout is untouched, so the boxes still line up — and
   samples the REAL pixels inside each headline box. Sampling the drawn headline
   instead returns mostly glyphs, and white text over anything scores a flawless
   1.00:1, which is how the hypati.us version of this harness first reported
   thirty-two catastrophic failures that were not there.

   Per target: sample the clean box on a 24x10 grid as relative luminance, take
   the 95th percentile — the near-worst pixel, discarding the single brightest
   outlier — and contrast that against the element's own computed colour.
   Floor 4.5:1, or 3.0:1 for large text (>=24px, or >=18.66px bold): the WCAG AA
   split.

   A NOTE ON WHAT IS BEING MEASURED TODAY. All five image slots on this site
   currently hold procedural SVG proxies, not photographs — right ratio, right
   palette, deliberately quiet. So these numbers describe the proxies. The value
   of the harness is on the day the real plates land: run it before they ship
   and it will say how much image each headline can afford.

   Run: PW_CHROME=... node verification/verify-site-imagery.mjs
   Needs pngjs as well as playwright. */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { PNG } from 'pngjs';

const here = dirname(fileURLToPath(import.meta.url));

/* Every place this site puts type over an image. */
const TARGETS = [
  ['index', '../dist/index.html', [
    ['hero headline',   '.cr-hero .cr-disp'],
    ['hero lede',       '.cr-hero .cr-lede'],
    ['hero eyebrow',    '.cr-hero .cr-eb'],
    ['band caption',    '.cr-band-img__cap .cr-proof'],
    ['cta headline',    '.cr-cta .cr-disp'],
    ['cta lede',        '.cr-cta .cr-lede'],
    ['cta eyebrow',     '.cr-cta .cr-eb'],
  ]],
  ['binder', '../dist/binder.html', [
    ['plate caption',   '.cr-ph--img .cr-proof'],
  ]],
  ['walkthrough', '../dist/walkthrough.html', [
    ['plate caption',   '.cr-ph--img .cr-proof'],
  ]],
];

const srgb = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const report = [];
let fails = 0, warns = 0;

for (const [screen, path, sels] of TARGETS) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto('file://' + resolve(here, path), { waitUntil: 'load' });
    await p.waitForTimeout(600);
    // Reveal animations hold elements at opacity 0; force them visible or we
    // would be measuring contrast against a headline that is not drawn yet.
    await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
    await p.waitForTimeout(400);

    /* Measure the TEXT, not the block.
       ─────────────────────────────────
       Sampling the element's bounding box is wrong for any element that is
       wider than its own words. CRATON's hero eyebrow is display:flex, so its
       box runs the full 1144px of the wrap while the words occupy the left
       200px — over the hero plate that put 80% of the samples on bright sky
       the reader never sees behind the type, and reported a confident 3.80:1
       failure on an eyebrow that is, in fact, sitting on a flat scrim.

       A Range over the element's own text nodes returns the LINE BOXES: the
       actual ink extent, per line. Every one is sampled and the results are
       pooled, so a two-line headline is judged on both lines. */
    const boxes = await p.evaluate(sels => sels.map(([label, sel]) => {
      const el = document.querySelector(sel);
      if (!el) return { label, sel, missing: true };
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return { label, sel, missing: true };

      const rects = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walk.nextNode())) {
        if (!n.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) {
          if (r.width >= 4 && r.height >= 4) {
            rects.push({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height });
          }
        }
      }
      if (!rects.length) return { label, sel, missing: true };

      const px = parseFloat(cs.fontSize);
      const wt = parseInt(cs.fontWeight, 10) || 400;
      return { label, sel, rects, color: cs.color, fontPx: px,
               large: px >= 24 || (px >= 18.66 && wt >= 700) };
    }), sels);

    /* Hide the text, keep the layout, and photograph the ground. */
    await p.addStyleTag({
      content: sels.map(([, sel]) => sel).join(',') + '{visibility:hidden!important}',
    });
    await p.waitForTimeout(250);
    const shot = PNG.sync.read(await p.screenshot({ fullPage: true }));

    for (const t of boxes) {
      if (t.missing) { report.push({ screen, vp: w, ...t }); continue; }

      const m = t.color.match(/[\d.]+/g).map(Number);
      const fg = lum(m[0], m[1], m[2]);

      /* Every line box, pooled. Each is inset slightly so a line that abuts a
         section edge does not sample the neighbouring band. */
      const samples = [];
      for (const rc of t.rects) {
        const ix = rc.x + rc.w * 0.02, iy = rc.y + rc.h * 0.02;
        const iw = rc.w * 0.96, ih = rc.h * 0.96;
        for (let gx = 0; gx < 24; gx++) for (let gy = 0; gy < 10; gy++) {
          const sx = Math.round(ix + (iw * (gx + 0.5)) / 24);
          const sy = Math.round(iy + (ih * (gy + 0.5)) / 10);
          if (sx < 0 || sy < 0 || sx >= shot.width || sy >= shot.height) continue;
          const i = (shot.width * sy + sx) << 2;
          samples.push(lum(shot.data[i], shot.data[i + 1], shot.data[i + 2]));
        }
      }
      if (!samples.length) { report.push({ screen, vp: w, label: t.label, missing: true }); continue; }

      samples.sort((a, z) => a - z);
      // 95th percentile: the near-worst pixel. A single blown highlight from
      // JPEG ringing should not condemn an otherwise clean band, but anything
      // that occupies 5% of the headline's footprint is a real problem.
      const p95 = samples[Math.min(samples.length - 1, Math.floor(samples.length * 0.95))];
      const worst = samples[samples.length - 1];

      const cr = ratio(fg, p95);
      const floor = t.large ? 3.0 : 4.5;
      const ok = cr >= floor;
      const tight = ok && cr < floor * 1.25;

      if (!ok) fails++; else if (tight) warns++;
      report.push({
        screen, vp: w, label: t.label, contrast: +cr.toFixed(2), floor,
        worstPixel: +ratio(fg, worst).toFixed(2), large: t.large, lines: t.rects.length, ok, tight,
      });
      const flag = ok ? (tight ? '~' : '✓') : '✕';
      console.log(`  ${flag} ${screen}@${w} ${t.label.padEnd(20)} ${cr.toFixed(2)}:1 (floor ${floor})`);
    }
    await ctx.close();
  }
}
await b.close();
writeFileSync(resolve(here, 'report-site-imagery.json'), JSON.stringify(report, null, 2));
const n = report.filter(r => !r.missing).length;
const missing = report.filter(r => r.missing);
if (missing.length) console.log(`\n  ! ${missing.length} target(s) not found: ${missing.map(m => m.label).join(', ')}`);
console.log(`\n${n} photographic contrast checks · ${fails} failed · ${warns} within 25% of the floor`);
process.exit(fails ? 1 : 0);
