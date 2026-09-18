# hypati.us v3 · every edit applied to the deploy folder · 16 Sep 2026

Base: `HYPATIUS Site v2` (built 2026-09-07). Live pages matched it at audit time. Nothing live was changed by this package.

## Global (home, platforms, company, news, release)
- Entity `HYPATIUS LLC` → `HYPATIUS, LLC` in every footer and in Company copy.
- Footer platform column: `craton-erp.us ↗` added beside starchitect.us and alidade.us.
- Skip link (`.skip` → `#main`) added; `#main` set on each page's first landmark.
- `<link rel="canonical">`, Open Graph (`og:site_name`, `og:type`, `og:url`, `og:image`), `twitter:card` added to every page.
- `site/flagship-v5.css` / `.js` → `site/flagship-v6.css` / `.js` (immutable-cache rule); all references updated.
- `tokens/fonts.css`: Google Fonts `@import` → `@font-face` from `site/fonts/` (8 woff2, latin, OFL 1.1).
- `vercel.json`: permanent redirects `/starchitect` → https://starchitect.us, `/alidade` → https://alidade.us, `/craton` → https://craton-erp.us.
- New: `sitemap.xml`, `robots.txt`.

## home.html
- Title kept; meta description rewritten to name the parent and the three platforms. `og:title`/`og:description` added.
- Organization JSON-LD (name HYPATIUS, LLC; three `brand` entries with URLs; UEI and CAGE identifiers; sameAs).
- Hero sub (also in `flagship-v6.js` HEADLINES.clarity, which overwrites the markup at load): parent framing, "capture decision intelligence", one company / three platforms.
- New hierarchy strip after the hero (`.hier`): HYPATIUS, LLC parent row; STARCHITECT (gold, wordmark), ALIDADE (teal, mark + wordmark), CRATON (bronze, type) each with status mark + word and external link.
- Ticker: `$700B+ federal market` (uncited) → `One company · three platforms`; `Charleston, SC` → `HYPATIUS, LLC · Charleston, SC`.
- Manifesto stats: proof lines. 870K `[pending data]`; 3 platforms named; <500 ms "design target · Hypatius platform directives".
- STARCHITECT showcase: bg `hero-orbital-v2.jpg`; framed v9 console capture `st-ops-console-v9.jpg`; wordmark → `starchitect-wordmark-v3.png` (1600 px); index "01 / Live · flagship"; description rewritten around the command grammar; `starchitect.us ↗` button added.
- ALIDADE showcase: bg → `plat-alidade-v3.jpg` (approved maritime hero, no baked wordmark); framed `al-briefing-v2.jpg`; logo → `alidade-mark-v3.png` with teal glow; tag "Capture decision intelligence · GovCon"; description rewritten (seven cited factors, three bands, consent, MCP tool server, run ledger); metrics `7 factors / 3 bands / Consent` replace `7-factor PWIN / Neo4j / Double-blind`; `alidade.us ↗` button added.
- CRATON showcase: tag "Deterministic ERP and CRM · program execution"; description "at launch" framing; status badge → `.status-badge--dev` (◆ mark + word); `craton-erp.us ↗` button added.
- Tiles/stack alternates: CRATON tile → https://craton-erp.us; ALIDADE copy updated; CRATON stack row links craton-erp.us; wrapper hidden in showcase mode (`.portfolio-alt`).
- Capabilities: `FedRAMP-ready` → `FedRAMP pathway`.
- Leadership row: Jordan Broe → Co-Founder & Chief Marketing & Product Officer; Maureen O'Brien → Executive Advisor & Board Member.
- Contact select: ALIDADE and CRATON option labels updated.

