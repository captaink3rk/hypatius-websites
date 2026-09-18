/* verification/verify-imagery.mjs · hypati.us v4.3 · photographic contrast harness
   ─────────────────────────────────────────────────────────────────────────────
   Why this exists, separately from verify.mjs.

   verify.mjs checks contrast by walking up the ancestor chain and compositing
   the *computed* CSS background colours. That is the right method for type on a
   panel, and it is completely blind to type sitting on a photograph: the
   computed background of the hero headline is `rgba(0,0,0,0)` all the way up to
   a `background-image`, which has no colour to read. Every one of the twelve
   fields introduced in v4.3 sits under type. So the 96 checks passing tells us
   nothing at all about whether the new photography is legible.

   This harness answers the question the prompt pack actually asked: it renders
   the page, screenshots it, and for each headline over an image it samples the
   REAL pixels the browser drew — veil, gradient, photograph and all — inside the
   glyph box, and measures the worst case rather than the average. A headline is
   only as readable as its brightest patch of sky.

   Method, per target:
     · measure the element's box on the live page
     · screenshot the page a SECOND time with every target set to
       `visibility:hidden`, so the box contains ground and nothing else. This
       step is the whole trick. Sampling inside a drawn headline mostly returns
       the glyphs — white text over anything reads as a flawless 1.00:1, which
       looks like catastrophic failure and means nothing. The layout is
       untouched by `visibility:hidden`, so the boxes still line up exactly.
     · sample that clean box on a 24×10 grid as relative luminance
     · take the 95th percentile — the near-worst background pixel, discarding
       the single brightest outlier, usually JPEG ringing
     · contrast that against the element's own computed colour
   Floor is 4.5:1 for body and 3.0:1 for large text (>=24px, or >=18.66px bold),
   which is the WCAG AA split. Display faces here are all far above that.

   Run: PW_CHROME=... node verification/verify-imagery.mjs
*/
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { PNG } from 'pngjs';

const here = dirname(fileURLToPath(import.meta.url));

/* Every place v4.3 put type on a photograph, plus the two it inherited. */
const TARGETS = [
  ['home', '../hypatius-website/home.html', [
    ['hero headline',        '.hero__title'],
    ['hero sub',             '.hero__sub'],
    ['hero credential',      '.hero__cred'],
    ['STARCHITECT name',     '.plat--starchitect .plat__name'],
    ['STARCHITECT desc',     '.plat--starchitect .plat__desc'],
    ['ALIDADE name',         '.plat--alidade .plat__name'],
    ['ALIDADE desc',         '.plat--alidade .plat__desc'],
    ['CRATON name',          '.plat--craton .plat__name'],
    ['CRATON desc',          '.plat--craton .plat__desc'],
    ['record title',         '.record .sec-title'],
    ['record lede',          '.record .sec-lede'],
    ['record eyebrow',       '.record .eyebrow'],
    ['method title',         '.method-band .sec-title'],
    ['method lede',          '.method-band .sec-lede'],
    ['method key',           '.method-band .meth__k'],
    ['method body',          '.method-band .meth__d'],
    ['CTA title',            '.ctaband__title'],
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

    const boxes = await p.evaluate(sels => sels.map(([label, sel]) => {
      const el = document.querySelector(sel);
      if (!el) return { label, sel, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width < 4 || r.height < 4 || cs.visibility === 'hidden' || cs.display === 'none')
        return { label, sel, missing: true };
      const px = parseFloat(cs.fontSize);
      const wt = parseInt(cs.fontWeight, 10) || 400;
      return {
        label, sel,
        x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height,
        color: cs.color, fontPx: px,
        large: px >= 24 || (px >= 18.66 && wt >= 700),
      };
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

      // Inset slightly so a box that abuts a section edge does not sample the
      // neighbouring band.
      const ix = t.x + t.w * 0.02, iy = t.y + t.h * 0.02;
      const iw = t.w * 0.96, ih = t.h * 0.96;

      const samples = [];
      for (let gx = 0; gx < 24; gx++) for (let gy = 0; gy < 10; gy++) {
        const sx = Math.round(ix + (iw * (gx + 0.5)) / 24);
        const sy = Math.round(iy + (ih * (gy + 0.5)) / 10);
        if (sx < 0 || sy < 0 || sx >= shot.width || sy >= shot.height) continue;
        const i = (shot.width * sy + sx) << 2;
        samples.push(lum(shot.data[i], shot.data[i + 1], shot.data[i + 2]));
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
        worstPixel: +ratio(fg, worst).toFixed(2), large: t.large, ok, tight,
      });
      const flag = ok ? (tight ? '~' : '✓') : '✕';
      console.log(`  ${flag} ${screen}@${w} ${t.label.padEnd(20)} ${cr.toFixed(2)}:1 (floor ${floor})`);
    }
    await ctx.close();
  }
}
await b.close();
writeFileSync(resolve(here, 'report-imagery.json'), JSON.stringify(report, null, 2));
const n = report.filter(r => !r.missing).length;
const missing = report.filter(r => r.missing);
if (missing.length) console.log(`\n  ! ${missing.length} target(s) not found: ${missing.map(m => m.label).join(', ')}`);
console.log(`\n${n} photographic contrast checks · ${fails} failed · ${warns} within 25% of the floor`);
process.exit(fails ? 1 : 0);
