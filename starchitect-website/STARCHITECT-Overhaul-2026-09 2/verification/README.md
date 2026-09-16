# verification/

The harness that keeps the next skin from reintroducing the blue.

```
npm i -D playwright        # once
PW_CHROME=/path/to/chrome node verification/verify.mjs
```

Every v9 screen at 1440 and 390: no horizontal scroll · type floor 10 px · 44 px hit targets ·
reduced-motion leaves nothing looping · zero external requests · AA contrast on visible text ·
banned terms · no em dashes in visible strings · a visible focus ring on first Tab.

Exit 1 on any failure. `report.json` lists every check. Wire it to CI on the design-system repo and
on `frontend/` once the `sc-` layer lands there.
