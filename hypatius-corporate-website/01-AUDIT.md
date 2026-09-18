# hypati.us · corporate site audit and the v3 pass

**HYPATIUS Design System · 16 September 2026**
Prepared for Jordan Broe, CMPO. Scope: the live corporate site at https://hypati.us, read page by page, against the
work of the last day on STARCHITECT (v9 FUSION console), ALIDADE (v2 reconciled system) and CRATON (site going live at
craton-erp.us today), and against the corporate rules. The site source is the `HYPATIUS Site v2` folder you uploaded; the
live pages match it. Nothing live was changed. `hypatius-website/` in this package is the deploy folder with every
change applied.

---

## 0 · The finding

**The corporate site was a week behind its own subsidiaries, and it did not say who the parent was.**

Read as a visitor: hypati.us presents three platforms as peers under a slogan. It links to two of them. It shows
STARCHITECT as a globe render the app no longer looks like, describes ALIDADE in the vocabulary the ALIDADE system
retired this week (Neo4j, "double-blind", "PWIN model"), and treats CRATON as a badge with nowhere to go. The entity
name is spelled three ways across the property (hypati.us "HYPATIUS LLC", alidade.us "Hypatius, Inc.", the CEO release
"Hypatius, LLC"). The word "parent" appears nowhere.

v3 makes the hierarchy the first thing after the hero: HYPATIUS, LLC on top; STARCHITECT, ALIDADE and CRATON beneath it,
each with its own locked accent, its status as a mark and a word, and a link to its own site. Everything else on the site
is then brought into line with what the three platforms actually are today.

---

## 1 · Page-by-page findings

| # | Where | Finding | Severity | Disposition |
|---|---|---|---|---|
| 1 | Every footer, Company copy | Entity "HYPATIUS LLC" without the comma. The CEO release on the same site says "Hypatius, LLC". Your ruling: **HYPATIUS, LLC** across the board. | High | Fixed everywhere, incl. hero, meta, JSON-LD. |
| 2 | Home, Platforms, footers | **CRATON has no external link.** STARCHITECT and ALIDADE link out; CRATON goes to an anchor. craton-erp.us goes live today. | High | `https://craton-erp.us` in the hierarchy strip, the showcase, tiles, stack, Platforms CTA and every footer. `vercel.json` adds permanent redirects `/starchitect`, `/alidade`, `/craton` to the three sites so the routing is committed with the repo. |
| 3 | Home showcase, Platforms detail | **STARCHITECT imagery is pre-v9**: a globe render (`plat-starchitect.jpg`) the product no longer resembles. Copy says nothing about the console. | High | v9 ops console as showcase and detail media; three v9 captures (readiness hub, white cell, after action) on Platforms; one paragraph on the command grammar. |
| 4 | Home, Platforms, tiles, stack | **ALIDADE copy is off-system**: "AI-native federal capture, end to end", "Neo4j relationship graphs", "7-factor PWIN model", "double-blind teaming". The ALIDADE v2 system says capture decision intelligence, seven cited factors, three bands, teaming on consent, run ledger, MCP tool server. | High | Rewritten on both pages. Database names do not belong in marketing copy. Three v2 product captures added. |
| 5 | Home | `alidade-a.png` is **4.4 MB** at 3766×3840 for a 64 px logo; `starchitect-wordmark.png` is **1.6 MB** at 6718 px wide; `intro-poster.png` is 4.8 MB. Roughly 11 MB of image before the intro video. | High (performance) | Real ALIDADE mark at 256/512 px, STARCHITECT wordmark re-exported at 1600 px (187 KB), poster as 1920 px JPEG (125 KB). All under new names per the immutable-cache rule. |
| 6 | Home ticker | "$700B+ federal market" with no source. | Medium | Removed. Replaced with "One company · three platforms". |
| 7 | Home manifesto | "870K lines", "<500 ms" carry no proof line. | Medium | Proof lines added. 870K is `[pending data]` until the repository count is confirmed; <500 ms is labelled a design target from the platform directives, which is what the MDO boards already say. |
| 8 | Home and Company leadership | Titles disagree between pages and with the September changes: Jordan is "Chief Marketing Officer" on Company and "Chief Mission Product Officer" on the live home render; Shawna is "Chief of Staff". | Medium | Jordan Broe, Co-Founder & Chief Marketing & Product Officer. Maureen O'Brien, Executive Advisor & Board Member. Order kept: Kennedy, LeMieux, Broe, LeMieux, O'Brien. Shawna LeMieux was briefly set to Chief Operating Officer from the restructuring record; **corrected back to Chief of Staff on 18 Sep on Jordan's confirmation**. |
| 9 | Home capabilities | "FedRAMP-ready" tag. FedRAMP is a target pathway, not a status. | Medium | "FedRAMP pathway". |
| 10 | `tokens/fonts.css` | Bebas Neue, Rajdhani, Plex Mono load from Google Fonts. Every visitor's browser calls a third party before the first paint. | Medium | Self-hosted from `/site/fonts/` (eight woff2, latin, OFL). Zero external requests on every page, verified. |
| 11 | All pages | No canonical, no Open Graph, no structured data, no sitemap, no robots. | Medium (SEO) | Canonical + OG on every page; Organization JSON-LD on home naming the three brands and the UEI/CAGE identifiers; `sitemap.xml`; `robots.txt`. |
| 12 | All pages | No skip link. Nav burger 40×32, footer links 33×36, PDF links 40×17. Several mono labels at 9.5 to 9.9 px. MDO board grey ink `#6B7588` measures 3.94:1 on the board field. | Medium (a11y) | Skip link; 44 px floors; 10 px floor including the boards; board ink to `#8A94A8` (5.99:1). Harness: 96 checks, 0 failing. |
| 13 | Home showcase, tiles | CRATON coloured with the parent's `gold-500` because gold meant "in development". STARCHITECT's brand is gold. CRATON's Bedrock tokens (decided 14 Sep) are bronze. Two children and a semantic all sharing a hue. | Medium (brand) | Decision below. |
| 14 | Home CRATON | "Deterministic ERP" only. You describe CRATON as the DCAA and CRM backbone. | Low | "Deterministic ERP and CRM · program execution", written "at launch". |
| 15 | Home | `plat-alidade.jpg` carries a baked "HYPATIUS" wordmark bottom right; the v2 build retired every hero with baked text and this one slipped. | Low | Replaced with the ALIDADE system's approved maritime hero, `plat-alidade-v3.jpg`. |
| 16 | Home | Empty band after the CRATON showcase: the tiles and stack alternates are hidden but their padded section still renders. | Low | Hidden in showcase mode. |
| 17 | Company | Maureen O'Brien's bio says "U.S. Navy veteran". | None | Kept. An individual's own bio may mention their service; the rule bars the company claim. |

