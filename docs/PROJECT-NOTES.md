# THE AMN Website — Project Notes

Last updated: 2026-07-02

## Production (live scope)

**Public:** Homepage only (`/`) — all sections on one page (Hero → Contact).

**Hidden until ready** (moved to `src/_hold/pages/`, not built as real pages):

| Path | Status |
|------|--------|
| `/insights` + posts | Scaffold only — redesign box + Q&A planned |
| `/services/seo-geo` | Search Visibility pillar — content WIP |
| `/preview/*` | Internal lab pages |

Redirects to `/` with `noindex` (see `astro.config.mjs` + `public/_redirects`).

**Sitemap:** Only `https://theamn.network/`

## Re-enable Insights / Search Visibility later

1. Move back: `src/_hold/pages/insights` → `src/pages/insights`
2. Move back: `src/_hold/pages/services` → `src/pages/services`
3. Set `draft: false` on content in `src/content/insights/*.md`
4. Restore footer/header links (Insights, Search Visibility)
5. Update `astro.config.mjs` redirects (remove `/insights`, `/services/seo-geo` → `/`)
6. SEO section button: can link to `/services/seo-geo` again when page is ready

## Nav (current live)

- **Header:** pill nav (About → Collective) + **Connect** only (Insights hidden)
- **Footer:** Home · Connect
- **SEO card:** button **Search Visibility** → `https://geoauditor.theamn.network/`

## Hosting

- **Render:** Static Site, **free tier** (`render.yaml`)
- Build: `npm ci && npm run build` → publish `./dist`
- Env: `PUBLIC_FORMSPREE_URL` on Render dashboard

## CMS plan (not connected yet)

- **Frontend:** Astro (keep)
- **CMS:** Sanity (free tier) — Studio for content, not WordPress
- **SEO:** Technical SEO via Astro build (meta, JSON-LD, sitemap); internal SEO tool writes drafts → Sanity API or Studio review
- **Team:** 1–2 writers, no dedicated dev; future edits via Sanity + Claude Code for code

## Insight templates (future)

Sanity `layout` field → Astro components:

- `standard` — long-form article
- `qa` — Q&A + FAQ schema
- `box` — bento box sections

New layout = new Astro template + new enum option (not full site rebuild).

## Content collection (local, pre-Sanity)

- `src/content.config.ts` → collection `insights`
- Add posts: `src/content/insights/*.md` with frontmatter (`draft: true` while hidden)

## Key URLs

| URL | Purpose |
|-----|---------|
| `theamn.network` | Marketing site |
| `geoauditor.theamn.network` | GEO Auditor tool (separate) |
| `/insights` | Content hub (when launched) |
| `/services/seo-geo` | Search Visibility service page (when launched) |
