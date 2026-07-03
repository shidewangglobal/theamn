#!/usr/bin/env node
/**
 * Wire Sanity → Render auto-deploy.
 *
 * Required in .env:
 *   PUBLIC_SANITY_PROJECT_ID
 *   RENDER_DEPLOY_HOOK_URL   (from Render dashboard)
 *   SANITY_AUTH_TOKEN        (Developer token with webhook access)
 *
 * Usage: npm run setup:auto-deploy
 */

import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadEnvFile() {
  const envPath = path.join(root, '.env');
  if (!fsSync.existsSync(envPath)) return;

  const content = fsSync.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'rhoqrzq3';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const deployHookUrl = process.env.RENDER_DEPLOY_HOOK_URL;
const token =
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN;

const apiVersion = 'v2025-02-19';
const baseUrl = `https://${projectId}.api.sanity.io/${apiVersion}/hooks/projects/${projectId}`;
const webhookName = 'Render redeploy on Insight publish';

const webhookBody = {
  type: 'document',
  name: webhookName,
  description: 'Triggers a Render rebuild when Insights are published or updated in Studio.',
  url: deployHookUrl,
  dataset,
  httpMethod: 'POST',
  apiVersion: 'v2025-02-19',
  includeDrafts: false,
  rule: {
    on: ['create', 'update', 'delete'],
    filter: '_type == "insight"',
    projection: '{ "event": "insight-changed", "slug": slug.current }',
  },
};

async function api(pathSuffix, options = {}) {
  const response = await fetch(`${baseUrl}${pathSuffix}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      `Sanity API ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`,
    );
  }

  return data;
}

async function main() {
  if (!deployHookUrl) {
    console.error('Missing RENDER_DEPLOY_HOOK_URL in .env');
    console.error('Create one in Render → theamn-website → Settings → Deploy Hook');
    process.exit(1);
  }

  if (!token) {
    console.error('Missing SANITY_AUTH_TOKEN (Developer token) in .env');
    process.exit(1);
  }

  console.log(`Setting up auto-deploy for project ${projectId} (${dataset})...`);

  const existing = await api('');
  const match = (existing || []).find(
    (hook) => hook.name === webhookName || hook.url === deployHookUrl,
  );

  if (match) {
    console.log(`Webhook already exists: "${match.name}" (${match.id})`);
    console.log('Auto-deploy is already wired.');
    return;
  }

  const created = await api('', {
    method: 'POST',
    body: JSON.stringify(webhookBody),
  });

  console.log(`✓ Created webhook "${created.name}" (${created.id})`);
  console.log('Publish an Insight in Studio → Render will rebuild automatically.');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
