/* tools/prerender.mjs · craton-erp.us v2
   ─────────────────────────────────────────────────────────────────────────────
   What this fixes, measured before it ran.

   Every page of craton-erp.us is a self-unpacking bundle. With JavaScript
   disabled, all eight pages render this, in full:

       "This page requires JavaScript to display."

       7 words · 0 links · no nav · no footer · no entity line
       no meta description · no Open Graph · no canonical

   The <title> is the only thing a crawler, a link preview, an AI answer engine
   or a procurement scraper gets. For a product sold to small government
   contractors — who find software by searching for "DCAA timekeeping" — that is
   close to not existing.

   The second half of the problem is the payload. Each page inlines a 5.78 MB
   stylesheet, of which:

       5,593,718 bytes   31 @font-face rules with base64 data URIs
         189,492 bytes   the actual CSS

   Eight families are embedded: Big Shoulders Display, IBM Plex Sans, IBM Plex
   Serif, IBM Plex Mono — CRATON's own — plus Bebas Neue and Rajdhani, which are
   HYPATIUS corporate, and Barlow Condensed and Inter, which are ALIDADE. They
   are inlined per page, so nothing caches across the site: eight pages at ~3 MB
   each, re-downloading the same fonts every time.

   This script renders each page, waits for it to unpack, and then writes out
   what the browser ended up with:

     · every embedded font extracted once to assets/fonts/ as a real file
     · one shared stylesheet, with the data URIs rewritten to those files, so it
       is downloaded once and cached for all eight pages
     · the unpacked DOM as static HTML, with the bundler scaffolding removed
     · the page's own meta, description, Open Graph and canonical — which it
       writes at RUNTIME, so no crawler without JavaScript has ever seen them —
       now present in the served bytes, plus og:site_name and robots, which it
       genuinely lacked. See the note above the metadata block: the first
       version of this script assumed the tags did not exist and shipped every
       page with two of each.
     · the entity line, HYPATIUS, LLC, which was missing from the footer in the
       served bytes AND after the JavaScript had run
     · the mobile call-out, which the site never had

   Run: node tools/prerender.mjs
        node tools/prerender.mjs --check   (report only; writes nothing)
*/
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const here  = dirname(fileURLToPath(import.meta.url));
const SRC   = join(here, '..', 'craton-website');
const OUT   = join(here, '..', 'dist');
const LAYER = join(here, '..', 'layer');
const CAPS  = join(here, '..', 'build');
const CHECK = process.argv.includes('--check');

/* The mobile call-out. CRATON's platform prototype has a phone mode whose nav
   is a four-item tab bar; the site never showed it, so the half of the product
   that answers "was it written down the day it was worked" was described and
   never seen. Four screens captured at 2x, masked at the corners, and placed in
   the same kind of device row alidade.us uses — drawn in CRATON's own square
   vocabulary rather than imported wholesale. See layer/craton-v2.css.

   Placed after #hours: the pillars say what the system keeps, then the phone
   says where the keeping happens, and the binder section's "answered daily"
   lands with the reader having already seen the screen that answers it. */
const MOBILE_HTML = readFileSync(join(LAYER, 'mobile-section.html'), 'utf8');
const MOBILE_PNGS = ['home', 'myday', 'approvals', 'binder'].map(n => `cr-mobile-${n}-v1.png`);
const MOBILE_ON   = { index: '<section data-screen-label="Voice">' };  // insert BEFORE this anchor

/* Per-page metadata. The bundle carries none of this, and a description is the
   line that decides whether a search result gets clicked. Written to match what
   each page actually says rather than padded with keywords. */
const META = {
  index: {
    desc: 'DCAA-ready timekeeping, charge codes, indirect rate pools and the SF 1408 audit binder, for government contractors of one to fifty people.',
    canonical: '/',
  },
  hours: {
    desc: 'Timekeeping built to survive a DCAA floor check: quarter-hour increments, a reason on record for short days, and every correction kept rather than overwritten.',
    canonical: '/hours',
  },
  codes: {
    desc: 'Charge code lifecycle for government contracts — codes derived from the funding source, so nothing is charged without one.',
    canonical: '/codes',
  },
  rates: {
    desc: 'Indirect rate pools — fringe, overhead and G&A — that update when the ledger does, with provisional and actual side by side against ceiling.',
    canonical: '/rates',
  },
  binder: {
    desc: 'The SF 1408 audit binder, generated from the ledger on the day it is asked for rather than assembled the night before. Fourteen areas, always current.',
    canonical: '/binder',
  },
  record: {
    desc: 'Every AI-assisted run kept whole: inputs, tools called, outputs and the named reviewer who signed. Nothing counts until a person reviews it.',
    canonical: '/record',
  },
  compare: {
    desc: 'CRATON against QuickBooks add-ons and the large GovCon platforms, for firms too small for the enterprise suites and too regulated for the bookkeeping ones.',
    canonical: '/compare',
  },
  walkthrough: {
    desc: 'Request a CRATON walkthrough. Thirty minutes, your own charge codes and rate structure, no slideware.',
    canonical: '/walkthrough',
  },
};

