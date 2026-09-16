# ALIDADE verification harness

Cloned from the STARCHITECT v9 harness. Thirteen screens (the website, the eight platform surfaces by hash, the
mobile concepts, both decision cards and the thumbnail) at 1440 and 390.

Checks per screen and width: no horizontal scroll, 10 px type floor, 44 px hit targets, reduced-motion still, zero
external requests, WCAG AA contrast (translucent backgrounds composited up the tree; disabled and aria-hidden
elements exempt), banned terms, visible focus ring.

ALIDADE's house style permits em dashes, so the STARCHITECT em-dash check is off here. The banned-term list adds
the entity misspellings ("Hypatius, Inc", "HYPATIUS LLC" without the comma) since both were live.

```
npm i -D playwright            # once
node verification/verify.mjs   # PW_CHROME=/path/to/chrome to use a local binary
```

Exit code 1 on any failure. `report.json` holds every check.
