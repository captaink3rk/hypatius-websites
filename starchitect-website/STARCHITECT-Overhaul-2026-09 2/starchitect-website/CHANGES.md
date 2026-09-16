# starchitect.us · changes to make

The live site was read only. Nothing here was applied. Three changes, in priority order.

## 1. The banned term in the meta description · 14 pages

`CJADC2` sits in `<meta name="description">` on every page below. The visible copy already says BMC3I.
Only the tag is wrong, and the tag is what search results and link previews show.

```
a-about.html
  a-capabilities.html
  a-glossary.html
  a-platform.html
  a-press-kit.html
  a-use-cases.html
  capabilities.html
  home-a-watch.html
  home-b-field.html
  home-command.html
  home.html
  platform.html
  resources.html
  security.html
```

One line, run from the site root, then redeploy:

```
sed -i 's/space warfare and CJADC2\./space warfare and BMC3I./' *.html
grep -l CJADC2 *.html || echo clean
```

## 2. The console section · platform.html

`platform.html` has no product screenshots. Its capabilities read as claims with nothing behind them, and
craft discipline bans div-built stand-ins. `console-section.html` is a drop-in section in the site's own
class vocabulary with seven real v9 captures in `captures/`. Paste it between the capabilities section
and `#briefing-cta`. Copy `captures/` to `assets/screens/` and adjust the paths, or keep them beside.

## 3. Proof lines under every figure

The stat panels on `home.html` and `platform.html` assert. Each figure needs a one-line source in mono
under it, or ships as `[pending data]`. The console section above shows the pattern: statnum, statlabel,
then a 10.5 px mono proof line in `#6B7588`.

## Also seen, lower priority

- The site loads Bebas Neue and IBM Plex Mono from Google Fonts. Marketing surfaces may; the platform may
  not. Fine as is, but the same self-hosted subset now ships in the design system if you want parity.
- No copyright line or entity name in the footer. alidade.us says "Hypatius, Inc."; hypati.us says
  "HYPATIUS LLC". Settle it once and put it on all three.
