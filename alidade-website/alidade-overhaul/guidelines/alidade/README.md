# ALIDADE overhaul · 16 Sep 2026 · pass 2 · install receipt

Installed into the HYPATIUS design system from `uploads/ALIDADE-Overhaul-2026-09` (pass 2 supersedes pass 1 of the same day).

| Package path | Landed at | Push target |
|---|---|---|
| `tokens/alidade-v2.css`, `css/alidade-product-v2.css` | same (updated to pass 2) | `uwgamer/hypatius-hci` · frontend tokens/globals |
| `tokens/fonts-alidade.css` + 11 woff2 | `tokens/fonts-alidade.css`, `assets/fonts/` (Google import in `tokens/fonts.css` replaced) | `uwgamer/hypatius-hci` · alidade.us site |
| `ui_kits/platform-v2/index.html` (8 surfaces, ⌘K, hotkeys, 390 layout) | `ui_kits/alidade-platform-v2/index.html` | `uwgamer/hypatius-hci` frontend · **platform** |
| `concepts/mobile-v2/index.html` (8 screens, 3 destinations) | `ui_kits/alidade-mobile-v2/index.html` | `uwgamer/hypatius-hci` Expo mobile client · **mobile** |
| `templates/website-v2/index.html` | `templates/alidade-website-v2/index.html` | alidade.us (Vercel `alidade-website`, no git link yet) · **website** |
| `templates/website-v1.1/*` | `templates/alidade-website-v11/` (ds-base retargeted to `styles.css`) | alidade.us · **website** |
| `ui_kits/platform/data.js` (cleaned demo data) | `ui_kits/alidade/data.js` | `uwgamer/hypatius-hci` fixtures |
| `guidelines/*.card.html` | `guidelines/alidade/` (headers fixed for the compiler, fonts self-hosted) | design system only |
| `verification/` | `verification/alidade/` (`.mjs.txt` so the bundler skips them; rename to run) | `uwgamer/hypatius-hci` CI |
| `assets/logos`, `deck-media`, `screens` | already present in `assets/brand`, `assets/imagery`, `assets/glyphs`, `assets/imagery/screens` | — |

**To do before push**
- Incorporate the pass-2 surfaces into the existing ALIDADE designs: the React kit `ui_kits/alidade/` (still on CDN React/Tabler; platform-v2 is its replacement), `ui_kits/alidade-hud/`, and `templates/alidade-website/`.
- Rule on tiers: screenshots + live site show four (Free · Starter · Standard · Enterprise); website-v2 uses five (Scout · Light · Analyst · Captain · Enterprise).
- Entity name ruled **HYPATIUS, LLC**; live alidade.us footer still says "Hypatius, Inc." — needs deploy access.
- Delete `css/alidade-brand-bridge.css` once nothing references it (see audit).

Audit: `AUDIT-2026-09.md`. Package README: `PACKAGE-README-2026-09.md`.
