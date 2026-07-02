export interface InsightTitleParts {
  before: string;
  emphasis: string;
  after: string;
}

export function splitInsightTitle(title: string, emphasis?: string): InsightTitleParts | null {
  if (!emphasis) return null;

  const trimmedEmphasis = emphasis.trim();
  const idx = title.indexOf(trimmedEmphasis);
  if (idx === -1) return null;

  return {
    before: title.slice(0, idx),
    emphasis: trimmedEmphasis,
    after: title.slice(idx + trimmedEmphasis.length),
  };
}
