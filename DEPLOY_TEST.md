# Static HTML Hero — Cloudflare Worker Test

This branch is an isolated, static HTML preview. It does not build or publish the older portfolio pages.

- Source page: `preview/index.html`; staging build output: `dist-staging/index.html`
- Wrangler config: `wrangler.jsonc` (`name: myportfolio`, `assets.directory: ./dist-staging`)
- Cloudflare Workers production branch: `experiment/static-html-hero`
- Build command: `node scripts/build-staging.mjs` (automatically run by Wrangler)
- Deploy command: `npx wrangler deploy` (do not override the configured assets directory)
- Root directory: `/`

The prototype retains `noindex,nofollow` because it is a temporary preview. The staging build also includes all preserved historical `/assets`, `/img`, `/custom`, and `/favicon.ico` paths and redirects, for direct URL checks. Do not change `angular`, `master`, or `portfolio-seo-2026` as part of this experiment.