Banned-term grep on the shipped source: clean. The site's own `README.txt` changelog named the retired terms while
describing their removal; reworded so a grep of the deploy folder comes back empty.

---

## 2 · The brand-hierarchy decision

**Each platform keeps its own accent on the parent site. The parent keeps aqua and cobalt. Status is a mark and a word.**

Before v3, hypati.us used the parent's aqua for STARCHITECT, a violet-to-teal gradient for ALIDADE, and the parent's
`gold-500` for CRATON, where gold was the semantic for "in development". That reads as one company with one colour and a
warning tint, not as a parent with three named subsidiaries.

Now: STARCHITECT is its marketing gold `#D4A03B`, ALIDADE is its teal `#21E0CD`, CRATON is the light step of its Bedrock
bronze `#D9B985` (AA on the void). The parent never borrows any of the three. Status is carried structurally: ▲ live,
◆ in development, always beside the word. Gold on hypati.us therefore no longer means "in development"; it means
STARCHITECT. The rule is rendered in `guidelines/brand-hierarchy.html` for the design system.

Roadmap platforms are written "at launch". CRATON's paragraph says what it will be when it ships, not what it is.

---

## 3 · What v3 does not do

- **It does not deploy.** `hypatius-website/` is the deploy folder. Vercel's `hypatius-website` project builds from
  `captaink3rk/hypatius-websites` with Root Directory `hypatius-website`; this session cannot write to that repository.
  Upload the folder and redeploy the newest commit, as the site's own README describes.
- **It does not add a CRATON mark.** The CRATON marks (`craton-c-dark.svg`, `craton-lockup-dark.svg`,
  `craton-shield-dark.svg`) are referenced in the consolidated bundle but were not in anything uploaded here, and a brand
  glyph is never hand-drawn. CRATON is set in type on this site until the CRATON system releases its marks; the
  hierarchy strip and showcase have the slot.
