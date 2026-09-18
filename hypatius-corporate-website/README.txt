HYPATIUS corporate website — hypati.us
Deploy folder: hypatius-website/   (Vercel Root Directory must equal this name)
Built 2026-09-07 from the HYPATIUS Design System project. v3 pass 2026-09-16; v4 narrative pass 2026-09-18.
See APPLIED.md for every edit.

WHAT CHANGED IN v4 (18 Sep 2026) - the narrative pass
- Home and Platforms rebuilt on one thesis: "Decide it. Prove it. Account for it." Hero line is now
  "Accountable automation for defense." New sections: the problem (three reviewers), the lifecycle loop,
  the record (run receipt + the fourteen SF 1408 areas), the method. #capabilities folded into the method.
  Nav: Platforms / The record / Method / Company / News.
- CRATON corrected end to end: DCAA-ready timekeeping, charge codes, indirect rate pools and the SF 1408
  binder - not "deterministic ERP and CRM". Real monogram added (craton-mark-v3.svg, vector paths from
  craton-erp.us). Rocket-launch photo replaced with plat-craton-v3.jpg, a bedrock-strata composition.
- shield.jpg was still the Vision background and carries a baked-in HYPATIUS wordmark; swapped to
  why-shield.jpg. The home hero and the STARCHITECT showcase were the same photograph; STARCHITECT now
  uses orbital-dawn-wide.jpg and the news card takes platforms-hero-v2.jpg.
