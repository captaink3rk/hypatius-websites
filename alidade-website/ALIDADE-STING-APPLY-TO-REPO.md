# alidade.us — the intro sting, and exactly what to commit

**19 September 2026 · HYPATIUS Design System · ALIDADE tier · rev 2**

> **rev 2 — the stutter is fixed.** The first cut was screen-recorded and the recorder
> duplicated frames whenever the page missed a paint. Rebuilt with a virtual clock instead:
> **jitter 0.792 → 0.125**, near-identical frames **16.1% → 0.0%**. Filenames are now `-v2`;
> **do not commit the `-v1` files.** Detail in §1.

---

## 0 · What I could and could not do

You asked me to update the repo and put these on the live sites. **I cannot push from
here.** Not a policy choice on my part — there is no path:

| Route | State |
|---|---|
| **Forge** (`mynas…:3300`, Forgejo) | Not linked to your account in this session — `forge_whoami` says so. And even linked, the connector is **read-only for writes**: it has no push, merge, branch or delete tool. It can read files and open an issue or a comment, nothing else. |
| **GitHub** (`captaink3rk/hypatius-websites`, what Vercel actually builds) | No `gh`, no credentials, no remote. Cannot clone or push. |
| **Vercel** | I *can* see the team and the three projects — `starchitect-website`, `alidade-website`, `hypatius-website` — and I could push a deployment directly. **I have not.** Your own `README.txt` says it: a direct deploy bypasses git and is overwritten by the next push unless the repo is updated too. That produces a live site nobody can reproduce. |

So this folder is a **drop-in**: every file in its final path, every edit already applied
to a copy of `index.html`, and the diff written out below. Copy, commit, done.

If you want me to go further, two things unlock it, in order of how much I'd recommend them:

1. **Link the Forge** (`forge_link_start` gives you a one-time page to paste a token into —
   it never enters the chat). That still will not let me push, but it lets me **read the
   live repo** and write this diff against what is actually there rather than against my
   working copy, and open the PR description as an issue.
2. **Say the word on Vercel** and I will deploy `alidade-website/` to a **preview** URL so
   you can see it running before anything is committed. Preview, not production — and the
   repo still needs the commit afterwards.

**No craton sting arrived.** Only `ALIDADE-LogoSting-Wide.html` is attached to this
conversation. Send the CRATON one and it gets the same treatment in one pass — the
pipeline below is now written and reusable.

---

## 1 · What the source file was, and what I did with it

`ALIDADE-LogoSting-Wide.html` is not a video. It is a 2.2 MB self-unpacking bundle — the
same format as the craton-erp.us pages — that animates in the browser: a bearing ring fades
up, the sweep rotates, the crystalline **A** resolves at centre, then ALIDADE, then
*HYPATIUS CAPTURE INTELLIGENCE*, then *We do not guess. We engineer the win.*, then it
**loops forever**.

Three reasons it cannot ship as-is:

- **It loops.** An intro that never ends is not an intro.
- **2.2 MB with 40 inlined `@font-face` rules**, on a site whose whole v3 pass was about
  weight and legibility. The encoded video is **1.1 MB** and caches.
- **No poster, no reduced-motion path, no skip, no once-per-session.**

So it was rendered frame by frame and cut to one clean cycle: **8.00 s · 1920×1080 ·
30 fps · 713 KB**, plus a 261 KB VP9 and a poster frame.

### The stutter, what it actually was, and how it is gone

The first cut was made with Playwright's video recorder. Everything measurable about that
file was right — 1920×1080, correct duration, container timestamps a perfect 33.33 ms
apart — and it stuttered anyway, because **none of those is a measurement of motion**.

What a screen recorder does when the page misses a paint is write the *previous* frame
again. The file stays constant-rate; the content does not. Measured on that cut:

| | v1 · screen-recorded | v2 · clock-driven |
|---|---|---|
| **Jitter** (frame-to-frame change in motion magnitude, over mean motion) | **0.792** | **0.125** |
| Near-identical frames | 16.1% | **0.0%** |
| Longest freeze | 8 frames · 270 ms | none |

**The fix was to stop sampling a clock I do not control and become the clock.**
`tools/render-sting.mjs` replaces `performance.now`, `Date.now`,
`requestAnimationFrame`, `setTimeout` and `setInterval` before any page script runs, then
steps that virtual clock by exactly one frame interval and screenshots. The animation
advances one frame per step no matter how long the capture takes, so every frame is
rendered and none is repeated. 510 frames rendered, 510 unique, zero consecutive
duplicates.

Two things fell out of doing it properly:

- **The loop is 8.00 s, not 9.68 s.** The earlier figure came from finding cycle
  boundaries in a noisy recording. With clean frames the restarts are exactly 240 frames
  apart at 30 fps. The delivered cut is tighter and has no dead tail.
- **30 fps, not 25.** Matches the hypati.us sting, and there is no recorder dictating the
  rate any more.

Also still true, and worth keeping in your notes: Playwright's recorder **silently drops
the bottom 87 rows** of whatever it records and pads them grey — constant 87, at every
viewport height tested. That was the grey band on the first attempt. It no longer applies
here, because nothing is recorded, but it will apply to anything else captured that way.

---

## 2 · The design decision worth your attention

**It is an overlay on the real page, not a gate page.**

hypati.us puts its sting at `index.html` and redirects to `home.html` when it ends — so
`/` is a JavaScript redirect. That is the same condition the craton-erp.us prerender pass
exists to remove: anything that does not run scripts gets a stub instead of the page.
alidade.us is a single page at `/` and **the only site in the portfolio actually deployed**.
Spending its front door on an animation is a bad trade.

