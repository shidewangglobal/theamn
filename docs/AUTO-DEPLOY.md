# Auto-deploy: Sanity Studio → Render → theamn.network

When an editor **publishes or updates an Insight** in Studio, a webhook triggers a **Render rebuild**. No manual deploy needed.

```
Studio Publish  →  Sanity webhook  →  Render Deploy Hook  →  npm run build  →  theamn.network
```

## One-time setup

### 1. Create a Render Deploy Hook

1. Open [dashboard.render.com](https://dashboard.render.com)
2. Select **theamn-website**
3. **Settings** → scroll to **Deploy Hook**
4. Click **Create Deploy Hook**
5. Name: `Sanity Insights publish`
6. Branch: `main`
7. Copy the URL (looks like `https://api.render.com/deploy/srv-...?key=...`)

### 2. Add to `.env`

```env
RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/srv-...?key=...
```

Keep `SANITY_AUTH_TOKEN` (Developer token) in `.env` as well.

### 3. Run the setup script

```bash
npm run setup:auto-deploy
```

You should see: `✓ Created webhook "Render redeploy on Insight publish"`.

### 4. Test

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
