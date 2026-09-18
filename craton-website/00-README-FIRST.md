# craton-erp.us v2 · the prerender pass, and CRATON on a phone

**18 September 2026 · for the HYPATIUS Design System project**

> **The mobile call-out you asked for is in.** The platform prototype's phone mode has a four-item
> tab bar — Home, My day, Approvals, Binder. All four captured at 2× and placed in a device row on
> the home page, the same call-out alidade.us uses, drawn in CRATON's square vocabulary rather than
> ALIDADE's. Audit §1.
>
> **Before those captures ship, read Audit §2.** The Approvals screen carried a reason-on-record
> quote attributing an invented dental absence to **Jordan Broe** by name. Changed to "personal
> time," in the prototype data as well as the capture, so it cannot come back. The broader question —
> the demo tenant uses real HYPATIUS employee names throughout — is a decision for you.
>
> **And the thing that made this pass necessary.** With JavaScript disabled, all eight pages of
> craton-erp.us render *"This page requires JavaScript to display."* — seven words, no nav, no
> footer, no entity. For a product people find by searching *DCAA timekeeping*, that is close to not
> existing. Every later page also re-downloaded the same 5.6 MB of base64 fonts. Both fixed:
> **2.83 MB → 0.01 MB per page after the first**, and 652–1,121 real words on every one.

Nothing live was changed. Nothing in the repo was touched.

**Three harnesses, 234 checks, 0 failing.** craton-erp.us had never been verified before this.

## Three things I broke on the way, two of which were invisible

Audit §3 has these in full; they are the most useful part of the package.

1. **Every image rendered as nothing.** `<image-slot>` is a custom element whose definition is in the
   JavaScript the prerender strips. Five plates, all empty — and it did not look broken. The
   photographic harness caught it by returning a perfectly flat 16.88:1, which no photograph does.
2. **The proxy plates print "PHOTOGRAPHY PENDING" in the artwork.** Invisible while the slots
   rendered as nothing; across the home page the moment they didn't. Stripped in the build, labelled
   originals kept.
3. **I shipped every page with two of each meta tag.** The pages *do* write description, OG and
   canonical — at runtime, where no crawler sees them. The first build assumed they did not exist and
   added its own. On the home page the two descriptions disagreed. The build now keeps what the page
   wrote and adds only what it lacked: 56 kept, 16 added, 0 duplicated, asserted permanently.

## What is in it

| Path | What it is |
|---|---|
| `01-AUDIT.md` | The audit. **§1** the mobile call-out and why it is drawn the way it is; **§2** the content finding; **§3** the three regressions; **§5** verification, including a real improvement to the imagery harness. Read first. |
| `dist/` | **The deploy folder.** Eight static pages, one shared stylesheet, 26 font files, 12 images. Drop-in replacement for what craton-erp.us serves today. |
| `tools/prerender.mjs` | The build. Renders each bundle, extracts the fonts and the blob images, converts the image slots, de-labels the proxy plates, repairs the metadata, inserts the mobile section and writes `robots.txt` and `sitemap.xml`. Re-runnable and idempotent; every decision is commented where it is made. |
| `layer/craton-v2.css` | The additive layer: the device row, the type floor, the touch targets, the image-slot sizing. Loaded after `craton.css`; removing it changes nothing else. |
| `layer/mobile-section.html` | The section's markup, as a separate file so the copy can be edited without touching the build. |
| `build/cr-mobile-*.png` | The four captures, corner-masked and optimised. 323 KB for all four. |
| `caps/` | The raw captures, before masking. |
| `verification/` | `verify-site.mjs` (144), `verify-prerender.mjs` (72, **with JavaScript disabled**), `verify-site-imagery.mjs` (18). Last reports included. |

`craton-website/` — the eight source bundles, 23 MB uncompressed — **is** in the archive, because
without it the build cannot be re-run. It is the input, not the output; nothing in it was modified.

## To rebuild

```
npm i -D playwright pngjs
node tools/prerender.mjs
node verification/verify-site.mjs
node verification/verify-prerender.mjs
node verification/verify-site-imagery.mjs
```

All three exit non-zero on a failure, so they gate a deploy. Run **all three**: the first cannot see
type on a photograph, and only the second runs with JavaScript off, which is the state this whole
pass exists to fix.

## Before you deploy, two things to confirm

1. **The five plates are still proxies.** Right ratio, right palette, deliberately quiet, and not
   photographs. The commission is written into the labelled originals in `dist/assets/img/`.
2. **The demo tenant uses real employee names.** Audit §2.

## Where this leaves the four sites

| | Verified | Notes |
|---|---|---|
| hypati.us | 96 + 32 | v4.4 |
| starchitect.us | 18 + chrome bake | v10 |
| alidade.us | 16 + 10 | v3 — the only one actually deployed |
| **craton-erp.us** | **144 + 72 + 18** | **v2 — first verification of any kind** |

One item to carry: the **line-box fix** in §5.1 belongs in the other three imagery harnesses. Any
element wider than its own words has been measured against ground the reader never sees behind the
type, which on a left-aligned hero is most of them.

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