## platforms.html
- Subhero copy names HYPATIUS, LLC and "its own site and its own accent".
- STARCHITECT: media → `st-ops-console-v9.jpg`; badge "Live · flagship · Advanced reconnaissance"; wordmark v3; new paragraph on the v9 console; proof line under 870,000; `.shots` strip: readiness hub, white cell, after action (v9 captures).
- ALIDADE: media → `al-briefing-v2.jpg` in an ALIDADE-toned frame (replaces the logo tile); badge teal; real mark + wordmark; tag "We do not guess. We engineer the win."; prose rewritten; specs `7 factors · 3 bands / On consent / MCP tool server`; `.shots--al` strip: bid matches, control room, redline.
- CRATON: badge `.status-badge--dev`; tag bronze, "Deterministic ERP and CRM for program execution"; prose "at launch"; CTA row with `craton-erp.us ↗`.
- Stack: ALIDADE and CRATON descriptions updated.
- MDO boards (inline 1280×720): type 8.5/9/9.5 px → 10 px; grey ink `#6B7588` → `#8A94A8` (3.94:1 → 5.99:1 on the board field); footer captions ellipsized on one line; STARCHITECT wordmark → v3.

## company.html
- Titles as on home. Jordan's bio adds product scope. Select options updated.

## index.html
- Poster → `site/img/intro-poster-v3.jpg` (125 KB, was 4.8 MB PNG). Gate logic untouched.

## site/flagship-v6.css (appended v6 block)
- `--brand-starchitect #D4A03B`, `--brand-alidade #21E0CD`, `--brand-craton #D9B985` (+ `-deep #B08D57`); platform accents on showcase tags/indices, tiles, stack rails.
- `.status-badge` mark + word; `.status-badge--dev`.
- `.proof`, `.pending`; `.hier*`; `.shots*`; `.plat__frame`.
- Floors: 10 px type on mono labels (incl. `.mdo2` tags/notes/lanes/dt), 44 px targets (nav links, burger, footer links, PDF links, LinkedIn), `.skip`, `:focus-visible`, reduced-motion safety.
- `.detail > * { min-width:0 }`, `.subnav__inner` horizontal scroll, status badge wraps under 700 px.
- `.tile--starchitect/alidade::before` → v9 / v3 images. `[data-portfolio="showcase"] .portfolio-alt { display:none }`.

## site/flagship-v6.js
- HEADLINES.clarity.sub updated (it overwrites the hero sub at load). No other change.

## Verification
`node verification/verify.mjs` → 96 checks (6 pages × 2 widths × 8 checks), 0 failing. Zero external requests on every page.

---

# v4 · the narrative pass · 18 Sep 2026

## Global
- `site/flagship-v6.css` / `.js` → `site/flagship-v7.css` / `.js` (immutable-cache rule); all refs updated.
- Nav, drawer and footer: `#capabilities` ("What we do") → `#record` ("The record"); "Why HYPATIUS" → "Method". Applied to all five pages.