- **It does not rewrite the MDO boards.** The three 1280×720 boards and their PDFs are STARCHITECT collateral. Type floor
  and ink contrast were fixed in place; the PDFs in `site/docs/` still carry the old ink and should be re-exported from
  the boards when convenient.
- **It does not change the intro-sting gate.** `index.html` is unchanged apart from the lighter poster.
- **It does not touch the two platform sites.** starchitect.us changes are in the STARCHITECT package; alidade.us still
  reads "Hypatius, Inc." in its footer and needs its own source or deploy access.

---

## 4 · Two things that need you

1. **The pricing-tier and status questions from the ALIDADE audit still stand**, and this site now calls ALIDADE
   "Live" in three places. If ALIDADE's public status should read differently while it is paused, the status word and
   mark are in one place per page (the hierarchy strip, the showcase index, the Platforms badge and the stack).

---

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89 · Charleston, SC**

---

## 5 · The narrative pass · 18 September 2026

v3 corrected the site. It did not change what the site *argues*. This pass rebuilds the spine of Home
and Platforms on the thesis the portfolio already had but had never written down on hypati.us.

### 5.1 · Where the thesis came from

Not invented here. The CRATON site, built after the v3 audit closed, carries it in its own footer:

> One company · three platforms. **Decide it. Prove it. Account for it.** HYPATIUS builds accountable
> automation for defense. STARCHITECT runs the mission. ALIDADE finds the gaps. CRATON keeps the record.

That line is sharper than anything hypati.us was saying, and it is load-bearing in a way the old
"software operating layer for contested-domain defense" never was: it is a *claim*, and the three
platforms are the evidence for it. So the parent site now leads with it.

The mechanism underneath it is real and checkable in all three products, which is what makes the
argument hold rather than read as a tagline:

| Platform | The record it leaves | Who reviews it |
|---|---|---|
| STARCHITECT | Every AI-assisted run ships with inputs, tools called and outputs | A commander, under a decision clock |
| ALIDADE | Seven factors, each carrying its citation; a run ledger per tool call | A bid board |
| CRATON | Append-only hash-chained ledger; acceptance blocked until `reviewer_id` is set | A DCAA auditor |

Three reviewers, one structural commitment. That is the site's new centre of gravity.

### 5.2 · What changed structurally

The old Home was hero → stats → portfolio → capabilities → diagram → why-us → vision → team → news.
Any of those middle sections could be reordered without breaking anything, which is the tell that it
was a brochure rather than an argument. The new order earns each step:

1. **Hero** — accountable automation for defense.
2. **Hierarchy strip** — the parent and its three platforms, unchanged from v3.
3. **The problem** *(new)* — "Defense software rarely fails the physics. It fails the review," with the
   same question in three accents: the commander, the bid board, the auditor.
4. **Manifesto** — ninety percent accuracy is a one-hundred percent failure rate. Now it lands as the
   consequence of the section above it rather than as an opening assertion.
5. **The lifecycle** *(new)* — Decide it. Prove it. Account for it., as a closed loop diagram plus three
   entries, each naming its reviewer. This replaces the flat "three platforms, one operating layer."
6. **Platform showcases** — as before, each now carrying its verb.
7. **The record** *(new)* — the shared mechanism, an annotated run receipt, and the fourteen SF 1408
   areas as the proof that the mechanism reaches the least glamorous end of the portfolio.
8. **Architecture** — the MDO boards, unchanged.
9. **The method** *(new, replaces "Why HYPATIUS" and "What we do")* — cadence, scale, DDIL, provenance.
   The old "underdog builds sharper" framing was defensive; these are commitments visible in the build.
10. Vision, leadership, news, contracting, CTA, contact — unchanged.

`#capabilities` is gone, folded into the method. Nav now reads Platforms · The record · Method ·
Company · News.

### 5.3 · CRATON, corrected

The largest single content error on the site was CRATON. hypati.us described it as a "deterministic
ERP and CRM for program execution" with "cryptographic data isolation" — abstract, generic, and
roughly half wrong. CRATON's own site says what it is: **DCAA-ready timekeeping, charge codes,
indirect rate pools and the SF 1408 audit binder, for firms of one to fifty people.** Both pages now
say that, in CRATON's own terms.

