import { createClient, type SanityClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2025-01-01';
const token = import.meta.env.SANITY_API_READ_TOKEN;

export function isSanityConfigured(): boolean {
  return Boolean(projectId && dataset);
}

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;

  return createClient({
    projectId: projectId!,
    dataset,
    apiVersion,
    useCdn: import.meta.env.PROD,
    token: token || undefined,
    perspective: 'published',
  });
}
