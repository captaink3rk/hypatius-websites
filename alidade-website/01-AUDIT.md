# alidade.us — v3, the presentation pass

**18 September 2026 · HYPATIUS Design System · ALIDADE tier**

Nothing live was changed. Nothing in the repo was touched. This is a working copy.

---

## 0 · Where this one starts differently

**alidade.us is the only one of the three sites that has actually been deployed.** Every P0 from the
16 September audit is fixed on the live page, verified against it directly:

| 16 Sep finding | Live now |
|---|---|
| Unrendered `{{ }}` template expressions throughout the served HTML | **0 occurrences** |
| "Certified for federal ground." over an empty attestations block | **gone** |
| "~70% faster" — unsourced empirical claim | **gone** |
| `© 2026 Hypatius, Inc.` — wrong entity | **HYPATIUS, LLC**, three places |
| No UEI, no CAGE | **UEI present**, twice |
| Protected line absent | **present** |

So the brief this time was not correctness. It was Jordan's: *"pretty bland,"* and *"we had some great
past versions when it was strictly a SaaS product with a mobile integration, and now it's an MCP with
possibly a mobile app — lean back into the hybrid, make it cooler."*

---

## 1 · Why it was bland, which is not the obvious reason

The ALIDADE brand standard is unusually strict about depth:

> *"Depth is which surface level and which border alpha — no shadow, no glow, no gradient in product.
> Applies to alidade.us, the six platform surfaces, the mobile concept, the brand book, and ALIDADE
> collateral."*

Every ordinary move for making a dark site feel rich is banned, **by name, for this site**. And the
component CSS honours it: zero gradients in `alidade-product-v2.css`.

But the page's own inline `<style>` — which sits after every linked stylesheet and therefore wins —
did not:

```
.hero::after   background: linear-gradient(90deg, …)                   ← GRADIENT
.hero-mark     filter: drop-shadow(0 0 34px rgba(33,224,205,.38))      ← GLOW
(briefing)     filter: drop-shadow(0 0 28px rgba(33,224,205,.3))       ← GLOW
```

**That is the real finding.** The page reached for the two effects the standard forbids — the easy way
to make a dark page feel expensive — and *still* read flat, while the things the standard actually
permits went unused:

| Permitted, and unused | State in v2 |
|---|---|
| **Scale** | Largest headline on the page was 32px. Stat numerals 24px beside 11px labels — a ratio that says "caption", not "evidence" |
| **Photography** | One hero field, crushed under a 96%→82% scrim |
| **Rhythm** | Nine sections, all the same shape: eyebrow → headline → lede → card grid |
| **The surface ladder** | Four levels exist (`#060D1B` → `#0E1B2E` → `#15263D` → `#1B2D45`). Two were used |
| **The mark** | The crystalline A is iridescent in the artwork. It appeared at 150px once, with a glow behind it doing nothing the file did not already do |

Effects were never going to carry it, and they were not allowed to. v3 takes the five permitted
levers instead.

---

## 2 · The hybrid, made visible

The positioning has moved — SaaS platform with a mobile app **and** an MCP tool server — and the page
asserted that in a card grid. It is a better story than that, and it is the cool part: **the same
capability, two callers, one ledger.**

New `#duality` section, placed straight after the hero:

- **The human path** — teal, the ▲ mark. Eight surfaces, a capture lead signs the gate.
- **The agent path** — violet, the ◆ mark. Twenty-four tools over MCP, and the gate *still* waits for
  a named person. Violet is not decoration here: it is the documented partner-and-consent colour, and
  the agent path is where consent is granted.
- **Underneath, spanning both** — one run ledger. *"Nothing counts until a named person reviews it —
  which is the same rule, whichever caller asked."*

Then the MCP topology graphic at full measure: four callers, six tool groups, the run ledger with its
AUTO and GATE states.

---

## 3 · The product, at a size you can read

v2 showed the platform as thumbnails about 380px wide. At that size a capture of a dense console is
texture, not evidence — you cannot read a single row, so it proves nothing.

