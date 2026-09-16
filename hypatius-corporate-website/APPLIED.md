# hypati.us v3 · every edit applied to the deploy folder · 16 Sep 2026

Base: `HYPATIUS Site v2` (built 2026-09-07). Live pages matched it at audit time. Nothing live was changed by this package.

## Global (home, platforms, company, news, release)
- Entity `HYPATIUS LLC` → `HYPATIUS, LLC` in every footer and in Company copy.
- Footer platform column: `craton.us ↗` added beside starchitect.us and alidade.us.
- Skip link (`.skip` → `#main`) added; `#main` set on each page's first landmark.
- `<link rel="canonical">`, Open Graph (`og:site_name`, `og:type`, `og:url`, `og:image`), `twitter:card` added to every page.
- `site/flagship-v5.css` / `.js` → `site/flagship-v6.css` / `.js` (immutable-cache rule); all references updated.
- `tokens/fonts.css`: Google Fonts `@import` → `@font-face` from `site/fonts/` (8 woff2, latin, OFL 1.1).
- `vercel.json`: permanent redirects `/starchitect` → https://starchitect.us, `/alidade` → https://alidade.us, `/craton` → https://craton.us.
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
- CRATON showcase: tag "Deterministic ERP and CRM · program execution"; description "at launch" framing; status badge → `.status-badge--dev` (◆ mark + word); `craton.us ↗` button added.
- Tiles/stack alternates: CRATON tile → https://craton.us; ALIDADE copy updated; CRATON stack row links craton.us; wrapper hidden in showcase mode (`.portfolio-alt`).
- Capabilities: `FedRAMP-ready` → `FedRAMP pathway`.
- Leadership row: Jordan Broe → Co-Founder & Chief Marketing & Product Officer; Shawna LeMieux → Chief of Staff; Maureen O'Brien → Executive Advisor & Board Member.
- Contact select: ALIDADE and CRATON option labels updated.

## platforms.html
- Subhero copy names HYPATIUS, LLC and "its own site and its own accent".
- STARCHITECT: media → `st-ops-console-v9.jpg`; badge "Live · flagship · Advanced reconnaissance"; wordmark v3; new paragraph on the v9 console; proof line under 870,000; `.shots` strip: readiness hub, white cell, after action (v9 captures).
- ALIDADE: media → `al-briefing-v2.jpg` in an ALIDADE-toned frame (replaces the logo tile); badge teal; real mark + wordmark; tag "We do not guess. We engineer the win."; prose rewritten; specs `7 factors · 3 bands / On consent / MCP tool server`; `.shots--al` strip: bid matches, control room, redline.
- CRATON: badge `.status-badge--dev`; tag bronze, "Deterministic ERP and CRM for program execution"; prose "at launch"; CTA row with `craton.us ↗`.
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
