import { toHTML } from '@portabletext/to-html';

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
    table: ({ value }: { value?: { rows?: string[][] } }) => {
      const rows = value?.rows ?? [];
      if (!rows.length) return '';

      const [head, ...body] = rows;
      const headHtml = head
        ? `<thead><tr>${head.map((cell) => `<th>${cell}</th>`).join('')}</tr></thead>`
        : '';
      const bodyHtml = body
        .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
        .join('');

      return `<table>${headHtml}<tbody>${bodyHtml}</tbody></table>`;
    },
  },
};

export function portableTextToHtml(blocks: unknown[] | null | undefined): string {
  if (!blocks?.length) return '';

  return toHTML(blocks as never, { components: portableTextComponents });
}
