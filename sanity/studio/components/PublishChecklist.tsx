import { Box, Card, Stack, Text } from '@sanity/ui';
import type { StringInputProps } from 'sanity';
import { useFormValue } from 'sanity';

type Check = { label: string; ok: boolean };

export function PublishChecklist(_props: StringInputProps) {
  const title = useFormValue(['title']) as string | undefined;
  const slug = useFormValue(['slug', 'current']) as string | undefined;
  const description = useFormValue(['description']) as string | undefined;
  const metaTitle = useFormValue(['seo', 'metaTitle']) as string | undefined;
  const metaDescription = useFormValue(['seo', 'metaDescription']) as string | undefined;
  const draft = useFormValue(['draft']) as boolean | undefined;
  const faqs = useFormValue(['faqs']) as unknown[] | undefined;

  const checks: Check[] = [
    { label: 'Title filled', ok: Boolean(title?.trim()) },
    { label: 'Slug set', ok: Boolean(slug?.trim()) },
    { label: 'Deck / excerpt filled', ok: Boolean(description?.trim()) },
    { label: 'SEO title set (or will use article title)', ok: Boolean(metaTitle?.trim() || title?.trim()) },
    {
      label: 'Meta description set (or will use excerpt)',
      ok: Boolean(metaDescription?.trim() || description?.trim()),
    },
    { label: 'FAQs: 3–5 items', ok: (faqs?.length ?? 0) >= 3 && (faqs?.length ?? 0) <= 5 },
    { label: 'Visible on website (Hide from website = off)', ok: draft !== true },
  ];

  const score = checks.filter((c) => c.ok).length;

  return (
    <Card padding={4} radius={2} shadow={1} border>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          Publish checklist ({score}/{checks.length})
        </Text>
        {checks.map((check) => (
          <Box key={check.label}>
            <Text size={1}>
              {check.ok ? '✓' : '○'} {check.label}
            </Text>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
