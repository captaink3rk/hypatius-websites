# STARCHITECT platform v9. Drop-in package.

**16 September 2026 · for the STARCHITECT Design System project**

Unzip over the design-system folder, keeping paths. Nothing here changes a locked token, a logo, a mark,
a glyph or a font file. `tokens/console.css` is included unmodified so the bundle runs standalone; it is
byte-identical to yours.

## What is in it

| Path | What it is |
|---|---|
| `01-AUDIT-AND-DIRECTION.md` | The audit of the v8 lineage, the decision, and what comes next. Read first. |
| `css/sc-console.css` | The `sc-` component layer. The RTS grammar as first-class FUSION components: control group, command card, order, minimap, portrait, wireframe, resource bar, queue, advisor, alert, state mark, palette, deck, shell. Additive to `tokens/console.css`. |
| `tokens/fonts-console.css` | Self-hosted Bebas Neue, Rajdhani, IBM Plex Mono from `assets/fonts/`. Zero CDN. |
| `starchitect-platform/v9/ops.html` + `ops.js` | The operator console. Offline procedural theater, keyboard-first, every v8 order and mechanic, the arcade grammar promoted and recoloured. |
| `starchitect-platform/v9/hub.html` | The readiness hub on the same layer. Nav fixed, division badge, state marks. |
| `starchitect-platform/v9/` briefing · white-cell · command · season · campaign · connect · aar · hangar | The remaining demo-path screens, all on `sc-` plus `css/sc-page.css`. Ten screens total. Every v8 screen with a content owner is ported; planner, mesh, engineering, report and gap-analysis are the engineering-workspace set and take the same layer next. |
| `css/sc-page.css` | The bento page shell every non-ops screen shares. Cells, rows, pills, stats, timelines, crews, injects, gateways, the campaign graph, the promotion track. |
| `starchitect-platform/v9/tour.js` | The demo-tour overlay, re-pointed at v9 selectors. `T` starts, `→` steps, `Esc` stops. Wired on ops and hub. No dependencies. |
| `verification/verify.mjs` | The harness. Ten screens at 1440 and 390: no horizontal scroll, 10 px type floor, 44 px targets, reduced-motion still, zero external requests, AA contrast, banned terms, no em dashes, focus ring. **180 checks, 0 failing.** |
| `starchitect-website/` | `console-section.html` for platform.html in the site's own classes, seven real v9 captures, and `CHANGES.md` with the 14-page `CJADC2` meta fix as one sed line. Nothing applied to the live site. |
| `guidelines/decision-command-grammar.card.html` | Decisions card. Why arcade mode is retired, the pattern-to-token mapping, the same order button both ways. |
| `assets/` | Real brand kit only: wordmark and mark with web derivatives, lockup, favicon, thirteen glyphs, two heroes at 1920, eight subset woff2 faces. |

Open `starchitect-platform/v9/ops.html` directly, or serve the folder. No build step, no network.

## Drive it

`1` to `5` select a control group. `Q W E R A S D X` stage orders on the selection. `C` commit. `⌘K` palette.
Click an alert to fly the camera and ping the minimap. Click the minimap to look somewhere. Stage two burns on
Warden to watch the Δv budget drop and the resource cell go to watch; stage a third and watch it refuse. Leave
a group untasked for forty seconds and it flags idle.

## Install

1. Unzip over the design-system folder, keeping paths.
2. Add to `styles.css`, after the existing imports: `@import "tokens/fonts-console.css"; @import "css/sc-console.css";`
3. Add `@import "css/sc-page.css";` after it.
4. Let the compiler run. The new card appears under **Decisions**.
5. Update `starchitect-platform/README.md`: v9 is the shell of record; v8 becomes an archive pass alongside v4 to v7.
6. `npm i -D playwright` once, then `node verification/verify.mjs` before any skin change ships.

## What this does not do

- Does not touch `uwgamer/hypatius-starchitect`. Private, unreachable, untouched.
- Does not change any locked FUSION value, logo, glyph or font.
- Does not use any third-party game art, name, faction, voice line or colour. Interaction conventions only.
  Section 5 of the audit says where the line is.
- Does not port the five engineering-workspace screens (planner, mesh, engineering, report, gap-analysis). Same layer, same pattern, listed as next.

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
