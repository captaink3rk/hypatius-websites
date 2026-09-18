# craton-erp.us — v2, the prerender pass

**18 September 2026 · HYPATIUS Design System · CRATON tier**

Nothing live was changed. Nothing in the repo was touched. This is a working copy.

---

## 0 · The finding, before anything else

craton-erp.us has eight pages. With JavaScript disabled, every one of them renders this, in full:

> This page requires JavaScript to display.

Seven words. No nav, no footer, no headings, no links, no entity. Each page is a self-unpacking
bundle: the served HTML is a loader, and everything a reader sees is assembled in the browser after
it runs.

That is not a theoretical problem for this product. CRATON is sold to firms of one to fifty people
who find software by typing *DCAA timekeeping* into a search box. The `<title>` was the only thing a
crawler, a link unfurler, an answer engine or a procurement scraper ever received.

The second half of it is weight. Each page inlines a **5.78 MB** stylesheet:

| | |
|---|---|
| 5,593,718 bytes | 31 `@font-face` rules as base64 data URIs |
| 189,492 bytes | the actual CSS |

Eight families are embedded — CRATON's four, plus Bebas Neue and Rajdhani (HYPATIUS corporate) and
Barlow Condensed and Inter (ALIDADE) — **per page**, so nothing caches across the site. Eight pages
at ~2.83 MB each, re-downloading the same fonts every time.

`tools/prerender.mjs` is the answer to both. It renders each page, waits for it to unpack, and writes
out what the browser ended up with.

| | Before | After |
|---|---|---|
| Rendered without JS | 7 words, 0 links | **652–1,121 words, 25–30 links** |
| First visit | 2.83 MB | 4.20 MB (fonts, once) |
| **Every later page** | **2.83 MB** | **0.01 MB** |
| HTML across the site | 22.67 MB | 0.10 MB + 0.18 MB CSS + 4.00 MB fonts, all cached |

---

## 1 · What you asked for: the mobile call-out

> *"You should also have assets re: the mobile version of craton platform. I like the way we called
> those out in the alidade website, so let's do that on the craton site as well. Let me know if you
> cannot locate those assets."*

**Located.** The platform prototype has a Controls palette with a Device toggle; in phone mode the
nav becomes a four-item tab bar — Home, My day, Approvals, Binder. All four captured at 2×.

The new `#mobile` section sits third on the home page, between the four pillars and the voice
section. That placement is the argument: the pillars say what the system keeps, the phone says where
the keeping happens, and the binder section's existing line — *"CRATON's home screen is that
question, answered daily"* — now lands with the reader having already seen the screen that answers
it.

**Daily means daily.** A floor check does not ask whether the numbers add up; it asks an employee
what they are charging *today* and whether they wrote it down *today*. That is the one thing a phone
is for, and the site had never shown it.

### Drawn in CRATON's vocabulary, not ALIDADE's

The *treatment* is ALIDADE's — screens in frames, one raised, captioned in mono. Three decisions
went the other way on purpose:

| | ALIDADE | CRATON | Why |
|---|---|---|---|
| Frame radius | 22px pill | **2px** | `--radius-card` on this brand is 2px. CRATON is square-cornered; a pill frame would have been an import. The phone's own rounded silhouette sits inside a square plinth. |
| Emphasis | middle frame lifted a surface level | **2px bronze top rule** | That is `.cr-card--hi`, CRATON's own existing emphasis. The raised one is **My day** — the screen the floor check is actually about. |
| Count | three | **four** | Four destinations exist. Showing three would have meant picking one to leave out. |

### One thing that would have shipped as four dark notches

Each capture had the prototype's void colour baked into its rounded corners. Dropped onto a frame,
those corners read as four darker squares inside the phone's radius. They are now transparent, so the
frame shows through — which also means the frames can be resurfaced later without recutting the PNGs.

### And the separation, which is the CRATON-specific trap

The phone bezel is `#161C24`. That is **the same value as `--bg-page`**: at page level the device
would have met the page at 1.00:1 and vanished. The section drops to `--bg-section-alt` (`#1F2731`)
and the frame rises to `--surface-raised` (`#2C3744`), putting the phone **1.30:1** above its frame,
with a hairline doing the rest. No shadow.