**Eight surfaces captured fresh** from `ui_kits/platform-v2` at 2× and shipped at 1800px: command, bid
matches, competitive intel, pipeline, proposals, GovFeed, partners, control room. The new `#surfaces`
section runs Command at full measure and four more two-up.

**Mobile had no visual on the site at all** — the SaaS-with-a-phone half of the product was described
and never shown. `#mobile` puts three screens in device frames: Bearings, Ask, and a consent gate
showing scope offered against scope withheld before anyone approves. The frames are drawn with border
and radius, the two things the standard allows, not with a shadow.

---

## 4 · Rhythm

- **Three teal accent bands** mark changes of subject — the same divider that announces ALIDADE on
  hypati.us, so parent and platform now punctuate the same way.
- **One quiet section**, almost empty on purpose: the crystalline mark at size, the protected line
  *"STARCHITECT flies the mission. ALIDADE sources it."*, and nothing else. It is the only place the
  mark appears large, and it carries the section by itself.
- **The full surface ladder** is in play: `.alt` sits one level up, `.deep` two.

That protected line appeared **twice** once the new section landed — the briefing section already
carried it as a sign-off, seventeen lines further down. The redundant one is removed; the designed
moment keeps it.

---

## 5 · The hero

The field is now `plat-alidade-v4` — the open ocean with teal bathymetric contours, generated to
ALIDADE's own brief and already shipping in the design system. It is a stronger image than the bearing
ring, and it is the same field the parent site uses for ALIDADE, so the two agree.

**The scrim values are set from measurement, not taste.** The photographic harness put the headline at
17.6:1 against a floor of 3 with the scrim at 0.78 — the field was being crushed for no reason. At
0.64 globally and 0.46 on the type column, the water and its contours read and every element still
clears its floor with room:

| | 1440 | 390 |
|---|---|---|
| Hero headline | 17.61:1 | 16.31:1 |
| Hero lede | 7.68:1 | 7.56:1 |
| Hero eyebrow | 5.72:1 | 5.76:1 |
| Stat numeral | 18.04:1 | 17.75:1 |

One detail worth recording. Without a gradient, the column scrim has to end somewhere and that edge is
visible. Rather than try to hide it, it became a deliberate surface — a panel with a hairline, which is
exactly the vocabulary the standard prescribes. The edge now reads as construction rather than as an
artefact.

---

## 6 · Verification

`verification/verify-site.mjs` → **16 checks, 0 failing.**
`verification/verify-site-imagery.mjs` → **10 photographic contrast checks, 0 failing.**

Both carry the **focus-timing fix** discovered on STARCHITECT: `getComputedStyle` read immediately
after a synthetic `Tab` returns a stale `outline-width: 0` in this headless build, which produced
eighteen confident false failures there. The check now waits two animation frames.

Two files the page referenced but that were missing from the deploy folder —
`alidade-bearing-ring-1920.jpg` and `alidade-deep.jpg` — are restored.

---

## 7 · What is not done

- **The three effect violations are corrected in the v3 layer by specificity, not by editing the
  inline `<style>`.** `section.hero` (0,1,1) beats `.hero` (0,1,0), and the glows are turned off with
  `filter: none`. That keeps this pass additive and revertible, but the offending declarations are
  still in the page. Worth deleting them properly on a pass that is allowed to touch the file.
- **The site is still one page.** Nine sections became twelve, and it is now roughly 16,600px tall at
  1440. That is defensible for a single product, but Pricing and Governance are both doing enough work
  to deserve their own URLs, and a one-page site has exactly one thing to rank.
- **"LIVE" still appears in the nav badge.** The September note flagged ALIDADE reading Live in four
  places against the restructuring pause. Unchanged here — it needs your call, not mine.
- **Eight platform surfaces were captured; four are used.** GovFeed, pipeline, partners and the second
  half of control room are in `assets/screens/v3/` and unplaced.

---

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
