import { toHTML } from '@portabletext/to-html';
import { urlForImage } from './image';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function prepareBodyForHtml(blocks: unknown[] | null | undefined): unknown[] {
  if (!blocks?.length) return [];

  return blocks.map((block) => {
    if (!block || typeof block !== 'object') return block;
    const entry = block as Record<string, unknown>;

    if (entry._type === 'block' && Array.isArray(entry.markDefs)) {
      return {
        ...entry,
        markDefs: (entry.markDefs as Record<string, unknown>[]).map((def) => {
          if (def._type === 'insightLink' && typeof def.href === 'string') {
            return { ...def, _type: 'link', href: def.href };
          }
          return def;
        }),
      };
    }

    return block;
  });
}

const portableTextComponents = {
  marks: {
    link: ({
      children,
      value,
    }: {
      children: string;
      value?: { href?: string };
    }) => {
      const href = value?.href ?? '#';
      const isExternal = href.startsWith('http');
      const rel = isExternal ? ' rel="noopener noreferrer"' : '';
      const target = isExternal ? ' target="_blank"' : '';
      return `<a href="${href}" class="text-amn-blue underline-offset-2 transition hover:underline"${rel}${target}>${children}</a>`;
    },
    strong: ({ children }: { children: string }) => `<strong>${children}</strong>`,
    em: ({ children }: { children: string }) => `<em>${children}</em>`,
  },
  types: {
    bodyImage: ({
      value,
    }: {
      value?: { image?: unknown; alt?: string; caption?: string };
    }) => {
      const src = urlForImage(value?.image as never);
      if (!src) return '';
      const alt = escapeHtml(value?.alt || '');
      const caption = value?.caption
        ? `<figcaption class="insight-figure__caption">${escapeHtml(value.caption)}</figcaption>`
        : '';
      return `<figure class="insight-figure"><img src="${src}" alt="${alt}" loading="lazy" width="1200" height="675" class="insight-figure__image" />${caption}</figure>`;
    },
    callout: ({
      value,
    }: {
      value?: {
        style?: 'info' | 'cta';
        title?: string;
        text?: string;
        buttonLabel?: string;
        buttonUrl?: string;
      };
    }) => {
      const title = escapeHtml(value?.title || '');
      const text = value?.text ? `<p>${escapeHtml(value.text)}</p>` : '';
      const isCta = value?.style === 'cta';
      const button =
        isCta && value?.buttonLabel && value?.buttonUrl
          ? `<a href="${escapeHtml(value.buttonUrl)}" class="insight-callout__btn pill-nav-link btn-primary">${escapeHtml(value.buttonLabel)}</a>`
          : '';
      return `<aside class="insight-callout insight-callout--${value?.style || 'info'}"><p class="insight-callout__title">${title}</p>${text}${button}</aside>`;
    },
    pullQuote: ({
      value,
    }: {
      value?: { quote?: string; attribution?: string };
    }) => {
      const quote = escapeHtml(value?.quote || '');
      const attribution = value?.attribution
        ? `<cite class="insight-pull-quote__attr">${escapeHtml(value.attribution)}</cite>`
        : '';
      return `<blockquote class="insight-pull-quote"><p>${quote}</p>${attribution}</blockquote>`;
    },
    table: ({ value }: { value?: { rows?: { cells?: string[] }[] } }) => {
      const rows = value?.rows ?? [];
      if (!rows.length) return '';

      const [head, ...body] = rows;
      const headCells = head?.cells ?? [];
      const headHtml = headCells.length
        ? `<thead><tr>${headCells.map((cell) => `<th>${escapeHtml(cell)}</th>`).join('')}</tr></thead>`
        : '';
      const bodyHtml = body
        .map((row) => {
          const cells = row.cells ?? [];
          return `<tr>${cells.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`;
        })
        .join('');

      return `<table>${headHtml}<tbody>${bodyHtml}</tbody></table>`;
    },
  },
};

export function portableTextToHtml(blocks: unknown[] | null | undefined): string {
  const prepared = prepareBodyForHtml(blocks);
  if (!prepared.length) return '';

  return toHTML(prepared as never, { components: portableTextComponents });
}
