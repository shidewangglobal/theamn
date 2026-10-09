const siteUrl = 'https://theamn.network';

export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

type JsonLdNode = Record<string, unknown>;

const organization = (): JsonLdNode => ({
  '@type': 'Organization',
  '@id': organizationId,
  name: 'The AMN Limited',
  url: siteUrl,
  logo: `${siteUrl}/favicon.png`,
  description:
    'The AMN is a digital investment partner for original brands, and a marketing services team for premium hospitality.',
});

const website = (): JsonLdNode => ({
  '@type': 'WebSite',
  '@id': websiteId,
  name: 'The AMN',
  url: siteUrl,
  publisher: { '@id': organizationId },
});

const webPage = (page: { url: string; name: string; description: string }): JsonLdNode => ({
  '@type': 'WebPage',
  '@id': `${page.url}#webpage`,
  url: page.url,
  name: page.name,
  description: page.description,
  isPartOf: { '@id': websiteId },
  about: { '@id': organizationId },
});

const nodesFrom = (extra?: JsonLdNode | JsonLdNode[]): JsonLdNode[] => {
  if (!extra) return [];
  if (Array.isArray(extra)) return extra.flatMap((item) => nodesFrom(item));
  if (Array.isArray(extra['@graph'])) return extra['@graph'] as JsonLdNode[];
  const { '@context': _context, ...node } = extra;
  return [node];
};

export const siteGraph = (
  page: { url: string; name: string; description: string },
  extra?: JsonLdNode | JsonLdNode[],
) => ({
  '@context': 'https://schema.org',
  '@graph': [organization(), website(), webPage(page), ...nodesFrom(extra)],
});
