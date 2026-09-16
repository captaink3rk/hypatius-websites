# ALIDADE overhaul — drop-in package

**16 September 2026 · for the ALIDADE Design System project**

This is an **update package**, not a replacement system. Unzip it over your existing
`ALIDADE Design System` folder, preserving paths. Nothing here overwrites a logo, a brand asset,
a font, or any file in `assets/`. The branding and the marks are untouched — they were locked and
they stayed locked.

---

## What is in it

| Path | What it is | Action |
|---|---|---|
| `01-AUDIT.md` | The audit. Read this first. | Read |
| `tokens/alidade-v2.css` | **The reconciled token layer.** Closes the brand-vs-live split, fixes two WCAG failures, retires the bridge. | New file |
| `css/alidade-product-v2.css` | Product class layer v2 — `al-` namespaced, state marks, keyboard and focus, bounded elevation. v1 class names kept as aliases. | New file |
| `styles.css` | Same as yours plus two imports at the end. | **Replaces** yours |
| `guidelines/decision-token-reconciliation.card.html` | Decisions card. The verdict, value by value, with the same panel rendered under both rule sets. | New card |
| `guidelines/state-marks.card.html` | Brand card. The ▲ ● ■ ◆ vocabulary and the desaturation test. | New card |
| `templates/website-v2/index.html` | The alidade.us redesign. Static, single `<h1>`, every claim cited or bracketed, credential stamp restored. | New template |
| `ui_kits/platform-v2/index.html` | Six platform surfaces — Command, Bid Matches, Competitive Intel, Pipeline, Proposals, GovFeed. Five of them had never been built. | New kit |
| `concepts/mobile-v2/index.html` | Bearings + Ask, built. Four screens plus the rules they hold to. The crystalline mark is the hold-to-ask control. | New concept |
| `templates/brand-guidelines/BrandGuidelines-v1.1.dc.html` | The 16-slide brand book with two token corrections on slide 10 (Mute, Deep Teal) and the settled three-band score on slide 11. **v1.0 is not touched** — this sits alongside it. | New template |
| `assets/logos/` · `assets/deck-media/` · `assets/screens/` | **The locked brand kit, as-is:** crystalline mark (plus 1024/512/256/64 web derivatives), lockup, wordmark, subtitle, fulltext, favicon; the eight teal glyphs; bearing ring, the deep, maritime heroes; seven product screenshots. Nothing recoloured, nothing redrawn. | Copied in |
| `thumbnail.html` | Project tile — real mark over the bearing ring, strip updated to the v2 deep teal. | Replaces yours |

Everything is plain HTML and CSS with no build step and no external dependency. Open any of the
three HTML files directly, or serve the folder with `python3 -m http.server` — both work.

---

## Install

1. **Unzip over the design-system folder**, keeping paths. The only file it replaces is
   `styles.css`; keep a copy of yours if you want to diff it.
2. **Delete `css/alidade-brand-bridge.css`** if it exists. `tokens/alidade-v2.css` defines the
   short-name vocabulary (`--bg`, `--t1`, `--tl`, `--gd`, `--cr`, `--pr` …) natively, so the brand
   book, website and specimen cards run with the bridge gone. Leaving the bridge in place will not
   break anything, but it will silently reinstate the old `--al-teal-dk` and `--al-t3` values and
   undo both accessibility fixes.
3. **Let the design-system compiler run once.** The two new cards should appear under **Decisions**
   and **Brand**.
4. Check one card renders styled. If it does not, the `_ds_bundle.js` path in that card's folder
   needs pointing back at the project root.

The bundle works standalone before upload too — nothing in it references `_ds_bundle.js`.

---

## What changed in the tokens, in one table

| Role | Was | Now | Why |
|---|---|---|---|
| Deep teal | `#14998C` | `#14B8A6` | Was 4.33:1 on the raised surface — a fail. Now 6.13:1. Adopted from the live app. |
| Microlabel ink | `#5C6E89` | `#7D92B5` | Was 2.94:1 on the raised surface — a fail, and `.kpi-label` sat on exactly that pairing, so **every KPI label in the product failed AA**. Now 4.83:1. |
| Hairline | `0.5px` | `1px` @ same alpha | 0.5px is non-deterministic at 1× — it rounds to full strength or vanishes. |
| Elevation | none, everywhere | none, **except docked chrome** | A rail that scrolls content underneath it cannot separate by surface step. Now a token with one permitted use. |
| Everything else | brand values | unchanged | The live app's accents were framework defaults. The mark is locked; the field serves the mark. |

Full reasoning: `guidelines/decision-token-reconciliation.card.html`.

---

## What this package does **not** do

- **It does not touch the repository.** `uwgamer/hypatius-hci` was never reachable — it is private
  and this session had no GitHub credentials. Nothing was read from it, written to it, or changed.
- **It does not change the live site.** alidade.us was read only. `templates/website-v2/` is a
  design-system template; deploying it is a separate, deliberate decision.
- **It does not touch branding.** No logo, mark, wordmark, glyph or font file is modified, recoloured
  or replaced. The crystalline A, the wordmark, the subtitle, the fulltext lockup and the eight teal
  glyphs are exactly as you had them — and every surface in this package now uses them directly.
  The first cut of this package used a placeholder triangle for the mark and no glyphs, which broke
  the brand book's own rule ("never hand-draw an SVG substitute for a brand glyph or logo"). Fixed.
  The only hand-drawn SVGs left are the product-UI nav icons in `ui_kits/platform-v2/`, which are
  geometric stand-ins for Tabler Icons (the set the system specifies) until Tabler is self-hosted.
- **It does not invent numbers.** Every figure carries a proof line or ships bracketed as
  `[pending data]`. The internal "~70%" benchmark is removed from the public-facing template.

---

## One inconsistency to rule on

The product screenshot `assets/screens/alidade-ui-briefing.jpg` shows the app's tier bar as
**Free · Starter · Standard · Enterprise** (four tiers). The live site uses the same four. The
platform memory records **five** tiers — Scout · Light · Analyst · Captain · Enterprise — as
superseding the four, and the website template in this package uses the five. One of these is
stale. The website is easy to flip either way; the screenshot is not.

## Three things that need you, not me

1. **Your design system is in the Trash.** Everything read from your machine came from
   `/Users/jordanbroe/.Trash/ALIDADE Design System/`, and partway through, `tokens/` stopped
   resolving. Four folders there — `concepts/`, `scraps/`, `skills/`, `ui_kits/` — are not in the zip
   you uploaded. `concepts/ALIDADE Surface Concepts.html` is the only record of the approved mobile
   concept and the five alternative delivery surfaces. Get it out of the Trash.
2. **`CJADC2` is live in starchitect.us's meta description.** Banned term, indexed, one-line fix.
   The visible page correctly says BMC3I; only the meta tag is wrong.
3. **Two entity names are live.** alidade.us says "Hypatius, Inc."; hypati.us says "HYPATIUS LLC."

---

**HYPATIUS, LLC · small business · non-traditional defense contractor**
**UEI UKELB3UV76V6 · CAGE 19S89 · Charleston, SC**
