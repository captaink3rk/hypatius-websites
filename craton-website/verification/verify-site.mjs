/* verification/verify-site.mjs · craton-erp.us v2 website harness
   ─────────────────────────────────────────────────────────────────────────────
   craton-erp.us had never been verified. It is the fourth site in the portfolio
   to get a harness and the first where the harness had to be written against a
   build output rather than a source tree, because the served pages are
   self-unpacking bundles and there is nothing static to read.

   Cloned from the alidade.us harness, which carries the focus-timing fix found
   on STARCHITECT: getComputedStyle read immediately after a synthetic Tab
   returns a stale outline-width of 0 in this headless build, which produced
   eighteen confident false failures there. Both waits are kept here.

   Eight pages at 1440 and 390:
     1. no horizontal scroll                2. every text node >= 10px
     3. every interactive element >= 44px on one axis
     4. visible focus ring on the first focusable
     5. reduced motion: nothing still animating after load
     6. zero external requests (the fonts are now local files, not a CDN)
     7. AA contrast on a sample of text nodes against their composited background
     8. banned terms in visible text

   Run: PW_CHROME=/path/to/chrome node verification/verify-site.mjs
   Exit 1 on any failure. Report: verification/report-site.json */
import { chromium } from 'playwright';
import { writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '..', 'dist');
const PAGES = readdirSync(DIST).filter(f => f.endsWith('.html')).sort();

/* Terms that must not appear on a HYPATIUS public surface. The veteran-status
   claims and the dead hostnames are portfolio-wide; "Hypatius, Inc" and
   "HYPATIUS LLC" (no comma) are the two entity spellings that keep coming back. */
const BANNED = /VOSB|Veteran[- ]Owned|veteran-(owned|built|led)|VetCert|main\.hypati\.us|hypatius\.io|Hypatius, Inc|HYPATIUS LLC\b|Hypatius LLC\b|requires JavaScript/i;

const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const report = []; let fails = 0;
const note = (screen, vp, check, ok, detail) => {
  report.push({ screen, vp, check, ok, detail });
  if (!ok) { fails++; console.log(`  ✕ ${screen}@${vp} ${check}: ${detail}`); }
};

