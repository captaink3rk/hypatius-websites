# hypati.us v4.4 · the narrative pass, the photography, and CRATON in dark mode

**18 September 2026 · for the HYPATIUS Design System project**
*(supersedes the v3 package of 16 September; v3's Home and Platforms are kept in `reference/`)*

> **v4.4 — CRATON is in dark mode.**
> CRATON's prototype is `data-theme="dark"`; the site was showing the light override as if it were the
> product. Recaptured. The dark-on-dark worry has a trap in it: CRATON's own "Strata" palette looks
> purpose-built for this and its page colour is byte-identical to ours, so a capture in Strata would meet
> the page at **1.00:1** and vanish. Bedrock, the default, is already 1.12:1 above the page and keeps the
> bronze. Audit §8.2.
>
> **The leadership portraits are unchanged.** Slot 09 was built, reviewed and rejected; the site keeps the
> five photographs it already had and `company.html` was never touched. The slot is parked until the team is
> re-shot. One correction came out of it that matters for that shoot: the component renders **circles**, not
> squares. Audit §8.3.
>
> **Packaging note:** part 1 is the deploy folder *minus* `site/video/`, which is unchanged since v3 and
> rides in part 2 — the single archive was over the 30 MiB chat limit. Drop `site/video/` back in before
> uploading, or keep the copy already in your repo.
>
> **v4.3 — the twelve renders are in.** All eleven generation slots from the prompt pack are filled and the
> home page no longer carries a single interim or borrowed image. Three new accent bands announce each
> platform in turn; `#record` and the method carry fields instead of flat navy. Details in
> `hypatius-website/APPLIED.md`; the two placement calls that went against the obvious reading are in
> Audit §7.2.
>
> **One thing found on the way in, and it matters beyond this package.** The harness could not check what I
> had told you it checked. `verify.mjs` measures contrast by compositing *computed* CSS backgrounds, which
> is right for type on a panel and blind to type on a photograph — every hero on this site has been
> nominally verified and actually unmeasured, and the same is true of the STARCHITECT harness this one was
> cloned from. `verification/verify-imagery.mjs` closes it here: **32 checks, 0 failing.** Audit §7.1.

v3 corrected the corporate site. **v4 changes what it argues.** Home and Platforms are rebuilt on the
thesis the portfolio already had but had never stated on hypati.us — the one CRATON's own site carries
in its footer: *Decide it. Prove it. Account for it.* Three platforms, one loop, and one shared
mechanism underneath — a record a commander, a bid board or an auditor can take apart.

Everything v3 fixed is still fixed. Both harnesses run clean: **96 checks at 1440 and 390, 0 failing, zero
third-party requests** — and **32 photographic contrast checks, 0 failing**, worst case 6.28:1 against a
4.5 floor.

Carried forward from v3: the three platforms brought into line with what they actually are, CRATON linked
to craton-erp.us, the entity spelled HYPATIUS, LLC everywhere, self-hosted fonts, SEO and accessibility.

Nothing live was changed. No logo, mark, glyph or font was modified or drawn — CRATON's monogram is its
own vector, extracted from craton-erp.us.

## What is in it

| Path | What it is |
|---|---|
| `01-AUDIT.md` | The page-by-page audit, the brand-hierarchy decision, and **§5, the narrative pass** — where the thesis came from, what changed structurally, and what the rebuild broke. Read first. |
| `visuals/IMAGE-PROMPT-PACK.md` | The eleven image slots, now **all delivered** and marked as such. Keep it: it is the record of what each field was asked to do, and what any future image has to match. Slot 09, the leadership-portrait recipe, is **parked** — it needs a re-shoot, and it now carries the brief for one. |
| `visuals/craton-hero/` | `craton-hero-2400.jpg` — the one render that is **not** for hypati.us. It is the page hero for craton-erp.us, which deploys from outside this package. Its README says how to place it. |
| `visuals/craton-brand/` | CRATON's monogram and wordmark, extracted as vector paths from craton-erp.us. The mark ships in the site as `site/img/craton-mark-v3.svg`. |
| `visuals/craton-strata.html` | The source for the interim CRATON field graphic, so it can be re-rendered or re-coloured. |
| `reference/home-v3.html` · `reference/platforms-v3.html` | The v3 versions, for comparison. Outside the deploy folder, so they do not ship. |
| `hypatius-website/` | **The deploy folder.** Same structure Vercel already builds (Root Directory `hypatius-website`). `APPLIED.md` lists every edit; `README.txt` is the site's own build log, with v3 and v4 sections. |
| `hypatius-website/tokens/fonts.css` | Self-hosted Bebas Neue, Rajdhani, IBM Plex Mono from `site/fonts/`. This file is also the design system's `tokens/fonts.css`; the two are one file. |
| `hypatius-website/site/flagship-v7.css` + `.js` | The page layer, renamed per the immutable-cache rule. v6 block: platform accents, hierarchy strip, captures, proof lines, status marks, accessibility floors. v7 block: the problem, the lifecycle loop, the record, the SF 1408 board, the method, and the raised-surface AA fix. |
| `hypatius-website/site/img/` | New assets only, all new names: `st-*-v9.jpg` (five STARCHITECT v9 captures), `al-*-v2.jpg` (four ALIDADE v2 captures), `alidade-mark-v3.png`, `alidade-mark-512-v3.png`, `alidade-wordmark-v3.png`, `alidade-lockup-v3.png`, `starchitect-mark-v3.png`, `starchitect-wordmark-v3.png` (1600 px), `plat-alidade-v3.jpg`, `intro-poster-v3.jpg`, and from v4 `plat-craton-v3.jpg` and `craton-mark-v3.svg`. The old files are left in place so nothing cached breaks; they are no longer referenced. |
| `hypatius-website/vercel.json` | Adds permanent redirects `/starchitect`, `/alidade`, `/craton` to the three platform sites. |
| `hypatius-website/sitemap.xml`, `robots.txt` | New. |
| `guidelines/brand-hierarchy.html` | Design-system card (group Brand): the parent and its three platforms, the three locked accents, the status marks, the "at launch" rule. |
| `verification/verify.mjs` | The harness, cloned from STARCHITECT: six pages at two widths, no horizontal scroll, 10 px type floor, 44 px targets, reduced-motion, zero external requests, AA contrast, banned terms, focus ring. `report.json` is the last run. |
| `verification/verify-imagery.mjs` | **New in v4.3.** The contrast check the one above cannot do: it hides the text, screenshots the ground, and measures the real pixels under every headline that sits on a photograph. Needs `pngjs` as well as `playwright`. Run both before shipping any imagery change. |

## Deploy

Exactly as the site's own README says: upload `hypatius-website/` to `captaink3rk/hypatius-websites`, let Vercel build
`hypatius-website`, then check the footer reads **© 2026 HYPATIUS, LLC · UEI UKELB3UV76V6 · CAGE 19S89** and that
`https://hypati.us/craton` lands on craton-erp.us once that site is up.

## Install in the design system

1. Copy `guidelines/brand-hierarchy.html` into the system's `guidelines/`. It appears under **Brand** after the compiler runs.
2. `hypatius-website/tokens/fonts.css` replaces the system's `tokens/fonts.css`; copy `hypatius-website/site/fonts/` alongside
   so the relative paths resolve.
3. `npm i -D playwright pngjs` once, then run **both** harnesses before any change ships:
   `node verification/verify.mjs` and `node verification/verify-imagery.mjs`.

## The new spine, in one screen

Hero · hierarchy strip · **the problem** (one question in three accents: commander, bid board, auditor) ·
manifesto · **the lifecycle** (Decide / Prove / Account as a closed loop, each naming its reviewer) ·
the three platform showcases · **the record** (the shared mechanism, an annotated run receipt, the
fourteen SF 1408 areas) · architecture · **the method** · vision · leadership · news · contracting · contact.

`#capabilities` is gone, folded into the method. Nav reads Platforms · The record · Method · Company · News.

## CRATON, corrected

The biggest content error on the site was CRATON: described as a "deterministic ERP and CRM" and
illustrated with **a rocket launch**. It is DCAA-ready timekeeping, charge codes, indirect rate pools
and the SF 1408 binder, for firms of one to fifty people. Both pages now say that in CRATON's own
words, it carries its real monogram, and its field graphic is bedrock strata rather than a launch.

## Before you deploy, two things to confirm

1. ALIDADE reads **Live** in four places.
2. **The CRATON positioning deck is unresolved** — Option A (third HYPATIUS platform) versus Option B
   (standalone). This package builds A throughout. Audit §5.6.

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
