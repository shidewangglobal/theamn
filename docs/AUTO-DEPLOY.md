# Auto-deploy: Sanity Studio → Render → theamn.network

When an editor **publishes or updates an Insight** in Studio, a webhook triggers a **Render rebuild**. No manual deploy needed.

```
Studio Publish  →  Sanity webhook  →  Render Deploy Hook  →  npm run build  →  theamn.network
```

## One-time setup

### Option A — Sanity dashboard (recommended)

1. Open https://sanity.io/manage → project **THE AMN**
2. **API** → **Webhooks** → **Create webhook**
3. Fill in:

| Field | Value |
|-------|-------|
| **Name** | `Render redeploy on Insight publish` |
| **URL** | Your Render Deploy Hook (see below) |
| **Dataset** | `production` |
| **Trigger on** | Create, Update, Delete |
| **Filter** | `_type == "insight"` |
| **HTTP method** | `POST` |
| **Include drafts** | Off |

4. **Save**

### Where to find the Render Deploy Hook

You already have one — no need to click "Create":

1. [dashboard.render.com](https://dashboard.render.com) → **theamn-website**
2. **Settings** (left sidebar, bottom)
3. Right menu → **Deploy**
4. Scroll to **Deploy hook** — copy the URL (`https://api.render.com/deploy/srv-...?key=...`)

### Option B — CLI script

If your Sanity token has webhook permissions:

```bash
# Add to .env first:
RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/srv-...?key=...

npm run setup:auto-deploy
```

1. Open https://theamn.sanity.studio
2. Edit any Insight → **Publish**
3. In Render → **Events**, a new deploy should start within ~30 seconds
4. After build finishes (~2–5 min), check https://theamn.network/insights

## What triggers a rebuild?

| Action in Studio | Triggers deploy? |
|------------------|------------------|
| Publish / update a published Insight | Yes |
| Delete an Insight | Yes |
| Edit a draft only (`Hide from website` on) | No (`includeDrafts: false`) |

## Troubleshooting

**Webhook not firing**

- Sanity → [sanity.io/manage](https://sanity.io/manage) → project → **API** → **Webhooks** → check attempts log

**Deploy starts but site unchanged**

- Confirm Render env vars: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`
- Confirm article has **Hide from website** turned off

**Duplicate deploys**

- Normal if you publish several articles quickly; Render queues builds

## Manual fallback

Render → **Manual Deploy** still works anytime.
