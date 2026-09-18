# starchitect.us — audit and v10

**18 September 2026 · HYPATIUS Design System · STARCHITECT tier**
Scope: the public website. The operator console was covered in the 16 September package and is untouched here.

Nothing live was changed. Nothing in the repo was touched. This package is a working copy.

---

## 0 · The finding

**The entire site chrome was built in JavaScript. A crawler saw nine orphaned pages with no navigation.**

Every canonical page opts in with `<body data-chrome="on" data-route="…">`, and `home-fx.js` then constructs
the classification banner, the whole navigation, the telemetry bar and the entire footer at runtime. None of
it exists in the served HTML.

Measured with JavaScript disabled, before anything was changed:

| Page | Internal links | Nav | Footer | ITAR notice | Entity name |
|---|---|---|---|---|---|
| `home.html` | **3** | no | no | yes | **no** |
| `platform.html` | **2** | no | no | **no** | **no** |
| `a-platform.html` | 12 | yes | yes | yes | yes |

The third row is the point. `a-platform.html` is part of an **older generation that is orphaned** — not in the
JS navigation, not in the footer, reachable only by typing the URL — and it is strictly better built for a
crawler than the site that replaced it.

Why it matters here more than on most sites:

- **Link discovery.** Google executes JavaScript, but discovery is deferred and unreliable, and Bing, the AI
  crawlers, LinkedIn and Slack unfurlers frequently do not run it at all. For a company whose entire route to
  market is being found by GovCon stakeholders, nine pages with two or three links between them is a
  self-inflicted wound.
- **The ITAR notice and the entity line.** Six of the nine canonical pages carry **no ITAR notice in the
  document at all**. For a defense contractor that paragraph is the one thing you would want in the markup
  rather than assembled afterwards by a script that may not run.
- **No-JS and reader modes.** The site has no navigation whatsoever without JavaScript.

### What v10 does about it

`tools/bake-chrome.mjs` generates the chrome statically and injects it into the nine canonical pages. It is
deterministic and idempotent — it strips what it previously inserted before inserting again — so it can be
re-run, and `--check` makes it a CI gate.

`home-fx.js` keeps every live behaviour. The UTC clock, the latency and track counters and the correlator all
bind by attribute (`[data-utc]`, `[data-latency]`, `[data-tracked]`), which works on static markup exactly as
well as on generated markup. Only `initChrome` stands down, and only when it finds the chrome already there.

Measured after:

| Page | Internal links | Nav | Footer | ITAR | Entity |
|---|---|---|---|---|---|
| `home.html` | **3 → 22** | yes | yes | yes | yes |
| `platform.html` | **2 → 21** | yes | yes | yes | yes |
| `company.html` | → 20 | yes | yes | yes | yes |
| `press-kit.html` | → 26 | yes | yes | yes | yes |

---

## 1 · The website had never been verified

The existing `verification/verify.mjs` in the September package covers the **platform** — fourteen operator
console screens, 252 checks, passing. It has never covered the website. So the nine public pages had no
harness at all.

`verification/verify-site.mjs` is that harness, cloned from the hypati.us one. **First run: 144 checks, 54
failing.** It now covers ten pages and passes at **160 checks, 0 failing**, and `verify-site-imagery.mjs` —
the photographic contrast check that measures real pixels under headlines rather than computed CSS — passes at
**8 checks, 0 failing**.

### 1.1 · The worst thing it found

**The primary call to action had invisible text, on every page.**

```
base.css:153   .btn-primary   { background: var(--gold); color: var(--void); }
base.css:136   .nav-links > a { color: #9FA9B8; }
```

`.nav-links > a` is specificity 0,1,1; `.btn-primary` is 0,1,0. The nav rule wins, so "Request briefing" —
the site's one conversion action — rendered `#9FA9B8` on `#D4A03B`: a measured **1.01:1**. The intent in
`base.css` was correct all along; it was simply being overridden. Restored, it reads 8.32:1.

### 1.2 · Red on a public surface

`#C8442E` was carrying "CONVERGING", "Case 01 — China GEO" and "Case 04 — Strait of Hormuz" at 3.44:1 and
4.05:1. The contrast is the smaller half of the problem: the corporate standard **prohibits red externally**
and reserves it in-product for lethal and refused states. It was doing neither job — it was decoration on
marketing copy.

Retargeting `--alert` to the platform's own gold fixes the brand violation and the contrast together: 7.07:1
on panel, 8.32:1 on void, and gold is already what STARCHITECT uses for decision and emphasis. The token keeps
its name so the intent stays legible. **The operator console's state vocabulary is untouched** — that is where
red still means what it should.