const SITE = 'https://craton-erp.us';
const ENTITY = 'HYPATIUS, LLC';
const CRED = 'UEI UKELB3UV76V6 · CAGE 19S89';

const EXT = { 'font/woff2': 'woff2', 'font/woff': 'woff', 'font/ttf': 'ttf',
              'application/font-woff2': 'woff2', 'application/x-font-woff': 'woff' };

mkdirSync(OUT, { recursive: true });
mkdirSync(join(OUT, 'assets', 'fonts'), { recursive: true });
mkdirSync(join(OUT, 'css'), { recursive: true });
mkdirSync(join(OUT, 'assets', 'img'), { recursive: true });
const writtenAssets = new Set(); let assetBytes = 0;

const pages = readdirSync(SRC).filter(f => f.endsWith('.html')).map(f => f.replace('.html', '')).sort();
const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });

let sharedCss = null, fontReport = null, beforeTotal = 0, afterTotal = 0;
const rows = [], metaReport = [], mobileInserted = [], entityAdded = [];
let slotCount = 0, altFilled = 0, altMissing = 0;
const proxyStripped = [];

/* The additive layer and the four captures ride along with the build. */
if (!CHECK) {
  copyFileSync(join(LAYER, 'craton-v2.css'), join(OUT, 'css', 'craton-v2.css'));
  for (const f of MOBILE_PNGS) copyFileSync(join(CAPS, f), join(OUT, 'assets', 'img', f));
}

