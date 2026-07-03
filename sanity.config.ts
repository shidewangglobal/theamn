import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';
import { deskStructure } from './sanity/structure/deskStructure';

export default defineConfig({
  name: 'theamn',
  title: 'THE AMN',
  projectId: 'rhoqrzq3',
  dataset: 'production',
  plugins: [structureTool({ structure: deskStructure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
