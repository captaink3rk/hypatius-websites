# STARCHITECT — Website · deploy package 2026-09-07 (rev 4)

Static multi-page site. No build step.

## What changed in rev 4
- **The intro sting is now the site root.** `index.html` = the 8-second gate (plays `assets/intro-sting-v2.mp4` once per session, Skip button, reduced-motion bypass, hard 11 s ceiling), then hands off to `home.html`. Repeat visitors in the same session go straight to `home.html`.
- The former `index.html` landing page is now `home.html`; every internal link, nav logo, "Request briefing" CTA, footer, and `home-fx.js` route repointed.
- `assets/intro-sting-v2.mp4` — the final sting file (6.5 MB). **This file was missing from the repo last time** (only PNGs made it into `assets/`). See the push note below.
- Carries forward from rev 3: VOSB scrub, hypati.us / alidade.us links, `vercel.json` clean URLs.

## Push to the linked repo (captaink3rk/hypatius-starchitect-website)
Replace the contents of `starchitect-site-2026-09-07/` in the repo with this folder, then:

    git add -A
    git add -f starchitect-site-2026-09-07/assets/intro-sting-v2.mp4
    git status            # confirm the .mp4 is listed as a new file
    git commit -m "rev 4: intro sting at root, home.html landing"
    git push

`-f` forces the video past any global .gitignore that excludes media. If `git status` still doesn't list the .mp4, run `git check-ignore -v starchitect-site-2026-09-07/assets/intro-sting-v2.mp4` to see which rule is blocking it. GitHub's per-file limit is 100 MB, so no LFS needed.

Vercel deploys automatically on push (Root Directory is set to `starchitect-site-2026-09-07`).

## Verify after deploy
- https://starchitect.us → black frame, sting plays, lands on the home page.
- Hard-refresh or open a private window to defeat the once-per-session flag.
- https://starchitect.us/assets/intro-sting-v2.mp4 → should download / play (200, not 404).

## Notes
- Briefing form is a front-end mock — wire it to your CRM/email endpoint before relying on it.
- Fonts (Bebas Neue, Rajdhani, IBM Plex Mono) load from Google Fonts.
- © 2026 HYPATIUS LLC. STARCHITECT is a HYPATIUS platform.
