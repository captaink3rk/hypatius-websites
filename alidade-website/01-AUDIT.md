# ALIDADE — creative and functional audit

**HYPATIUS Design System · ALIDADE tier · 16 September 2026**
Prepared for Jordan Broe, CMPO. Scope: the ALIDADE platform, alidade.us, and the mobile surface.

Sources read: the `alidade-development` handoff bundle (263 files), the standalone ALIDADE Design
System on the local device, the live site at alidade.us, and hypati.us / starchitect.us for
cross-brand comparison.

**Not read:** `uwgamer/hypatius-hci`. The repository is private and this session has no GitHub
credentials, so nothing in it was touched or changed. Product intelligence below is reconstructed
from the ported HUD token layer, the Command kit, `github.md`, and the brand book. Section 7 lists
what would change if the repo were available.

**Also not received:** the `craton-reference` bundle. The handoff asks for ALIDADE to be audited
*against the CRATON v2 finish*, and that bundle ships separately. The CRATON criteria in
`HANDOFF.md` §"What match CRATON means" were used instead. Anything in this audit that cites a
CRATON pattern is citing that list, not the bundle.

---

## 0 · The finding that reframes the rest

**The design system already contains a better alidade.us than the one that is live.**

`templates/website/Website.dc.html` in the design system and the page serving at alidade.us are
two different products telling two different stories.

| | Design-system template | Live at alidade.us |
|---|---|---|
| Positioning | "Research & logistics intelligence — everything a scenario needs that is not a maneuver" | "Capture decision intelligence · GovCon" |
| Structure | Six tool groups, MCP-native, the seam beside STARCHITECT | Nine surfaces, pricing tiers, ROI calculator |
| Credential stamp | UEI, CAGE, Charleston SC, phone, "small business · non-traditional defense contractor" | None of it |
| Claim discipline | "Tool names describe the planned general-availability surface." "Screens are product mockups with composite data." | "~70% faster", "Certified for federal ground." |
| Entity | © 2026 HYPATIUS | © 2026 Hypatius, **Inc.** |
| Protected line | "STARCHITECT flies the mission. ALIDADE sources it." | Absent |
| Mobile | Bearings + Ask, designed in | "The console, in your pocket" |

Neither is wrong. The template is more disciplined and more defensible; the live site is more
commercially complete — it has pricing, an ROI model and the nine-surface story, which the template
lacks. The problem is that they drifted apart and nobody merged them, so the canonical artefact and
the shipping artefact now disagree about what ALIDADE *is*.

The website in this bundle is that merge: the template's discipline and credential posture, the
live site's commercial completeness, and none of the claims that will not survive a security review.

---

## 1 · The open decision, closed

`HANDOFF.md` names one decision the audit must force: ALIDADE runs two token layers, kept verbatim
and deliberately unreconciled. That decision is made in `guidelines/decision-token-reconciliation.card.html`
and implemented in `tokens/alidade-v2.css`. Summary:

**Colour and geometry go to the brand layer. Elevation gets one narrow written exception. Two
values are adopted from the live app because they measure better.**

The reasoning is not "the brand should win because it is the brand." It is this:

Both palettes clear WCAG AA in almost every role, so contrast does not decide it — it only
disqualifies two specific values. What decides it is that the live app's accents are framework
defaults nobody chose. `#5eead4` is Tailwind `teal-300`. `#fb7185` is `rose-400`. The radius scale
is Tailwind v4 as shipped. The brand accents were tuned against the crystalline A mark's
iridescence, and **the mark is locked**. A locked mark sets the field it sits on, not the reverse.

Two exceptions, both measured:

- **Deep teal goes to the app.** Brand `#14998C` measures **4.33:1** on `--al-srf2` — a fail for
  label text. App `#14B8A6` measures **6.13:1**. Same hue family, materially more usable.
- **The microlabel ink belongs to neither.** Brand `#5C6E89` measures **2.94:1** on `--al-srf2`;
  app `#5d7081` measures **2.87:1**. Both fail. Retuned to `#7D92B5` at **4.83:1**.

