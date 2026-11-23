# Static portfolio — test → production release guide

## Goal
One set of reviewed HTML source files in `preview/`, two independent deployment targets.
The test website is intentionally **not indexable**. Production must never use the raw `preview/` assets.

### Test (currently configured)
- Git branch: `experiment/static-html-hero`
- Worker config: `wrangler.jsonc` (`myportfolio`, assets `./preview`)
- Current staging setup remains unchanged: `npx wrangler deploy`
- Every test HTML file contains `noindex,nofollow`; `preview/_headers` also sets `X-Robots-Tag: noindex`
- Keep both restrictions on staging.

### Production (prepared, not deployed by this change)
- Use a **separate production branch** (e.g. `release/portfolio-static`) and a separate Cloudflare Worker/deployment (`myportfolio-production`).
- The production build is **required**. It copies the checked `preview/` files to `dist-production/`, removes staging noindex tags, adds canonical and social URL metadata, creates a sitemap and robots.txt, replaces staging headers, and excludes the obsolete PDF draft.
- Build: `SITE_ORIGIN=https://www.kramarenko.info node scripts/build-production.mjs`
- Deploy: `npx wrangler deploy --config wrangler.production.jsonc`
- Cloudflare production asset directory: `./dist-production`
- Attach `www.kramarenko.info` only after the new Worker is tested and the current domain/DNS setup is inspected. Redirect the non-canonical hostname to the canonical one after confirming which hostname should be preferred.
- **No production deployment or DNS changes were made while authoring this guide.**

## Minimum acceptance checks before first release
1. Confirm official job titles, employment history, qualifications and every publication link. Corporate case descriptions are sanitized and framed as personally reported professional experience.
2. From the test Worker, open `/`, `/resume.html`, each page in `/projects/`, and all in-page navigation anchors. Verify no mobile paper clipping and animation.
3. On `/resume.html`, press **Print / Save as PDF**: confirm US Letter layout, all pages, visible contacts, and no toolbar. HTML is the single authoritative resume; the old PDF draft is not included in production.
4. On a **local production package**, inspect `dist-production/index.html` and every other HTML file: all should have `index,follow` and the appropriate self-referencing canonical. Check `dist-production/_headers` has **no noindex**; confirm sitemap/robots use the production origin.
5. After deployment to a *temporary production Worker address*, inspect actual HTTP response codes, `X-Robots-Tag`, canonical, mobile rendering, internal links, and printing.
6. Before switching public DNS, inventory old URLs and create 301 redirects when old links have changed. Do not discard old Google-indexed routes without redirects. Submit the production `sitemap.xml` to Google Search Console after launch.

## Ongoing release process
1. Create/iterate on the test branch.
2. Review the Worker preview, run link/content/print checks.
3. Merge a **reviewed** release commit into `release/portfolio-static`.
4. Production Cloudflare Builds must use the release branch, `node scripts/build-production.mjs` as the build command and `npx wrangler deploy --config wrangler.production.jsonc` as the deploy command.
5. Verify the exact production deployment. Roll back by redeploying a previously reviewed release commit if needed.
6. Avoid editing production directly: corrections go test → release.

## Content release scope
- Home: business-first positioning; Featured Projects, Skills, Experience; compact earlier entrepreneurship, education, research; Credentials and Contact.
- Printable `resume.html`: HTML source of truth with Print / Save as PDF.
- Project pages: local RAG bot, TEUS website, transport/production integration.
- No blog, invented project KPIs, copied employer repositories, or arbitrary keyword landing pages.

## Known follow-up (not a blocker for testing)
- Replace unsupported outcomes with verified numbers as evidence becomes available.
- Add stronger diagrams/screenshots and architecture discussion to the three project cases.
- Create an approved PDF export from HTML only if recruiters specifically request a file.
