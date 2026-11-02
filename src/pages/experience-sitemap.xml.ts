import type { APIRoute } from 'astro';
import { experienceUrls, renderUrlset, xml } from '../lib/seo/sitemaps';

export const prerender = true;

export const GET: APIRoute = async () => xml(renderUrlset(await experienceUrls()));