- Accessibility: added --accent-link-raised (#5A92E0). cobalt-400 only clears AA on the darkest surface,
  so eyebrows on raised panels were failing. Push this back into the token layer when it next opens.
- flagship-v6.css/.js renamed to flagship-v7.css/.js per the immutable-cache rule.
- NOTE: the hero headline lives in BOTH home.html and flagship-v7.js (the HEADLINES object re-renders it
  on load). Change both, or collapse them to one source.

WHAT CHANGED IN v3 (16 Sep 2026) — the parent-brand pass
- Entity is "HYPATIUS, LLC" (with the comma) in every footer, hero, meta and JSON-LD. Footer check below updated.
- Hierarchy strip under the home hero: HYPATIUS, LLC as parent; STARCHITECT, ALIDADE, CRATON as its platforms, each with its
  locked accent (gold / teal / bronze), its status as a mark and a word, and its own site. CRATON links to https://craton-erp.us.
- craton-erp.us is linked everywhere the other two sites are: hierarchy strip, CRATON showcase, tiles, stack, Platforms page CTA, all footers.
  vercel.json adds committed redirects /starchitect -> starchitect.us, /alidade -> alidade.us, /craton -> craton-erp.us.
- STARCHITECT copy and imagery updated to the v9 FUSION console: st-ops-console-v9.jpg as the showcase and detail media,
  three v9 captures (readiness hub, white cell, after action) on Platforms. Wordmark re-exported at 1600 px (was 6718 px, 1.6 MB).
- ALIDADE copy rewritten to the v2 positioning: capture decision intelligence, seven cited factors, three bands, teaming on
  consent, run ledger, delivered as an MCP tool server. Neo4j and "double-blind" retired from marketing copy. Real ALIDADE mark
  (256/512 px) and wordmark replace the 4.4 MB alidade-a.png. Three v2 product captures on Platforms. plat-alidade-v3.jpg is the
  approved maritime hero without the baked wordmark.
- CRATON: "Deterministic ERP and CRM"; roadmap copy written "at launch"; bronze accent from the CRATON Bedrock tokens; status badge
  is mark + word, not gold.
- Leadership titles: Jordan Broe, Co-Founder & Chief Marketing & Product Officer;
  Maureen O'Brien, Executive Advisor & Board Member. Order unchanged: Kennedy, LeMieux, Broe, LeMieux, O'Brien.
- Claims: proof lines under the three manifesto stats (870K carries [pending data] until the repo count is confirmed; <500 ms is
  labelled a design target). "$700B+ federal market" ticker item removed (uncited). "FedRAMP-ready" -> "FedRAMP pathway".
- Fonts self-hosted from /site/fonts/ (tokens/fonts.css). Zero third-party requests on every page.
- SEO: canonical + Open Graph on every page, Organization JSON-LD with the three brands on home, sitemap.xml, robots.txt.
- Accessibility: skip link, 44 px targets on nav/footer/PDF links, 10 px type floor (incl. the MDO boards, whose grey ink moved
  #6B7588 -> #8A94A8 for AA), visible focus, reduced-motion respected. verification/verify.mjs: 96 checks at 1440 and 390, 0 failing.
- Immutable-cache rule honoured: flagship-v5.css/.js -> flagship-v6.css/.js; every new or replaced image carries -v3 or -v9/-v2.

WHAT CHANGED IN THIS BUILD
- Corporate-rules scrub (Stan / Jim, Sep 5-7 2026): every ownership-certification claim removed.
  Replacement language: "small business · non-traditional defense contractor". Stamp: UEI UKELB3UV76V6 · CAGE 19S89.
- The retired ownership badge PNG was removed from site/img; the Contracting block is now a text-only stamp.
- Home page is home.html (was "HYPATIUS Flagship.html"). index.html is the intro-sting gate
  (once per session, Skip button, reduced-motion bypass, 11 s hard ceiling) -> home.html.
  Sting file: site/video/hypatius-intro-sting-v2.mp4 (faded master, 2026-09-07).
- News: /news/stanley-kennedy-ceo  (rewrite -> news-stanley-kennedy-ceo.html). Kennedy CEO release, 08 Sep 2026.
- Platform tiles on home link out to https://starchitect.us and https://alidade.us.
- LinkedIn icon in every footer -> https://www.linkedin.com/company/hypatius-hq
- Hybrid MDO: a responsive v2 master-flow diagram (edge → hybrid → core → BMC3I return by threat level) on home and Platforms; Platforms also carries the Latency-curve and Domain-lanes boards. Print PDFs of all three in site/docs/.
- Careers shelved: page removed, all links dropped, Company page careers block and form option removed.
- Insights tab replaced by News (news.html); Kennedy release is the first item. Footer links updated.
- Assets under /site/ are immutable-cached for a year: flagship.css/.js renamed to flagship-v5.css/.js so the new MDO styles load. ALWAYS rename an asset you replace (e.g. -v6) instead of overwriting.
- Rev 5.3: Stan Kennedy bio on Company replaced with a condensed version of his own bio (Oakman/Redwire, AIAA, SFCC, ITAC-1, degrees); removed unsourced "three decades"/"USAF veteran" claims.
- Rev 5.2: Tweaks review panel markup removed from all shipped pages; Platforms mobile drawer now includes News.
- vercel.json: cleanUrls, no trailing slash, immutable cache on /site/*.
- Hero imagery: every file with a baked-in HYPATIUS wordmark was retired. Replacements carry a -v2 suffix
  (hero-orbital-v2, hero-maritime-v2, platforms-hero-v2, beam-divider-v2, cta-v2). Only clean, text-free heroes ship.

IMMUTABLE CACHE RULE
Anything under /site/ is cached for a year. If you replace an image or video, RENAME it (e.g. hero-orbital-v2.jpg)
and update the reference — never overwrite the same filename.

DEPLOY STEPS
1. github.com/captaink3rk/hypatius-websites -> Add file -> Upload files -> drag this whole folder -> wait for every
   progress bar (the intro video is large) -> Commit.
2. Vercel -> hypatius-website -> Settings -> Git: connect to captaink3rk/hypatius-websites if not already.
   Settings -> General -> Root Directory = hypatius-website -> Save. Settings -> Domains: confirm hypati.us + www.
3. Deployments -> redeploy the NEWEST commit (or edit this README on GitHub to fire the webhook).
4. Check https://hypati.us footer reads "© 2026 HYPATIUS, LLC · UEI UKELB3UV76V6 · CAGE 19S89".

PAGES
index.html (gate) · home.html · platforms.html · company.html · news.html · news-stanley-kennedy-ceo.html
(insights.html and careers.html are shelved in the source project under _shelved/ — not deployed; no page links to them)

WHAT CHANGED IN v4.1 (18 Sep 2026)
- CRATON's domain is https://craton-erp.us (the original craton.us could not be acquired). Every link, the /craton redirect in
  vercel.json, the JSON-LD sameAs and brand URL, and all five footers updated. Verified live.
- Shawna LeMieux is Chief of Staff (the v4 package briefly had Chief Operating Officer). Corrected.

WHAT CHANGED IN v4.2 (18 Sep 2026)
- Titles: Stan Kennedy = Co-Founder & Chief Executive Officer (bio states co-founder); Jordan Broe =
  Co-Founder & Chief Mission & Product Officer (CMPO is Mission, not Marketing); Shawna LeMieux =
  Chief of Staff / Business Operations.
- FIXED, and these were regressions from v4: footer columns had collapsed into one run-on line because
  the 44px-target rule set display:inline-flex on stacked links; the STARCHITECT wordmark ran 57px under
  the console capture; ~300px of dead field sat between the manifesto and the lifecycle.
- Brand standards applied: eyebrows are aqua, not cobalt (corporate standard: cobalt on dark is a surface,
  not text, at 2.63:1); measure is 1280px per the standard, was 1400.
- CRATON shows its own product: binder, record and rates captured from the prototype. Official marks from
  the CRATON handoff bundle replace the extracted one. The CRATON wordmark SVG is NOT used - it is a text
  element in Big Shoulders Display, not outlines, so it falls back anywhere that face is absent.
- ALIDADE leads with an MCP topology graphic (al-mcp-v4.jpg) rather than a console screenshot.
- Footer platform links carry their marks. NOTE: STARCHITECT has no square monogram (its mark is 3.81:1),
  which is why the three marks only appear together in the stacked footer and not in tighter lockups.

────────────────────────────────────────────────────────────────────────────────
v4.3 · 18 Sep 2026 · commissioned photography
────────────────────────────────────────────────────────────────────────────────
- Twelve generated fields replace every interim and borrowed image on the home
  page. Eleven land in this folder; craton-hero-2400.jpg ships loose in
  visuals/craton-hero/ because craton-erp.us deploys from outside this package.
- IMMUTABLE CACHE, AGAIN: every one is a new filename. Nothing under /site/ was
  overwritten. The superseded files are still on disk and still cached; they are
  simply no longer referenced. intro-poster-v3.jpg is the one that stays in use,
  as the intro video's poster frame on index.html.
- New on the page: three .pdiv accent bands (gold, teal, bronze) announcing each
  platform in turn, and photographic fields behind #record and the method, which
  were both flat navy.
- plat-alidade-v4.jpg is mirrored from the render. ALIDADE's card sits right
  under a 94% veil and the contours came back on that same side; mirroring moves
  them to the open end. See APPLIED.md for why this costs nothing.
- NEW HARNESS: verification/verify-imagery.mjs. verify.mjs cannot see photographs
  - it composites computed CSS backgrounds, and a background-image has no colour
  to read, so type over a photo passes trivially and meaninglessly. The new one
  screenshots the page with the text hidden and measures the actual pixels.
  Run BOTH before shipping any imagery change:
      node verification/verify.mjs          -> 96 checks, 0 failing
      node verification/verify-imagery.mjs  -> 32 checks, 0 failing
  The second one needs pngjs alongside playwright.
- If you ever lighten a veil on .record, .method-band or a .plat, re-run the
  imagery harness. The AA margin on those bands is deliberate, not incidental.

────────────────────────────────────────────────────────────────────────────────
v4.4 · 18 Sep 2026 · CRATON in dark mode
────────────────────────────────────────────────────────────────────────────────
- CRATON's prototype is <html data-theme="dark">. Dark is the DEFAULT; light is
  the override. The site was showing the override. Recaptured: cr-*-v5.jpg.
- DO NOT "fix" dark-on-dark by switching the capture to CRATON's Strata palette.
  Strata's --bg-page is #060F1C, identical to this site's page, so the capture
  edge measures 1.00:1 and disappears. Strata is for CRATON components embedded
  in a HYPATIUS surface, not for screenshots. Bedrock (the default) is already
  1.12:1 above the page and needs only an edge.
- That edge is a 1px hairline plus a 2px bronze top rule, which is CRATON's own
  .cr-card--hi motif from its tokens - not something invented here.
- The CRATON shot strip no longer sits on a light card. The captures are dark now.
- Leadership portraits: NO CHANGE. Slot 09 was tried and rejected; company.html
  still points at the original five photographs and nothing was added to
  site/img/. Parked until the team is re-shot. Note for that shoot: .fnd__photo
  is border-radius:50% - these render as CIRCLES at 64/78/120px and the CSS
  draws its own border, so brief for head-and-shoulders with the eyes on the
  upper third and nothing important in the corners.