Its imagery was worse than its copy: a **rocket launch photograph** on an accounting product. Replaced
with `plat-craton-v3.jpg`, a composition built from the brand's own vocabulary — four bedrock strata
with bronze mineral seams and a hash chain descending through them. A craton is stable continental
bedrock; the name was the brief. Slot 01 of the prompt pack replaces it with a real render.

The brand guidelines you sent closed the last gap. CRATON's monogram — a stroked shield carrying three
bronze strata — was extracted from craton-erp.us as vector paths and now appears in the hierarchy strip,
the home showcase and the Platforms section. CRATON was the only platform on the site without a mark.

### 5.4 · What the rebuild broke, and the harness caught

- Sub-10px type on the SF 1408 board (`0.6rem`).
- **A latent design-system fragility.** `--accent-link` (cobalt-400 `#3B7BD9`) measures 4.59:1 on the
  void but 4.24:1 on navy-800 and 4.01:1 on a card. It clears AA only on the darkest surface in the
  system. Every eyebrow on the old site happened to sit on the void, so it passed; the new sections
  sit on raised panels, so it failed. Added `--accent-link-raised: #5A92E0` (5.29:1 on a card). **This
  should go back into the token layer** — any future section on a raised surface will hit it again.
- `.steps` collided with an older unused "numbered process steps" block; the lifecycle list is
  namespaced `.cyc` now.
- The hero was reverting on load: `flagship-v7.js` re-renders the headline from its own `HEADLINES`
  object, so the copy lives in two places. Both updated. Worth collapsing to one source.

### 5.5 · Two things found while rebuilding

1. **`shield.jpg` carries a baked-in HYPATIUS wordmark and was still the Vision background.** The
   September build retired five such heroes and replaced them with `-v2` files; this one was missed
   because it sits in CSS rather than in markup. Swapped to `why-shield.jpg`, which is clean and was
   orphaned when the old "why" section was replaced.
2. **The home hero and the STARCHITECT showcase were the same photograph.** `hero-orbital-v2.jpg`
   appeared twice on one page. STARCHITECT now uses `orbital-dawn-wide.jpg` and the news card takes
   `platforms-hero-v2.jpg`. No photographic field now repeats on a page.

### 5.6 · Open, and genuinely yours to decide

- **The CRATON positioning deck is unresolved.** It presents Option A (third HYPATIUS platform) against
  Option B (standalone brand), and lists the case against A in its own words: *"is a wargaming company
  selling accounting?"* This pass builds Option A throughout, because that is what you chose and what
  craton-erp.us already says in its footer. If B wins, the lifecycle section is where it unwinds.
- **"$700B+ federal market" can come back.** I cut it from the ticker in v3 for being uncited. The
  CRATON research deck sources it — sled.ai, April 2026, with the 23% small-business goal at $160B. It
  is a legitimate figure; it just needs its citation attached, which a ticker cannot carry.
- **ALIDADE's public status** is still a live question from §4. Shawna LeMieux's title is settled: Chief of Staff.

---

## 6 · v4.2 · 18 September, evening

Your six items, plus what the four brand standards changed once I had them.

### 6.1 · The three title corrections

| Who | Now reads | Note |
|---|---|---|
| Stan Kennedy | **Co-Founder & Chief Executive Officer** | Bio opens "Co-founder of HYPATIUS, LLC." |
| Jordan Broe | **Co-Founder & Chief Mission & Product Officer** | CMPO expands to *Mission*, not Marketing. The discipline line and bio follow it. |
| Shawna LeMieux | **Chief of Staff · Business Operations** | |

### 6.2 · The layout faults, and which were mine

Three of the four were regressions I introduced in v4, not pre-existing problems.

- **The footer ran together: "STARCHITECTALIDADECRATON".** My v6 accessibility rule set
  `display:inline-flex` on every nav-ish link to give them 44px targets. That is right for a row of nav
  links and wrong for a stacked column, so the footer columns collapsed into one line. Row navs keep
  `inline-flex`; the drawer and footer lists get block-level `flex`. **This was the most visible fault
  on the site and it was mine.**
- **The STARCHITECT wordmark ran 57px under the console capture.** The capture is absolutely positioned
  across the whole article and was fenced off the card by viewport-relative padding, while the card sits
  in a centred container — so they drifted together at some widths and apart at others. Both now live in
  the same centred 1280 box; measured clearance is a stable 32px at 1280, 1440, 1680 and 1920.
