HYPATIUS corporate website — hypati.us
Deploy folder: hypatius-website/   (Vercel Root Directory must equal this name)
Built 2026-09-07 from the HYPATIUS Design System project.

WHAT CHANGED IN THIS BUILD
- Corporate-rules scrub (Stan / Jim, Sep 5-7 2026): every VOSB / SDVOSB / "veteran-owned" claim removed.
  Replacement language: "small business · non-traditional defense contractor". Stamp: UEI UKELB3UV76V6 · CAGE 19S89.
- vosb-badge.png removed from site/img; the Contracting block is now a text-only stamp.
- Home page is home.html (was "HYPATIUS Flagship.html"). index.html is the intro-sting gate
  (once per session, Skip button, reduced-motion bypass, 11 s hard ceiling) -> home.html.
  Sting file: site/video/hypatius-intro-sting-v2.mp4 (faded master, 2026-09-07).
- News: /news/stanley-kennedy-ceo  (rewrite -> news-stanley-kennedy-ceo.html). Kennedy CEO release, 08 Sep 2026.
- Platform tiles on home link out to https://starchitect.us and https://alidade.us.
- LinkedIn icon in every footer -> https://www.linkedin.com/company/hypatius-hq
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
4. Check https://hypati.us footer reads "© 2026 HYPATIUS LLC · UEI UKELB3UV76V6 · CAGE 19S89".

PAGES
index.html (gate) · home.html · platforms.html · company.html · careers.html · insights.html · news-stanley-kennedy-ceo.html
