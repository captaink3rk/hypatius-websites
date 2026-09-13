# Website patches — ready to upload

Two folders here mirror `captaink3rk/hypatius-websites` exactly. Both live sites now preview
correctly in this project because their CSS, JS and images were pulled in alongside the HTML.

## Upload these five files (and only these)

| Repo path | Change |
|---|---|
| `hypatius-corporate-website/company.html` | Stan → Co-Founder & Chief Executive Officer. Jordan → Co-Founder & Chief Mission Product Officer. |
| `hypatius-corporate-website/home.html` | Same two title changes on the leadership strip. |
| `hypatius-corporate-website/news-stanley-kennedy-ceo.html` | Media-contact line only: `Jordan Broe · CMO` → `CMPO`. Press-release body left as a dated record. |
| `starchitect-website/a-about.html` | Same two titles; Jordan's bio rewritten to the CMPO framing; Stan's bio aligned to the vetted corporate version (removed "three decades" and "U.S. Air Force veteran," which the corporate changelog Rev 5.3 had already retired as unsourced). |
| `starchitect-website/a-press-kit.html` | Fact-sheet line and leadership card: same two titles; Jordan's press bio rewritten. |

Everything else in these two folders is an **unmodified copy** from the repo, present only so
the pages render here. Do not re-upload it.

Verified after patch: all five leadership cards in the right order on both sites, zero
"Chief Marketing Officer" left, every image and stylesheet loading, no console errors.

## Open findings on the live sites (not patched — your call)

- **CJADC2 appears 42× across 20 STARCHITECT files**, including the footer tagline on every page and meta descriptions; press kit also says BMC4I. Corporate rule 3 requires BMC3I externally (glossary excepted).
- **Nav CTA on starchitect.us is near-invisible** — `#9FA9B8` on `#D4A03B` gold (~1.05:1). Fix: `color:#060B17` on the primary button inside `nav`, matching the in-page CTA. Lives in `base.css`/`sub.css`.
- Repo is public; consider private now that Jim is taking admin.