- **~300px of dead field between the manifesto and the lifecycle.** Section padding stacking. Tightened.
- **The leadership row's third line.** Jordan's title wrapped to three lines where the others took two.
  Fixed by the title correction itself, not by styling around it.
- Also caught: the CRATON showcase still carried "Isolated / Cryptographic" from the pre-rewrite spec row.

### 6.3 · What the brand standards corrected

The four standards arrived after v4 shipped, and one of them overturned a fix I had made.

- **Eyebrows should be aqua, not cobalt.** Corporate standard §1.1 measures cobalt `#1A4FBA` and states
  plainly that on dark "it is a **surface, not text** — 2.63:1 on the page field", and §1.2 approves
  "Aqua on navy void or card — all text sizes; links, eyebrows, signal". In v4 I had found cobalt-400
  failing AA on raised panels and invented `--accent-link-raised: #5A92E0` to patch it. That was solving
  a problem the standard had already answered. Eyebrows, section kickers and method labels are now
  `--aqua-400`, and the invented token is aliased to it rather than left as a second opinion.
- **The measure is 1280, not 1400.** §4.3: "Max width 1280px, narrow 960px." The site was running 1400,
  which is part of why the capture could reach the card.
- **ALIDADE's coral is internal only.** Its standard lists "Coral as a marketing accent" under prohibited
  — "it is a product gap/risk signal, and reads as red. Instead: teal and gold externally." Checked: no
  coral on any corporate surface.
- Confirmed already-correct: "MCP" as a protocol name is permitted (only hostnames and internal model
  names are barred); the ▲ ● ■ ◆ marks are on-brand ("Unicode geometric marks in mono contexts are
  on-brand; decorative emoji is not"); and "never hand-draw a substitute for a mark — copy the asset",
  which is what the CRATON extraction did.

### 6.4 · CRATON now shows its own product

The prototype you sent renders a real, finished product surface — a paper-light Bedrock theme. Five
screens captured; three are on the site: **the binder** (the fourteen SF 1408 areas with their state),
**the record** (the run ledger, 21,977 rows, inputs/tools/outputs/reviewer), and **the rates** (fringe,
overhead and G&A against ceiling). The binder capture is now CRATON's showcase image on Home and the
lead media on Platforms, so all three platforms show product rather than atmosphere.

The handoff bundle also replaced my extracted mark with the official files: `craton-shield-dark.svg` is
byte-for-byte the geometry I pulled off craton-erp.us, and `craton-c-dark.svg` — the layered C, square at
96×96 — is now the footer mark, because it reads better than the shield at 18px.

**Not used: `craton-wordmark-dark.svg`.** It is a `<text>` element in Big Shoulders Display, not outlines,
so it renders in a fallback face anywhere that font is not loaded. CRATON is set in the site's own display
face until the wordmark ships as paths or Big Shoulders is self-hosted.

### 6.5 · ALIDADE now reads as an MCP product

The console screenshots showed a browser app, which is no longer the whole story. `al-mcp-v4.jpg` is a new
composition in ALIDADE's own system: four callers (your agent, STARCHITECT, the ALIDADE console, your own
workflow) → the tool server with its six tool groups on the real teal glyphs → the run ledger with AUTO
and GATE rows and a scope denial. It leads the ALIDADE section on both pages; the console captures stay
as the supporting strip. Violet appears nowhere in it: in ALIDADE's system violet means partner and
consent, so it cannot be spent labelling a console.

### 6.6 · Sub-brand marks, and one that is missing

Footer platform links now carry their marks, and every showcase and platform section leads with the
platform's own mark or wordmark.

They stop there for a reason worth putting in writing: **STARCHITECT has no square monogram.** Its mark is
3.81:1 where ALIDADE's is 0.98:1 and CRATON's C is 1:1, so the three cannot sit together in a tight inline
row without either distorting one or padding it to near-invisibility. In the footer they are
height-normalised in a fixed box, which works because the list is stacked. For anything tighter — a
lifecycle row, a chip, a favicon set — STARCHITECT needs a compact monogram in the same family as the
other two. The `favicon.svg` in its asset folder is the HYPATIUS star-H, not a STARCHITECT mark.

### 6.7 · One thing to rule on before deploy

The CRATON handoff README opens: *"INTERNAL — NOT FOR EXTERNAL RELEASE. CRATON is internal until the CMPO
clears the name. Nothing in this bundle — mark, palette, wordmark, screens or copy — goes to ... a public
surface before that clearance."* The `tokens/craton.css` header says the same.

