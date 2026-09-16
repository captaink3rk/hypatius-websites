# alidade.us — static deploy
Root: this folder. No build step. Vercel framework preset: Other.

- index.html — single-page site
- css/ — fonts.css (self-hosted Barlow Condensed, Inter, IBM Plex Mono), alidade-v2.css (tokens), alidade-product-v2.css (components)
- assets/brand, assets/glyphs, assets/imagery, assets/fonts — only files the page references
- vercel.json — clean URLs + long-cache headers on /assets

All paths are root-absolute (/assets/…, /css/…), so the folder must be the repo root or Vercel "Root Directory".