So `/` always serves the real page and the sting is drawn on top of it. The load-bearing
line is `#al-sting { display: none }` in the stylesheet — only `alidade-sting-v1.js` ever
sets `.is-on`, so with JavaScript off the overlay renders nothing and there is no black box
to strip. No new URL, no second canonical, no sitemap entry, no redirect.

**This is the pattern I'd use on craton-erp.us too**, and it replaces §5 of the CRATON
sting brief, which assumed the hypati.us gate.

### One brand question, for you not me

The wordmark in the sting renders **violet, `#797EDA`**. The crystalline A is iridescent —
teal through violet to bone — and the wordmark picks that up. It measures **5.35:1** on the
page colour, so it passes AA comfortably; this is not a legibility problem. But the ALIDADE
standard reserves violet (`#B499E0`) for **partner and consent**, and the wordmark on
alidade.us itself is teal and bone. Left exactly as delivered. Say if it should be retimed
to teal and I will re-render.

---

## 3 · The diff

Four new files, two edits. Nothing existing is overwritten.

```
alidade-website/
  assets/video/alidade-intro-sting-v2.mp4     NEW   713 KB   H.264, 8.00s, 30fps
  assets/video/alidade-intro-sting-v2.webm    NEW   261 KB   VP9 fallback
  assets/img/alidade-intro-poster-v2.jpg      NEW    89 KB   final frame
  js/alidade-sting-v1.js                      NEW   4.1 KB
  css/alidade-v3.css                          EDIT  +1 block, §9, appended
  index.html                                  EDIT  +2 blocks
```

**`index.html` — immediately after `<body>`, before the skip link:**

```html
<div id="al-sting" aria-hidden="true">
  <video poster="assets/img/alidade-intro-poster-v2.jpg" muted playsinline preload="none">
    <source data-src="assets/video/alidade-intro-sting-v2.mp4"  type="video/mp4">
    <source data-src="assets/video/alidade-intro-sting-v2.webm" type="video/webm">
  </video>
  <a class="al-sting__skip" href="#main">Skip intro</a>
</div>
```

**`index.html` — last line before `</body>`:**

```html
<script src="js/alidade-sting-v1.js" defer></script>
```

`data-src` rather than `src` is deliberate: the sources are promoted by the script, so
nothing downloads for a visitor who has reduced motion set, has already seen it this
session, or has scripts off.

**Immutable-cache rule observed** — every media filename carries `-v2`. The `-v1` files
from the first delivery are the stuttering ones and are **not** in this bundle; if you
already committed them, `-v2` supersedes without a cache collision and `-v1` can be
deleted. `alidade-sting-v1.js` keeps its name because its contents changed but its
behaviour did not.

---

## 4 · Verification

Two harnesses, both new.

`verification/verify-sting.mjs` — **16 checks, 0 failing** — covers the four paths and both
encodings:

| Path | Asserted |
|---|---|
| JS on, first visit | overlay shown, scroll locked, video requested, skip control ≥ 44px |
| **JS off** | overlay **not rendered**, video **not requested**, 1,771 words of copy intact, scroll not locked |
| `prefers-reduced-motion` | overlay removed, video never fetched |
| Second visit, same session | overlay removed |

`sting/tools/check-smoothness.mjs` — **new, and the one that would have caught this** —
measures the motion rather than the container. Duration, dimensions and timestamps were all
correct on the file that stuttered; this measures frame-to-frame motion jitter, near-identical
frames and mid-clip freezes, and it fails the old cut and passes the new one:

```
  ✓ alidade-intro-sting-v2.mp4   jitter 0.125 · near-identical 0.0% · no mid-clip freeze
  ✓ alidade-intro-sting-v2.webm  jitter 0.164 · near-identical 1.7% · longest freeze 3
  ✕ alidade-intro-sting-v1.mp4   jitter 0.792 · near-identical 10.0%
  ✕ alidade-intro-sting-v1.webm  jitter 0.813 · near-identical  9.1%
```

It knows that a hold at either END of a clip is a beat, not a stall — a logo resolve is
supposed to settle — so only freezes in the middle count. Making it strict about that first
had it arguing for chopping the settle off a correct animation, which is the tool wagging
the design.

The existing two still pass unchanged: `verify-site.mjs` **16/0**, `verify-site-imagery.mjs`
**10/0**. ALIDADE now runs **42 page checks plus the media check**.

Run all four before this ships:

```
node verification/verify-site.mjs
node verification/verify-site-imagery.mjs
node verification/verify-sting.mjs
node sting/tools/check-smoothness.mjs alidade-website/assets/video/*
```

### One thing the harness taught me that is not about ALIDADE

This Chromium has **no H.264 decoder** — `canPlayType('video/mp4; codecs="avc1…"')` returns
empty. The first end-to-end test therefore reported "dismisses immediately" on an asset that
is perfectly fine, and the honest fix was to ship the VP9 alongside rather than to trust the
MP4 blind. Worth knowing: **the hypati.us and STARCHITECT stings are H.264-only.** They play
everywhere that matters, but nothing in this workspace can verify them, and neither has a
second source.

---

## 5 · Deploy

Vercel builds `alidade-website` from `captaink3rk/hypatius-websites`. Commit the six paths
above, push, let it build, then confirm on the live page:

1. First load plays the sting once; reload in the same tab does not.
2. `Skip intro` is visible, clickable, and Esc works.
3. With JavaScript disabled in devtools, the page renders normally and **no request is made
   for the video**.
4. `view-source:https://alidade.us/` still shows the full page copy — no redirect, no stub.

---

**HYPATIUS, LLC · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89**