`home-fx.js` also hardcoded `ALERT = '#C8442E'` and `SLATE = '#6B7588'` as JavaScript constants written into
inline styles, which no stylesheet can reach. Both corrected at source.

### 1.3 · A mistake I made and caught

I first fixed the failing gold by retargeting the `--gold-deep` token globally. That was wrong. The token is
used **both** as ink on the paper grounds, where it needed darkening, and as the dark stop of the `.os-core`
gradient, where darkening it dropped the near-black wordmark sitting on that gradient from 5.17:1 to 3.12:1.

The harness could not see the regression, because it cannot read a background that is a gradient — it walks up
the ancestor chain and reports whatever solid colour it finds. **A token used for both ink and fill cannot be
fixed at the token.** Only the four ink selectors move now.

`.os-core` also gains a `background-color` under its gradient. That is not a way of quieting the check: any
client that does not paint the gradient — an old renderer, forced-colors mode, a printed page — currently gets
the page ground and unreadable near-black text on it.

### 1.4 · A harness bug, not a site bug

All eighteen focus checks failed, on all nine pages, while the focus ring was in fact rendering correctly.
`getComputedStyle` read immediately after a synthetic `Tab` returns a stale `outline-width: 0` in this headless
build: the rule has matched and `:focus` is live, but the style recalculation has not flushed. Touching the
element forced a recalc and the correct `2px` appeared.

It cost an hour and produced a confident, wrong answer in the meantime, which is the expensive kind. The check
now waits two animation frames. **The same latent bug is in the hypati.us harness and in the platform harness
this one descends from.**

### 1.5 · The rest

| Fix | Measurement |
|---|---|
| `--mute-text` `#6B7588` → `#8A94A8` | failed AA on all four dark grounds (3.60 / 3.97 / 4.01 / 4.24); now 4.71–6.44. `#8A94A8` is HYPATIUS's own `--slate-400`, so parent and platform now share the value |
| ITAR notice | hardcoded `#45505f` at **2.40:1** — the least readable text on the site |
| Nav pill, six component labels | 9px and 9.5px against a 10px floor |
| Surface index numerals | `#2A3A57` at 1.46:1; `#5E77A4` reads 3.70:1 and stays recessive |
| CRATON swatch label | `#8B6FD6` at 4.25:1 → `#B499E0`, ALIDADE's own consent violet, 6.82:1 |
| Press kit "things not to do" | `#9FA9B8` on the paper ground at **1.92:1** — a block styled for dark grounds sitting on paper, never checked because the page was orphaned |
| Briefing checkbox | 13×13 against a 44px floor; rebuilt as a 44×44 target with a 20px box drawn inside, so it looks the same and is four times the area |
| Mobile menu button | 22×28 |
| Focus ring | none on the first focusable element of every page |
| Telemetry bar at 390px | 917px of content in a 390px viewport, taking the document sideways |
| PACE staircase at 390px | 12px over; now scrolls within itself, keyboard-reachable, because the descending heights are the diagram |

---

## 2 · Zero third-party requests

Twenty pages fetched Bebas Neue, Rajdhani and IBM Plex Mono from Google — a third-party request on every page
of a defense contractor's site, and first paint dependent on a host we do not control. The same self-hosted
woff2 subset already ships on hypati.us, so this is parity rather than a new decision. **Measured after: 0
external requests across all nine pages.**

It was also costing more than privacy. The earlier screenshots show headlines setting in a fallback face and
the navigation wrapping "USE CASES" onto two lines; self-hosted, the pages paint in Bebas and Rajdhani
immediately and the nav sits on one line.

IBM Plex Mono at 600 is declared against the Bold file rather than left to synthesise — a synthetic bold on a
mono face wrecks the column alignment the telemetry bar and every data readout depend on.

---

## 3 · The stale pages, resolved

Twenty-three pages were deployed and nine were canonical. **This is now applied, not proposed.** Two of the
fourteen turned out to hold content the canonical site did not, so they were promoted rather than deleted.

### 3.1 · Promoted

**`a-press-kit.html` → `press-kit.html`, now canonical.** 715 words with no equivalent anywhere on the site:
approved language, a single-glance reference, the team, logo and palette and typography rules, and a press
contact. A press kit is a real asset for a company doing defense PR, and retiring it would have thrown it
away. It now carries the baked chrome, the v10 layer and a canonical tag, and sits in the footer under
Company.

**The leadership block → `company.html`.** `company.html` had no team section at all; `a-about.html` had one.
A defense company's About page with no named leadership is a gap, so the block moved across. It uses styled
initials, not photographs, so it is unaffected by the portrait question.

### 3.2 · Titles corrected on the way

