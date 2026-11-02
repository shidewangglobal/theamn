import type { APIRoute } from 'astro';
import { indexMaps, renderIndex, xml } from '../lib/seo/sitemaps';

export const prerender = true;

export const GET: APIRoute = async () => xml(renderIndex(await indexMaps()));
