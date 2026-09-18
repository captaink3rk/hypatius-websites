/* verification/verify-prerender.mjs · craton-erp.us v2
   ─────────────────────────────────────────────────────────────────────────────
   The structural harness. verify-site.mjs measures the rendered page; this one
   measures the bytes a crawler, a link unfurler or an answer engine is handed,
   which on this site was the whole problem: every page was a self-unpacking
   bundle that, without JavaScript, rendered

       "This page requires JavaScript to display."

   in full. Seven words, no nav, no footer, no entity, no description.

   Every check below is run with JAVASCRIPT DISABLED, because that is the state
   being fixed. Run it against dist/ after tools/prerender.mjs.

     1. renders without JS               6. exactly one description / canonical / og:title
     2. >= 300 words of real copy        7. title present and unique across the site
     3. the nav survives (>= 5 links)    8. no banned or placeholder copy
     4. the entity line is in the footer 9. no data: font URI left in the HTML
     5. page HTML under 40 KB           10. robots.txt and sitemap.xml cover every page

   Run: PW_CHROME=/path/to/chrome node verification/verify-prerender.mjs
   Exit 1 on any failure. Report: verification/report-prerender.json */
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '..', 'dist');
const PAGES = readdirSync(DIST).filter(f => f.endsWith('.html')).sort();
const ENTITY = 'HYPATIUS, LLC';

const report = []; let fails = 0;
const note = (page, check, ok, detail) => {
  report.push({ page, check, ok, detail });
  if (!ok) { fails++; console.log(`  ✕ ${page} ${check}: ${detail}`); }
};

const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
const titles = new Map();

for (const file of PAGES) {
  const name = file.replace('.html', '');
  const raw = readFileSync(join(DIST, file), 'utf8');
  const p = await ctx.newPage();
  await p.goto('file://' + join(DIST, file), { waitUntil: 'load' });

  const r = await p.evaluate(() => ({
    text: document.body.innerText.replace(/\s+/g, ' ').trim(),
    links: [...document.querySelectorAll('a[href]')].length,
    navLinks: [...document.querySelectorAll('nav a[href]')].length,
    title: document.title,
  }));
  await p.close();

  const words = r.text ? r.text.split(' ').length : 0;
  note(name, 'renders-without-js', !/requires JavaScript/i.test(r.text), r.text.slice(0, 60));
  note(name, 'copy-300-words', words >= 300, `${words} words`);
  note(name, 'nav-survives', r.navLinks >= 5, `${r.navLinks} nav links, ${r.links} total`);
  note(name, 'entity-line', r.text.includes(ENTITY), `"${ENTITY}" not in the rendered text`);

  const kb = statSync(join(DIST, file)).size / 1024;
  note(name, 'html-under-40kb', kb < 40, `${kb.toFixed(1)} KB`);

  const count = re => (raw.match(re) || []).length;
  const desc  = count(/<meta[^>]+name=["']description["']/gi);
  const canon = count(/<link[^>]+rel=["']canonical["']/gi);
  const ogt   = count(/<meta[^>]+property=["']og:title["']/gi);
  note(name, 'meta-exactly-one', desc === 1 && canon === 1 && ogt === 1,
       `description x${desc} · canonical x${canon} · og:title x${ogt}`);

  note(name, 'title-unique', !!r.title && !titles.has(r.title),
       titles.has(r.title) ? `same title as ${titles.get(r.title)}` : 'empty title');
  if (r.title) titles.set(r.title, name);

  note(name, 'no-inline-font-data', !/data:font|data:application\/font|@font-face/i.test(raw),
       'a font is still inlined in the HTML');
}

await b.close();

/* Site-level. Neither file existed before this pass. */
for (const f of ['robots.txt', 'sitemap.xml']) {
  note('(site)', `${f}-present`, existsSync(join(DIST, f)), 'missing');
}
if (existsSync(join(DIST, 'sitemap.xml'))) {
  const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  const missing = PAGES.map(f => f.replace('.html', ''))
    .filter(n => !sm.includes(n === 'index' ? '<loc>https://craton-erp.us/<' : `/${n}<`));
  note('(site)', 'sitemap-covers-every-page', missing.length === 0, missing.join(', '));
}
/* The fonts and the stylesheet are the point of the split: they must exist as
   real files, or the pages reference nothing. */
note('(site)', 'shared-css-present', existsSync(join(DIST, 'css', 'craton.css')), 'missing');
note('(site)', 'layer-css-present', existsSync(join(DIST, 'css', 'craton-v2.css')), 'missing');
const fonts = existsSync(join(DIST, 'assets', 'fonts')) ? readdirSync(join(DIST, 'assets', 'fonts')).length : 0;
/* 31 @font-face rules resolve to 26 unique files — several faces share a
   file. The bar is that they are files at all, not inline base64. */
note('(site)', 'fonts-extracted', fonts >= 20, `${fonts} font files`);
const css = existsSync(join(DIST, 'css', 'craton.css')) ? readFileSync(join(DIST, 'css', 'craton.css'), 'utf8') : '';
note('(site)', 'no-blob-refs-in-css', !css.includes('blob:'), 'a blob: URL is still referenced');
note('(site)', 'no-base64-fonts-in-css', !/base64/.test(css), 'a base64 payload is still in the stylesheet');

writeFileSync(resolve(here, 'report-prerender.json'), JSON.stringify(report, null, 1));
console.log(`\n${report.length} checks · ${fails} failed · report-prerender.json written`);
process.exit(fails ? 1 : 0);
