HYPATIUS corporate website — hypati.us
Deploy folder: hypatius-website/   (Vercel Root Directory must equal this name)
Built 2026-09-07 from the HYPATIUS Design System project. v3 pass 2026-09-16 (see APPLIED.md for every edit).

WHAT CHANGED IN v3 (16 Sep 2026) — the parent-brand pass
- Entity is "HYPATIUS, LLC" (with the comma) in every footer, hero, meta and JSON-LD. Footer check below updated.
- Hierarchy strip under the home hero: HYPATIUS, LLC as parent; STARCHITECT, ALIDADE, CRATON as its platforms, each with its
  locked accent (gold / teal / bronze), its status as a mark and a word, and its own site. CRATON links to https://craton.us.
- craton.us is linked everywhere the other two sites are: hierarchy strip, CRATON showcase, tiles, stack, Platforms page CTA, all footers.
  vercel.json adds committed redirects /starchitect -> starchitect.us, /alidade -> alidade.us, /craton -> craton.us.
- STARCHITECT copy and imagery updated to the v9 FUSION console: st-ops-console-v9.jpg as the showcase and detail media,
  three v9 captures (readiness hub, white cell, after action) on Platforms. Wordmark re-exported at 1600 px (was 6718 px, 1.6 MB).
- ALIDADE copy rewritten to the v2 positioning: capture decision intelligence, seven cited factors, three bands, teaming on
  consent, run ledger, delivered as an MCP tool server. Neo4j and "double-blind" retired from marketing copy. Real ALIDADE mark
  (256/512 px) and wordmark replace the 4.4 MB alidade-a.png. Three v2 product captures on Platforms. plat-alidade-v3.jpg is the
  approved maritime hero without the baked wordmark.
- CRATON: "Deterministic ERP and CRM"; roadmap copy written "at launch"; bronze accent from the CRATON Bedrock tokens; status badge
  is mark + word, not gold.
- Leadership titles: Jordan Broe, Co-Founder & Chief Marketing & Product Officer; Shawna LeMieux, Chief of Staff;
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