That second one is not theoretical. In the shipped product CSS, `.kpi` sets `background:var(--al-srf2)`
and `.kpi-label` sets `color:var(--al-t3)`. **Every KPI label in the ALIDADE product fails AA, and
has since v1.** It is fixed at the token level, so every consumer inherits the fix.

And the hairline: the brand specifies `0.5px`. On a 1× display that is non-deterministic — it rounds
to a full-strength 1px or it disappears, depending on the browser. The hairline is the entire depth
system in a shadowless design language, so it cannot be left to rounding. v2 uses 1px at the brand's
alpha, which is the same optical weight on 2× and the only weight that survives 1×.

### The elevation exception

The brand rule — depth is surface level plus border alpha, never shadow or blur — is right for
content and it stays. It is wrong for exactly one case, and the live app was right to break it there:
**chrome that docks over scrolling content cannot separate from it by surface step**, because the
thing sliding underneath is also a surface.

So elevation becomes a token with one permitted use rather than a judgement call made per component:
`--al-elev-dock` and `--al-blur-dock` on rails, sticky banners, modals, popovers and the command
palette. Everything else gets `--al-elev-0`. If it is not docked over moving content, it does not
get a shadow, and that is the end of the conversation.

---

## 2 · alidade.us — what is wrong

Ranked by consequence, not by effort.

### P0 · The page is invisible to the things it is built to serve

Most of alidade.us is client-rendered and the served HTML still contains **unrendered `{{ }}`
template expressions**. Confirmed in: all pricing tiers and the comparison table, all six security
controls, the entire attestations block, the seven viability factors, the ROI outputs, the nine
surface descriptions, the MCP tool list, the "Who it's for" cards, and the capture-loop cards.

Anything that does not execute JavaScript — crawlers, link previews, LLM answer engines,
procurement scrapers — reads `{{ t.price }}` where the price should be.

For a product whose central pitch is *"every surface, also a tool"* for AI agents, being unreadable
to agents is the irony worth fixing first. It is also, straightforwardly, why the page does not rank.

**Fix:** server-render or prerender. The page in this bundle is static HTML with every word in the
markup; it needs no build step to be readable.

### P0 · "Certified for federal ground."

That headline renders, to a non-JS reader, with **nothing underneath it** — the attestations block
beneath is entirely `{{ c.k }}` / `{{ c.s }}` placeholders. So the page asserts certification and
substantiates nothing.

It is hard to defend even with JavaScript on, because **nothing on the page names an actual
certification**. Nearby: **"NIST 800-171"** appears in the hero trust badge and the footer as a bare
standard name with no qualifier — not "aligned to", not "assessed against" — directly beside the
words "Trusted architecture." An unqualified standard name in a trust badge reads as a compliance
claim.

Memory of the platform is explicit that **FedRAMP High is a target pathway, not a current
certification**. The live page does not say that anywhere.

**Fix:** the bundle's site carries a "Compliance posture · stated plainly" block that splits *what
is true today* from *what is a pathway, not a status*, names FedRAMP High as a target and says
plainly that ALIDADE is not FedRAMP Authorized. This is not a concession. A security reviewer will
find the distinction anyway; publishing it first is the stronger position, and it is the only
version that survives a CISO walkthrough.

### P0 · "~70% faster" is an unsourced empirical claim

The ROI section reads: *"The model uses ALIDADE's measured effects — a sharper win rate from honest
scoring and teaming, and proposals built ~70% faster."*

"Measured effects" asserts measurement. No methodology, sample, date or source appears. The
disclaimer that does exist — *"Illustrative model · not a guarantee of results"* — sits on the
calculator **output**, not on the 70% **input assumption** that generates it. So the disclaimer does
not cover the claim.

Memory records "70% B&P reduction" and "$1.87/proposal" as **internal benchmarks, not for external
presentation as customer outcomes.** The internal figure is on the public site.

Related unsourced claims: *"a sharper win rate"* (causal lift, no figure), *"calibrated
probability-of-win"* ("calibrated" is a term of art implying validation against outcomes; no
calibration evidence appears), and *"Every rival in your NAICS"* (an absolute coverage claim).