Both promoted blocks carried stale titles. Against the settled record:

| | Was | Now |
|---|---|---|
| Stan Kennedy | Chief Executive Officer | **Co-Founder &** Chief Executive Officer |
| Jordan Broe | Co-Founder & Chief **Marketing** Officer | Co-Founder & Chief **Mission & Product** Officer |
| Shawna LeMieux | Chief of Staff | Chief of Staff **· Business Operations** |
| Maureen O'Brien | Executive Advisor | **Advisor & Board Member** |
| James LeMieux | Founder & Chief Technology Officer | unchanged, already correct |

Had these pages simply been retired, the wrong titles would have gone with them and nobody would have
noticed. Promoting them is what surfaced the errors.

**A factual error, corrected.** Both promoted blocks attributed military service to people who do not have
it: "U.S. Air Force veteran" on Stan Kennedy and "U.S. Navy veteran" on Maureen O'Brien. Jordan confirmed
that **Jim LeMieux is the only one of the team with a military service background**. Both claims are removed
from `company.html`, `press-kit.html`, the two retired originals, and — where the same line had propagated —
`hypati.us/company.html`.

I had flagged these as a brand-standard judgement call, weighing whether an individual's service history
counts as the *business status* claim the prohibited list bans. That was the wrong frame. They were simply
not true, and no reading of a style rule makes an inaccurate biography acceptable on a defense contractor's
site. Worth recording as the more useful lesson: **check whether a claim is correct before debating whether
it is on-brand.**

Jim's own bio does not currently mention his service. Adding it needs his branch and dates, which I do not
have and will not invent.

### 3.3 · Retired

Thirteen files moved to `starchitect-website/_retired/`. Nothing is deleted — they are in the package, out of
the deploy path.

`a-about` · `a-capabilities` · `a-glossary` · `a-platform` · `a-press-kit` · `a-use-cases` · `evolve` ·
`home-a-watch` · `home-b-field` · `home-c-brief` · `home-command` · `intro-preview` · `intro-live`

### 3.4 · Nothing 404s

`vercel.json` carries a permanent redirect for every retired URL — the `a-*` pages to their canonical
equivalents, the prototypes and working documents to the homepage. Whatever links or bookmarks exist keep
working, and the duplicate-content problem resolves the way search engines expect it to.

Also new: `sitemap.xml` listing the ten canonical pages, `robots.txt`, and a `rel="canonical"` tag on each of
the ten, which none of them had.

**The live site is now ten pages:** home, platform, capabilities, use-cases, resilience, security,
acquisition, company, resources, press-kit — plus `index.html`, the intro gate, which plays the sting once per
session and hands off to `home.html`.

### 3.5 · What the promotion broke, and how it was caught

Moving the team block from `a-about.html` to `company.html` moved the markup but not its styling: the
`.team` and `.member` rules live in `sub.css`, which `a-about.html` loaded and `company.html` does not. The
block arrived as unstyled text with the initials sitting as stray characters above each name.

The harness did not catch it, because unstyled text is still legible text. Only looking at the rendered page
did. The six rules are now ported verbatim into `site-v10.css`, plus the narrow-width breakpoint `sub.css`
never had — three 28px-padded cards do not fit a phone, and `a-about.html` had never been checked at 390.

**In a site with per-page stylesheets, moving a component moves half of it.** Worth remembering for ALIDADE
and CRATON.

## 4 · Carried from the September audit

`CHANGES-v9.md` listed three changes, none applied to the live site. Status in this working copy:

1. **`CJADC2` in the meta description on 14 pages** — already corrected in this copy. **Still wrong on the
   live site**; the `sed` one-liner in `CHANGES-v9.md` remains the fix.
2. **The console section on `platform.html`** — **already present in this working copy** and verified: the
   section is in place at `#console` and its four figures are the real v9 FUSION captures (byte-identical to
   `captures/`), not the ops-center theme. All seven v9 renders are in `assets/screens/`.
3. **Proof lines under every figure** — partially present; the pattern is in the stat panels on `home.html`
   and `platform.html`.

---

## 5 · What is not done

- **The live site is well behind this copy.** It still has `CJADC2` in the meta description on 14 pages, and
  none of v10. Deploying this package is what closes that.
- **`home.html` is served at `/` via the intro gate.** The canonical tags point at `/home`. Confirm that
  matches how Vercel is configured before the sitemap is submitted.
- **Port the focus-timing fix** to `HYPATIUS-Overhaul-2026-09/verification/verify.mjs` and to the platform
  harness. Both share the bug described in §1.4.
- **`intro-live.html` is 5.8 MB** of self-unpacking base64. It is orphaned and was not touched.

---

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
