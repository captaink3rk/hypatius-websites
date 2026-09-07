# STARCHITECT website — complete folder (rev 5, 2026-09-07)

Repo: captaink3rk/hypatius-websites → this folder is `starchitect-website/`
Vercel: hypatius / starchitect-website → Root Directory = `starchitect-website`

## Upload
1. Unzip. Open the `starchitect-website` folder and CONFIRM `assets/intro-sting-v2.mp4` (6.6 MB) is present before doing anything else.
2. On github.com/captaink3rk/hypatius-websites (repo root): Add file → Upload files → drag the whole `starchitect-website` folder onto the drop zone. Wait until every progress bar finishes, especially the video. Commit.
3. Check the repo shows `starchitect-website/index.html` (~2 KB), `starchitect-website/home.html` (~17 KB), and `starchitect-website/assets/intro-sting-v2.mp4`.
4. Vercel → Settings → General → Root Directory = `starchitect-website` → Save. Settings → Domains → add `starchitect.us` and `www.starchitect.us` if not listed. Vercel builds on the push automatically.

## Pages
- index.html — intro sting gate (site root). Plays assets/intro-sting-v2.mp4 once per session, Skip button, reduced-motion bypass, then → home.html.
- home.html — landing page (full scroll).
- platform / capabilities / use-cases / resilience / security / acquisition / resources / company .html — main routes (nav + footer injected by home-fx.js).
- a-*.html — deep-dive pages (platform, capabilities, use cases, about, glossary, press kit).
- home-a-watch / home-b-field / home-c-brief / home-command .html, evolve.html — design-direction variants kept for reference.
- intro-preview.html — plain player for the sting.

## Content state
- No VOSB / Veteran-Owned / VetCert language anywhere. Stamp: UEI UKELB3UV76V6 · CAGE 19S89.
- Corporate links → https://hypati.us. ALIDADE cards → https://alidade.us.
- Briefing form is a front-end mock — wire to CRM/email before relying on it.
- Fonts (Bebas Neue, Rajdhani, IBM Plex Mono) load from Google Fonts.

© 2026 HYPATIUS LLC. STARCHITECT is a HYPATIUS platform.

