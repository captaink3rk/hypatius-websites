# starchitect.us · v9 patch bundle

Drop these over the root of captaink3rk/hypatius-starchitect-website, then commit and push. No build step.

## What is here
- a-about.html, a-press-kit.html — updated pages (BMC3I vocabulary applied). Overwrite the live copies.
- base.css, sub.css, site.js — shared site layer. Overwrite.
- assets/wordmark.png, lockup.png, hypatius.png, hero-orbital.png — brand assets. Overwrite.
- assets/screens/*.jpg — seven real v9 console captures (new).
- console-section.html — drop-in <section id="console"> for platform.html. Paste it between the capabilities section and #briefing-cta. Image paths already point at assets/screens/. Delete this file after pasting; do not deploy it as a page.
- CHANGES-v9.md — the full change list.

## Before you push
Run from the site root to fix the banned term in 14 meta descriptions:

    sed -i 's/space warfare and CJADC2\./space warfare and BMC3I./' *.html
    grep -lE 'VOSB|Veteran[- ]Owned|veteran-(owned|built|led)|VetCert|main\.hypati\.us|Sara Dillan|Brian Willcott|CJADC2' *.html || echo clean