**Fix:** the bundle's site removes the percentage and offers ROI modelling *in a briefing, run
against the prospect's own pursuit history* — which is both defensible and a better sales motion,
because it creates a meeting instead of a bounce.

### P1 · A GovCon site with no UEI, no CAGE, no address, no people

alidade.us has none of them. hypati.us has all of them plus a phone number. For a federal buyer
doing a five-minute vendor sanity check, UEI and CAGE in the footer are table stakes — their
absence reads as a company that is not actually registered.

The credential stamp is described in the brand system as **copy, not chrome** — a dog-tag that
repeats in heroes, covers, closes and footers. It is absent from the platform's own public site.

### P1 · Entity name conflict across live properties

alidade.us footer: **"© 2026 Hypatius, Inc."**
hypati.us footer: **"© 2026 HYPATIUS, LLC · UEI UKELB3UV76V6 · CAGE 19S89"**

Inc. versus LLC on two live properties of the same company. In a regulated sales motion this is the
kind of thing that gets noticed by exactly the wrong reader.

### P1 · SEO and structure

- **Three `<h1>`s**, not one.
- **No `robots.txt`, no `sitemap.xml`, no `llms.txt`** — all 404.
- **Every sub-path 404s.** `/platform`, `/pricing`, `/security`, `/company`, `/glossary` and the rest
  are nav labels pointing at a single page. There is no URL to send anyone to.
- **`<title>` and meta description could not be confirmed and appear to be absent or thin.** Both
  sibling sites return them cleanly; alidade.us returned nothing across four attempts. Worth
  confirming in view-source — if it is missing, that alone suppresses the page in every preview and
  every search result.
- **Alt text is bare labels** — "Command", "Pipeline", "Bid Builder". The screenshots carry the pWin
  scores and pipeline dollars, so the actual substance of those images is unavailable to screen
  readers and to crawlers.
- **Two different labels for one action:** "Request demo" in nav, "Request a demo →" in the hero.
- **Footer nav does not match primary nav** — footer has About and Contact; primary has Company.

### P2 · Cross-brand copy duplication

STARCHITECT uses **"Nine surfaces. One operating picture."** — identical to ALIDADE's operator
console headline. Same for the "Request a briefing →" / "Tour the platform →" CTA pattern. Two
platforms in one portfolio sharing a headline cannibalises both and produces duplicate-content
signals.

Separately, **"Clarity for contested environments."** is doing three jobs at once: HYPATIUS's H1,
ALIDADE's subheadline, and ALIDADE's footer copyright line. It is the company line. It should not
also be a platform subheadline.

### P2 · One glyph to check

`⛓` (U+26D3) appears on the page. It is a Miscellaneous Symbols character, not an emoji — but it
renders as a **colour emoji** on iOS and Android even without a variation selector. Given "no emoji,
ever," worth confirming how it renders on a phone. Every other symbol on the page (◆ ● ✓ × Σ → ↗ ·)
is correctly typographic.

---

## 3 · Compliance sweep — binding rules

Run against the handoff bundle, the standalone design system, and all three live sites.

**alidade.us is clean** on every banned term: no VOSB, SDVOSB, veteran-owned/built/led, VetCert,
main.hypati.us, hypatius.io, Sara Dillan, Brian Willcott, CJADC2.

Three hits elsewhere:

| Where | Hit | Severity |
|---|---|---|
| **starchitect.us** meta description | *"The operating system for space warfare and **CJADC2**."* | **High** — live, indexed, in the metadata layer where it is hardest to notice and easiest for a search engine to surface. The visible page body correctly says BMC3I; only the meta tag is wrong. |
| `ui_kits/platform/data.js` (standalone DS) | `setaside: "SDVOSB set-aside"` on a pursuit; `creds: "SDVOSB · 8+ yrs…"` on a partner | **Medium** — see note below |
| `ui_kits/platform/data.js` (standalone DS) | Avatar initials `"SD"` and `"BW"` in the Bid Builder demo; activity rows attributed to both | **Medium** — Sara Dillan and Brian Willcott "appear nowhere." Initials in demo data are still an appearance, and this kit is what screenshots get taken from. |