In practice that clearance looks given: craton-erp.us is live and public with the name, the mark and the
copy; you directed the corporate site to link to it; and you are the CMPO. But this package puts CRATON's
mark, palette, product screens and copy on hypati.us, which is exactly what that line governs — so it
should be an explicit call rather than an inherited assumption. If the answer is yes, the marking in the
handoff bundle and the token file is now stale and should be lifted so it stops contradicting the live site.

---

# §7 · v4.3 — the photography, and what it exposed

The twelve renders came back against the prompt pack and all eleven generation slots are filled. The images
are good and they land cleanly; there is very little to report about them as images. Two things are worth
writing down.

## 7.1 · The harness was not checking what I said it was checking

The prompt pack ends with an instruction I wrote to myself: *"Re-run the harness after swapping imagery. It
will catch a hero that has quietly broken contrast for the type sitting on it."*

It will not. `verify.mjs` measures contrast by walking up the ancestor chain and alpha-compositing the
**computed** CSS background colours. That is the correct method for type on a panel and it is what caught the
cobalt-on-raised-surface failure in v4.2. It is also completely blind to type on a photograph: the computed
background of the hero headline is `rgba(0,0,0,0)` all the way up to a `background-image`, which has no
colour to read. Every one of the twelve fields sits under type. The 96 checks passing after the swap told us
precisely nothing.

This is the more uncomfortable kind of gap — not a check that fails, a check that passes for the wrong
reason. It has been there since the harness was cloned from STARCHITECT, which means every hero on this site
and on starchitect.us has been nominally verified and actually unmeasured.

`verification/verify-imagery.mjs` closes it for hypati.us. It renders the page, screenshots it a second time
with the text set to `visibility:hidden` so the boxes contain ground and nothing else, samples the real
pixels in each headline's footprint, and takes the 95th-percentile luminance rather than the mean — a
headline is only as readable as its brightest patch of sky. Result: **32 checks, 0 failing, nothing within
25% of the floor**, worst case 6.28:1 on the method body against a 4.5 floor.

My first version of this harness sampled the drawn page and reported a uniform 1.00:1 across every white
headline, which looked like total catastrophe and was in fact the harness measuring the glyphs. Recording
that here because the failure mode is instructive: a contrast checker that samples inside a text box is
mostly sampling text.

**The same gap exists in the STARCHITECT harness** this one was cloned from, and by inheritance anywhere
else it went. That is not fixed by this package.

## 7.2 · Two placement calls that went against the obvious reading

**ALIDADE's field is mirrored.** Its showcase is `.plat--right`, and `.plat--right .plat__veil` runs a 270°
gradient that crushes the right edge to 94%. The render put its teal bathymetric contours centre-right —
exactly under that veil — leaving the open left as empty water. Mirrored, the contours sit in the 22% end
where they read and the quiet half sits under the card. Nothing in the frame is direction-dependent, so the
mirror costs nothing; the original is retained as the source.

**The two orbital renders swapped slots.** The obvious reading pairs the more dramatic frame with the hero.
But Slot 03 needs its weight in the right half, because at 1440px the headline, sub-paragraph, credential
line and two buttons occupy the left 46%; and Slot 10 needs a centred subject with margin on four sides,
because a wordmark composites over it afterwards. One render is right-weighted and the other is centred, so
they go the other way round.

Both calls are in `hypatius-website/APPLIED.md` and both are reversible in one line.

## 7.3 · Still open after v4.3

Unchanged from §6, none of these are affected by the imagery:

- **Slot 09 was never a render.** The five leadership portraits still differ in crop, colour temperature and
  background. The recipe is in the prompt pack; it needs a pass over the photographs, not a generator.
- The CRATON "INTERNAL — NOT FOR EXTERNAL RELEASE" clearance, §6.7. `craton-hero-2400.jpg` is now a second
  asset waiting on that call.
- STARCHITECT has no square monogram (3.81:1), which still blocks tight three-mark lockups.
- ALIDADE reads "Live" in four places.
- The MDO board PDFs in `site/docs/` still carry the old grey ink.
- No CRATON project exists on the HYPATIUS Vercel team; craton-erp.us deploys from an undocumented path.

---

# §8 · v4.4 — CRATON's dark mode, and the portraits

