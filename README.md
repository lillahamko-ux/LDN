# Lisbon Digital Nomads

The website for Lisbon Digital Nomads — a group of nomads, slowmads, expats and
locals who meet in Lisbon every Thursday, and have done since 2017.

## What's in here

Two versions of the site live side by side:

| Path | What it is | Deployed? |
|---|---|---|
| `framer-export/` | The live site. Plain static HTML, CSS, images, fonts and JS — no build step. | **Yes** |
| `src/` | A Next.js 16 rebuild of the same site in React and Tailwind. | Not yet |
| `tools/` | Script that regenerates the static site from the published source. | — |

`src/` is where the site is heading: it is real, editable React, so it can take a
CMS and be changed component by component. It is complete and builds, but nothing
serves it yet. The static version is what visitors currently get.

## Running it locally

The live site — no dependencies, no build:

```bash
python3 -m http.server 8899 --directory framer-export
```

Then open http://localhost:8899

The Next.js rebuild:

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Deployment

Deployed on **Vercel**, from this repository.

Live at https://ldn-red.vercel.app (see Domain below — this is due to change).

The Vercel project is connected to GitHub, so deploys are automatic:

- push to `main` → goes live in production
- push any other branch → gets its own preview URL to check before merging

No manual deploy step is needed. To deploy by hand anyway, `npx vercel --prod`.

`vercel.json` decides which of the two versions ships. Today it points
`outputDirectory` at the static folder and leaves `buildCommand` and
`installCommand` empty, because that version is already built — which is why
deploys take a few seconds rather than a few minutes.

To switch the deploy over to the Next.js rebuild, set `framework` to `"nextjs"`,
drop `outputDirectory`, and remove the two empty command overrides so Vercel runs
the normal build.

## Domain

The site is currently on a default Vercel URL, which should change to something
that includes **lisbondigitalnomads**. Two ways to do it:

- **Free Vercel subdomain** — rename the Vercel project to `lisbondigitalnomads`
  and the site becomes `lisbondigitalnomads.vercel.app`. Takes a minute, costs
  nothing.
- **Custom domain** — buy something like `lisbondigitalnomads.com`, then add it
  under the project's Domains settings in Vercel and point the registrar's DNS at
  Vercel. Vercel issues the HTTPS certificate automatically.

The custom domain is the better long-term answer for a public group; the Vercel
subdomain is a good stopgap and the two can coexist.
