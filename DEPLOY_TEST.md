# Static HTML Hero — Cloudflare Worker Test

This branch is an isolated, static HTML preview. It does not build or publish the older portfolio pages.

- Live staging assets: `preview/` includes all legacy files at their exact public paths; `dist-staging/` is an independently built test artifact
- Wrangler config: `wrangler.jsonc` (`name: myportfolio`, `assets.directory: ./preview`)
- Cloudflare Workers production branch: `experiment/static-html-hero`
- CI verification command: `node scripts/build-staging.mjs` (live staging deploy does not depend on it)
- Deploy command: `npx wrangler deploy` (do not override the configured assets directory)
- Root directory: `/`

The prototype retains `noindex,nofollow` because it is a temporary preview. The committed `preview/` directory contains all preserved historical `/assets`, `/img`, `/custom`, and `/favicon.ico` paths and redirects, for direct URL checks. Do not change `angular`, `master`, or `portfolio-seo-2026` as part of this experiment.
