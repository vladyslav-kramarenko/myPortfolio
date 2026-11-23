# Portfolio release workflow — dev to main

## Git branches
- `angular` stays untouched as the original Angular site and historical record. Do not delete it or force-push over it.
- `experiment/static-html-hero` is the evaluated 2026 migration/test branch, retained for provenance.
- `dev` is the long-lived development branch and deploys to the existing `myportfolio` Cloudflare staging Worker.
- `main` is the production release branch, promoted from reviewed `dev` commits, and deploys to a **separate** `myportfolio-production` Worker.
- Change GitHub default from `angular` to `main` **only after** validating this new branch in GitHub Settings.

## Cloudflare DEV Worker
- Existing Worker name: `myportfolio`
- Connected repository: `vladyslav-kramarenko/myPortfolio`
- Git branch in Worker > Settings > Builds: `dev` (change from `experiment/static-html-hero`)
- Build command: `node scripts/build-staging.mjs` (verification only).
- Deploy command: `npx wrangler deploy --config wrangler.jsonc`
- Published directory: `./preview` (from `wrangler.jsonc`).
- Public staging domain: `myportfolio.kramarenko-vladyslav-92.workers.dev`
- The staging Worker must keep `noindex,nofollow` in HTML and `X-Robots-Tag: noindex` headers.

## Cloudflare PROD Worker (create separately)
- Worker name: `myportfolio-production` (must match `wrangler.production.jsonc`).
- Connect the same GitHub repository, production branch `main`.
- Build command: `node scripts/build-production.mjs`
- Deploy command: `npx wrangler deploy --config wrangler.production.jsonc`
- Published directory: `./dist-production`, **never** `./preview`.
- Git-based builds use the dashboard build/deploy commands, not Wrangler's custom `build.command`.
- Deploy first at a temporary Worker `workers.dev` URL; validate there before attaching any real domain.
- Prefer existing public apex `https://kramarenko.info` as canonical; production builder and sitemap use this origin.
- After testing the deployment, bind `kramarenko.info` as a custom domain to the production Worker; handle `www` as a separate redirect to apex **only after checking existing DNS and rules**.
- Preserve existing unrelated hostnames, including `lagrange.kramarenko.info`, and all mail-related DNS records.

## Verified compatibility / remaining risk
- Historical source assets: 173 paths from `/img`, `/custom`, `/assets`, and root assets, protected by Git blob checksums.
- Original Angular `/portfolio/:id`: 13 project IDs in `assets/data/portfolioItems.json`; mapped to a dedicated earlier-project archive or the relevant current page using HTTP 301. Unknown legacy URLs uploaded outside Git remain a separate risk.
- Obsolete `/Vladyslav-Kramarenko-Resume.pdf` redirects to the current printable HTML resume.
- Staging and production must preserve the same redirect list, enforced by shared `scripts/legacy-static.mjs`.

## Release gates
1. GitHub Actions green on dev; browser tests, 173 historical assets, all redirect targets, all project dates and production SEO.
2. Review diff: GitHub PR from `dev` to `main`; use merge or fast-forward (no force push).
3. Verify resulting production Worker at its temporary `workers.dev` address (200 for six core pages plus archive; no staging noindex; canonical and sitemap; all historical paths).
4. Audit Google Search Console's indexed pages/backlinks for old URLs not recorded in Git. Review privacy of historical certificates and resume documents before attaching domain.
5. Only then attach apex domain and test apex/www, important historical pages, files and subdomain routing. Keep existing hosting active until cutover checks pass.
6. If a release fails, roll the production Worker back to the previous verified deployment; keep dev untouched.

## Safety
Do not use the default `npx wrangler deploy` on the production Worker: `wrangler.jsonc` points to staging and is not indexable. Use `--config wrangler.production.jsonc` explicitly. Do not change DNS or create broad wildcard routes that could interfere with other subdomains.
