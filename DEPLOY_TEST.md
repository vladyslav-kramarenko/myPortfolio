# Static HTML Hero — Cloudflare Worker Test

This branch is an isolated, static HTML preview. It does not build or publish the older portfolio pages.

- Entry point: `preview/index.html`
- Wrangler config: `wrangler.jsonc` (`name: myportfolio`, `assets.directory: ./preview`)
- Cloudflare Workers production branch: `experiment/static-html-hero`
- Build command: none
- Deploy command: `npx wrangler deploy` (or `npx wrangler deploy --assets ./preview/`)
- Root directory: `/`

The prototype contains `noindex,nofollow` because it is a temporary preview. Do not change `angular`, `master`, or `portfolio-seo-2026` as part of this experiment.
