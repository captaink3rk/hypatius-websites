# starchitect.us v10

**18 September 2026 · for the HYPATIUS Design System project**

The website, not the platform. The operator console was covered in the 16 September package and is untouched.

> **The finding: the entire site chrome was built in JavaScript.** Nav, classification banner, telemetry bar
> and footer were all constructed at runtime, so the served HTML carried no navigation, no footer, no entity
> line and — on six of nine pages — no ITAR notice. With JavaScript off, `home.html` had three internal links
> and `platform.html` had two. The orphaned older `a-*` pages were better built for a crawler than the site
> that replaced them. Audit §0.
>
> **The website had never been verified.** The existing harness covers the platform's fourteen console
> screens and stops there. The new one found **54 failures on its first run**, including the primary call to
> action rendering at **1.01:1** — grey text on a gold button, on every page, invisible.

Both harnesses now pass: **160 checks, 0 failing** and **8 photographic contrast checks, 0 failing**, with
**zero third-party requests**.

> **The fourteen stale pages are resolved, not just flagged.** Two of them held content the canonical site
> did not, so they were promoted rather than deleted: `press-kit.html` is now a canonical page, and the
> leadership block moved into `company.html`, which had no team section at all. Both carried **stale titles**
> — Jordan as Chief *Marketing* Officer, Stan without co-founder — which is the argument for promoting rather
> than retiring: deleting them would have taken the errors quietly with them. The other thirteen files moved
> to `_retired/` with a permanent redirect each, so nothing 404s. Audit §3.

Nothing live was changed. Nothing in the repo was touched.

## What is in it

| Path | What it is |
|---|---|
| `01-AUDIT.md` | The audit. Read §0 and §1 first; §3 needs a decision from you. |
| `starchitect-website/` | The working copy, with v10 applied. Ten canonical pages plus the intro gate. |
| `starchitect-website/_retired/` | The thirteen retired files. Nothing is deleted — they are out of the deploy path and every URL redirects. |
| `starchitect-website/vercel.json` | Redirects for all thirteen, plus an immutable cache header on `/assets/`. |
| `starchitect-website/site-v10.css` | **Additive only.** Nothing in `base.css`, `site2.css` or `sub.css` was edited, so every change reads as a diff and reverts by deleting one `<link>`. Each rule carries the measurement that justifies it. |
| `starchitect-website/fonts.css` + `assets/fonts/` | The self-hosted subset, replacing Google Fonts on all twenty pages. |
| `tools/bake-chrome.mjs` | Generates the chrome into the HTML. Deterministic and idempotent; `--check` exits non-zero if any page is out of date, so it can gate CI. |
| `verification/verify-site.mjs` | The website harness. Nine pages at 1440 and 390. |
| `verification/verify-site-imagery.mjs` | The photographic contrast check — hides the text, screenshots the ground, measures real pixels under every headline. |

## Run it

```
npm i -D playwright pngjs
node tools/bake-chrome.mjs              # re-generate the chrome
node tools/bake-chrome.mjs --check      # CI gate: fails if a page is stale
node verification/verify-site.mjs       # 144 checks
node verification/verify-site-imagery.mjs
```

## The live site is now ten pages

home · platform · capabilities · use-cases · resilience · security · acquisition · company · resources ·
**press-kit**, plus `index.html`, the intro gate that plays the sting once per session and hands off to
`home.html`.

New alongside them: `vercel.json` with a permanent redirect for all thirteen retired URLs, `sitemap.xml`,
`robots.txt`, and a `rel="canonical"` on every page — none of which the site had.

## One thing to check, and one to overrule if you disagree

**Check:** the canonical tags point at `/home`, while `/` serves the intro gate. Confirm that matches the
Vercel config before the sitemap is submitted.

**Overrule if you like:** two leadership bios state military service — "U.S. Air Force veteran", "U.S. Navy
veteran". I read the prohibited list as banning *business status* claims (VOSB, SDVOSB, VetCert,
veteran-owned/built/led), not an individual's service history in their own biography, and kept them. One edit
removes both if you read it more strictly.

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