for (const file of PAGES) {
  const s = file.replace('.html', '');
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const ext = [];
    p.on('request', r => { const u = r.url(); if (!u.startsWith('file:') && !u.startsWith('data:')) ext.push(u); });
    await p.goto('file://' + resolve(DIST, file), { waitUntil: 'load' });
    await p.waitForTimeout(500);

    const r = await p.evaluate(() => {
      const out = {};
      out.hscroll = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const small = [], txt = [];
      let n;
      while ((n = walker.nextNode())) {
        const t = n.textContent.trim(); if (!t) continue;
        const el = n.parentElement; if (!el || (!el.offsetParent && el.tagName !== 'BODY')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const fs = parseFloat(cs.fontSize);
        txt.push(t);
        if (fs < 10 && !el.closest('svg')) small.push(`${fs}px "${t.slice(0, 30)}"`);
      }
      out.small = small.slice(0, 6); out.text = txt.join(' '); out.words = txt.join(' ').split(/\s+/).length;

      const inter = [...document.querySelectorAll('button,a[href],input,textarea,select,[role=button],[tabindex]:not([tabindex="-1"])')]
        .filter(e => e.offsetParent);
      const tiny = [];
      inter.forEach(e => {
        const rc = e.getBoundingClientRect();
        if (rc.width < 44 && rc.height < 44 && !/skip/i.test(e.className.toString())) {
          tiny.push(`${e.tagName}.${e.className.toString().split(' ')[0]} ${Math.round(rc.width)}x${Math.round(rc.height)}`);
        }
      });
      out.tiny = tiny.slice(0, 6); out.interCount = inter.length;
      out.anim = document.getAnimations().filter(a => a.playState === 'running' && a.effect.getTiming().iterations === Infinity).length;

      /* Contrast. The background is composited up the ancestor chain through
         every translucent layer to the first opaque one — a single
         getComputedStyle(el).backgroundColor is transparent on most text nodes
         and would silently score everything against black.
         This cannot see type sitting on a photograph; that is what
         verify-site-imagery.mjs is for. */
      const lum = c => { const m = c.match(/\d+(\.\d+)?/g).map(Number);
        const [r, g, bl] = m.slice(0, 3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
        return .2126 * r + .7152 * g + .0722 * bl; };
      const parse = c => { const m = (c || '').match(/[\d.]+/g); if (!m) return [0, 0, 0, 0];
        return [+m[0], +m[1], +m[2], m.length > 3 ? parseFloat(m[3]) : 1]; };
      const bgOf = el => { const layers = []; let e = el;
        while (e) { const c = parse(getComputedStyle(e).backgroundColor); if (c[3] > 0) layers.push(c); if (c[3] >= 1) break; e = e.parentElement; }
        let o = [22, 28, 36];  /* --cr-bed-page, the CRATON dark page colour */
        for (const l of layers.reverse()) o = o.map((v, i) => Math.round(l[i] * l[3] + v * (1 - l[3])));
        return `rgb(${o.join(', ')})`; };

      const lows = []; const seen = new Set();
      document.querySelectorAll('span,div,td,th,dt,dd,a,b,p,li,output,kbd,small,h1,h2,h3,figcaption').forEach(el => {
        if (!el.offsetParent) return;
        const t = (el.childNodes[0] && el.childNodes[0].nodeType === 3) ? el.childNodes[0].textContent.trim() : '';
        if (!t || seen.has(t)) return; seen.add(t);
        const cs = getComputedStyle(el);
        if (parseFloat(cs.opacity) < 1) return;
        if (el.closest('[disabled],[aria-disabled="true"],[aria-hidden="true"]')) return;
        const fg = cs.color, bg = bgOf(el);
        if (fg.startsWith('rgba') && parseFloat(fg.split(',')[3]) < 1) return;
        const L1 = lum(fg), L2 = lum(bg);
        const cr = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
        const fs = parseFloat(cs.fontSize);
        const need = (fs >= 18 || (fs >= 14 && parseInt(cs.fontWeight) >= 700)) ? 3 : 4.5;
        if (cr < need) lows.push(`${cr.toFixed(2)} "${t.slice(0, 26)}" ${fg} on ${bg}`);
      });
      out.lows = lows.slice(0, 8); out.lowCount = lows.length;

      out.imgNoAlt = [...document.querySelectorAll('img')]
        .filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src')).slice(0, 4);
      return out;
    });

    note(s, w, 'no-horizontal-scroll', !r.hscroll, 'page scrolls horizontally');
    note(s, w, 'type-floor-10px', r.small.length === 0, r.small.join(' · '));
    note(s, w, 'hit-target-44', r.tiny.length === 0, r.tiny.join(' · ') + ` (${r.interCount} interactive)`);
    note(s, w, 'reduced-motion-still', r.anim === 0, `${r.anim} infinite animations still running`);
    note(s, w, 'zero-cdn', ext.length === 0, ext.slice(0, 3).join(' '));
    note(s, w, 'contrast-aa', r.lowCount === 0, `${r.lowCount} low: ` + r.lows.join(' | '));
    note(s, w, 'img-alt', r.imgNoAlt.length === 0, r.imgNoAlt.join(' '));
    const bt = r.text.match(BANNED);
    note(s, w, 'banned-terms', !bt, bt ? bt[0] : '');

    await p.keyboard.press('Tab');
    if (await p.evaluate(() => /skip/i.test(document.activeElement?.className || ''))) await p.keyboard.press('Tab');
    /* Two animation frames before reading the ring. See the header note. */
    await p.evaluate(() => new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res))));
    const fr = await p.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return 'none';
      const cs = getComputedStyle(e);
      return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ? 'ok'
           : `no outline on ${e.tagName}.${e.className.toString().split(' ')[0]}`;
    });
    note(s, w, 'focus-visible', fr === 'ok' || fr === 'none', fr === 'none' ? 'no focusable controls' : fr);

    await ctx.close();
  }
}

await b.close();
writeFileSync(resolve(here, 'report-site.json'), JSON.stringify(report, null, 1));
console.log(`\n${report.length} checks · ${fails} failed · report-site.json written`);
process.exit(fails ? 1 : 0);
