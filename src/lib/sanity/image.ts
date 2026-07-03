import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { getSanityClient } from './client';

const siteUrl = 'https://theamn.network';

export function urlForImage(source: SanityImageSource | null | undefined): string | undefined {
  const client = getSanityClient();
  if (!client || !source) return undefined;

  return imageUrlBuilder(client).image(source).width(1600).auto('format').url();
}

export function resolveImageUrl(
  sanityImage: SanityImageSource | null | undefined,
  fallbackPath?: string,
): string {
  const fromSanity = urlForImage(sanityImage);
  if (fromSanity) return fromSanity;
  if (!fallbackPath) return `${siteUrl}/images/hero-cover.jpeg`;
  return fallbackPath.startsWith('http') ? fallbackPath : `${siteUrl}${fallbackPath}`;
}
