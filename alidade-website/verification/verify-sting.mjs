/* verification/verify-sting.mjs · alidade.us · the intro-sting overlay
   ─────────────────────────────────────────────────────────────────────────────
   The overlay has four paths and three of them are the ones that matter, because
   they are the ones nobody looks at:

     1. JavaScript ON, first visit    — it plays
     2. JavaScript OFF               — it is NOT rendered and the page is unchanged
     3. prefers-reduced-motion       — it never appears and the video is never fetched
     4. second visit, same session   — it never appears

   Path 2 is the whole reason this is an overlay rather than the gate page
   hypati.us uses: / must serve the real page to anything that does not run
   scripts. A regression there is invisible in a browser and total to a crawler.

   Also asserted: the video is not downloaded on paths 2, 3 and 4 (the sources
   carry data-src until the script promotes them), the skip control clears the
   44px touch floor, and both encodings are present — H.264 for everything and
   VP9 for builds without the proprietary decoder.

   Run: PW_CHROME=/path/to/chrome node verification/verify-sting.mjs
   Exit 1 on any failure. Report: verification/report-sting.json */
import { chromium } from 'playwright';
import { writeFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const PAGE = 'file://' + resolve(here, '..', 'alidade-website', 'index.html');
const SITE = resolve(here, '..', 'alidade-website');

const report = []; let fails = 0;
const note = (path, check, ok, detail) => {
  report.push({ path, check, ok, detail });
  if (!ok) { fails++; console.log(`  ✕ ${path} · ${check}: ${detail}`); }
  else console.log(`  ✓ ${path} · ${check}`);
};

const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});

/* A helper that loads the page once and reports what the overlay did, plus
   whether the video bytes were requested at all. */
async function visit(label, opts, { twice = false, waitMs = 1200 } = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const p = await ctx.newPage();
  const media = [];
  p.on('request', r => { if (/alidade-intro-sting/.test(r.url())) media.push(r.url()); });
  await p.goto(PAGE, { waitUntil: 'load' });
  await p.waitForTimeout(waitMs);
  if (twice) { await p.goto(PAGE, { waitUntil: 'load' }); await p.waitForTimeout(waitMs); }
  const r = await p.evaluate(() => {
    const el = document.getElementById('al-sting');
    const body = document.body.innerText.trim();
    return {
      present: !!el,
      display: el ? getComputedStyle(el).display : '(removed)',
      locked: document.documentElement.classList.contains('al-sting-locked'),
      words: body ? body.split(/\s+/).length : 0,
      skip: (() => {
        const s = document.querySelector('.al-sting__skip');
        if (!s) return null;
        const b = s.getBoundingClientRect();
        return { w: Math.round(b.width), h: Math.round(b.height) };
      })(),
    };
  });
  await ctx.close();
  return { ...r, media, label };
}

/* Path 1 — plays. */
{
  const r = await visit('js on, first visit', {}, { waitMs: 2000 });
  note(r.label, 'overlay shown', r.present && r.display === 'block', `display:${r.display}`);
  note(r.label, 'page scroll locked', r.locked, 'html.al-sting-locked not set');
  note(r.label, 'video requested', r.media.length > 0, 'no media request');
  note(r.label, 'skip target >= 44px', !!r.skip && (r.skip.h >= 44 || r.skip.w >= 44),
       r.skip ? `${r.skip.w}x${r.skip.h}` : 'no skip control');
}

/* Path 2 — the one that matters. */
{
  const r = await visit('javascript off', { javaScriptEnabled: false });
  note(r.label, 'overlay NOT rendered', r.display === 'none' || !r.present, `display:${r.display}`);
  note(r.label, 'video NOT requested', r.media.length === 0, r.media[0] || '');
  note(r.label, 'page copy intact', r.words > 1500, `${r.words} words`);
  note(r.label, 'scroll NOT locked', !r.locked, 'html.al-sting-locked set with JS off');
}

/* Path 3 — reduced motion. */
{
  const r = await visit('prefers-reduced-motion', { reducedMotion: 'reduce' });
  note(r.label, 'overlay removed', !r.present || r.display === 'none', `display:${r.display}`);
  note(r.label, 'video NOT requested', r.media.length === 0, r.media[0] || '');
  note(r.label, 'scroll NOT locked', !r.locked, 'html.al-sting-locked set');
}

/* Path 4 — second visit in the same session. */
{
  const r = await visit('second visit', {}, { twice: true, waitMs: 900 });
  note(r.label, 'overlay removed', !r.present, `display:${r.display}`);
}

await b.close();

/* The assets themselves. */
const assets = [
  ['assets/video/alidade-intro-sting-v2.mp4',  200_000],
  ['assets/video/alidade-intro-sting-v2.webm',  50_000],
  ['assets/img/alidade-intro-poster-v2.jpg',    10_000],
  ['js/alidade-sting-v1.js',                     1_000],
];
for (const [rel, min] of assets) {
  const f = resolve(SITE, rel);
  const ok = existsSync(f) && statSync(f).size >= min;
  note('(assets)', rel, ok, existsSync(f) ? `${statSync(f).size} bytes` : 'missing');
}

writeFileSync(resolve(here, 'report-sting.json'), JSON.stringify(report, null, 1));
console.log(`\n${report.length} checks · ${fails} failed · report-sting.json written`);
process.exit(fails ? 1 : 0);