## home.html — rebuilt spine
- **Hero** → "Accountable automation for defense." with a new sub. Changed in BOTH `home.html` and `flagship-v7.js` (`HEADLINES.clarity`), which re-renders it on load.
- **New: the problem** (`#problem`) — "Defense software rarely fails the physics. It fails the review." plus three reviewer cards (commander / bid board / DCAA auditor), each in its platform accent.
- **New: the lifecycle** — replaces the "Three platforms. One operating layer." portfolio intro. Inline SVG closed loop (three nodes, three arcs, "THE RECORD" at centre) plus three `.cyc__i` entries naming each platform's reviewer. Namespaced `.cyc` to avoid the pre-existing `.steps` block.
- **Platform showcases** — each gains a `.plat__verb` chip ("Decide it." / "Prove it." / "Account for it."). CRATON's copy, tag and metrics rewritten to the SF 1408 story; mark added; field → `plat-craton-v3.jpg`.
- **New: the record** (`#record`) — the shared mechanism, three `.rec-pt` points, an annotated run receipt (`craton.rates.snapshot`, reviewer unset → acceptance blocked), and the fourteen SF 1408 areas as a `.sf` board.
- **Removed: `#capabilities`** — folded into the method.
- **New: the method** (`#why`) — replaces "The underdog builds sharper" with cadence, scale, DDIL, provenance.
- Hierarchy strip: CRATON gains its monogram and a shortened status line.
- JSON-LD: slogan → "Accountable automation for defense"; CRATON and ALIDADE descriptions corrected.
- Imagery: STARCHITECT field → `orbital-dawn-wide.jpg` (was duplicating the hero's own `hero-orbital-v2.jpg`); news card → `platforms-hero-v2.jpg`. No photographic field now repeats on a page.

## platforms.html
- Subhero → "Decide it. Prove it. Account for it." with the loop framing.
- Verb chips on all three sections.
- **CRATON rewritten**: DCAA-ready timekeeping and the SF 1408 binder; three paragraphs on the ledger, the codes, the rate pools and area 14; specs → SF 1408 · 14 areas / append-only, hash-chained / 1–50 people; monogram added; media → `plat-craton-v3.jpg`; `craton-erp.us` CTA.
- Stack section reframed as the loop, each layer naming its reviewer.

## site/flagship-v7.css — v7 block
- `.problem`, `.reviews`, `.review--cmd|bid|aud`; `.loop`, `.loop__fig`, `.cyc*`; `.record`, `.receipt*`, `.rec-pt*`; `.sf*`; `.method`, `.meth*`; `.turn`; `.plat__verb`.
- `--accent-link-raised: #5A92E0` — cobalt-400 measures 4.01:1 on a card and only clears AA on the void. Applied to eyebrows on raised panels and `.meth__k`.
- `.sf__s` 0.6rem → 0.64rem (10 px floor); settled-state label → `--slate-400`.
- `.vision__bg`: `shield.jpg` → `why-shield.jpg` (the former carries a baked-in HYPATIUS wordmark).
- `.tile--craton::before` → `plat-craton-v3.jpg`.

## New assets
- `site/img/craton-mark-v3.svg` — CRATON's monogram, vector paths extracted from craton-erp.us (stroked shield, three bronze strata). Not drawn here.
- `site/img/plat-craton-v3.jpg` — bedrock-strata field composition; source in `visuals/craton-strata.html`.
- `site/img/why-shield.jpg` — restored from the September build, previously orphaned.

## Verification
`node verification/verify.mjs` → 96 checks, 0 failing. Banned-term sweep clean. No orphaned asset references.

---

# v4.1 · 18 Sep 2026 · two corrections from Jordan

- **CRATON's domain is `https://craton-erp.us`**, not craton.us (that URL could not be acquired). Updated in every
  link, the `/craton` permanent redirect in `vercel.json`, the Organization JSON-LD `sameAs` and `brand` URL, the
  hierarchy strip, both platform pages, all five footers, and the documentation. Verified live and serving.
- **Shawna LeMieux is Chief of Staff**, not Chief Operating Officer. Reverted on `home.html` and `company.html`.

---

# v4.3 · 18 Sep 2026 · the commissioned photography lands

Twelve renders came back against the eleven slots in `visuals/IMAGE-PROMPT-PACK.md`. All eleven slots that
called for generation are now filled; Slot 09 was always a processing recipe, not a render, and is still open.

Every file is new. Nothing under `/site/` was overwritten, because everything there is cached for a year.

## Encoding

Progressive JPEG, 4:4:4 chroma (no subsampling), quality 88, `optimize=on`. Chroma subsampling is off
deliberately: these are dark fields whose entire content is a thin coloured line or seam against near-black,
and 4:2:0 smears exactly that. The cost is about 12% file size on images that are already small because
there is so little in them. Largest is `plat-craton-v4.jpg` at 547 KB; the three dividers are under 42 KB each.

## The twelve

| New file | Slot | Replaces | Where it lands |
|---|---|---|---|
| `hero-accountable-2400.jpg` | 03 | `hero-orbital-v2.jpg` | Home hero, behind "Accountable automation for defense." |
| `plat-starchitect-v4.jpg` | 04 | `orbital-dawn-wide.jpg` (borrowed) | STARCHITECT showcase |
| `plat-alidade-v4.jpg` | 05 | `plat-alidade-v3.jpg` | ALIDADE showcase + `.tile--alidade` |
| `plat-craton-v4.jpg` | 01 | `plat-craton-v3.jpg` (interim CSS composition) | CRATON showcase + `.tile--craton` |
| `record-field-2400.jpg` | 06 | flat navy | `#record` |
| `method-field-2400.jpg` | 07 | flat navy | `#why`, via the new `.method-band` |
| `cta-v3.jpg` | 08 | `cta-v2.jpg` | `.ctaband__bg` |
| `og-hypatius-1200x630.jpg` | 10 | `intro-poster-v3.jpg` / `orbital-dawn-wide.jpg` | `og:image` on all six pages |
| `divider-starchitect-2400x300.jpg` | 11 | — | New `.pdiv` band before STARCHITECT |
| `divider-alidade-2400x300.jpg` | 11 | — | New `.pdiv` band before ALIDADE |
| `divider-craton-2400x300.jpg` | 11 | — | New `.pdiv` band before CRATON |
| `craton-hero-2400.jpg` | 02 | — | **Not in this folder.** Ships loose in `visuals/craton-hero/` for craton-erp.us |

The old files stay on disk so nothing cached breaks. None of them is referenced any more except
`intro-poster-v3.jpg`, which is still the intro video's poster frame on `index.html` and should be.

## Two judgement calls, both recorded because they are reversible

1. **`plat-alidade-v4.jpg` is mirrored from the render.** ALIDADE's showcase is `.plat--right`, and
   `.plat--right .plat__veil` crushes the right edge to 94% opacity. The render put its teal bathymetric
   contours centre-right, which is precisely where that veil would have buried them, leaving the open left
   side as empty water. Mirroring puts the contours in the 22% end of the veil where they actually read and
   leaves the quiet half under the card. Nothing in the image is direction-dependent — no text, no insignia,
   no coastline — so this costs nothing. The unmirrored original is the source file if it is ever wanted.
2. **`e94d9ce3` became the OG card and `2373058c` became the hero**, which is the reverse of the obvious
   reading. Slot 03 needs all its weight in the right half because the headline, sub-paragraph and two
   buttons occupy the left 46% at 1440px; Slot 10 needs a centred subject with margin on four sides because
   a wordmark composites over it later. `2373058c` is right-weighted and `e94d9ce3` is centred, so they go
   the other way round from the order they arrived in.

## Markup and CSS

- New v4.3 block at the end of `site/flagship-v7.css`: `.pdiv` dividers, and `.record` / `.method-band`
  section fields as `::before` image + `::after` veil at `z-index:-2 / -1`.
- `#why` gains the class `method-band`. Three `.pdiv` divs, `aria-hidden`, before each `.plat` article.
- Section-field opacity drops on viewports under 860px. On a phone the veil has to be heavier for the type,
  at which point the photograph is not visible and is only costing bandwidth.
- `og:image` on all six pages now points at the OG card. `news.html` and the release page were pointing at
  `orbital-dawn-wide.jpg`, which is no longer used anywhere on the site.

## Verification

`node verification/verify.mjs` → **96 checks, 0 failing.** Unchanged.

`node verification/verify-imagery.mjs` → **32 photographic contrast checks, 0 failing, 0 within 25% of
the floor.** This harness is new in v4.3 and the reason is in its header: `verify.mjs` measures contrast by
compositing *computed* CSS backgrounds up the ancestor chain, which is the correct method for type on a panel
and completely blind to type on a photograph — the computed background of the hero headline is transparent
all the way up to a `background-image`, which has no colour to read. The 96 checks passing said nothing at
all about whether the new photography was legible. The new harness screenshots the page a second time with
the text set to `visibility:hidden`, samples the real pixels in each headline's box, and takes the 95th
percentile luminance rather than the mean, because a headline is only as readable as its brightest patch
of sky. Worst result on the site is the method body copy at 6.28:1 against a 4.5 floor.

Both `record-field` and `method-field` were raised from their first opacity (.42/.30 → .58/.44) after the
renders proved too faint to register at all, and re-verified at the new values.

---

# v4.4 · 18 Sep 2026 · CRATON in dark mode

## The correction

CRATON's prototype ships `<html data-brand="craton" data-theme="dark">`. **Dark is the product's default and
light is the opt-in override** — so the five light captures this site carried were the exception presented
as the rule. Recaptured from `platform/index.html` in the handoff bundle, at 1600×1000 @2x, and shipped at
1728×1080 as `cr-{home,binder,record,rates,approvals}-v5.jpg`. New names; the v4 files stay on disk.

## The dark-on-dark problem, and the trap in solving it

A dark screenshot on a dark page can dissolve. The obvious fix looked like CRATON's own **Strata** palette,
which its tokens describe as *"corporate navy + sandstone"* and which resolves to the HYPATIUS values
exactly: `--bg-page` #060F1C, `--surface-card` #0B1929, `--text-display` #F2F6FA, `--accent-primary` #1A4FBA,
`--accent-link` #4FC3D9. It reads as purpose-built for showing CRATON inside a HYPATIUS surface.

**It is the wrong choice here, and measurably so.** Strata's page colour is #060F1C — byte-identical to this
site's page. A full-app capture in Strata would have an edge at exactly **1.00:1**: perfectly invisible.
Strata is built for CRATON *components* embedded in a HYPATIUS page, where merging is the point. A
screenshot has to read as an object.

CRATON's default **Bedrock** palette solves it for free:

| Surface | Hex | Against this page (#060F1C) |
|---|---|---|
| CRATON Bedrock page | `#161C24` | **1.12:1** |
| CRATON Bedrock card | `#1F2731` | **1.27:1** |
| CRATON Strata page | `#060F1C` | 1.00:1 — invisible |
| Hairline `--slate-200` | `#223246` | 1.48:1 |

Bedrock already sits above the page. It only needed an edge — and it keeps the bronze that the CRATON card,
its tag colour and the new bronze divider band are all already using, so the whole section agrees with itself.

## The treatment

`.detail__media--cr`, `.shots--cr figure` and `.plat--craton .plat__frame img` get:

- a 1px `--slate-200` hairline at 1.48:1 against the page — the definite edge;
- **a 2px bronze top rule**, which is CRATON's own `.cr-card--hi` motif from `tokens/craton.css`
  (`border-top:2px solid var(--accent-strata)`) — borrowed from the product's component language rather
  than invented for the website;
- a 1px inset top highlight at 6% white. No glow and no drop shadow: the corporate standard prohibits both
  as decoration, and a dark object on a dark ground loses its corners before its middle, so a lit top edge
  is the honest way to say "raised";
- 2px brand round, and `object-position:top left` so the crop keeps the product's own chrome.

The shot strip previously sat on a **light** card (`background:#EEEBE5`) because the captures were light.
That is now the product's real ground.

## Verification

`verify.mjs` → **96 checks, 0 failing.** `verify-imagery.mjs` → **32 checks, 0 failing.**

## Leadership portraits — no change

Slot 09 was built, reviewed and rejected. **`company.html` is untouched** and still points at
`lead-stan.jpg`, `founder-james.jpg`, `founder-jordan.png`, `founder-shawna.jpg` and `lead-maureen.jpg`.
Nothing was ever added to `site/img/`. The slot is parked until the team is re-photographed; the brief for
that shoot is in the prompt pack, including the correction that this component renders circles, not squares.
