# CRATON intro sting — repo update

**19 September 2026 · adds the approved intro gate to `craton-website/`**

Five files, no changes to anything that already exists. Merge the folder over
`craton-website/` and the paths line up.

```
craton-website/intro.html                                   NEW  (source page)
craton-website/dist/intro.html                              NEW  (built output)
craton-website/dist/assets/video/craton-intro-plate-v1.mp4  NEW  17.6 MB
craton-website/dist/assets/video/cr-mark-resolve-alpha.webm NEW  65 KB
craton-website/dist/assets/img/intro-poster-craton-v1.png   NEW  1.9 MB
```

`dist/intro.html` is the output of your own `build.js` strip rules applied to the source page — I ran
them rather than hand-writing it, so a rebuild reproduces it byte for byte. **`node build.js --check`
passes**: the page carries `<main id="main">`, `application/ld+json`, a canonical, and the skip
control doubles as the required `cr-skip` link. I checked this because the gate would otherwise have
exited 1 and blocked your deploy.

## Two decisions I could not make for you

### 1 · Which domain is canonical — this one needs an answer before deploy

The repo currently says both:

| File | Says |
|---|---|
| `craton-website/sitemap.xml` (16 Sep) | `https://hypati.us/craton`, pages at `/craton/hours`, `/craton/binder` … |
| `craton-website/robots.txt` (16 Sep) | `Sitemap: https://hypati.us/sitemap.xml`, disallows `/craton/app/`, `/craton/preview/` |
| `craton-website/dist/robots.txt` | `Sitemap: https://craton-erp.us/sitemap.xml` |
| The sting brief (18 Sep) | "putting it on craton-erp.us" |

`dist/robots.txt` and `dist/sitemap.xml` are the older prerender output from the craton-erp.us pass;
the source pair is newer and describes CRATON as a section of hypati.us. **`build.js` copies source
`robots.txt` and `sitemap.xml` into `dist/` on every build**, so the next `node build.js` silently
replaces the craton-erp.us pair with the hypati.us one. That is either the intended migration or a
latent accident, and I can't tell which from here.

I defaulted the sting to **craton-erp.us**, matching the 18 Sep brief. If CRATON is actually shipping
under hypati.us/craton, change two lines in `intro.html` (and rebuild):

```
<link rel="canonical" href="https://craton-erp.us/">     →  https://hypati.us/craton
"contentUrl":"https://craton-erp.us/assets/video/…"      →  https://hypati.us/craton/assets/video/…
```

`DEST` and every asset path are relative, so they work under either domain untouched.

### 2 · Keep the gate out of the index

`intro.html` already carries `noindex,follow` and a canonical to the real page, and I have **not**
added it to `sitemap.xml` — deliberately. Add one line to `craton-website/robots.txt`:

```
Disallow: /craton/intro
```

(There is already a `Disallow: /craton/preview/`. If that path is unused, parking the gate there
instead would need no robots change at all — your call.)

## Before this goes live

**Re-encode the plate.** 17.6 MB is too heavy for a gate, and it is the one thing I would not skip.
It came off the generator at that size and I had no encoder available:

```sh
ffmpeg -i dist/assets/video/craton-intro-plate-v1.mp4 \
  -vf fps=24 -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart \
  dist/assets/video/craton-intro-plate-v1.mp4
```

Typically lands under 4 MB with no visible loss, and conforms the frame rate to 24 at the same time
(the file is not natively 24fps yet). The poster is a 1.9 MB PNG — `-quality 82` as a JPEG takes it
under 200 KB; if you swap it, update the `poster` attribute and the `thumbnailUrl` in the ld+json.

**Optionally flatten the two layers into one file.** The composite currently happens in the browser:
plate underneath, alpha resolve overlaid at 3.60s at `0.75×`. Nothing was re-encoded, so the mark
stays vector-crisp — but **Safari does not reliably decode VP9 alpha WebM**, and on a failure the page
falls back to the lockup as inline SVG (same final frame, no motion on the mark). Flattening removes
that caveat:

```sh
ffmpeg -i dist/assets/video/cr-mark-resolve-alpha.webm \
  -vf "setpts=PTS/0.75" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 20 resolve-6s.webm

ffmpeg -i dist/assets/video/craton-intro-plate-v1.mp4 -i resolve-6s.webm \
  -filter_complex "[0:v]fps=24,fade=t=in:st=0:d=0.8[bg];[bg][1:v]overlay=0:0:enable='gte(t,3.6)'" \
  -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart craton-intro-sting-v1.mp4
```

Then point `#plate` at the flat file and delete the `#mark` element and the `alphaOk` branch.

## How it behaves

| | |
|---|---|
| 0.00–0.80s | Fades up from black; the core sample emerges. |
| 0.80–3.60s | Plate alone, camera climbing. |
| 3.60–9.66s | Mark resolve — strata close into the C, hand off to the shield, wordmark sets. |
| 9.66–10.04s | Holds on the lockup. |
| then | Cross-fades into the landing page, preloaded behind it (1100ms). |

Once per session (`sessionStorage`), Skip control, `prefers-reduced-motion` skips straight through,
and it bails to the home page on a video error, an autoplay refusal or a 12s timeout. Esc or Enter
skips. Silent. Preview it without being bounced onward at `/craton/intro?stay`.

## On the marks

The plate is the only generated element. The shield, monogram and wordmark are your shipped geometry —
I read the coordinates out of the site bundle's own manifest, which is where I found that
`assets/img/a-f1809e0dac.svg` is the primary lockup, `a-8b871b21d2.svg` the shield,
`a-5d357e9d2a.svg` the 96px app icon and `a-33f36f936f.svg` the favicon. Nothing was redrawn, per
§4.1 of the brand standard.

Worth knowing: those four committed SVGs are 8.1–8.5 KB each because they carry C2PA provenance
manifests in a `<metadata>` block — roughly 20× the size of their geometry. Stripping it is a
one-line build step if you want it, and it changes nothing about how they render.

## Still open

- **The mark in the family.** CRATON is the only one of the three stings carrying a mark; HYPATIUS and
  STARCHITECT are wordmark-only. Either they get one on their next pass, or CRATON is deliberately the
  odd one. It needs writing into the brand-hierarchy card either way.
- **Nine of the ten lockups are missing.** The standard lists primary, tagline, plain, stacked and
  monogram, each dark and light. Only primary-dark exists.

---

**CRATON · internal — not for external release**
HYPATIUS, LLC · UEI UKELB3UV76V6 · CAGE 19S89
