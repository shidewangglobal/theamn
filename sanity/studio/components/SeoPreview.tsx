import { Box, Card, Flex, Stack, Text } from '@sanity/ui';
import type { StringInputProps } from 'sanity';
import { useFormValue } from 'sanity';

const SITE = 'theamn.network';

export function SeoPreview(_props: StringInputProps) {
  const title =
    (useFormValue(['seo', 'metaTitle']) as string | undefined) ||
    (useFormValue(['title']) as string | undefined) ||
    'Page title';
  const description =
    (useFormValue(['seo', 'metaDescription']) as string | undefined) ||
    (useFormValue(['description']) as string | undefined) ||
    'Meta description preview…';
  const slug = (useFormValue(['slug', 'current']) as string | undefined) || 'article-slug';
  const focusKeyphrase = useFormValue(['seo', 'focusKeyphrase']) as string | undefined;

  const titleLen = title.length;
  const descLen = description.length;

  return (
    <Card padding={4} radius={2} shadow={1} tone="transparent" border>
      <Stack space={4}>
        <Text size={1} weight="semibold">
          Google search preview
        </Text>
        <Box>
          <Text size={1} style={{ color: '#1a0dab' }}>
            {title}
          </Text>
          <Text size={0} muted style={{ marginTop: '0.25rem' }}>
            {SITE} › insights › {slug}
          </Text>
          <Text size={1} style={{ color: '#4d5156', marginTop: '0.35rem', lineHeight: 1.5 }}>
            {description}
          </Text>
        </Box>
        <Flex gap={3} wrap="wrap">
          <Text size={0} muted>
            Title: {titleLen}/60 {titleLen > 60 ? '⚠ long' : titleLen >= 30 ? '✓' : '⚠ short'}
          </Text>
          <Text size={0} muted>
            Description: {descLen}/160 {descLen > 160 ? '⚠ long' : descLen >= 120 ? '✓' : '⚠ short'}
          </Text>
          {focusKeyphrase ? (
            <Text size={0} muted>
              Keyphrase: {title.toLowerCase().includes(focusKeyphrase.toLowerCase()) ? '✓ in title' : '⚠ not in title'}
            </Text>
          ) : null}
        </Flex>
      </Stack>
    </Card>
  );
}
