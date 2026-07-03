import { defineCliConfig } from 'sanity/cli';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || 'rhoqrzq3';
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error('Missing Sanity project ID. Set PUBLIC_SANITY_PROJECT_ID in .env');
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: 'theamn',
});
