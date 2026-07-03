# Sanity CMS for Insights

THE AMN Insights can be managed in **Sanity Studio** with Yoast-style SEO fields. The Astro site reads published documents at build time. If Sanity is not configured, or has no published insights, the site falls back to markdown in `src/content/insights/`.

## What you get

- **Sanity Studio** at `npm run studio` (local) or `https://theamn.sanity.studio` (hosted)
- **Yoast-style SEO** per article: focus keyphrase, meta title/description, canonical URL, Open Graph, Twitter cards, noindex/nofollow
- **Safe fallback**: markdown files keep working until Sanity is live

## 1. Create a Sanity project

1. Sign in at [sanity.io/manage](https://sanity.io/manage)
2. Create a project (e.g. `THE AMN`)
3. Note the **Project ID** and use dataset `production`

## 2. Local environment

```bash
cp .env.example .env
```

Fill in:

| Variable | Purpose |
|----------|---------|
| `PUBLIC_SANITY_PROJECT_ID` | Project ID (public, used at build) |
| `PUBLIC_SANITY_DATASET` | Usually `production` |
| `SANITY_API_READ_TOKEN` | Viewer token for build-time fetch |
| `SANITY_API_WRITE_TOKEN` | Editor token for migration only |

Create tokens under **Project → API → Tokens**.

## 3. Run Studio locally

```bash
npm install
npm run studio
```

Open the URL shown in the terminal (usually `http://localhost:3333`).

## 4. Migrate existing markdown articles

One-time import of all 6 articles:

```bash
npm run migrate:insights
```

This uploads cover images, converts markdown body to Portable Text, and copies SEO frontmatter into the `seo` object.

## 5. Deploy Studio (team editing)

```bash
npm run studio:deploy
```

Hosted studio: **https://theamn.sanity.studio**

Invite editors in Sanity Manage → Members.

## 6. Production (Render)

Add these env vars in Render (see `render.yaml`):

- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET` = `production`
- `SANITY_API_READ_TOKEN`

Redeploy after saving. New publishes in Studio appear on the next build.

For **automatic** rebuilds when editors publish in Studio, see [AUTO-DEPLOY.md](./AUTO-DEPLOY.md).

## Content model

### Insight document

| Group | Fields |
|-------|--------|
| Content | title, slug, body (blocks, images, callouts, pull quotes, tables), FAQs, closing |
| SEO | Google preview, focus keyphrase, meta title/description, canonical, OG, Twitter, noindex |
| Settings | publish checklist, author, dates, featured, draft (hide from site) |

### Editor blocks (body)

| Block | Use |
|-------|-----|
| **Image** | Inline image with required alt text |
| **Callout / CTA** | Info box or button CTA |
| **Pull quote** | Editorial quote |
| **Link to Insight** | Internal link picker to other articles |
| **Table** | Comparison tables |

### Studio sidebar

- **Live on website** — published insights
- **Hidden / drafts** — not on theamn.network
- **Featured** — hub hero candidates

### SEO fallbacks (like Yoast)

| Field | Falls back to |
|-------|----------------|
| SEO title | Article title |
| Meta description | Deck / excerpt |
| OG title | SEO title |
| OG description | Meta description |
| OG image | Cover image |
| Twitter fields | Matching OG fields |
| Canonical | `https://theamn.network/insights/{slug}` |

## Switching from markdown

1. Configure env + run migration
2. In Studio, set **Hide from website** (`draft`) to **off** for each article
3. Verify `/insights` on a preview build
4. Keep markdown as backup until the team is comfortable; the site prefers Sanity when published documents exist

## Files

| Path | Role |
|------|------|
| `sanity/` | Studio config + schemas |
| `src/lib/sanity/` | Client, images, Portable Text |
| `src/lib/insights/repository.ts` | Sanity + markdown data layer |
| `scripts/migrate-insights-to-sanity.mjs` | One-time import |
