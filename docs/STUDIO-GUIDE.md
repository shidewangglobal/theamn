# THE AMN — Sanity Studio Guide (English)

Complete reference for editors and admins managing Insights content at **https://theamn.sanity.studio**.

---

## Quick links

| Resource | URL |
|----------|-----|
| **CMS (Studio)** | https://theamn.sanity.studio |
| **Live Insights hub** | https://theamn.network/insights |
| **Invite members** | https://sanity.io/manage → THE AMN → Members |
| **Webhook / API** | https://sanity.io/manage → THE AMN → API |

---

## Publishing workflow

```
Edit in Studio → Check SEO preview & publish checklist → Publish → Site rebuilds automatically (~2–5 min)
```

1. Open an **Insight** document
2. Complete **Content**, **SEO**, and **Settings**
3. Turn **Hide from website** **off**
4. Click **Publish**
5. Wait for Render to rebuild (auto via webhook) — no manual deploy needed
6. Verify at https://theamn.network/insights

---

## Sidebar (desk structure)

| Section | What it shows |
|---------|----------------|
| **Live on website** | Published insights (`Hide from website` = off) |
| **Hidden / drafts** | Insights not visible on theamn.network |
| **Featured** | Insights marked for the hub hero slot |
| **All insights** | Every insight document |

---

## Document tabs

### Content

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | Yes | Article headline |
| **Title emphasis** | No | Phrase shown in editorial italic style on the website |
| **Slug** | Yes | URL segment → `/insights/{slug}` |
| **Deck / excerpt** | Yes | Short intro below the title; fallback for meta description |
| **Category** | Yes | Insights · Q&A · Guides |
| **Layout** | Yes | Standard article · Q&A (questions in body) |
| **Cover image** | Yes | Hero image; **alt text required** |
| **Body** | Yes | Main article (see blocks below) |
| **FAQs** | Yes (3–5) | Accordion + Google FAQ schema |
| **Closing title** | No | Default: “The bottom line” |
| **Closing copy** | Yes | Final paragraph + CTA context |

### SEO

| Field | Required | Description |
|-------|----------|-------------|
| **Search preview** | — | Live Google-style preview (read-only) |
| **Focus keyphrase** | No | Primary phrase to rank for (Yoast-style) |
| **SEO title** | No | Browser / Google title (50–60 chars ideal); falls back to Title |
| **Meta description** | No | Search snippet (120–160 chars ideal); falls back to Deck |
| **Canonical URL** | No | Override canonical; default: `https://theamn.network/insights/{slug}` |
| **Open Graph title** | No | Social share title; falls back to SEO title |
| **Open Graph description** | No | Social share text; falls back to meta description |
| **Open Graph image** | No | 1200×630 recommended; falls back to cover image |
| **Twitter card type** | No | Summary large image (default) · Summary |
| **Twitter title / description / image** | No | Falls back to matching OG fields |
| **Noindex** | No | Discourage Google from indexing this page |
| **Nofollow** | No | Discourage Google from following links on this page |

**SEO preview checks:**
- Title length (target ~30–60 characters)
- Description length (target ~120–160 characters)
- Focus keyphrase appears in SEO title

### Settings

| Field | Required | Description |
|-------|----------|-------------|
| **Before you publish** | — | Checklist (read-only) |
| **Author** | No | Default: The AMN Limited; used in Article schema |
| **Publish date** | Yes | Display date on the website |
| **Updated date** | No | Set when the article is materially refreshed |
| **Featured on Insights hub** | No | Large hero card on `/insights` |
| **Hide from website** | No | **On** = hidden from theamn.network even after Publish |

**Publish checklist verifies:**
- Title, slug, and deck filled
- SEO title / meta description (or fallbacks)
- 3–5 FAQs
- Hide from website is off

---

## Body blocks (editor)

Insert via the **+** menu in the Body field.

| Block | Purpose | SEO notes |
|-------|---------|-----------|
| **Normal / H2 / H3 / Quote** | Standard text and headings | Use H2 for sections; one H1 comes from Title |
| **Bullet / numbered lists** | Lists | — |
| **Strong / Emphasis** | Bold and italic | — |
| **External link** | Any URL (http, relative, mailto) | Use for GEO Auditor, external sources |
| **Link to Insight** | Picker → another Insight article | Internal linking; builds `/insights/{slug}` automatically |
| **Image** | Inline image | **Alt text required** (5–160 chars); optional caption |
| **Callout / CTA** | Info box or button CTA | Info style · CTA with button label + URL |
| **Pull quote** | Large editorial quote | Optional attribution |
| **Table** | Rows and columns | Good for comparisons |

---

## Roles & access

Studio requires login (Google or invited email). Manage members at **sanity.io/manage → Members**.

| Role | Typical user | Can do |
|------|--------------|--------|
| **Administrator** | You / tech lead | Invite users, API tokens, billing, deploy |
| **Editor** | Marketing / content | Create, edit, publish Insights |
| **Viewer** | Audit / read-only | View only |

Editors do **not** need Render, Git, or terminal access.

---

## What happens on the website

| Studio action | Website effect |
|---------------|----------------|
| Publish insight (draft off) | Webhook triggers Render rebuild |
| Hide from website on | Article removed on next build |
| Featured on | Article eligible for hub hero |
| SEO fields | Meta tags, OG, Twitter, canonical, robots |
| FAQs | Accordion (non-Q&A) + FAQPage JSON-LD |
| Author / dates | Article JSON-LD |
| — | Breadcrumb schema: Home → Insights → Article |

---

## SEO best practices (per article)

1. Choose one **focus keyphrase** and use it naturally in title, H2s, and deck
2. Write a unique **SEO title** (~50–60 characters)
3. Write a unique **meta description** (~120–160 characters) with a clear benefit
4. Keep **slug** short and readable (`geo-luxury-hotels`, not full sentences)
5. Add **alt text** on cover and every inline image
6. Add **2–3 internal links** to other Insights (`Link to Insight`)
7. Complete **3–5 FAQs** with real guest/owner questions
8. Set **updated date** when you refresh an existing article
9. Use **noindex** only for test or duplicate content — rarely needed

---

## Technical notes (admins)

| Item | Detail |
|------|--------|
| Document type | `insight` (singular — not `insights`) |
| Dataset | `production` |
| Project ID | `rhoqrzq3` |
| Auto-deploy | Sanity webhook → Render Deploy Hook |
| Fallback | If Sanity is empty/unconfigured, site uses markdown in `src/content/insights/` |

---

## Support

- **Content questions:** Marketing lead
- **Studio access:** Administrator (sanity.io/manage → Members)
- **Site not updating after publish:** Check Render → Events for deploy; confirm Render env vars are set
- **Developer docs:** `docs/SANITY.md`, `docs/AUTO-DEPLOY.md`
