# alidade.us v3 — the presentation pass

**18 September 2026 · for the HYPATIUS Design System project**

> **alidade.us is the only one of the three sites already deployed.** Every P0 from the September
> audit is fixed on the live page — no unrendered `{{ }}`, no "Certified for federal ground.", no
> "~70% faster", HYPATIUS LLC, UEI present. So this pass is not correctness. It is the brief: *bland,*
> and *lean back into the hybrid — SaaS platform, mobile app, MCP tool server.*
>
> **Why it was bland is not the obvious reason.** The brand standard bans shadow, glow and gradient
> **by name, for this site**. The page reached for two of them anyway — a `linear-gradient` hero scrim
> and two `drop-shadow` glows — and still read flat, while the things the standard *does* permit went
> unused: scale, photography, rhythm, the four-level surface ladder, and the mark. Audit §1.

Both harnesses pass: **16 checks, 0 failing** and **10 photographic contrast checks, 0 failing**.

Nothing live was changed. Nothing in the repo was touched.

## What changed

| | |
|---|---|
| **The hybrid, made visible** | New `#duality`: the human path in teal, the agent path in violet, one run ledger spanning both. Then the MCP topology at full measure. This is the story, and it was a card grid. |
| **The product, readable** | Eight platform surfaces captured fresh at 2×, shipped at 1800px. v2's thumbnails were ~380px — at that size a dense console is texture, not evidence. |
| **Mobile, shown at all** | Three screens in device frames. The SaaS-with-a-phone half had no visual on the site. |
| **The hero** | The pelagic field (`plat-alidade-v4`, already in the design system), display-scale type, the crystalline mark. Scrim values set from measurement — the harness said the old one was crushing the image for no reason. |
| **Rhythm** | Three teal accent bands, one deliberately quiet section carrying the protected line and the mark at size, and the full surface ladder instead of two levels. |
| **Three rule violations fixed** | The gradient scrim and both glows. |

## Files

| Path | What it is |
|---|---|
| `01-AUDIT.md` | Read §1 first — it is the argument for everything else. |
| `alidade-website/` | The working copy with v3 applied. |
| `alidade-website/css/alidade-v3.css` | **Additive only.** Nothing in `alidade-v2.css` or `alidade-product-v2.css` was edited; this pass reverts by deleting one `<link>`. Each rule carries the measurement or the standard clause behind it. |
| `alidade-website/assets/screens/v3/` | Eight platform surfaces, eight mobile screens, the MCP topology. Four surfaces are unplaced and available. |
| `verification/` | Both harnesses, carrying the focus-timing fix found on STARCHITECT. |

## Run it

```
npm i -D playwright pngjs
node verification/verify-site.mjs           # 16 checks
node verification/verify-site-imagery.mjs   # 10 checks
```

## Three things for you

1. **The violations are fixed by specificity, not by deleting them.** `section.hero` outranks `.hero`,
   and the glows are turned off with `filter: none`. That keeps this pass revertible, but the offending
   declarations are still in the page's inline `<style>`. Worth removing properly when a pass is allowed
   to edit that block.
2. **Still one page**, now ~16,600px tall. Pricing and Governance are each doing enough to deserve a URL,
   and a one-page site has exactly one thing to rank.
3. **"LIVE" is still in the nav badge** — flagged in September against the restructuring pause, and
   still your call.

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
