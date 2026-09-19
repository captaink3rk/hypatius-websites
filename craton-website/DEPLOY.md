# CRATON — deploy folder

**19 September 2026 · complete, verified, ready to serve**

This folder **is** the site root. Serve it as-is at `craton-erp.us`, or commit it over
`craton-website/dist/` in `captaink3rk/hypatius-websites`.

```
node build.js --check   →  PASS (9/9 pages)
unresolved references   →  none
64 files
```

## Why the sting wasn't showing

It was never going to appear at `craton-erp.us/`. The gate lives at its own URL by design — `/` stays
static and prerendered so the crawler, the unfurler and the answer engine never meet a JavaScript
redirect at the front door. **The sting is at `/intro`.**

Your push worked, by the way: `intro.html` and the poster came back down when I pulled the repo. The
problem was never the sting — it was that the deploy root is pointed at `craton-website/`, the source
folder, rather than `craton-website/dist/`. The live root still serves the self-unpacking bundle
(`craton-erp.us/` returns a body reading `C Unpacking…`), which means the whole prerender pass is not
live either.

## Four things that were broken, now fixed

**1 · `dist/` had never been through `build.js`.** The committed `index.html` still carried nine
`data-screen-label` attributes and the review-chrome comments. `--check` would have refused it.
All nine pages are now the real stripped output.

**2 · Every page was missing its structured data.** `application/ld+json` was absent from all eight
CRATON pages — the authoring comment in `index.html` describes it in detail, so the bundling pass
appears to have eaten it. Restored to that comment's spec: Organization + SoftwareApplication on the
home page, `WebPage` (or `ContactPage` for the walkthrough) plus the same two on the rest. **No
`AggregateRating`, no `Review`, no `offers`** — rules 7 and 9. Every description is your own existing
meta text, not new copy.

**3 · `og.png` was referenced by all nine pages and did not exist.** Every social share was a broken
image. Generated at 1200×630 from the sting's own plate frame and the shipped lockup — the left-weighted
composition the plate was framed for in the first place.

**4 · There was no `vercel.json`, so `cleanUrls` was off.** Your sitemap advertises `/binder`,
`/hours`, `/rates` and five more as extensionless URLs; without `cleanUrls` every one of them 404s.
Added, modelled on `alidade-website/vercel.json`, plus an immutable cache header for `/assets/` and
`/css/`.

## The domain question is settled

`hypatius-corporate-website/vercel.json` contains:

```json
{ "source": "/craton", "destination": "https://craton-erp.us", "permanent": true }
```

So **craton-erp.us is canonical** and `hypati.us/craton` is a permanent redirect *to* it. That means
the source `craton-website/sitemap.xml` and `robots.txt` — which describe CRATON as a section of
hypati.us and list eight `hypati.us/craton` URLs — are advertising addresses that 301 away. Worse,
`build.js` copies both files into `dist/` on every build, so a rebuild would overwrite the correct
craton-erp.us pair with the wrong one.

**The `robots.txt` and `sitemap.xml` in this folder are the craton-erp.us versions and are correct.**
Before your next `node build.js`, replace the source copies at `craton-website/robots.txt` and
`craton-website/sitemap.xml` with these two files, or the build will undo them.

`robots.txt` also now carries `Disallow: /intro`, and the gate is deliberately absent from
`sitemap.xml`.

## The one thing I could not do

**The plate is 17.6 MB.** It came off the generator at that size and I have no encoder available, so it
ships as-is. It is the single heaviest thing in the folder by a factor of nine and I would not deploy
it without this:

```sh
ffmpeg -i assets/video/craton-intro-plate-v1.mp4 \
  -vf fps=24 -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart \
  assets/video/craton-intro-plate-v1.mp4
```

Usually lands under 4 MB with no visible loss, and conforms the frame rate to 24 at the same time —
the file is not natively 24fps yet. The poster is a 1.9 MB PNG; as an 82-quality JPEG it drops under
200 KB (update the `poster` attribute and the ld+json `thumbnailUrl` if you swap it).

**Optional, and it removes a real caveat:** the sting composites in the browser — plate underneath,
alpha resolve overlaid at 3.60s at `0.75×`. Nothing was re-encoded, so the mark stays vector-crisp,
but **Safari does not reliably decode VP9 alpha WebM**. On a decode failure `intro.html` fades in the
lockup as inline SVG instead: same final frame, no motion on the mark. Flattening ends that:

```sh
ffmpeg -i assets/video/cr-mark-resolve-alpha.webm \
  -vf "setpts=PTS/0.75" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 20 resolve-6s.webm

ffmpeg -i assets/video/craton-intro-plate-v1.mp4 -i resolve-6s.webm \
  -filter_complex "[0:v]fps=24,fade=t=in:st=0:d=0.8[bg];[bg][1:v]overlay=0:0:enable='gte(t,3.6)'" \
  -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart craton-intro-sting-v1.mp4
```

Then point `#plate` at the flat file and delete the `#mark` element and the `alphaOk` branch.

## How the sting behaves

| | |
|---|---|
| 0.00–0.80s | Fades up from black; the core sample emerges. |
| 0.80–3.60s | Plate alone, camera climbing. |
| 3.60–9.66s | Mark resolve — strata close into the C, hand off to the shield, wordmark sets. |
| 9.66–10.04s | Holds on the lockup. |
| then | Cross-fades into the landing page, preloaded behind it (1100ms). |

Once per session (`sessionStorage`), Skip control, `prefers-reduced-motion` skips straight through,
and it bails to the home page on a video error, an autoplay refusal or a 12s timeout. Esc or Enter
skips. Silent. Preview it without being bounced onward at `/intro?stay`.

## Contents

```
index.html  hours.html  codes.html  rates.html  binder.html
record.html  compare.html  walkthrough.html      the eight prerendered pages
intro.html                                        the sting gate
og.png                                            1200×630 social card
robots.txt  sitemap.xml  vercel.json               craton-erp.us, cleanUrls on
css/craton.css  css/craton-v2.css
assets/fonts/   26 files
assets/img/     20 files (19 existing + the sting poster)
assets/video/   2 files (plate + alpha resolve)
```

## Still open — brand, not deploy

- **The mark in the family.** CRATON is the only one of the three stings carrying a mark; HYPATIUS and
  STARCHITECT are wordmark-only. Either they get one on their next pass, or CRATON is deliberately the
  odd one — it needs writing into the brand-hierarchy card either way.
- **Nine of the ten lockups are missing.** The standard lists primary, tagline, plain, stacked and
  monogram, each dark and light. Only primary-dark exists.
- Those four committed brand SVGs are 8.1–8.5 KB each because they carry C2PA provenance manifests in
  a `<metadata>` block — roughly 20× their geometry. A one-line strip if you want it; changes nothing
  about how they render.

---

**CRATON · internal — not for external release**
HYPATIUS, LLC · UEI UKELB3UV76V6 · CAGE 19S89