**On the SDVOSB values, a distinction worth keeping.** The rule bans *HYPATIUS claiming ownership
status*. It does not ban the product from having a set-aside field — the backend carries seven
socioeconomic categories in `_SETASIDE_CERT_MAP`, and a capture tool that cannot read a set-aside is
broken. The risk is narrower and specific: a design-system demo screen showing "SDVOSB" beside
HYPATIUS branding is exactly the path by which a banned term reaches an external deck. Keep the
feature; change the demo values to 8(a) / HUBZone / WOSB so no exported mock can carry it. The
website and platform kits in this bundle already do.

Also noted: `templates/white-paper/WhitePaper.dc.html` contains CJADC2 and
`templates/alidade-website/glossary-data.js` contains VOSB in the handoff bundle. Both need a read
in context before changing — a glossary that *defines* VOSB may be legitimate; a white paper using
CJADC2 in body copy is not.

---

## 4 · The platform

**Five of six surfaces were unbuilt.** The HUD kit covered Command only; Opportunities, Competitive
Intel, Pipeline, Proposals and GovFeed were specified in the repo and never recreated in the design
system. They are built in `ui_kits/platform-v2/`, on the reconciled tokens.

What changed beyond the token swap:

**Namespacing.** v1 shipped `.crd`, `.pill`, `.field`, `.tab`, `.kpi`, `.topbar` into a global
scope. `.field` and `.tab` will collide with almost any host stylesheet — and ALIDADE is explicitly
designed to be embedded in the STARCHITECT console, which has its own class layer. Everything is now
`al-`, matching CRATON's `cr-`. v1 names survive as aliases so nothing breaks on drop-in.

**State marks.** The single most consequential accessibility change, documented in
`guidelines/state-marks.card.html`. Win bands carried on hue alone are invisible to roughly one in
twelve men, to forced-colors mode, and to a greyscale print of a deck — and the actual reading
condition for a capture lead approving a gate is a phone in sunlight. Every band now carries a mark
(▲ ● ■ ◆) and a word alongside the hue.

**The bracket-in selection is kept.** It is the one live-app *pattern* that is better than the brand
system's: it marks the selected row structurally with corner brackets rather than flooding it with
colour. Ported into `.al-row[aria-selected="true"]`.

**Keyboard and focus.** v1 rows were `<div>`s with click handlers — unreachable by keyboard.
Rows are now focusable, operable with Enter and Space, and carry `aria-selected`. Focus is visible
everywhere with no exceptions.

**The ledger is now a component.** *"AI-assisted analysis with a complete, reviewable record of every
run — inputs, tools called, outputs"* is the provenance line, and it was prose. `.al-ledger` makes it
a surface element with AUTO and GATE modes, so every agent surface shows its own run. Denials render
with the same weight as successes — a ledger that only logs what worked is not an audit trail, and
showing that is a selling point, not a detail.

**The bearing dial is a real component.** It was described in the brand book as the signature
data-viz and drawn ad hoc. It is now `.al-dial`, used in the website hero, the platform detail rail
and the mobile answer screen — the same instrument at three scales.

---

## 5 · Mobile

There was no built ALIDADE mobile kit. The approved concept — Bearings + Ask, hold-the-mark-to-ask,
bearing-dial answers, the listening ring as the single permitted live element — existed as a written
description. It is built in `concepts/mobile-v2/`: four screens at 390px, with the rules it holds to
written underneath.

The load-bearing decision: **three destinations, not nine.** The desktop HUD has nine surfaces
because a capture manager works there all day. The phone exists for *deciding*, not working —
approve a connection request, release a report, hold an action, ask one question. Porting the
nine-surface IA to a phone is the most likely mistake and the one worth naming in writing before
someone makes it.

The live application ships a 25-screen Expo client that the design system has never read. **Reconcile
the Expo client against these screens, not the other way round** — the same mistake that produced
the token split will otherwise reproduce itself on mobile, and it will be harder to unwind because
mobile has no shared stylesheet to swap.

---

## 5b · The brand kit, and how it was used

