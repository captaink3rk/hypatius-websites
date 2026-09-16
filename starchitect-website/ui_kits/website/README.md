# UI kit — HYPATIUS corporate site

Interactive recreation of the hypati.us marketing site (the P2.5 "Blackout" build), composing the design system's primitives over the shipped class layer in `css/components.css`.

**Screens:** Home · Platforms · Company · Insights (with working category filter) · Contact (with a form that submits to a confirmation state).

**What to notice**
- The nav is fixed and transparent over a hero; it gains the blurred navy panel only after 40px of scroll (`.nav--scrolled`).
- Every photographic hero carries the two-axis protection gradient, so display type always lands on a dark field.
- The credential stamp (`UEI UKELB3UV76V6 · CAGE 19S89`) repeats in the hero, the contracting band, the CTA strip and the footer. That repetition is the brand's trust posture.
- The bottom-right toggle flips `data-theme="light"` on `<html>`. Dark bands stay dark on purpose.
- No ownership claims anywhere (no VOSB / SDVOSB / veteran-*). Copy says "small business · non-traditional defense contractor".

**Files:** `index.html` (app shell + routing) · `Chrome.jsx` (Nav, Footer) · `Pages.jsx` (Hero, Home, Platforms, Company, Insights, Contact, CTA).