for (const name of pages) {
  const p = await ctx.newPage();
  await p.goto('file://' + join(SRC, name + '.html'), { waitUntil: 'load' });
  await p.waitForTimeout(1600);

  /* The bundler serves images as blob: URLs created at runtime from its own
     payload. Those die the moment the DOM is written to disk, which is how the
     first run produced eight pages of broken images. Each one is fetched inside
     the page, turned back into bytes, and written out as a real file. */
  const blobs = await p.evaluate(async () => {
    const urls = new Set();
    document.querySelectorAll('[src^="blob:"]').forEach(e => urls.add(e.getAttribute('src')));
    /* Three places the first version of this collector did not look, each of
       which shipped a dangling blob: reference into the build:
         · <link rel="icon"> and <link rel="apple-touch-icon"> — every page
           shipped a dead favicon, which the harness caught as a failed request
         · ::before / ::after backgrounds — getComputedStyle(el) does not
           return a pseudo-element's background-image
         · the stylesheet text itself, for rules no element on this page
           happens to match */
    document.querySelectorAll('link[href^="blob:"]').forEach(e => urls.add(e.getAttribute('href')));
    document.querySelectorAll('*').forEach(e => {
      for (const pseudo of [null, '::before', '::after']) {
        const bg = getComputedStyle(e, pseudo).backgroundImage || '';
        for (const m of bg.matchAll(/url\("?(blob:[^")]+)"?\)/g)) urls.add(m[1]);
      }
    });
    for (const st of document.querySelectorAll('style')) {
      for (const m of (st.textContent || '').matchAll(/url\(\s*["']?(blob:[^"')]+)["']?\s*\)/g)) urls.add(m[1]);
    }
    const out = [];
    for (const u of urls) {
      try {
        const r = await fetch(u); const buf = await r.arrayBuffer();
        out.push({ url: u, type: r.headers.get('content-type') || 'image/png',
                   b64: btoa(String.fromCharCode(...new Uint8Array(buf))) });
      } catch (e) { out.push({ url: u, error: String(e).slice(0, 60) }); }
    }
    return out;
  });

  const got = await p.evaluate(() => {
    /* <image-slot> is a custom element. Its definition lives in the bundle's
       JavaScript, which this script removes — so in the first static build
       every one of the five plates on this site rendered as NOTHING. The hero,
       the strata band, the CTA and the two page plates were all empty, and
       because the hero's scrim is opaque under the headline the page still
       looked deliberate, which is why it took a photographic contrast harness
       reporting a perfectly flat 16.88:1 to catch it.

       Each slot becomes the plain <img> it was always standing in for. The
       alt text is filled in afterwards from the SVG's own aria-label; slots
       inside a role="presentation" container stay decorative. */
    document.querySelectorAll('image-slot').forEach(el => {
      const img = document.createElement('img');
      img.className = 'cr-slot__img';
      img.setAttribute('src', el.getAttribute('src') || '');
      img.setAttribute('alt', '');
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      if (!el.closest('[role="presentation"],[aria-hidden="true"]')) img.setAttribute('data-alt-from-svg', '');
      el.replaceWith(img);
    });

    const slots = document.querySelectorAll('img.cr-slot__img').length;

    const styles = [...document.querySelectorAll('style')];
    const css = styles.map(s => s.textContent || '').join('\n');
    // Strip the bundler's own scaffolding and every script: once the DOM is
    // written out, the unpacker has nothing left to unpack.
    document.querySelectorAll('script,[id^="__bundler"],#__bundler_loading,#__bundler_thumbnail')
      .forEach(n => n.remove());
    styles.forEach(s => s.remove());
    return { css, slots, html: document.documentElement.outerHTML, title: document.title,
             text: document.body.innerText.trim() };
  });
  await p.close();

  slotCount += got.slots;
  beforeTotal += statSync(join(SRC, name + '.html')).size;

  /* Write every blob out and build the url -> file map, BEFORE the stylesheet
     is assembled — some of those blobs are referenced from CSS, not markup,
     and the CSS is written only once. */
  const blobMap = new Map();
  for (const bl of blobs) {
    if (bl.error) { console.log(`  ! blob unresolved on ${name}: ${bl.error}`); continue; }
    const buf = Buffer.from(bl.b64, 'base64');
    const ext = (bl.type.split('/')[1] || 'png').split('+')[0].replace('jpeg', 'jpg');
    const hash = createHash('sha1').update(buf).digest('hex').slice(0, 10);
    const file = `a-${hash}.${ext}`;
    if (!CHECK && !writtenAssets.has(file)) {
      let out = buf;
      /* The five image slots hold procedural proxies, and each proxy has its
         production note burned into the artwork: a slot code, the brief, and
         the words PHOTOGRAPHY PENDING. That was invisible while the slots
         rendered as nothing; now that they render, it would ship to the live
         home page.

         The <text> blocks are removed and the labelled original is kept beside
         the stripped one as *.labelled.svg, so the brief is not lost and the
         proxy can be put back with the note if anyone wants it. The plate's
         aria-label lives on the root element, not in a <text>, so the alt text
         survives. The CRATON wordmark SVG has <text> too and is left alone —
         only files carrying the pending note are touched. */
      if (ext === 'svg') {
        const svg = buf.toString('utf8');
        if (svg.includes('PHOTOGRAPHY PENDING')) {
          writeFileSync(join(OUT, 'assets', 'img', file.replace(/\.svg$/, '.labelled.svg')), buf);
          out = Buffer.from(svg.replace(/<text[\s\S]*?<\/text>/g, ''), 'utf8');
          proxyStripped.push(file);
        }
      }
      writeFileSync(join(OUT, 'assets', 'img', file), out); writtenAssets.add(file);
      assetBytes += out.length;
    }
    blobMap.set(bl.url, file);
  }

  /* The fonts are identical on every page, so they are extracted once and the
     stylesheet is built once. Every later page reuses both. */
  if (!sharedCss) {
    const faces = [];
    let css = got.css.replace(
      /url\(\s*(["']?)data:([^;]+);base64,([A-Za-z0-9+/=]+)\1\s*\)/g,
      (_m, _q, mime, b64) => {
        const buf = Buffer.from(b64, 'base64');
        const ext = EXT[mime.trim()] || 'woff2';
        const hash = createHash('sha1').update(buf).digest('hex').slice(0, 10);
        const file = `f-${hash}.${ext}`;
        if (!CHECK) writeFileSync(join(OUT, 'assets', 'fonts', file), buf);
        faces.push({ file, bytes: buf.length });
        return `url("../assets/fonts/${file}")`;
      });
    /* Which families does the CSS actually use, as opposed to merely embed?
       This looks at the whole stylesheet minus the @font-face blocks, NOT just
       `font-family:` declarations — CRATON sets its faces through custom
       properties (`--t-display: 'Big Shoulders Display'`), so a literal
       font-family scan reports its own display face as unused, which is how the
       first version of this script produced a confidently wrong list.

       Reported, never deleted: dropping a face because no rule appears to name
       it is the kind of optimisation that removes a fallback nobody noticed. */
    const declared = [...new Set([...css.matchAll(/@font-face[^}]*?font-family:\s*["']?([^;"'}]+)/g)]
      .map(m => m[1].trim()))];
    const body = css.replace(/@font-face[^}]*}/g, '');
    const used = declared.filter(f => body.includes(f));
    /* Rules that reference a blob (a ::before background, for instance) are
       repointed at the extracted file. Left alone they are dangling references
       to a URL that only existed inside the tab that created it. */
    for (const [url, file] of blobMap) css = css.split(url).join(`../assets/img/${file}`);
    const stray = (css.match(/blob:/g) || []).length;
    if (stray) console.log(`  ! ${stray} blob: reference(s) left in the stylesheet`);

    sharedCss = css;
    fontReport = { count: faces.length, files: new Set(faces.map(f => f.file)).size, bytes: faces.reduce((a, f) => a + f.bytes, 0),
                   declared, used, unused: declared.filter(f => !used.includes(f)) };
    if (!CHECK) writeFileSync(join(OUT, 'css', 'craton.css'), css);
  }

  /* Metadata, and a correction to the first version of this script.
     ───────────────────────────────────────────────────────────────
     The audit finding was that no page has a description, Open Graph or a
     canonical. That is true of the SERVED bytes, which is what matters — but
     it is not true of the page once its JavaScript has run: the bundle injects
     a good, page-authored set at runtime, which no crawler without JS ever
     sees. The first version of this script did not check, so every prerendered
     page shipped two descriptions, two og:titles and two canonicals, and on
     index.html the two descriptions disagreed with each other.

     So: take what the page already wrote for itself, and add only what it left
     out. A tag from META is emitted solely as a fallback for a page that has
     none of its own. */
  const m = META[name] || { desc: '', canonical: '/' + name };
  const headSrc = (got.html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || ['', ''])[1];
  const hasName = k => new RegExp(`<meta[^>]+name=["']${k}["']`, 'i').test(headSrc);
  const hasProp = k => new RegExp(`<meta[^>]+property=["']${k}["']`, 'i').test(headSrc);
  const hasCanon = /<link[^>]+rel=["']canonical["']/i.test(headSrc);

  const candidates = [
    [!hasName('description'), `<meta name="description" content="${m.desc}">`],
    [!hasCanon,               `<link rel="canonical" href="${SITE}${m.canonical}">`],
    [!hasProp('og:type'),     `<meta property="og:type" content="website">`],
    [!hasProp('og:site_name'),`<meta property="og:site_name" content="CRATON">`],
    [!hasProp('og:title'),    `<meta property="og:title" content="${got.title.replace(/"/g, '&quot;')}">`],
    [!hasProp('og:description'), `<meta property="og:description" content="${m.desc}">`],
    [!hasProp('og:url'),      `<meta property="og:url" content="${SITE}${m.canonical}">`],
    [!hasName('twitter:card'),`<meta name="twitter:card" content="summary_large_image">`],
    [!hasName('robots'),      `<meta name="robots" content="index,follow">`],
  ];
  const added = candidates.filter(([need]) => need).map(([, tag]) => tag);
  metaReport.push({ name, kept: candidates.length - added.length, added: added.length });

  const head = [...added,
    `<link rel="stylesheet" href="css/craton.css">`,
    `<link rel="stylesheet" href="css/craton-v2.css">`,
  ].join('\n  ');

  let html = got.html;

  /* The entity line. Every other site in the portfolio carries the operating
     company in its footer; craton-erp.us carries the UEI and the CAGE but
     never names HYPATIUS, LLC — not in the served bytes and not after the
     JavaScript has run. The footer stamp already exists and already has the
     credentials, so the entity is added to the front of it rather than a
     second block being bolted on beneath. */
  if (!html.includes(ENTITY) && html.includes('<div class="cr-stamp">')) {
    html = html.replace('<div class="cr-stamp">',
      `<div class="cr-stamp">&copy; 2026 ${ENTITY}<br>`);
    entityAdded.push(name);
  }

  /* The mobile call-out, inserted before its anchor section. Idempotent: the
     anchor is matched once and the section carries its own id. */
  if (MOBILE_ON[name]) {
    const anchor = MOBILE_ON[name];
    if (html.includes('id="mobile"')) {
      console.log(`  ! ${name}: #mobile already present, not inserted again`);
    } else if (!html.includes(anchor)) {
      console.log(`  ! ${name}: mobile anchor not found — section NOT inserted`);
    } else {
      html = html.replace(anchor, MOBILE_HTML + anchor);
      mobileInserted.push(name);
    }
  }

  /* Repoint every markup reference at the real file. */
  for (const [url, file] of blobMap) html = html.split(url).join(`assets/img/${file}`);

  /* Now that the slots point at real files, lift each plate's own aria-label
     out of the SVG and use it as the img's alt. The plates were commissioned
     with that description written into them; re-typing it here would be a
     second source of truth that could drift. */
  html = html.replace(/<img([^>]*?)data-alt-from-svg=""([^>]*?)>/g, (m, a, bAttr) => {
    const src = (m.match(/src="([^"]+)"/) || [])[1] || '';
    let alt = '';
    try {
      const svg = readFileSync(join(OUT, src), 'utf8');
      alt = (svg.match(/aria-label="([^"]+)"/) || [])[1] || '';
    } catch { /* not an SVG, or not written yet */ }
    if (!alt) { console.log(`  ! ${name}: no aria-label in ${src} — plate alt left empty`); altMissing++; }
    else altFilled++;
    return `<img${a}${bAttr} alt="${alt.replace(/"/g, '&quot;')}">`.replace(/ alt=""(?=[\s>])/, '');
  });
  const strayHtml = (html.match(/blob:/g) || []).length;
  if (strayHtml) console.log(`  ! ${name}: ${strayHtml} blob: reference(s) left in the markup`);

  html = html.replace(/<head([^>]*)>/i, `<head$1>\n  ${head}`);
  // The loading shim's body rule centres a spinner; the real page does not want it.
  html = html.replace(/<style>[\s\S]*?<\/style>/i, '');
  html = '<!DOCTYPE html>\n' + html;

  if (!CHECK) writeFileSync(join(OUT, name + '.html'), html);
  afterTotal += Buffer.byteLength(html);
  const shown = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ').split(/\s+/).filter(Boolean).length;
  rows.push({ name, words: shown, bytes: Buffer.byteLength(html) });
}

await b.close();

/* robots + sitemap: neither existed. */
if (!CHECK) {
  writeFileSync(join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
  const urls = pages.map(n => {
    const c = (META[n] || {}).canonical || '/' + n;
    return `  <url><loc>${SITE}${c}</loc><priority>${c === '/' ? '1.0' : '0.7'}</priority></url>`;
  }).join('\n');
  writeFileSync(join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

const mb = n => (n / 1048576).toFixed(2) + ' MB';
console.log(`\nprerendered ${rows.length} page(s)`);
for (const r of rows) console.log(`  ${r.name.padEnd(13)} ${String(r.words).padStart(5)} words  ${(r.bytes/1024).toFixed(0).padStart(5)} KB`);
console.log(`\nmobile call-out inserted on: ${mobileInserted.join(', ') || '(none)'}`);
console.log(`entity line "${ENTITY}" added to ${entityAdded.length} footer(s) — it was on none`);
console.log(`proxy plates de-labelled: ${proxyStripped.length} — "PHOTOGRAPHY PENDING" and the slot brief removed from the artwork (originals kept as *.labelled.svg)`);
console.log(`image slots -> <img>: ${slotCount} (they rendered as NOTHING once the scripts were stripped) · ${altFilled} alt from the plate's aria-label, ${altMissing} empty`);
const metaKept = metaReport.reduce((a, r) => a + r.kept, 0);
const metaAdd  = metaReport.reduce((a, r) => a + r.added, 0);
console.log(`meta tags: ${metaKept} kept from the page's own runtime set, ${metaAdd} added where it had none — 0 duplicated`);
console.log(`\nimages extracted: ${writtenAssets.size} files, ${mb(assetBytes)} (were runtime blob: URLs)`);
console.log(`fonts extracted : ${fontReport.count} @font-face rules -> ${fontReport.files} files, ${mb(fontReport.bytes)} — now downloaded ONCE, not per page`);
console.log(`families declared: ${fontReport.declared.join(', ')}`);
if (fontReport.unused.length) console.log(`families embedded but never used by a rule: ${fontReport.unused.join(', ')}`);
console.log(`\nHTML total  before ${mb(beforeTotal)}  ->  after ${mb(afterTotal)} + ${mb(Buffer.byteLength(sharedCss))} shared CSS + ${mb(fontReport.bytes)} shared fonts`);
console.log(`first visit  ${mb(beforeTotal / pages.length)} -> ${mb(afterTotal / pages.length + Buffer.byteLength(sharedCss) + fontReport.bytes)}`);
console.log(`every later page  ${mb(beforeTotal / pages.length)} -> ${mb(afterTotal / pages.length)}  (CSS and fonts cached)`);