This is the same trap found on the parent site in v4.4, where CRATON's own "Strata" palette turned out
to be byte-identical to hypati.us's page colour. It is worth writing down as a rule: **before placing
a CRATON capture on anything, compare the two page values.**

---

## 2 · Content: a real name against an invented medical absence

The Approvals capture showed a reason-on-record quote —

> *"Half day — dentist. PTO not requested, so the day is booked as worked and short."*
> — entered by **Jordan Broe**, 2026-09-11 16:42

— attributed by name to a real person, on a screen bound for a public marketing site. That is the
same class of error as the veteran-service claims found on starchitect.us: a factual assertion about
a named individual that nobody checked and that happens not to be true.

The demo data now reads **"Half day — personal time."** The mechanic being demonstrated is
unchanged — a short day carries a written reason, the reason is carried to the timesheet and the
ledger — and no medical detail is attached to anyone. The input placeholder in the platform
(`e.g. Half day, dentist…`) was changed to match, so the next capture cannot reintroduce it.

**Worth a decision from you:** the prototype's demo data uses real HYPATIUS employee names throughout
— Jordan Broe, Shawna LeMieux, Maureen O'Brien, Jim LeMieux. On an internal prototype that is
friendly. On captures that ship to a public site it means real people's names appear beside invented
hours, invented approvals and invented charge codes. Swapping the demo tenant to invented names is a
half-hour change to `platform/data.js` and it removes the whole category.

---

## 3 · Three things the prerender broke, and what caught each one

This is the part worth reading, because two of them were invisible and one of them I shipped.

### 3.1 Every image on the site rendered as nothing

`<image-slot>` is a custom element. Its definition lives in the bundle's JavaScript — which the
prerender removes. So in the first static build, all five plates (hero, strata band, CTA, and the
binder and walkthrough page plates) rendered as **absolutely nothing**.

It did not look broken. The hero's scrim is opaque under the headline, so the page read as a
deliberate dark composition. What caught it was the photographic harness returning **16.88:1 with the
worst pixel also at 16.88:1** — every sampled pixel identical, which only happens over a flat fill.
A photograph does not do that.

Each slot is now the plain `<img>` it was standing in for, and its alt text is lifted from the SVG's
own `aria-label` rather than retyped, so there is one source of truth for the description.

### 3.2 The proxy plates carry "PHOTOGRAPHY PENDING" in the artwork

All five plates are procedural proxies with their production note burned in: slot code, brief, and
the words PHOTOGRAPHY PENDING. Invisible while the slots rendered as nothing — and, the moment 3.1
was fixed, printed across the live home page.

The `<text>` blocks are stripped in the build and the labelled originals kept beside them as
`*.labelled.svg`, so the brief is not lost. **These are still proxies.** They are right on ratio and
palette and deliberately quiet, and the five photographs are an open commission.

### 3.3 Every page shipped its metadata twice — and I wrote that bug

The audit finding was that no page has a description, Open Graph or a canonical. That is true of the
served bytes. It is **not** true of the page once its JavaScript has run: the bundle writes a good,
page-authored set at runtime that no crawler without JS ever sees.

The first version of `prerender.mjs` did not check, and injected its own. Every page went out with
two descriptions, two og:titles and two canonicals — and on the home page **the two descriptions
disagreed with each other**, which is worse than having none.

The build now takes what the page wrote for itself and adds only what it left out: across eight
pages, **56 tags kept, 16 added** (`og:site_name` and `robots`, which it genuinely lacked), **0
duplicated.** `verify-prerender.mjs` asserts exactly one of each, permanently.

---

## 4 · Fixed on the way through

Per your standing note — *if things are broken, fix them.*

| Finding | State |
|---|---|
| **No entity line.** The footer carried UEI and CAGE but never named the operating company — not in the served bytes, not after JS. Every other site in the portfolio carries it. | `© 2026 HYPATIUS, LLC` added to the existing footer stamp on all 8 pages |
| **Dead favicon on every page.** `<link rel="icon" href="blob:…">` — a runtime URL that dies the moment the DOM is written out. The blob collector only looked at `[src]`. | collector now covers `link[href]`, `::before`/`::after` backgrounds and the stylesheet text; 12 assets extracted, up from 9 |
| **A dangling `blob:` in the shared stylesheet.** A `::before` rule pointed at a URL that existed only inside the tab that created it. | extracted and repointed; `verify-prerender.mjs` asserts no `blob:` survives in the CSS |
| **Type below the 10px floor.** `.cr-eyebrow` and `.cr-ev__l` at 9.5px, all-caps mono at 0.2em — the hardest combination to read small. | 10px, tracking eased to 0.185em so the labels hold the same line length |
| **Navigation at 18–19px.** The main nav and the footer link lists. These are navigation, not links in a sentence, so WCAG 2.5.8's inline exception does not cover them — and at 390 the footer lists are the main way around the site. | 44px minimum on both; the nav bar is 68px, so nothing moved |

