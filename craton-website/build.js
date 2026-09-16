/* ============================================================
   CRATON site · production build
   Strips design-review chrome and emits a clean tree in dist/.

     node build.js            build into ./dist
     node build.js --check    exit 1 if a built page still carries
                              review chrome or a rule violation

   Review chrome is the annotation rail, the copy notes, and the
   data-screen-label attributes the design-system card reader uses.
   It is authored inline so that reviewing the page and building it
   are the same source, and removed here so a reviewer note can
   never ship to hypati.us.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const DIST = path.join(SRC, 'dist');

/* Corporate violation grep — CLAUDE.md, run before anything ships. */
const VIOLATION =
  /VOSB|Veteran[- ]Owned|veteran-(owned|built|led)|VetCert|main\.hypati\.us|hypatius\.io|Sara Dillan|Brian Willcott|CJADC2/i;
/* Rule 11: no emoji, ever. Geometric marks and section signs are fine. */
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{FE0F}\u{2700}-\u{27BF}]/u;
/* Web kit: "ERP" never appears in visible copy — descriptor and meta only. */
const ERP = /\bERP\b/;

/* ---- the strippers -------------------------------------------------
   Regex on HTML is usually a mistake. It is safe here because every
   construct removed is authored by this project to a fixed shape, and
   --check re-reads the output to prove the removal happened. */
const STRIP = [
  // the annotation rail and anything else explicitly marked
  [/[ \t]*<div class="cr-ann" data-review>[\s\S]*?<\/div>\n?/g, ''],
  [/[ \t]*<[a-z]+[^>]*\sdata-review\b[\s\S]*?<\/[a-z]+>\n?/g, ''],
  // every copy note
  [/[ \t]*<div class="cr-note"[\s\S]*?<\/div>\n?/g, ''],
  // the design-system card reader's labels
  [/\sdata-screen-label="[^"]*"/g, ''],
  // the @dsCard comment
  [/<!--\s*@dsCard[\s\S]*?-->\n?/g, ''],
  // the notes toggle script block, identified by its own marker
  [/\/\* ---- copy-notes toggle ---- \*\/[\s\S]*?\}\)\(\);\n/g, ''],
  // Authoring commentary. It is written for Jim and for the next designer,
  // not for the browser, and some of it names the review chrome — which is
  // what tripped the --check gate before this rule existed. The source
  // keeps every comment; only dist/ loses them.
  [/^[ \t]*<!--[\s\S]*?-->[ \t]*\n/gm, ''],
  [/<!--[\s\S]*?-->/g, ''],
];

function strip(html) {
  return STRIP.reduce((s, [re, to]) => s.replace(re, to), html);
}

/* visible text only: drop script/style/comments and tags, keep content */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<meta[^>]*>/gi, ' ')
    .replace(/<title>[\s\S]*?<\/title>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

function pages() {
  return fs.readdirSync(SRC)
    .filter(f => f.endsWith('.html') && f !== 'kit.html')
    .concat(
      fs.existsSync(path.join(SRC, 'craton'))
        ? walk(path.join(SRC, 'craton')).map(p => path.relative(SRC, p))
        : []
    );
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : (e.name.endsWith('.html') ? [p] : []);
  });
}

function lint(name, html) {
  const errs = [];
  const text = visibleText(html);
  const m = html.match(VIOLATION);
  if (m) errs.push(`corporate rule violation: "${m[0]}"`);
  if (EMOJI.test(html)) errs.push('emoji present (rule 11)');
  if (ERP.test(text)) errs.push('"ERP" in visible copy — descriptor and meta only');
  if (/data-review|cr-note|data-screen-label|@dsCard/.test(html))
    errs.push('review chrome survived the strip');
  if (!/<a class="cr-skip"/.test(html)) errs.push('no skip link');
  if (!/<main id="main">/.test(html)) errs.push('no main landmark');
  if (!/application\/ld\+json/.test(html)) errs.push('no structured data');
  if (!/<link rel="canonical"/.test(html)) errs.push('no canonical');
  return errs.map(e => `${name}: ${e}`);
}

const check = process.argv.includes('--check');
let failures = [];

pages().forEach(rel => {
  const html = strip(fs.readFileSync(path.join(SRC, rel), 'utf8'));
  failures = failures.concat(lint(rel, html));
  if (!check) {
    const out = path.join(DIST, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log('built', rel, html.length, 'bytes');
  }
});

if (!check) {
  ['site.css', 'robots.txt', 'sitemap.xml', 'image-slot.js'].forEach(f => {
    if (fs.existsSync(path.join(SRC, f))) {
      fs.copyFileSync(path.join(SRC, f), path.join(DIST, f));
    }
  });
}

if (failures.length) {
  console.error('\nFAIL\n' + failures.map(f => '  ' + f).join('\n'));
  process.exit(1);
}
console.log(check ? 'check: PASS' : '\nbuilt clean');
