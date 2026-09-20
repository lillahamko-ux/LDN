# ldn.framer.website — static copy

A self-contained copy of the Lisbon Digital Nomads homepage as published by Framer.
Framer has no export feature, so this mirrors the published output.

Source build: **Aug 27, 2026 at 9:28 AM UTC**

## Re-generating

Framer changes every build hash when you republish, so re-run after each publish:

    python3 tools/mirror-framer.py --clean

Without `--clean` it keeps what it already downloaded and fetches only what is new.

## Layout

    index.html              the page
    assets/images/          64 files — every responsive srcset variant
    assets/media/           2 videos (24 MB, mostly one background clip)
    assets/fonts/           279 woff2 (Bayon, Tanker, Public Sans + subsets)
    assets/scripts/         20 ES modules (Framer runtime + page chunks)
    assets/scripts/assets/  17 images the component chunks resolve at runtime
    assets/data/            Framer search index

Total ~80 MB, 389 files.

## Verified against the live site

Served locally and compared with ldn.framer.website in matched viewports:

| | clone | live |
|---|---|---|
| height @1280×720 | 5812px | 5812px |
| height @390×844 | 6271px | 6271px |
| images / broken | 23 / 0 | 23 / 0 |
| video, links | 1, 12 | 1, 12 |
| background | rgb(255,249,243) | rgb(255,249,243) |

Re-checked after the badge removal below: 27 requests, all local, no console errors,
no badge element, and **zero** requests to any framer.com host. Page height is
unchanged (5811px, within rounding of the 5812px above) — the badge was
`position:fixed`, so it never contributed to document height.

24 requests, **all local** — zero to any Framer server — zero failures, no console
errors. Page text is identical except the marquee, which repeats its line a different
number of times because Framer computes that from measured width at runtime.

## Deliberately changed from the published page

- **Analytics removed** (`events.framer.com`) — reports to Framer's site ID.
- **Editor bar disabled.** The runtime lazily does
  `import("https://framer.com/edit/init.mjs")`; its guard is forced so the value stays
  `undefined`, which is the state Framer already uses when the editor is unavailable.
  Left alone, the mirror calls framer.com on every load and injects an editor overlay.
- **Preconnect hints dropped** for hosts the copy no longer contacts.
- **"Made in Framer" badge removed.** It came from both halves of the render and
  needed both cut: the markup in `<div id="__framer-badge-container">` is deleted,
  and the hydration call at the end of `script_main.*.mjs` is pinned to `false`.
  Cutting only the markup lets the runtime paint the badge back; cutting only the
  hydration leaves it server-rendered and visible until scripts run. With the branch
  dead, `assets/scripts/PX9hIOIVM.*.mjs` is never imported — the mirror still
  downloads that 19 KB chunk, it is just unreferenced. Its CSS rules stay in the
  stylesheet too, matching nothing; both are left alone rather than cut out of
  minified output for no gain.

## Known limits

- This is built output. Editing means editing minified HTML, not the Framer editor —
  the workflow is: change it in Framer, republish, re-run the script.
- Nothing server-side survives: Framer's form handling and search backend are gone.
  The page's own links (Slack, Meetup, Google Forms, email) are external and still work.
- The page still carries a Framer template's markup and CSS. Check that template's
  licence before hosting this on a public domain.
