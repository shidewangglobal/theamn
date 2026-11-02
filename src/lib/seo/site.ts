export const siteUrl = 'https://theamn.network';

export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

type JsonLdNode = Record<string, unknown>;

const organization = (): JsonLdNode => ({
  '@type': 'Organization',
  '@id': organizationId,
  name: 'The AMN Limited',
  url: siteUrl,
  alternateName: 'THE AMN',
  legalName: 'The AMN Limited',
  logo: {
    '@type': 'ImageObject',
    '@id': `${siteUrl}/#logo`,
    url: `${siteUrl}/logos/amn-logo-full.png`,
    caption: 'The AMN',
  },
  image: `${siteUrl}/images/hero-cover.jpeg`,
  description:
    'The AMN is a digital investment partner for original brands, and a marketing services team for premium hospitality.',
  email: 'dat.vuong@theamn.network',
  telephone: '+84905930309',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ho Chi Minh City',
    addressCountry: 'VN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'dat.vuong@theamn.network',
    telephone: '+84905930309',
    availableLanguage: ['English'],
  },
  knowsAbout: [
    'Luxury hospitality marketing',
    'Brand storytelling',
    'Conversion optimization and marketing automation',
    'Search engine optimization',
    'Generative engine optimization',
  ],
});

/** The three services described on /marketing, as Service nodes provided by the organization. */
const services = (): JsonLdNode[] =>
  [
    {
      name: 'Brand Storytelling & Content',
      description:
        'Luxury content playbooks, standardized social media layouts and authentic brand storytelling across premium hospitality properties.',
    },
    {
      name: 'Conversion, Automation & AI B2C',
      description:
        'Targeted awareness campaigns, conversion-optimized landing pages, a 24/7 digital sales concierge and email automation across the guest journey.',
    },
    {
      name: 'Search & Generative Engine Optimization (SEO + GEO)',
      description:
        'Structured semantic optimization that positions luxury hotels and resorts for discovery in search and AI-generated answers.',
    },
  ].map((service) => ({
    '@type': 'Service',
    '@id': `${siteUrl}/marketing#service-${service.name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`,
    ...service,
    provider: { '@id': organizationId },
    serviceType: 'Marketing for premium hospitality',
    url: `${siteUrl}/marketing#services`,
  }));

/** Home > Page, for top-level pages (articles and entries build their own trail). */
const breadcrumb = (page: { url: string; name: string }): JsonLdNode[] => {
  const path = new URL(page.url).pathname.replace(/\/$/, '');
  if (!path || path.split('/').length !== 2) return [];
  return [
    {
      '@type': 'BreadcrumbList',
      '@id': `${page.url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'The AMN', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: page.name.split('|')[0].trim(), item: page.url },
      ],
    },
  ];
};

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
  '@graph': [
    organization(),
    website(),
    webPage(page),
    ...breadcrumb(page),
    ...(new URL(page.url).pathname.replace(/\/$/, '') === '/marketing' ? services() : []),
    ...nodesFrom(extra),
  ],
});
