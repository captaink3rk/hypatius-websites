# HYPATIUS hero lab

Four working hero concepts, one per site: `hy/`, `st/`, `al/`, `cr/`. Each is a standalone page on three.js with the brand's own logo, colors, fonts and motion curve.

Run locally: `python3 -m http.server 9200` in this folder, then open http://localhost:9200/st/ (or hy, al, cr).

- `assets/clock.js`: the shared clock and the brand easing curves. Real time in the browser; `?cap=1` lets `cap.js` step frames for video capture; reduced motion renders one still frame.
- `cap.js`: Playwright capture of stills or 8-second clips (`node cap.js st video 8 24`).
- Data in the STARCHITECT and ALIDADE heroes is tagged SIMULATED; the CRATON counter is illustrative.