## 8.1 · The site was showing the exception as the rule

CRATON's prototype opens `<html lang="en" data-brand="craton" data-theme="dark">`, and `tokens/craton.css`
carries `[data-brand="craton"][data-theme="light"]` as an **override** of that default. Dark is the product.
The five captures on hypati.us were light, which is a factual misrepresentation of the thing being sold, not
a styling preference. Recaptured and shipped as `cr-*-v5.jpg`.

## 8.2 · The obvious solution was the wrong one, and the numbers say so

CRATON's tokens ship three palettes. The second is **Strata**, and its own comment reads *"corporate navy +
sandstone"*. Its values are the HYPATIUS corporate values, not approximations of them: `--bg-page` #060F1C,
`--surface-card` #0B1929, `--border-hairline` #22324C, `--text-display` #F2F6FA, `--accent-primary` #1A4FBA,
`--accent-link` #4FC3D9. Finding it felt like finding the answer pre-written.

It is the wrong answer for this job. Strata's page colour is *identical* to this site's page colour, so a
capture of the whole application would meet the page at **1.00:1** — a perfectly invisible edge. Strata is
designed for CRATON components rendered *inside* a HYPATIUS surface, where merging is exactly what you want.
A screenshot is an object and has to read as one.

CRATON's default **Bedrock** palette is 1.12:1 above the page at its ground and 1.27:1 at its card surfaces.
The value step the problem needed was already there, in the palette we were being asked to use anyway. It
also keeps the bronze, so the capture now agrees with the CRATON card, its tag colour and the bronze divider
band introduced in v4.3, instead of being the one element in that section speaking a different language.

Two things worth carrying forward from this:

1. **A palette named for integration is not automatically the right one for embedding.** Strata exists for
   a real purpose; it is just not this purpose. The check that caught it was measuring the contrast of the
   capture's outer edge against the host page — thirty seconds of arithmetic against a plausible-sounding
   design decision.
2. **Bedrock's warmth is a feature on this site, not a mismatch.** Its charcoal is warmer and lighter than
   the corporate navy, which is precisely why it separates.

## 8.3 · The portraits — parked, originals kept

Slot 09 was built, reviewed and **rejected**. The site keeps the five photographs it already had. Nothing
was ever written into the deploy folder — the staged files sat in `visuals/` precisely so this outcome cost
nothing — and `company.html` is unchanged, still pointing at `lead-stan.jpg`, `founder-james.jpg`,
`founder-jordan.png`, `founder-shawna.jpg` and `lead-maureen.jpg`. The staged folder has been removed so
nobody picks it up later by mistake.

The honest read: the treatment was not the problem. Two of the five sources were a composited cut-out and a
sepia snapshot of two people with a 152px face, and normalising a set to a common ground makes the weakest
frame *more* conspicuous, not less, because it removes every other difference that was hiding it. A
consistent set of five is only achievable from a consistent shoot. **The team is being re-photographed and
this slot is parked until then.**

Two things from the attempt are worth keeping:

**The component renders circles, not squares.** `.fnd__photo` is `border-radius:50%` at 64px on the home
row, 78px on the company cards and 120px on the lead card, and the CSS draws its own 1px border. The prompt
pack's "1px hairline at the crop edge" would be clipped away entirely. More usefully, it means the brief for
any future shoot is head-and-shoulders with the eyes on the upper third and nothing important in the
corners — the corners never appear. That correction is now in the prompt pack.

**Match faces against the existing site photographs rather than inferring them.** Two of my five first
guesses at who was who were wrong. One contact sheet settled it.

## 8.4 · Housekeeping found on the way

- The three `Downloads/exports 2|3|4` folders listed full handoff trees when connected and were empty six
  minutes later. The bundles they pointed at live **inside** the site folders
  (`hypatius-website/exports 2/hypatius-handoff-2026-09/`, and the same shape for the others), which is
  where I read them from.
- **The HYPATIUS handoff bundle already carries the v4.3 artwork** as PNG masters in
  `assets/imagery/artifacts/` — all twelve, under the same names this package uses. The design system and
  this build agree; nothing to reconcile.
- The live `hypatius-website` repo is still on `flagship-v6`. Nothing from v4 onward has been deployed,
  which is as intended.
- Still no STARCHITECT square monogram in `assets/brand/` — only mark and wordmark. Open item stands.
