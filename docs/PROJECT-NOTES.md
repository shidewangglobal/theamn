# THE AMN Website - Project Notes

Last updated: 2026-07-02

## Production (live scope)

**Public:**
- Homepage (`/`) - all sections on one page (Hero → Contact)
- Insights hub (`/insights`) + 6 published articles (`draft: false`)

**Hidden until ready** (moved to `src/_hold/pages/`, not built as real pages):

| Path | Status |
|------|--------|
| `/services/seo-geo` | Search Visibility pillar - content WIP |
| `/preview/*` | Internal lab pages |

**Sitemap:** Homepage + `/insights` and all published insight slugs.

## Style: no em dashes

Never use em dashes (`—`) in website copy. Use periods, colons, commas, or hyphens instead. See `.cursor/rules/no-em-dash.mdc`.

## Nav (current live)

- **Header:** Insights · Connect (+ pill nav on homepage)
- **Footer:** Home · Insights · Connect
- **SEO card:** button **"Check your brand performance in less than 30s."** → `https://geoauditor.theamn.network/`

## Insights (live)

- Hub: `src/pages/insights/index.astro`
- Article template: `src/pages/insights/[slug].astro`
- Content: `src/content/insights/*.md` (6 articles, `featured` on pillar GEO post)
- Schema: `faqs`, `closing`, `closingTitle`, `coverImage` in `src/content.config.ts`

## Search Visibility page (deferred)

No `/services/seo-geo` on theamn.network for now. Funnel is homepage → GEO Auditor → contact.

To launch later:
1. Move back: `src/_hold/pages/services` → `src/pages/services`
2. Restore nav/footer links if needed
3. Remove redirect in `astro.config.mjs` + `public/_redirects`

## Hosting

- **Render:** Static Site, **free tier** (`render.yaml`)
- Build: `npm ci && npm run build` → publish `./dist`
- Env: `PUBLIC_FORMSPREE_URL` on Render dashboard

## CMS plan (not connected yet)

- **Frontend:** Astro (keep)
- **CMS:** Sanity (free tier) - Studio for content, not WordPress
- **SEO:** Technical SEO via Astro build (meta, JSON-LD, sitemap); internal SEO tool writes drafts → Sanity API or Studio review
- **Team:** 1–2 writers, no dedicated dev; future edits via Sanity + Claude Code for code

## Insight templates (future)

Sanity `layout` field → Astro components:

- `standard` - long-form article
- `qa` - Q&A + FAQ schema
- `box` - bento box sections

New layout = new Astro template + new enum option (not full site rebuild).

## Content collection (local, pre-Sanity)

- `src/content.config.ts` → collection `insights`
- Add posts: `src/content/insights/*.md` with frontmatter (`draft: true` to hide)

## Key URLs

| URL | Purpose |
|-----|---------|
| `theamn.network` | Marketing site |
| `geoauditor.theamn.network` | GEO Auditor tool (separate) |
| `/insights` | Content hub (live) |
| `/services/seo-geo` | Search Visibility service page (when launched) |
