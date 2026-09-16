# starchitect.us · changes applied to `site/`

Applied to the shipped starchitect.us source from the design system. `site/` is deploy-ready.
Not pushed to production; see the note in 00-README-FIRST.md.

- home.html: 1 CJADC2 -> BMC3I
- a-use-cases.html: 1 CJADC2 -> BMC3I
- a-capabilities.html: 3 CJADC2 -> BMC3I
- resources.html: 2 CJADC2 -> BMC3I
- a-glossary.html: 3 CJADC2 -> BMC3I
- home-command.html: 3 CJADC2 -> BMC3I
- a-press-kit.html: 5 CJADC2 -> BMC3I
- home-a-watch.html: 3 CJADC2 -> BMC3I
- platform.html: 1 CJADC2 -> BMC3I
- security.html: 1 CJADC2 -> BMC3I
- a-about.html: 3 CJADC2 -> BMC3I
- capabilities.html: 2 CJADC2 -> BMC3I
- home-b-field.html: 2 CJADC2 -> BMC3I
- a-platform.html: 1 CJADC2 -> BMC3I
- TOTAL CJADC2 replaced: 31
- home.html: ⚡ -> ▲
- home-command.html: ⚡ -> ▲
- home-a-watch.html: ⚡ -> ▲
- resilience.html: ⚡ -> ▲
- platform.html: console section inserted before #briefing-cta (7 captures at assets/screens/)
- home.html: console headline replaced (was duplicated with ALIDADE), real v9 capture added above the surface tiles
- home.html: proof lines under the three stat figures (two marked [pending data], one sourced)
- home-fx.js: the runtime-rendered footer (home.html has no static footer; this script draws it) read CJADC2; now BMC3I. Entity line already carried HYPATIUS LLC and UEI/CAGE.

- glossary-data.js: the CJADC2 doctrine entry became a BMC3I entry with the correct expansion (battle management, command, control, communications, and intelligence); JADC2 entry and all seeAlso references updated. 10 occurrences.
- a-press-kit.html, resources.html: wrong expansion "Combined Joint All-Domain Command and Control (BMC3I)" corrected.
- Not changed: intro-live.html line 370 matches the banned-term grep inside a base64 media blob. False positive; no text.
- Total CJADC2 removed from the site: 42 (31 in html, 10 in glossary-data.js, 1 in home-fx.js).
