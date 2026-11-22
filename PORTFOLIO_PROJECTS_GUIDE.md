# Portfolio project management — test branch

This document describes how to manage project attribution and Featured Projects on the static portfolio.

## Pin / unpin (no source-code or employer-repository access required)

Edit `preview/featured-projects.json`:

```json
{
  "featured": ["proj-001", "proj-006"]
}
```

The `featured` array is an ordered list of **project IDs**. A project appears in the Featured Projects block when listed here; it stays under its employer in Experience even if unpinned. To change the order, reorder the IDs. To remove all pins, use an empty array. GitHub push to the staging branch triggers the configured Cloudflare build.

A static default is kept in `preview/index.html` using `data-featured="true"` when the JSON cannot be loaded. When editing the JSON, it is optional but preferable to keep the two fallback flags in sync.

## Current project IDs and attribution

| ID | Organization on website | Project | Public evidence | Initially pinned |
| --- | --- | --- | --- | --- |
| `proj-001` | Ideal Siding | Operational reporting integration (ServiceMinder → BigQuery → Looker Studio) | Self-reported, no shared source | Yes |
| `proj-007` | Ideal Siding | Sales calendar portal (Apps Script / CRM / calendars) | Self-reported, no shared source | No |
| `teus-website` | TEUS Group | TEUS Group Website | Public repository `vladyslav-kramarenko/teus` | No |
| `proj-005` | ZHYTLOBUD-2 | 1C business systems implementation | Self-reported, supporting project entry in career sheet | No |
| `fleet-integration` | ZHYTLOBUD-2 | Transport and production workflows | Self-reported role in coordinating team, not claiming personal code authorship | No |
| `proj-006` | Independent | Local RAG Support Bot | Public repository `vladyslav-kramarenko/support-bot-rag` | Yes |
| `asana-tracker` | Independent | Asana activity tracker | Public repository `vladyslav-kramarenko/asana-tracker` | No |

**Do not associate projects with employers merely because a repository belongs to an organization.** The user's permission is limited to personal portfolio work and publicly accessible materials; do not fetch private organizational code or expose secrets, internal endpoints, keys, company data, employee data or security findings.

## How to add a new project

1. Verify its employer/ownership and public disclosure status using the project's career source of truth. Distinguish self-reported work from independent public source.
2. Add a compact `<article class="role-project" data-project-id="unique-id" data-featured="false" data-organization="Employer">` inside the correct organization in `preview/index.html`. If independent, add it to Independent Projects.
3. Keep the public description concise: the actual stack, the user's demonstrable role, and a link only when the resource exists and can be shared.
4. Add the ID to `preview/featured-projects.json` only when you want it highlighted.
5. Check anchors and IDs, confirm no broken internal links, and verify the Cloudflare preview before promoting changes.

## Site publishing

The test branch is `experiment/static-html-hero`, published from `preview/` by Workers Assets. Staging files contain `noindex` restrictions. Remove those only after content review and canonical-domain production setup.

*The portfolio is a public-facing selection, not a mirror of all private projects in the career spreadsheet.*
