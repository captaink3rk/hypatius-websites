# UI kit — ALIDADE workspace

The ALIDADE workspace as it appears embedded in the STARCHITECT console: a 56px icon rail, 50px top bar, tab strip, and the four working surfaces. Scoped with `data-brand="alidade"`, so the pelagic substrate, five-meaning accent set and dense product type ladder come from the tokens. Inside the host console, ALIDADE keeps its own teal glass — it reads as a distinct instrument, never restyled into gold/cyan.

**Screens**
1. **Morning briefing** — KPI tiles, priority pursuit rows, the signature bearing dial, GovFeed signals, and the run ledger.
2. **Open bids** — filterable, sortable pursuit list. Score color is calculated by `scoreBand` / `scoreTone`, never hardcoded — ≥80 teal · ≥60 gold · else coral, matching the live app.
3. **Partner marketplace** — double-blind matches; "Request connection" resolves identity, which is the consent model made visible. Grants in force are violet.
4. **Bid builder** — serif document body, a violet watermarked partner contribution, an inline gold approval gate (never a modal), and compliance checks.

**Interactions:** rail items switch context, tabs switch surfaces, "Open" / "Build bid" jumps to the builder, "Request connection" resolves a partner, "Send reminder" logs an action.

**Rules encoded here:** no shadows, no gradients, no glow in-product (depth is surface level + border alpha); 0.5px hairlines; two type weights only (400/500); every agent-facing surface shows the run — time, tool, result.

**Files:** `index.html` · `Shell.jsx` (rail, top bar, tabs, footer stamp) · `Screens.jsx` (Briefing, OpenBids, Partners, BidBuilder, Ledger) · `data.js` (illustrative composites — not customer data).


## Brand materials (Sep 2026 import)

- `logo-sting/` — the ALIDADE logo sting: wide, vertical and 3-second cuts (`LogoSting.jsx` + `animations.jsx`), plus self-contained `dist/` builds for handoff.
- `templates/alidade-brand-guidelines/` — the 16-slide brand book (voice, messaging, logo, color, type, icons, imagery) as a deck template.
- `templates/alidade-website/` — alidade.us as a fluid single-page template with the glossary; product screenshots in `assets/imagery/screens/alidade-*`.
- `guidelines/alidade/` — 15 specimen cards (brand, colors, type, spacing) in the Design System tab under the ALIDADE groups.

Authored against the ALIDADE system's short token names (`--bg --t1 --tl --gd --srf …`). `css/alidade-brand-bridge.css` maps them onto the company `--al-*` palette; link it from ALIDADE brand surfaces, never from `styles.css`.