---

## 5 · Verification

craton-erp.us had never been verified. It is the fourth site in the portfolio to get a harness and
the first written against a build output rather than a source tree, because the served pages are
bundles and there is nothing static to read.

| Harness | Checks | Failing |
|---|---|---|
| `verify-site.mjs` — 8 pages at 1440 and 390 | **144** | **0** |
| `verify-prerender.mjs` — the same 8 pages **with JavaScript disabled**, plus site-level structure | **72** | **0** |
| `verify-site-imagery.mjs` — type over an image, measured in real pixels | **18** | **0** (2 within 25% of the floor) |

All three carry the focus-timing fix found on STARCHITECT: `getComputedStyle` read immediately after a
synthetic Tab returns a stale `outline-width: 0` in this headless build, which produced eighteen
confident false failures there.

### 5.1 The imagery harness got better here

It was reporting **3.80:1** on the hero eyebrow — a real-looking failure that was not real. The
eyebrow is `display:flex`, so its box runs the full 1144px of the wrap while the words occupy the
left 200px. Sampling the box put four fifths of the samples on bright plate the reader never sees
behind the type.

It now measures the **line boxes** — a `Range` over the element's own text nodes, which returns the
actual ink extent per line, pooled across lines. The eyebrow measures **6.07:1**.

This is worth porting to the other three sites: any element wider than its own words was being
measured wrong, which on a left-aligned hero is most of them.

| index @1440 | | |
|---|---|---|
| Hero headline | 15.70:1 | floor 3 |
| Hero lede | 11.87:1 | floor 4.5 |
| Hero eyebrow | 6.07:1 | floor 4.5 |
| CTA headline | 15.40:1 | floor 3 |
| CTA eyebrow | 5.59:1 | floor 4.5 · **tight** |

**These numbers describe the proxies, not photographs.** Their value is on the day the real plates
land: run the harness first and it will say how much image each headline can afford. The hero
headline at 15.70:1 against a floor of 3 says the scrim is currently crushing the plate for a great
deal more margin than it needs — the same finding as alidade.us, and the same fix available when
there is a real photograph worth showing.

---

## 6 · What is not done

- **The five plates are proxies.** The commission is in the artwork: core sample (hero), strata wall
  (band), brass drafting instruments (CTA), archival binder, founders at the Homestead MOC. The
  labelled originals with the full brief are in `dist/assets/img/*.labelled.svg`.
- **The mobile call-out is on the home page only.** `hours.html` has the strongest claim to a second
  placement — it is the page a *DCAA timekeeping* search lands on and its whole argument is daily
  entry — but repeating four identical captures on a second page is weak. Say the word and it moves
  or duplicates.
- **The demo tenant uses real employee names.** §2. A decision, not a defect.
- **Four of the eight font families are not CRATON's.** Bebas Neue, Rajdhani, Barlow Condensed and
  Inter are HYPATIUS-corporate and ALIDADE faces, shipped in CRATON's stylesheet. They are now
  downloaded once instead of eight times, so the cost fell by roughly 7/8ths, but roughly 1.9 MB of
  the 4.00 MB font payload is still faces this site may not use. Removing a face because no rule
  appears to name it is exactly the optimisation that deletes a fallback nobody noticed, so the build
  **reports and never deletes**. Worth a deliberate pass against the design system.
- **The `data-review` chrome is still in the markup.** The pages carry design-review comments that
  say shipped builds drop everything inside `data-review`. Nothing visible renders from them, but
  they are in the served bytes.
- **`craton-erp.us` deploys from outside this package.** The prerendered `dist/` is a drop-in
  replacement for the served site; it has not been wired to whatever builds it today.

---

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