The handoff bundle carried the full locked kit under `assets/brand/`, `assets/glyphs/` and
`assets/imagery/` — and the first cut of this package built around it rather than with it,
substituting a drawn triangle for the mark. That broke the brand book's own rule. Corrected:

- **Mark**: `alidade-mark.png` on every surface, with the teal glow as the only treatment. Never
  recoloured, never a solid fill. On mobile it is the hold-to-ask control, per the brand book.
- **Wordmark and lockup**: the PNGs, not typeset text. The wordmark is **violet-blue** (sampled
  ≈ `#7078D8`), not teal — a fact the typeset "ALIDADE" in v1 surfaces quietly erased. Where the
  word is set as text beside the mark (nav, topbar), it is white, which is the brand book's own
  cover treatment.
- **Glyphs**: the eight teal glyphs on brand surfaces — tool groups, the seam cards, governance,
  the agent section. Product UI keeps Tabler outline, as specified.
- **Imagery**: the bearing ring under the hero, the deep under the close, product screenshots in
  a gallery. All under protection gradients so type lands on a dark field.

## 6 · What the design system itself needs

Beyond the token work:

1. **Delete `css/alidade-brand-bridge.css`.** The handoff asks to "retire the bridge by moving them
   onto `--al-*` directly." Done — v2 defines the short-name vocabulary natively, so the brand book,
   website and specimen cards run with the bridge gone.
2. **Self-host Barlow Condensed and Inter.** They load from Google Fonts today. A font request
   leaving a tenant workstation is an egress a security reviewer will ask about, and "there isn't
   one" is the answer you want to be able to give. This is the last CDN dependency on a product
   surface.
3. **Retire the four-band pWin split.** `templates/website/Website.dc.html` still describes the
   bearing dial as *"Teal at 85 and above, deep teal 70–84, gold 60–69, coral below"* — the old
   four-band scheme. Settled is **three bands: ≥80 / ≥60 / below**. A score in a deck must equal the
   score in the app or the deck becomes a liability in a room where someone has the app open.
4. **Clean the demo data** in `ui_kits/platform/data.js` — the SDVOSB values and the SD/BW initials.
5. **Build the verification harness.** `HANDOFF.md` asks for a clone of CRATON's `verification/`:
   AA at 1440 and 390, reduced-motion clean, visible focus. The contrast pass is done and its
   results are in this audit; the harness that keeps it true is not, and without it the next token
   edit reintroduces the KPI failure.

---

## 7 · What repository access would change

Working from the bundle was sufficient for everything above. It would not be sufficient for:

- **The 25-screen Expo client.** The mobile work here is the design-system position, argued from the
  brand book. Reconciling it against what actually ships needs the screens.
- **HUD spec §5.2–5.6.** The five surfaces are rebuilt from their names, the Command precedent and
  the visual spec references in `github.md`. Field-level fidelity to the specified surfaces is not
  claimed.
- **The real `_SETASIDE_CERT_MAP`, factor implementation and `tokens.ts`** — enough is known to
  match bands and weights, not enough to verify every mapping.
- **A migration diff** for `frontend/app/globals.css`. Step 5 of the migration is described
  correctly as a token swap, but the exact edit list needs the file.

If you want that done, the cleanest route is a folder on your machine with the repo cloned — I can
read it there without any credentials and without touching it.

---

## 8 · Two things to handle outside this bundle

1. **The design system is in your Trash.** Everything read from your machine came from
   `/Users/jordanbroe/.Trash/ALIDADE Design System/`. Partway through this session the `tokens/`
   folder stopped resolving, which means the Trash is being emptied or the folder is moving. Four
   directories there — `concepts/`, `scraps/`, `skills/`, `ui_kits/` — are **not** in the zip you
   uploaded. `concepts/ALIDADE Surface Concepts.html` in particular is the only record of the
   approved mobile concept and the five alternative delivery surfaces. Recover it before it goes.
2. **`CJADC2` is live in starchitect.us's meta description.** Outside ALIDADE's scope but inside the
   family, indexed, and a one-line fix.

---

*Contrast figures computed against WCAG 2.1 relative luminance. Nothing in this audit was written to
a repository, and the live site was read only.*

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
